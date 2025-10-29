from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid

from ..schemas.espacio_schema import EspacioCreate, EspacioUpdate, Espacio, EspacioConSede, TipoEspacio, EstadoEspacio
from ..database import get_async_db
from ..service.espacio_service import EspacioService

router = APIRouter(prefix="/espacios", tags=["Espacios"])

@router.post("/", response_model=Espacio, status_code=status.HTTP_201_CREATED)
async def create_espacio(
    espacio: EspacioCreate,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Crear un nuevo espacio
    """
    try:
        return await EspacioService.create_espacio(db, espacio)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear el espacio: {str(e)}"
        )

@router.get("/", response_model=List[Espacio])
async def get_all_espacios(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtener todos los espacios activos
    """
    try:
        return await EspacioService.get_all_espacios(db, skip, limit)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener los espacios: {str(e)}"
        )

@router.get("/{id_espacio}", response_model=Espacio)
async def get_espacio_by_id(
    id_espacio: uuid.UUID,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtener un espacio por su ID
    """
    try:
        espacio = await EspacioService.get_espacio_by_id(db, id_espacio)
        if not espacio:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el espacio con ID {id_espacio}"
            )
        return espacio
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener el espacio: {str(e)}"
        )

@router.get("/{id_espacio}/sede", response_model=EspacioConSede)
async def get_espacio_with_sede(
    id_espacio: uuid.UUID,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtener un espacio con información de la sede
    """
    try:
        espacio = await EspacioService.get_espacio_with_sede(db, id_espacio)
        if not espacio:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el espacio con ID {id_espacio}"
            )
        return espacio
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener el espacio con sede: {str(e)}"
        )

@router.get("/sede/{id_sede}", response_model=List[Espacio])
async def get_espacios_by_sede(
    id_sede: uuid.UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtener todos los espacios de una sede específica
    """
    try:
        return await EspacioService.get_espacios_by_sede(db, id_sede, skip, limit)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener espacios por sede: {str(e)}"
        )

@router.get("/tipo/{tipo}", response_model=List[Espacio])
async def get_espacios_by_tipo(
    tipo: TipoEspacio,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtener espacios por tipo
    """
    try:
        return await EspacioService.get_espacios_by_tipo(db, tipo.value, skip, limit)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener espacios por tipo: {str(e)}"
        )

@router.get("/search", response_model=List[Espacio])
async def search_espacios(
    nombre: str = Query(..., description="Patrón de búsqueda en el nombre"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Buscar espacios por nombre
    """
    try:
        return await EspacioService.search_espacios(db, nombre, skip, limit)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar espacios: {str(e)}"
        )

@router.get("/capacidad/{capacidad_minima}", response_model=List[Espacio])
async def get_espacios_by_capacity(
    capacidad_minima: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtener espacios con capacidad mayor o igual a la especificada
    """
    try:
        return await EspacioService.get_espacios_by_capacity(db, capacidad_minima, skip, limit)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener espacios por capacidad: {str(e)}"
        )

@router.get("/filtros", response_model=List[Espacio])
async def filter_espacios(
    id_sede: Optional[uuid.UUID] = Query(None, description="Filtrar por ID de sede"),
    tipo: Optional[TipoEspacio] = Query(None, description="Filtrar por tipo"),
    capacidad_minima: Optional[int] = Query(None, description="Filtrar por capacidad mínima"),
    estado: Optional[EstadoEspacio] = Query(None, description="Filtrar por estado"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Filtrar espacios por múltiples criterios
    """
    try:
        tipo_value = tipo.value if tipo else None
        estado_value = estado.value if estado else None
        
        return await EspacioService.filter_espacios(
            db, id_sede, tipo_value, capacidad_minima, estado_value, skip, limit
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al filtrar espacios: {str(e)}"
        )

@router.get("/tipos/disponibles", response_model=List[str])
async def get_available_tipos(
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtener todos los tipos únicos de espacios
    """
    try:
        return await EspacioService.get_available_tipos(db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener tipos disponibles: {str(e)}"
        )

@router.get("/sede/{id_sede}/count", response_model=int)
async def count_espacios_by_sede(
    id_sede: uuid.UUID,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Contar espacios activos por sede
    """
    try:
        return await EspacioService.count_espacios_by_sede(db, id_sede)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al contar espacios por sede: {str(e)}"
        )

@router.put("/{id_espacio}", response_model=Espacio)
async def update_espacio(
    id_espacio: uuid.UUID,
    espacio_update: EspacioUpdate,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Actualizar un espacio por su ID
    """
    try:
        espacio = await EspacioService.update_espacio(db, id_espacio, espacio_update)
        if not espacio:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el espacio con ID {id_espacio}"
            )
        return espacio
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
            detail=f"Error al actualizar el espacio: {str(e)}"
        )

@router.delete("/{id_espacio}", response_model=dict)
async def soft_delete_espacio(
    id_espacio: uuid.UUID,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Eliminación lógica de un espacio
    """
    try:
        success = await EspacioService.delete_espacio(db, id_espacio)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el espacio con ID {id_espacio}"
            )
        return {"message": "Espacio eliminado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar el espacio: {str(e)}"
        )
