from fastapi import APIRouter, Query
from rest.schemas.usuario_schema import UsuarioCreate, UsuarioUpdate

router = APIRouter(tags=["Usuarios"], prefix="/usuarios")

@router.get("/", summary="Listar usuarios", response_description="Lista paginada de usuarios")
async def listar_usuarios(page: int = Query(1), size: int = Query(10), filtro: str = Query(None), orden: str = Query("asc")):
    """Obtiene una lista paginada de usuarios con filtros y ordenamiento."""
    pass

@router.post("/", summary="Crear usuario")
async def crear_usuario(usuario: UsuarioCreate):
    """Crea un nuevo usuario."""
    pass

@router.get("/{usuario_id}", summary="Obtener usuario por ID")
async def obtener_usuario(usuario_id: int):
    """Obtiene los datos de un usuario por su ID."""
    pass

@router.put("/{usuario_id}", summary="Actualizar usuario por ID")
async def actualizar_usuario(usuario_id: int, usuario: UsuarioUpdate):
    """Actualiza los datos de un usuario por su ID."""
    pass

@router.delete("/{usuario_id}", summary="Eliminar usuario (soft delete)")
async def eliminar_usuario(usuario_id: int):
    """Marca un usuario como eliminado (soft delete)."""
    pass
