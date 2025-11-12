from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid

from ..schemas.espacio_schema import EspacioCreate, EspacioUpdate, Espacio, EspacioConSede, ComedorInfo
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
    status_filter: Optional[bool] = Query(None, description="Filtrar por status (True=activos, False=inactivos, None=todos)"),
    param: Optional[str] = Query(None, description="Parámetro de búsqueda. Valores válidos: id, id_espacio, nombre, tipo, estado, estado_espacio, sede, id_sede, capacidad, status"),
    value: Optional[str] = Query(None, description="Valor a buscar para el parámetro indicado"),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtener todos los espacios con filtro opcional por status o realizar búsquedas
    """
    try:
        if param:
            if not value:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="El parámetro 'value' es obligatorio cuando se envía 'param'."
                )
            valid_params = [
                "id", "id_espacio", "nombre", "tipo",
                "estado", "estado_espacio", "sede", "id_sede",
                "capacidad", "status"
            ]
            if param.lower() not in valid_params:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid search parameter: {param}. Valid parameters: {', '.join(valid_params)}"
                )
            return await EspacioService.search(db, param, value, skip, limit)
        return await EspacioService.get_all_espacios(db, skip, limit, status_filter)
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

@router.get("/sede/{id_sede}/comedores", response_model=List[ComedorInfo])
async def get_comedores_by_sede(
    id_sede: uuid.UUID,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtener lista de comedores de una sede con sus nombres y capacidades
    """
    try:
        return await EspacioService.get_comedores_by_sede(db, id_sede)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener comedores por sede: {str(e)}"
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

@router.patch("/{id_espacio}", response_model=Espacio)
async def partial_update_espacio(
    id_espacio: uuid.UUID,
    espacio_update: EspacioUpdate,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Actualizar parcialmente un espacio por su ID
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
