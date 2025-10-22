from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal
import uuid


class SueldoBase(BaseModel):
    id_usuario: uuid.UUID = Field(..., description="UUID del usuario")
    id_rol: uuid.UUID = Field(..., description="UUID del rol por el cual se le paga")
    cbu: str = Field(..., description="Número de CBU")
    sueldo_adicional: Decimal = Field(0, description="Porcentaje de Bonos, plus o adicionales")
    observaciones: Optional[str] = Field(None, description="Notas adicionales")

class SueldoCreate(SueldoBase):
    activo: bool = Field(True, description="Indica si el registro está vigente")

class SueldoUpdate(BaseModel):
    cbu: Optional[str] = Field(None, description="Número de CBU")
    sueldo_adicional: Optional[Decimal] = Field(None, description="Porcentaje de Bonos, plus o adicionales")
    observaciones: Optional[str] = Field(None, description="Notas adicionales")
    activo: Optional[bool] = Field(None, description="Indica si el registro está vigente")

class Sueldo(SueldoBase):
    id_sueldo: Optional[uuid.UUID] = Field(None, description="Identificador único del sueldo")
    activo: bool = Field(True, description="Indica si el registro está vigente")

    class Config:
        from_attributes = True

