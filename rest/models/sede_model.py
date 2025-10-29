from sqlalchemy import Column, String, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .base import Base
import uuid

class Sede(Base):
    __tablename__ = "sedes"
    
    id_sede = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    nombre = Column(String(100), unique=True, nullable=False, index=True)
    ubicacion = Column(Text, nullable=False)
    status = Column(Boolean, default=True, nullable=False)
    
    # Relación con espacios
    espacios = relationship("Espacio", back_populates="sede")
    
    def __repr__(self):
        return f"<Sede(id_sede={self.id_sede}, nombre='{self.nombre}')>"