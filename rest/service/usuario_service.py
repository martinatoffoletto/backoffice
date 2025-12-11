from sqlalchemy.ext.asyncio import AsyncSession
from ..dao.usuario_dao import UsuarioDAO
from ..dao.sueldo_dao import SueldoDAO
from ..dao.usuario_carrera_dao import UsuarioCarreraDAO
from ..schemas.usuario_schema import (
    UsuarioCreate, UsuarioUpdate, UsuarioConRol,
    RolDetallado, SueldoDetallado, CarreraDetallada
)
from typing import List, Optional, Dict, Any, Tuple
import asyncio
from ..models.usuario_model import Usuario
import string
import random
import bcrypt
import uuid
import re
import unicodedata
import logging
from datetime import datetime, timezone
from ..messaging.producer import EventProducer
from ..messaging.event_builder import build_event

logger = logging.getLogger(__name__)

class UsuarioService:
    
    @staticmethod
    def _normalize_text(text: str) -> str:
        """
        Normaliza un texto para uso en email:
        - Convierte a minúsculas
        - Elimina acentos y caracteres especiales
        - Elimina espacios y caracteres no alfanuméricos
        - Mantiene solo letras y números
        """
        if not text:
            return ""
        
        # Normalizar unicode (NFD = descompone caracteres con acentos)
        text = unicodedata.normalize('NFD', text)
        
        # Eliminar diacríticos (acentos, tildes, etc.)
        text = ''.join(char for char in text if unicodedata.category(char) != 'Mn')
        
        # Convertir a minúsculas
        text = text.lower()
        
        # Eliminar todo lo que no sea letra o número
        text = re.sub(r'[^a-z0-9]', '', text)
        
        return text
    
    @staticmethod
    async def _generate_unique_email(db: AsyncSession, nombre: str, apellido: str) -> str:
        """
        Generar un email institucional único con formato:
        Primera letra del nombre + apellido completo (normalizado) @uade.edu.ar
        Ejemplo: Marcos Cavicchia -> mcavicchia@uade.edu.ar
        """
        # Obtener primera letra del nombre (normalizada)
        primera_letra = ""
        if nombre:
            nombre_normalizado = UsuarioService._normalize_text(nombre)
            if nombre_normalizado:
                primera_letra = nombre_normalizado[0]
        
        # Normalizar apellido completo
        apellido_normalizado = UsuarioService._normalize_text(apellido)
        
        if not primera_letra or not apellido_normalizado:
            # Fallback si no hay nombre o apellido válido
            base_email = f"{apellido_normalizado or 'user'}"
        else:
            base_email = f"{primera_letra}{apellido_normalizado}"
        
        counter = 1
        
        while True:
            if counter == 1:
                email = f"{base_email}@campusconnect.edu.ar"
            else:
                email = f"{base_email}{counter}@campusconnect.edu.ar"
            
            existing = await UsuarioDAO.get_by_email_institucional(db, email)
            if not existing:
                return email
            counter += 1
    
    @staticmethod
    async def _generate_unique_legajo(db: AsyncSession) -> str:
        while True:
            legajo = "USR" + ''.join(random.choices(string.digits, k=6))
            existing = await UsuarioDAO.get_by_legajo(db, legajo)
            if not existing:
                return legajo
    
    @staticmethod
    def _generate_password() -> str:
        chars = string.ascii_letters + string.digits + "!@#$%&*"
        return ''.join(random.choices(chars, k=8))
    
    @staticmethod
    def _hash_password(password: str) -> str:
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    @staticmethod
    async def _get_user_event_data(db: AsyncSession, usuario: Usuario) -> Dict[str, Any]:
        """
        Obtener información del rol, sueldo y carrera del usuario para eventos.
        Retorna diccionarios con la información necesaria.
        """
        # Obtener rol
        rol = getattr(usuario, "rol", None)
        if not rol:
            await db.refresh(usuario, attribute_names=["rol"])
            rol = getattr(usuario, "rol", None)
        
        rol_info = None
        if rol:
            rol_info = {
                "id_rol": str(rol.id_rol),
                "descripcion": rol.descripcion,
                "categoria": rol.categoria,
                "subcategoria": rol.subcategoria,
                "sueldo_base": float(rol.sueldo_base),
                "status": rol.status
            }
        
        # Obtener sueldo o carrera
        sueldo_info = None
        carrera_info = None
        
        sueldo = await SueldoDAO.get_sueldo_by_usuario(db, usuario.id_usuario)
        if sueldo:
            sueldo_info = {
                "id_sueldo": str(sueldo.id_sueldo),
                "cbu": sueldo.cbu,
                "sueldo_adicional": float(sueldo.sueldo_adicional or 0),
                "observaciones": sueldo.observaciones,
                "status": sueldo.status
            }
        else:
            carrera = await UsuarioCarreraDAO.get_carrera_by_usuario(db, usuario.id_usuario)
            if carrera:
                carrera_info = {
                    "id_carrera": str(carrera.id_carrera),
                    "status": carrera.status
                }
        
        return {
            "rol": rol_info,
            "sueldo": sueldo_info,
            "carrera": carrera_info
        }
    
    @staticmethod
    async def create_user(db: AsyncSession, usuario: UsuarioCreate) -> Tuple[Optional[Dict[str, Any]], str]:
        """Crear un nuevo usuario con validaciones completas"""
        # Generar datos únicos
        email_institucional = await UsuarioService._generate_unique_email(db, usuario.nombre, usuario.apellido)
        legajo = await UsuarioService._generate_unique_legajo(db)
        password = UsuarioService._generate_password()
        hashed_password = UsuarioService._hash_password(password)
        
        # Crear usuario (esto hace commit en la BD)
        created_user = await UsuarioDAO.create(db, usuario, hashed_password, legajo, email_institucional)
        
        # Capturar occurredAt justo después del commit (cuando ocurrió el cambio real)
        occurred_at = datetime.now(timezone.utc)
        
        # Obtener información del rol, sueldo y carrera
        event_data = await UsuarioService._get_user_event_data(db, created_user)
        
        # Preparar respuesta
        user_dict = {
            "id_usuario": str(created_user.id_usuario),
            "nombre": created_user.nombre,
            "apellido": created_user.apellido,
            "legajo": created_user.legajo,
            "dni": created_user.dni,
            "email_institucional": created_user.email_institucional,
            "email_personal": created_user.email_personal,
            "telefono_personal": created_user.telefono_personal,
            "fecha_alta": created_user.fecha_alta.isoformat() if created_user.fecha_alta else None,
            "id_rol": str(created_user.id_rol),
            "status": created_user.status
        }
        
        # Publicar evento user.created (emittedAt se genera en build_event)
        event = build_event(
            event_type="user.created",
            payload={
                "user_id": str(created_user.id_usuario),
                "nombre": created_user.nombre,
                "apellido": created_user.apellido,
                "legajo": created_user.legajo,
                "dni": created_user.dni,
                "email_institucional": created_user.email_institucional,
                "email_personal": created_user.email_personal,
                "telefono_personal": created_user.telefono_personal,
                "fecha_alta": created_user.fecha_alta.isoformat() if created_user.fecha_alta else None,
                "id_rol": str(created_user.id_rol),
                "status": created_user.status,
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
                f"✅ Evento user.created publicado correctamente para usuario: "
                f"user_id={created_user.id_usuario}, legajo={created_user.legajo}, "
                f"eventId={event.get('eventId')}"
            )
        else:
            logger.warning(
                f"⚠️ No se pudo publicar evento user.created para usuario: "
                f"user_id={created_user.id_usuario}, legajo={created_user.legajo}, "
                f"eventId={event.get('eventId')}"
            )
        
        return user_dict, password
    
    @staticmethod
    async def get_all_users(db: AsyncSession, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[UsuarioConRol]:
        usuarios = await UsuarioDAO.get_all(db, skip, limit, status_filter)
        if not usuarios:
            return []

        detailed_users = await asyncio.gather(
            *[
                UsuarioService._usuario_to_usuario_con_rol(db, usuario)
                for usuario in usuarios
                if usuario
            ]
        )
        return [usuario for usuario in detailed_users if usuario]
    
    
    @staticmethod
    async def search(
        db: AsyncSession,
        param: str,
        value: str,
        skip: int = 0,
        limit: int = 100,
        status_filter: Optional[bool] = None
    ) -> List[UsuarioConRol]:
        """Buscar usuarios con información del rol y al menos un único sueldo o carrera cuando existan."""
        param_lower = param.lower()
        usuarios = []
        
        search_value = value.strip()
        
        if param_lower in ["id"]:
            try:
                user_uuid = uuid.UUID(search_value)
                user = await UsuarioDAO.get_by_id(db, user_uuid)
                usuarios = [user] if user else []
            except ValueError:
                usuarios = []
        
        elif param_lower == "legajo":
            user = await UsuarioDAO.get_by_legajo(db, search_value)
            usuarios = [user] if user else []
        
        elif param_lower == "dni":
            usuarios = await UsuarioDAO.get_by_dni(db, search_value)
        
        elif param_lower in ["email_institucional"]:
            user = await UsuarioDAO.get_by_email_institucional(db, search_value)
            usuarios = [user] if user else []
        
        elif param_lower in ["email_personal"]:
            user = await UsuarioDAO.get_by_email_personal(db, search_value)
            usuarios = [user] if user else []
        
        
        elif param_lower in ["nombre"]:
            usuarios = await UsuarioDAO.search_by_name(db, search_value, skip, limit)
        
        elif param_lower == "status":
            status_bool = search_value.lower() in ["true", "1", "active"]
            usuarios = await UsuarioDAO.get_all(db, skip, limit, status_bool)
        
        if status_filter is not None:
            usuarios = [usuario for usuario in usuarios if usuario and usuario.status == status_filter]
        else:
            usuarios = [usuario for usuario in usuarios if usuario]

        if not usuarios:
            return []

        detailed_users = await asyncio.gather(
            *[
                UsuarioService._usuario_to_usuario_con_rol(db, usuario)
                for usuario in usuarios
            ]
        )
        return [usuario for usuario in detailed_users if usuario]
    
    @staticmethod
    async def update_user(db: AsyncSession, user_id: uuid.UUID, usuario_update: UsuarioUpdate):
        existing_user = await UsuarioDAO.get_by_id(db, user_id)
        if not existing_user:
            return None, "User not found"
        
        if usuario_update.id_rol is not None and usuario_update.id_rol != existing_user.id_rol:
            return None, "No se puede modificar el rol. Elimine el usuario y créelo nuevamente"
        
        if usuario_update.email_personal and usuario_update.email_personal != existing_user.email_personal:
            existing_by_email = await UsuarioDAO.get_by_email_personal(db, usuario_update.email_personal)
            if existing_by_email and existing_by_email.id_usuario != user_id:
                return None, "El email personal ingresado ya está registrado en otro usuario"
        
        if usuario_update.contraseña:
            usuario_update.contraseña = UsuarioService._hash_password(usuario_update.contraseña)
        
        if usuario_update.status is True and not existing_user.status:
            sueldo_inactivo = await SueldoDAO.get_sueldo_by_usuario(db, user_id, False)
            if sueldo_inactivo:
                await SueldoDAO.reactivate(db, user_id)
            carrera_inactiva = await UsuarioCarreraDAO.get_carrera_by_usuario(db, user_id, False)
            if carrera_inactiva:
                await UsuarioCarreraDAO.reactivate(db, user_id)
        
        # Actualizar usuario (esto hace commit en la BD)
        updated_user = await UsuarioDAO.update(db, user_id, usuario_update)
        
        # Capturar occurredAt justo después del commit (cuando ocurrió el cambio real)
        occurred_at = datetime.now(timezone.utc)
        
        # Obtener información del rol, sueldo y carrera del usuario actualizado
        # Usar updated_user si está disponible, sino existing_user
        user_for_event = updated_user if updated_user else existing_user
        event_data = await UsuarioService._get_user_event_data(db, user_for_event)
        
        # Publicar evento user.updated (emittedAt se genera en build_event)
        event = build_event(
            event_type="user.updated",
            payload={
                "user_id": str(user_id),
                "nombre": updated_user.nombre if hasattr(updated_user, 'nombre') else existing_user.nombre,
                "apellido": updated_user.apellido if hasattr(updated_user, 'apellido') else existing_user.apellido,
                "legajo": updated_user.legajo if hasattr(updated_user, 'legajo') else existing_user.legajo,
                "dni": updated_user.dni if hasattr(updated_user, 'dni') else existing_user.dni,
                "email_institucional": updated_user.email_institucional if hasattr(updated_user, 'email_institucional') else existing_user.email_institucional,
                "email_personal": updated_user.email_personal if hasattr(updated_user, 'email_personal') else existing_user.email_personal,
                "telefono_personal": updated_user.telefono_personal if hasattr(updated_user, 'telefono_personal') else existing_user.telefono_personal,
                "fecha_alta": (updated_user.fecha_alta.isoformat() if hasattr(updated_user, 'fecha_alta') and updated_user.fecha_alta else (existing_user.fecha_alta.isoformat() if existing_user.fecha_alta else None)),
                "id_rol": str(updated_user.id_rol) if hasattr(updated_user, 'id_rol') else str(existing_user.id_rol),
                "status": updated_user.status if hasattr(updated_user, 'status') else existing_user.status,
                "rol": event_data["rol"],
                "sueldo": event_data["sueldo"],
                "carrera": event_data["carrera"]
            },
            occurred_at=occurred_at
        )
        
        published = await EventProducer.publish(
            message=event,
            exchange_name="user.event",
            routing_key="user.updated"
        )
        
        if published:
            logger.info(
                f"✅ Evento user.updated publicado correctamente para usuario: "
                f"user_id={user_id}, legajo={existing_user.legajo}, "
                f"eventId={event.get('eventId')}"
            )
        else:
            logger.warning(
                f"⚠️ No se pudo publicar evento user.updated para usuario: "
                f"user_id={user_id}, legajo={existing_user.legajo}, "
                f"eventId={event.get('eventId')}"
            )
        
        return updated_user, "User updated successfully"
    
    @staticmethod
    async def delete_user(db: AsyncSession, user_id: uuid.UUID) -> bool:
        usuario = await UsuarioDAO.get_by_id(db, user_id)
        if not usuario:
            return False

        sueldo = await SueldoDAO.get_sueldo_by_usuario(db, user_id, True)
        if sueldo:
            await SueldoDAO.soft_delete(db, sueldo.id_sueldo)
        
        carrera = await UsuarioCarreraDAO.get_carrera_by_usuario(db, user_id, True)
        if carrera:
            await UsuarioCarreraDAO.soft_delete(db, carrera.id_usuario, carrera.id_carrera)

        # Obtener información del rol, sueldo y carrera antes de eliminar
        # Nota: obtenemos esta info antes de eliminar porque después el usuario ya no existe
        event_data = await UsuarioService._get_user_event_data(db, usuario)

        # Eliminar usuario (esto hace commit en la BD)
        deleted = await UsuarioDAO.delete(db, user_id)
        
        # Capturar occurredAt justo después del commit (cuando ocurrió el cambio real)
        occurred_at = datetime.now(timezone.utc)
        
        # Publicar evento user.deleted solo si se eliminó correctamente (emittedAt se genera en build_event)
        if deleted:
            event = build_event(
                event_type="user.deleted",
                payload={
                    "user_id": str(user_id),
                    "legajo": usuario.legajo,
                    "nombre": usuario.nombre,
                    "apellido": usuario.apellido,
                    "email_personal": usuario.email_personal,
                    "telefono_personal": usuario.telefono_personal,
                    "fecha_alta": usuario.fecha_alta.isoformat() if usuario.fecha_alta else None,
                    "rol": event_data["rol"],
                    "sueldo": event_data["sueldo"],
                    "carrera": event_data["carrera"]
                },
                occurred_at=occurred_at
            )
            
            published = await EventProducer.publish(
                message=event,
                exchange_name="user.event",
                routing_key="user.deleted"
            )
            
            if published:
                logger.info(
                    f"✅ Evento user.deleted publicado correctamente para usuario: "
                    f"user_id={user_id}, legajo={usuario.legajo}, "
                    f"eventId={event.get('eventId')}"
                )
            else:
                logger.warning(
                    f"⚠️ No se pudo publicar evento user.deleted para usuario: "
                    f"user_id={user_id}, legajo={usuario.legajo}, "
                    f"eventId={event.get('eventId')}"
                )
        
        return deleted
    
    @staticmethod
    async def _usuario_to_usuario_con_rol(db: AsyncSession, usuario: Usuario) -> Optional[UsuarioConRol]:
        """Expandir un usuario con su rol y la entidad asociada (sueldo o carrera)."""
        if not usuario:
            return None

        rol = getattr(usuario, "rol", None)
        if not rol:
            await db.refresh(usuario, attribute_names=["rol"])
            rol = getattr(usuario, "rol", None)

        if not rol:
            return None

        sueldo_detallado = None
        carrera_detallada = None

        sueldo = await SueldoDAO.get_sueldo_by_usuario(db, usuario.id_usuario)
        if sueldo:
            sueldo_detallado = SueldoDetallado(
                id_sueldo=sueldo.id_sueldo,
                cbu=sueldo.cbu,
                sueldo_adicional=float(sueldo.sueldo_adicional or 0),
                observaciones=sueldo.observaciones,
                status=sueldo.status
            )
        else:
            carrera = await UsuarioCarreraDAO.get_carrera_by_usuario(db, usuario.id_usuario)
            if carrera:
                carrera_detallada = CarreraDetallada(
                    id_carrera=carrera.id_carrera,
                    status=carrera.status
                )

        return UsuarioConRol(
            id_usuario=usuario.id_usuario,
            nombre=usuario.nombre,
            apellido=usuario.apellido,
            legajo=usuario.legajo,
            dni=usuario.dni,
            email_institucional=usuario.email_institucional,
            email_personal=usuario.email_personal,
            telefono_personal=usuario.telefono_personal,
            fecha_alta=usuario.fecha_alta,
            status=usuario.status,
            rol=RolDetallado(
                id_rol=rol.id_rol,
                descripcion=rol.descripcion,
                categoria=rol.categoria,
                subcategoria=rol.subcategoria,
                sueldo_base=float(rol.sueldo_base),
                status=rol.status
            ),
            sueldo=sueldo_detallado,
            carrera=carrera_detallada
        )
    
    @staticmethod
    def _user_to_dict(user) -> Dict[str, Any]:
        """Convertir usuario a diccionario"""
        return {
            "id_usuario": str(user.id_usuario),
            "nombre": user.nombre,
            "apellido": user.apellido,
            "legajo": user.legajo,
            "dni": user.dni,
            "email_institucional": user.email_institucional,
            "email_personal": user.email_personal,
            "telefono_personal": user.telefono_personal,
            "fecha_alta": user.fecha_alta.isoformat() if user.fecha_alta else None,
            "id_rol": str(user.id_rol),
            "status": user.status
        }