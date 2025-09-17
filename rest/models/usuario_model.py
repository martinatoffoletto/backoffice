from sqlalchemy import Column, String, Enum, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import uuid

Base = declarative_base()

class Usuario(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email_universitario = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    nombre = Column(String)
    apellido = Column(String)
    dni = Column(String, unique=True)
    estado = Column(Enum("ACTIVO", "INACTIVO", "SUSPENDIDO", name="user_state"), nullable=False, default="ACTIVO")
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id"), nullable=False)
