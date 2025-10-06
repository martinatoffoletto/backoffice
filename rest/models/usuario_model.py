from sqlalchemy import Column, String, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import uuid
from .enums import UserRole, UserState

Base = declarative_base()

class Usuario(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    firstName = Column(String)
    lastName = Column(String)
    dni = Column(String, unique=True)
    state = Column(Enum(UserState), nullable=False, default=UserState.ACTIVO)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.ALUMNO)
