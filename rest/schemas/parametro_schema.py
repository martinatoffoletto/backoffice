from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal
import uuid


class Parametro(BaseModel):
    id_parametro: Optional[uuid.UUID] = Field(None, description="Identificador único del parámetro")
    nombre: str = Field(..., max_length=100, description="Nombre único del parámetro")
    tipo: str = Field(..., max_length=50, description="Tipo del parámetro (multa, reserva, sancion, general, etc.)")
    valor_numerico: Optional[Decimal] = Field(None, description="Valor numérico del parámetro")
    valor_texto: Optional[str] = Field(None, description="Valor de texto del parámetro")
    status: bool = Field(True, description="Estado del parámetro (activo/inactivo)")

    class Config:
        from_attributes = True


class ParametroCreate(BaseModel):
    nombre: str = Field(..., max_length=100, description="Nombre único del parámetro")
    tipo: str = Field(..., max_length=50, description="Tipo del parámetro")
    valor_numerico: Optional[Decimal] = Field(None, description="Valor numérico del parámetro")
    valor_texto: Optional[str] = Field(None, description="Valor de texto del parámetro")

    class Config:
        from_attributes = True


class ParametroUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=100, description="Nombre único del parámetro")
    tipo: Optional[str] = Field(None, max_length=50, description="Tipo del parámetro")
    valor_numerico: Optional[Decimal] = Field(None, description="Valor numérico del parámetro")
    valor_texto: Optional[str] = Field(None, description="Valor de texto del parámetro")
    status: Optional[bool] = Field(None, description="Estado del parámetro (activo/inactivo)")

    class Config:
        from_attributes = True
