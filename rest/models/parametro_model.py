from sqlalchemy import Column, String, Boolean, DateTime, Text, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from .base import Base
import uuid

class Parametro(Base):
    __tablename__ = "parametros"
    
    id_parametro = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    nombre = Column(String(100), unique=True, nullable=False, index=True)
    tipo = Column(String(50), nullable=False, index=True)
    valor_numerico = Column(Numeric(15, 2), nullable=True)
    valor_texto = Column(Text, nullable=True)
    status = Column(Boolean, default=True, nullable=False)
    
    def __repr__(self):
        return f"<Parametro(id_parametro={self.id_parametro}, nombre='{self.nombre}', tipo='{self.tipo}')>"