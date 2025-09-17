from fastapi import APIRouter, Depends, status
from rest.service.auth_service import get_current_user
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(tags=["Auth"], prefix="/auth")

@router.post(
    "/token",
    summary="Emitir token JWT",
        description="Verifica credenciales y emite un token JWT para autenticación.\n\nEl token contiene la identidad del usuario (quién es) y su rol, permitiendo a los servicios validar permisos y autenticidad en cada petición sin consultar la base de datos.\n\nTodas las funciones protegidas del sistema requieren que el usuario envíe el token JWT en la cabecera Authorization",
    response_description="Token JWT emitido",
    responses={
        200: {"description": "Token emitido exitosamente"},
        400: {"description": "Datos inválidos"},
        401: {"description": "Credenciales incorrectas"},
        500: {"description": "Error interno del servidor"}
    }
)
async def get_me():
    """Verifica credenciales y emite un token JWT."""
    pass


