from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..service.carrera_service import CarreraService, get_carrera_service
from ..schemas.carrera_schema import Carrera, CarreraCreate, CarreraUpdate
from typing import List
from uuid import UUID

router = APIRouter(prefix="/carreras", tags=["Carreras"])

@router.post("/", response_model=Carrera, status_code=status.HTTP_201_CREATED)
async def create_carrera(
    carrera: CarreraCreate, 
    created_by: str = Query(..., description="Usuario que crea la carrera"),
    carrera_service: CarreraService = Depends(get_carrera_service)
):
    try:
        result = carrera_service.create_carrera(carrera, created_by)
        return result["carrera"]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.get("/", response_model=List[Carrera])
async def get_all_carreras(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    carrera_service: CarreraService = Depends(get_carrera_service)
):
    try:
        result = carrera_service.get_all_carreras(skip, limit)
        return result["carreras"]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.get("/{id_carrera}", response_model=Carrera)
async def get_carrera_by_id(
    id_carrera: UUID, 
    carrera_service: CarreraService = Depends(get_carrera_service)
):
    try:
        result = carrera_service.get_carrera_by_id(id_carrera)
        return result["carrera"]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.get("/search/nombre/{nombre}", response_model=List[Carrera])
async def search_carreras_by_nombre(
    nombre: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    carrera_service: CarreraService = Depends(get_carrera_service)
):
    try:
        result = carrera_service.search_carreras(nombre, skip, limit)
        return result["carreras"]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.put("/{id_carrera}", response_model=Carrera)
async def update_carrera(
    id_carrera: UUID, 
    carrera_update: CarreraUpdate,
    updated_by: str = Query(..., description="Usuario que actualiza la carrera"),
    carrera_service: CarreraService = Depends(get_carrera_service)
):
    try:
        result = carrera_service.update_carrera(id_carrera, carrera_update, updated_by)
        return result["carrera"]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.delete("/{id_carrera}", response_model=dict)
async def delete_carrera(
    id_carrera: UUID,
    deleted_by: str = Query(..., description="Usuario que elimina la carrera"),
    carrera_service: CarreraService = Depends(get_carrera_service)
):
    try:
        result = carrera_service.delete_carrera(id_carrera, deleted_by)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )
