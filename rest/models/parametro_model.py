from sqlalchemy import Column, String, Boolean, JSON, Enum, Text, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import uuid

Base = declarative_base()

class Parametro(Base):
    __tablename__ = "parameters"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scope = Column(Enum("BIBLIOTECA", "COMEDOR", "EVENTOS", "TIENDA", "GENERAL", name="parameter_scope"), nullable=False)
    key = Column(String, nullable=False)
    value_json = Column(JSON, nullable=False)
    valid_from = Column(TIMESTAMP(timezone=True), nullable=False)
    valid_to = Column(TIMESTAMP(timezone=True))
    is_active = Column(Boolean, nullable=False, default=True)
