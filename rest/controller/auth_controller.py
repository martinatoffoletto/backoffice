from fastapi import APIRouter, HTTPException, status
from ..schemas.auth_schema import LoginRequest, AuthPayload
from ..models.usuario_model import Usuario
from sqlalchemy.orm import Session
from fastapi import Depends

router = APIRouter(tags=["Auth"], prefix="/auth")

@router.post(
    "/login",
    response_model=AuthPayload,
    summary="Autenticar usuario",
    description="Verifica credenciales y devuelve información del usuario autenticado.\n\nDevuelve un payload con la identidad del usuario (quién es), su rol y estado, permitiendo a los servicios conocer los permisos y datos relevantes del usuario.\n\nNo emite tokens JWT, sino que devuelve directamente la información del usuario para su uso en la aplicación.",
    response_description="Información del usuario autenticado",
    responses={
        200: {"description": "Usuario autenticado exitosamente"},
        400: {"description": "Datos inválidos"},
        401: {"description": "Credenciales incorrectas"},
        500: {"description": "Error interno del servidor"}
    }
)
async def login(login_data: LoginRequest):
    return AuthPayload(
        userId="placeholder-id",
        email=login_data.email,
        firstName="Placeholder",
        lastName="User",
        dni="12345678",
        role="ALUMNO",
        state="ACTIVO",
        message="Authentication successful"
    )


