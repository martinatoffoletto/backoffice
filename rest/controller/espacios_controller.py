from fastapi import APIRouter, Query, status, Depends
from rest.service.auth_service import get_current_user
from rest.schemas.espacio_schema import EspacioCreate, EspacioUpdate

router = APIRouter(tags=["Spaces"], prefix="/spaces")

@router.get(
    "/",
    summary="Listar espacios",
    description="Obtiene una lista de todos los espacios registrados.",
    response_description="Lista de espacios",
    responses={
        200: {"description": "Lista de espacios encontrada"},
        500: {"description": "Error interno del servidor"}
    }
)
async def listar_espacios(user=Depends(get_current_user)):
    """Obtiene una lista de espacios """
    pass

@router.post(
    "/",
    summary="Crear espacio",
    description="Crea un nuevo espacio (sede, edificio, aula, sala, espacio común) con jerarquía.",
    response_description="Espacio creado",
    responses={
        201: {"description": "Espacio creado exitosamente"},
        400: {"description": "Datos inválidos"},
        409: {"description": "Espacio ya existe"},
        500: {"description": "Error interno del servidor"}
    }
)
async def crear_espacio(espacio: EspacioCreate, user=Depends(get_current_user)):
    """Crea un nuevo espacio (sede, edificio, aula, sala, espacio común) con jerarquía."""
    pass

@router.get(
    "/{espacio_id}",
    summary="Obtener espacio por ID",
    description="Obtiene los datos de un espacio específico por su ID.",
    response_description="Datos del espacio",
    responses={
        200: {"description": "Espacio encontrado"},
        404: {"description": "Espacio no encontrado"},
        500: {"description": "Error interno del servidor"}
    }
)
async def obtener_espacio(espacio_id: int, user=Depends(get_current_user)):
    """Obtiene los datos de un espacio por su ID."""
    pass

@router.put(
    "/{espacio_id}",
    summary="Actualizar espacio por ID",
    description="Actualiza los datos de un espacio existente por su ID.",
    response_description="Espacio actualizado",
    responses={
        200: {"description": "Espacio actualizado exitosamente"},
        400: {"description": "Datos inválidos"},
        404: {"description": "Espacio no encontrado"},
        500: {"description": "Error interno del servidor"}
    }
)
async def actualizar_espacio(espacio_id: int, espacio: EspacioUpdate, user=Depends(get_current_user)):
    """Actualiza los datos de un espacio por su ID."""
    pass

@router.delete(
    "/{espacio_id}",
    summary="Eliminar espacio (soft delete)",
    description="Marca un espacio como eliminado (soft delete), sin borrar físicamente.",
    response_description="Espacio eliminado",
    responses={
        200: {"description": "Espacio eliminado exitosamente"},
        403: {"description": "No tienes permisos para eliminar este espacio"},
        404: {"description": "Espacio no encontrado"},
        500: {"description": "Error interno del servidor"}
    }
)
async def eliminar_espacio(espacio_id: int, user=Depends(get_current_user)):
    """Marca un espacio como eliminado (soft delete)."""
    pass
