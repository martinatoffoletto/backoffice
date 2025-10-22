from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Time, Enum, Numeric
from sqlalchemy.orm import relationship
from .base import Base
import enum

class TipoEvaluacion(enum.Enum):
    PARCIAL = "parcial"
    FINAL = "final"
    TRABAJO_PRACTICO = "trabajo_practico"
    OTRO = "otro"

class Evaluacion(Base):
    __tablename__ = "evaluaciones"
    
    id_evaluacion = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_cronograma = Column(Integer, ForeignKey("cronogramas.id_cronograma", ondelete="CASCADE"), nullable=False)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(Text, nullable=True)
    fecha = Column(DateTime(timezone=True), nullable=False)
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)
    tipo = Column(Enum(TipoEvaluacion), nullable=False)
    ponderacion = Column(Numeric(5, 2), nullable=False)  # Porcentaje 0-100 con 2 decimales
    status = Column(Boolean, default=True, nullable=False)
    
    # Relación con cronograma
    cronograma = relationship("Cronograma", back_populates="evaluaciones")
    
    def __repr__(self):
        return f"<Evaluacion(id_evaluacion={self.id_evaluacion}, nombre='{self.nombre}', tipo='{self.tipo.value}', ponderacion={self.ponderacion})>"