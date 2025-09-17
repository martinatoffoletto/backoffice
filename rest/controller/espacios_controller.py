from fastapi import APIRouter, Query
from rest.schemas.espacio_schema import EspacioCreate, EspacioUpdate

router = APIRouter(tags=["Espacios"], prefix="/espacios")

@router.get("/", summary="Listar espacios")
async def listar_espacios(size: int = Query(10), filtro: str = Query(None), orden: str = Query("asc")):
    """Obtiene una lista de espacios con filtros y ordenamiento."""
    pass

@router.post("/", summary="Crear espacio")
async def crear_espacio(espacio: EspacioCreate):
    """Crea un nuevo espacio (sede, edificio, aula, sala, espacio común) con jerarquía."""
    pass

@router.get("/{espacio_id}", summary="Obtener espacio por ID")
async def obtener_espacio(espacio_id: int):
    """Obtiene los datos de un espacio por su ID."""
    pass

@router.put("/{espacio_id}", summary="Actualizar espacio por ID")
async def actualizar_espacio(espacio_id: int, espacio: EspacioUpdate):
    """Actualiza los datos de un espacio por su ID."""
    pass

@router.delete("/{espacio_id}", summary="Eliminar espacio (soft delete)")
async def eliminar_espacio(espacio_id: int):
    """Marca un espacio como eliminado (soft delete)."""
    pass
