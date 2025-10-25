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
    dni = Column(String(10), unique=True, nullable=False, index=True, comment="DNI único del usuario")
    correo_institucional = Column(String(150), unique=True, nullable=True, index=True, comment="Correo electrónico institucional (único)")
    correo_personal = Column(String(150), unique=True, nullable=False, index=True, comment="Correo electrónico personal (único y obligatorio)")
    telefono_personal = Column(String(20), nullable=False, comment="Teléfono personal (obligatorio)")
    contraseña = Column(String(255), nullable=False, comment="Contraseña del usuario")
    fecha_alta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, comment="Fecha de alta - se registra automáticamente")
    status = Column(Boolean, default=True, nullable=False, comment="Estado del usuario (activo/inactivo)")
    
    # Nueva columna agregada
    carreras = Column(UUID(as_uuid=True), ForeignKey("carreras.id_carrera"), nullable=True, comment="ID de la carrera asociada al usuario")
    
    # Relaciones
    roles = relationship("UsuarioRol", back_populates="usuario")
    carrera = relationship("Carrera", foreign_keys=[carreras])
    
    def __repr__(self):
        return f"<Usuario(id_usuario={self.id_usuario}, legajo='{self.legajo}', nombre='{self.nombre} {self.apellido}')>"