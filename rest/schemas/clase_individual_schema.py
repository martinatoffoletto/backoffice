from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime, time, date
from enum import Enum
import uuid


class EstadoClase(str, Enum):
    PROGRAMADA = "programada"
    DICTADA = "dictada"
    REPROGRAMADA = "reprogramada"
    CANCELADA = "cancelada"


class ClaseIndividual(BaseModel):
    id_clase: Optional[uuid.UUID] = Field(None, description="Identificador único de la clase")
    id_cronograma: uuid.UUID = Field(..., description="ID del cronograma al que pertenece")
    titulo: str = Field(..., min_length=3, max_length=200, description="Título del tema de la clase")
    descripcion: Optional[str] = Field(None, max_length=1000, description="Descripción detallada de la clase")
    fecha_clase: date = Field(..., description="Fecha programada de la clase")
    hora_inicio: time = Field(..., description="Hora de inicio de la clase")
    hora_fin: time = Field(..., description="Hora de finalización de la clase")
    estado: EstadoClase = Field(EstadoClase.PROGRAMADA, description="Estado actual de la clase")
    observaciones: Optional[str] = Field(None, max_length=1000, description="Observaciones adicionales sobre la clase")
    status: bool = Field(True, description="Estado del registro (activo/inactivo)")
    fecha_creacion: Optional[datetime] = Field(None, description="Fecha de creación del registro")
    fecha_modificacion: Optional[datetime] = Field(None, description="Fecha de última modificación")

    @field_validator('hora_fin')
    @classmethod
    def validate_hora_fin(cls, v, info):
        if v and info.data and info.data.get('hora_inicio'):
            if v <= info.data['hora_inicio']:
                raise ValueError('La hora de fin debe ser posterior a la hora de inicio')
        return v

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id_cronograma": 1,
                "titulo": "Introducción a Bases de Datos",
                "descripcion": "Conceptos fundamentales de bases de datos relacionales",
                "fecha_clase": "2024-02-15",
                "hora_inicio": "09:00:00",
                "hora_fin": "11:00:00",
                "estado": "programada",
                "observaciones": "Traer laptops para práctica"
            }
        }


class ClaseIndividualCreate(BaseModel):
    id_cronograma: uuid.UUID = Field(..., description="ID del cronograma al que pertenece")
    titulo: str = Field(..., min_length=3, max_length=200, description="Título del tema de la clase")
    descripcion: Optional[str] = Field(None, max_length=1000, description="Descripción detallada de la clase")
    fecha_clase: date = Field(..., description="Fecha programada de la clase")
    hora_inicio: time = Field(..., description="Hora de inicio de la clase")
    hora_fin: time = Field(..., description="Hora de finalización de la clase")
    estado: EstadoClase = Field(EstadoClase.PROGRAMADA, description="Estado inicial de la clase")
    observaciones: Optional[str] = Field(None, max_length=1000, description="Observaciones adicionales sobre la clase")

    @field_validator('hora_fin')
    @classmethod
    def validate_hora_fin(cls, v, info):
        if v and info.data and info.data.get('hora_inicio'):
            if v <= info.data['hora_inicio']:
                raise ValueError('La hora de fin debe ser posterior a la hora de inicio')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "id_cronograma": 1,
                "titulo": "Introducción a Bases de Datos",
                "descripcion": "Conceptos fundamentales de bases de datos relacionales",
                "fecha_clase": "2024-02-15",
                "hora_inicio": "09:00:00",
                "hora_fin": "11:00:00",
                "estado": "programada",
                "observaciones": "Traer laptops para práctica"
            }
        }


class ClaseIndividualUpdate(BaseModel):
    titulo: Optional[str] = Field(None, min_length=3, max_length=200, description="Título del tema de la clase")
    descripcion: Optional[str] = Field(None, max_length=1000, description="Descripción detallada de la clase")
    fecha_clase: Optional[date] = Field(None, description="Fecha programada de la clase")
    hora_inicio: Optional[time] = Field(None, description="Hora de inicio de la clase")
    hora_fin: Optional[time] = Field(None, description="Hora de finalización de la clase")
    estado: Optional[EstadoClase] = Field(None, description="Estado actual de la clase")
    observaciones: Optional[str] = Field(None, max_length=1000, description="Observaciones adicionales sobre la clase")
    status: Optional[bool] = Field(None, description="Estado del registro (activo/inactivo)")

    @field_validator('hora_fin')
    @classmethod
    def validate_hora_fin(cls, v, info):
        if v and info.data and info.data.get('hora_inicio'):
            if v <= info.data['hora_inicio']:
                raise ValueError('La hora de fin debe ser posterior a la hora de inicio')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "titulo": "Bases de Datos Avanzadas",
                "descripcion": "Conceptos avanzados y optimización",
                "fecha_clase": "2024-02-20",
                "hora_inicio": "10:00:00",
                "hora_fin": "12:00:00",
                "estado": "reprogramada",
                "observaciones": "Cambio de horario por feriado"
            }
        }


class ClaseIndividualResponse(BaseModel):
    id_clase: uuid.UUID = Field(..., description="Identificador único de la clase")
    id_cronograma: uuid.UUID = Field(..., description="ID del cronograma al que pertenece")
    titulo: str = Field(..., description="Título del tema de la clase")
    descripcion: Optional[str] = Field(None, description="Descripción detallada de la clase")
    fecha_clase: date = Field(..., description="Fecha programada de la clase")
    hora_inicio: time = Field(..., description="Hora de inicio de la clase")
    hora_fin: time = Field(..., description="Hora de finalización de la clase")
    estado: EstadoClase = Field(..., description="Estado actual de la clase")
    observaciones: Optional[str] = Field(None, description="Observaciones adicionales sobre la clase")
    status: bool = Field(..., description="Estado del registro")
    fecha_creacion: datetime = Field(..., description="Fecha de creación del registro")
    fecha_modificacion: datetime = Field(..., description="Fecha de última modificación")

    class Config:
        from_attributes = True


# Schema para mostrar clase con información del cronograma
class ClaseConCronograma(BaseModel):
    id_clase: uuid.UUID = Field(..., description="Identificador único de la clase")
    id_cronograma: uuid.UUID = Field(..., description="ID del cronograma")
    titulo: str = Field(..., description="Título de la clase")
    descripcion: Optional[str] = Field(None, description="Descripción de la clase")
    fecha_clase: date = Field(..., description="Fecha de la clase")
    hora_inicio: time = Field(..., description="Hora de inicio")
    hora_fin: time = Field(..., description="Hora de fin")
    estado: EstadoClase = Field(..., description="Estado de la clase")
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


# Schema para estadísticas de clases
class ClaseEstadisticas(BaseModel):
    total_clases: int = Field(..., description="Total de clases")
    clases_programadas: int = Field(..., description="Clases programadas")
    clases_dictadas: int = Field(..., description="Clases dictadas")
    clases_reprogramadas: int = Field(..., description="Clases reprogramadas")
    clases_canceladas: int = Field(..., description="Clases canceladas")
    clases_activas: int = Field(..., description="Clases activas")
    clases_inactivas: int = Field(..., description="Clases inactivas")

    class Config:
        from_attributes = True