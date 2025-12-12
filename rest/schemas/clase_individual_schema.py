from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime, date
from enum import Enum
import uuid


class EstadoClase(str, Enum):
    PROGRAMADA = "programada"
    DICTADA = "dictada"
    REPROGRAMADA = "reprogramada"
    CANCELADA = "cancelada"


class TipoClase(str, Enum):
    REGULAR = "regular"
    PARCIAL_1 = "parcial_1"
    PARCIAL_2 = "parcial_2"
    RECUPERATORIO = "recuperatorio"
    FINAL = "final"


class ClaseIndividual(BaseModel):
    id_clase: Optional[uuid.UUID] = Field(None, description="Identificador único de la clase")
    id_curso: uuid.UUID = Field(..., description="UUID del curso al que pertenece (entidad externa)")
    titulo: str = Field(..., min_length=3, max_length=200, description="Título de la clase")
    descripcion: Optional[str] = Field(None, description="Descripción detallada de la clase")
    fecha_clase: date = Field(..., description="Fecha programada de la clase")
    tipo: TipoClase = Field(TipoClase.REGULAR, description="Tipo de clase")
    estado: EstadoClase = Field(EstadoClase.PROGRAMADA, description="Estado actual de la clase")
    observaciones: Optional[str] = Field(None, description="Observaciones adicionales sobre la clase")
    status: bool = Field(True, description="Estado del registro (activo/inactivo)")

    class Config:
        from_attributes = True


class ClaseIndividualCreate(BaseModel):
    id_curso: uuid.UUID = Field(..., description="UUID del curso al que pertenece")
    titulo: str = Field(..., min_length=3, max_length=200, description="Título de la clase")
    descripcion: Optional[str] = Field(None, description="Descripción detallada de la clase")
    fecha_clase: date = Field(..., description="Fecha programada de la clase")
    tipo: TipoClase = Field(TipoClase.REGULAR, description="Tipo de clase")
    estado: EstadoClase = Field(EstadoClase.PROGRAMADA, description="Estado inicial de la clase")
    observaciones: Optional[str] = Field(None, description="Observaciones adicionales sobre la clase")

    class Config:
        from_attributes = True


class ClaseIndividualUpdate(BaseModel):
    titulo: Optional[str] = Field(None, min_length=3, max_length=200, description="Título de la clase")
    descripcion: Optional[str] = Field(None, description="Descripción detallada de la clase")
    fecha_clase: Optional[date] = Field(None, description="Fecha programada de la clase")
    tipo: Optional[TipoClase] = Field(None, description="Tipo de clase")
    estado: Optional[EstadoClase] = Field(None, description="Estado de la clase")
    observaciones: Optional[str] = Field(None, description="Observaciones adicionales sobre la clase")
    status: Optional[bool] = Field(None, description="Estado del registro (activo/inactivo)")

    class Config:
        from_attributes = True


class ClaseIndividualResponse(BaseModel):
    id_clase: uuid.UUID
    id_curso: uuid.UUID
    titulo: str
    descripcion: Optional[str]
    fecha_clase: date
    tipo: TipoClase
    estado: EstadoClase
    observaciones: Optional[str]
    status: bool

    @field_validator('tipo', mode='before')
    @classmethod
    def normalize_tipo(cls, v):
        if isinstance(v, str):
            return v.lower()
        return v
    
    @field_validator('estado', mode='before')
    @classmethod
    def normalize_estado(cls, v):
        if isinstance(v, str):
            return v.lower()
        return v

    class Config:
        from_attributes = True


# Schema para estadísticas de clases
class ClaseEstadisticas(BaseModel):
    total_clases: int = Field(..., description="Total de clases")
    clases_programadas: int = Field(..., description="Clases programadas")
    clases_dictadas: int = Field(..., description="Clases dictadas")
    clases_reprogramadas: int = Field(..., description="Clases reprogramadas")
    clases_canceladas: int = Field(..., description="Clases canceladas")

    class Config:
        from_attributes = True