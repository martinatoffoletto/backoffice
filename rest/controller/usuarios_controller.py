from fastapi import APIRouter, HTTPException, status, Query, Depends
from typing import List, Optional
from ..schemas.usuario_schema import Usuario, UsuarioCreate, UsuarioUpdate
from ..schemas.usuario_rol_schema import UsuarioConRoles
from ..database import get_db

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=Usuario, status_code=status.HTTP_201_CREATED)
async def create_user(usuario: UsuarioCreate, db = Depends(get_db)):
    """
    Crear un nuevo usuario.
    Requiere: nombre, apellido, legajo, dni, correo_personal, telefono_personal
    """
    try:
        # TODO: Implementar lógica de creación en base de datos
        # Validar que legajo y DNI sean únicos
        pass
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Datos inválidos: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.get("/", response_model=List[Usuario])
async def get_all_users(
    skip: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(100, ge=1, le=1000, description="Límite de registros a retornar"),
    status_filter: Optional[bool] = Query(None, description="Filtrar por estado activo/inactivo"),
    db = Depends(get_db)
):
    """
    Obtener todos los usuarios con paginación.
    """
    try:
        # TODO: Implementar consulta a base de datos
        pass
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener los usuarios: {str(e)}"
        )

@router.get("/search", response_model=List[Usuario])
async def search_users(
    nombre: Optional[str] = Query(None, description="Buscar por nombre (coincidencia parcial)"),
    apellido: Optional[str] = Query(None, description="Buscar por apellido (coincidencia parcial)"),
    legajo: Optional[str] = Query(None, description="Buscar por legajo exacto"),
    dni: Optional[str] = Query(None, description="Buscar por DNI exacto"),
    rol: Optional[str] = Query(None, description="Buscar por rol"),
    correo: Optional[str] = Query(None, description="Buscar por correo (coincidencia parcial)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db = Depends(get_db)
):
    """
    Buscar usuarios con múltiples filtros opcionales.
    Puede buscar por nombre, apellido, legajo, DNI, rol o correo.
    """
    try:
        # TODO: Implementar búsqueda en base de datos
        pass
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar usuarios: {str(e)}"
        )

@router.get("/{id_usuario}", response_model=Usuario)
async def get_user_by_id(id_usuario: int, db = Depends(get_db)):
    """
    Obtener un usuario por su ID.
    """
    try:
        # TODO: Implementar consulta a base de datos
        pass
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener el usuario: {str(e)}"
        )

@router.get("/{id_usuario}/roles", response_model=UsuarioConRoles)
async def get_user_with_roles(id_usuario: int, db = Depends(get_db)):
    """
    Obtener usuario con sus roles asignados.
    """
    try:
        # TODO: Implementar consulta con JOIN a base de datos
        pass
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener usuario con roles: {str(e)}"
        )

@router.put("/{id_usuario}", response_model=Usuario)
async def update_user(id_usuario: int, usuario_update: UsuarioUpdate, db = Depends(get_db)):
    """
    Actualizar un usuario por su ID.
    Permite actualizar uno, varios o todos los campos en una sola petición.
    Solo se actualizan los campos que se envían (no nulos).
    """
    try:
        # TODO: Implementar actualización en base de datos
        pass
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Datos inválidos: {str(e)}"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar el usuario: {str(e)}"
        )

@router.delete("/{id_usuario}", response_model=dict)
async def delete_user(id_usuario: int, db = Depends(get_db)):
    """
    Soft delete: cambiar estado del usuario a inactivo.
    No elimina físicamente el registro, solo cambia status a False.
    """
    try:
        # TODO: Implementar soft delete en base de datos
        pass
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar el usuario: {str(e)}"
        )