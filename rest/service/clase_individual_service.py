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
        # Nota: No validamos fechas pasadas aquí porque:
        # 1. El curso es una entidad externa (mockeada), no tenemos acceso a fecha_inicio/fecha_fin
        # 2. El frontend ya valida que las fechas estén dentro del rango del curso
        # 3. Permite crear clases retroactivas para cursos que ya comenzaron
        
        # Verificar si ya existe una clase para el mismo curso en la misma fecha
        exists = await ClaseIndividualDAO.exists_by_curso_and_fecha(db, clase.id_curso, clase.fecha_clase)
        if exists:
            raise ValueError(f"Ya existe una clase para el curso {clase.id_curso} en la fecha {clase.fecha_clase}")
        
        db_clase = await ClaseIndividualDAO.create(db, clase)
        return ClaseIndividualResponse.model_validate(db_clase)
    
    @staticmethod
    async def get_clase_by_id(db: AsyncSession, id_clase: uuid.UUID, status_filter: Optional[bool] = None) -> Optional[ClaseIndividualResponse]:
        """Obtener una clase individual por su ID"""
        db_clase = await ClaseIndividualDAO.get_by_id(db, id_clase, status_filter)
        if db_clase:
            return ClaseIndividualResponse.model_validate(db_clase)
        return None
    
    @staticmethod
    async def get_all_clases(db: AsyncSession, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[ClaseIndividualResponse]:
        """Obtener todas las clases individuales con filtros opcionales"""
        db_clases = await ClaseIndividualDAO.get_all(db, skip, limit, status_filter)
        return [ClaseIndividualResponse.model_validate(clase) for clase in db_clases]
    
    @staticmethod
    async def get_clases_by_curso(db: AsyncSession, id_curso: uuid.UUID, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[ClaseIndividualResponse]:
        """Obtener clases por curso"""
        db_clases = await ClaseIndividualDAO.get_by_curso(db, id_curso, skip, limit, status_filter)
        return [ClaseIndividualResponse.model_validate(clase) for clase in db_clases]
    
    @staticmethod
    async def get_clases_by_estado(db: AsyncSession, estado: EstadoClase, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[ClaseIndividualResponse]:
        """Obtener clases por estado"""
        # Convertir el enum del schema al enum del modelo
        model_estado = ModelEstadoClase(estado.value)
        db_clases = await ClaseIndividualDAO.get_by_estado(db, model_estado, skip, limit, status_filter)
        return [ClaseIndividualResponse.model_validate(clase) for clase in db_clases]
    
    @staticmethod
    async def get_clases_by_fecha(db: AsyncSession, fecha_clase: date, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[ClaseIndividualResponse]:
        """Obtener clases por fecha"""
        db_clases = await ClaseIndividualDAO.get_by_fecha(db, fecha_clase, skip, limit, status_filter)
        return [ClaseIndividualResponse.model_validate(clase) for clase in db_clases]
    
    @staticmethod
    async def get_clases_by_fecha_range(db: AsyncSession, fecha_inicio: date, fecha_fin: date, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[ClaseIndividualResponse]:
        """Obtener clases por rango de fechas"""
        if fecha_inicio > fecha_fin:
            raise ValueError("La fecha de inicio no puede ser mayor que la fecha de fin")
        
        db_clases = await ClaseIndividualDAO.get_by_fecha_range(db, fecha_inicio, fecha_fin, skip, limit, status_filter)
        return [ClaseIndividualResponse.model_validate(clase) for clase in db_clases]
    
    @staticmethod
    async def update_clase(db: AsyncSession, id_clase: uuid.UUID, clase_update: ClaseIndividualUpdate) -> Optional[ClaseIndividualResponse]:
        """Actualizar una clase individual"""
        # Validaciones de negocio
        # Nota: No validamos fechas pasadas aquí (misma razón que en create_clase)
        
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
        # Nota: No validamos fechas pasadas aquí (misma razón que en create_clase)
        
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
    async def search_clases(db: AsyncSession, param: str, value: str, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[ClaseIndividualResponse]:
        """Buscar clases individuales por diferentes parámetros"""
        db_clases = await ClaseIndividualDAO.search(db, param, value, skip, limit)
        
        # Aplicar filtro adicional de status si está presente
        if status_filter is not None:
            db_clases = [clase for clase in db_clases if clase and clase.status == status_filter]
        else:
            db_clases = [clase for clase in db_clases if clase]
        
        return [ClaseIndividualResponse.model_validate(clase) for clase in db_clases]