from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import uuid
from decimal import Decimal

class UsuarioCarreraCreate(BaseModel):
    id_usuario: uuid.UUID = Field(..., description="UUID del usuario")
    id_carrera: uuid.UUID = Field(..., description="UUID de la carrera")

class UsuarioCarrera(BaseModel):
    id_usuario: uuid.UUID = Field(..., description="UUID del usuario")
    id_carrera: uuid.UUID = Field(..., description="UUID de la carrera")

    class Config:
        from_attributes = True

# Schema para obtener información completa de la carrera
class CarreraDetallada(BaseModel):
    id_carrera: uuid.UUID
    nombre: str
    nivel: str
    duracion_anios: Optional[Decimal]
    status: bool

    class Config:
        from_attributes = True

# Schema para obtener usuario con información detallada de sus carreras
class UsuarioConCarreras(BaseModel):
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
    carreras: List[CarreraDetallada] = Field(default_factory=list, description="Lista completa de carreras del usuario")

    class Config:
        from_attributes = True