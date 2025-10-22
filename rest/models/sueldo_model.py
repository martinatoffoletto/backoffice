from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, Numeric, ForeignKeyConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .base import Base
import uuid

class Sueldo(Base):
    __tablename__ = "sueldos"
    
    id_sueldo = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    id_usuario = Column(UUID(as_uuid=True), nullable=False)
    id_rol = Column(UUID(as_uuid=True), nullable=False)
    cbu = Column(String(22), nullable=False) 
    sueldo_adicional = Column(Numeric(15, 2), default=0, nullable=False)
    observaciones = Column(Text, nullable=True)
    activo = Column(Boolean, default=True, nullable=False)
    
    # Foreign Key compuesta a usuario_roles
    __table_args__ = (
        ForeignKeyConstraint(
            ['id_usuario', 'id_rol'],
            ['usuario_roles.id_usuario', 'usuario_roles.id_rol'],
            ondelete="CASCADE"
        ),
    )
    
    # Relación con usuario_rol - sin backref porque UsuarioRol ya define la relación
    usuario_rol = relationship("UsuarioRol")
    
    def __repr__(self):
        return f"<Sueldo(id_sueldo={self.id_sueldo}, id_usuario={self.id_usuario}, sueldo_adicional={self.sueldo_adicional})>"