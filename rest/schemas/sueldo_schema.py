from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal
import uuid


class SueldoBase(BaseModel):
    id_usuario: uuid.UUID = Field(..., description="UUID del usuario")
    cbu: str = Field(..., max_length=22, description="Número de CBU")
    sueldo_adicional: Decimal = Field(0, description="Sueldo adicional al sueldo base del rol")
    observaciones: Optional[str] = Field(None, description="Observaciones adicionales")

class SueldoUpdate(BaseModel):
    cbu: Optional[str] = Field(None, max_length=22, description="Número de CBU")
    sueldo_adicional: Optional[Decimal] = Field(None, description="Sueldo adicional al sueldo base del rol")
    observaciones: Optional[str] = Field(None, description="Observaciones adicionales")
    status: Optional[bool] = Field(None, description="Estado del sueldo (activo/inactivo)")

class Sueldo(SueldoBase):
    id_sueldo: Optional[uuid.UUID] = Field(None, description="Identificador único del sueldo")
    status: bool = Field(True, description="Estado del sueldo (activo/inactivo)")

    class Config:
        from_attributes = True

