from sqlalchemy import Column, Integer, ForeignKey, PrimaryKeyConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import uuid

Base = declarative_base()

class UsuarioRol(Base):
    __tablename__ = "usuario_roles"
    
    id_usuario = Column(UUID(as_uuid=True), ForeignKey("usuarios.id_usuario", ondelete="CASCADE"), nullable=False)
    id_rol = Column(UUID(as_uuid=True), ForeignKey("roles.id_rol", ondelete="CASCADE"), nullable=False)
    
    # Clave primaria compuesta
    __table_args__ = (
        PrimaryKeyConstraint('id_usuario', 'id_rol'),
    )
    
    # Relaciones
    usuario = relationship("Usuario", back_populates="roles")
    rol = relationship("Rol", back_populates="usuarios")
    
    def __repr__(self):
        return f"<UsuarioRol(id_usuario={self.id_usuario}, id_rol={self.id_rol})>"