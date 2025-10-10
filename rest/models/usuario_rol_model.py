from sqlalchemy import Column, Integer, ForeignKey, PrimaryKeyConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class UsuarioRol(Base):
    __tablename__ = "usuario_roles"
    
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"), nullable=False)
    id_rol = Column(Integer, ForeignKey("roles.id_rol", ondelete="CASCADE"), nullable=False)
    
    # Clave primaria compuesta
    __table_args__ = (
        PrimaryKeyConstraint('id_usuario', 'id_rol'),
    )
    
    # Relaciones
    usuario = relationship("Usuario", back_populates="roles")
    rol = relationship("Rol", back_populates="usuarios")
    
    def __repr__(self):
        return f"<UsuarioRol(id_usuario={self.id_usuario}, id_rol={self.id_rol})>"