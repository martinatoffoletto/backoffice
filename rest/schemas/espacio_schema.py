from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class TipoEspacio(str, Enum):
    AULA = "aula"
    LABORATORIO = "laboratorio"
    ESPACIO_COMUN = "espacio_comun"
    OFICINA = "oficina"
    OTROS = "otros"


class EstadoEspacio(str, Enum):
    DISPONIBLE = "disponible"
    OCUPADO = "ocupado"
    EN_MANTENIMIENTO = "en_mantenimiento"


class Espacio(BaseModel):
    id_espacio: Optional[int] = Field(None, description="Identificador único del espacio")
    nombre: str = Field(..., description="Nombre único del espacio")
    tipo: TipoEspacio = Field(..., description="Tipo del espacio")
    capacidad: int = Field(..., description="Capacidad máxima de personas")
    ubicacion: str = Field(..., description="Ubicación física dentro de la sede")
    estado: EstadoEspacio = Field(EstadoEspacio.DISPONIBLE, description="Estado del espacio")
    id_sede: int = Field(..., description="ID de la sede a la que pertenece")
    status: bool = Field(True, description="Estado del espacio (activo/inactivo)")

    class Config:
        from_attributes = True


# Schema adicional para mostrar espacio con información de la sede
class EspacioConSede(BaseModel):
    id_espacio: int
    nombre: str
    tipo: TipoEspacio
    capacidad: int
    ubicacion: str
    estado: EstadoEspacio
    status: bool
    sede_nombre: str = Field(..., description="Nombre de la sede")
    sede_ubicacion: str = Field(..., description="Ubicación de la sede")

    class Config:
        from_attributes = True
