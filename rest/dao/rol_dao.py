from sqlalchemy.orm import Session
from ..models.rol_model import Rol, CategoriaRol
from ..schemas.rol_schema import RolCreate, RolUpdate
from typing import List, Optional
from sqlalchemy import or_, and_
import uuid

class RolDAO:
    
    def create(self, db: Session, rol: RolCreate) -> Rol:
        """Crear un nuevo rol"""
        db_rol = Rol(
            nombre_rol=rol.nombre_rol,
            descripcion=rol.descripcion,
            subcategoria=rol.subcategoria,
            sueldo_base=rol.sueldo_base,
            status=rol.status
        )
        db.add(db_rol)
        db.commit()
        db.refresh(db_rol)
        return db_rol
    
    def get_by_id(self, db: Session, id_rol: uuid.UUID) -> Optional[Rol]:
        """Obtener rol por ID"""
        return db.query(Rol).filter(
            and_(Rol.id_rol == id_rol, Rol.status == True)
        ).first()
    
    def get_by_nombre(self, db: Session, nombre_rol: str) -> Optional[Rol]:
        """Obtener rol por nombre exacto"""
        return db.query(Rol).filter(
            and_(Rol.nombre_rol == nombre_rol, Rol.status == True)
        ).first()
    
    def get_by_categoria(self, db: Session, categoria: CategoriaRol, skip: int = 0, limit: int = 100) -> List[Rol]:
        """Obtener roles por categoría/subcategoría"""
        return db.query(Rol).filter(
            and_(Rol.subcategoria == categoria, Rol.status == True)
        ).offset(skip).limit(limit).all()
    
    def get_by_subcategoria(self, db: Session, subcategoria: CategoriaRol, skip: int = 0, limit: int = 100) -> List[Rol]:
        """Obtener roles por subcategoría (alias de get_by_categoria para consistencia)"""
        return self.get_by_categoria(db, subcategoria, skip, limit)
    
    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[Rol]:
        """Obtener todos los roles activos"""
        return db.query(Rol).filter(Rol.status == True).offset(skip).limit(limit).all()
    
    def get_all_categories(self, db: Session) -> List[str]:
        # Retorna los valores del enum CategoriaRol
        return [categoria.value for categoria in CategoriaRol]
    
    def get_roles_by_categories_in_use(self, db: Session) -> List[dict]:
        results = db.query(Rol.subcategoria).filter(
            and_(Rol.status == True, Rol.subcategoria.isnot(None))
        ).distinct().all()
        
        categories_in_use = []
        for result in results:
            if result.subcategoria:
                categories_in_use.append({
                    "categoria": result.subcategoria.value,
                    "enum_value": result.subcategoria
                })
        
        return categories_in_use
    
    def search_by_nombre(self, db: Session, nombre_pattern: str, skip: int = 0, limit: int = 100) -> List[Rol]:
        """Buscar roles por patrón en el nombre (búsqueda parcial)"""
        return db.query(Rol).filter(
            and_(
                Rol.nombre_rol.ilike(f"%{nombre_pattern}%"),
                Rol.status == True
            )
        ).offset(skip).limit(limit).all()
    
    def update(self, db: Session, id_rol: uuid.UUID, rol_update: RolUpdate) -> Optional[Rol]:
        """Actualizar un rol"""
        db_rol = db.query(Rol).filter(Rol.id_rol == id_rol).first()
        if not db_rol:
            return None
        
        update_data = rol_update.dict(exclude_unset=True, exclude={'id_rol'})
        for field, value in update_data.items():
            if hasattr(db_rol, field):
                setattr(db_rol, field, value)
        
        db.commit()
        db.refresh(db_rol)
        return db_rol
    
    def soft_delete(self, db: Session, id_rol: uuid.UUID, deleted_by: str = None) -> bool:
        """Eliminación lógica: cambiar status a False"""
        db_rol = db.query(Rol).filter(Rol.id_rol == id_rol).first()
        if not db_rol:
            return False
        
        db_rol.status = False
        
        db.commit()
        return True
    
    
   