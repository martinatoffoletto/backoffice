from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
import uuid


class RolDetallado(BaseModel):
    """Información detallada del rol"""
    id_rol: uuid.UUID
    descripcion: Optional[str]
    categoria: str
    subcategoria: Optional[str]
    sueldo_base: float
    status: bool
    
    class Config:
        from_attributes = True


class SueldoDetallado(BaseModel):
    """Información detallada del sueldo"""
    id_sueldo: uuid.UUID
    cbu: str
    sueldo_adicional: float
    observaciones: Optional[str]
    status: bool
    
    class Config:
        from_attributes = True


class CarreraDetallada(BaseModel):
    """Información básica de carrera (solo ID ya que es entidad externa)"""
    id_carrera: uuid.UUID
    status: bool
    
    class Config:
        from_attributes = True


class Usuario(BaseModel):
    id_usuario: Optional[uuid.UUID] = Field(None, description="Identificador único del usuario (UUID)")
    nombre: str = Field(..., min_length=2, max_length=100, description="Nombre del usuario")
    apellido: str = Field(..., min_length=2, max_length=100, description="Apellido del usuario")
    legajo: str = Field(..., min_length=3, max_length=20, description="Legajo único del usuario - generado automáticamente")
    dni: str = Field(..., min_length=7, max_length=10, description="DNI único del usuario")
    email_institucional: Optional[EmailStr] = Field(None, description="Email institucional - generado automáticamente")
    email_personal: EmailStr = Field(..., description="Email personal (obligatorio)")
    telefono_personal: str = Field(..., max_length=20, description="Teléfono personal (obligatorio)")
    contraseña: Optional[str] = Field(None, description="Contraseña del usuario")
    fecha_alta: Optional[datetime] = Field(None, description="Fecha de alta - se registra automáticamente")
    id_rol: uuid.UUID = Field(..., description="UUID del rol asignado al usuario")
    status: bool = Field(True, description="Estado del usuario (activo/inactivo)")

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "nombre": "Juan",
                "apellido": "Pérez",
                "legajo": "USR001",  #  automáticamente
                "dni": "12345678",
                "email_personal": "juan.perez@email.com",
                "telefono_personal": "+54123456789",
                "email_institucional": "juan.perez@campusconnect.edu.ar",  #  automáticamente
                "status": True
            }
        }


class UsuarioConRol(BaseModel):
    id_usuario: uuid.UUID
    nombre: str
    apellido: str
    legajo: str
    dni: str
    email_institucional: Optional[str]
    email_personal: str
    telefono_personal: str
    fecha_alta: Optional[datetime]
    status: bool
    rol: RolDetallado
    sueldo: Optional[SueldoDetallado] = Field(default=None, description="Sueldo asociado al usuario")
    carrera: Optional[CarreraDetallada] = Field(default=None, description="Carrera asociada al usuario")
    
    class Config:
        from_attributes = True
        exclude_none = True


###DTOs para crear y actualizar usuarios
class UsuarioCreate(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100, description="Nombre del usuario")
    apellido: str = Field(..., min_length=2, max_length=100, description="Apellido del usuario")
    dni: str = Field(..., min_length=7, max_length=10, description="DNI único del usuario")
    email_personal: EmailStr = Field(..., description="Email personal (obligatorio)")
    telefono_personal: str = Field(..., max_length=20, description="Teléfono personal (obligatorio)")
    contraseña: str = Field(..., min_length=8, description="Contraseña del usuario")
    id_rol: uuid.UUID = Field(..., description="UUID del rol a asignar al usuario")
    
    class Config:
        json_schema_extra = {
            "example": {
                "nombre": "Juan",
                "apellido": "Pérez", 
                "dni": "12345678",
                "email_personal": "juan.perez@gmail.com",
                "telefono_personal": "1234567890",
                "contraseña": "password123",
                "id_rol": "550e8400-e29b-41d4-a716-446655440000"
            }
        }


class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=2, max_length=100, description="Nombre del usuario")
    apellido: Optional[str] = Field(None, min_length=2, max_length=100, description="Apellido del usuario")
    dni: Optional[str] = Field(None, min_length=7, max_length=10, description="DNI único del usuario")
    email_personal: Optional[EmailStr] = Field(None, description="Email personal")
    telefono_personal: Optional[str] = Field(None, max_length=20, description="Teléfono personal")
    email_institucional: Optional[EmailStr] = Field(None, description="Email institucional")
    contraseña: Optional[str] = Field(None, min_length=8, description="Nueva contraseña del usuario")
    id_rol: Optional[uuid.UUID] = Field(None, description="UUID del nuevo rol del usuario")
    status: Optional[bool] = Field(None, description="Estado del usuario (activo/inactivo)")

    class Config:
        from_attributes = True