from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime, time, date
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
    nombre: str = Field(..., min_length=3, max_length=200, description="Nombre de la evaluación")
    descripcion: Optional[str] = Field(None, max_length=1000, description="Descripción detallada de la evaluación")
    fecha: date = Field(..., description="Fecha programada de la evaluación")
    hora_inicio: time = Field(..., description="Hora de inicio de la evaluación")
    hora_fin: time = Field(..., description="Hora de finalización de la evaluación")
    tipo: TipoEvaluacion = Field(..., description="Tipo de evaluación")
    ponderacion: Decimal = Field(..., ge=0, le=100, description="Ponderación de la evaluación (0-100%)")
    observaciones: Optional[str] = Field(None, max_length=1000, description="Observaciones adicionales sobre la evaluación")
    status: bool = Field(True, description="Estado del registro (activo/inactivo)")
    fecha_creacion: Optional[datetime] = Field(None, description="Fecha de creación del registro")
    fecha_modificacion: Optional[datetime] = Field(None, description="Fecha de última modificación")

    @validator('hora_fin')
    def validate_hora_fin(cls, v, values):
        if v and 'hora_inicio' in values and values['hora_inicio']:
            if v <= values['hora_inicio']:
                raise ValueError('La hora de fin debe ser posterior a la hora de inicio')
        return v

    @validator('ponderacion')
    def validate_ponderacion(cls, v):
        if v < 0 or v > 100:
            raise ValueError('La ponderación debe estar entre 0 y 100')
        return v

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id_cronograma": 1,
                "nombre": "Primer Parcial - Bases de Datos",
                "descripcion": "Evaluación teórica y práctica sobre conceptos fundamentales",
                "fecha": "2024-03-15",
                "hora_inicio": "09:00:00",
                "hora_fin": "11:00:00",
                "tipo": "parcial",
                "ponderacion": 25.00,
                "observaciones": "Traer calculadora y formulario"
            }
        }


class EvaluacionCreate(BaseModel):
    id_cronograma: int = Field(..., description="ID del cronograma al que pertenece")
    nombre: str = Field(..., min_length=3, max_length=200, description="Nombre de la evaluación")
    descripcion: Optional[str] = Field(None, max_length=1000, description="Descripción detallada de la evaluación")
    fecha: date = Field(..., description="Fecha programada de la evaluación")
    hora_inicio: time = Field(..., description="Hora de inicio de la evaluación")
    hora_fin: time = Field(..., description="Hora de finalización de la evaluación")
    tipo: TipoEvaluacion = Field(..., description="Tipo de evaluación")
    ponderacion: Decimal = Field(..., ge=0, le=100, description="Ponderación de la evaluación (0-100%)")
    observaciones: Optional[str] = Field(None, max_length=1000, description="Observaciones adicionales sobre la evaluación")

    @validator('hora_fin')
    def validate_hora_fin(cls, v, values):
        if v and 'hora_inicio' in values and values['hora_inicio']:
            if v <= values['hora_inicio']:
                raise ValueError('La hora de fin debe ser posterior a la hora de inicio')
        return v

    @validator('ponderacion')
    def validate_ponderacion(cls, v):
        if v < 0 or v > 100:
            raise ValueError('La ponderación debe estar entre 0 y 100')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "id_cronograma": 1,
                "nombre": "Primer Parcial - Bases de Datos",
                "descripcion": "Evaluación teórica y práctica sobre conceptos fundamentales",
                "fecha": "2024-03-15",
                "hora_inicio": "09:00:00",
                "hora_fin": "11:00:00",
                "tipo": "parcial",
                "ponderacion": 25.00,
                "observaciones": "Traer calculadora y formulario"
            }
        }


class EvaluacionUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=3, max_length=200, description="Nombre de la evaluación")
    descripcion: Optional[str] = Field(None, max_length=1000, description="Descripción detallada de la evaluación")
    fecha: Optional[date] = Field(None, description="Fecha programada de la evaluación")
    hora_inicio: Optional[time] = Field(None, description="Hora de inicio de la evaluación")
    hora_fin: Optional[time] = Field(None, description="Hora de finalización de la evaluación")
    tipo: Optional[TipoEvaluacion] = Field(None, description="Tipo de evaluación")
    ponderacion: Optional[Decimal] = Field(None, ge=0, le=100, description="Ponderación de la evaluación (0-100%)")
    observaciones: Optional[str] = Field(None, max_length=1000, description="Observaciones adicionales sobre la evaluación")
    status: Optional[bool] = Field(None, description="Estado del registro (activo/inactivo)")

    @validator('hora_fin')
    def validate_hora_fin(cls, v, values):
        if v and 'hora_inicio' in values and values['hora_inicio']:
            if v <= values['hora_inicio']:
                raise ValueError('La hora de fin debe ser posterior a la hora de inicio')
        return v

    @validator('ponderacion')
    def validate_ponderacion(cls, v):
        if v is not None and (v < 0 or v > 100):
            raise ValueError('La ponderación debe estar entre 0 y 100')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "nombre": "Primer Parcial - Bases de Datos (Actualizado)",
                "descripcion": "Evaluación teórica y práctica actualizada",
                "fecha": "2024-03-20",
                "hora_inicio": "10:00:00",
                "hora_fin": "12:00:00",
                "tipo": "parcial",
                "ponderacion": 30.00,
                "observaciones": "Cambio de fecha por feriado"
            }
        }


class EvaluacionResponse(BaseModel):
    id_evaluacion: int = Field(..., description="Identificador único de la evaluación")
    id_cronograma: int = Field(..., description="ID del cronograma al que pertenece")
    nombre: str = Field(..., description="Nombre de la evaluación")
    descripcion: Optional[str] = Field(None, description="Descripción detallada de la evaluación")
    fecha: date = Field(..., description="Fecha programada de la evaluación")
    hora_inicio: time = Field(..., description="Hora de inicio de la evaluación")
    hora_fin: time = Field(..., description="Hora de finalización de la evaluación")
    tipo: TipoEvaluacion = Field(..., description="Tipo de evaluación")
    ponderacion: Decimal = Field(..., description="Ponderación de la evaluación")
    observaciones: Optional[str] = Field(None, description="Observaciones adicionales")
    status: bool = Field(..., description="Estado del registro")
    fecha_creacion: datetime = Field(..., description="Fecha de creación del registro")
    fecha_modificacion: datetime = Field(..., description="Fecha de última modificación")

    class Config:
        from_attributes = True


# Schema para mostrar evaluación con información del cronograma
class EvaluacionConCronograma(BaseModel):
    id_evaluacion: int = Field(..., description="Identificador único de la evaluación")
    id_cronograma: int = Field(..., description="ID del cronograma")
    nombre: str = Field(..., description="Nombre de la evaluación")
    descripcion: Optional[str] = Field(None, description="Descripción de la evaluación")
    fecha: date = Field(..., description="Fecha de la evaluación")
    hora_inicio: time = Field(..., description="Hora de inicio")
    hora_fin: time = Field(..., description="Hora de fin")
    tipo: TipoEvaluacion = Field(..., description="Tipo de evaluación")
    ponderacion: Decimal = Field(..., description="Ponderación")
    observaciones: Optional[str] = Field(None, description="Observaciones")
    status: bool = Field(..., description="Estado del registro")
    fecha_creacion: datetime = Field(..., description="Fecha de creación")
    fecha_modificacion: datetime = Field(..., description="Fecha de modificación")
    
    # Información del cronograma
    course_id: int = Field(..., description="ID del curso")
    course_name: str = Field(..., description="Nombre del curso")
    total_classes: int = Field(..., description="Total de clases del cronograma")

    class Config:
        from_attributes = True


# Schema para estadísticas de evaluaciones
class EvaluacionEstadisticas(BaseModel):
    total_evaluaciones: int = Field(..., description="Total de evaluaciones")
    evaluaciones_parciales: int = Field(..., description="Evaluaciones parciales")
    evaluaciones_finales: int = Field(..., description="Evaluaciones finales")
    evaluaciones_trabajo_practico: int = Field(..., description="Trabajos prácticos")
    evaluaciones_otro: int = Field(..., description="Otros tipos de evaluación")
    evaluaciones_activas: int = Field(..., description="Evaluaciones activas")
    evaluaciones_inactivas: int = Field(..., description="Evaluaciones inactivas")
    ponderacion_total: Decimal = Field(..., description="Suma total de ponderaciones")

    class Config:
        from_attributes = True