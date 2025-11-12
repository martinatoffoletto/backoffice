from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, update, func
from ..models.sede_model import Sede
from ..schemas.sede_schema import SedeCreate, SedeUpdate
from typing import List, Optional
import uuid

class SedeDAO:
    
    @staticmethod
    async def create(db: AsyncSession, sede: SedeCreate) -> Sede:
        """Crear una nueva sede"""
        db_sede = Sede(
            nombre=sede.nombre,
            ubicacion=sede.ubicacion
        )
        db.add(db_sede)
        await db.commit()
        await db.refresh(db_sede)
        return db_sede
    
    @staticmethod
    async def get_by_id(db: AsyncSession, id_sede: uuid.UUID, include_inactive: bool = False) -> Optional[Sede]:
        """Obtener sede por ID"""
        query = select(Sede).where(Sede.id_sede == id_sede)
        if not include_inactive:
            query = query.where(Sede.status == True)
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_nombre(db: AsyncSession, nombre: str) -> Optional[Sede]:
        """Obtener sede por nombre único"""
        query = select(Sede).where(
            and_(
                Sede.nombre == nombre,
                Sede.status == True
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_all(db: AsyncSession, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[Sede]:
        """Obtener todas las sedes con filtro opcional por status"""
        query = select(Sede)
        
        if status_filter is not None:
            query = query.where(Sede.status == status_filter)
        else:
            query = query.where(Sede.status == True)
        
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def search_by_nombre(db: AsyncSession, nombre_pattern: str, skip: int = 0, limit: int = 100) -> List[Sede]:
        """Buscar sedes por patrón en el nombre"""
        query = select(Sede).where(
            and_(
                Sede.nombre.ilike(f"%{nombre_pattern}%"),
                Sede.status == True
            )
        ).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def search_by_ubicacion(db: AsyncSession, ubicacion_pattern: str, skip: int = 0, limit: int = 100) -> List[Sede]:
        """Buscar sedes por patrón en la ubicación"""
        query = select(Sede).where(
            and_(
                Sede.ubicacion.ilike(f"%{ubicacion_pattern}%"),
                Sede.status == True
            )
        ).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def update(db: AsyncSession, id_sede: uuid.UUID, sede_update: SedeUpdate) -> Optional[Sede]:
        """Actualizar una sede existente"""
        update_data = sede_update.model_dump(exclude_unset=True)
        
        if update_data:
            query = update(Sede).where(Sede.id_sede == id_sede).values(**update_data)
            await db.execute(query)
            await db.commit()
        
        return await SedeDAO.get_by_id(db, id_sede, include_inactive=True)
    
    @staticmethod
    async def soft_delete(db: AsyncSession, id_sede: uuid.UUID) -> bool:
        """Eliminación lógica de una sede"""
        query = update(Sede).where(Sede.id_sede == id_sede).values(status=False)
        result = await db.execute(query)
        await db.commit()
        return result.rowcount > 0
    
    @staticmethod
    async def exists_by_nombre(db: AsyncSession, nombre: str) -> bool:
        """Verificar si existe una sede con ese nombre"""
        query = select(Sede).where(Sede.nombre == nombre)
        result = await db.execute(query)
        return result.scalar_one_or_none() is not None