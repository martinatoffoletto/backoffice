from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid
from ..schemas.sueldo_schema import Sueldo, SueldoBase, SueldoUpdate
from ..service.sueldo_service import SueldoService
from ..database import get_async_db

router = APIRouter(prefix="/sueldos", tags=["Sueldos"])

@router.post("/", response_model=Sueldo, status_code=status.HTTP_201_CREATED)
async def create_sueldo(sueldo: SueldoBase, db: AsyncSession = Depends(get_async_db)):
    """Crear un nuevo sueldo para un usuario"""
    # Verificar si se puede crear el sueldo
    can_create, error_message = await SueldoService.can_create_sueldo(db, sueldo)
    if not can_create:
        if "no encontrado" in error_message.lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=error_message
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_message
            )
    
    created_sueldo = await SueldoService.create_sueldo(db, sueldo)
    if not created_sueldo:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al crear el sueldo"
        )
    return created_sueldo

@router.get("/", response_model=List[Sueldo])
async def get_all_sueldos(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[bool] = Query(None, description="Filtrar por estado activo/inactivo"),
    db: AsyncSession = Depends(get_async_db)
):
    """Obtener todos los sueldos con filtros opcionales"""
    return await SueldoService.get_all_sueldos(db, skip, limit, status)

@router.get("/search", response_model=List[Sueldo])
async def search_sueldos(
    param: str = Query(..., description="Parámetro de búsqueda: id, id_sueldo, id_usuario"),
    value: str = Query(..., description="Valor a buscar"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_async_db)
):
    """Buscar sueldos por diferentes parámetros"""
    valid_params = ["id", "id_sueldo", "id_usuario"]
    if param.lower() not in valid_params:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Parámetro de búsqueda inválido: {param}. Parámetros válidos: {', '.join(valid_params)}"
        )
    
    sueldos = await SueldoService.search_sueldos(db, param, value, skip, limit)
    return sueldos

@router.get("/usuario/{id_usuario}", response_model=List[Sueldo])
async def get_sueldos_by_usuario(id_usuario: uuid.UUID, db: AsyncSession = Depends(get_async_db)):
    """Obtener todos los sueldos de un usuario específico"""
    sueldos = await SueldoService.get_sueldos_by_usuario(db, id_usuario)
    if sueldos is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    return sueldos

@router.get("/{sueldo_id}", response_model=Sueldo)
async def get_sueldo_by_id(sueldo_id: uuid.UUID, db: AsyncSession = Depends(get_async_db)):
    """Obtener un sueldo por ID"""
    sueldo = await SueldoService.get_sueldo_by_id(db, sueldo_id)
    if not sueldo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sueldo no encontrado"
        )
    return sueldo

@router.put("/{sueldo_id}", response_model=Sueldo)
async def update_sueldo(
    sueldo_id: uuid.UUID,
    sueldo_update: SueldoUpdate,
    db: AsyncSession = Depends(get_async_db)
):
    """Actualizar un sueldo existente"""
    updated_sueldo = await SueldoService.update_sueldo(db, sueldo_id, sueldo_update)
    if not updated_sueldo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sueldo no encontrado"
        )
    return updated_sueldo

@router.delete("/{sueldo_id}", response_model=dict, status_code=status.HTTP_200_OK)
async def delete_sueldo(sueldo_id: uuid.UUID, db: AsyncSession = Depends(get_async_db)):
    """Eliminar (desactivar) un sueldo"""
    success = await SueldoService.delete_sueldo(db, sueldo_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sueldo no encontrado"
        )
    return {
        "message": "Sueldo eliminado exitosamente",
        "sueldo_id": str(sueldo_id),
        "status": False
    }
