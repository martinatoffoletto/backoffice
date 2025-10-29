from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Numeric, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base
import uuid

class Rol(Base):
    __tablename__ = "roles"
    
    id_rol = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    descripcion = Column(Text, nullable=True)
    categoria = Column(String(50), nullable=False, unique=True, comment="Categoría principal del rol")
    subcategoria = Column(String(50), nullable=True, comment="Subcategoría específica del rol")
    sueldo_base = Column(Numeric(15, 2), default=0, nullable=False)
    status = Column(Boolean, default=True, nullable=False)
    
    # Restricción única para subcategoría dentro de categoría
    __table_args__ = (
        UniqueConstraint('categoria', 'subcategoria', name='uq_rol_categoria_subcategoria'),
    )
    
    # Relaciones
    usuarios = relationship("Usuario", back_populates="rol")
    
    def __repr__(self):
        return f"<Rol(id_rol={self.id_rol}, categoria='{self.categoria}', subcategoria='{self.subcategoria}')>"