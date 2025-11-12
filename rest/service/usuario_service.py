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
    async def create_user(db: AsyncSession, usuario: UsuarioCreate) -> Tuple[Optional[Dict[str, Any]], str]:
        """Crear un nuevo usuario con validaciones completas"""
        # Generar datos únicos
        email_institucional = await UsuarioService._generate_unique_email(db, usuario.nombre, usuario.apellido)
        legajo = await UsuarioService._generate_unique_legajo(db)
        password = UsuarioService._generate_password()
        hashed_password = UsuarioService._hash_password(password)
        
        # Crear usuario
        created_user = await UsuarioDAO.create(db, usuario, hashed_password, legajo, email_institucional)
        
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
        
        if param_lower in ["id"]:
            try:
                user_uuid = uuid.UUID(value)
                user = await UsuarioDAO.get_by_id(db, user_uuid)
                usuarios = [user] if user else []
            except ValueError:
                usuarios = []
        
        elif param_lower == "legajo":
            user = await UsuarioDAO.get_by_legajo(db, value)
            usuarios = [user] if user else []
        
        elif param_lower == "dni":
            user = await UsuarioDAO.get_by_dni(db, value)
            usuarios = [user] if user else []
        
        elif param_lower in ["email_institucional"]:
            user = await UsuarioDAO.get_by_email_institucional(db, value)
            usuarios = [user] if user else []
        
        elif param_lower in ["email_personal"]:
            user = await UsuarioDAO.get_by_email_personal(db, value)
            usuarios = [user] if user else []
        
        
        elif param_lower in ["nombre"]:
            usuarios = await UsuarioDAO.search_by_name(db, value, skip, limit)
        
        elif param_lower == "status":
            status_bool = value.lower() in ["true", "1", "active"]
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
        # Hash de la contraseña si se está actualizando
        if usuario_update.contraseña:
            usuario_update.contraseña = UsuarioService._hash_password(usuario_update.contraseña)
        
        updated_user = await UsuarioDAO.update(db, user_id, usuario_update)
        return updated_user, "User updated successfully"
    
    @staticmethod
    async def delete_user(db: AsyncSession, user_id: uuid.UUID) -> bool:
        usuario = await UsuarioDAO.get_by_id(db, user_id)
        if not usuario:
            return False

        sueldo = await SueldoDAO.get_sueldo_by_usuario(db, user_id)
        if sueldo:
            await SueldoDAO.soft_delete(db, sueldo.id_sueldo)
        else:
            carrera = await UsuarioCarreraDAO.get_carrera_by_usuario(db, user_id)
            if carrera:
                await UsuarioCarreraDAO.soft_delete(db, carrera.id_usuario, carrera.id_carrera)

        return await UsuarioDAO.delete(db, user_id)
    
    @staticmethod
    async def _usuario_to_usuario_con_rol(db: AsyncSession, usuario: Usuario) -> Optional[UsuarioConRol]:
        """Expandir un usuario con su rol y la entidad asociada (sueldo o carrera)."""
        if not usuario:
            return None

        # Aseguramos tener datos de rol disponibles incluso si no se cargaron previamente.
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