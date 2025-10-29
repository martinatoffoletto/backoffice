from sqlalchemy import Column, String, Boolean, Text, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .base import Base
import uuid

class Sueldo(Base):
    __tablename__ = "sueldos"
    id_sueldo = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    id_usuario = Column(UUID(as_uuid=True), ForeignKey("usuarios.id_usuario", ondelete="CASCADE"), nullable=False)
    cbu = Column(String(22), nullable=False) 
    sueldo_adicional = Column(Numeric(15, 2), default=0, nullable=False)
    observaciones = Column(Text, nullable=True)
    status = Column(Boolean, default=True, nullable=False)
    
    # Relación con usuario
    usuario = relationship("Usuario")
    
    def __repr__(self):
        return f"<Sueldo(id_sueldo={self.id_sueldo}, id_usuario={self.id_usuario}, sueldo_adicional={self.sueldo_adicional})>"