"""
Shared SQLAlchemy base for all models
"""
from sqlalchemy.ext.declarative import declarative_base

# Shared Base instance for all models
Base = declarative_base()