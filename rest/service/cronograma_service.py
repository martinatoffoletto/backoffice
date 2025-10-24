"""
Servicio de lógica de negocio para cronogramas.

Este módulo contiene la lógica de negocio para la gestión de cronogramas,
incluyendo validaciones, reglas de negocio y coordinación entre DAOs.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from ..dao.cronograma_dao import CronogramaDAO
from ..schemas.cronograma_schema import CronogramaCreate, CronogramaUpdate, CronogramaResponse
from ..models.cronograma_model import Cronograma
from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime, date
import logging
import uuid

logger = logging.getLogger(__name__)

class CronogramaService:
    """
    Servicio de lógica de negocio para cronogramas.
    
    Proporciona métodos de alto nivel para la gestión de cronogramas,
    incluyendo validaciones de negocio y coordinación entre componentes.
    """
    
    @staticmethod
    async def create_cronograma(db: AsyncSession, cronograma: CronogramaCreate) -> Tuple[Optional[CronogramaResponse], str]:
        """
        Crear un nuevo cronograma con validaciones de negocio.
        
        Args:
            db: Sesión de base de datos asíncrona
            cronograma: Datos del cronograma a crear
            
        Returns:
            Tuple[Optional[CronogramaResponse], str]: Tupla con el cronograma creado (o None) y mensaje
        """
        try:
            # Validar que el course_id no esté duplicado para el mismo curso
            existing_cronogramas = await CronogramaDAO.get_by_course_id(db, cronograma.course_id)
            if existing_cronogramas:
                return None, f"Ya existe un cronograma para el curso ID {cronograma.course_id}"
            
            # Validar fechas si están presentes
            if cronograma.fecha_inicio and cronograma.fecha_fin:
                if cronograma.fecha_fin < cronograma.fecha_inicio:
                    return None, "La fecha de fin debe ser posterior a la fecha de inicio"
            
            # Crear el cronograma
            db_cronograma = await CronogramaDAO.create(db, cronograma)
            
            # Convertir a response
            cronograma_response = CronogramaResponse.model_validate(db_cronograma)
            
            logger.info(f"Cronograma creado exitosamente: ID {db_cronograma.id_cronograma}")
            return cronograma_response, "Cronograma creado exitosamente"
            
        except Exception as e:
            logger.error(f"Error creando cronograma: {str(e)}")
            return None, f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_cronograma_by_id(db: AsyncSession, id_cronograma: uuid.UUID) -> Tuple[Optional[CronogramaResponse], str]:
        """
        Obtener un cronograma por su ID.
        
        Args:
            db: Sesión de base de datos asíncrona
            id_cronograma: UUID del cronograma a buscar
            
        Returns:
            Tuple[Optional[CronogramaResponse], str]: Tupla con el cronograma (o None) y mensaje
        """
        try:
            cronograma = await CronogramaDAO.get_by_id(db, id_cronograma)
            if not cronograma:
                return None, "Cronograma no encontrado"
            
            cronograma_response = CronogramaResponse.model_validate(cronograma)
            return cronograma_response, "Cronograma obtenido exitosamente"
            
        except Exception as e:
            logger.error(f"Error obteniendo cronograma {id_cronograma}: {str(e)}")
            return None, f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_all_cronogramas(
        db: AsyncSession, 
        skip: int = 0, 
        limit: int = 100, 
        status_filter: Optional[bool] = None
    ) -> Tuple[List[CronogramaResponse], str]:
        """
        Obtener todos los cronogramas con filtros opcionales.
        
        Args:
            db: Sesión de base de datos asíncrona
            skip: Número de registros a omitir (paginación)
            limit: Número máximo de registros a retornar
            status_filter: Filtrar por estado (True=activo, False=inactivo, None=todos activos)
            
        Returns:
            Tuple[List[CronogramaResponse], str]: Tupla con lista de cronogramas y mensaje
        """
        try:
            cronogramas = await CronogramaDAO.get_all(db, skip, limit, status_filter)
            
            cronogramas_response = [
                CronogramaResponse.model_validate(cronograma) 
                for cronograma in cronogramas
            ]
            
            return cronogramas_response, f"Se encontraron {len(cronogramas_response)} cronogramas"
            
        except Exception as e:
            logger.error(f"Error obteniendo cronogramas: {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_cronogramas_by_course_id(
        db: AsyncSession, 
        course_id: int, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[CronogramaResponse], str]:
        """Obtener cronogramas por ID de curso"""
        try:
            cronogramas = await CronogramaDAO.get_by_course_id(db, course_id, skip, limit)
            
            cronogramas_response = [
                CronogramaResponse.model_validate(cronograma) 
                for cronograma in cronogramas
            ]
            
            return cronogramas_response, f"Se encontraron {len(cronogramas_response)} cronogramas para el curso {course_id}"
            
        except Exception as e:
            logger.error(f"Error obteniendo cronogramas por curso {course_id}: {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def search_cronogramas(
        db: AsyncSession, 
        search_term: str, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[CronogramaResponse], str]:
        """Buscar cronogramas por término"""
        try:
            if not search_term or len(search_term.strip()) < 2:
                return [], "El término de búsqueda debe tener al menos 2 caracteres"
            
            cronogramas = await CronogramaDAO.search(db, search_term.strip(), skip, limit)
            
            cronogramas_response = [
                CronogramaResponse.model_validate(cronograma) 
                for cronograma in cronogramas
            ]
            
            return cronogramas_response, f"Se encontraron {len(cronogramas_response)} cronogramas para '{search_term}'"
            
        except Exception as e:
            logger.error(f"Error buscando cronogramas con término '{search_term}': {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def update_cronograma(
        db: AsyncSession, 
        id_cronograma: uuid.UUID, 
        cronograma_update: CronogramaUpdate
    ) -> Tuple[Optional[CronogramaResponse], str]:
        """Actualizar cronograma con validaciones"""
        try:
            # Verificar que el cronograma existe
            existing_cronograma = await CronogramaDAO.get_by_id(db, id_cronograma)
            if not existing_cronograma:
                return None, "Cronograma no encontrado"
            
            # Validar fechas si se están actualizando
            update_data = cronograma_update.model_dump(exclude_unset=True)
            
            if 'fecha_inicio' in update_data and 'fecha_fin' in update_data:
                if update_data['fecha_fin'] and update_data['fecha_inicio']:
                    if update_data['fecha_fin'] < update_data['fecha_inicio']:
                        return None, "La fecha de fin debe ser posterior a la fecha de inicio"
            elif 'fecha_inicio' in update_data and existing_cronograma.fecha_fin:
                if existing_cronograma.fecha_fin < update_data['fecha_inicio']:
                    return None, "La fecha de inicio debe ser anterior a la fecha de fin existente"
            elif 'fecha_fin' in update_data and existing_cronograma.fecha_inicio:
                if update_data['fecha_fin'] < existing_cronograma.fecha_inicio:
                    return None, "La fecha de fin debe ser posterior a la fecha de inicio existente"
            
            # Actualizar el cronograma
            updated_cronograma = await CronogramaDAO.update(db, id_cronograma, cronograma_update)
            
            if not updated_cronograma:
                return None, "Error actualizando el cronograma"
            
            cronograma_response = CronogramaResponse.model_validate(updated_cronograma)
            
            logger.info(f"Cronograma actualizado exitosamente: ID {id_cronograma}")
            return cronograma_response, "Cronograma actualizado exitosamente"
            
        except Exception as e:
            logger.error(f"Error actualizando cronograma {id_cronograma}: {str(e)}")
            return None, f"Error interno: {str(e)}"
    
    @staticmethod
    async def delete_cronograma(db: AsyncSession, id_cronograma: uuid.UUID) -> Tuple[bool, str]:
        """Eliminar cronograma (soft delete)"""
        try:
            # Verificar que el cronograma existe
            existing_cronograma = await CronogramaDAO.get_by_id(db, id_cronograma)
            if not existing_cronograma:
                return False, "Cronograma no encontrado"
            
            # Verificar si tiene clases o evaluaciones asociadas
            if existing_cronograma.clases:
                return False, "No se puede eliminar un cronograma que tiene clases asociadas"
            
            if existing_cronograma.evaluaciones:
                return False, "No se puede eliminar un cronograma que tiene evaluaciones asociadas"
            
            # Eliminar el cronograma
            success = await CronogramaDAO.delete(db, id_cronograma)
            
            if success:
                logger.info(f"Cronograma eliminado exitosamente: ID {id_cronograma}")
                return True, "Cronograma eliminado exitosamente"
            else:
                return False, "Error eliminando el cronograma"
                
        except Exception as e:
            logger.error(f"Error eliminando cronograma {id_cronograma}: {str(e)}")
            return False, f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_cronogramas_by_date_range(
        db: AsyncSession, 
        fecha_inicio: date, 
        fecha_fin: date, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[CronogramaResponse], str]:
        """Obtener cronogramas por rango de fechas"""
        try:
            if fecha_fin < fecha_inicio:
                return [], "La fecha de fin debe ser posterior a la fecha de inicio"
            
            cronogramas = await CronogramaDAO.get_by_date_range(db, fecha_inicio, fecha_fin, skip, limit)
            
            cronogramas_response = [
                CronogramaResponse.model_validate(cronograma) 
                for cronograma in cronogramas
            ]
            
            return cronogramas_response, f"Se encontraron {len(cronogramas_response)} cronogramas en el rango de fechas"
            
        except Exception as e:
            logger.error(f"Error obteniendo cronogramas por rango de fechas: {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_cronogramas_statistics(db: AsyncSession) -> Dict[str, Any]:
        """Obtener estadísticas de cronogramas"""
        try:
            total_cronogramas = await CronogramaDAO.count(db)
            active_cronogramas = await CronogramaDAO.get_active_cronogramas_count(db)
            cronogramas_with_classes = await CronogramaDAO.get_cronogramas_with_classes(db, limit=1000)
            
            return {
                "total_cronogramas": total_cronogramas,
                "active_cronogramas": active_cronogramas,
                "inactive_cronogramas": total_cronogramas - active_cronogramas,
                "cronogramas_with_classes": len(cronogramas_with_classes),
                "cronogramas_without_classes": active_cronogramas - len(cronogramas_with_classes)
            }
            
        except Exception as e:
            logger.error(f"Error obteniendo estadísticas de cronogramas: {str(e)}")
            return {
                "total_cronogramas": 0,
                "active_cronogramas": 0,
                "inactive_cronogramas": 0,
                "cronogramas_with_classes": 0,
                "cronogramas_without_classes": 0
            }
