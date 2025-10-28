"""
Controlador REST para la gestión de evaluaciones.

Este módulo contiene todos los endpoints REST para la gestión de evaluaciones,
incluyendo operaciones CRUD y consultas especializadas.
"""

from fastapi import APIRouter, HTTPException, status, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from datetime import date
from decimal import Decimal
from ..schemas.evaluacion_schema import (
    Evaluacion, 
    EvaluacionCreate, 
    EvaluacionUpdate, 
    EvaluacionResponse,
    EvaluacionConCronograma,
    EvaluacionEstadisticas,
    TipoEvaluacion
)
from ..service.evaluacion_service import EvaluacionService
from ..database import get_db
import uuid

router = APIRouter(prefix="/evaluaciones", tags=["Evaluaciones"])

# ========== EVALUACIONES ==========

@router.post("/", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def create_evaluacion(evaluacion: EvaluacionCreate, db: AsyncSession = Depends(get_db)):
    """
    Crear una nueva evaluación.
    
    - **id_cronograma**: ID del cronograma al que pertenece
    - **nombre**: Nombre de la evaluación
    - **descripcion**: Descripción detallada de la evaluación (opcional)
    - **fecha**: Fecha programada de la evaluación
    - **hora_inicio**: Hora de inicio de la evaluación
    - **hora_fin**: Hora de finalización de la evaluación
    - **tipo**: Tipo de evaluación (parcial, final, trabajo_practico, otro)
    - **ponderacion**: Ponderación de la evaluación (0-100%)
    - **observaciones**: Observaciones adicionales (opcional)
    """
    evaluacion_response, message = await EvaluacionService.create_evaluacion(db, evaluacion)
    
    if evaluacion_response is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    return {
        "evaluacion": evaluacion_response,
        "message": message
    }

@router.get("/", response_model=List[EvaluacionResponse])
async def get_all_evaluaciones(
    skip: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros a retornar"),
    status_filter: Optional[bool] = Query(None, description="Filtrar por estado (true=activo, false=inactivo)"),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener todas las evaluaciones con filtros opcionales.
    
    - **skip**: Número de registros a omitir (paginación)
    - **limit**: Número máximo de registros a retornar
    - **status_filter**: Filtrar por estado (true=activo, false=inactivo)
    """
    evaluaciones, message = await EvaluacionService.get_all_evaluaciones(db, skip, limit, status_filter)
    return evaluaciones

@router.get("/{id_evaluacion}", response_model=EvaluacionResponse)
async def get_evaluacion_by_id(id_evaluacion: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    Obtener una evaluación por su ID.
    
    - **id_evaluacion**: ID único de la evaluación
    """
    evaluacion, message = await EvaluacionService.get_evaluacion_by_id(db, id_evaluacion)
    
    if evaluacion is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=message
        )
    
    return evaluacion

@router.put("/{id_evaluacion}", response_model=Dict[str, Any])
async def update_evaluacion(
    id_evaluacion: uuid.UUID, 
    evaluacion_update: EvaluacionUpdate, 
    db: AsyncSession = Depends(get_db)
):
    """
    Actualizar una evaluación existente.
    
    - **id_evaluacion**: ID único de la evaluación a actualizar
    - **evaluacion_update**: Datos a actualizar (todos los campos son opcionales)
    """
    evaluacion_response, message = await EvaluacionService.update_evaluacion(db, id_evaluacion, evaluacion_update)
    
    if evaluacion_response is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    return {
        "evaluacion": evaluacion_response,
        "message": message
    }

@router.delete("/{id_evaluacion}", response_model=Dict[str, str])
async def delete_evaluacion(id_evaluacion: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    Eliminar una evaluación (soft delete).
    
    - **id_evaluacion**: ID único de la evaluación a eliminar
    """
    success, message = await EvaluacionService.delete_evaluacion(db, id_evaluacion)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    return {"message": message}

@router.get("/cronograma/{id_cronograma}", response_model=List[EvaluacionResponse])
async def get_evaluaciones_by_cronograma(
    id_cronograma: uuid.UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener evaluaciones por cronograma.
    
    - **id_cronograma**: ID del cronograma
    - **skip**: Número de registros a omitir
    - **limit**: Número máximo de registros a retornar
    """
    evaluaciones, message = await EvaluacionService.get_evaluaciones_by_cronograma(db, id_cronograma, skip, limit)
    return evaluaciones

@router.get("/tipo/{tipo}", response_model=List[EvaluacionResponse])
async def get_evaluaciones_by_tipo(
    tipo: TipoEvaluacion,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener evaluaciones por tipo.
    
    - **tipo**: Tipo de evaluación (parcial, final, trabajo_practico, otro)
    - **skip**: Número de registros a omitir
    - **limit**: Número máximo de registros a retornar
    """
    evaluaciones, message = await EvaluacionService.get_evaluaciones_by_tipo(db, tipo, skip, limit)
    return evaluaciones

@router.get("/fecha/{fecha}", response_model=List[EvaluacionResponse])
async def get_evaluaciones_by_fecha(
    fecha: date,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener evaluaciones por fecha.
    
    - **fecha**: Fecha de las evaluaciones a buscar
    - **skip**: Número de registros a omitir
    - **limit**: Número máximo de registros a retornar
    """
    evaluaciones, message = await EvaluacionService.get_evaluaciones_by_fecha(db, fecha, skip, limit)
    return evaluaciones

@router.get("/fecha-range/", response_model=List[EvaluacionResponse])
async def get_evaluaciones_by_fecha_range(
    fecha_inicio: date = Query(..., description="Fecha de inicio del rango"),
    fecha_fin: date = Query(..., description="Fecha de fin del rango"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener evaluaciones por rango de fechas.
    
    - **fecha_inicio**: Fecha de inicio del rango
    - **fecha_fin**: Fecha de fin del rango
    - **skip**: Número de registros a omitir
    - **limit**: Número máximo de registros a retornar
    """
    evaluaciones, message = await EvaluacionService.get_evaluaciones_by_fecha_range(db, fecha_inicio, fecha_fin, skip, limit)
    return evaluaciones

@router.get("/proximas/", response_model=List[EvaluacionResponse])
async def get_proximas_evaluaciones(
    dias: int = Query(7, ge=1, le=365, description="Número de días hacia adelante"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener evaluaciones próximas en los próximos N días.
    
    - **dias**: Número de días hacia adelante (por defecto: 7)
    - **skip**: Número de registros a omitir
    - **limit**: Número máximo de registros a retornar
    """
    evaluaciones, message = await EvaluacionService.get_proximas_evaluaciones(db, dias, skip, limit)
    return evaluaciones

@router.get("/pasadas/", response_model=List[EvaluacionResponse])
async def get_evaluaciones_pasadas(
    dias: int = Query(30, ge=1, le=365, description="Número de días hacia atrás"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener evaluaciones pasadas en los últimos N días.
    
    - **dias**: Número de días hacia atrás (por defecto: 30)
    - **skip**: Número de registros a omitir
    - **limit**: Número máximo de registros a retornar
    """
    evaluaciones, message = await EvaluacionService.get_evaluaciones_pasadas(db, dias, skip, limit)
    return evaluaciones

@router.get("/search/", response_model=List[EvaluacionResponse])
async def search_evaluaciones(
    q: str = Query(..., min_length=2, description="Término de búsqueda (mínimo 2 caracteres)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Buscar evaluaciones por término de búsqueda.
    
    - **q**: Término de búsqueda (busca en nombre, descripción y observaciones)
    - **skip**: Número de registros a omitir
    - **limit**: Número máximo de registros a retornar
    """
    evaluaciones, message = await EvaluacionService.search_evaluaciones(db, q, skip, limit)
    return evaluaciones

@router.get("/ponderacion-range/", response_model=List[EvaluacionResponse])
async def get_evaluaciones_by_ponderacion_range(
    ponderacion_min: Decimal = Query(..., ge=0, le=100, description="Ponderación mínima"),
    ponderacion_max: Decimal = Query(..., ge=0, le=100, description="Ponderación máxima"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener evaluaciones por rango de ponderación.
    
    - **ponderacion_min**: Ponderación mínima (0-100)
    - **ponderacion_max**: Ponderación máxima (0-100)
    - **skip**: Número de registros a omitir
    - **limit**: Número máximo de registros a retornar
    """
    evaluaciones, message = await EvaluacionService.get_evaluaciones_by_ponderacion_range(db, ponderacion_min, ponderacion_max, skip, limit)
    return evaluaciones

@router.get("/con-cronograma/", response_model=List[EvaluacionConCronograma])
async def get_evaluaciones_with_cronograma_info(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener evaluaciones con información del cronograma.
    
    - **skip**: Número de registros a omitir
    - **limit**: Número máximo de registros a retornar
    """
    evaluaciones, message = await EvaluacionService.get_evaluaciones_with_cronograma_info(db, skip, limit)
    return evaluaciones

@router.get("/stats/", response_model=EvaluacionEstadisticas)
async def get_evaluaciones_statistics(db: AsyncSession = Depends(get_db)):
    """
    Obtener estadísticas de evaluaciones.
    
    Retorna información sobre:
    - Total de evaluaciones
    - Evaluaciones por tipo (parciales, finales, etc.)
    - Evaluaciones activas/inactivas
    - Suma total de ponderaciones
    """
    stats = await EvaluacionService.get_estadisticas(db)
    return stats
