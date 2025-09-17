from fastapi import APIRouter, Query, status, Depends
from rest.service.auth_service import get_current_user
from rest.schemas.parametro_schema import ParametroCreate, ParametroUpdate

router = APIRouter(tags=["Parameters"], prefix="/parameters")

@router.get(
    "/",
    summary="Listar parámetros",
    description="Obtiene una lista paginada de parámetros.",
    response_description="Lista de parámetros",
    responses={
        200: {"description": "Lista de parámetros encontrada"},
        500: {"description": "Error interno del servidor"}
    }
)
async def listar_parametros(user=Depends(get_current_user)):
    """Obtiene una lista paginada de parámetros"""
    pass

@router.post(
    "/",
    summary="Crear parámetro",
    description="Crea un nuevo parámetro (multa, reserva, sanción) con vigencia.",
    response_description="Parámetro creado",
    responses={
        201: {"description": "Parámetro creado exitosamente"},
        400: {"description": "Datos inválidos"},
        409: {"description": "Parámetro ya existe"},
        500: {"description": "Error interno del servidor"}
    }
)
async def crear_parametro(parametro: ParametroCreate, user=Depends(get_current_user)):
    """Crea un nuevo parámetro (multa, reserva, sanción) con vigencia."""
    pass

@router.get(
    "/{parametro_id}",
    summary="Obtener parámetro por ID",
    description="Obtiene los datos de un parámetro específico por su ID.",
    response_description="Datos del parámetro",
    responses={
        200: {"description": "Parámetro encontrado"},
        404: {"description": "Parámetro no encontrado"},
        500: {"description": "Error interno del servidor"}
    }
)
async def obtener_parametro(parametro_id: int, user=Depends(get_current_user)):
    """Obtiene los datos de un parámetro por su ID."""
    pass

@router.put(
    "/{parametro_id}",
    summary="Actualizar parámetro por ID",
    description="Actualiza los datos de un parámetro existente por su ID.",
    response_description="Parámetro actualizado",
    responses={
        200: {"description": "Parámetro actualizado exitosamente"},
        400: {"description": "Datos inválidos"},
        404: {"description": "Parámetro no encontrado"},
        500: {"description": "Error interno del servidor"}
    }
)
async def actualizar_parametro(parametro_id: int, parametro: ParametroUpdate, user=Depends(get_current_user)):
    """Actualiza los datos de un parámetro por su ID."""
    pass

@router.delete(
    "/{parametro_id}",
    summary="Eliminar parámetro (soft delete)",
    description="Marca un parámetro como eliminado (soft delete), sin borrar físicamente.",
    response_description="Parámetro eliminado",
    responses={
        200: {"description": "Parámetro eliminado exitosamente"},
        403: {"description": "No tienes permisos para eliminar este parámetro"},
        404: {"description": "Parámetro no encontrado"},
        500: {"description": "Error interno del servidor"}
    }
)
async def eliminar_parametro(parametro_id: int, user=Depends(get_current_user)):
    """Marca un parámetro como eliminado (soft delete)."""
    pass
