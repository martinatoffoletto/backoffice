"""
Módulo para validar tokens JWT generados por otro microservicio.
Este módulo NO genera tokens, solo los valida.
"""
import os
import logging
from typing import Dict, Optional
from jose import JWTError, jwt
from jose.exceptions import ExpiredSignatureError
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

# Configuración desde variables de entorno
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me-in-production-minimum-32-characters")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")


class TokenValidationError(Exception):
    """Excepción personalizada para errores de validación de tokens"""
    pass


def decode_token(token: str) -> Dict:
    """
    Decodificar y validar un token JWT.
    
    Args:
        token: Token JWT como string
        
    Returns:
        Dict con el payload decodificado
        
    Raises:
        TokenValidationError: Si el token es inválido, expirado o tiene firma incorrecta
    """
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )
        return payload
    except ExpiredSignatureError:
        logger.warning("Token expirado")
        raise TokenValidationError("Token expirado")
    except JWTError as e:
        logger.warning(f"Error validando token: {e}")
        raise TokenValidationError(f"Token inválido: {str(e)}")
    except Exception as e:
        logger.error(f"Error inesperado validando token: {e}")
        raise TokenValidationError(f"Error validando token: {str(e)}")


def validate_token_payload(payload: Dict) -> Dict:
    """
    Validar que el payload del token tenga los campos necesarios.
    
    Estructura esperada del payload:
    {
        "sub": str(user_id),  # REQUERIDO
        "email": str,  # Opcional
        "rol_id": str,  # Opcional
        "categoria": str,  # REQUERIDO para autorización
        "subcategoria": str,  # Opcional
        "exp": int,  # REQUERIDO (manejado por jwt.decode)
        "iat": int,  # Opcional
    }
    
    Args:
        payload: Payload decodificado del token
        
    Returns:
        Dict con los campos validados y normalizados
        
    Raises:
        TokenValidationError: Si faltan campos requeridos
    """
    # Validar campo 'sub' (subject/user_id) - REQUERIDO
    if "sub" not in payload:
        raise TokenValidationError("Token no contiene 'sub' (user_id)")
    
    # Validar campo 'categoria' - REQUERIDO para autorización
    if "categoria" not in payload:
        raise TokenValidationError("Token no contiene 'categoria' (requerido para autorización)")
    
    # Normalizar categoría a mayúsculas
    categoria = payload.get("categoria", "").upper()
    
    # Validar que la categoría sea una de las permitidas
    categorias_permitidas = ["ADMINISTRADOR", "DOCENTE", "ALUMNO"]
    if categoria not in categorias_permitidas:
        logger.warning(f"Categoría de rol no reconocida: {categoria}")
        # No lanzamos error, solo registramos warning (puede ser una categoría nueva)
    
    return {
        "user_id": payload["sub"],
        "email": payload.get("email"),
        "rol_id": payload.get("rol_id"),
        "categoria": categoria,
        "subcategoria": payload.get("subcategoria"),
        "iat": payload.get("iat"),
        "exp": payload.get("exp"),
        # Incluir todos los campos adicionales que pueda tener el token
        **{k: v for k, v in payload.items() if k not in ["sub", "email", "rol_id", "categoria", "subcategoria", "iat", "exp"]}
    }


def get_token_from_header(authorization: Optional[str]) -> Optional[str]:
    """
    Extraer el token del header Authorization.
    
    Formato esperado: "Bearer <token>"
    
    Args:
        authorization: Valor del header Authorization
        
    Returns:
        Token extraído o None si no está presente o tiene formato incorrecto
    """
    if not authorization:
        return None
    
    try:
        scheme, token = authorization.split(" ", 1)
        if scheme.lower() != "bearer":
            logger.warning(f"Esquema de autenticación no soportado: {scheme}")
            return None
        return token.strip()
    except ValueError:
        logger.warning("Formato incorrecto del header Authorization")
        return None
