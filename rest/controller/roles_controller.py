from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..service.rol_service import RolService
from ..schemas.rol_schema import Rol
from typing import List, Optional

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_rol(
    rol: Rol, 
    created_by: str = Query(..., description="Usuario que crea el rol"),
    db: Session = Depends(get_db)
):
    """
    Crear un nuevo rol.
    """
    try:
        rol_service = RolService(db)
        result = rol_service.create_rol(rol, created_by)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.get("/")
async def get_all_roles(
    skip: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros a retornar"),
    db: Session = Depends(get_db)
):
    """
    Obtener todos los roles activos.
    """
    try:
        rol_service = RolService(db)
        result = rol_service.get_all_roles(skip, limit)
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.get("/{id_rol}")
async def get_rol_by_id(id_rol: int, db: Session = Depends(get_db)):
    """
    Obtener un rol por su ID.
    """
    try:
        rol_service = RolService(db)
        result = rol_service.get_rol_by_id(id_rol)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.get("/search/")
async def search_roles(
    nombre: str = Query(..., description="Patrón de búsqueda en el nombre del rol"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """
    Buscar roles por nombre (coincidencia parcial).
    """
    try:
        rol_service = RolService(db)
        result = rol_service.search_roles(nombre, skip, limit)
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.put("/{id_rol}")
async def update_rol(
    id_rol: int, 
    rol_update: Rol,
    updated_by: str = Query(..., description="Usuario que actualiza el rol"),
    db: Session = Depends(get_db)
):
    """
    Actualizar un rol por su ID.
    """
    try:
        rol_service = RolService(db)
        result = rol_service.update_rol(id_rol, rol_update, updated_by)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.delete("/{id_rol}")
async def delete_rol(
    id_rol: int,
    deleted_by: str = Query(..., description="Usuario que elimina el rol"),
    db: Session = Depends(get_db)
):
    """
    Soft delete: marcar rol como inactivo.
    """
    try:
        rol_service = RolService(db)
        result = rol_service.delete_rol(id_rol, deleted_by)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )
