from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, and_, or_, func
from ..models.cronograma_model import Cronograma
from ..schemas.cronograma_schema import CronogramaCreate, CronogramaUpdate
from typing import List, Optional, Dict, Any
from datetime import datetime, date
import uuid

class CronogramaDAO:
    
    @staticmethod
    async def create(db: AsyncSession, cronograma: CronogramaCreate) -> Cronograma:
        """Crear un nuevo cronograma"""
        cronograma_data = cronograma.model_dump()
        db_cronograma = Cronograma(**cronograma_data)
        db.add(db_cronograma)
        await db.commit()
        await db.refresh(db_cronograma)
        return db_cronograma
    
    @staticmethod
    async def get_by_id(db: AsyncSession, id_cronograma: uuid.UUID) -> Optional[Cronograma]:
        """Obtener cronograma por ID"""
        query = select(Cronograma).where(
            and_(
                Cronograma.id_cronograma == id_cronograma,
                Cronograma.status == True
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_all(db: AsyncSession, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[Cronograma]:
        """Obtener todos los cronogramas"""
        query = select(Cronograma)
        
        if status_filter is not None:
            query = query.where(Cronograma.status == status_filter)
        else:
            query = query.where(Cronograma.status == True)
        
        query = query.order_by(Cronograma.fecha_creacion.desc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_course_id(db: AsyncSession, course_id: int, skip: int = 0, limit: int = 100) -> List[Cronograma]:
        """Obtener cronogramas por ID de curso"""
        query = select(Cronograma).where(
            and_(
                Cronograma.course_id == course_id,
                Cronograma.status == True
            )
        )
        query = query.order_by(Cronograma.fecha_creacion.desc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_course_name(db: AsyncSession, course_name: str, skip: int = 0, limit: int = 100) -> List[Cronograma]:
        """Obtener cronogramas por nombre de curso"""
        query = select(Cronograma).where(
            and_(
                Cronograma.course_name.ilike(f"%{course_name}%"),
                Cronograma.status == True
            )
        )
        query = query.order_by(Cronograma.fecha_creacion.desc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_date_range(db: AsyncSession, fecha_inicio: date, fecha_fin: date, skip: int = 0, limit: int = 100) -> List[Cronograma]:
        """Obtener cronogramas por rango de fechas"""
        query = select(Cronograma).where(
            and_(
                Cronograma.fecha_inicio >= fecha_inicio,
                Cronograma.fecha_fin <= fecha_fin,
                Cronograma.status == True
            )
        )
        query = query.order_by(Cronograma.fecha_inicio.asc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def update(db: AsyncSession, id_cronograma: uuid.UUID, cronograma: CronogramaUpdate) -> Optional[Cronograma]:
        """Actualizar cronograma"""
        # Obtener el cronograma existente
        existing_cronograma = await CronogramaDAO.get_by_id(db, id_cronograma)
        if not existing_cronograma:
            return None
        
        # Actualizar solo los campos proporcionados
        update_data = cronograma.model_dump(exclude_unset=True)
        if not update_data:
            return existing_cronograma
        
        # Actualizar fecha_modificacion
        update_data['fecha_modificacion'] = datetime.now()
        
        # Ejecutar actualización
        stmt = update(Cronograma).where(
            Cronograma.id_cronograma == id_cronograma
        ).values(**update_data)
        
        await db.execute(stmt)
        await db.commit()
        
        # Retornar el cronograma actualizado
        return await CronogramaDAO.get_by_id(db, id_cronograma)
    
    @staticmethod
    async def delete(db: AsyncSession, id_cronograma: uuid.UUID) -> bool:
        """Eliminar cronograma (soft delete)"""
        stmt = update(Cronograma).where(
            Cronograma.id_cronograma == id_cronograma
        ).values(
            status=False,
            fecha_modificacion=datetime.now()
        )
        
        result = await db.execute(stmt)
        await db.commit()
        
        return result.rowcount > 0
    
    @staticmethod
    async def hard_delete(db: AsyncSession, id_cronograma: uuid.UUID) -> bool:
        """Eliminar cronograma permanentemente"""
        query = select(Cronograma).where(Cronograma.id_cronograma == id_cronograma)
        result = await db.execute(query)
        cronograma = result.scalar_one_or_none()
        
        if cronograma:
            await db.delete(cronograma)
            await db.commit()
            return True
        
        return False
    
    @staticmethod
    async def count(db: AsyncSession, status_filter: Optional[bool] = None) -> int:
        """Contar cronogramas"""
        query = select(func.count(Cronograma.id_cronograma))
        
        if status_filter is not None:
            query = query.where(Cronograma.status == status_filter)
        else:
            query = query.where(Cronograma.status == True)
        
        result = await db.execute(query)
        return result.scalar()
    
    @staticmethod
    async def get_active_cronogramas_count(db: AsyncSession) -> int:
        """Obtener conteo de cronogramas activos"""
        return await CronogramaDAO.count(db, status_filter=True)
    
    @staticmethod
    async def search(db: AsyncSession, search_term: str, skip: int = 0, limit: int = 100) -> List[Cronograma]:
        """Buscar cronogramas por término"""
        query = select(Cronograma).where(
            and_(
                or_(
                    Cronograma.course_name.ilike(f"%{search_term}%"),
                    Cronograma.descripcion.ilike(f"%{search_term}%")
                ),
                Cronograma.status == True
            )
        )
        query = query.order_by(Cronograma.fecha_creacion.desc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_cronogramas_with_classes(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Cronograma]:
        """Obtener cronogramas que tienen clases asociadas"""
        query = select(Cronograma).where(
            and_(
                Cronograma.total_classes > 0,
                Cronograma.status == True
            )
        )
        query = query.order_by(Cronograma.fecha_creacion.desc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()