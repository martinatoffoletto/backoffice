from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Time, Enum, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base
import enum

class EstadoClase(enum.Enum):
    PROGRAMADA = "programada"
    DICTADA = "dictada"
    REPROGRAMADA = "reprogramada"
    CANCELADA = "cancelada"

class ClaseIndividual(Base):
    __tablename__ = "clases_individuales"
    
    id_clase = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_cronograma = Column(Integer, ForeignKey("cronogramas.id_cronograma", ondelete="CASCADE"), nullable=False, comment="ID del cronograma al que pertenece")
    titulo = Column(String(200), nullable=False, comment="Título de la clase")
    descripcion = Column(Text, nullable=True, comment="Descripción detallada de la clase")
    fecha_clase = Column(Date, nullable=False, comment="Fecha programada de la clase")
    hora_inicio = Column(Time, nullable=False, comment="Hora de inicio de la clase")
    hora_fin = Column(Time, nullable=False, comment="Hora de fin de la clase")
    estado = Column(Enum(EstadoClase), default=EstadoClase.PROGRAMADA, nullable=False, comment="Estado actual de la clase")
    observaciones = Column(Text, nullable=True, comment="Observaciones adicionales sobre la clase")
    status = Column(Boolean, default=True, nullable=False, comment="Estado del registro (activo/inactivo)")
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, comment="Fecha de creación del registro")
    fecha_modificacion = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False, comment="Fecha de última modificación")
    
    # Relación con cronograma
    cronograma = relationship("Cronograma", back_populates="clases")
    
    def __repr__(self):
        return f"<ClaseIndividual(id_clase={self.id_clase}, titulo='{self.titulo}', fecha_clase='{self.fecha_clase}', estado='{self.estado.value}')>"