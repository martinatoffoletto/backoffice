from pydantic import BaseModel, EmailStr
from typing import List, Optional
from uuid import UUID

class LoginRequest(BaseModel):
    email_institucional: EmailStr
    contraseña: str  # Contraseña en texto plano (se compara con hash almacenado)

class RolInfo(BaseModel):
    id_rol: UUID
    descripcion: Optional[str]
    categoria: str
    subcategoria: Optional[str]
    
    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    id_usuario: UUID
    nombre: str
    apellido: str
    legajo: str
    dni: str
    email_institucional: Optional[str]
    rol: RolInfo
    
    class Config:
        from_attributes = True

class VerifyResponse(BaseModel):
    exists: bool
    active: bool
    email_institucional: str

class CurrentUserResponse(BaseModel):
    """Respuesta del endpoint /auth/me con información del usuario actual"""
    id_usuario: UUID
    nombre: str
    apellido: str
    legajo: str
    dni: str
    email_institucional: Optional[str]
    email_personal: Optional[str]
    telefono_personal: Optional[str]
    status: bool
    rol: RolInfo
    
    class Config:
        from_attributes = True