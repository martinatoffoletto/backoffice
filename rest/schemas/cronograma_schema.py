from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime, date
import uuid


class Cronograma(BaseModel):
    id_cronograma: Optional[uuid.UUID] = Field(None, description="Identificador único del cronograma")
    course_id: int = Field(..., description="ID del curso proveniente del módulo CORE")
    course_name: str = Field(..., min_length=3, max_length=200, description="Nombre del curso (cacheado localmente)")
    total_classes: int = Field(..., ge=0, description="Cantidad total de clases planificadas")
    fecha_inicio: Optional[date] = Field(None, description="Fecha de inicio del cronograma")
    fecha_fin: Optional[date] = Field(None, description="Fecha de fin del cronograma")
    descripcion: Optional[str] = Field(None, max_length=1000, description="Descripción detallada del cronograma")
    fecha_creacion: Optional[datetime] = Field(None, description="Fecha de creación del cronograma")
    fecha_modificacion: Optional[datetime] = Field(None, description="Fecha de última modificación")
    status: bool = Field(True, description="Estado del cronograma (activo/inactivo)")

    @field_validator('fecha_fin')
    @classmethod
    def validate_fecha_fin(cls, v, info):
        if v and info.data and info.data.get('fecha_inicio'):
            if v < info.data['fecha_inicio']:
                raise ValueError('La fecha de fin debe ser posterior a la fecha de inicio')
        return v

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "course_id": 12345,
                "course_name": "Programación Web Avanzada",
                "total_classes": 20,
                "fecha_inicio": "2024-02-01",
                "fecha_fin": "2024-06-30",
                "descripcion": "Curso de programación web con React y Node.js",
                "status": True
            }
        }


class CronogramaCreate(BaseModel):
    course_id: int = Field(..., description="ID del curso proveniente del módulo CORE")
    course_name: str = Field(..., min_length=3, max_length=200, description="Nombre del curso")
    total_classes: int = Field(..., ge=0, description="Cantidad total de clases planificadas")
    fecha_inicio: Optional[date] = Field(None, description="Fecha de inicio del cronograma")
    fecha_fin: Optional[date] = Field(None, description="Fecha de fin del cronograma")
    descripcion: Optional[str] = Field(None, max_length=1000, description="Descripción del cronograma")

    @field_validator('fecha_fin')
    @classmethod
    def validate_fecha_fin(cls, v, info):
        if v and info.data and info.data.get('fecha_inicio'):
            if v < info.data['fecha_inicio']:
                raise ValueError('La fecha de fin debe ser posterior a la fecha de inicio')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "course_id": 12345,
                "course_name": "Programación Web Avanzada",
                "total_classes": 20,
                "fecha_inicio": "2024-02-01",
                "fecha_fin": "2024-06-30",
                "descripcion": "Curso de programación web con React y Node.js"
            }
        }


class CronogramaUpdate(BaseModel):
    course_id: Optional[int] = Field(None, description="ID del curso proveniente del módulo CORE")
    course_name: Optional[str] = Field(None, min_length=3, max_length=200, description="Nombre del curso")
    total_classes: Optional[int] = Field(None, ge=0, description="Cantidad total de clases planificadas")
    fecha_inicio: Optional[date] = Field(None, description="Fecha de inicio del cronograma")
    fecha_fin: Optional[date] = Field(None, description="Fecha de fin del cronograma")
    descripcion: Optional[str] = Field(None, max_length=1000, description="Descripción del cronograma")
    status: Optional[bool] = Field(None, description="Estado del cronograma (activo/inactivo)")

    @field_validator('fecha_fin')
    @classmethod
    def validate_fecha_fin(cls, v, info):
        if v and info.data and info.data.get('fecha_inicio'):
            if v < info.data['fecha_inicio']:
                raise ValueError('La fecha de fin debe ser posterior a la fecha de inicio')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "total_classes": 25,
                "fecha_fin": "2024-07-15",
                "descripcion": "Curso actualizado con más clases prácticas"
            }
        }


class CronogramaResponse(BaseModel):
    id_cronograma: uuid.UUID = Field(..., description="Identificador único del cronograma")
    course_id: int = Field(..., description="ID del curso")
    course_name: str = Field(..., description="Nombre del curso")
    total_classes: int = Field(..., description="Total de clases planificadas")
    fecha_inicio: Optional[date] = Field(None, description="Fecha de inicio")
    fecha_fin: Optional[date] = Field(None, description="Fecha de fin")
    descripcion: Optional[str] = Field(None, description="Descripción del cronograma")
    fecha_creacion: datetime = Field(..., description="Fecha de creación")
    fecha_modificacion: datetime = Field(..., description="Fecha de última modificación")
    status: bool = Field(..., description="Estado del cronograma")

    class Config:
        from_attributes = True
