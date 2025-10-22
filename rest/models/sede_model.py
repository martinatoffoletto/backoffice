from sqlalchemy import Column, Integer, String, Boolean, Text
from sqlalchemy.orm import relationship
from .base import Base

class Sede(Base):
    __tablename__ = "sedes"
    
    id_sede = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), unique=True, nullable=False, index=True)
    ubicacion = Column(Text, nullable=False)
    status = Column(Boolean, default=True, nullable=False)
    
    # Relación con espacios
    espacios = relationship("Espacio", back_populates="sede")
    
    def __repr__(self):
        return f"<Sede(id_sede={self.id_sede}, nombre='{self.nombre}')>"