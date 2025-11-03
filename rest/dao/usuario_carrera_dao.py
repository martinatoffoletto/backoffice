from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, update
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
            id_carrera=usuario_carrera.id_carrera,
            status=True
        )
        db.add(db_usuario_carrera)
        await db.commit()
        await db.refresh(db_usuario_carrera)
        return db_usuario_carrera
    
    @staticmethod
    async def get_by_usuario_carrera(db: AsyncSession, id_usuario: uuid.UUID, id_carrera: uuid.UUID) -> Optional[UsuarioCarrera]:
        """Obtener relación específica usuario-carrera (sin filtro de status)"""
        query = select(UsuarioCarrera).where(
            and_(
                UsuarioCarrera.id_usuario == id_usuario,
                UsuarioCarrera.id_carrera == id_carrera
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_carrera_by_usuario(db: AsyncSession, id_usuario: uuid.UUID, status_filter: Optional[bool] = None) -> Optional[UsuarioCarrera]:
        """Obtener la carrera única de un usuario."""
        query = select(UsuarioCarrera).where(UsuarioCarrera.id_usuario == id_usuario)
        
        if status_filter is not None:
            query = query.where(UsuarioCarrera.status == status_filter)
        else:
            # Por defecto solo mostrar activas
            query = query.where(UsuarioCarrera.status == True)
        
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_usuarios_by_carrera(db: AsyncSession, id_carrera: uuid.UUID, status_filter: Optional[bool] = None) -> List[UsuarioCarrera]:
        """Obtener todos los usuarios de una carrera con filtros opcionales"""
        query = select(UsuarioCarrera).where(UsuarioCarrera.id_carrera == id_carrera)
        
        if status_filter is not None:
            query = query.where(UsuarioCarrera.status == status_filter)
        else:
            # Por defecto solo mostrar activas
            query = query.where(UsuarioCarrera.status == True)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def soft_delete(db: AsyncSession, id_usuario: uuid.UUID, id_carrera: uuid.UUID) -> bool:
        """Eliminación lógica: cambiar status a False"""
        query = update(UsuarioCarrera).where(
            and_(
                UsuarioCarrera.id_usuario == id_usuario,
                UsuarioCarrera.id_carrera == id_carrera
            )
        ).values(status=False)
        result = await db.execute(query)
        await db.commit()
        return result.rowcount > 0
    
    @staticmethod
    async def delete(db: AsyncSession, id_usuario: uuid.UUID, id_carrera: uuid.UUID) -> bool:
        """Remover una carrera específica de un usuario (soft delete)"""
        return await UsuarioCarreraDAO.soft_delete(db, id_usuario, id_carrera)
    
    @staticmethod
    async def exists(db: AsyncSession, id_usuario: uuid.UUID, id_carrera: uuid.UUID) -> bool:
        """Verificar si existe la relación usuario-carrera activa"""
        query = select(UsuarioCarrera).where(
            and_(
                UsuarioCarrera.id_usuario == id_usuario,
                UsuarioCarrera.id_carrera == id_carrera,
                UsuarioCarrera.status == True
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none() is not None
    
    @staticmethod
    async def get_all(db: AsyncSession, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[UsuarioCarrera]:
        """Obtener todas las relaciones usuario-carrera con filtros"""
        query = select(UsuarioCarrera)
        
        if status_filter is not None:
            query = query.where(UsuarioCarrera.status == status_filter)
        else:
            # Por defecto solo mostrar activas
            query = query.where(UsuarioCarrera.status == True)
        
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_id(db: AsyncSession, id_usuario: uuid.UUID, id_carrera: uuid.UUID, status_filter: Optional[bool] = None) -> Optional[UsuarioCarrera]:
        """Obtener relación usuario-carrera por IDs con filtros opcionales"""
        query = select(UsuarioCarrera).where(
            and_(
                UsuarioCarrera.id_usuario == id_usuario,
                UsuarioCarrera.id_carrera == id_carrera
            )
        )
        
        if status_filter is not None:
            query = query.where(UsuarioCarrera.status == status_filter)
        else:
            # Por defecto solo mostrar activas
            query = query.where(UsuarioCarrera.status == True)
        
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def search(db: AsyncSession, param: str, value: str, skip: int = 0, limit: int = 100) -> List[UsuarioCarrera]:
        """Buscar relaciones usuario-carrera por diferentes parámetros"""
        param_lower = param.lower()
        
        if param_lower == "id":
            # Para "id", esperamos un formato como "usuario_id,carrera_id"
            try:
                parts = value.split(",")
                if len(parts) == 2:
                    usuario_id = uuid.UUID(parts[0].strip())
                    carrera_id = uuid.UUID(parts[1].strip())
                    relacion = await UsuarioCarreraDAO.get_by_id(db, usuario_id, carrera_id)
                    return [relacion] if relacion else []
                else:
                    return []
            except (ValueError, AttributeError):
                return []
        
        elif param_lower == "id_usuario":
            try:
                usuario_id = uuid.UUID(value)
                relacion = await UsuarioCarreraDAO.get_carrera_by_usuario(db, usuario_id)
                return [relacion] if relacion else []
            except ValueError:
                return []
        
        elif param_lower == "id_carrera":
            try:
                carrera_id = uuid.UUID(value)
                relaciones = await UsuarioCarreraDAO.get_usuarios_by_carrera(db, carrera_id)
                return relaciones[skip:skip+limit] if relaciones else []
            except ValueError:
                return []
        
        elif param_lower == "status":
            try:
                status_bool = value.lower() in ["true", "1", "active"]
                relaciones = await UsuarioCarreraDAO.get_all(db, skip, limit, status_bool)
                return relaciones
            except (ValueError, AttributeError):
                return []
        
        return []