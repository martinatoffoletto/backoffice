from pydantic import BaseModel, Field, field_validator
from typing import Optional
from decimal import Decimal
import uuid
from enum import Enum


class CategoriaRol(str, Enum):
    ADMINISTRADOR = "ADMINISTRADOR"
    DOCENTE = "DOCENTE"
    ALUMNO = "ALUMNO"


class RolBase(BaseModel):
    descripcion: Optional[str] = Field(None, description="Descripción opcional del rol")
    categoria: str = Field(..., max_length=50, description="Categoría principal del rol (ADMINISTRADOR, DOCENTE, ALUMNO)")
    subcategoria: Optional[str] = Field(None, max_length=50, description="Subcategoría específica del rol")
    sueldo_base: Decimal = Field(0, description="Sueldo base para este rol (0 para alumnos)")

    @field_validator('categoria')
    @classmethod
    def validate_categoria(cls, v):
        categorias_permitidas = [cat.value for cat in CategoriaRol]
        if v.upper() not in categorias_permitidas:
            raise ValueError(f"La categoría debe ser una de: {', '.join(categorias_permitidas)}")
        return v.upper()

class RolUpdate(BaseModel):
    descripcion: Optional[str] = Field(None, description="Descripción opcional del rol")
    categoria: Optional[str] = Field(None, max_length=50, description="Categoría principal del rol (ADMINISTRADOR, DOCENTE, ALUMNO)")
    subcategoria: Optional[str] = Field(None, max_length=50, description="Subcategoría específica del rol")
    sueldo_base: Optional[Decimal] = Field(None, description="Sueldo base para este rol")
    status: Optional[bool] = Field(None, description="Estado del rol (activo/inactivo)")

    @field_validator('categoria')
    @classmethod
    def validate_categoria(cls, v):
        if v is None:
            return v
        categorias_permitidas = [cat.value for cat in CategoriaRol]
        if v.upper() not in categorias_permitidas:
            raise ValueError(f"La categoría debe ser una de: {', '.join(categorias_permitidas)}")
        return v.upper()

class Rol(RolBase):
    id_rol: Optional[uuid.UUID] = Field(None, description="Identificador único del rol")
    status: bool = Field(True, description="Estado del rol (activo/inactivo)")

    class Config:
        from_attributes = True
