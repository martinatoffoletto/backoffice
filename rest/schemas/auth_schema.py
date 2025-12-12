from pydantic import BaseModel, EmailStr, Field
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
    sueldo_base: float
    status: bool
    
    class Config:
        from_attributes = True

class SueldoDetallado(BaseModel):
    """Información detallada del sueldo"""
    id_sueldo: UUID
    cbu: str
    sueldo_adicional: float
    observaciones: Optional[str]
    status: bool
    
    class Config:
        from_attributes = True

class CarreraDetallada(BaseModel):
    """Información básica de carrera (solo ID ya que es entidad externa)"""
    id_carrera: UUID
    status: bool
    
    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    model_config = {"from_attributes": True, "exclude_none": True}
    
    id_usuario: UUID
    nombre: str
    apellido: str
    email_personal: Optional[str] = None
    telefono: Optional[str] = None
    legajo: str
    dni: str
    email_institucional: Optional[str]
    rol: RolInfo
    sueldo: Optional[SueldoDetallado] = None
    carrera: Optional[CarreraDetallada] = None

class VerifyResponse(BaseModel):
    exists: bool
    active: bool
    email_institucional: str