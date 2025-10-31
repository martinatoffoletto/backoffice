from sqlalchemy.ext.asyncio import AsyncSession
from ..dao.clase_individual_dao import ClaseIndividualDAO
from ..schemas.clase_individual_schema import (
    ClaseIndividualCreate, 
    ClaseIndividualUpdate, 
    ClaseIndividualResponse,
    ClaseEstadisticas,
    EstadoClase
)
from ..models.clase_individual_model import EstadoClase as ModelEstadoClase
from typing import List, Optional
from datetime import date
import uuid


class ClaseIndividualService:
    
    @staticmethod
    async def create_clase(db: AsyncSession, clase: ClaseIndividualCreate) -> ClaseIndividualResponse:
        """Crear una nueva clase individual"""
        # Validaciones de negocio
        if clase.fecha_clase < date.today():
            raise ValueError("No se puede crear una clase en una fecha pasada")
        
        # Verificar si ya existe una clase para el mismo curso en la misma fecha
        exists = await ClaseIndividualDAO.exists_by_curso_and_fecha(db, clase.id_curso, clase.fecha_clase)
        if exists:
            raise ValueError(f"Ya existe una clase para el curso {clase.id_curso} en la fecha {clase.fecha_clase}")
        
        db_clase = await ClaseIndividualDAO.create(db, clase)
        return ClaseIndividualResponse.model_validate(db_clase)
    
    @staticmethod
    async def get_clase_by_id(db: AsyncSession, id_clase: uuid.UUID) -> Optional[ClaseIndividualResponse]:
        """Obtener una clase individual por su ID"""
        db_clase = await ClaseIndividualDAO.get_by_id(db, id_clase)
        if db_clase:
            return ClaseIndividualResponse.model_validate(db_clase)
        return None
    
    @staticmethod
    async def get_all_clases(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[ClaseIndividualResponse]:
        """Obtener todas las clases individuales activas"""
        db_clases = await ClaseIndividualDAO.get_all(db, skip, limit)
        return [ClaseIndividualResponse.model_validate(clase) for clase in db_clases]
    
    @staticmethod
    async def get_clases_by_curso(db: AsyncSession, id_curso: uuid.UUID, skip: int = 0, limit: int = 100) -> List[ClaseIndividualResponse]:
        """Obtener clases por curso"""
        db_clases = await ClaseIndividualDAO.get_by_curso(db, id_curso, skip, limit)
        return [ClaseIndividualResponse.model_validate(clase) for clase in db_clases]
    
    @staticmethod
    async def get_clases_by_estado(db: AsyncSession, estado: EstadoClase, skip: int = 0, limit: int = 100) -> List[ClaseIndividualResponse]:
        """Obtener clases por estado"""
        # Convertir el enum del schema al enum del modelo
        model_estado = ModelEstadoClase(estado.value)
        db_clases = await ClaseIndividualDAO.get_by_estado(db, model_estado, skip, limit)
        return [ClaseIndividualResponse.model_validate(clase) for clase in db_clases]
    
    @staticmethod
    async def get_clases_by_fecha(db: AsyncSession, fecha_clase: date, skip: int = 0, limit: int = 100) -> List[ClaseIndividualResponse]:
        """Obtener clases por fecha"""
        db_clases = await ClaseIndividualDAO.get_by_fecha(db, fecha_clase, skip, limit)
        return [ClaseIndividualResponse.model_validate(clase) for clase in db_clases]
    
    @staticmethod
    async def get_clases_by_fecha_range(db: AsyncSession, fecha_inicio: date, fecha_fin: date, skip: int = 0, limit: int = 100) -> List[ClaseIndividualResponse]:
        """Obtener clases por rango de fechas"""
        if fecha_inicio > fecha_fin:
            raise ValueError("La fecha de inicio no puede ser mayor que la fecha de fin")
        
        db_clases = await ClaseIndividualDAO.get_by_fecha_range(db, fecha_inicio, fecha_fin, skip, limit)
        return [ClaseIndividualResponse.model_validate(clase) for clase in db_clases]
    
    @staticmethod
    async def update_clase(db: AsyncSession, id_clase: uuid.UUID, clase_update: ClaseIndividualUpdate) -> Optional[ClaseIndividualResponse]:
        """Actualizar una clase individual"""
        # Validaciones de negocio
        if clase_update.fecha_clase and clase_update.fecha_clase < date.today():
            raise ValueError("No se puede programar una clase en una fecha pasada")
        
        # Si se está cambiando la fecha, verificar que no haya conflictos
        if clase_update.fecha_clase:
            # Obtener la clase actual para comparar
            clase_actual = await ClaseIndividualDAO.get_by_id(db, id_clase)
            if clase_actual and clase_update.fecha_clase != clase_actual.fecha_clase:
                exists = await ClaseIndividualDAO.exists_by_curso_and_fecha(
                    db, clase_actual.id_curso, clase_update.fecha_clase
                )
                if exists:
                    raise ValueError(f"Ya existe una clase para el curso {clase_actual.id_curso} en la fecha {clase_update.fecha_clase}")
        
        db_clase = await ClaseIndividualDAO.update(db, id_clase, clase_update)
        if db_clase:
            return ClaseIndividualResponse.model_validate(db_clase)
        return None
    
    @staticmethod
    async def delete_clase(db: AsyncSession, id_clase: uuid.UUID) -> bool:
        """Eliminación lógica de una clase individual"""
        return await ClaseIndividualDAO.delete(db, id_clase)
    
    @staticmethod
    async def get_estadisticas(db: AsyncSession) -> ClaseEstadisticas:
        """Obtener estadísticas de las clases"""
        stats = await ClaseIndividualDAO.get_count_by_estado(db)
        return ClaseEstadisticas(**stats)
    
    @staticmethod
    async def cambiar_estado_clase(db: AsyncSession, id_clase: uuid.UUID, nuevo_estado: EstadoClase) -> Optional[ClaseIndividualResponse]:
        """Cambiar el estado de una clase"""
        # Validaciones de negocio para cambios de estado
        clase_actual = await ClaseIndividualDAO.get_by_id(db, id_clase)
        if not clase_actual:
            return None
        
        # No permitir cambios de estado en clases canceladas
        if clase_actual.estado == ModelEstadoClase.CANCELADA:
            raise ValueError("No se puede cambiar el estado de una clase cancelada")
        
        # No permitir marcar como dictada una clase futura
        if nuevo_estado == EstadoClase.DICTADA and clase_actual.fecha_clase > date.today():
            raise ValueError("No se puede marcar como dictada una clase futura")
        
        update_data = ClaseIndividualUpdate(estado=nuevo_estado)
        db_clase = await ClaseIndividualDAO.update(db, id_clase, update_data)
        
        if db_clase:
            return ClaseIndividualResponse.model_validate(db_clase)
        return None
    
    @staticmethod
    async def reprogramar_clase(db: AsyncSession, id_clase: uuid.UUID, nueva_fecha: date, observaciones: Optional[str] = None) -> Optional[ClaseIndividualResponse]:
        """Reprogramar una clase a una nueva fecha"""
        if nueva_fecha < date.today():
            raise ValueError("No se puede reprogramar una clase a una fecha pasada")
        
        # Obtener la clase actual
        clase_actual = await ClaseIndividualDAO.get_by_id(db, id_clase)
        if not clase_actual:
            return None
        
        # Verificar que no haya conflictos en la nueva fecha
        exists = await ClaseIndividualDAO.exists_by_curso_and_fecha(
            db, clase_actual.id_curso, nueva_fecha
        )
        if exists:
            raise ValueError(f"Ya existe una clase para el curso {clase_actual.id_curso} en la fecha {nueva_fecha}")
        
        # Actualizar la clase
        update_data = ClaseIndividualUpdate(
            fecha_clase=nueva_fecha,
            estado=EstadoClase.REPROGRAMADA,
            observaciones=observaciones or f"Clase reprogramada desde {clase_actual.fecha_clase}"
        )
        
        db_clase = await ClaseIndividualDAO.update(db, id_clase, update_data)
        
        if db_clase:
            return ClaseIndividualResponse.model_validate(db_clase)
        return None
    
    @staticmethod
    async def search_clases(db: AsyncSession, param: str, value: str, skip: int = 0, limit: int = 100) -> List[ClaseIndividualResponse]:
        """Buscar clases individuales por diferentes parámetros"""
        db_clases = await ClaseIndividualDAO.search(db, param, value, skip, limit)
        return [ClaseIndividualResponse.model_validate(clase) for clase in db_clases]