from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from ..database import get_db, connection_pool
from ..service.auth_service import AuthService
from ..schemas.auth_schema import LoginRequest, AuthResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=AuthResponse)
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """
    Endpoint para autenticación de usuarios.
    Recibe email y password, retorna nombre, apellido, legajo y roles asociados.
    """
    try:
        # Verificar si hay conexión a DB
        if connection_pool is None:
            raise HTTPException(
                status_code=503,
                detail="Base de datos no disponible. Servicio en mantenimiento."
            )
        
        # Usar el service para autenticación
        auth_service = AuthService(db)
        user_payload = auth_service.authenticate_user(credentials)
        
        return user_payload
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )