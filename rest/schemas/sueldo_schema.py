from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal


class Sueldo(BaseModel):
    id_sueldo: Optional[int] = Field(None, description="Identificador único del sueldo")
    id_usuario: int = Field(..., description="ID del usuario")
    cbu: str = Field(..., description="Número de CBU")
    id_rol: Optional[int] = Field(None, description="ID del rol por el cual se le paga")
    sueldo_fijo: Decimal = Field(..., description="Monto base del salario")
    sueldo_adicional: Decimal = Field(0, description="Bonos, plus o adicionales")
    sueldo_total: Optional[Decimal] = Field(None, description="Suma total (fijo + adicional)")
    observaciones: Optional[str] = Field(None, description="Notas adicionales")
    activo: bool = Field(True, description="Indica si el registro está vigente")

    class Config:
        from_attributes = True


# Schema adicional para mostrar sueldo con información del usuario y rol
class SueldoDetallado(BaseModel):
    id_sueldo: int
    cbu: str
    sueldo_fijo: Decimal
    sueldo_adicional: Decimal
    sueldo_total: Decimal
    observaciones: Optional[str]
    activo: bool
    usuario_nombre: str = Field(..., description="Nombre completo del usuario")
    usuario_legajo: str = Field(..., description="Legajo del usuario")
    rol_nombre: Optional[str] = Field(None, description="Nombre del rol")

    class Config:
        from_attributes = True
