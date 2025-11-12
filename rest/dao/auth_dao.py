from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_
from sqlalchemy.orm import selectinload
from ..models.usuario_model import Usuario
from ..models.rol_model import Rol
from .usuario_dao import UsuarioDAO
from typing import Optional
import uuid

class AuthDAO:
    """
    DAO específico para operaciones de autenticación
    """
    
    @staticmethod
    async def get_user_by_email_institucional_with_rol(db: AsyncSession, email_institucional: str) -> Optional[Usuario]:
        """
        Obtener usuario por email institucional para autenticación
        Incluye la información del rol y verifica que esté activo
        """
        query = select(Usuario).options(
            selectinload(Usuario.rol)
        ).where(
            and_(
                Usuario.email_institucional == email_institucional,
                Usuario.status == True
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def verify_user_exists_and_active(db: AsyncSession, email_institucional: str) -> bool:
        """
        Verificar que un usuario existe y está activo por email institucional
        Usa el método existente del UsuarioDAO
        """
        user = await UsuarioDAO.get_by_email_institucional(db, email_institucional)
        return user is not None and user.status