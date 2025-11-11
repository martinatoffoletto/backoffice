from sqlalchemy import Column, ForeignKey, Boolean, PrimaryKeyConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .base import Base

class UsuarioCarrera(Base):
    __tablename__ = "usuario_carreras"
    
    id_usuario = Column(UUID(as_uuid=True), ForeignKey("usuarios.id_usuario", ondelete="CASCADE"), nullable=False)
    id_carrera = Column(UUID(as_uuid=True), nullable=False, comment="Referencia a carrera (entidad externa)")
    status = Column(Boolean, default=True, nullable=False, comment="Estado del registro (activo/inactivo)")
    
    __table_args__ = (PrimaryKeyConstraint('id_usuario', 'id_carrera'),)
    
    # Relaciones (solo con entidades locales)
    usuario = relationship("Usuario", back_populates="carreras")
    
    def __repr__(self):
        return f"<UsuarioCarrera(id_usuario={self.id_usuario}, id_carrera={self.id_carrera}, status={self.status})>"