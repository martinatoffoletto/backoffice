from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal
from enum import Enum
import uuid


class CategoriaRol(str, Enum):
    DOCENTE = "docente"
    ADMINISTRATIVO = "administrativo"
    ADMINISTRATIVO_IT = "administrativo_it"
    ALUMNO = "alumno"

class RolBase(BaseModel):
    nombre_rol: str = Field(..., description="Nombre único del rol")
    descripcion: Optional[str] = Field(None, description="Descripción opcional del rol")
    subcategoria: Optional[CategoriaRol] = Field(None, description="Subcategoría específica del rol")
    sueldo_base: Decimal = Field(0, description="Sueldo base para este rol (0 para alumnos)")

class RolCreate(RolBase):
    status: bool = Field(True, description="Estado del rol (activo/inactivo)")

class RolUpdate(BaseModel):
    nombre_rol: Optional[str] = Field(None, description="Nombre único del rol")
    descripcion: Optional[str] = Field(None, description="Descripción opcional del rol")
    subcategoria: Optional[CategoriaRol] = Field(None, description="Subcategoría específica del rol")
    sueldo_base: Optional[Decimal] = Field(None, description="Sueldo base para este rol")
    status: Optional[bool] = Field(None, description="Estado del rol (activo/inactivo)")

class Rol(RolBase):
    id_rol: Optional[uuid.UUID] = Field(None, description="Identificador único del rol")
    status: bool = Field(True, description="Estado del rol (activo/inactivo)")

    class Config:
        from_attributes = True
