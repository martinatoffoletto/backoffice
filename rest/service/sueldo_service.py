from sqlalchemy.ext.asyncio import AsyncSession
from ..dao.sueldo_dao import SueldoDAO
from ..dao.usuario_dao import UsuarioDAO
from ..dao.usuario_carrera_dao import UsuarioCarreraDAO
from ..schemas.sueldo_schema import SueldoBase, SueldoUpdate, Sueldo as SueldoSchema
from ..models.sueldo_model import Sueldo
from typing import List, Optional, Tuple
import uuid
from datetime import datetime, timezone
from ..messaging.producer import EventProducer
from ..messaging.event_builder import build_event
import logging

logger = logging.getLogger(__name__)

class SueldoService:
    
    @staticmethod
    async def can_create_sueldo(db: AsyncSession, sueldo: SueldoBase) -> Tuple[bool, str]:
        
        usuario = await UsuarioDAO.get_by_id(db, sueldo.id_usuario)
        if not usuario or not usuario.status:
            return False, "Usuario no encontrado o inactivo"
        
        if usuario.rol and usuario.rol.categoria == "ALUMNO":
            return False, "No se puede crear un sueldo para un usuario con rol de ALUMNO"
        
        sueldo_exists = await SueldoDAO.get_sueldo_by_usuario(db, sueldo.id_usuario, True)
        if sueldo_exists:
            return False, "Ya existe un sueldo activo para este usuario"
        
        carrera = await UsuarioCarreraDAO.get_carrera_by_usuario(db, sueldo.id_usuario, True)
        if carrera:
            return False, "El usuario no puede tener sueldo y carrera simultáneamente"
        
        return True, ""
    
    @staticmethod
    async def create_sueldo(db: AsyncSession, sueldo: SueldoBase) -> Optional[Sueldo]:
        """
        Crear un nuevo sueldo para un usuario no-alumno.
        Publica el evento user.created después de la asignación exitosa.
        """
        can_create, _ = await SueldoService.can_create_sueldo(db, sueldo)
        if not can_create:
            return None
        
        # Crear el sueldo (esto hace commit en la BD)
        created_sueldo = await SueldoDAO.create(db, sueldo)
        
        # Capturar occurredAt justo después del commit (cuando ocurrió el cambio real)
        occurred_at = datetime.now(timezone.utc)
        
        # Obtener el usuario para el evento
        usuario = await UsuarioDAO.get_by_id(db, sueldo.id_usuario)
        if not usuario:
            return created_sueldo
        
        # Refrescar el usuario para obtener los datos más recientes
        await db.refresh(usuario)
        
        # Obtener información del rol, sueldo y carrera para el evento
        from .usuario_service import UsuarioService
        event_data = await UsuarioService._get_user_event_data(db, usuario)
        
        # Publicar evento user.created con toda la información completa
        event = build_event(
            event_type="user.created",
            payload={
                "user_id": str(usuario.id_usuario),
                "nombre": usuario.nombre,
                "apellido": usuario.apellido,
                "legajo": usuario.legajo,
                "dni": usuario.dni,
                "email_institucional": usuario.email_institucional,
                "email_personal": usuario.email_personal,
                "telefono_personal": usuario.telefono_personal,
                "fecha_alta": usuario.fecha_alta.isoformat() if usuario.fecha_alta else None,
                "id_rol": str(usuario.id_rol),
                "status": usuario.status,
                "rol": event_data["rol"],
                "sueldo": event_data["sueldo"],
                "carrera": event_data["carrera"]
            },
            occurred_at=occurred_at
        )
        
        published = await EventProducer.publish(
            message=event,
            exchange_name="user.event",
            routing_key="user.created"
        )
        
        if published:
            logger.info(
                f"✅ Evento user.created publicado correctamente para usuario NO-ALUMNO: "
                f"user_id={usuario.id_usuario}, legajo={usuario.legajo}, "
                f"id_sueldo={created_sueldo.id_sueldo}, eventId={event.get('eventId')}"
            )
        else:
            logger.warning(
                f"⚠️ No se pudo publicar evento user.created para usuario NO-ALUMNO: "
                f"user_id={usuario.id_usuario}, legajo={usuario.legajo}, "
                f"id_sueldo={created_sueldo.id_sueldo}, eventId={event.get('eventId')}"
            )
        
        return created_sueldo
    
    @staticmethod
    async def get_sueldo_by_id(db: AsyncSession, sueldo_id: uuid.UUID, status_filter: Optional[bool] = None) -> Optional[Sueldo]:
        """Obtener un sueldo por ID"""
        return await SueldoDAO.get_by_id(db, sueldo_id, status_filter)
    
    @staticmethod
    async def get_sueldo_by_usuario(db: AsyncSession, id_usuario: uuid.UUID, status_filter: Optional[bool] = None) -> Optional[Sueldo]:
        """Obtener el sueldo activo único de un usuario"""
        # Verificar que el usuario existe
        usuario = await UsuarioDAO.get_by_id(db, id_usuario)
        if not usuario:
            return None
        
        return await SueldoDAO.get_sueldo_by_usuario(db, id_usuario, status_filter)
    
    @staticmethod
    async def get_all_sueldos(db: AsyncSession, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[Sueldo]:
        """Obtener todos los sueldos con filtros"""
        return await SueldoDAO.get_all(db, skip, limit, status_filter)
    
    @staticmethod
    async def update_sueldo(db: AsyncSession, sueldo_id: uuid.UUID, sueldo_update: SueldoUpdate) -> Optional[Sueldo]:
        """Actualizar un sueldo"""
        # Verificar que el sueldo existe
        existing_sueldo = await SueldoDAO.get_by_id(db, sueldo_id)
        if not existing_sueldo:
            return None
        
        return await SueldoDAO.update(db, sueldo_id, sueldo_update)
    
    @staticmethod
    async def delete_sueldo(db: AsyncSession, sueldo_id: uuid.UUID) -> Tuple[bool, str]:
        existing_sueldo = await SueldoDAO.get_by_id(db, sueldo_id, True)
        if not existing_sueldo:
            return False, "Sueldo no encontrado"
        
        usuario = await UsuarioDAO.get_by_id(db, existing_sueldo.id_usuario)
        if usuario and usuario.status:
            return False, "No se puede eliminar el sueldo de un usuario activo"
        
        success = await SueldoDAO.soft_delete(db, sueldo_id)
        return success, "" if success else "Error al eliminar sueldo"
    
    @staticmethod
    async def search_sueldos(db: AsyncSession, param: str, value: str, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[Sueldo]:
        """Buscar sueldos por diferentes parámetros"""
        sueldos = await SueldoDAO.search(db, param, value, skip, limit)
        
        # Aplicar filtro adicional de status si está presente
        if status_filter is not None:
            sueldos = [sueldo for sueldo in sueldos if sueldo and sueldo.status == status_filter]
        else:
            sueldos = [sueldo for sueldo in sueldos if sueldo]
        
        return sueldos