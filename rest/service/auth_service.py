from sqlalchemy.ext.asyncio import AsyncSession
from ..dao.auth_dao import AuthDAO
from ..dao.usuario_dao import UsuarioDAO
from ..dao.sueldo_dao import SueldoDAO
from ..dao.usuario_carrera_dao import UsuarioCarreraDAO
from ..schemas.auth_schema import LoginRequest, AuthResponse, RolInfo, SueldoDetallado, CarreraDetallada, VerifyResponse
from typing import Optional
import bcrypt

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
        
        # Verificar contraseña usando bcrypt (compara texto plano con hash almacenado)
        if not bcrypt.checkpw(login_request.contraseña.encode('utf-8'), usuario.contraseña.encode('utf-8')):
            return None
        
        # Crear objeto RolInfo
        rol_info = RolInfo(
            id_rol=usuario.rol.id_rol,
            descripcion=usuario.rol.descripcion,
            categoria=usuario.rol.categoria,
            subcategoria=usuario.rol.subcategoria,
            sueldo_base=float(usuario.rol.sueldo_base),
            status=usuario.rol.status
        )
        
        # Obtener sueldo o carrera del usuario
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
        
        return AuthResponse(
            id_usuario=usuario.id_usuario,
            nombre=usuario.nombre,
            apellido=usuario.apellido,
            legajo=usuario.legajo,
            dni=usuario.dni,
            email_institucional=usuario.email_institucional,
            rol=rol_info,
            sueldo=sueldo_detallado,
            carrera=carrera_detallada
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