from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..schemas.auth_schema import LoginRequest, AuthResponse, VerifyResponse
from ..service.auth_service import AuthService
from ..database import get_async_db

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=AuthResponse, response_model_exclude_none=True)
async def login(
    login_request: LoginRequest,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Autenticar usuario por email institucional y contraseña.
    La contraseña se envía en texto plano y se compara con el hash almacenado.
    Retorna información completa del usuario + rol.
    """
    try:
        auth_response = await AuthService.authenticate_user(db, login_request)
        
        if not auth_response:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas o usuario inactivo"
            )
        
        return auth_response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error en el login: {str(e)}"
        )

@router.get("/verify/{email_institucional}", response_model=VerifyResponse)
async def verify_user_exists(
    email_institucional: str,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Verificar si un usuario existe y está activo por email institucional
    """
    try:
        return await AuthService.verify_user_exists_and_active(db, email_institucional)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al verificar usuario: {str(e)}"
        )
