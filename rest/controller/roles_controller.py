from fastapi import APIRouter
from rest.schemas.rol_schema import RolCreate, RolUpdate

router = APIRouter(tags=["Roles"], prefix="/roles")

@router.get("/", summary="Listar roles")
async def listar_roles():
    """Obtiene la lista de roles disponibles."""
    pass

@router.post("/", summary="Crear rol")
async def crear_rol(rol: RolCreate):
    """Crea un nuevo rol."""
    pass

@router.get("/{rol_id}", summary="Obtener rol por ID")
async def obtener_rol(rol_id: int):
    """Obtiene los datos de un rol por su ID."""
    pass

@router.put("/{rol_id}", summary="Actualizar rol por ID")
async def actualizar_rol(rol_id: int, rol: RolUpdate):
    """Actualiza los datos de un rol por su ID."""
    pass

@router.delete("/{rol_id}", summary="Eliminar rol (soft delete)")
async def eliminar_rol(rol_id: int):
    """Marca un rol como eliminado (soft delete)."""
    pass
