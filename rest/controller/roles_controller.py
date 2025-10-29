from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_async_db
from ..service.rol_service import RolService
from ..schemas.rol_schema import Rol, RolBase, RolUpdate
from typing import List, Optional, Dict, Any
import uuid

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.post("/", response_model=Rol, status_code=status.HTTP_201_CREATED)
async def create_rol(rol: RolBase, db: AsyncSession = Depends(get_async_db)):
    """Crear un nuevo rol"""
    created_rol, error_message = await RolService.create_rol(db, rol)
    if not created_rol:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_message or "Error al crear el rol"
        )
    return created_rol

@router.get("/categories", response_model=List[Dict[str, Any]])
async def get_categories_with_subcategories(db: AsyncSession = Depends(get_async_db)):
    """Obtener todas las categorías con sus subcategorías"""
    return await RolService.get_categories_with_subcategories(db)

@router.get("/search", response_model=List[Rol])
async def search_roles(
    param: str = Query(..., description="Search parameter: id, categoria, subcategoria"),
    value: str = Query(..., description="Search value"),
    db: AsyncSession = Depends(get_async_db)
):
    """Buscar roles por ID, categoría o subcategoría"""
    valid_params = ["id", "categoria", "subcategoria"]
    if param.lower() not in valid_params:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid search parameter: {param}. Valid parameters: {', '.join(valid_params)}"
        )
    return await RolService.search_roles(db, param, value)

@router.put("/{rol_id}", response_model=Rol)
async def update_rol(
    rol_id: uuid.UUID,
    rol_update: RolUpdate,
    db: AsyncSession = Depends(get_async_db)
):
    """Actualizar un rol existente"""
    updated_rol, error_message = await RolService.update_rol(db, rol_id, rol_update)
    if not updated_rol:
        if error_message == "Rol no encontrado":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=error_message
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_message or "Error al actualizar el rol"
            )
    return updated_rol

@router.delete("/{rol_id}", response_model=dict, status_code=status.HTTP_200_OK)
async def delete_rol(rol_id: uuid.UUID, db: AsyncSession = Depends(get_async_db)):
    """Eliminar (desactivar) un rol"""
    success, error_message = await RolService.delete_rol(db, rol_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=error_message or "Rol no encontrado"
        )
    return {
        "message": "Role deleted successfully",
        "rol_id": str(rol_id),
        "status": False
    }
