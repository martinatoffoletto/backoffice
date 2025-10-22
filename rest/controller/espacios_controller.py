from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..schemas.espacio_schema import Espacio, EspacioConSede
from ..database import get_db
from ..service.espacio_service import EspacioService, get_espacio_service

router = APIRouter(prefix="/spaces", tags=["Spaces"])

@router.post("/", response_model=Espacio, status_code=status.HTTP_201_CREATED)
async def create_espacio(
    espacio: Espacio,
    created_by: str = Query(..., description="Usuario que crea el espacio"),
    espacio_service: EspacioService = Depends(get_espacio_service)
):
    """
    Crear un nuevo espacio (aula, laboratorio, etc.)
    """
    try:
        resultado = espacio_service.create_espacio(espacio, created_by)
        return resultado["espacio"]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear el espacio: {str(e)}"
        )

@router.get("/", response_model=List[Espacio])
async def get_all_espacios(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    espacio_service: EspacioService = Depends(get_espacio_service)
):
    """
    Obtener todos los espacios activos con paginación.
    """
    try:
        resultado = espacio_service.get_all_espacios(skip, limit)
        return resultado["espacios"]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener los espacios: {str(e)}"
        )

@router.get("/{id_espacio}", response_model=Espacio)
async def get_espacio_by_id(
    id_espacio: int,
    espacio_service: EspacioService = Depends(get_espacio_service)
):
    """
    Obtener un espacio por su ID.
    """
    try:
        resultado = espacio_service.get_espacio_by_id(id_espacio, include_sede=False)
        return resultado["espacio"]
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener el espacio: {str(e)}"
        )

@router.get("/{id_espacio}/sede", response_model=EspacioConSede)
async def get_espacio_with_sede(
    id_espacio: int,
    espacio_service: EspacioService = Depends(get_espacio_service)
):
    """
    Obtener un espacio por su ID, incluyendo la info de la sede.
    """
    try:
        return espacio_service.get_espacio_by_id(id_espacio, include_sede=True)
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener el espacio con sede: {str(e)}"
        )

@router.get("/sede/{id_sede}", response_model=List[Espacio])
async def get_espacios_by_sede(
    id_sede: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    espacio_service: EspacioService = Depends(get_espacio_service)
):
    """
    Obtener todos los espacios de una sede específica.
    """
    try:
        resultado = espacio_service.get_espacios_by_sede(id_sede, skip, limit)
        return resultado["espacios"]
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener espacios por sede: {str(e)}"
        )

@router.get("/search/disponibles", response_model=List[Espacio])
async def search_espacios_disponibles(
    id_sede: Optional[int] = Query(None, description="Filtrar por ID de sede"),
    tipo_espacio: Optional[str] = Query(None, description="Filtrar por tipo (ej: aula, laboratorio)"),
    capacidad_minima: Optional[int] = Query(None, description="Filtrar por capacidad mínima"),
    necesita_proyector: Optional[bool] = Query(None, description="¿Requiere proyector?"),
    necesita_sonido: Optional[bool] = Query(None, description="¿Requiere sonido?"),
    necesita_internet: Optional[bool] = Query(None, description="¿Requiere internet?"),
    necesita_aire: Optional[bool] = Query(None, description="¿Requiere aire acondicionado?"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    espacio_service: EspacioService = Depends(get_espacio_service)
):
    """
    Búsqueda avanzada de espacios por múltiples filtros.
    """
    try:
        resultado = espacio_service.search_espacios_disponibles(
            id_sede, tipo_espacio, capacidad_minima,
            necesita_proyector, necesita_sonido, necesita_internet, necesita_aire,
            skip, limit
        )
        return resultado["espacios"]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar espacios: {str(e)}"
        )


@router.put("/{id_espacio}", response_model=Espacio)
async def update_espacio(
    id_espacio: int, 
    espacio_update: Espacio,
    updated_by: str = Query(..., description="Usuario que actualiza el espacio"),
    espacio_service: EspacioService = Depends(get_espacio_service)
):
    """
    Actualizar un espacio por su ID.
    """
    try:
        resultado = espacio_service.update_espacio(id_espacio, espacio_update, updated_by)
        return resultado["espacio"]
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar el espacio: {str(e)}"
        )

@router.delete("/{id_espacio}", response_model=dict)
async def soft_delete_espacio(
    id_espacio: int,
    deleted_by: str = Query(..., description="Usuario que elimina el espacio"),
    espacio_service: EspacioService = Depends(get_espacio_service)
):
    """
    Soft delete: marcar espacio como inactivo.
    """
    try:
        return espacio_service.delete_espacio(id_espacio, deleted_by)
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar el espacio: {str(e)}"
        )