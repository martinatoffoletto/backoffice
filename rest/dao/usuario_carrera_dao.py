from sqlalchemy.orm import Session
from ..models.usuario_carrera_model import UsuarioCarrera
from ..models.carrera_model import Carrera
from ..models.usuario_model import Usuario
from ..schemas.usuario_carrera_schema import UsuarioCarrera as UsuarioCarreraSchema
from typing import List, Optional
from uuid import UUID

class UsuarioCarreraDAO:
    
    @staticmethod
    def assign(db: Session, id_usuario: UUID, id_carrera: UUID) -> UsuarioCarrera:
        db_assignment = UsuarioCarrera(
            id_usuario=id_usuario,
            id_carrera=id_carrera
        )
        db.add(db_assignment)
        db.commit()
        db.refresh(db_assignment)
        return db_assignment
    
    @staticmethod
    def remove(db: Session, id_usuario: UUID, id_carrera: UUID) -> bool:
        db_assignment = db.query(UsuarioCarrera).filter(
            UsuarioCarrera.id_usuario == id_usuario,
            UsuarioCarrera.id_carrera == id_carrera
        ).first()
        
        if db_assignment:
            db.delete(db_assignment)
            db.commit()
            return True
        return False
    
    @staticmethod
    def exists(db: Session, id_usuario: UUID, id_carrera: UUID) -> bool:
        return db.query(UsuarioCarrera).filter(
            UsuarioCarrera.id_usuario == id_usuario,
            UsuarioCarrera.id_carrera == id_carrera
        ).first() is not None
    
    @staticmethod
    def get_carreras_by_usuario(db: Session, id_usuario: UUID) -> List[Carrera]:
        return db.query(Carrera).join(UsuarioCarrera).filter(
            UsuarioCarrera.id_usuario == id_usuario,
            Carrera.status == True
        ).all()
        
    @staticmethod
    def get_usuarios_by_carrera(db: Session, id_carrera: UUID) -> List[Usuario]:
        return db.query(Usuario).join(UsuarioCarrera).filter(
            UsuarioCarrera.id_carrera == id_carrera,
            Usuario.status == True
        ).all()
