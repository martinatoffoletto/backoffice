from sqlalchemy import Column, String, Integer, ForeignKey, Enum, Text, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import uuid

Base = declarative_base()

class Espacio(Base):
    __tablename__ = "spaces"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parentId = Column(UUID(as_uuid=True), ForeignKey("spaces.id"))
    type = Column(Enum("HEADQUARTERS", "BUILDING", "CLASSROOM", "MEETING_ROOM", "COMMON_SPACE", name="space_type"), nullable=False)
    code = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    capacity = Column(Integer)
    address = Column(Text)
    geoLat = Column(Numeric(9,6))
