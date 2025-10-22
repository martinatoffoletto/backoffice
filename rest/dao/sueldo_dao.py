from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, update
from ..models.sueldo_model import Sueldo
from ..models.usuario_rol_model import UsuarioRol
from ..schemas.sueldo_schema import SueldoCreate, SueldoUpdate
from typing import List, Optional
import uuid

class SueldoDAO:
    
    @staticmethod
    async def create(db: AsyncSession, sueldo: SueldoCreate) -> Sueldo:
        """Crear un nuevo sueldo para una relación usuario-rol específica"""
        db_sueldo = Sueldo(
            id_usuario=sueldo.id_usuario,
            id_rol=sueldo.id_rol,
            cbu=sueldo.cbu,
            sueldo_adicional=sueldo.sueldo_adicional,
            observaciones=sueldo.observaciones,
            activo=sueldo.activo
        )
        db.add(db_sueldo)
        await db.commit()
        await db.refresh(db_sueldo)
        return db_sueldo
    
    @staticmethod
    async def get_by_id(db: AsyncSession, sueldo_id: uuid.UUID) -> Optional[Sueldo]:
        """Obtener sueldo por ID"""
        query = select(Sueldo).where(
            and_(
                Sueldo.id_sueldo == sueldo_id,
                Sueldo.activo == True
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_usuario_rol(db: AsyncSession, id_usuario: uuid.UUID, id_rol: uuid.UUID) -> Optional[Sueldo]:
        """Obtener sueldo específico por usuario y rol"""
        query = select(Sueldo).where(
            and_(
                Sueldo.id_usuario == id_usuario,
                Sueldo.id_rol == id_rol,
                Sueldo.activo == True
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_sueldos_by_usuario(db: AsyncSession, id_usuario: uuid.UUID) -> List[Sueldo]:
        """Obtener todos los sueldos activos de un usuario"""
        query = select(Sueldo).where(
            and_(
                Sueldo.id_usuario == id_usuario,
                Sueldo.activo == True
            )
        )
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_sueldos_by_rol(db: AsyncSession, id_rol: uuid.UUID) -> List[Sueldo]:
        """Obtener todos los sueldos por rol específico"""
        query = select(Sueldo).where(
            and_(
                Sueldo.id_rol == id_rol,
                Sueldo.activo == True
            )
        )
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_all(db: AsyncSession, skip: int = 0, limit: int = 100, activo_filter: Optional[bool] = None) -> List[Sueldo]:
        """Obtener todos los sueldos con filtros"""
        query = select(Sueldo)
        
        if activo_filter is not None:
            query = query.where(Sueldo.activo == activo_filter)
        
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def update(db: AsyncSession, sueldo_id: uuid.UUID, sueldo_update: SueldoUpdate) -> Optional[Sueldo]:
        """Actualizar un sueldo"""
        update_data = sueldo_update.dict(exclude_unset=True)
        
        if update_data:
            query = update(Sueldo).where(Sueldo.id_sueldo == sueldo_id).values(**update_data)
            await db.execute(query)
            await db.commit()
        
        return await SueldoDAO.get_by_id(db, sueldo_id)
    
    @staticmethod
    async def soft_delete(db: AsyncSession, sueldo_id: uuid.UUID) -> bool:
        """Eliminación lógica: cambiar activo a False"""
        query = update(Sueldo).where(Sueldo.id_sueldo == sueldo_id).values(activo=False)
        result = await db.execute(query)
        await db.commit()
        return result.rowcount > 0
    
    @staticmethod
    async def exists_usuario_rol_sueldo(db: AsyncSession, id_usuario: uuid.UUID, id_rol: uuid.UUID) -> bool:
        """Verificar si ya existe un sueldo activo para esta combinación usuario-rol"""
        query = select(Sueldo).where(
            and_(
                Sueldo.id_usuario == id_usuario,
                Sueldo.id_rol == id_rol,
                Sueldo.activo == True
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none() is not None