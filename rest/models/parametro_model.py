from sqlalchemy import Column, String, Boolean, JSON, Enum, Text, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import uuid

Base = declarative_base()

class Parametro(Base):
    __tablename__ = "parameters"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scope = Column(Enum("LIBRARY", "DINING", "EVENTS", "STORE", "GENERAL", name="parameter_scope"), nullable=False)
    key = Column(String, nullable=False)
    valueJson = Column(JSON, nullable=False)
    isActive = Column(Boolean, nullable=False, default=True)
