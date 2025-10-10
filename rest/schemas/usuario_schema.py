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
