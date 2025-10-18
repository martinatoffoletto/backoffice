from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from decimal import Decimal
from enum import Enum


class NivelCarrera(str, Enum):
    TECNICATURA = "tecnicatura"
    PREGRADO = "pregrado"
    GRADO = "grado"
    POSGRADO = "posgrado"
    MAESTRIA = "maestria"
    DOCTORADO = "doctorado"
    OTRO = "otro"

class CarreraBase(BaseModel):
    nombre: str = Field(..., max_length=255, description="Nombre único de la carrera")
    nivel: NivelCarrera = Field(..., description="Nivel académico de la carrera")
    duracion_anios: Optional[Decimal] = Field(None, description="Duración en años (ej: 4.5)")

class CarreraCreate(CarreraBase):
    pass

class CarreraUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=255)
    nivel: Optional[NivelCarrera] = None
    duracion_anios: Optional[Decimal] = None
    status: Optional[bool] = None

class Carrera(CarreraBase):
    id_carrera: UUID = Field(..., description="Identificador único UUID de la carrera")
    status: bool = Field(True, description="Estado de la carrera (activo/inactivo)")

    class Config:
        from_attributes = True
