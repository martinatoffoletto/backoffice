from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal
import uuid


class RolBase(BaseModel):
    descripcion: Optional[str] = Field(None, description="Descripción opcional del rol")
    categoria: str = Field(..., max_length=50, description="Categoría principal del rol (ADMIN, DOCENTE, ALUMNO, etc.)")
    subcategoria: Optional[str] = Field(None, max_length=50, description="Subcategoría específica del rol")
    sueldo_base: Decimal = Field(0, description="Sueldo base para este rol (0 para alumnos)")

class RolUpdate(BaseModel):
    descripcion: Optional[str] = Field(None, description="Descripción opcional del rol")
    categoria: Optional[str] = Field(None, max_length=50, description="Categoría principal del rol")
    subcategoria: Optional[str] = Field(None, max_length=50, description="Subcategoría específica del rol")
    sueldo_base: Optional[Decimal] = Field(None, description="Sueldo base para este rol")
    status: Optional[bool] = Field(None, description="Estado del rol (activo/inactivo)")

class Rol(RolBase):
    id_rol: Optional[uuid.UUID] = Field(None, description="Identificador único del rol")
    status: bool = Field(True, description="Estado del rol (activo/inactivo)")

    class Config:
        from_attributes = True
