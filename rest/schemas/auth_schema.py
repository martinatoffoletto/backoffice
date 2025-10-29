from pydantic import BaseModel, EmailStr
from typing import List, Optional
from uuid import UUID

class LoginRequest(BaseModel):
    email_institucional: EmailStr
    contraseña: str  # Ya viene hasheada

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