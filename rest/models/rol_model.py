from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Numeric, TypeDecorator
from sqlalchemy.dialects.postgresql import UUID, ENUM
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base
import enum
import uuid

class CategoriaRol(enum.Enum):
    DOCENTE = "docente"
    ADMINISTRATIVO = "administrativo"
    ADMINISTRATIVO_IT = "administrativo_it"
    ALUMNO = "alumno"

class CategoriaRolType(TypeDecorator):
    """Custom type for CategoriaRol enum that handles PostgreSQL enum values"""
    impl = ENUM('docente', 'administrativo', 'administrativo_it', 'alumno', name='categoria_rol', create_type=False)
    cache_ok = True
    
    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        if isinstance(value, CategoriaRol):
            return value.value
        return value
    
    def process_result_value(self, value, dialect):
        if value is None:
            return value
        # Convert database string value back to enum
        for categoria in CategoriaRol:
            if categoria.value == value:
                return categoria
        return value
    
class Rol(Base):
    __tablename__ = "roles"
    
    id_rol = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    nombre_rol = Column(String(100), unique=True, nullable=False, index=True)
    descripcion = Column(Text, nullable=True)
    subcategoria = Column(CategoriaRolType(), nullable=True)
    sueldo_base = Column(Numeric(15, 2), default=0, nullable=False)
    status = Column(Boolean, default=True, nullable=False)
    
    # Relaciones
    usuarios = relationship("UsuarioRol", back_populates="rol")
    
    def __repr__(self):
        return f"<Rol(id_rol={self.id_rol}, nombre_rol='{self.nombre_rol}')>"