from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Numeric, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid

Base = declarative_base()

class CategoriaRol(enum.Enum):
    DOCENTE = "docente"
    ADMINISTRATIVO = "administrativo"
    ADMINISTRATIVO_IT = "administrativo_it"
    ALUMNO = "alumno"
    
class Rol(Base):
    __tablename__ = "roles"
    
    id_rol = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    nombre_rol = Column(String(100), unique=True, nullable=False, index=True)
    descripcion = Column(Text, nullable=True)
    subcategoria = Column(Enum(CategoriaRol), nullable=True)
    sueldo_base = Column(Numeric(15, 2), default=0, nullable=False)
    status = Column(Boolean, default=True, nullable=False)
    
    # Relaciones
    usuarios = relationship("UsuarioRol", back_populates="rol")
    sueldos = relationship("Sueldo", back_populates="rol")
    
    def __repr__(self):
        return f"<Rol(id_rol={self.id_rol}, nombre_rol='{self.nombre_rol}')>"