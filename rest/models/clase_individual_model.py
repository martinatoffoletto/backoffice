from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Time, Enum
from sqlalchemy.orm import relationship
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
    id_cronograma = Column(Integer, ForeignKey("cronogramas.id_cronograma", ondelete="CASCADE"), nullable=False)
    titulo = Column(String(255), nullable=False)
    descripcion = Column(Text, nullable=True)
    fecha = Column(DateTime(timezone=True), nullable=False)
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)
    estado = Column(Enum(EstadoClase), default=EstadoClase.PROGRAMADA, nullable=False)
    status = Column(Boolean, default=True, nullable=False)
    
    # Relación con cronograma
    cronograma = relationship("Cronograma", back_populates="clases")
    
    def __repr__(self):
        return f"<ClaseIndividual(id_clase={self.id_clase}, titulo='{self.titulo}', estado='{self.estado.value}')>"