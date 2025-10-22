from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid
from ..schemas.sueldo_schema import Sueldo, SueldoCreate, SueldoUpdate
from ..service.sueldo_service import SueldoService
from ..database import get_db

router = APIRouter(prefix="/sueldos", tags=["Sueldos"])

@router.post("/", response_model=Sueldo, status_code=status.HTTP_201_CREATED)
async def create_sueldo(sueldo: SueldoCreate, db: AsyncSession = Depends(get_db)):
    """Crear un nuevo sueldo para una relación usuario-rol específica"""
    return await SueldoService.create_sueldo(db, sueldo)

@router.get("/", response_model=List[Sueldo])
async def get_all_sueldos(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    activo: Optional[bool] = Query(None, description="Filtrar por estado activo/inactivo"),
    db: AsyncSession = Depends(get_db)
):
    """Obtener todos los sueldos con filtros opcionales"""
    return await SueldoService.get_all_sueldos(db, skip, limit, activo)

@router.get("/usuario/{id_usuario}", response_model=List[Sueldo])
async def get_sueldos_by_usuario(id_usuario: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Obtener todos los sueldos de un usuario específico"""
    return await SueldoService.get_sueldos_by_usuario(db, id_usuario)

@router.get("/usuario/{id_usuario}/rol/{id_rol}", response_model=Sueldo)
async def get_sueldo_by_usuario_rol(
    id_usuario: uuid.UUID, 
    id_rol: uuid.UUID, 
    db: AsyncSession = Depends(get_db)
):
    """Obtener sueldo específico por usuario y rol"""
    sueldo = await SueldoService.get_sueldo_by_usuario_rol(db, id_usuario, id_rol)
    if not sueldo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontró un sueldo para esta combinación usuario-rol"
        )
    return sueldo

@router.get("/{sueldo_id}", response_model=Sueldo)
async def get_sueldo_by_id(sueldo_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Obtener un sueldo por ID"""
    return await SueldoService.get_sueldo_by_id(db, sueldo_id)

@router.put("/{sueldo_id}", response_model=Sueldo)
async def update_sueldo(
    sueldo_id: uuid.UUID,
    sueldo_update: SueldoUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Actualizar un sueldo existente"""
    return await SueldoService.update_sueldo(db, sueldo_id, sueldo_update)

@router.delete("/{sueldo_id}", response_model=dict, status_code=status.HTTP_200_OK)
async def delete_sueldo(sueldo_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Eliminar (desactivar) un sueldo"""
    success = await SueldoService.delete_sueldo(db, sueldo_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar el sueldo"
        )
    return {
        "message": "Sueldo eliminado exitosamente",
        "sueldo_id": str(sueldo_id),
        "activo": False
    }
