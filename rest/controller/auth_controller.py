from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..service.auth_service import AuthService
from ..schemas.auth_schema import LoginRequest, AuthResponse
from typing import List

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=AuthResponse)
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """
    Endpoint para autenticación de usuarios.
    Recibe email y password, retorna legajo, nombre y roles asociados.
    """
    try:
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

@router.get("/validate/{email}")
async def validate_user_access(email: str, db: Session = Depends(get_db)):
    """
    Validar acceso de usuario y obtener sus permisos
    """
    try:
        auth_service = AuthService(db)
        permissions = auth_service.get_user_permissions(email)
        return permissions
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )