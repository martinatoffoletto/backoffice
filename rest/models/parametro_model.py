from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Numeric
from sqlalchemy.sql import func
from .base import Base

class Parametro(Base):
    __tablename__ = "parametros"
    
    id_parametro = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), unique=True, nullable=False, index=True)
    tipo = Column(String(50), nullable=False, index=True)
    valor_numerico = Column(Numeric(15, 2), nullable=True)
    valor_texto = Column(Text, nullable=True)
    fecha_modificacion = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    status = Column(Boolean, default=True, nullable=False)
    
    def __repr__(self):
        return f"<Parametro(id_parametro={self.id_parametro}, nombre='{self.nombre}', tipo='{self.tipo}')>"