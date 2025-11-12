from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, and_
from ..models.parametro_model import Parametro
from ..schemas.parametro_schema import ParametroCreate, ParametroUpdate
from typing import List, Optional, Dict
import uuid

class ParametroDAO:
    
    @staticmethod
    async def create(db: AsyncSession, parametro: ParametroCreate) -> Parametro:
        """Crear un nuevo parámetro del sistema"""
        db_parametro = Parametro(
            nombre=parametro.nombre,
            tipo=parametro.tipo,
            valor_numerico=parametro.valor_numerico,
            valor_texto=parametro.valor_texto
        )
        db.add(db_parametro)
        await db.commit()
        await db.refresh(db_parametro)
        return db_parametro
    
    @staticmethod
    async def get_by_id(db: AsyncSession, id_parametro: uuid.UUID, include_inactive: bool = False) -> Optional[Parametro]:
        """Obtener parámetro por ID"""
        query = select(Parametro).where(Parametro.id_parametro == id_parametro)
        if not include_inactive:
            query = query.where(Parametro.status == True)
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_nombre(db: AsyncSession, nombre: str) -> Optional[Parametro]:
        """Obtener parámetro por nombre único"""
        query = select(Parametro).where(
            and_(
                Parametro.nombre == nombre,
                Parametro.status == True
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_all(db: AsyncSession, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[Parametro]:
        """Obtener todos los parámetros con filtro opcional por status"""
        query = select(Parametro)
        
        if status_filter is not None:
            query = query.where(Parametro.status == status_filter)
        else:
            query = query.where(Parametro.status == True)
        
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_tipo(db: AsyncSession, tipo: str, skip: int = 0, limit: int = 100) -> List[Parametro]:
        """Obtener parámetros por tipo"""
        query = select(Parametro).where(
            and_(
                Parametro.tipo == tipo,
                Parametro.status == True
            )
        ).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def search_by_nombre(db: AsyncSession, nombre_pattern: str, skip: int = 0, limit: int = 100) -> List[Parametro]:
        """Buscar parámetros por patrón en el nombre"""
        query = select(Parametro).where(
            and_(
                Parametro.nombre.ilike(f"%{nombre_pattern}%"),
                Parametro.status == True
            )
        ).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    @staticmethod
    async def update(db: AsyncSession, id_parametro: uuid.UUID, parametro_update: ParametroUpdate) -> Optional[Parametro]:
        """Actualizar un parámetro existente"""
        update_data = parametro_update.model_dump(exclude_unset=True)
        
        if update_data:
            query = update(Parametro).where(Parametro.id_parametro == id_parametro).values(**update_data)
            await db.execute(query)
            await db.commit()
        
        return await ParametroDAO.get_by_id(db, id_parametro, include_inactive=True)
    
    @staticmethod
    async def soft_delete(db: AsyncSession, id_parametro: uuid.UUID) -> bool:
        """Eliminación lógica de un parámetro"""
        query = update(Parametro).where(Parametro.id_parametro == id_parametro).values(status=False)
        result = await db.execute(query)
        await db.commit()
        return result.rowcount > 0
    
    @staticmethod
    async def exists_by_nombre(db: AsyncSession, nombre: str, exclude_id: Optional[uuid.UUID] = None) -> bool:
        """Verificar si existe un parámetro con ese nombre"""
        query = select(Parametro).where(Parametro.nombre == nombre)
        if exclude_id:
            query = query.where(Parametro.id_parametro != exclude_id)
        result = await db.execute(query)
        return result.scalar_one_or_none() is not None
    
    @staticmethod
    async def get_valores_by_nombre(db: AsyncSession, nombre: str) -> Optional[Dict[str, any]]:
        """Obtener los valores (numerico y texto) de un parámetro por nombre"""
        parametro = await ParametroDAO.get_by_nombre(db, nombre)
        if not parametro:
            return None
        return {
            "valor_numerico": parametro.valor_numerico,
            "valor_texto": parametro.valor_texto
        }
    
    @staticmethod
    async def get_all_tipos(db: AsyncSession) -> List[str]:
        """Obtener todos los tipos únicos de parámetros"""
        query = select(Parametro.tipo).where(
            and_(Parametro.status == True, Parametro.tipo.isnot(None))
        ).distinct()
        result = await db.execute(query)
        return [tipo for tipo in result.scalars().all() if tipo]