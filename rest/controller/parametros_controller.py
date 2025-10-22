from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..schemas.parametro_schema import Parametro
from ..database import get_db

from ..service.parametro_service import ParametroService, get_parametro_service

router = APIRouter(prefix="/parameters", tags=["Parameters"])

@router.post("/", response_model=Parametro, status_code=status.HTTP_201_CREATED)
async def create_parametro(
    parametro: Parametro,
    created_by: str = Query(..., description="Usuario que crea el parámetro"),
    parametro_service: ParametroService = Depends(get_parametro_service)
):
    """
    Crear un nuevo parámetro del sistema.
    """
    try:
        resultado = parametro_service.create_parametro(parametro, created_by)
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
    parametro_service: ParametroService = Depends(get_parametro_service)
):
    """
    Obtener todos los parámetros activos.
    """
    try:
        resultado = parametro_service.get_all_parametros(skip, limit)
        return resultado["parametros"]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener los parámetros: {str(e)}"
        )

@router.get("/{id_parametro}", response_model=Parametro)
async def get_parametro_by_id(
    id_parametro: int,
    parametro_service: ParametroService = Depends(get_parametro_service)
):
    """
    Obtener un parámetro por su ID.
    """
    try:
        resultado = parametro_service.get_parametro_by_id(id_parametro)
        return resultado["parametro"]
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener el parámetro: {str(e)}"
        )

@router.get("/search/nombre/{nombre}", response_model=List[Parametro])
async def get_parametros_by_nombre(
    nombre: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    parametro_service: ParametroService = Depends(get_parametro_service)
):
    """
    Buscar parámetros por nombre (coincidencia parcial).
    """
    try:
        resultado = parametro_service.search_parametros_by_nombre(nombre, skip, limit)
        return resultado["parametros"]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar parámetros: {str(e)}"
        )

@router.get("/tipo/{tipo}", response_model=List[Parametro])
async def get_parametros_by_tipo(
    tipo: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    parametro_service: ParametroService = Depends(get_parametro_service)
):
    """
    Obtener parámetros por tipo.
    """
    try:
        resultado = parametro_service.get_parametros_by_tipo(tipo, skip, limit)
        return resultado["parametros"]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener parámetros por tipo: {str(e)}"
        )

@router.put("/{id_parametro}", response_model=Parametro)
async def update_parametro(
    id_parametro: int, 
    parametro_update: Parametro,
    updated_by: str = Query(..., description="Usuario que actualiza el parámetro"),
    parametro_service: ParametroService = Depends(get_parametro_service)
):
    """
    Actualizar un parámetro por su ID.
    """
    try:
        resultado = parametro_service.update_parametro(id_parametro, parametro_update, updated_by)
        return resultado["parametro"]
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar el parámetro: {str(e)}"
        )

@router.delete("/{id_parametro}", response_model=dict)
async def soft_delete_parametro(
    id_parametro: int,
    deleted_by: str = Query(..., description="Usuario que elimina el parámetro"),
    parametro_service: ParametroService = Depends(get_parametro_service)
):
    """
    Soft delete: marcar parámetro como inactivo.
    """
    try:
        resultado = parametro_service.delete_parametro(id_parametro, deleted_by)
        return resultado
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar el parámetro: {str(e)}"
        )

@router.get("/nombre/{nombre}", response_model=Parametro)
async def get_parametro_by_nombre(
    nombre: str,
    parametro_service: ParametroService = Depends(get_parametro_service)
):
    """
    Obtener un parámetro por su nombre exacto.
    """
    try:
        resultado = parametro_service.get_parametro_by_nombre(nombre)
        return resultado["parametro"]
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener el parámetro por nombre: {str(e)}"
        )