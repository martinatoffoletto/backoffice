from sqlalchemy import Column, String, Integer, ForeignKey, Enum, Text, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import uuid

Base = declarative_base()

class Espacio(Base):
    __tablename__ = "spaces"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("spaces.id"))
    type = Column(Enum("SEDE", "EDIFICIO", "AULA", "SALA_REUNIONES", "ESPACIO_COMUN", name="space_type"), nullable=False)
    code = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    descripcion = Column(Text)
    capacidad = Column(Integer)
    direccion = Column(Text)
    geo_lat = Column(Numeric(9,6))
