from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Time, Enum, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base
import enum
import uuid

class EstadoClase(enum.Enum):
    PROGRAMADA = "programada"
    DICTADA = "dictada"
    REPROGRAMADA = "reprogramada"
    CANCELADA = "cancelada"

class TipoClase(enum.Enum):
    REGULAR = "regular"
    PARCIAL_1 = "parcial_1"
    PARCIAL_2 = "parcial_2"
    RECUPERATORIA = "recuperatoria"
    FINAL = "final"

class ClaseIndividual(Base):
    __tablename__ = "clases_individuales"
    
    id_clase = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    id_curso = Column(UUID(as_uuid=True), nullable=False, comment="Referencia a curso (entidad externa)")
    titulo = Column(String(200), nullable=False, comment="Título de la clase")
    descripcion = Column(Text, nullable=True, comment="Descripción detallada de la clase")
    fecha_clase = Column(Date, nullable=False, comment="Fecha programada de la clase")
    tipo = Column(Enum(TipoClase, native_enum=False), default=TipoClase.REGULAR, nullable=False, comment="Tipo de clase (regular, evaluación, entrega TPO)")
    estado = Column(Enum(EstadoClase, native_enum=False), default=EstadoClase.PROGRAMADA, nullable=False, comment="Estado actual de la clase")
    observaciones = Column(Text, nullable=True, comment="Observaciones adicionales sobre la clase")
    status = Column(Boolean, default=True, nullable=False, comment="Estado del registro (activo/inactivo)")
    
    def __repr__(self):
        return f"<ClaseIndividual(id_clase={self.id_clase}, titulo='{self.titulo}', fecha_clase='{self.fecha_clase}', tipo='{self.tipo.value}', estado='{self.estado.value}')>"