from sqlalchemy.ext.asyncio import AsyncSession
from ..dao.evaluacion_dao import EvaluacionDAO
from ..dao.cronograma_dao import CronogramaDAO
from ..schemas.evaluacion_schema import (
    EvaluacionCreate, 
    EvaluacionUpdate, 
    EvaluacionResponse,
    EvaluacionConCronograma,
    EvaluacionEstadisticas,
    TipoEvaluacion
)
from ..models.evaluacion_model import Evaluacion
from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime, date, time
from decimal import Decimal
import logging
import uuid

logger = logging.getLogger(__name__)

class EvaluacionService:
    
    @staticmethod
    async def create_evaluacion(db: AsyncSession, evaluacion: EvaluacionCreate) -> Tuple[Optional[EvaluacionResponse], str]:
        """Crear una nueva evaluación con validaciones de negocio"""
        try:
            # Validar que el cronograma existe
            cronograma = await CronogramaDAO.get_by_id(db, evaluacion.id_cronograma)
            if not cronograma:
                return None, f"No existe un cronograma con ID {evaluacion.id_cronograma}"
            
            # Validar que el cronograma esté activo
            if not cronograma.status:
                return None, "No se puede crear una evaluación en un cronograma inactivo"
            
            # Validar que la fecha de la evaluación no sea en el pasado
            if evaluacion.fecha < date.today():
                return None, "No se puede crear una evaluación en una fecha pasada"
            
            # Validar que no haya conflicto de horarios en la misma fecha
            evaluaciones_mismo_dia = await EvaluacionDAO.get_by_fecha(db, evaluacion.fecha)
            for evaluacion_existente in evaluaciones_mismo_dia:
                if (evaluacion.hora_inicio < evaluacion_existente.hora_fin and 
                    evaluacion.hora_fin > evaluacion_existente.hora_inicio):
                    return None, f"Conflicto de horarios con la evaluación '{evaluacion_existente.nombre}' el {evaluacion.fecha}"
            
            # Validar que la suma de ponderaciones no exceda 100%
            ponderacion_total_actual = await EvaluacionDAO.get_evaluaciones_by_ponderacion_total(db, evaluacion.id_cronograma)
            if ponderacion_total_actual + evaluacion.ponderacion > 100:
                return None, f"La suma de ponderaciones excedería 100%. Actual: {ponderacion_total_actual}%, Nueva: {evaluacion.ponderacion}%"
            
            # Crear la evaluación
            db_evaluacion = await EvaluacionDAO.create(db, evaluacion)
            
            # Convertir a response
            evaluacion_response = EvaluacionResponse.model_validate(db_evaluacion)
            
            logger.info(f"Evaluación creada exitosamente: ID {db_evaluacion.id_evaluacion}")
            return evaluacion_response, "Evaluación creada exitosamente"
            
        except Exception as e:
            logger.error(f"Error creando evaluación: {str(e)}")
            return None, f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_evaluacion_by_id(db: AsyncSession, id_evaluacion: uuid.UUID) -> Tuple[Optional[EvaluacionResponse], str]:
        """Obtener evaluación por ID"""
        try:
            evaluacion = await EvaluacionDAO.get_by_id(db, id_evaluacion)
            if not evaluacion:
                return None, "Evaluación no encontrada"
            
            evaluacion_response = EvaluacionResponse.model_validate(evaluacion)
            return evaluacion_response, "Evaluación obtenida exitosamente"
            
        except Exception as e:
            logger.error(f"Error obteniendo evaluación {id_evaluacion}: {str(e)}")
            return None, f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_all_evaluaciones(
        db: AsyncSession, 
        skip: int = 0, 
        limit: int = 100, 
        status_filter: Optional[bool] = None
    ) -> Tuple[List[EvaluacionResponse], str]:
        """Obtener todas las evaluaciones con filtros"""
        try:
            evaluaciones = await EvaluacionDAO.get_all(db, skip, limit, status_filter)
            
            evaluaciones_response = [
                EvaluacionResponse.model_validate(evaluacion) 
                for evaluacion in evaluaciones
            ]
            
            return evaluaciones_response, f"Se encontraron {len(evaluaciones_response)} evaluaciones"
            
        except Exception as e:
            logger.error(f"Error obteniendo evaluaciones: {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_evaluaciones_by_cronograma(
        db: AsyncSession, 
        id_cronograma: uuid.UUID, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[EvaluacionResponse], str]:
        """Obtener evaluaciones por cronograma"""
        try:
            # Validar que el cronograma existe
            cronograma = await CronogramaDAO.get_by_id(db, id_cronograma)
            if not cronograma:
                return [], f"No existe un cronograma con ID {id_cronograma}"
            
            evaluaciones = await EvaluacionDAO.get_by_cronograma(db, id_cronograma, skip, limit)
            
            evaluaciones_response = [
                EvaluacionResponse.model_validate(evaluacion) 
                for evaluacion in evaluaciones
            ]
            
            return evaluaciones_response, f"Se encontraron {len(evaluaciones_response)} evaluaciones para el cronograma {id_cronograma}"
            
        except Exception as e:
            logger.error(f"Error obteniendo evaluaciones por cronograma {id_cronograma}: {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_evaluaciones_by_tipo(
        db: AsyncSession, 
        tipo: TipoEvaluacion, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[EvaluacionResponse], str]:
        """Obtener evaluaciones por tipo"""
        try:
            evaluaciones = await EvaluacionDAO.get_by_tipo(db, tipo, skip, limit)
            
            evaluaciones_response = [
                EvaluacionResponse.model_validate(evaluacion) 
                for evaluacion in evaluaciones
            ]
            
            return evaluaciones_response, f"Se encontraron {len(evaluaciones_response)} evaluaciones de tipo '{tipo.value}'"
            
        except Exception as e:
            logger.error(f"Error obteniendo evaluaciones por tipo {tipo}: {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_evaluaciones_by_fecha(
        db: AsyncSession, 
        fecha: date, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[EvaluacionResponse], str]:
        """Obtener evaluaciones por fecha"""
        try:
            evaluaciones = await EvaluacionDAO.get_by_fecha(db, fecha, skip, limit)
            
            evaluaciones_response = [
                EvaluacionResponse.model_validate(evaluacion) 
                for evaluacion in evaluaciones
            ]
            
            return evaluaciones_response, f"Se encontraron {len(evaluaciones_response)} evaluaciones para la fecha {fecha}"
            
        except Exception as e:
            logger.error(f"Error obteniendo evaluaciones por fecha {fecha}: {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_evaluaciones_by_fecha_range(
        db: AsyncSession, 
        fecha_inicio: date, 
        fecha_fin: date, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[EvaluacionResponse], str]:
        """Obtener evaluaciones por rango de fechas"""
        try:
            if fecha_fin < fecha_inicio:
                return [], "La fecha de fin debe ser posterior a la fecha de inicio"
            
            evaluaciones = await EvaluacionDAO.get_by_fecha_range(db, fecha_inicio, fecha_fin, skip, limit)
            
            evaluaciones_response = [
                EvaluacionResponse.model_validate(evaluacion) 
                for evaluacion in evaluaciones
            ]
            
            return evaluaciones_response, f"Se encontraron {len(evaluaciones_response)} evaluaciones en el rango de fechas"
            
        except Exception as e:
            logger.error(f"Error obteniendo evaluaciones por rango de fechas: {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_proximas_evaluaciones(
        db: AsyncSession, 
        dias: int = 7, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[EvaluacionResponse], str]:
        """Obtener evaluaciones próximas"""
        try:
            evaluaciones = await EvaluacionDAO.get_proximas_evaluaciones(db, dias, skip, limit)
            
            evaluaciones_response = [
                EvaluacionResponse.model_validate(evaluacion) 
                for evaluacion in evaluaciones
            ]
            
            return evaluaciones_response, f"Se encontraron {len(evaluaciones_response)} evaluaciones próximas en {dias} días"
            
        except Exception as e:
            logger.error(f"Error obteniendo evaluaciones próximas: {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_evaluaciones_pasadas(
        db: AsyncSession, 
        dias: int = 30, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[EvaluacionResponse], str]:
        """Obtener evaluaciones pasadas"""
        try:
            evaluaciones = await EvaluacionDAO.get_evaluaciones_pasadas(db, dias, skip, limit)
            
            evaluaciones_response = [
                EvaluacionResponse.model_validate(evaluacion) 
                for evaluacion in evaluaciones
            ]
            
            return evaluaciones_response, f"Se encontraron {len(evaluaciones_response)} evaluaciones pasadas en {dias} días"
            
        except Exception as e:
            logger.error(f"Error obteniendo evaluaciones pasadas: {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def search_evaluaciones(
        db: AsyncSession, 
        search_term: str, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[EvaluacionResponse], str]:
        """Buscar evaluaciones por término"""
        try:
            if not search_term or len(search_term.strip()) < 2:
                return [], "El término de búsqueda debe tener al menos 2 caracteres"
            
            evaluaciones = await EvaluacionDAO.search(db, search_term.strip(), skip, limit)
            
            evaluaciones_response = [
                EvaluacionResponse.model_validate(evaluacion) 
                for evaluacion in evaluaciones
            ]
            
            return evaluaciones_response, f"Se encontraron {len(evaluaciones_response)} evaluaciones para '{search_term}'"
            
        except Exception as e:
            logger.error(f"Error buscando evaluaciones con término '{search_term}': {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_evaluaciones_by_ponderacion_range(
        db: AsyncSession, 
        ponderacion_min: Decimal, 
        ponderacion_max: Decimal, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[EvaluacionResponse], str]:
        """Obtener evaluaciones por rango de ponderación"""
        try:
            if ponderacion_min < 0 or ponderacion_max > 100 or ponderacion_min > ponderacion_max:
                return [], "Los valores de ponderación deben estar entre 0 y 100, y el mínimo debe ser menor al máximo"
            
            evaluaciones = await EvaluacionDAO.get_by_ponderacion_range(db, ponderacion_min, ponderacion_max, skip, limit)
            
            evaluaciones_response = [
                EvaluacionResponse.model_validate(evaluacion) 
                for evaluacion in evaluaciones
            ]
            
            return evaluaciones_response, f"Se encontraron {len(evaluaciones_response)} evaluaciones con ponderación entre {ponderacion_min}% y {ponderacion_max}%"
            
        except Exception as e:
            logger.error(f"Error obteniendo evaluaciones por rango de ponderación: {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def update_evaluacion(
        db: AsyncSession, 
        id_evaluacion: uuid.UUID, 
        evaluacion_update: EvaluacionUpdate
    ) -> Tuple[Optional[EvaluacionResponse], str]:
        """Actualizar evaluación con validaciones"""
        try:
            # Verificar que la evaluación existe
            existing_evaluacion = await EvaluacionDAO.get_by_id(db, id_evaluacion)
            if not existing_evaluacion:
                return None, "Evaluación no encontrada"
            
            # Validar fechas si se están actualizando
            update_data = evaluacion_update.model_dump(exclude_unset=True)
            
            if 'fecha' in update_data:
                if update_data['fecha'] < date.today():
                    return None, "No se puede programar una evaluación en una fecha pasada"
            
            # Validar horarios si se están actualizando
            if 'hora_inicio' in update_data or 'hora_fin' in update_data:
                hora_inicio = update_data.get('hora_inicio', existing_evaluacion.hora_inicio)
                hora_fin = update_data.get('hora_fin', existing_evaluacion.hora_fin)
                
                if hora_fin <= hora_inicio:
                    return None, "La hora de fin debe ser posterior a la hora de inicio"
            
            # Validar conflictos de horarios si se cambia la fecha
            if 'fecha' in update_data:
                nueva_fecha = update_data['fecha']
                hora_inicio = update_data.get('hora_inicio', existing_evaluacion.hora_inicio)
                hora_fin = update_data.get('hora_fin', existing_evaluacion.hora_fin)
                
                evaluaciones_mismo_dia = await EvaluacionDAO.get_by_fecha(db, nueva_fecha)
                for evaluacion_existente in evaluaciones_mismo_dia:
                    if (evaluacion_existente.id_evaluacion != id_evaluacion and
                        hora_inicio < evaluacion_existente.hora_fin and 
                        hora_fin > evaluacion_existente.hora_inicio):
                        return None, f"Conflicto de horarios con la evaluación '{evaluacion_existente.nombre}' el {nueva_fecha}"
            
            # Validar ponderación si se está actualizando
            if 'ponderacion' in update_data:
                nueva_ponderacion = update_data['ponderacion']
                ponderacion_actual = await EvaluacionDAO.get_evaluaciones_by_ponderacion_total(db, existing_evaluacion.id_cronograma)
                ponderacion_restante = ponderacion_actual - existing_evaluacion.ponderacion
                
                if ponderacion_restante + nueva_ponderacion > 100:
                    return None, f"La nueva ponderación excedería 100%. Disponible: {100 - ponderacion_restante}%"
            
            # Actualizar la evaluación
            updated_evaluacion = await EvaluacionDAO.update(db, id_evaluacion, evaluacion_update)
            
            if not updated_evaluacion:
                return None, "Error actualizando la evaluación"
            
            evaluacion_response = EvaluacionResponse.model_validate(updated_evaluacion)
            
            logger.info(f"Evaluación actualizada exitosamente: ID {id_evaluacion}")
            return evaluacion_response, "Evaluación actualizada exitosamente"
            
        except Exception as e:
            logger.error(f"Error actualizando evaluación {id_evaluacion}: {str(e)}")
            return None, f"Error interno: {str(e)}"
    
    @staticmethod
    async def delete_evaluacion(db: AsyncSession, id_evaluacion: uuid.UUID) -> Tuple[bool, str]:
        """Eliminar evaluación (soft delete)"""
        try:
            # Verificar que la evaluación existe
            existing_evaluacion = await EvaluacionDAO.get_by_id(db, id_evaluacion)
            if not existing_evaluacion:
                return False, "Evaluación no encontrada"
            
            # Eliminar la evaluación
            success = await EvaluacionDAO.delete(db, id_evaluacion)
            
            if success:
                logger.info(f"Evaluación eliminada exitosamente: ID {id_evaluacion}")
                return True, "Evaluación eliminada exitosamente"
            else:
                return False, "Error eliminando la evaluación"
                
        except Exception as e:
            logger.error(f"Error eliminando evaluación {id_evaluacion}: {str(e)}")
            return False, f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_evaluaciones_with_cronograma_info(
        db: AsyncSession, 
        skip: int = 0, 
        limit: int = 100
    ) -> Tuple[List[EvaluacionConCronograma], str]:
        """Obtener evaluaciones con información del cronograma"""
        try:
            evaluaciones_data = await EvaluacionDAO.get_evaluaciones_with_cronograma_info(db, skip, limit)
            
            evaluaciones_response = []
            for evaluacion_data in evaluaciones_data:
                evaluacion_info = {
                    "id_evaluacion": evaluacion_data["evaluacion"].id_evaluacion,
                    "id_cronograma": evaluacion_data["evaluacion"].id_cronograma,
                    "nombre": evaluacion_data["evaluacion"].nombre,
                    "descripcion": evaluacion_data["evaluacion"].descripcion,
                    "fecha": evaluacion_data["evaluacion"].fecha,
                    "hora_inicio": evaluacion_data["evaluacion"].hora_inicio,
                    "hora_fin": evaluacion_data["evaluacion"].hora_fin,
                    "tipo": evaluacion_data["evaluacion"].tipo,
                    "ponderacion": evaluacion_data["evaluacion"].ponderacion,
                    "observaciones": evaluacion_data["evaluacion"].observaciones,
                    "status": evaluacion_data["evaluacion"].status,
                    "fecha_creacion": evaluacion_data["evaluacion"].fecha_creacion,
                    "fecha_modificacion": evaluacion_data["evaluacion"].fecha_modificacion,
                    "course_id": evaluacion_data["course_id"],
                    "course_name": evaluacion_data["course_name"],
                    "total_classes": evaluacion_data["total_classes"]
                }
                evaluaciones_response.append(EvaluacionConCronograma.model_validate(evaluacion_info))
            
            return evaluaciones_response, f"Se encontraron {len(evaluaciones_response)} evaluaciones con información del cronograma"
            
        except Exception as e:
            logger.error(f"Error obteniendo evaluaciones con información del cronograma: {str(e)}")
            return [], f"Error interno: {str(e)}"
    
    @staticmethod
    async def get_estadisticas(db: AsyncSession) -> EvaluacionEstadisticas:
        """Obtener estadísticas de evaluaciones"""
        try:
            stats = await EvaluacionDAO.get_estadisticas(db)
            
            return EvaluacionEstadisticas(
                total_evaluaciones=stats.get('total_evaluaciones', 0),
                evaluaciones_parciales=stats.get('evaluaciones_parcial', 0),
                evaluaciones_finales=stats.get('evaluaciones_final', 0),
                evaluaciones_trabajo_practico=stats.get('evaluaciones_trabajo_practico', 0),
                evaluaciones_otro=stats.get('evaluaciones_otro', 0),
                evaluaciones_activas=stats.get('evaluaciones_activas', 0),
                evaluaciones_inactivas=stats.get('evaluaciones_inactivas', 0),
                ponderacion_total=stats.get('ponderacion_total', Decimal('0'))
            )
            
        except Exception as e:
            logger.error(f"Error obteniendo estadísticas de evaluaciones: {str(e)}")
            return EvaluacionEstadisticas(
                total_evaluaciones=0,
                evaluaciones_parciales=0,
                evaluaciones_finales=0,
                evaluaciones_trabajo_practico=0,
                evaluaciones_otro=0,
                evaluaciones_activas=0,
                evaluaciones_inactivas=0,
                ponderacion_total=Decimal('0')
            )
