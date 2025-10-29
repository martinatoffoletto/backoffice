from sqlalchemy.ext.asyncio import AsyncSession
from ..dao.usuario_dao import UsuarioDAO
from ..dao.sueldo_dao import SueldoDAO
from ..dao.usuario_carrera_dao import UsuarioCarreraDAO
from ..schemas.usuario_schema import (
    UsuarioCreate, UsuarioUpdate, UsuarioCompleto, UsuarioConRol,
    RolDetallado, SueldoDetallado, CarreraDetallada
)
from typing import List, Optional, Dict, Any, Tuple
from ..models.usuario_model import Usuario
import string
import random
import bcrypt
import uuid

class UsuarioService:
    
    @staticmethod
    async def _generate_unique_email(db: AsyncSession, nombre: str, apellido: str) -> str:
        """Generar un email institucional único"""
        base_email = f"{apellido.lower()}.{nombre.lower()}"
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
        # Validar DNI único
        if await UsuarioDAO.get_by_dni(db, usuario.dni):
            return None, "User with this DNI already exists"
        
        # Validar email personal único
        if await UsuarioDAO.get_by_email_personal(db, usuario.email_personal):
            return None, "User with this personal email already exists"
        
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
        """Obtener todos los usuarios con información del rol"""
        usuarios = await UsuarioDAO.get_all(db, skip, limit, status_filter)
        return [UsuarioService._usuario_to_usuario_con_rol(usuario) for usuario in usuarios]
    
    @staticmethod
    async def get_user_by_id_completo(db: AsyncSession, user_id: uuid.UUID) -> Optional[UsuarioCompleto]:
        """Obtener usuario por ID con toda la información detallada (rol, sueldos O carreras)"""
        usuario = await UsuarioDAO.get_by_id(db, user_id)
        if not usuario:
            return None
        
        # Determinar si el usuario debe tener sueldos o carreras según su rol
        tiene_sueldos = UsuarioService._rol_tiene_sueldos(usuario.rol.categoria)
        
        sueldos = []
        carreras = []
        
        if tiene_sueldos:
            # Solo obtener sueldos si el rol corresponde
            sueldos = await SueldoDAO.get_sueldos_by_usuario(db, user_id)
        else:
            # Solo obtener carreras si el rol corresponde
            carreras = await UsuarioCarreraDAO.get_carreras_by_usuario(db, user_id)
        
        # Preparar los datos según el tipo de rol
        sueldos_data = None
        carreras_data = None
        
        if tiene_sueldos:
            sueldos_data = [SueldoDetallado(
                id_sueldo=sueldo.id_sueldo,
                cbu=sueldo.cbu,
                sueldo_adicional=float(sueldo.sueldo_adicional),
                observaciones=sueldo.observaciones,
                status=sueldo.status
            ) for sueldo in sueldos]
        else:
            carreras_data = [CarreraDetallada(
                id_carrera=carrera.id_carrera
            ) for carrera in carreras]
        
        return UsuarioCompleto(
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
            tipo_info_adicional="sueldos" if tiene_sueldos else "carreras",
            rol=RolDetallado(
                id_rol=usuario.rol.id_rol,
                descripcion=usuario.rol.descripcion,
                categoria=usuario.rol.categoria,
                subcategoria=usuario.rol.subcategoria,
                sueldo_base=float(usuario.rol.sueldo_base),
                status=usuario.rol.status
            ),
            sueldos=sueldos_data,
            carreras=carreras_data
        )
    
    @staticmethod
    def _rol_tiene_sueldos(categoria: str) -> bool:
        """
        Determinar si un rol debe tener sueldos o carreras según su categoría.
        
        Roles con sueldos: DOCENTE, ADMINISTRATIVO, DIRECTIVO, etc.
        Roles con carreras: ALUMNO, ESTUDIANTE, etc.
        """
        categorias_con_sueldos = [
            "DOCENTE", 
            "ADMINISTRATIVO", 
            "DIRECTIVO", 
            "COORDINADOR",
            "SECRETARIO",
            "DECANO",
            "RECTOR",
            "PERSONAL"
        ]
        
        return categoria.upper() in categorias_con_sueldos
    
    @staticmethod
    async def search(db: AsyncSession, param: str, value: str, skip: int = 0, limit: int = 100) -> List[UsuarioConRol]:
        """Buscar usuarios con información del rol incluida"""
        param_lower = param.lower()
        usuarios = []
        
        if param_lower in ["id", "id_usuario"]:
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
        
        elif param_lower in ["email"]:
            # Buscar en ambos tipos de email
            user = await UsuarioDAO.get_by_email_institucional(db, value)
            if not user:
                user = await UsuarioDAO.get_by_email_personal(db, value)
            usuarios = [user] if user else []
        
        elif param_lower in ["name", "nombre_apellido", "search"]:
            usuarios = await UsuarioDAO.search_by_name(db, value, skip, limit)
        
        elif param_lower == "status":
            status_bool = value.lower() in ["true", "1", "active"]
            usuarios = await UsuarioDAO.get_all(db, skip, limit, status_bool)
        
        # Convertir a UsuarioConRol
        return [UsuarioService._usuario_to_usuario_con_rol(usuario) for usuario in usuarios if usuario]
    
    @staticmethod
    async def update_user(db: AsyncSession, user_id: uuid.UUID, usuario_update: UsuarioUpdate):
        """Actualizar usuario con validaciones"""
        # Validar DNI único si se está actualizando
        if usuario_update.dni:
            existing = await UsuarioDAO.get_by_dni(db, usuario_update.dni)
            if existing and existing.id_usuario != user_id:
                return None, "User with this DNI already exists"
        
        # Validar email personal único si se está actualizando
        if usuario_update.email_personal:
            existing = await UsuarioDAO.get_by_email_personal(db, usuario_update.email_personal)
            if existing and existing.id_usuario != user_id:
                return None, "User with this personal email already exists"
        
        # Hash de la contraseña si se está actualizando
        if usuario_update.contraseña:
            usuario_update.contraseña = UsuarioService._hash_password(usuario_update.contraseña)
        
        updated_user = await UsuarioDAO.update(db, user_id, usuario_update)
        return updated_user, "User updated successfully"
    
    @staticmethod
    async def delete_user(db: AsyncSession, user_id: uuid.UUID) -> bool:
        return await UsuarioDAO.delete(db, user_id)
    
    @staticmethod
    def _usuario_to_usuario_con_rol(usuario: Usuario) -> UsuarioConRol:
        """Convertir Usuario a UsuarioConRol"""
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
                id_rol=usuario.rol.id_rol,
                descripcion=usuario.rol.descripcion,
                categoria=usuario.rol.categoria,
                subcategoria=usuario.rol.subcategoria,
                sueldo_base=float(usuario.rol.sueldo_base),
                status=usuario.rol.status
            )
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