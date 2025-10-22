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
    nombre_espacio: str = Field(..., max_length=100, description="Nombre del espacio")
    id_sede: int = Field(..., description="ID de la sede a la que pertenece")
    tipo_espacio: str = Field(..., max_length=50, description="Tipo del espacio (ej: aula, laboratorio)")
    capacidad: int = Field(..., gt=0, description="Capacidad máxima de personas")
    
    # Campos de equipamiento (basados en el DAO)
    tiene_proyector: bool = Field(False, description="¿Tiene proyector?")
    tiene_sonido: bool = Field(False, description="¿Tiene sistema de sonido?")
    tiene_internet: bool = Field(False, description="¿Tiene conexión a internet?")
    tiene_aire_acondicionado: bool = Field(False, description="¿Tiene aire acondicionado?")
    
    observaciones: Optional[str] = Field(None, description="Notas adicionales sobre el espacio")
    status: bool = Field(True, description="Estado del espacio (activo/inactivo)")
    
    # Campos de auditoría (opcionales en la entrada, usados por el servicio)
    created_by: Optional[str] = Field(None, max_length=50)
    updated_by: Optional[str] = Field(None, max_length=50)

    class Config:
        from_attributes = True


# Schema adicional para mostrar espacio con información de la sede
class EspacioConSede(BaseModel):
    espacio: Espacio
    sede: dict = Field(..., description="Información de la sede")

    class Config:
        from_attributes = True