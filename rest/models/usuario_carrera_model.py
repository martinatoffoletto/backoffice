from sqlalchemy import Column, ForeignKey, PrimaryKeyConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .base import Base
import uuid

class UsuarioCarrera(Base):
    __tablename__ = "usuario_carreras"
    
    id_usuario = Column(UUID(as_uuid=True), ForeignKey("usuarios.id_usuario", ondelete="CASCADE"), nullable=False)
    id_carrera = Column(UUID(as_uuid=True), ForeignKey("carreras.id_carrera", ondelete="CASCADE"), nullable=False)
    
    # Clave primaria compuesta
    __table_args__ = (
        PrimaryKeyConstraint('id_usuario', 'id_carrera'),
    )
    
    # Relaciones
    usuario = relationship("Usuario", back_populates="carreras")
    carrera = relationship("Carrera", back_populates="usuarios")
    
    def __repr__(self):
        return f"<UsuarioCarrera(id_usuario={self.id_usuario}, id_carrera={self.id_carrera})>"