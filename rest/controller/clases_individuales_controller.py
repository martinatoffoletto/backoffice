"""
Controlador REST para la gestión de clases individuales.

Este módulo contiene todos los endpoints REST para la gestión de clases individuales,
incluyendo operaciones CRUD y consultas especializadas.
"""

from fastapi import APIRouter, HTTPException, status, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from datetime import date
from ..schemas.clase_individual_schema import (
    ClaseIndividual, 
    ClaseIndividualCreate, 
    ClaseIndividualUpdate, 
    ClaseIndividualResponse,
    ClaseConCronograma,
    ClaseEstadisticas,
    EstadoClase
)
from ..service.clase_individual_service import ClaseIndividualService
from ..database import get_db
import uuid

router = APIRouter(prefix="/clases-individuales", tags=["Clases Individuales"])

# ========== CLASES INDIVIDUALES ==========

@router.post("/", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def create_clase(clase: ClaseIndividualCreate, db: AsyncSession = Depends(get_db)):
    """
    Crear una nueva clase individual.
    
    - **id_cronograma**: ID del cronograma al que pertenece
    - **titulo**: Título del tema de la clase
    - **descripcion**: Descripción detallada de la clase (opcional)
    - **fecha_clase**: Fecha programada de la clase
    - **hora_inicio**: Hora de inicio de la clase
    - **hora_fin**: Hora de finalización de la clase
    - **estado**: Estado inicial de la clase (por defecto: programada)
    - **observaciones**: Observaciones adicionales (opcional)
    """
    clase_response, message = await ClaseIndividualService.create_clase(db, clase)
    
    if clase_response is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    return {
        "clase": clase_response,
        "message": message
    }

@router.get("/", response_model=List[ClaseIndividualResponse])
async def get_all_clases(
    skip: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros a retornar"),
    status_filter: Optional[bool] = Query(None, description="Filtrar por estado (true=activo, false=inactivo)"),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener todas las clases individuales con filtros opcionales.
    
    - **skip**: Número de registros a omitir (paginación)
    - **limit**: Número máximo de registros a retornar
    - **status_filter**: Filtrar por estado (true=activo, false=inactivo)
    """
    clases, message = await ClaseIndividualService.get_all_clases(db, skip, limit, status_filter)
    return clases

@router.get("/{id_clase}", response_model=ClaseIndividualResponse)
async def get_clase_by_id(id_clase: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    Obtener una clase individual por su ID.
    
    - **id_clase**: ID único de la clase
    """
    clase, message = await ClaseIndividualService.get_clase_by_id(db, id_clase)
    
    if clase is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=message
        )
    
    return clase

@router.put("/{id_clase}", response_model=Dict[str, Any])
async def update_clase(
    id_clase: uuid.UUID, 
    clase_update: ClaseIndividualUpdate, 
    db: AsyncSession = Depends(get_db)
):
    """
    Actualizar una clase individual existente.
    
    - **id_clase**: ID único de la clase a actualizar
    - **clase_update**: Datos a actualizar (todos los campos son opcionales)
    """
    clase_response, message = await ClaseIndividualService.update_clase(db, id_clase, clase_update)
    
    if clase_response is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    return {
        "clase": clase_response,
        "message": message
    }

@router.delete("/{id_clase}", response_model=Dict[str, str])
async def delete_clase(id_clase: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    Eliminar una clase individual (soft delete).
    
    - **id_clase**: ID único de la clase a eliminar
    
    **Nota**: No se puede eliminar una clase que ya fue dictada.
    """
    success, message = await ClaseIndividualService.delete_clase(db, id_clase)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    return {"message": message}

@router.get("/cronograma/{id_cronograma}", response_model=List[ClaseIndividualResponse])
async def get_clases_by_cronograma(
    id_cronograma: uuid.UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener clases por cronograma.
    
    - **id_cronograma**: ID del cronograma
    - **skip**: Número de registros a omitir
    - **limit**: Número máximo de registros a retornar
    """
    clases, message = await ClaseIndividualService.get_clases_by_cronograma(db, id_cronograma, skip, limit)
    return clases

@router.get("/estado/{estado}", response_model=List[ClaseIndividualResponse])
async def get_clases_by_estado(
    estado: EstadoClase,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener clases por estado.
    
    - **estado**: Estado de la clase (programada, dictada, reprogramada, cancelada)
    - **skip**: Número de registros a omitir
    - **limit**: Número máximo de registros a retornar
    """
    clases, message = await ClaseIndividualService.get_clases_by_estado(db, estado, skip, limit)
    return clases

@router.get("/fecha/{fecha_clase}", response_model=List[ClaseIndividualResponse])
async def get_clases_by_fecha(
    fecha_clase: date,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener clases por fecha.
    
    - **fecha_clase**: Fecha de las clases a buscar
    - **skip**: Número de registros a omitir
    - **limit**: Número máximo de registros a retornar
    """
    clases, message = await ClaseIndividualService.get_clases_by_fecha(db, fecha_clase, skip, limit)
    return clases

@router.get("/fecha-range/", response_model=List[ClaseIndividualResponse])
async def get_clases_by_fecha_range(
    fecha_inicio: date = Query(..., description="Fecha de inicio del rango"),
    fecha_fin: date = Query(..., description="Fecha de fin del rango"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener clases por rango de fechas.
    
    - **fecha_inicio**: Fecha de inicio del rango
    - **fecha_fin**: Fecha de fin del rango
    - **skip**: Número de registros a omitir
    - **limit**: Número máximo de registros a retornar
    """
    clases, message = await ClaseIndividualService.get_clases_by_fecha_range(db, fecha_inicio, fecha_fin, skip, limit)
    return clases

@router.get("/proximas/", response_model=List[ClaseIndividualResponse])
async def get_proximas_clases(
    dias: int = Query(7, ge=1, le=365, description="Número de días hacia adelante"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener clases próximas en los próximos N días.
    
    - **dias**: Número de días hacia adelante (por defecto: 7)
    - **skip**: Número de registros a omitir
    - **limit**: Número máximo de registros a retornar
    """
    clases, message = await ClaseIndividualService.get_proximas_clases(db, dias, skip, limit)
    return clases

@router.get("/pasadas/", response_model=List[ClaseIndividualResponse])
async def get_clases_pasadas(
    dias: int = Query(30, ge=1, le=365, description="Número de días hacia atrás"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener clases pasadas en los últimos N días.
    
    - **dias**: Número de días hacia atrás (por defecto: 30)
    - **skip**: Número de registros a omitir
    - **limit**: Número máximo de registros a retornar
    """
    clases, message = await ClaseIndividualService.get_clases_pasadas(db, dias, skip, limit)
    return clases

@router.get("/search/", response_model=List[ClaseIndividualResponse])
async def search_clases(
    q: str = Query(..., min_length=2, description="Término de búsqueda (mínimo 2 caracteres)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Buscar clases por término de búsqueda.
    
    - **q**: Término de búsqueda (busca en título, descripción y observaciones)
    - **skip**: Número de registros a omitir
    - **limit**: Número máximo de registros a retornar
    """
    clases, message = await ClaseIndividualService.search_clases(db, q, skip, limit)
    return clases

@router.get("/con-cronograma/", response_model=List[ClaseConCronograma])
async def get_clases_with_cronograma_info(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener clases con información del cronograma.
    
    - **skip**: Número de registros a omitir
    - **limit**: Número máximo de registros a retornar
    """
    clases, message = await ClaseIndividualService.get_clases_with_cronograma_info(db, skip, limit)
    return clases

@router.get("/stats/", response_model=ClaseEstadisticas)
async def get_clases_statistics(db: AsyncSession = Depends(get_db)):
    """
    Obtener estadísticas de clases.
    
    Retorna información sobre:
    - Total de clases
    - Clases por estado (programadas, dictadas, etc.)
    - Clases activas/inactivas
    """
    stats = await ClaseIndividualService.get_estadisticas(db)
    return stats
