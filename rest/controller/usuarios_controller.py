from fastapi import APIRouter, Query, HTTPException, status, Depends
from rest.service.auth_service import get_current_user
from rest.schemas.usuario_schema import UsuarioCreate, UsuarioUpdate

router = APIRouter(tags=["Users"], prefix="/users")

@router.get(
    "/",
    summary="Listar usuarios",
    description="Obtiene una lista de todos los usuarios registrados.",
    response_description="Lista de usuarios",
    responses={
        200: {"description": "Lista de usuarios encontrada"},
        500: {"description": "Error interno del servidor"}
    }
)
async def listar_usuarios(user=Depends(get_current_user)):
    """Obtiene una lista de usuarios"""
    pass

@router.post(
    "/",
    summary="Crear usuario",
    description="Crea un nuevo usuario en el sistema.",
    response_description="Usuario creado",
    responses={
        201: {"description": "Usuario creado exitosamente"},
        400: {"description": "Datos inválidos"},
        409: {"description": "Usuario ya existe"},
        500: {"description": "Error interno del servidor"}
    }
)
async def crear_usuario(usuario: UsuarioCreate, user=Depends(get_current_user)):
    """Crea un nuevo usuario."""
    pass

@router.get(
    "/{usuario_id}",
    summary="Obtener usuario por ID",
    description="Obtiene los datos de un usuario específico por su ID.",
    response_description="Datos del usuario",
    responses={
        200: {"description": "Usuario encontrado"},
        404: {"description": "Usuario no encontrado"},
        500: {"description": "Error interno del servidor"}
    }
)
async def obtener_usuario(usuario_id: int, user=Depends(get_current_user)):
    """Obtiene los datos de un usuario por su ID."""
    pass

@router.put(
    "/{usuario_id}",
    summary="Actualizar usuario por ID",
    description="Actualiza los datos de un usuario existente por su ID.",
    response_description="Usuario actualizado",
    responses={
        200: {"description": "Usuario actualizado exitosamente"},
        400: {"description": "Datos inválidos"},
        404: {"description": "Usuario no encontrado"},
        500: {"description": "Error interno del servidor"}
    }
)
async def actualizar_usuario(usuario_id: int, usuario: UsuarioUpdate, user=Depends(get_current_user)):
    """Actualiza los datos de un usuario por su ID."""
    pass

@router.delete(
    "/{usuario_id}",
    summary="Eliminar usuario (soft delete)",
    description="Marca un usuario como eliminado (soft delete), sin borrar físicamente.",
    response_description="Usuario eliminado",
    responses={
        200: {"description": "Usuario eliminado exitosamente"},
        403: {"description": "No tienes permisos para eliminar este usuario"},
        404: {"description": "Usuario no encontrado"},
        500: {"description": "Error interno del servidor"}
    }
)
async def eliminar_usuario(usuario_id: int, user=Depends(get_current_user)):
    """Marca un usuario como eliminado (soft delete)."""
    pass
