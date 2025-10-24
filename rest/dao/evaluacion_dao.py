from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, and_, or_, func
from ..models.evaluacion_model import Evaluacion, TipoEvaluacion
from ..schemas.evaluacion_schema import EvaluacionCreate, EvaluacionUpdate
from typing import List, Optional, Dict, Any
from datetime import datetime, date, time
from decimal import Decimal
import uuid

class EvaluacionDAO:
    
    @staticmethod
    async def create(db: AsyncSession, evaluacion: EvaluacionCreate) -> Evaluacion:
        """Crear una nueva evaluación"""
        evaluacion_data = evaluacion.model_dump()
        db_evaluacion = Evaluacion(**evaluacion_data)
        db.add(db_evaluacion)
        await db.commit()
        await db.refresh(db_evaluacion)
        return db_evaluacion
    
    @staticmethod
    async def get_by_id(db: AsyncSession, id_evaluacion: uuid.UUID) -> Optional[Evaluacion]:
        """Obtener evaluación por ID"""
        query = select(Evaluacion).where(
            and_(
                Evaluacion.id_evaluacion == id_evaluacion,
                Evaluacion.status == True
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_all(db: AsyncSession, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[Evaluacion]:
        """Obtener todas las evaluaciones"""
        query = select(Evaluacion)
        
        if status_filter is not None:
            query = query.where(Evaluacion.status == status_filter)
        else:
            query = query.where(Evaluacion.status == True)
        
        query = query.order_by(Evaluacion.fecha.desc(), Evaluacion.hora_inicio.desc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_cronograma(db: AsyncSession, id_cronograma: uuid.UUID, skip: int = 0, limit: int = 100) -> List[Evaluacion]:
        """Obtener evaluaciones por cronograma"""
        query = select(Evaluacion).where(
            and_(
                Evaluacion.id_cronograma == id_cronograma,
                Evaluacion.status == True
            )
        )
        query = query.order_by(Evaluacion.fecha.asc(), Evaluacion.hora_inicio.asc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_tipo(db: AsyncSession, tipo: TipoEvaluacion, skip: int = 0, limit: int = 100) -> List[Evaluacion]:
        """Obtener evaluaciones por tipo"""
        query = select(Evaluacion).where(
            and_(
                Evaluacion.tipo == tipo,
                Evaluacion.status == True
            )
        )
        query = query.order_by(Evaluacion.fecha.desc(), Evaluacion.hora_inicio.desc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_fecha(db: AsyncSession, fecha: date, skip: int = 0, limit: int = 100) -> List[Evaluacion]:
        """Obtener evaluaciones por fecha"""
        query = select(Evaluacion).where(
            and_(
                Evaluacion.fecha == fecha,
                Evaluacion.status == True
            )
        )
        query = query.order_by(Evaluacion.hora_inicio.asc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_fecha_range(db: AsyncSession, fecha_inicio: date, fecha_fin: date, skip: int = 0, limit: int = 100) -> List[Evaluacion]:
        """Obtener evaluaciones por rango de fechas"""
        query = select(Evaluacion).where(
            and_(
                Evaluacion.fecha >= fecha_inicio,
                Evaluacion.fecha <= fecha_fin,
                Evaluacion.status == True
            )
        )
        query = query.order_by(Evaluacion.fecha.asc(), Evaluacion.hora_inicio.asc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_proximas_evaluaciones(db: AsyncSession, dias: int = 7, skip: int = 0, limit: int = 100) -> List[Evaluacion]:
        """Obtener evaluaciones próximas en los próximos N días"""
        from datetime import timedelta
        fecha_limite = date.today() + timedelta(days=dias)
        
        query = select(Evaluacion).where(
            and_(
                Evaluacion.fecha >= date.today(),
                Evaluacion.fecha <= fecha_limite,
                Evaluacion.status == True
            )
        )
        query = query.order_by(Evaluacion.fecha.asc(), Evaluacion.hora_inicio.asc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_evaluaciones_pasadas(db: AsyncSession, dias: int = 30, skip: int = 0, limit: int = 100) -> List[Evaluacion]:
        """Obtener evaluaciones pasadas en los últimos N días"""
        from datetime import timedelta
        fecha_limite = date.today() - timedelta(days=dias)
        
        query = select(Evaluacion).where(
            and_(
                Evaluacion.fecha >= fecha_limite,
                Evaluacion.fecha < date.today(),
                Evaluacion.status == True
            )
        )
        query = query.order_by(Evaluacion.fecha.desc(), Evaluacion.hora_inicio.desc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_nombre(db: AsyncSession, nombre: str, skip: int = 0, limit: int = 100) -> List[Evaluacion]:
        """Obtener evaluaciones por nombre"""
        query = select(Evaluacion).where(
            and_(
                Evaluacion.nombre.ilike(f"%{nombre}%"),
                Evaluacion.status == True
            )
        )
        query = query.order_by(Evaluacion.fecha.desc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_ponderacion_range(db: AsyncSession, ponderacion_min: Decimal, ponderacion_max: Decimal, skip: int = 0, limit: int = 100) -> List[Evaluacion]:
        """Obtener evaluaciones por rango de ponderación"""
        query = select(Evaluacion).where(
            and_(
                Evaluacion.ponderacion >= ponderacion_min,
                Evaluacion.ponderacion <= ponderacion_max,
                Evaluacion.status == True
            )
        )
        query = query.order_by(Evaluacion.ponderacion.desc(), Evaluacion.fecha.desc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def update(db: AsyncSession, id_evaluacion: uuid.UUID, evaluacion: EvaluacionUpdate) -> Optional[Evaluacion]:
        """Actualizar evaluación"""
        # Obtener la evaluación existente
        existing_evaluacion = await EvaluacionDAO.get_by_id(db, id_evaluacion)
        if not existing_evaluacion:
            return None
        
        # Actualizar solo los campos proporcionados
        update_data = evaluacion.model_dump(exclude_unset=True)
        if not update_data:
            return existing_evaluacion
        
        # Actualizar fecha_modificacion
        update_data['fecha_modificacion'] = datetime.now()
        
        # Ejecutar actualización
        stmt = update(Evaluacion).where(
            Evaluacion.id_evaluacion == id_evaluacion
        ).values(**update_data)
        
        await db.execute(stmt)
        await db.commit()
        
        # Retornar la evaluación actualizada
        return await EvaluacionDAO.get_by_id(db, id_evaluacion)
    
    @staticmethod
    async def delete(db: AsyncSession, id_evaluacion: uuid.UUID) -> bool:
        """Eliminar evaluación (soft delete)"""
        stmt = update(Evaluacion).where(
            Evaluacion.id_evaluacion == id_evaluacion
        ).values(
            status=False,
            fecha_modificacion=datetime.now()
        )
        
        result = await db.execute(stmt)
        await db.commit()
        
        return result.rowcount > 0
    
    @staticmethod
    async def hard_delete(db: AsyncSession, id_evaluacion: uuid.UUID) -> bool:
        """Eliminar evaluación permanentemente"""
        query = select(Evaluacion).where(Evaluacion.id_evaluacion == id_evaluacion)
        result = await db.execute(query)
        evaluacion = result.scalar_one_or_none()
        
        if evaluacion:
            await db.delete(evaluacion)
            await db.commit()
            return True
        
        return False
    
    @staticmethod
    async def count(db: AsyncSession, status_filter: Optional[bool] = None) -> int:
        """Contar evaluaciones"""
        query = select(func.count(Evaluacion.id_evaluacion))
        
        if status_filter is not None:
            query = query.where(Evaluacion.status == status_filter)
        else:
            query = query.where(Evaluacion.status == True)
        
        result = await db.execute(query)
        return result.scalar()
    
    @staticmethod
    async def count_by_cronograma(db: AsyncSession, id_cronograma: uuid.UUID) -> int:
        """Contar evaluaciones por cronograma"""
        query = select(func.count(Evaluacion.id_evaluacion)).where(
            and_(
                Evaluacion.id_cronograma == id_cronograma,
                Evaluacion.status == True
            )
        )
        
        result = await db.execute(query)
        return result.scalar()
    
    @staticmethod
    async def count_by_tipo(db: AsyncSession, tipo: TipoEvaluacion) -> int:
        """Contar evaluaciones por tipo"""
        query = select(func.count(Evaluacion.id_evaluacion)).where(
            and_(
                Evaluacion.tipo == tipo,
                Evaluacion.status == True
            )
        )
        
        result = await db.execute(query)
        return result.scalar()
    
    @staticmethod
    async def search(db: AsyncSession, search_term: str, skip: int = 0, limit: int = 100) -> List[Evaluacion]:
        """Buscar evaluaciones por término"""
        query = select(Evaluacion).where(
            and_(
                or_(
                    Evaluacion.nombre.ilike(f"%{search_term}%"),
                    Evaluacion.descripcion.ilike(f"%{search_term}%"),
                    Evaluacion.observaciones.ilike(f"%{search_term}%")
                ),
                Evaluacion.status == True
            )
        )
        query = query.order_by(Evaluacion.fecha.desc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_evaluaciones_with_cronograma_info(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        """Obtener evaluaciones con información del cronograma"""
        from ..models.cronograma_model import Cronograma
        
        query = select(
            Evaluacion,
            Cronograma.course_id,
            Cronograma.course_name,
            Cronograma.total_classes
        ).join(
            Cronograma, Evaluacion.id_cronograma == Cronograma.id_cronograma
        ).where(
            Evaluacion.status == True
        ).order_by(
            Evaluacion.fecha.desc()
        ).offset(skip).limit(limit)
        
        result = await db.execute(query)
        rows = result.all()
        
        evaluaciones_with_info = []
        for row in rows:
            evaluacion_data = {
                "evaluacion": row[0],
                "course_id": row[1],
                "course_name": row[2],
                "total_classes": row[3]
            }
            evaluaciones_with_info.append(evaluacion_data)
        
        return evaluaciones_with_info
    
    @staticmethod
    async def get_estadisticas(db: AsyncSession) -> Dict[str, Any]:
        """Obtener estadísticas de evaluaciones"""
        stats = {}
        
        # Total de evaluaciones
        stats['total_evaluaciones'] = await EvaluacionDAO.count(db)
        
        # Evaluaciones por tipo
        for tipo in TipoEvaluacion:
            count = await EvaluacionDAO.count_by_tipo(db, tipo)
            stats[f'evaluaciones_{tipo.value}'] = count
        
        # Evaluaciones activas/inactivas
        stats['evaluaciones_activas'] = await EvaluacionDAO.count(db, status_filter=True)
        stats['evaluaciones_inactivas'] = await EvaluacionDAO.count(db, status_filter=False)
        
        # Suma total de ponderaciones
        query = select(func.sum(Evaluacion.ponderacion)).where(Evaluacion.status == True)
        result = await db.execute(query)
        ponderacion_total = result.scalar() or Decimal('0')
        stats['ponderacion_total'] = ponderacion_total
        
        return stats
    
    @staticmethod
    async def get_evaluaciones_by_ponderacion_total(db: AsyncSession, id_cronograma: uuid.UUID) -> Decimal:
        """Obtener suma total de ponderaciones por cronograma"""
        query = select(func.sum(Evaluacion.ponderacion)).where(
            and_(
                Evaluacion.id_cronograma == id_cronograma,
                Evaluacion.status == True
            )
        )
        
        result = await db.execute(query)
        return result.scalar() or Decimal('0')