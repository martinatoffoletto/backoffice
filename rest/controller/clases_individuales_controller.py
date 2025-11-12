from fastapi import APIRouter, HTTPException, status, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import date
import uuid

from ..schemas.clase_individual_schema import (
    ClaseIndividualCreate, 
    ClaseIndividualUpdate, 
    ClaseIndividualResponse,
    ClaseEstadisticas,
    EstadoClase
)
from ..service.clase_individual_service import ClaseIndividualService
from ..database import get_async_db

router = APIRouter(prefix="/clases-individuales", tags=["Clases Individuales"])


@router.post("/", response_model=ClaseIndividualResponse, status_code=status.HTTP_201_CREATED)
async def create_clase(
    clase: ClaseIndividualCreate, 
    db: AsyncSession = Depends(get_async_db)
):
    """
    Crear una nueva clase individual
    """
    try:
        return await ClaseIndividualService.create_clase(db, clase)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear la clase: {str(e)}"
        )


@router.get("/", response_model=List[ClaseIndividualResponse], response_model_exclude_none=True)
async def get_all_clases(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[bool] = Query(None, description="Filtrar por estado activo/inactivo"),
    param: Optional[str] = Query(None, description="Parámetro de búsqueda: id, id_clase, id_curso, tipo, status"),
    value: Optional[str] = Query(None, description="Valor a buscar (para status: true/false)"),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtener todas las clases individuales con filtros opcionales.
    Si se proporcionan 'param' y 'value', realiza una búsqueda específica.
    Si no se proporcionan, devuelve todas las clases con los filtros de paginación y status.
    """
    try:
        # Si se proporcionan param y value, realizar búsqueda
        if param is not None and value is not None:
            valid_params = ["id", "id_clase", "id_curso", "tipo", "status"]
            if param.lower() not in valid_params:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Parámetro de búsqueda inválido: {param}. Parámetros válidos: {', '.join(valid_params)}"
                )
            return await ClaseIndividualService.search_clases(db, param, value, skip, limit, status)
        else:
            # Si no hay parámetros de búsqueda, devolver todas las clases
            return await ClaseIndividualService.get_all_clases(db, skip, limit, status)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener las clases: {str(e)}"
        )


@router.get("/search", response_model=List[ClaseIndividualResponse], response_model_exclude_none=True, deprecated=True)
async def search_clases(
    param: str = Query(..., description="Parámetro de búsqueda: id, id_clase, id_curso, tipo, status"),
    value: str = Query(..., description="Valor a buscar (para status: true/false)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status_filter: Optional[bool] = Query(None, description="Filtrar por estado activo/inactivo"),
    db: AsyncSession = Depends(get_async_db)
):
    """
    [DEPRECATED] Buscar clases individuales por diferentes parámetros.
    Este endpoint está deprecado. Usa GET /clases-individuales/ con los parámetros 'param' y 'value' en su lugar.
    """
    valid_params = ["id", "id_clase", "id_curso", "tipo", "status"]
    if param.lower() not in valid_params:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Parámetro de búsqueda inválido: {param}. Parámetros válidos: {', '.join(valid_params)}"
        )
    
    try:
        clases = await ClaseIndividualService.search_clases(db, param, value, skip, limit, status_filter)
        return clases
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar las clases: {str(e)}"
        )


@router.get("/estadisticas", response_model=ClaseEstadisticas)
async def get_estadisticas(
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtener estadísticas de las clases individuales
    """
    try:
        return await ClaseIndividualService.get_estadisticas(db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener las estadísticas: {str(e)}"
        )


@router.get("/curso/{id_curso}", response_model=List[ClaseIndividualResponse], response_model_exclude_none=True)
async def get_clases_by_curso(
    id_curso: uuid.UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[bool] = Query(None, description="Filtrar por estado activo/inactivo"),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtener clases por curso
    """
    try:
        return await ClaseIndividualService.get_clases_by_curso(db, id_curso, skip, limit, status)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener las clases del curso: {str(e)}"
        )


@router.get("/estado/{estado}", response_model=List[ClaseIndividualResponse], response_model_exclude_none=True)
async def get_clases_by_estado(
    estado: EstadoClase,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[bool] = Query(None, description="Filtrar por estado activo/inactivo"),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtener clases por estado
    """
    try:
        return await ClaseIndividualService.get_clases_by_estado(db, estado, skip, limit, status)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener las clases por estado: {str(e)}"
        )


@router.get("/fecha/{fecha}", response_model=List[ClaseIndividualResponse], response_model_exclude_none=True)
async def get_clases_by_fecha(
    fecha: date,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[bool] = Query(None, description="Filtrar por estado activo/inactivo"),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtener clases por fecha específica
    """
    try:
        return await ClaseIndividualService.get_clases_by_fecha(db, fecha, skip, limit, status)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener las clases por fecha: {str(e)}"
        )


@router.get("/fecha-rango", response_model=List[ClaseIndividualResponse], response_model_exclude_none=True)
async def get_clases_by_fecha_range(
    fecha_inicio: date = Query(..., description="Fecha de inicio del rango"),
    fecha_fin: date = Query(..., description="Fecha de fin del rango"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[bool] = Query(None, description="Filtrar por estado activo/inactivo"),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtener clases por rango de fechas
    """
    try:
        return await ClaseIndividualService.get_clases_by_fecha_range(db, fecha_inicio, fecha_fin, skip, limit, status)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener las clases por rango de fechas: {str(e)}"
        )


@router.get("/{id_clase}", response_model=ClaseIndividualResponse, response_model_exclude_none=True)
async def get_clase_by_id(
    id_clase: uuid.UUID,
    status: Optional[bool] = Query(None, description="Filtrar por estado activo/inactivo"),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtener una clase individual por su ID
    """
    try:
        clase = await ClaseIndividualService.get_clase_by_id(db, id_clase, status)
        if not clase:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró la clase con ID {id_clase}"
            )
        return clase
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener la clase: {str(e)}"
        )


@router.put("/{id_clase}", response_model=ClaseIndividualResponse)
async def update_clase(
    id_clase: uuid.UUID,
    clase_update: ClaseIndividualUpdate,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Actualizar una clase individual
    """
    try:
        clase = await ClaseIndividualService.update_clase(db, id_clase, clase_update)
        if not clase:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró la clase con ID {id_clase}"
            )
        return clase
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar la clase: {str(e)}"
        )


@router.patch("/{id_clase}/estado", response_model=ClaseIndividualResponse)
async def cambiar_estado_clase(
    id_clase: uuid.UUID,
    nuevo_estado: EstadoClase,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Cambiar el estado de una clase individual
    """
    try:
        clase = await ClaseIndividualService.cambiar_estado_clase(db, id_clase, nuevo_estado)
        if not clase:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró la clase con ID {id_clase}"
            )
        return clase
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al cambiar el estado de la clase: {str(e)}"
        )


@router.patch("/{id_clase}/reprogramar", response_model=ClaseIndividualResponse)
async def reprogramar_clase(
    id_clase: uuid.UUID,
    nueva_fecha: date = Query(..., description="Nueva fecha para la clase"),
    observaciones: Optional[str] = Query(None, description="Observaciones sobre la reprogramación"),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Reprogramar una clase individual a una nueva fecha
    """
    try:
        clase = await ClaseIndividualService.reprogramar_clase(db, id_clase, nueva_fecha, observaciones)
        if not clase:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró la clase con ID {id_clase}"
            )
        return clase
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al reprogramar la clase: {str(e)}"
        )


@router.delete("/{id_clase}", response_model=dict)
async def delete_clase(
    id_clase: uuid.UUID,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Eliminación lógica de una clase individual
    """
    try:
        success = await ClaseIndividualService.delete_clase(db, id_clase)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró la clase con ID {id_clase}"
            )
        return {"message": "Clase eliminada exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar la clase: {str(e)}"
        )