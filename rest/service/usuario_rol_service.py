from sqlalchemy.ext.asyncio import AsyncSession
from ..dao.usuario_rol_dao import UsuarioRolDAO
from ..dao.usuario_dao import UsuarioDAO
from ..schemas.usuario_rol_schema import UsuarioRolCreate, UsuarioConRoles
from typing import Optional
from fastapi import HTTPException, status
import uuid

class UsuarioRolService:
    
    @staticmethod
    async def assign_role_to_user(db: AsyncSession, usuario_rol: UsuarioRolCreate):
        """Asignar un rol a un usuario"""
        # Verificar que el usuario existe y está activo
        usuario = await UsuarioDAO.get_by_id(db, usuario_rol.id_usuario)
        if not usuario or not usuario.status:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado o inactivo"
            )
        
        # Verificar que la relación no existe ya
        if await UsuarioRolDAO.exists(db, usuario_rol.id_usuario, usuario_rol.id_rol):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El usuario ya tiene asignado este rol"
            )
        
        # Crear la relación
        return await UsuarioRolDAO.create(db, usuario_rol)
    
    @staticmethod
    async def remove_role_from_user(db: AsyncSession, id_usuario: uuid.UUID, id_rol: uuid.UUID) -> bool:
        """Remover un rol específico de un usuario"""
        # Verificar que el usuario existe
        usuario = await UsuarioDAO.get_by_id(db, id_usuario)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
        
        # Verificar que la relación existe
        if not await UsuarioRolDAO.exists(db, id_usuario, id_rol):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="El usuario no tiene asignado este rol"
            )
        
        # Eliminar la relación
        return await UsuarioRolDAO.delete(db, id_usuario, id_rol)
    
    @staticmethod
    async def get_user_with_roles(db: AsyncSession, id_usuario: uuid.UUID) -> Optional[UsuarioConRoles]:
        """Obtener usuario con información detallada de sus roles"""
        # Verificar que el usuario existe
        usuario = await UsuarioDAO.get_by_id(db, id_usuario)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
        
        return await UsuarioRolDAO.get_usuario_with_roles_detailed(db, id_usuario)