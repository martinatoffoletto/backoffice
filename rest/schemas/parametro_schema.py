from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal


class Parametro(BaseModel):
    id_parametro: Optional[int] = Field(None, description="Identificador único del parámetro")
    nombre: str = Field(..., description="Nombre único del parámetro")
    tipo: str = Field(..., description="Tipo del parámetro (multa, reserva, sancion, general, etc.)")
    valor_numerico: Optional[Decimal] = Field(None, description="Valor numérico del parámetro")
    valor_texto: Optional[str] = Field(None, description="Valor de texto del parámetro")
    fecha_modificacion: Optional[datetime] = Field(None, description="Fecha de última modificación")
    status: bool = Field(True, description="Estado del parámetro (activo/inactivo)")

    class Config:
        from_attributes = True
