"""
Dependencias de FastAPI para autenticación y autorización basada en JWT.
"""
from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import uuid
import logging

from ..database import get_async_db
from ..models.usuario_model import Usuario
from ..dao.usuario_dao import UsuarioDAO
from .jwt_handler import decode_token, validate_token_payload, get_token_from_header, TokenValidationError

logger = logging.getLogger(__name__)


async def get_current_user(
    authorization: Optional[str] = Header(None, alias="Authorization"),
    db: AsyncSession = Depends(get_async_db)
) -> Usuario:
    """
    Dependencia para obtener el usuario actual desde el JWT.
    
    Valida el token JWT, extrae la información del usuario y la obtiene de la BD.
    Verifica que el usuario exista y esté activo.
    
    Args:
        authorization: Header Authorization con el token
        db: Sesión de base de datos
        
    Returns:
        Usuario: Objeto Usuario con relación 'rol' cargada
        
    Raises:
        HTTPException 401: Si el token es inválido, expirado o el usuario no existe/inactivo
    """
    # Extraer token del header
    token = get_token_from_header(authorization)
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticación requerido",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        # Decodificar y validar el token
        payload = decode_token(token)
        
        # Validar estructura del payload
        token_data = validate_token_payload(payload)
        
        # Obtener user_id del token
        user_id_str = token_data["user_id"]
        
        try:
            user_id = uuid.UUID(user_id_str)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="ID de usuario inválido en el token"
            )
        
        # Obtener usuario de la BD
        usuario = await UsuarioDAO.get_by_id(db, user_id)
        
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario no encontrado"
            )
        
        # Verificar que el usuario esté activo
        if not usuario.status:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario inactivo"
            )
        
        # Cargar relación de rol si no está cargada
        if not hasattr(usuario, 'rol') or usuario.rol is None:
            await db.refresh(usuario, attribute_names=["rol"])
        
        # Validar que la categoría del token coincida con la BD (opcional pero recomendado)
        if usuario.rol and usuario.rol.categoria.upper() != token_data["categoria"]:
            logger.warning(
                f"Categoría de rol en token ({token_data['categoria']}) "
                f"no coincide con BD ({usuario.rol.categoria})"
            )
            # No lanzamos error, solo registramos warning (el token puede tener info desactualizada)
        
        return usuario
        
    except TokenValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error obteniendo usuario actual: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno al validar autenticación"
        )


async def get_current_active_user(
    current_user: Usuario = Depends(get_current_user)
) -> Usuario:
    """
    Dependencia para obtener el usuario actual activo.
    
    Verifica adicionalmente que el usuario esté activo (aunque ya se valida en get_current_user).
    
    Args:
        current_user: Usuario obtenido de get_current_user
        
    Returns:
        Usuario: Usuario activo
        
    Raises:
        HTTPException 401: Si el usuario no está activo
    """
    if not current_user.status:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inactivo"
        )
    return current_user


def require_roles(*allowed_categories: str):
    """
    Factory function que crea una dependencia para verificar que el usuario tenga uno de los roles permitidos.
    
    Uso:
        @router.get("/endpoint")
        async def my_endpoint(
            current_user: Usuario = Depends(require_roles("ADMINISTRADOR", "DOCENTE"))
        ):
            ...
    
    Args:
        *allowed_categories: Categorías de roles permitidas (ej: "ADMINISTRADOR", "DOCENTE")
        
    Returns:
        Función dependencia que verifica el rol
    """
    allowed_upper = [cat.upper() for cat in allowed_categories]
    
    async def check_role(current_user: Usuario = Depends(get_current_active_user)) -> Usuario:
        if not current_user.rol:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Usuario sin rol asignado"
            )
        
        user_category = current_user.rol.categoria.upper()
        
        if user_category not in allowed_upper:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Acceso denegado. Se requiere uno de los siguientes roles: {', '.join(allowed_categories)}"
            )
        
        return current_user
    
    return check_role


def require_admin():
    """
    Atajo para requerir rol ADMINISTRADOR.
    
    Uso:
        @router.post("/endpoint")
        async def my_endpoint(
            current_user: Usuario = Depends(require_admin())
        ):
            ...
    """
    return require_roles("ADMINISTRADOR")


def require_admin_or_docente():
    """
    Atajo para requerir rol ADMINISTRADOR o DOCENTE.
    
    Uso:
        @router.get("/endpoint")
        async def my_endpoint(
            current_user: Usuario = Depends(require_admin_or_docente())
        ):
            ...
    """
    return require_roles("ADMINISTRADOR", "DOCENTE")
