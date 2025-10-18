import uuid
from sqlalchemy import Column, String, Boolean, Numeric, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .base import Base  

nivel_enum = Enum(
    'tecnicatura', 'pregrado', 'grado', 'posgrado', 'maestria', 'doctorado', 'otro',
    name='nivel_carrera_enum'
)

class Carrera(Base):
    __tablename__ = "carreras"
    
    id_carrera = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String(255), unique=True, nullable=False, index=True)
    nivel = Column(nivel_enum, nullable=False)
    duracion_anios = Column(Numeric(3, 1), nullable=True) 
    status = Column(Boolean, default=True, nullable=False)
    
    usuarios = relationship("UsuarioCarrera", back_populates="carrera")
    
    def __repr__(self):
        return f"<Carrera(id_carrera={self.id_carrera}, nombre='{self.nombre}')>"
