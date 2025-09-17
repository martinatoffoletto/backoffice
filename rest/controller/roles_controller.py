from fastapi import APIRouter, status, Depends
from rest.service.auth_service import get_current_user
from rest.schemas.rol_schema import RolCreate, RolUpdate

router = APIRouter(tags=["Roles"], prefix="/roles")

@router.get(
    "/",
    summary="Listar roles",
    description="Obtiene la lista de roles disponibles.",
    response_description="Lista de roles",
    responses={
        200: {"description": "Lista de roles encontrada"},
        500: {"description": "Error interno del servidor"}
    }
)
async def listar_roles(user=Depends(get_current_user)):
    """Obtiene la lista de roles disponibles."""
    pass

@router.post(
    "/",
    summary="Crear rol",
    description="Crea un nuevo rol en el sistema.",
    response_description="Rol creado",
    responses={
        201: {"description": "Rol creado exitosamente"},
        400: {"description": "Datos inválidos"},
        409: {"description": "Rol ya existe"},
        500: {"description": "Error interno del servidor"}
    }
)
async def crear_rol(rol: RolCreate, user=Depends(get_current_user)):
    """Crea un nuevo rol."""
    pass

@router.get(
    "/{rol_id}",
    summary="Obtener rol por ID",
    description="Obtiene los datos de un rol específico por su ID.",
    response_description="Datos del rol",
    responses={
        200: {"description": "Rol encontrado"},
        404: {"description": "Rol no encontrado"},
        500: {"description": "Error interno del servidor"}
    }
)
async def obtener_rol(rol_id: int, user=Depends(get_current_user)):
    """Obtiene los datos de un rol por su ID."""
    pass

@router.put(
    "/{rol_id}",
    summary="Actualizar rol por ID",
    description="Actualiza los datos de un rol existente por su ID.",
    response_description="Rol actualizado",
    responses={
        200: {"description": "Rol actualizado exitosamente"},
        400: {"description": "Datos inválidos"},
        404: {"description": "Rol no encontrado"},
        500: {"description": "Error interno del servidor"}
    }
)
async def actualizar_rol(rol_id: int, rol: RolUpdate, user=Depends(get_current_user)):
    """Actualiza los datos de un rol por su ID."""
    pass

@router.delete(
    "/{rol_id}",
    summary="Eliminar rol (soft delete)",
    description="Marca un rol como eliminado (soft delete), sin borrar físicamente.",
    response_description="Rol eliminado",
    responses={
        200: {"description": "Rol eliminado exitosamente"},
        403: {"description": "No tienes permisos para eliminar este rol"},
        404: {"description": "Rol no encontrado"},
        500: {"description": "Error interno del servidor"}
    }
)
async def eliminar_rol(rol_id: int, user=Depends(get_current_user)):
    """Marca un rol como eliminado (soft delete)."""
    pass
