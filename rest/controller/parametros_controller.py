from fastapi import APIRouter, Query
from rest.schemas.parametro_schema import ParametroCreate, ParametroUpdate

router = APIRouter(tags=["Parámetros"], prefix="/parametros")

@router.get("/", summary="Listar parámetros", response_description="Lista de parámetros")
async def listar_parametros():
    """Obtiene una lista paginada de parámetros con filtros y ordenamiento."""
    pass

@router.post("/", summary="Crear parámetro")
async def crear_parametro(parametro: ParametroCreate):
    """Crea un nuevo parámetro (multa, reserva, sanción) con vigencia."""
    pass

@router.get("/{parametro_id}", summary="Obtener parámetro por ID")
async def obtener_parametro(parametro_id: int):
    """Obtiene los datos de un parámetro por su ID."""
    pass

@router.put("/{parametro_id}", summary="Actualizar parámetro por ID")
async def actualizar_parametro(parametro_id: int, parametro: ParametroUpdate):
    """Actualiza los datos de un parámetro por su ID."""
    pass

@router.delete("/{parametro_id}", summary="Eliminar parámetro (soft delete)")
async def eliminar_parametro(parametro_id: int):
    """Marca un parámetro como eliminado (soft delete)."""
    pass
