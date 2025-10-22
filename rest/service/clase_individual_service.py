from sqlalchemy.ext.asyncio import AsyncSession
from ..dao.clase_individual_dao import ClaseIndividualDAO
from ..dao.cronograma_dao import CronogramaDAO
from ..schemas.clase_individual_schema import (
    ClaseIndividualCreate, 
    ClaseIndividualUpdate, 
    ClaseIndividualResponse,
    ClaseConCronograma,
    ClaseEstadisticas,
    EstadoClase
)
from ..models.clase_individual_model import ClaseIndividual
from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime, date, time
import logging

logger = logging.getLogger(__name__)

class ClaseIndividualService:
    
    @staticmethod
    async def create_clase(db: AsyncSession, clase: ClaseIndividualCreate) -> Tuple[Optional[ClaseIndividualResponse], str]:
        """Crear una nueva clase individual con validaciones de negocio"""
        try:
            # Validar que el cronograma existe
            cronograma = await CronogramaDAO.get_by_id(db, clase.id_cronograma)
            if not cronograma:
                return None, f"No existe un cronograma con ID {clase.id_cronograma"
            
            # Validar que el cronograma esté activo
            if not cronograma.status:
                return None, "No se puede crear una clase en un cronograma inactivo"
            
            # Validar que la fecha de la clase no sea en el pasado
            if clase.fecha_clase < date.today():
                return None, "No se puede crear una clase en una fecha pasada"
            
            # Validar que no haya conflicto de horarios en la misma fecha
            clases_mismo_dia = await ClaseIndividualDAO.get_by_fecha(db, clase.fecha_clase)
            for clase_existente in clases_mismo_dia:
                if (clase.hora_inicio < clase_existente.hora_fin and 
                    clase.hora_fin > clase_existente.hora_inicio):
                    return None, f"Conflicto de horarios con la clase '{clase_existente.titulo}' el {clase.fecha_clase}"
            
            # Crear la clase
            db_clase = await ClaseIndividualDAO.create(db, clase)
            
            # Convertir a response
            clase_response = ClaseIndividualResponse.model_validate(db_clase)
            
            logger.info(f"Clase creada exitosamente: ID {db_clase.id_clase}")
            return clase_response, "Clase creada exitosamente"
            
        except Exception as e:
            logger.error(f"Error creando clase: {str(e)}")
            return None, f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_clase_by_id(db: AsyncSession, id_clase: int) -> Tuple[Optional[ClaseIndividualResponse], str]:
        """Obtener clase por ID"""
        try:
            clase = await ClaseIndividualDAO.get_by_id(db, id_clase)
            if not clase:
                return None, "Clase no encontrada"
            
            clase_response = ClaseIndividualResponse.model_validate(clase)
            return clase_response, "Clase obtenida exitosamente"
            
        except Exception as e:
            logger.error(f"Error obteniendo clase {id_clase}: {str(e)}")
            return None, f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_all_clases(
        db: AsyncSession, 
        skip: int = 0, 
        limit: int = 100, 
        status_filter: Optional[bool] = None
    ) -> Tuple[List[ClaseIndividualResponse], str]:
        """Obtener todas las clases con filtros"""
        try:
            clases = await ClaseIndividualDAO.get_all(db, skip, limit, status_filter)
            
            clases_response = [
                ClaseIndividualResponse.model_validate(clase) 
                for clase in clases
            ]
            
            return clases_response, f"Se encontraron {len(clases_response)} clases"
            
        except Exception as e:
            logger.error(f"Error obteniendo clases: {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_clases_by_cronograma(
        db: AsyncSession, 
        id_cronograma: int, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[ClaseIndividualResponse], str]:
        """Obtener clases por cronograma"""
        try:
            # Validar que el cronograma existe
            cronograma = await CronogramaDAO.get_by_id(db, id_cronograma)
            if not cronograma:
                return [], f"No existe un cronograma con ID {id_cronograma}"
            
            clases = await ClaseIndividualDAO.get_by_cronograma(db, id_cronograma, skip, limit)
            
            clases_response = [
                ClaseIndividualResponse.model_validate(clase) 
                for clase in clases
            ]
            
            return clases_response, f"Se encontraron {len(clases_response)} clases para el cronograma {id_cronograma}"
            
        except Exception as e:
            logger.error(f"Error obteniendo clases por cronograma {id_cronograma}: {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_clases_by_estado(
        db: AsyncSession, 
        estado: EstadoClase, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[ClaseIndividualResponse], str]:
        """Obtener clases por estado"""
        try:
            clases = await ClaseIndividualDAO.get_by_estado(db, estado, skip, limit)
            
            clases_response = [
                ClaseIndividualResponse.model_validate(clase) 
                for clase in clases
            ]
            
            return clases_response, f"Se encontraron {len(clases_response)} clases con estado '{estado.value}'"
            
        except Exception as e:
            logger.error(f"Error obteniendo clases por estado {estado}: {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_clases_by_fecha(
        db: AsyncSession, 
        fecha_clase: date, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[ClaseIndividualResponse], str]:
        """Obtener clases por fecha"""
        try:
            clases = await ClaseIndividualDAO.get_by_fecha(db, fecha_clase, skip, limit)
            
            clases_response = [
                ClaseIndividualResponse.model_validate(clase) 
                for clase in clases
            ]
            
            return clases_response, f"Se encontraron {len(clases_response)} clases para la fecha {fecha_clase}"
            
        except Exception as e:
            logger.error(f"Error obteniendo clases por fecha {fecha_clase}: {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_clases_by_fecha_range(
        db: AsyncSession, 
        fecha_inicio: date, 
        fecha_fin: date, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[ClaseIndividualResponse], str]:
        """Obtener clases por rango de fechas"""
        try:
            if fecha_fin < fecha_inicio:
                return [], "La fecha de fin debe ser posterior a la fecha de inicio"
            
            clases = await ClaseIndividualDAO.get_by_fecha_range(db, fecha_inicio, fecha_fin, skip, limit)
            
            clases_response = [
                ClaseIndividualResponse.model_validate(clase) 
                for clase in clases
            ]
            
            return clases_response, f"Se encontraron {len(clases_response)} clases en el rango de fechas"
            
        except Exception as e:
            logger.error(f"Error obteniendo clases por rango de fechas: {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_proximas_clases(
        db: AsyncSession, 
        dias: int = 7, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[ClaseIndividualResponse], str]:
        """Obtener clases próximas"""
        try:
            clases = await ClaseIndividualDAO.get_proximas_clases(db, dias, skip, limit)
            
            clases_response = [
                ClaseIndividualResponse.model_validate(clase) 
                for clase in clases
            ]
            
            return clases_response, f"Se encontraron {len(clases_response)} clases próximas en {dias} días"
            
        except Exception as e:
            logger.error(f"Error obteniendo clases próximas: {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_clases_pasadas(
        db: AsyncSession, 
        dias: int = 30, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[ClaseIndividualResponse], str]:
        """Obtener clases pasadas"""
        try:
            clases = await ClaseIndividualDAO.get_clases_pasadas(db, dias, skip, limit)
            
            clases_response = [
                ClaseIndividualResponse.model_validate(clase) 
                for clase in clases
            ]
            
            return clases_response, f"Se encontraron {len(clases_response)} clases pasadas en {dias} días"
            
        except Exception as e:
            logger.error(f"Error obteniendo clases pasadas: {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def search_clases(
        db: AsyncSession, 
        search_term: str, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[ClaseIndividualResponse], str]:
        """Buscar clases por término"""
        try:
            if not search_term or len(search_term.strip()) < 2:
                return [], "El término de búsqueda debe tener al menos 2 caracteres"
            
            clases = await ClaseIndividualDAO.search(db, search_term.strip(), skip, limit)
            
            clases_response = [
                ClaseIndividualResponse.model_validate(clase) 
                for clase in clases
            ]
            
            return clases_response, f"Se encontraron {len(clases_response)} clases para '{search_term}'"
            
        except Exception as e:
            logger.error(f"Error buscando clases con término '{search_term}': {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def update_clase(
        db: AsyncSession, 
        id_clase: int, 
        clase_update: ClaseIndividualUpdate
    ) -> Tuple[Optional[ClaseIndividualResponse], str]:
        """Actualizar clase con validaciones"""
        try:
            # Verificar que la clase existe
            existing_clase = await ClaseIndividualDAO.get_by_id(db, id_clase)
            if not existing_clase:
                return None, "Clase no encontrada"
            
            # Validar fechas si se están actualizando
            update_data = clase_update.model_dump(exclude_unset=True)
            
            if 'fecha_clase' in update_data:
                if update_data['fecha_clase'] < date.today():
                    return None, "No se puede programar una clase en una fecha pasada"
            
            # Validar horarios si se están actualizando
            if 'hora_inicio' in update_data or 'hora_fin' in update_data:
                hora_inicio = update_data.get('hora_inicio', existing_clase.hora_inicio)
                hora_fin = update_data.get('hora_fin', existing_clase.hora_fin)
                
                if hora_fin <= hora_inicio:
                    return None, "La hora de fin debe ser posterior a la hora de inicio"
            
            # Validar conflictos de horarios si se cambia la fecha
            if 'fecha_clase' in update_data:
                nueva_fecha = update_data['fecha_clase']
                hora_inicio = update_data.get('hora_inicio', existing_clase.hora_inicio)
                hora_fin = update_data.get('hora_fin', existing_clase.hora_fin)
                
                clases_mismo_dia = await ClaseIndividualDAO.get_by_fecha(db, nueva_fecha)
                for clase_existente in clases_mismo_dia:
                    if (clase_existente.id_clase != id_clase and
                        hora_inicio < clase_existente.hora_fin and 
                        hora_fin > clase_existente.hora_inicio):
                        return None, f"Conflicto de horarios con la clase '{clase_existente.titulo}' el {nueva_fecha}"
            
            # Actualizar la clase
            updated_clase = await ClaseIndividualDAO.update(db, id_clase, clase_update)
            
            if not updated_clase:
                return None, "Error actualizando la clase"
            
            clase_response = ClaseIndividualResponse.model_validate(updated_clase)
            
            logger.info(f"Clase actualizada exitosamente: ID {id_clase}")
            return clase_response, "Clase actualizada exitosamente"
            
        except Exception as e:
            logger.error(f"Error actualizando clase {id_clase}: {str(e)}")
            return None, f"Error interno: {str(e)}"
    
    @staticmethod
    async def delete_clase(db: AsyncSession, id_clase: int) -> Tuple[bool, str]:
        """Eliminar clase (soft delete)"""
        try:
            # Verificar que la clase existe
            existing_clase = await ClaseIndividualDAO.get_by_id(db, id_clase)
            if not existing_clase:
                return False, "Clase no encontrada"
            
            # Verificar si la clase ya fue dictada
            if existing_clase.estado == EstadoClase.DICTADA:
                return False, "No se puede eliminar una clase que ya fue dictada"
            
            # Eliminar la clase
            success = await ClaseIndividualDAO.delete(db, id_clase)
            
            if success:
                logger.info(f"Clase eliminada exitosamente: ID {id_clase}")
                return True, "Clase eliminada exitosamente"
            else:
                return False, "Error eliminando la clase"
                
        except Exception as e:
            logger.error(f"Error eliminando clase {id_clase}: {str(e)}")
            return False, f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_clases_with_cronograma_info(
        db: AsyncSession, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[ClaseConCronograma], str]:
        """Obtener clases con información del cronograma"""
        try:
            clases_data = await ClaseIndividualDAO.get_clases_with_cronograma_info(db, skip, limit)
            
            clases_response = []
            for clase_data in clases_data:
                clase_info = {
                    "id_clase": clase_data["clase"].id_clase,
                    "id_cronograma": clase_data["clase"].id_cronograma,
                    "titulo": clase_data["clase"].titulo,
                    "descripcion": clase_data["clase"].descripcion,
                    "fecha_clase": clase_data["clase"].fecha_clase,
                    "hora_inicio": clase_data["clase"].hora_inicio,
                    "hora_fin": clase_data["clase"].hora_fin,
                    "estado": clase_data["clase"].estado,
                    "observaciones": clase_data["clase"].observaciones,
                    "status": clase_data["clase"].status,
                    "fecha_creacion": clase_data["clase"].fecha_creacion,
                    "fecha_modificacion": clase_data["clase"].fecha_modificacion,
                    "course_id": clase_data["course_id"],
                    "course_name": clase_data["course_name"],
                    "total_classes": clase_data["total_classes"]
                }
                clases_response.append(ClaseConCronograma.model_validate(clase_info))
            
            return clases_response, f"Se encontraron {len(clases_response)} clases con información del cronograma"
            
        except Exception as e:
            logger.error(f"Error obteniendo clases con información del cronograma: {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_estadisticas(db: AsyncSession) -> ClaseEstadisticas:
        """Obtener estadísticas de clases"""
        try:
            stats = await ClaseIndividualDAO.get_estadisticas(db)
            
            return ClaseEstadisticas(
                total_clases=stats.get('total_clases', 0),
                clases_programadas=stats.get('clases_programada', 0),
                clases_dictadas=stats.get('clases_dictada', 0),
                clases_reprogramadas=stats.get('clases_reprogramada', 0),
                clases_canceladas=stats.get('clases_cancelada', 0),
                clases_activas=stats.get('clases_activas', 0),
                clases_inactivas=stats.get('clases_inactivas', 0)
            )
            
        except Exception as e:
            logger.error(f"Error obteniendo estadísticas de clases: {str(e)}")
            return ClaseEstadisticas(
                total_clases=0,
                clases_programadas=0,
                clases_dictadas=0,
                clases_reprogramadas=0,
                clases_canceladas=0,
                clases_activas=0,
                clases_inactivas=0
            )
