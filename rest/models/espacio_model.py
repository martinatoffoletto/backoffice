from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import enum

Base = declarative_base()

class TipoEspacio(enum.Enum):
    AULA = "aula"
    LABORATORIO = "laboratorio"
    ESPACIO_COMUN = "espacio_comun"
    OFICINA = "oficina"
    OTROS = "otros"

class EstadoEspacio(enum.Enum):
    DISPONIBLE = "disponible"
    OCUPADO = "ocupado"
    EN_MANTENIMIENTO = "en_mantenimiento"

class Espacio(Base):
    __tablename__ = "espacios"
    
    id_espacio = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), unique=True, nullable=False, index=True)
    tipo = Column(Enum(TipoEspacio), nullable=False)
    capacidad = Column(Integer, nullable=False)
    ubicacion = Column(Text, nullable=False)
    estado = Column(Enum(EstadoEspacio), default=EstadoEspacio.DISPONIBLE, nullable=False)
    id_sede = Column(Integer, ForeignKey("sedes.id_sede", ondelete="CASCADE"), nullable=False)
    status = Column(Boolean, default=True, nullable=False)
    
    # Relación con sede
    sede = relationship("Sede", back_populates="espacios")
    
    def __repr__(self):
        return f"<Espacio(id_espacio={self.id_espacio}, nombre='{self.nombre}', tipo='{self.tipo.value}')>"