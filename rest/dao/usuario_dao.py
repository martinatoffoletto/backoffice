from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, and_, or_, func
from ..models.usuario_model import Usuario
from ..schemas.usuario_schema import UsuarioCreate, UsuarioUpdate
from typing import List, Optional, Dict, Any, Union
import uuid
from datetime import datetime

class UsuarioDAO:
    
    @staticmethod
    async def create(db: AsyncSession, usuario: UsuarioCreate, contraseña: str, legajo: str, email: str) -> Usuario:
        usuario_data = usuario.model_dump()
        usuario_data.update({
            "contraseña": contraseña,
            "legajo": legajo,
            "correo_institucional": email
        })
        
        db_usuario = Usuario(**usuario_data)
        db.add(db_usuario)
        await db.commit()
        await db.refresh(db_usuario)
        return db_usuario
    
    @staticmethod
    async def get_all(db: AsyncSession, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[Usuario]:
        query = select(Usuario)
        
        if status_filter is not None:
            query = query.where(Usuario.status == status_filter)
        
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_id(db: AsyncSession, user_id: uuid.UUID) -> Optional[Usuario]:
        query = select(Usuario).where(Usuario.id_usuario == user_id)
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_legajo(db: AsyncSession, legajo: str) -> Optional[Usuario]:
        query = select(Usuario).where(Usuario.legajo == legajo)
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_dni(db: AsyncSession, dni: str) -> Optional[Usuario]:
        query = select(Usuario).where(Usuario.dni == dni)
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_email(db: AsyncSession, email: str) -> Optional[Usuario]:
        query = select(Usuario).where(Usuario.correo_institucional == email)
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def search_by_name(db: AsyncSession, search_term: str, skip: int = 0, limit: int = 100) -> List[Usuario]:
        query = select(Usuario).where(
            or_(
                func.lower(Usuario.nombre).contains(search_term.lower()),
                func.lower(Usuario.apellido).contains(search_term.lower()),
                func.lower(func.concat(Usuario.nombre, ' ', Usuario.apellido)).contains(search_term.lower())
            )
        ).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def update(db: AsyncSession, user_id: uuid.UUID, usuario_update: UsuarioUpdate) -> Optional[Usuario]:
        update_data = usuario_update.dict(exclude_unset=True)
        
        if update_data:
            query = update(Usuario).where(Usuario.id_usuario == user_id).values(**update_data)
            await db.execute(query)
            await db.commit()
        
        return await UsuarioDAO.get_by_id(db, user_id)
    
    @staticmethod
    async def delete(db: AsyncSession, user_id: uuid.UUID) -> bool:
        query = update(Usuario).where(Usuario.id_usuario == user_id).values(status=False)
        result = await db.execute(query)
        await db.commit()
        return result.rowcount > 0