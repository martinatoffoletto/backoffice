from sqlalchemy.orm import Session
from ..dao.auth_dao import AuthDAO
from ..dao.usuario_dao import UsuarioDAO
from ..dao.usuario_rol_dao import UsuarioRolDAO
from ..schemas.auth_schema import LoginRequest, AuthResponse
from typing import Optional
from fastapi import HTTPException, status
import hashlib

class AuthService:
    
    def __init__(self, db: Session):
        self.db = db
        self.auth_dao = AuthDAO()
        self.usuario_dao = UsuarioDAO()
        self.usuario_rol_dao = UsuarioRolDAO()
    
    def authenticate_user(self, login_request: LoginRequest) -> AuthResponse:
        """
        Autenticar usuario por email y password.
        Retorna payload con legajo, nombre y roles asociados.
        """
        try:
            # Buscar usuario por email
            usuario = self.usuario_dao.get_by_email(self.db, login_request.email)
            
            if not usuario:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Credenciales incorrectas"
                )
            
            # Verificar que el usuario esté activo
            if not usuario.status:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Usuario inactivo"
                )
            
            # Verificar password
            if not self._verify_password(login_request.password, usuario.password):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Credenciales incorrectas"
                )
            
            # Obtener roles del usuario
            usuario_con_roles = self.usuario_rol_dao.get_usuario_with_roles_detailed(
                self.db, 
                usuario.id_usuario
            )
            
            # Construir respuesta
            auth_response = AuthResponse(
                legajo=usuario.legajo,
                nombre=f"{usuario.nombre} {usuario.apellido}",
                roles=usuario_con_roles.roles if usuario_con_roles else []
            )
            
            return auth_response
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno del servidor durante la autenticación"
            )
    
    def _verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verificar password usando hash simple.
        En producción se debería usar bcrypt o similar.
        """
        try:
            # Si el password almacenado parece ser un hash bcrypt
            if hashed_password.startswith('$2b$'):
                # Aquí deberías usar bcrypt.checkpw() cuando instales bcrypt
                # Por ahora, comparación simple para development
                return plain_password == "admin123"  # Password temporal para testing
            
            # Hash simple MD5 para desarrollo (NO usar en producción)
            password_hash = hashlib.md5(plain_password.encode()).hexdigest()
            return password_hash == hashed_password
            
        except Exception:
            return False
    
    def validate_user_access(self, email: str, required_roles: list = None) -> dict:
        """
        Validar que un usuario tiene acceso y roles requeridos
        """
        usuario = self.usuario_dao.get_by_email(self.db, email)
        
        if not usuario or not usuario.status:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario no autorizado"
            )
        
        # Obtener roles del usuario
        usuario_con_roles = self.usuario_rol_dao.get_usuario_with_roles_detailed(
            self.db, 
            usuario.id_usuario
        )
        
        user_roles = usuario_con_roles.roles if usuario_con_roles else []
        
        # Verificar roles requeridos si se especifican
        if required_roles:
            has_required_role = any(role in user_roles for role in required_roles)
            if not has_required_role:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Se requiere uno de los siguientes roles: {', '.join(required_roles)}"
                )
        
        return {
            "user_id": usuario.id_usuario,
            "legajo": usuario.legajo,
            "nombre": f"{usuario.nombre} {usuario.apellido}",
            "email": usuario.email,
            "roles": user_roles,
            "access_granted": True
        }
    
    def check_role_permission(self, email: str, role_name: str) -> bool:
        """
        Verificar si un usuario tiene un rol específico
        """
        try:
            usuario = self.usuario_dao.get_by_email(self.db, email)
            if not usuario:
                return False
            
            return self.usuario_rol_dao.usuario_has_rol(self.db, usuario.id_usuario, role_name)
            
        except Exception:
            return False
    
    def get_user_permissions(self, email: str) -> dict:
        """
        Obtener todos los permisos/roles de un usuario
        """
        usuario = self.usuario_dao.get_by_email(self.db, email)
        
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
        
        usuario_con_roles = self.usuario_rol_dao.get_usuario_with_roles_detailed(
            self.db, 
            usuario.id_usuario
        )
        
        return {
            "user_info": {
                "legajo": usuario.legajo,
                "nombre": f"{usuario.nombre} {usuario.apellido}",
                "email": usuario.email,
                "status": usuario.status
            },
            "roles": usuario_con_roles.roles if usuario_con_roles else [],
            "permissions": self._get_permissions_by_roles(usuario_con_roles.roles if usuario_con_roles else [])
        }
    
    def _get_permissions_by_roles(self, roles: list) -> dict:
        """
        Mapear roles a permisos específicos
        """
        permissions = {
            "can_read": False,
            "can_write": False,
            "can_delete": False,
            "can_admin": False,
            "modules": []
        }
        
        # Mapeo básico de roles a permisos
        role_permissions = {
            "Administrador": {
                "can_read": True,
                "can_write": True,
                "can_delete": True,
                "can_admin": True,
                "modules": ["usuarios", "roles", "parametros", "sedes", "espacios", "sueldos", "cronogramas", "clases", "evaluaciones"]
            },
            "Profesor": {
                "can_read": True,
                "can_write": True,
                "can_delete": False,
                "can_admin": False,
                "modules": ["cronogramas", "clases", "evaluaciones"]
            },
            "Estudiante": {
                "can_read": True,
                "can_write": False,
                "can_delete": False,
                "can_admin": False,
                "modules": ["cronogramas", "clases", "evaluaciones"]
            },
            "Secretaria": {
                "can_read": True,
                "can_write": True,
                "can_delete": False,
                "can_admin": False,
                "modules": ["usuarios", "cronogramas", "espacios", "sedes"]
            }
        }
        
        # Combinar permisos de todos los roles del usuario
        for role in roles:
            if role in role_permissions:
                role_perms = role_permissions[role]
                permissions["can_read"] = permissions["can_read"] or role_perms["can_read"]
                permissions["can_write"] = permissions["can_write"] or role_perms["can_write"]
                permissions["can_delete"] = permissions["can_delete"] or role_perms["can_delete"]
                permissions["can_admin"] = permissions["can_admin"] or role_perms["can_admin"]
                
                # Agregar módulos sin duplicados
                for module in role_perms["modules"]:
                    if module not in permissions["modules"]:
                        permissions["modules"].append(module)
        
        return permissions
    
    def logout_user(self, email: str) -> dict:
        """
        Logout del usuario (placeholder para futuras implementaciones con tokens)
        """
        return {
            "message": "Logout exitoso",
            "email": email,
            "logged_out_at": "2025-10-10T00:00:00Z"  # En producción usar datetime.utcnow()
        }