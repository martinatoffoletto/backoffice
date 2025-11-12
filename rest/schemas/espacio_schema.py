from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum
import uuid

class TipoEspacio(str, Enum):
    AULA = "AULA"
    LABORATORIO = "LABORATORIO"
    ESPACIO_COMUN = "ESPACIO_COMUN"
    OFICINA = "OFICINA"
    OTROS = "OTROS"

class EstadoEspacio(str, Enum):
    DISPONIBLE = "DISPONIBLE"
    OCUPADO = "OCUPADO"
    EN_MANTENIMIENTO = "EN_MANTENIMIENTO"


class Espacio(BaseModel):
    id_espacio: Optional[uuid.UUID] = Field(None, description="Identificador único del espacio")
    nombre: str = Field(..., max_length=100, description="Nombre del espacio")
    tipo: TipoEspacio = Field(..., description="Tipo del espacio")
    capacidad: int = Field(..., gt=0, description="Capacidad máxima de personas")
    ubicacion: str = Field(..., description="Ubicación específica dentro de la sede")
    estado: EstadoEspacio = Field(EstadoEspacio.DISPONIBLE, description="Estado actual del espacio")
    id_sede: uuid.UUID = Field(..., description="UUID de la sede a la que pertenece")
    status: bool = Field(True, description="Estado del espacio (activo/inactivo)")

    class Config:
        from_attributes = True


class EspacioCreate(BaseModel):
    nombre: str = Field(..., max_length=100, description="Nombre del espacio")
    tipo: TipoEspacio = Field(..., description="Tipo del espacio")
    capacidad: int = Field(..., gt=0, description="Capacidad máxima de personas")
    ubicacion: str = Field(..., description="Ubicación específica dentro de la sede")
    estado: EstadoEspacio = Field(EstadoEspacio.DISPONIBLE, description="Estado inicial del espacio")
    id_sede: uuid.UUID = Field(..., description="UUID de la sede a la que pertenece")

    class Config:
        from_attributes = True


class EspacioUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=100, description="Nombre del espacio")
    tipo: Optional[TipoEspacio] = Field(None, description="Tipo del espacio")
    capacidad: Optional[int] = Field(None, gt=0, description="Capacidad máxima de personas")
    ubicacion: Optional[str] = Field(None, description="Ubicación específica dentro de la sede")
    estado: Optional[EstadoEspacio] = Field(None, description="Estado del espacio")
    status: Optional[bool] = Field(None, description="Estado del espacio (activo/inactivo)")

    class Config:
        from_attributes = True


# Schema adicional para mostrar espacio con información de la sede
class EspacioConSede(BaseModel):
    id_espacio: uuid.UUID
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


class ComedorInfo(BaseModel):
    nombre: str = Field(..., description="Nombre del comedor")
    capacidad: int = Field(..., description="Capacidad del comedor")

    class Config:
        from_attributes = True