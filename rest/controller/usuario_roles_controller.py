from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid
from ..schemas.usuario_rol_schema import UsuarioRol, UsuarioRolCreate, UsuarioConRoles
from ..service.usuario_rol_service import UsuarioRolService
from ..database import get_db

router = APIRouter(prefix="/user-roles", tags=["User Roles"])

@router.post("/", response_model=UsuarioRol, status_code=status.HTTP_201_CREATED)
async def assign_role_to_user(usuario_rol: UsuarioRolCreate, db: AsyncSession = Depends(get_db)):
    """
    Asignar un rol a un usuario.
    """
    return await UsuarioRolService.assign_role_to_user(db, usuario_rol)

@router.get("/usuario/{id_usuario}", response_model=UsuarioConRoles)
async def get_user_with_roles(id_usuario: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    Obtener usuario con información detallada de sus roles.
    """
    return await UsuarioRolService.get_user_with_roles(db, id_usuario)



@router.delete("/usuario/{id_usuario}/rol/{id_rol}", response_model=dict)
async def remove_role_from_user(id_usuario: uuid.UUID, id_rol: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    Remover un rol específico de un usuario.
    """
    success = await UsuarioRolService.remove_role_from_user(db, id_usuario, id_rol)
    if success:
        return {
            "message": f"Rol {id_rol} removido del usuario {id_usuario}",
            "id_usuario": str(id_usuario),
            "id_rol": id_rol
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al remover el rol del usuario"
        )