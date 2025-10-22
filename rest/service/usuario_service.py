from sqlalchemy.ext.asyncio import AsyncSession
from ..dao.usuario_dao import UsuarioDAO
from ..schemas.usuario_schema import UsuarioCreate, UsuarioUpdate
from typing import List, Optional, Dict, Any, Tuple
from ..models.usuario_model import Usuario
import string
import random
import bcrypt
import uuid

class UsuarioService:
    
    @staticmethod
    async def _generate_unique_email(db: AsyncSession, nombre: str, apellido: str) -> str:
        base_email = f"{apellido.lower()}.{nombre.lower()}"
        counter = 1
        
        while True:
            if counter == 1:
                email = f"{base_email}@campusconnect.edu.ar"
            else:
                email = f"{base_email}{counter}@campusconnect.edu.ar"
            
            existing = await UsuarioDAO.get_by_email(db, email)
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
        if await UsuarioDAO.get_by_dni(db, usuario.dni):
            return None, "User with this DNI already exists"
        
        email = await UsuarioService._generate_unique_email(db, usuario.nombre, usuario.apellido)
        legajo = await UsuarioService._generate_unique_legajo(db)
        password = UsuarioService._generate_password()
        hashed_password = UsuarioService._hash_password(password)
        
        created_user = await UsuarioDAO.create(db, usuario, hashed_password, legajo, email)
        
        user_dict = {
            "id_usuario": str(created_user.id_usuario),
            "nombre": created_user.nombre,
            "apellido": created_user.apellido,
            "legajo": created_user.legajo,
            "dni": created_user.dni,
            "correo_institucional": created_user.correo_institucional,
            "correo_personal": created_user.correo_personal,
            "telefono_personal": created_user.telefono_personal,
            "fecha_alta": created_user.fecha_alta.isoformat() if created_user.fecha_alta else None,
            "status": created_user.status
        }
        
        return user_dict, password
    
    @staticmethod
    async def get_all_users(db: AsyncSession, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None):
        return await UsuarioDAO.get_all(db, skip, limit, status_filter)
    
    @staticmethod
    async def search(db: AsyncSession, param: str, value: str, skip: int = 0, limit: int = 100):
        param_lower = param.lower()
        
        if param_lower in ["id", "id_usuario"]:
            try:
                user_uuid = uuid.UUID(value)
                user = await UsuarioDAO.get_by_id(db, user_uuid)
                return [user] if user else []
            except ValueError:
                return []
        
        elif param_lower == "legajo":
            user = await UsuarioDAO.get_by_legajo(db, value)
            return [user] if user else []
        
        elif param_lower == "dni":
            user = await UsuarioDAO.get_by_dni(db, value)
            return [user] if user else []
        
        elif param_lower in ["email", "correo_institucional"]:
            user = await UsuarioDAO.get_by_email(db, value)
            return [user] if user else []
        
        elif param_lower in ["name", "nombre_apellido", "search"]:
            return await UsuarioDAO.search_by_name(db, value, skip, limit)
        
        elif param_lower == "status":
            status_bool = value.lower() in ["true", "1", "active"]
            return await UsuarioDAO.get_all(db, skip, limit, status_bool)
        
        return []
    
    @staticmethod
    async def update_user(db: AsyncSession, user_id: uuid.UUID, usuario_update: UsuarioUpdate):
        if usuario_update.dni:
            existing = await UsuarioDAO.get_by_dni(db, usuario_update.dni)
            if existing and existing.id_usuario != user_id:
                return None
        
        if usuario_update.contraseña:
            usuario_update.contraseña = UsuarioService._hash_password(usuario_update.contraseña)
        
        return await UsuarioDAO.update(db, user_id, usuario_update)
    
    @staticmethod
    async def delete_user(db: AsyncSession, user_id: uuid.UUID) -> bool:
        return await UsuarioDAO.delete(db, user_id)
    
    @staticmethod
    def _user_to_dict(user) -> Dict[str, Any]:
        return {
            "id_usuario": str(user.id_usuario),
            "nombre": user.nombre,
            "apellido": user.apellido,
            "legajo": user.legajo,
            "dni": user.dni,
            "correo_institucional": user.correo_institucional,
            "correo_personal": user.correo_personal,
            "telefono_personal": user.telefono_personal,
            "fecha_alta": user.fecha_alta.isoformat() if user.fecha_alta else None,
            "status": user.status
        }