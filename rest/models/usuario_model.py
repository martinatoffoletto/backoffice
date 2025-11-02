from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base
import uuid

class Usuario(Base):
    __tablename__ = "usuarios"
    
    id_usuario = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    nombre = Column(String(100), nullable=False, comment="Nombre del usuario")
    apellido = Column(String(100), nullable=False, comment="Apellido del usuario")
    legajo = Column(String(20), unique=True, nullable=False, index=True, comment="Legajo único del usuario")
    dni = Column(String(10), nullable=False, index=True, comment="DNI único del usuario")
    email_institucional = Column(String(150), unique=True, nullable=True, index=True, comment="Email institucional (único)")
    email_personal = Column(String(150), nullable=False, index=True, comment="Email personal (único y obligatorio)")
    telefono_personal = Column(String(20), nullable=False, comment="Teléfono personal (obligatorio)")
    contraseña = Column(String(255), nullable=False, comment="Contraseña del usuario")
    fecha_alta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, comment="Fecha de alta - se registra automáticamente")
    id_rol = Column(UUID(as_uuid=True), ForeignKey("roles.id_rol"), nullable=False, comment="Rol único del usuario")
    status = Column(Boolean, default=True, nullable=False, comment="Estado del usuario (activo/inactivo)")
    
    # Relaciones
    rol = relationship("Rol", back_populates="usuarios")
    sueldos = relationship("Sueldo", back_populates="usuario", cascade="all, delete-orphan")
    carreras = relationship("UsuarioCarrera", back_populates="usuario")
    
    
    def __repr__(self):
        return f"<Usuario(id_usuario={self.id_usuario}, legajo='{self.legajo}', nombre='{self.nombre} {self.apellido}')>"