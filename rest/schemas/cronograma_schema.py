from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class Cronograma(BaseModel):
    id_cronograma: Optional[int] = Field(None, description="Identificador único del cronograma")
    courseId: str = Field(..., description="ID del curso proveniente del módulo CORE")
    courseName: str = Field(..., description="Nombre del curso (cacheado localmente)")
    totalClasses: int = Field(..., description="Cantidad total de clases planificadas")
    fecha_creacion: Optional[datetime] = Field(None, description="Fecha de creación del cronograma")
    status: bool = Field(True, description="Estado del cronograma (activo/inactivo)")

    class Config:
        from_attributes = True
