from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_async_db
from ..service.rol_service import RolService
from ..schemas.rol_schema import Rol, RolBase, RolUpdate
from typing import List, Optional, Dict, Any
import uuid
from ..security import get_current_user

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.post("/", response_model=Rol, status_code=status.HTTP_201_CREATED)
async def create_rol(
    rol: RolBase,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
):
    """Crear un nuevo rol"""
    created_rol, error_message = await RolService.create_rol(db, rol)
    if not created_rol:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_message or "Error al crear el rol"
        )
    return created_rol

@router.get("/", response_model=List[Rol])
async def get_all_roles(
    param: Optional[str] = Query(None, description="Parámetro de búsqueda opcional: id, categoria, subcategoria"),
    value: Optional[str] = Query(None, description="Valor a buscar cuando se usa 'param'"),
    status_filter: Optional[bool] = Query(None, description="Filtrar por estado: true, false o omitir para ambos"),
    db: AsyncSession = Depends(get_async_db)
):
    if param is not None:
        valid_params = ["id", "categoria", "subcategoria"]
        if param.lower() not in valid_params:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid search parameter: {param}. Valid parameters: {', '.join(valid_params)}"
            )
        if value is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="When 'param' is provided, 'value' must also be provided"
            )
        return await RolService.search_roles(db, param, value, status_filter)

    return await RolService.get_all_roles(db, status_filter)

@router.get("/categories", response_model=List[Dict[str, Any]])
async def get_categories_with_subcategories(
    status_filter: Optional[bool] = Query(None, description="Filtrar categorias por estado del rol"),
    db: AsyncSession = Depends(get_async_db)
):
    """Obtener todas las categorías con sus subcategorías"""
    return await RolService.get_categories_with_subcategories(db, status_filter)


@router.put("/{rol_id}", response_model=Rol)
async def update_rol(
    rol_id: uuid.UUID,
    rol_update: RolUpdate,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
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
async def delete_rol(
    rol_id: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
):
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
