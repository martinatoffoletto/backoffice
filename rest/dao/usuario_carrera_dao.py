from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, delete
from ..models.usuario_carrera_model import UsuarioCarrera
from ..schemas.usuario_carrera_schema import UsuarioCarreraCreate
from typing import List, Optional
import uuid

class UsuarioCarreraDAO:
    
    @staticmethod
    async def create(db: AsyncSession, usuario_carrera: UsuarioCarreraCreate) -> UsuarioCarrera:
        """Asignar una carrera a un usuario"""
        db_usuario_carrera = UsuarioCarrera(
            id_usuario=usuario_carrera.id_usuario,
            id_carrera=usuario_carrera.id_carrera
        )
        db.add(db_usuario_carrera)
        await db.commit()
        await db.refresh(db_usuario_carrera)
        return db_usuario_carrera
    
    @staticmethod
    async def get_by_usuario_carrera(db: AsyncSession, id_usuario: uuid.UUID, id_carrera: uuid.UUID) -> Optional[UsuarioCarrera]:
        """Obtener relación específica usuario-carrera"""
        query = select(UsuarioCarrera).where(
            and_(
                UsuarioCarrera.id_usuario == id_usuario,
                UsuarioCarrera.id_carrera == id_carrera
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_carreras_by_usuario(db: AsyncSession, id_usuario: uuid.UUID) -> List[UsuarioCarrera]:
        """Obtener todas las carreras de un usuario"""
        query = select(UsuarioCarrera).where(UsuarioCarrera.id_usuario == id_usuario)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_usuarios_by_carrera(db: AsyncSession, id_carrera: uuid.UUID) -> List[UsuarioCarrera]:
        """Obtener todos los usuarios de una carrera"""
        query = select(UsuarioCarrera).where(UsuarioCarrera.id_carrera == id_carrera)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def delete(db: AsyncSession, id_usuario: uuid.UUID, id_carrera: uuid.UUID) -> bool:
        """Remover una carrera específica de un usuario"""
        delete_query = delete(UsuarioCarrera).where(
            and_(
                UsuarioCarrera.id_usuario == id_usuario,
                UsuarioCarrera.id_carrera == id_carrera
            )
        )
        result = await db.execute(delete_query)
        await db.commit()
        return result.rowcount > 0
    
    @staticmethod
    async def exists(db: AsyncSession, id_usuario: uuid.UUID, id_carrera: uuid.UUID) -> bool:
        """Verificar si existe la relación usuario-carrera"""
        query = select(UsuarioCarrera).where(
            and_(
                UsuarioCarrera.id_usuario == id_usuario,
                UsuarioCarrera.id_carrera == id_carrera
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none() is not None