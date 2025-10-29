from sqlalchemy.ext.asyncio import AsyncSession
from ..dao.auth_dao import AuthDAO
from ..dao.usuario_dao import UsuarioDAO
from ..schemas.auth_schema import LoginRequest, AuthResponse, RolInfo, VerifyResponse
from typing import Optional

class AuthService:
    
    @staticmethod
    async def authenticate_user(db: AsyncSession, login_request: LoginRequest) -> Optional[AuthResponse]:
        """
        Autenticar usuario por email institucional y contraseña.
        Retorna AuthResponse si la autenticación es exitosa, None si falla.
        """
        # Buscar usuario por email institucional con rol incluido
        usuario = await AuthDAO.get_user_by_email_institucional_with_rol(db, login_request.email_institucional)
        
        if not usuario:
            return None
        
        # Verificar que el usuario esté activo
        if not usuario.status:
            return None
        
        # Verificar contraseña (la contraseña ya viene hasheada)
        if login_request.contraseña != usuario.contraseña:
            return None
        
        # Crear objeto RolInfo
        rol_info = RolInfo(
            id_rol=usuario.rol.id_rol,
            descripcion=usuario.rol.descripcion,
            categoria=usuario.rol.categoria,
            subcategoria=usuario.rol.subcategoria
        )
        
        return AuthResponse(
            id_usuario=usuario.id_usuario,
            nombre=usuario.nombre,
            apellido=usuario.apellido,
            legajo=usuario.legajo,
            dni=usuario.dni,
            email_institucional=usuario.email_institucional,
            rol=rol_info
        )
    
    @staticmethod
    async def verify_user_exists_and_active(db: AsyncSession, email_institucional: str) -> VerifyResponse:
        """
        Verificar que un usuario existe y está activo
        Usa métodos existentes del UsuarioDAO y AuthDAO
        """
        exists = await AuthDAO.verify_user_exists_and_active(db, email_institucional)
        return VerifyResponse(
            exists=exists,
            active=exists,  # Si existe, está activo (ya filtramos por status=True)
            email_institucional=email_institucional
        )