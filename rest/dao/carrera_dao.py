from sqlalchemy.orm import Session
from ..models.carrera_model import Carrera
from ..schemas.carrera_schema import CarreraCreate, CarreraUpdate
from typing import List, Optional
from uuid import UUID
import uuid

class CarreraDAO:
    
    @staticmethod
    def create(db: Session, carrera: CarreraCreate) -> Carrera:
        db_carrera = Carrera(
            nombre=carrera.nombre,
            nivel=carrera.nivel.value,
            duracion_anios=carrera.duracion_anios,
            status=True
        )
        db.add(db_carrera)
        db.commit()
        db.refresh(db_carrera)
        return db_carrera
    
    @staticmethod
    def get_by_id(db: Session, id_carrera: UUID) -> Optional[Carrera]:
        return db.query(Carrera).filter(
            Carrera.id_carrera == id_carrera,
            Carrera.status == True
        ).first()
    
    @staticmethod
    def get_by_nombre(db: Session, nombre: str) -> Optional[Carrera]:
        return db.query(Carrera).filter(
            Carrera.nombre == nombre,
            Carrera.status == True
        ).first()
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[Carrera]:
        return db.query(Carrera).filter(Carrera.status == True).offset(skip).limit(limit).all()
    
    @staticmethod
    def search_by_nombre(db: Session, nombre_pattern: str, skip: int = 0, limit: int = 100) -> List[Carrera]:
        return db.query(Carrera).filter(
            Carrera.nombre.ilike(f"%{nombre_pattern}%"),
            Carrera.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def update(db: Session, id_carrera: UUID, carrera_update: CarreraUpdate) -> Optional[Carrera]:
        db_carrera = db.query(Carrera).filter(Carrera.id_carrera == id_carrera).first()
        if db_carrera:
            update_data = carrera_update.dict(exclude_unset=True)
            
            if 'nivel' in update_data and update_data['nivel']:
                update_data['nivel'] = update_data['nivel'].value

            for key, value in update_data.items():
                setattr(db_carrera, key, value)
            
            db.commit()
            db.refresh(db_carrera)
        return db_carrera
    
    @staticmethod
    def soft_delete(db: Session, id_carrera: UUID) -> bool:
        db_carrera = db.query(Carrera).filter(Carrera.id_carrera == id_carrera).first()
        if db_carrera:
            db_carrera.status = False
            db.commit()
            return True
        return False
    
    @staticmethod
    def restore(db: Session, id_carrera: UUID) -> bool:
        db_carrera = db.query(Carrera).filter(Carrera.id_carrera == id_carrera).first()
        if db_carrera:
            db_carrera.status = True
            db.commit()
            return True
        return False

    @staticmethod
    def exists_by_nombre(db: Session, nombre: str, exclude_id: Optional[UUID] = None) -> bool:
        query = db.query(Carrera).filter(Carrera.nombre == nombre)
        if exclude_id:
            query = query.filter(Carrera.id_carrera != exclude_id)
        return query.first() is not None
