from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()

class Usuario(Base):
    __tablename__ = "usuarios"
    
    id_usuario = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    legajo = Column(String(50), unique=True, nullable=False, index=True)
    dni = Column(String(20), unique=True, nullable=False, index=True)
    correo_institucional = Column(String(255), nullable=True)
    correo_personal = Column(String(255), nullable=False, index=True)
    telefono_laboral = Column(String(20), nullable=True)
    telefono_personal = Column(String(20), nullable=False)
    fecha_alta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    status = Column(Boolean, default=True, nullable=False)
    
    # Relaciones
    roles = relationship("UsuarioRol", back_populates="usuario")
    sueldos = relationship("Sueldo", back_populates="usuario")
    
    def __repr__(self):
        return f"<Usuario(id_usuario={self.id_usuario}, legajo='{self.legajo}', nombre='{self.nombre} {self.apellido}')>"