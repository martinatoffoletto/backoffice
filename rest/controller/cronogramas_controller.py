from fastapi import APIRouter, HTTPException, status, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from datetime import date
from ..schemas.cronograma_schema import Cronograma, CronogramaCreate, CronogramaUpdate, CronogramaResponse
from ..service.cronograma_service import CronogramaService
from ..database import get_db

router = APIRouter(prefix="/cronogramas", tags=["Cronogramas"])

# ========== CRONOGRAMAS ==========

@router.post("/", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def create_cronograma(cronograma: CronogramaCreate, db: AsyncSession = Depends(get_db)):
    """
    Crear un nuevo cronograma.
    
    - **course_id**: ID del curso proveniente del módulo CORE
    - **course_name**: Nombre del curso
    - **total_classes**: Cantidad total de clases planificadas
    - **fecha_inicio**: Fecha de inicio del cronograma (opcional)
    - **fecha_fin**: Fecha de fin del cronograma (opcional)
    - **descripcion**: Descripción del cronograma (opcional)
    """
    cronograma_response, message = await CronogramaService.create_cronograma(db, cronograma)
    
    if cronograma_response is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    return {
        "cronograma": cronograma_response,
        "message": message
    }

@router.get("/", response_model=List[CronogramaResponse])
async def get_all_cronogramas(
    skip: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros a retornar"),
    status_filter: Optional[bool] = Query(None, description="Filtrar por estado (true=activo, false=inactivo)"),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener todos los cronogramas con filtros opcionales.
    
    - **skip**: Número de registros a omitir (paginación)
    - **limit**: Número máximo de registros a retornar
    - **status_filter**: Filtrar por estado (true=activo, false=inactivo)
    """
    cronogramas, message = await CronogramaService.get_all_cronogramas(db, skip, limit, status_filter)
    return cronogramas

@router.get("/{id_cronograma}", response_model=CronogramaResponse)
async def get_cronograma_by_id(id_cronograma: int, db: AsyncSession = Depends(get_db)):
    """
    Obtener un cronograma por su ID.
    
    - **id_cronograma**: ID único del cronograma
    """
    cronograma, message = await CronogramaService.get_cronograma_by_id(db, id_cronograma)
    
    if cronograma is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=message
        )
    
    return cronograma

@router.put("/{id_cronograma}", response_model=Dict[str, Any])
async def update_cronograma(
    id_cronograma: int, 
    cronograma_update: CronogramaUpdate, 
    db: AsyncSession = Depends(get_db)
):
    """
    Actualizar un cronograma existente.
    
    - **id_cronograma**: ID único del cronograma a actualizar
    - **cronograma_update**: Datos a actualizar (todos los campos son opcionales)
    """
    cronograma_response, message = await CronogramaService.update_cronograma(db, id_cronograma, cronograma_update)
    
    if cronograma_response is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    return {
        "cronograma": cronograma_response,
        "message": message
    }

@router.delete("/{id_cronograma}", response_model=Dict[str, str])
async def delete_cronograma(id_cronograma: int, db: AsyncSession = Depends(get_db)):
    """
    Eliminar un cronograma (soft delete).
    
    - **id_cronograma**: ID único del cronograma a eliminar
    
    **Nota**: No se puede eliminar un cronograma que tenga clases o evaluaciones asociadas.
    """
    success, message = await CronogramaService.delete_cronograma(db, id_cronograma)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    return {"message": message}

@router.get("/course/{course_id}", response_model=List[CronogramaResponse])
async def get_cronogramas_by_course_id(
    course_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener cronogramas por ID de curso.
    
    - **course_id**: ID del curso
    - **skip**: Número de registros a omitir
    - **limit**: Número máximo de registros a retornar
    """
    cronogramas, message = await CronogramaService.get_cronogramas_by_course_id(db, course_id, skip, limit)
    return cronogramas

@router.get("/search/", response_model=List[CronogramaResponse])
async def search_cronogramas(
    q: str = Query(..., min_length=2, description="Término de búsqueda (mínimo 2 caracteres)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Buscar cronogramas por término de búsqueda.
    
    - **q**: Término de búsqueda (busca en nombre del curso y descripción)
    - **skip**: Número de registros a omitir
    - **limit**: Número máximo de registros a retornar
    """
    cronogramas, message = await CronogramaService.search_cronogramas(db, q, skip, limit)
    return cronogramas

@router.get("/date-range/", response_model=List[CronogramaResponse])
async def get_cronogramas_by_date_range(
    fecha_inicio: date = Query(..., description="Fecha de inicio del rango"),
    fecha_fin: date = Query(..., description="Fecha de fin del rango"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener cronogramas por rango de fechas.
    
    - **fecha_inicio**: Fecha de inicio del rango
    - **fecha_fin**: Fecha de fin del rango
    - **skip**: Número de registros a omitir
    - **limit**: Número máximo de registros a retornar
    """
    cronogramas, message = await CronogramaService.get_cronogramas_by_date_range(db, fecha_inicio, fecha_fin, skip, limit)
    return cronogramas

@router.get("/stats/", response_model=Dict[str, Any])
async def get_cronogramas_statistics(db: AsyncSession = Depends(get_db)):
    """
    Obtener estadísticas de cronogramas.
    
    Retorna información sobre:
    - Total de cronogramas
    - Cronogramas activos/inactivos
    - Cronogramas con/sin clases
    """
    stats = await CronogramaService.get_cronogramas_statistics(db)
    return stats