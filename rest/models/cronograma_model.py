from sqlalchemy import Column, String, Integer, Text, Date, Time, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import uuid
from .enums import DayOfWeek, EvaluationType

Base = declarative_base()

class Cronograma(Base):
    __tablename__ = "schedules"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    courseId = Column(UUID(as_uuid=True), nullable=False)
    courseName = Column(String, nullable=False)
    totalClasses = Column(Integer, nullable=False)
    startDate = Column(Date, nullable=False)
    endDate = Column(Date, nullable=False)
    startTime = Column(Time, nullable=False)
    endTime = Column(Time, nullable=False)
    
    classes = relationship("ClaseIndividual", back_populates="cronograma", cascade="all, delete-orphan")
    evaluations = relationship("Evaluacion", back_populates="cronograma", cascade="all, delete-orphan")

class ClaseIndividual(Base):
    __tablename__ = "individual_classes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cronogramaId = Column(UUID(as_uuid=True), ForeignKey("schedules.id", ondelete="CASCADE"), nullable=False)
    classNumber = Column(Integer, nullable=False)
    dayOfWeek = Column(Enum(DayOfWeek), nullable=False)
    classDate = Column(Date, nullable=False)
    topic = Column(Text)
    
    cronograma = relationship("Cronograma", back_populates="classes")

class Evaluacion(Base):
    __tablename__ = "evaluations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cronogramaId = Column(UUID(as_uuid=True), ForeignKey("schedules.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    evaluationType = Column(Enum(EvaluationType), nullable=False)
    evaluationDate = Column(Date, nullable=False)
    startTime = Column(Time)
    endTime = Column(Time)
    description = Column(Text)
    weight = Column(Integer, default=100)
    
    cronograma = relationship("Cronograma", back_populates="evaluations")