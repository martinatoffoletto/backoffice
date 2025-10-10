from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, time
from enum import Enum


class EstadoClase(str, Enum):
    PROGRAMADA = "programada"
    DICTADA = "dictada"
    REPROGRAMADA = "reprogramada"
    CANCELADA = "cancelada"


class ClaseIndividual(BaseModel):
    id_clase: Optional[int] = Field(None, description="Identificador único de la clase")
    id_cronograma: int = Field(..., description="ID del cronograma al que pertenece")
    titulo: str = Field(..., description="Título del tema de la clase")
    descripcion: Optional[str] = Field(None, description="Descripción detallada de la clase")
    fecha: datetime = Field(..., description="Fecha y hora de la clase")
    hora_inicio: time = Field(..., description="Hora de inicio de la clase")
    hora_fin: time = Field(..., description="Hora de finalización de la clase")
    estado: EstadoClase = Field(EstadoClase.PROGRAMADA, description="Estado de la clase")
    status: bool = Field(True, description="Estado de la clase (activo/inactivo)")

    class Config:
        from_attributes = True


# Schema adicional para mostrar clase con información del cronograma
class ClaseConCronograma(BaseModel):
    id_clase: int
    titulo: str
    descripcion: Optional[str]
    fecha: datetime
    hora_inicio: time
    hora_fin: time
    estado: EstadoClase
    status: bool
    curso_nombre: str = Field(..., description="Nombre del curso")
    courseId: str = Field(..., description="ID del curso del módulo CORE")

    class Config:
        from_attributes = True