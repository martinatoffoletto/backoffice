from sqlalchemy import Column, Numeric, ForeignKey, String, Enum, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import uuid
from .enums import Position

Base = declarative_base()

class Sueldo(Base):
    __tablename__ = "salaries"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    userId = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    cbu = Column(String(22), nullable=False)
    position = Column(Enum(Position), nullable=False)
    baseSalary = Column(Numeric(12,2), nullable=False)
    yearsOfService = Column(Integer, nullable=False, default=0)
    seniorityMultiplier = Column(Numeric(5,4), nullable=False, default=1.0000)
    amount = Column(Numeric(12,2), nullable=False)
