from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, and_, or_, func
from ..models.clase_individual_model import ClaseIndividual, EstadoClase, TipoClase
from ..schemas.clase_individual_schema import ClaseIndividualCreate, ClaseIndividualUpdate
from typing import List, Optional, Dict, Any
from datetime import datetime, date
import uuid


class ClaseIndividualDAO:
    
    @staticmethod
    async def create(db: AsyncSession, clase: ClaseIndividualCreate) -> ClaseIndividual:
        """Crear una nueva clase individual"""
        clase_data = clase.model_dump()
        # Convertir enums a strings en mayúsculas para guardar en BD
        if 'tipo' in clase_data:
            valor = clase_data['tipo']
            clase_data['tipo'] = valor.upper() if isinstance(valor, str) else valor.value.upper()
        if 'estado' in clase_data:
            valor = clase_data['estado']
            clase_data['estado'] = valor.upper() if isinstance(valor, str) else valor.value.upper()
        
        db_clase = ClaseIndividual(**clase_data)
        db.add(db_clase)
        await db.commit()
        await db.refresh(db_clase)
        return db_clase
    
    @staticmethod
    async def get_by_id(db: AsyncSession, id_clase: uuid.UUID, status_filter: Optional[bool] = None) -> Optional[ClaseIndividual]:
        """Obtener una clase individual por su ID"""
        query = select(ClaseIndividual).where(ClaseIndividual.id_clase == id_clase)
        
        if status_filter is not None:
            query = query.where(ClaseIndividual.status == status_filter)
        else:
            # Por defecto solo mostrar activas
            query = query.where(ClaseIndividual.status == True)
        
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_all(db: AsyncSession, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[ClaseIndividual]:
        """Obtener todas las clases individuales con filtros opcionales"""
        query = select(ClaseIndividual)
        
        if status_filter is not None:
            query = query.where(ClaseIndividual.status == status_filter)
        else:
            # Por defecto solo mostrar activas
            query = query.where(ClaseIndividual.status == True)
        
        query = query.order_by(ClaseIndividual.fecha_clase.desc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_curso(db: AsyncSession, id_curso: uuid.UUID, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[ClaseIndividual]:
        """Obtener clases por curso"""
        query = select(ClaseIndividual).where(ClaseIndividual.id_curso == id_curso)
        
        if status_filter is not None:
            query = query.where(ClaseIndividual.status == status_filter)
        else:
            # Por defecto solo mostrar activas
            query = query.where(ClaseIndividual.status == True)
        
        query = query.order_by(ClaseIndividual.fecha_clase.asc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_estado(db: AsyncSession, estado: str, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[ClaseIndividual]:
        """Obtener clases por estado"""
        # Buscar case-insensitive usando func.lower()
        query = select(ClaseIndividual).where(func.lower(ClaseIndividual.estado) == estado.lower())
        
        if status_filter is not None:
            query = query.where(ClaseIndividual.status == status_filter)
        else:
            # Por defecto solo mostrar activas
            query = query.where(ClaseIndividual.status == True)
        
        query = query.order_by(ClaseIndividual.fecha_clase.desc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_fecha(db: AsyncSession, fecha_clase: date, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[ClaseIndividual]:
        """Obtener clases por fecha"""
        query = select(ClaseIndividual).where(ClaseIndividual.fecha_clase == fecha_clase)
        
        if status_filter is not None:
            query = query.where(ClaseIndividual.status == status_filter)
        else:
            # Por defecto solo mostrar activas
            query = query.where(ClaseIndividual.status == True)
        
        query = query.order_by(ClaseIndividual.fecha_clase.asc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_fecha_range(db: AsyncSession, fecha_inicio: date, fecha_fin: date, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[ClaseIndividual]:
        """Obtener clases por rango de fechas"""
        query = select(ClaseIndividual).where(
            and_(
                ClaseIndividual.fecha_clase >= fecha_inicio,
                ClaseIndividual.fecha_clase <= fecha_fin
            )
        )
        
        if status_filter is not None:
            query = query.where(ClaseIndividual.status == status_filter)
        else:
            # Por defecto solo mostrar activas
            query = query.where(ClaseIndividual.status == True)
        
        query = query.order_by(ClaseIndividual.fecha_clase.asc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def update(db: AsyncSession, id_clase: uuid.UUID, clase_update: ClaseIndividualUpdate) -> Optional[ClaseIndividual]:
        """Actualizar una clase individual"""
        update_data = clase_update.model_dump(exclude_unset=True)
        
        # Convertir strings de enum a instancias de enum si es necesario
        if 'tipo' in update_data and isinstance(update_data['tipo'], str):
            update_data['tipo'] = TipoClase(update_data['tipo'])
        if 'estado' in update_data and isinstance(update_data['estado'], str):
            update_data['estado'] = EstadoClase(update_data['estado'])
        
        if update_data:
            query = update(ClaseIndividual).where(ClaseIndividual.id_clase == id_clase).values(**update_data)
            await db.execute(query)
            await db.commit()
        
        return await ClaseIndividualDAO.get_by_id(db, id_clase)
    
    @staticmethod
    async def delete(db: AsyncSession, id_clase: uuid.UUID) -> bool:
        """Eliminación lógica de una clase individual"""
        query = update(ClaseIndividual).where(
            ClaseIndividual.id_clase == id_clase
        ).values(status=False)
        
        result = await db.execute(query)
        await db.commit()
        
        return result.rowcount > 0
    
    @staticmethod
    async def get_count_by_estado(db: AsyncSession) -> Dict[str, int]:
        """Obtener conteo de clases por estado"""
        query = select(
            ClaseIndividual.estado,
            func.count(ClaseIndividual.id_clase).label('count')
        ).where(ClaseIndividual.status == True).group_by(ClaseIndividual.estado)
        
        result = await db.execute(query)
        rows = result.all()
        
        estadisticas = {
            'total_clases': sum(row.count for row in rows),
            'clases_programadas': 0,
            'clases_dictadas': 0,
            'clases_reprogramadas': 0,
            'clases_canceladas': 0
        }
        
        for row in rows:
            if row.estado == EstadoClase.PROGRAMADA:
                estadisticas['clases_programadas'] = row.count
            elif row.estado == EstadoClase.DICTADA:
                estadisticas['clases_dictadas'] = row.count
            elif row.estado == EstadoClase.REPROGRAMADA:
                estadisticas['clases_reprogramadas'] = row.count
            elif row.estado == EstadoClase.CANCELADA:
                estadisticas['clases_canceladas'] = row.count
        
        return estadisticas
    
    @staticmethod
    async def exists_by_curso_and_fecha(db: AsyncSession, id_curso: uuid.UUID, fecha_clase: date) -> bool:
        """Verificar si existe una clase para un curso en una fecha específica"""
        query = select(ClaseIndividual).where(
            and_(
                ClaseIndividual.id_curso == id_curso,
                ClaseIndividual.fecha_clase == fecha_clase,
                ClaseIndividual.status == True
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none() is not None
    
    @staticmethod
    async def search(db: AsyncSession, param: str, value: str, skip: int = 0, limit: int = 100) -> List[ClaseIndividual]:
        """Buscar clases individuales por diferentes parámetros"""
        param_lower = param.lower()
        
        if param_lower in ["id", "id_clase"]:
            try:
                clase_id = uuid.UUID(value)
                clase = await ClaseIndividualDAO.get_by_id(db, clase_id)
                return [clase] if clase else []
            except ValueError:
                return []
        
        elif param_lower == "id_curso":
            try:
                curso_id = uuid.UUID(value)
                clases = await ClaseIndividualDAO.get_by_curso(db, curso_id, skip, limit)
                return clases
            except ValueError:
                return []
        
        elif param_lower == "tipo":
            try:
                # Convertir el valor del string al enum TipoClase
                tipo_enum = TipoClase(value.lower())
                query = select(ClaseIndividual).where(
                    and_(
                        ClaseIndividual.tipo == tipo_enum,
                        ClaseIndividual.status == True
                    )
                )
                query = query.order_by(ClaseIndividual.fecha_clase.desc())
                query = query.offset(skip).limit(limit)
                result = await db.execute(query)
                return result.scalars().all()
            except ValueError:
                # Si el valor no es válido para el enum, retornar lista vacía
                return []
        
        elif param_lower == "status":
            try:
                status_bool = value.lower() in ["true", "1", "active"]
                clases = await ClaseIndividualDAO.get_all(db, skip, limit, status_bool)
                return clases
            except (ValueError, AttributeError):
                return []
        
        return []