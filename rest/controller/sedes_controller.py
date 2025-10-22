from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..schemas.sede_schema import Sede
from ..database import get_db
from ..service.sede_service import SedeService, get_sede_service

router = APIRouter(prefix="/sedes", tags=["Sedes"])

@router.post("/", response_model=Sede, status_code=status.HTTP_201_CREATED)
async def create_sede(
    sede: Sede, 
    created_by: str = Query(..., description="Usuario que crea la sede"),
    sede_service: SedeService = Depends(get_sede_service)
):
    """
    Crear una nueva sede.
    """
    try:
        resultado = sede_service.create_sede(sede, created_by)
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
    sede_service: SedeService = Depends(get_sede_service)
):
    """
    Obtener todas las sedes activas con paginación.
    """
    try:
        resultado = sede_service.get_all_sedes(skip=skip, limit=limit)
        return resultado["sedes"]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener las sedes: {str(e)}"
        )

@router.get("/{id_sede}", response_model=Sede)
async def get_sede_by_id(
    id_sede: int, 
    sede_service: SedeService = Depends(get_sede_service)
):
    """
    Obtener una sede por su ID.
    """
    try:
        
        resultado = sede_service.get_sede_by_id(id_sede)
        return resultado["sede"]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener la sede: {str(e)}"
        )

@router.get("/search/nombre/{nombre}", response_model=List[Sede])
async def get_sedes_by_name(
    nombre: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    sede_service: SedeService = Depends(get_sede_service)
):
    """
    Buscar sedes por nombre (coincidencia parcial).
    """
    try:
        
        resultado = sede_service.search_sedes(
            search_term=nombre, 
            search_type="nombre", 
            skip=skip, 
            limit=limit
        )
        return resultado["sedes"]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar sedes: {str(e)}"
        )

@router.get("/search/ubicacion/{ubicacion}", response_model=List[Sede])
async def get_sedes_by_ubicacion(
    ubicacion: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    sede_service: SedeService = Depends(get_sede_service)
):
    """
    Buscar sedes por ubicación (coincidencia parcial).
    """
    try:
        resultado = sede_service.search_sedes(
            search_term=ubicacion, 
            search_type="direccion", 
            skip=skip, 
            limit=limit
        )
        return resultado["sedes"]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar sedes por ubicación: {str(e)}"
        )

@router.put("/{id_sede}", response_model=Sede)
async def update_sede(
    id_sede: int, 
    sede_update: Sede,
    updated_by: str = Query(..., description="Usuario que actualiza la sede"),
    sede_service: SedeService = Depends(get_sede_service)
):
    """
    Actualizar una sede por su ID.
    """
    try:
        resultado = sede_service.update_sede(id_sede, sede_update, updated_by)
        return resultado["sede"]
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar la sede: {str(e)}"
        )

@router.delete("/{id_sede}", response_model=dict)
async def soft_delete_sede(
    id_sede: int,
    deleted_by: str = Query(..., description="Usuario que elimina la sede"),
    sede_service: SedeService = Depends(get_sede_service)
):
    """
    Soft delete: marcar sede como inactiva.
    """
    try:
        resultado = sede_service.delete_sede(id_sede, deleted_by)
        return resultado
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar la sede: {str(e)}"
        )