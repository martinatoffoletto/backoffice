from sqlalchemy import Column, String, Boolean, Text, ForeignKey, Enum, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .base import Base
import enum
import uuid

class TipoEspacio(enum.Enum):
    AULA = "AULA"
    LABORATORIO = "LABORATORIO"
    ESPACIO_COMUN = "ESPACIO_COMUN"
    OFICINA = "OFICINA"
    COMEDOR = "COMEDOR"
    OTROS = "OTROS"

class EstadoEspacio(enum.Enum):
    DISPONIBLE = "DISPONIBLE"
    OCUPADO = "OCUPADO"
    EN_MANTENIMIENTO = "EN_MANTENIMIENTO"

class Espacio(Base):
    __tablename__ = "espacios"
    
    id_espacio = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    nombre = Column(String(100), unique=True, nullable=False, index=True)
    tipo = Column(Enum(TipoEspacio), nullable=False)
    capacidad = Column(Integer, nullable=False)
    ubicacion = Column(Text, nullable=False)
    estado = Column(Enum(EstadoEspacio), default=EstadoEspacio.DISPONIBLE, nullable=False)
    id_sede = Column(UUID(as_uuid=True), ForeignKey("sedes.id_sede", ondelete="CASCADE"), nullable=False)
    status = Column(Boolean, default=True, nullable=False)
    
    # Relación con sede
    sede = relationship("Sede", back_populates="espacios")
    
    def __repr__(self):
        return f"<Espacio(id_espacio={self.id_espacio}, nombre='{self.nombre}', tipo='{self.tipo.value}')>"