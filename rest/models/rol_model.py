from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()

class Rol(Base):
    __tablename__ = "roles"
    
    id_rol = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre_rol = Column(String(100), unique=True, nullable=False, index=True)
    descripcion = Column(Text, nullable=True)
    status = Column(Boolean, default=True, nullable=False)
    
    # Relaciones
    usuarios = relationship("UsuarioRol", back_populates="rol")
    sueldos = relationship("Sueldo", back_populates="rol")
    
    def __repr__(self):
        return f"<Rol(id_rol={self.id_rol}, nombre_rol='{self.nombre_rol}')>"