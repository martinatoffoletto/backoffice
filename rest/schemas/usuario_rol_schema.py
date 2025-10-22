from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import uuid
from decimal import Decimal
from .rol_schema import CategoriaRol

class UsuarioRolCreate(BaseModel):
    id_usuario: uuid.UUID = Field(..., description="UUID del usuario")
    id_rol: uuid.UUID = Field(..., description="UUID del rol")

class UsuarioRol(BaseModel):
    id_usuario: uuid.UUID = Field(..., description="UUID del usuario")
    id_rol: uuid.UUID = Field(..., description="UUID del rol")

    class Config:
        from_attributes = True

# Schema para obtener información completa del rol
class RolDetallado(BaseModel):
    id_rol: uuid.UUID
    nombre_rol: str
    descripcion: Optional[str]
    subcategoria: Optional[CategoriaRol]
    sueldo_base: Decimal
    status: bool

    class Config:
        from_attributes = True

# Schema para obtener usuario con información detallada de sus roles
class UsuarioConRoles(BaseModel):
    id_usuario: uuid.UUID
    nombre: str
    apellido: str
    legajo: str
    dni: str
    correo_institucional: Optional[str]
    correo_personal: str
    telefono_personal: str
    fecha_alta: Optional[str]
    status: bool
    roles: List[RolDetallado] = Field(default_factory=list, description="Lista completa de roles del usuario")

    class Config:
        from_attributes = True
