from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..service.usuario_carrera_service import UsuarioCarreraService, get_usuario_carrera_service
from ..schemas.usuario_carrera_schema import UsuarioCarrera
from ..schemas.carrera_schema import Carrera
from ..schemas.usuario_schema import Usuario
from typing import List
from uuid import UUID

router = APIRouter(prefix="/user-carreras", tags=["User Carreras"])

@router.post("/", response_model=UsuarioCarrera, status_code=status.HTTP_201_CREATED)
async def assign_carrera_to_usuario(
    assignment: UsuarioCarrera,
    assigned_by: str = Query(..., description="Usuario que realiza la asignación"),
    service: UsuarioCarreraService = Depends(get_usuario_carrera_service)
):
    """
    Asignar una carrera a un usuario.
    """
    try:
        result = service.assign_carrera(assignment.id_usuario, assignment.id_carrera, assigned_by)
        return result["assignment"]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al asignar la carrera: {str(e)}"
        )

@router.delete("/", response_model=dict)
async def remove_carrera_from_usuario(
    id_usuario: UUID = Query(..., description="ID del usuario"),
    id_carrera: UUID = Query(..., description="ID de la carrera"),
    removed_by: str = Query(..., description="Usuario que remueve la asignación"),
    service: UsuarioCarreraService = Depends(get_usuario_carrera_service)
):
    """
    Remover una carrera de un usuario.
    """
    try:
        result = service.remove_carrera(id_usuario, id_carrera, removed_by)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al remover la carrera: {str(e)}"
        )

@router.get("/usuario/{id_usuario}", response_model=List[Carrera])
async def get_carreras_by_usuario(
    id_usuario: UUID,
    service: UsuarioCarreraService = Depends(get_usuario_carrera_service)
):
    """
    Obtener todas las carreras de un usuario específico.
    """
    try:
        return service.get_carreras_for_usuario(id_usuario)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener carreras del usuario: {str(e)}"
        )

@router.get("/carrera/{id_carrera}", response_model=List[Usuario])
async def get_usuarios_by_carrera(
    id_carrera: UUID,
    service: UsuarioCarreraService = Depends(get_usuario_carrera_service)
):
    """
    Obtener todos los usuarios de una carrera específica.
    (Nota: El schema 'Usuario' debe ser compatible con UUID)
    """
    try:
        return service.get_usuarios_for_carrera(id_carrera)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener usuarios de la carrera: {str(e)}"
        )
