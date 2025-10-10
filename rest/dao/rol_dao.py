from sqlalchemy.orm import Session
from ..models.rol_model import Rol
from ..schemas.rol_schema import Rol as RolSchema
from typing import List, Optional

class RolDAO:
    
    @staticmethod
    def create(db: Session, rol: RolSchema) -> Rol:
        """Crear un nuevo rol"""
        db_rol = Rol(
            nombre_rol=rol.nombre_rol,
            descripcion=rol.descripcion,
            status=rol.status
        )
        db.add(db_rol)
        db.commit()
        db.refresh(db_rol)
        return db_rol
    
    @staticmethod
    def get_by_id(db: Session, id_rol: int) -> Optional[Rol]:
        """Obtener rol por ID"""
        return db.query(Rol).filter(Rol.id_rol == id_rol).first()
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[Rol]:
        """Obtener todos los roles activos"""
        return db.query(Rol).filter(Rol.status == True).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_nombre(db: Session, nombre_rol: str) -> Optional[Rol]:
        """Obtener rol por nombre exacto"""
        return db.query(Rol).filter(Rol.nombre_rol == nombre_rol).first()
    
    @staticmethod
    def search_by_nombre(db: Session, nombre_partial: str) -> List[Rol]:
        """Buscar roles por nombre (coincidencia parcial)"""
        return db.query(Rol).filter(
            Rol.nombre_rol.ilike(f"%{nombre_partial}%"),
            Rol.status == True
        ).all()
    
    @staticmethod
    def update(db: Session, id_rol: int, rol_update: RolSchema) -> Optional[Rol]:
        """Actualizar un rol"""
        db_rol = db.query(Rol).filter(Rol.id_rol == id_rol).first()
        if db_rol:
            if rol_update.nombre_rol is not None:
                db_rol.nombre_rol = rol_update.nombre_rol
            if rol_update.descripcion is not None:
                db_rol.descripcion = rol_update.descripcion
            if rol_update.status is not None:
                db_rol.status = rol_update.status
            
            db.commit()
            db.refresh(db_rol)
        return db_rol
    
    @staticmethod
    def soft_delete(db: Session, id_rol: int) -> bool:
        """Soft delete: marcar rol como inactivo"""
        db_rol = db.query(Rol).filter(Rol.id_rol == id_rol).first()
        if db_rol:
            db_rol.status = False
            db.commit()
            return True
        return False
    
    @staticmethod
    def exists_by_nombre(db: Session, nombre_rol: str, exclude_id: Optional[int] = None) -> bool:
        """Verificar si existe un rol con el nombre dado"""
        query = db.query(Rol).filter(Rol.nombre_rol == nombre_rol)
        if exclude_id:
            query = query.filter(Rol.id_rol != exclude_id)
        return query.first() is not None