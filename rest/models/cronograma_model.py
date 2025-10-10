from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()

class Cronograma(Base):
    __tablename__ = "cronogramas"
    
    id_cronograma = Column(Integer, primary_key=True, index=True, autoincrement=True)
    courseId = Column(String(100), nullable=False, index=True)  # ID del curso del módulo CORE
    courseName = Column(String(255), nullable=False)  # Nombre del curso cacheado
    totalClasses = Column(Integer, nullable=False)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    status = Column(Boolean, default=True, nullable=False)
    
    # Relaciones
    clases = relationship("ClaseIndividual", back_populates="cronograma")
    evaluaciones = relationship("Evaluacion", back_populates="cronograma")
    
    def __repr__(self):
        return f"<Cronograma(id_cronograma={self.id_cronograma}, courseId='{self.courseId}', courseName='{self.courseName}')>"