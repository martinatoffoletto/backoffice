from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, time
from decimal import Decimal
from enum import Enum


class TipoEvaluacion(str, Enum):
    PARCIAL = "parcial"
    FINAL = "final"
    TRABAJO_PRACTICO = "trabajo_practico"
    OTRO = "otro"


class Evaluacion(BaseModel):
    id_evaluacion: Optional[int] = Field(None, description="Identificador único de la evaluación")
    id_cronograma: int = Field(..., description="ID del cronograma al que pertenece")
    nombre: str = Field(..., description="Nombre de la evaluación")
    descripcion: Optional[str] = Field(None, description="Descripción detallada de la evaluación")
    fecha: datetime = Field(..., description="Fecha de la evaluación")
    hora_inicio: time = Field(..., description="Hora de inicio de la evaluación")
    hora_fin: time = Field(..., description="Hora de finalización de la evaluación")
    tipo: TipoEvaluacion = Field(..., description="Tipo de evaluación")
    ponderacion: Decimal = Field(..., description="Porcentaje en la nota final (0-100)")
    status: bool = Field(True, description="Estado de la evaluación (activo/inactivo)")

    class Config:
        from_attributes = True


# Schema adicional para mostrar evaluación con información del cronograma
class EvaluacionConCronograma(BaseModel):
    id_evaluacion: int
    nombre: str
    descripcion: Optional[str]
    fecha: datetime
    hora_inicio: time
    hora_fin: time
    tipo: TipoEvaluacion
    ponderacion: Decimal
    status: bool
    curso_nombre: str = Field(..., description="Nombre del curso")
    courseId: str = Field(..., description="ID del curso del módulo CORE")

    class Config:
        from_attributes = True