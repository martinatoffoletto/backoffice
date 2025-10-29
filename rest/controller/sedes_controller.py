from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid
from ..schemas.sede_schema import SedeCreate, SedeUpdate, Sede
from ..database import get_async_db
from ..service.sede_service import SedeService

router = APIRouter(prefix="/sedes", tags=["Sedes"])

@router.post("/", response_model=Sede, status_code=status.HTTP_201_CREATED)
async def create_sede(
    sede: SedeCreate,
    db: AsyncSession = Depends(get_async_db)
):
    """Crear una nueva sede"""
    try:
        resultado = await SedeService.create_sede(db, sede)
        return resultado["sede"]
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear la sede: {str(e)}"
        )

@router.get("/", response_model=List[Sede])
async def get_all_sedes(
    skip: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros a retornar"),
    db: AsyncSession = Depends(get_async_db)
):
    """Obtener todas las sedes activas con paginación"""
    try:
        resultado = await SedeService.get_all_sedes(db, skip=skip, limit=limit)
        return resultado["sedes"]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener las sedes: {str(e)}"
        )

@router.get("/{id_sede}", response_model=Sede)
async def get_sede_by_id(
    id_sede: uuid.UUID,
    db: AsyncSession = Depends(get_async_db)
):
    """Obtener sede por ID"""
    try:
        resultado = await SedeService.get_sede_by_id(db, id_sede)
        return resultado["sede"]
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener la sede: {str(e)}"
        )

@router.get("/nombre/{nombre}", response_model=Sede)
async def get_sede_by_nombre(
    nombre: str,
    db: AsyncSession = Depends(get_async_db)
):
    """Obtener sede por nombre"""
    try:
        resultado = await SedeService.get_sede_by_nombre(db, nombre)
        return resultado["sede"]
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener la sede: {str(e)}"
        )

@router.get("/search/nombre", response_model=List[Sede])
async def search_sedes_by_nombre(
    q: str = Query(..., description="Patrón de búsqueda en el nombre"),
    skip: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros a retornar"),
    db: AsyncSession = Depends(get_async_db)
):
    """Buscar sedes por patrón en el nombre"""
    try:
        resultado = await SedeService.search_sedes_by_nombre(db, q, skip, limit)
        return resultado["sedes"]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar sedes: {str(e)}"
        )

@router.get("/search/ubicacion", response_model=List[Sede])
async def search_sedes_by_ubicacion(
    q: str = Query(..., description="Patrón de búsqueda en la ubicación"),
    skip: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros a retornar"),
    db: AsyncSession = Depends(get_async_db)
):
    """Buscar sedes por patrón en la ubicación"""
    try:
        resultado = await SedeService.search_sedes_by_ubicacion(db, q, skip, limit)
        return resultado["sedes"]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar sedes: {str(e)}"
        )

@router.put("/{id_sede}", response_model=Sede)
async def update_sede(
    id_sede: uuid.UUID,
    sede_update: SedeUpdate,
    db: AsyncSession = Depends(get_async_db)
):
    """Actualizar una sede existente"""
    try:
        resultado = await SedeService.update_sede(db, id_sede, sede_update)
        return resultado["sede"]
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar la sede: {str(e)}"
        )

@router.delete("/{id_sede}", status_code=status.HTTP_200_OK)
async def delete_sede(
    id_sede: uuid.UUID,
    db: AsyncSession = Depends(get_async_db)
):
    """Eliminar lógicamente una sede"""
    try:
        resultado = await SedeService.delete_sede(db, id_sede)
        return resultado
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar la sede: {str(e)}"
        )
