from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
import uuid


class Usuario(BaseModel):
    id_usuario: Optional[uuid.UUID] = Field(None, description="Identificador único del usuario (UUID)")
    nombre: str = Field(..., min_length=2, max_length=100, description="Nombre del usuario")
    apellido: str = Field(..., min_length=2, max_length=100, description="Apellido del usuario")
    legajo: str = Field(..., min_length=3, max_length=20, description="Legajo único del usuario - generado automáticamente")
    dni: str = Field(..., min_length=7, max_length=10, description="DNI único del usuario")
    correo_institucional: Optional[EmailStr] = Field(None, description="Correo electrónico institucional - generado automáticamente")
    correo_personal: EmailStr = Field(..., description="Correo electrónico personal (obligatorio)")
    telefono_personal: str = Field(..., max_length=20, description="Teléfono personal (obligatorio)")
    contraseña: Optional[str] = Field(None, description="Contraseña del usuario")
    fecha_alta: Optional[datetime] = Field(None, description="Fecha de alta - se registra automáticamente")
    status: bool = Field(True, description="Estado del usuario (activo/inactivo)")

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "nombre": "Juan",
                "apellido": "Pérez",
                "legajo": "USR001",  #  automáticamente
                "dni": "12345678",
                "correo_personal": "juan.perez@email.com",
                "telefono_personal": "1234567890",
                "correo_institucional": "juan.perez@campusconnect.edu.ar",  #  automáticamente
                "status": True
            }
        }



###DTOs para crear y actualizar usuarios
class UsuarioCreate(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100, description="Nombre del usuario")
    apellido: str = Field(..., min_length=2, max_length=100, description="Apellido del usuario")
    dni: str = Field(..., min_length=7, max_length=10, description="DNI único del usuario")
    correo_personal: EmailStr = Field(..., description="Correo electrónico personal (obligatorio)")
    telefono_personal: str = Field(..., max_length=20, description="Teléfono personal (obligatorio)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "nombre": "Juan",
                "apellido": "Pérez", 
                "dni": "12345678",
                "correo_personal": "juan.perez@gmail.com",
                "telefono_personal": "1234567890"
            }
        }


class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=2, max_length=100, description="Nombre del usuario")
    apellido: Optional[str] = Field(None, min_length=2, max_length=100, description="Apellido del usuario")
    dni: Optional[str] = Field(None, min_length=7, max_length=10, description="DNI único del usuario")
    correo_personal: Optional[EmailStr] = Field(None, description="Correo electrónico personal")
    telefono_personal: Optional[str] = Field(None, max_length=20, description="Teléfono personal")
    correo_institucional: Optional[EmailStr] = Field(None, description="Correo electrónico institucional")
    contraseña: Optional[str] = Field(None, description="Nueva contraseña del usuario")
    status: Optional[bool] = Field(None, description="Estado del usuario (activo/inactivo)")

    class Config:
        json_schema_extra = {
            "example": {
                "telefono_personal": "0987654321",
                "correo_personal": "nuevo.email@gmail.com",
                "contraseña": "nuevaContraseña123",
                "status": False,
                "nombre": "Juan Carlos",
                "apellido": "Gómez",
                "dni": "87654321",
                "correo_institucional": "juan.gomez@campusconnect.edu.ar",
            }
        }