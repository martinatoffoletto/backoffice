from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..schemas.auth_schema import LoginRequest, AuthResponse, VerifyResponse
from ..service.auth_service import AuthService
from ..database import get_async_db
from ..dao.usuario_dao import UsuarioDAO

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
    Si el usuario existe pero está inactivo, retorna 404 Not Found.
    """
    try:
        # Verificar si el usuario existe (sin importar su estado)
        usuario = await UsuarioDAO.get_by_email_institucional(db, login_request.email_institucional)
        
        # Si el usuario existe pero está inactivo, retornar 404
        if usuario and not usuario.status:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
        
        # Intentar autenticar (esto manejará el caso de usuario no existente o credenciales incorrectas)
        auth_response = await AuthService.authenticate_user(db, login_request)
        
        if not auth_response:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas"
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
