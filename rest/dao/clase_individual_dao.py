from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, and_, or_, func
from ..models.clase_individual_model import ClaseIndividual, EstadoClase
from ..schemas.clase_individual_schema import ClaseIndividualCreate, ClaseIndividualUpdate
from typing import List, Optional, Dict, Any
from datetime import datetime, date, time
import uuid

class ClaseIndividualDAO:
    
    @staticmethod
    async def create(db: AsyncSession, clase: ClaseIndividualCreate) -> ClaseIndividual:
        """Crear una nueva clase individual"""
        clase_data = clase.model_dump()
        db_clase = ClaseIndividual(**clase_data)
        db.add(db_clase)
        await db.commit()
        await db.refresh(db_clase)
        return db_clase
    
    @staticmethod
    async def get_by_id(db: AsyncSession, id_clase: uuid.UUID) -> Optional[ClaseIndividual]:
        """Obtener clase individual por ID"""
        query = select(ClaseIndividual).where(
            and_(
                ClaseIndividual.id_clase == id_clase,
                ClaseIndividual.status == True
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_all(db: AsyncSession, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[ClaseIndividual]:
        """Obtener todas las clases individuales"""
        query = select(ClaseIndividual)
        
        if status_filter is not None:
            query = query.where(ClaseIndividual.status == status_filter)
        else:
            query = query.where(ClaseIndividual.status == True)
        
        query = query.order_by(ClaseIndividual.fecha_clase.desc(), ClaseIndividual.hora_inicio.desc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_cronograma(db: AsyncSession, id_cronograma: uuid.UUID, skip: int = 0, limit: int = 100) -> List[ClaseIndividual]:
        """Obtener clases por cronograma"""
        query = select(ClaseIndividual).where(
            and_(
                ClaseIndividual.id_cronograma == id_cronograma,
                ClaseIndividual.status == True
            )
        )
        query = query.order_by(ClaseIndividual.fecha_clase.asc(), ClaseIndividual.hora_inicio.asc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_estado(db: AsyncSession, estado: EstadoClase, skip: int = 0, limit: int = 100) -> List[ClaseIndividual]:
        """Obtener clases por estado"""
        query = select(ClaseIndividual).where(
            and_(
                ClaseIndividual.estado == estado,
                ClaseIndividual.status == True
            )
        )
        query = query.order_by(ClaseIndividual.fecha_clase.desc(), ClaseIndividual.hora_inicio.desc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_fecha(db: AsyncSession, fecha_clase: date, skip: int = 0, limit: int = 100) -> List[ClaseIndividual]:
        """Obtener clases por fecha"""
        query = select(ClaseIndividual).where(
            and_(
                ClaseIndividual.fecha_clase == fecha_clase,
                ClaseIndividual.status == True
            )
        )
        query = query.order_by(ClaseIndividual.hora_inicio.asc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_fecha_range(db: AsyncSession, fecha_inicio: date, fecha_fin: date, skip: int = 0, limit: int = 100) -> List[ClaseIndividual]:
        """Obtener clases por rango de fechas"""
        query = select(ClaseIndividual).where(
            and_(
                ClaseIndividual.fecha_clase >= fecha_inicio,
                ClaseIndividual.fecha_clase <= fecha_fin,
                ClaseIndividual.status == True
            )
        )
        query = query.order_by(ClaseIndividual.fecha_clase.asc(), ClaseIndividual.hora_inicio.asc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_titulo(db: AsyncSession, titulo: str, skip: int = 0, limit: int = 100) -> List[ClaseIndividual]:
        """Obtener clases por título"""
        query = select(ClaseIndividual).where(
            and_(
                ClaseIndividual.titulo.ilike(f"%{titulo}%"),
                ClaseIndividual.status == True
            )
        )
        query = query.order_by(ClaseIndividual.fecha_clase.desc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_proximas_clases(db: AsyncSession, dias: int = 7, skip: int = 0, limit: int = 100) -> List[ClaseIndividual]:
        """Obtener clases próximas en los próximos N días"""
        from datetime import timedelta
        fecha_limite = date.today() + timedelta(days=dias)
        
        query = select(ClaseIndividual).where(
            and_(
                ClaseIndividual.fecha_clase >= date.today(),
                ClaseIndividual.fecha_clase <= fecha_limite,
                ClaseIndividual.status == True
            )
        )
        query = query.order_by(ClaseIndividual.fecha_clase.asc(), ClaseIndividual.hora_inicio.asc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_clases_pasadas(db: AsyncSession, dias: int = 30, skip: int = 0, limit: int = 100) -> List[ClaseIndividual]:
        """Obtener clases pasadas en los últimos N días"""
        from datetime import timedelta
        fecha_limite = date.today() - timedelta(days=dias)
        
        query = select(ClaseIndividual).where(
            and_(
                ClaseIndividual.fecha_clase >= fecha_limite,
                ClaseIndividual.fecha_clase < date.today(),
                ClaseIndividual.status == True
            )
        )
        query = query.order_by(ClaseIndividual.fecha_clase.desc(), ClaseIndividual.hora_inicio.desc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def update(db: AsyncSession, id_clase: uuid.UUID, clase: ClaseIndividualUpdate) -> Optional[ClaseIndividual]:
        """Actualizar clase individual"""
        # Obtener la clase existente
        existing_clase = await ClaseIndividualDAO.get_by_id(db, id_clase)
        if not existing_clase:
            return None
        
        # Actualizar solo los campos proporcionados
        update_data = clase.model_dump(exclude_unset=True)
        if not update_data:
            return existing_clase
        
        # Actualizar fecha_modificacion
        update_data['fecha_modificacion'] = datetime.now()
        
        # Ejecutar actualización
        stmt = update(ClaseIndividual).where(
            ClaseIndividual.id_clase == id_clase
        ).values(**update_data)
        
        await db.execute(stmt)
        await db.commit()
        
        # Retornar la clase actualizada
        return await ClaseIndividualDAO.get_by_id(db, id_clase)
    
    @staticmethod
    async def delete(db: AsyncSession, id_clase: uuid.UUID) -> bool:
        """Eliminar clase individual (soft delete)"""
        stmt = update(ClaseIndividual).where(
            ClaseIndividual.id_clase == id_clase
        ).values(
            status=False,
            fecha_modificacion=datetime.now()
        )
        
        result = await db.execute(stmt)
        await db.commit()
        
        return result.rowcount > 0
    
    @staticmethod
    async def hard_delete(db: AsyncSession, id_clase: uuid.UUID) -> bool:
        """Eliminar clase individual permanentemente"""
        query = select(ClaseIndividual).where(ClaseIndividual.id_clase == id_clase)
        result = await db.execute(query)
        clase = result.scalar_one_or_none()
        
        if clase:
            await db.delete(clase)
            await db.commit()
            return True
        
        return False
    
    @staticmethod
    async def count(db: AsyncSession, status_filter: Optional[bool] = None) -> int:
        """Contar clases individuales"""
        query = select(func.count(ClaseIndividual.id_clase))
        
        if status_filter is not None:
            query = query.where(ClaseIndividual.status == status_filter)
        else:
            query = query.where(ClaseIndividual.status == True)
        
        result = await db.execute(query)
        return result.scalar()
    
    @staticmethod
    async def count_by_cronograma(db: AsyncSession, id_cronograma: uuid.UUID) -> int:
        """Contar clases por cronograma"""
        query = select(func.count(ClaseIndividual.id_clase)).where(
            and_(
                ClaseIndividual.id_cronograma == id_cronograma,
                ClaseIndividual.status == True
            )
        )
        
        result = await db.execute(query)
        return result.scalar()
    
    @staticmethod
    async def count_by_estado(db: AsyncSession, estado: EstadoClase) -> int:
        """Contar clases por estado"""
        query = select(func.count(ClaseIndividual.id_clase)).where(
            and_(
                ClaseIndividual.estado == estado,
                ClaseIndividual.status == True
            )
        )
        
        result = await db.execute(query)
        return result.scalar()
    
    @staticmethod
    async def search(db: AsyncSession, search_term: str, skip: int = 0, limit: int = 100) -> List[ClaseIndividual]:
        """Buscar clases por término"""
        query = select(ClaseIndividual).where(
            and_(
                or_(
                    ClaseIndividual.titulo.ilike(f"%{search_term}%"),
                    ClaseIndividual.descripcion.ilike(f"%{search_term}%"),
                    ClaseIndividual.observaciones.ilike(f"%{search_term}%")
                ),
                ClaseIndividual.status == True
            )
        )
        query = query.order_by(ClaseIndividual.fecha_clase.desc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_clases_with_cronograma_info(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        """Obtener clases con información del cronograma"""
        from ..models.cronograma_model import Cronograma
        
        query = select(
            ClaseIndividual,
            Cronograma.course_id,
            Cronograma.course_name,
            Cronograma.total_classes
        ).join(
            Cronograma, ClaseIndividual.id_cronograma == Cronograma.id_cronograma
        ).where(
            ClaseIndividual.status == True
        ).order_by(
            ClaseIndividual.fecha_clase.desc()
        ).offset(skip).limit(limit)
        
        result = await db.execute(query)
        rows = result.all()
        
        clases_with_info = []
        for row in rows:
            clase_data = {
                "clase": row[0],
                "course_id": row[1],
                "course_name": row[2],
                "total_classes": row[3]
            }
            clases_with_info.append(clase_data)
        
        return clases_with_info
    
    @staticmethod
    async def get_estadisticas(db: AsyncSession) -> Dict[str, int]:
        """Obtener estadísticas de clases"""
        stats = {}
        
        # Total de clases
        stats['total_clases'] = await ClaseIndividualDAO.count(db)
        
        # Clases por estado
        for estado in EstadoClase:
            count = await ClaseIndividualDAO.count_by_estado(db, estado)
            stats[f'clases_{estado.value}'] = count
        
        # Clases activas/inactivas
        stats['clases_activas'] = await ClaseIndividualDAO.count(db, status_filter=True)
        stats['clases_inactivas'] = await ClaseIndividualDAO.count(db, status_filter=False)
        
        return stats