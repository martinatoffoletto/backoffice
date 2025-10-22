from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..service.rol_service import RolService
from ..schemas.rol_schema import Rol, RolCreate, RolUpdate
from typing import List, Optional, Dict, Any
import uuid

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.post("/", response_model=Rol, status_code=status.HTTP_201_CREATED)
async def create_rol(rol: RolCreate, db: Session = Depends(get_db)):
    """Crear un nuevo rol"""
    created_rol = RolService.create_rol(db, rol)
    return created_rol

@router.get("/", response_model=List[Rol])
async def get_all_roles(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Obtener todos los roles activos"""
    return RolService.get_all_roles(db, skip, limit)

@router.get("/categories", response_model=List[str])
async def get_all_categories(db: Session = Depends(get_db)):
    """Obtener todas las categorías de roles disponibles"""
    return RolService.get_all_categories(db)

@router.get("/categories/in-use", response_model=List[Dict[str, Any]])
async def get_categories_in_use(db: Session = Depends(get_db)):
    """Obtener las categorías que están siendo utilizadas"""
    return RolService.get_categories_in_use(db)

@router.get("/by-category/{categoria}", response_model=List[Rol])
async def get_roles_by_category(
    categoria: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Obtener roles por categoría"""
    return RolService.get_roles_by_category(db, categoria, skip, limit)

@router.get("/search", response_model=List[Rol])
async def search_roles(
    param: str = Query(..., description="Search parameter: id, nombre, categoria"),
    value: str = Query(..., description="Search value"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Buscar roles por diferentes parámetros"""
    valid_params = ["id", "nombre", "categoria"]
    if param.lower() not in valid_params:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid search parameter: {param}. Valid parameters: {', '.join(valid_params)}"
        )
    return RolService.search_roles(db, param, value, skip, limit)

@router.get("/{rol_id}", response_model=Rol)
async def get_rol_by_id(rol_id: uuid.UUID, db: Session = Depends(get_db)):
    """Obtener un rol por ID"""
    return RolService.get_rol_by_id(db, rol_id)

@router.put("/{rol_id}", response_model=Rol)
async def update_rol(
    rol_id: uuid.UUID,
    rol_update: RolUpdate,
    db: Session = Depends(get_db)
):
    """Actualizar un rol existente"""
    updated_rol = RolService.update_rol(db, rol_id, rol_update)
    return updated_rol

@router.delete("/{rol_id}", response_model=dict, status_code=status.HTTP_200_OK)
async def delete_rol(rol_id: uuid.UUID, db: Session = Depends(get_db)):
    """Eliminar (desactivar) un rol"""
    success = RolService.delete_rol(db, rol_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found"
        )
    return {
        "message": "Role deleted successfully",
        "rol_id": rol_id,
        "status": False
    }
