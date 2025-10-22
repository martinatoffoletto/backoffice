from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()

class Cronograma(Base):
    __tablename__ = "cronogramas"
    
    id_cronograma = Column(Integer, primary_key=True, index=True, autoincrement=True)
    course_id = Column(Integer, nullable=False, index=True, comment="ID del curso del módulo CORE")
    course_name = Column(String(200), nullable=False, comment="Nombre del curso cacheado localmente")
    total_classes = Column(Integer, default=0, nullable=False, comment="Total de clases planificadas")
    fecha_inicio = Column(Date, nullable=True, comment="Fecha de inicio del cronograma")
    fecha_fin = Column(Date, nullable=True, comment="Fecha de fin del cronograma")
    descripcion = Column(Text, nullable=True, comment="Descripción detallada del cronograma")
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, comment="Fecha de creación automática")
    fecha_modificacion = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False, comment="Fecha de última modificación")
    status = Column(Boolean, default=True, nullable=False, comment="Estado del cronograma (activo/inactivo)")
    
    # Relaciones
    clases = relationship("ClaseIndividual", back_populates="cronograma", cascade="all, delete-orphan")
    evaluaciones = relationship("Evaluacion", back_populates="cronograma", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Cronograma(id_cronograma={self.id_cronograma}, course_id={self.course_id}, course_name='{self.course_name}')>"