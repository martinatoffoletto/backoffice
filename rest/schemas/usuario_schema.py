from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime


class Usuario(BaseModel):
    id_usuario: Optional[int] = Field(None, description="Identificador único del usuario")
    nombre: str = Field(..., description="Nombre del usuario")
    apellido: str = Field(..., description="Apellido del usuario")
    legajo: str = Field(..., description="Legajo único del usuario")
    dni: str = Field(..., description="DNI único del usuario")
    correo_institucional: Optional[str] = Field(None, description="Correo electrónico institucional")
    correo_personal: EmailStr = Field(..., description="Correo electrónico personal (obligatorio)")
    telefono_laboral: Optional[str] = Field(None, description="Teléfono laboral")
    telefono_personal: str = Field(..., description="Teléfono personal (obligatorio)")
    fecha_alta: Optional[datetime] = Field(None, description="Fecha de alta del usuario")
    status: bool = Field(True, description="Estado del usuario (activo/inactivo)")

    class Config:
        from_attributes = True


class UsuarioCreate(BaseModel):
    """Schema para crear un nuevo usuario"""
    nombre: str = Field(..., min_length=2, max_length=100, description="Nombre del usuario")
    apellido: str = Field(..., min_length=2, max_length=100, description="Apellido del usuario")
    legajo: str = Field(..., min_length=3, max_length=20, description="Legajo único del usuario")
    dni: str = Field(..., min_length=7, max_length=10, description="DNI único del usuario")
    correo_institucional: Optional[EmailStr] = Field(None, description="Correo electrónico institucional")
    correo_personal: EmailStr = Field(..., description="Correo electrónico personal (obligatorio)")
    telefono_laboral: Optional[str] = Field(None, max_length=20, description="Teléfono laboral")
    telefono_personal: str = Field(..., max_length=20, description="Teléfono personal (obligatorio)")

    class Config:
        json_schema_extra = {
            "example": {
                "nombre": "Juan",
                "apellido": "Pérez",
                "legajo": "USR001",
                "dni": "12345678",
                "correo_personal": "juan.perez@email.com",
                "telefono_personal": "1234567890",
                "correo_institucional": "juan.perez@institucion.edu",
                "telefono_laboral": "1122334455"
            }
        }


class UsuarioUpdate(BaseModel):
    """Schema para actualizar un usuario (todos los campos opcionales)"""
    nombre: Optional[str] = Field(None, min_length=2, max_length=100, description="Nombre del usuario")
    apellido: Optional[str] = Field(None, min_length=2, max_length=100, description="Apellido del usuario")
    legajo: Optional[str] = Field(None, min_length=3, max_length=20, description="Legajo único del usuario")
    dni: Optional[str] = Field(None, min_length=7, max_length=10, description="DNI único del usuario")
    correo_institucional: Optional[EmailStr] = Field(None, description="Correo electrónico institucional")
    correo_personal: Optional[EmailStr] = Field(None, description="Correo electrónico personal")
    telefono_laboral: Optional[str] = Field(None, max_length=20, description="Teléfono laboral")
    telefono_personal: Optional[str] = Field(None, max_length=20, description="Teléfono personal")
    status: Optional[bool] = Field(None, description="Estado del usuario (activo/inactivo)")

    class Config:
        json_schema_extra = {
            "example": {
                "nombre": "Juan Carlos",
                "telefono_personal": "9876543210"
            }
        }
