from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Time, Enum, Numeric, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

class TipoEvaluacion(enum.Enum):
    PARCIAL = "parcial"
    FINAL = "final"
    TRABAJO_PRACTICO = "trabajo_practico"
    OTRO = "otro"

class Evaluacion(Base):
    __tablename__ = "evaluaciones"
    
    id_evaluacion = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_cronograma = Column(Integer, ForeignKey("cronogramas.id_cronograma", ondelete="CASCADE"), nullable=False, comment="ID del cronograma al que pertenece")
    nombre = Column(String(200), nullable=False, comment="Nombre de la evaluación")
    descripcion = Column(Text, nullable=True, comment="Descripción detallada de la evaluación")
    fecha = Column(Date, nullable=False, comment="Fecha programada de la evaluación")
    hora_inicio = Column(Time, nullable=False, comment="Hora de inicio de la evaluación")
    hora_fin = Column(Time, nullable=False, comment="Hora de fin de la evaluación")
    tipo = Column(Enum(TipoEvaluacion), nullable=False, comment="Tipo de evaluación")
    ponderacion = Column(Numeric(5, 2), default=0.00, nullable=False, comment="Ponderación de la evaluación (0-100%)")
    observaciones = Column(Text, nullable=True, comment="Observaciones adicionales sobre la evaluación")
    status = Column(Boolean, default=True, nullable=False, comment="Estado del registro (activo/inactivo)")
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, comment="Fecha de creación del registro")
    fecha_modificacion = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False, comment="Fecha de última modificación")
    
    # Relación con cronograma
    cronograma = relationship("Cronograma", back_populates="evaluaciones")
    
    def __repr__(self):
        return f"<Evaluacion(id_evaluacion={self.id_evaluacion}, nombre='{self.nombre}', tipo='{self.tipo.value}', ponderacion={self.ponderacion})>"