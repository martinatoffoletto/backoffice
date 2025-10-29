from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_async_db
from ..service.usuario_carrera_service import UsuarioCarreraService
from ..schemas.usuario_carrera_schema import UsuarioCarrera, UsuarioCarreraCreate
from typing import List
from uuid import UUID

router = APIRouter(prefix="/usuarios-carreras", tags=["Usuario-Carrera"])

@router.post("/", response_model=UsuarioCarrera, status_code=status.HTTP_201_CREATED)
async def create_usuario_carrera_assignment(
    assignment: UsuarioCarreraCreate,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Asignar una carrera a un usuario.
    """
    try:
        result = await UsuarioCarreraService.create_assignment(db, assignment)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al asignar la carrera: {str(e)}"
        )

@router.delete("/", response_model=dict)
async def remove_usuario_carrera_assignment(
    id_usuario: UUID = Query(..., description="ID del usuario"),
    id_carrera: UUID = Query(..., description="ID de la carrera"),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Remover una carrera de un usuario.
    """
    try:
        success = await UsuarioCarreraService.remove_assignment(db, id_usuario, id_carrera)
        return {
            "message": "Asignaci�n removida exitosamente",
            "success": success
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al remover la asignaci�n: {str(e)}"
        )

@router.get("/usuario/{id_usuario}", response_model=List[UsuarioCarrera])
async def get_carreras_by_usuario(
    id_usuario: UUID,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtener todas las carreras asignadas a un usuario espec�fico.
    Retorna las relaciones usuario-carrera (solo IDs).
    """
    try:
        return await UsuarioCarreraService.get_carreras_by_usuario(db, id_usuario)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener carreras del usuario: {str(e)}"
        )

@router.get("/carrera/{id_carrera}", response_model=List[UsuarioCarrera])
async def get_usuarios_by_carrera(
    id_carrera: UUID,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtener todos los usuarios asignados a una carrera espec�fica.
    Retorna las relaciones usuario-carrera (solo IDs).
    """
    try:
        return await UsuarioCarreraService.get_usuarios_by_carrera(db, id_carrera)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener usuarios de la carrera: {str(e)}"
        )

@router.get("/exists", response_model=dict)
async def check_assignment_exists(
    id_usuario: UUID = Query(..., description="ID del usuario"),
    id_carrera: UUID = Query(..., description="ID de la carrera"),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Verificar si existe una asignaci�n espec�fica usuario-carrera.
    """
    try:
        exists = await UsuarioCarreraService.check_assignment_exists(db, id_usuario, id_carrera)
        return {
            "exists": exists,
            "id_usuario": id_usuario,
            "id_carrera": id_carrera
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al verificar la asignaci�n: {str(e)}"
        )
