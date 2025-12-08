from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..schemas.auth_schema import LoginRequest, AuthResponse, VerifyResponse, CurrentUserResponse, RolInfo
from ..service.auth_service import AuthService
from ..database import get_async_db
from ..security.dependencies import get_current_active_user
from ..models.usuario_model import Usuario

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=AuthResponse)
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

@router.get("/me", response_model=CurrentUserResponse)
async def get_current_user_info(
    current_user: Usuario = Depends(get_current_active_user)
):
    """
    Obtener información del usuario actual desde el JWT validado.
    
    Este endpoint valida el token JWT del header Authorization y retorna
    la información del usuario autenticado.
    """
    try:
        # Asegurar que el rol esté cargado
        if not hasattr(current_user, 'rol') or current_user.rol is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error: rol no encontrado para el usuario"
            )
        
        rol_info = RolInfo(
            id_rol=current_user.rol.id_rol,
            descripcion=current_user.rol.descripcion,
            categoria=current_user.rol.categoria,
            subcategoria=current_user.rol.subcategoria
        )
        
        return CurrentUserResponse(
            id_usuario=current_user.id_usuario,
            nombre=current_user.nombre,
            apellido=current_user.apellido,
            legajo=current_user.legajo,
            dni=current_user.dni,
            email_institucional=current_user.email_institucional,
            email_personal=current_user.email_personal,
            telefono_personal=current_user.telefono_personal,
            status=current_user.status,
            rol=rol_info
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener información del usuario: {str(e)}"
        )
