from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid
from ..schemas.parametro_schema import Parametro, ParametroCreate, ParametroUpdate
from ..database import get_async_db
from ..service.parametro_service import ParametroService

router = APIRouter(prefix="/parametros", tags=["Parametros"])

@router.post("/", response_model=Parametro, status_code=status.HTTP_201_CREATED)
async def create_parametro(
    parametro: ParametroCreate,
    db: AsyncSession = Depends(get_async_db)
):
    """Crear un nuevo parámetro del sistema"""
    try:
        resultado = await ParametroService.create_parametro(db, parametro)
        return resultado["parametro"]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear el parámetro: {str(e)}"
        )

@router.get("/", response_model=List[Parametro])
async def get_all_parametros(
    skip: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros a retornar"),
    status_filter: Optional[bool] = Query(None, description="Filtrar por status (True/False). Si es None, solo muestra activos"),
    db: AsyncSession = Depends(get_async_db)
):
    """Obtener todos los parámetros con filtro opcional por status"""
    try:
        resultado = await ParametroService.get_all_parametros(db, skip, limit, status_filter)
        return resultado["parametros"]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener los parámetros: {str(e)}"
        )

@router.get("/tipos", response_model=List[str])
async def get_all_tipos(db: AsyncSession = Depends(get_async_db)):
    """Obtener todos los tipos de parámetros disponibles"""
    try:
        return await ParametroService.get_all_tipos(db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener los tipos: {str(e)}"
        )

@router.get("/{id_parametro}", response_model=Parametro)
async def get_parametro_by_id(
    id_parametro: uuid.UUID,
    db: AsyncSession = Depends(get_async_db)
):
    """Obtener un parámetro por su ID"""
    try:
        resultado = await ParametroService.get_parametro_by_id(db, id_parametro)
        return resultado["parametro"]
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener el parámetro: {str(e)}"
        )

@router.get("/search", response_model=List[Parametro])
async def search_parametros(
    param: str = Query(..., description="Search parameter: id, nombre, tipo, status"),
    value: str = Query(..., description="Search value"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_async_db)
):
    """Buscar parámetros por diferentes parámetros. Parámetros válidos: id, nombre, tipo, status"""
    valid_params = [
        "id", "id_parametro", "nombre", "search", "tipo", "status"
    ]
    if param.lower() not in valid_params:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid search parameter: {param}. Valid parameters: {', '.join(valid_params)}"
        )
    
    try:
        return await ParametroService.search(db, param, value, skip, limit)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar parámetros: {str(e)}"
        )

@router.put("/{id_parametro}", response_model=Parametro)
async def update_parametro(
    id_parametro: uuid.UUID,
    parametro_update: ParametroUpdate,
    db: AsyncSession = Depends(get_async_db)
):
    """Actualizar un parámetro por su ID"""
    try:
        resultado = await ParametroService.update_parametro(db, id_parametro, parametro_update)
        return resultado["parametro"]
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar el parámetro: {str(e)}"
        )

@router.delete("/{id_parametro}", status_code=status.HTTP_200_OK)
async def delete_parametro(
    id_parametro: uuid.UUID,
    db: AsyncSession = Depends(get_async_db)
):
    """Eliminación lógica de un parámetro"""
    try:
        resultado = await ParametroService.delete_parametro(db, id_parametro)
        return resultado
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar el parámetro: {str(e)}"
        )