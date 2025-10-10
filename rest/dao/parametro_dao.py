from sqlalchemy.orm import Session
from ..models.parametro_model import Parametro
from ..schemas.parametro_schema import Parametro as ParametroSchema
from typing import List, Optional

class ParametroDAO:
    
    @staticmethod
    def create(db: Session, parametro: ParametroSchema) -> Parametro:
        """Crear un nuevo parámetro del sistema"""
        db_parametro = Parametro(
            key=parametro.key,
            value=parametro.value,
            description=parametro.description,
            tipo=parametro.tipo,
            categoria=parametro.categoria,
            es_editable=parametro.es_editable,
            valor_por_defecto=parametro.valor_por_defecto,
            created_by=parametro.created_by
        )
        db.add(db_parametro)
        db.commit()
        db.refresh(db_parametro)
        return db_parametro
    
    @staticmethod
    def get_by_id(db: Session, id_parametro: int) -> Optional[Parametro]:
        """Obtener parámetro por ID"""
        return db.query(Parametro).filter(
            Parametro.id_parametro == id_parametro,
            Parametro.status == True
        ).first()
    
    @staticmethod
    def get_by_key(db: Session, key: str) -> Optional[Parametro]:
        """Obtener parámetro por clave única"""
        return db.query(Parametro).filter(
            Parametro.key == key,
            Parametro.status == True
        ).first()
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[Parametro]:
        """Obtener todos los parámetros activos"""
        return db.query(Parametro).filter(
            Parametro.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_categoria(db: Session, categoria: str, skip: int = 0, limit: int = 100) -> List[Parametro]:
        """Obtener parámetros por categoría"""
        return db.query(Parametro).filter(
            Parametro.categoria == categoria,
            Parametro.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_tipo(db: Session, tipo: str, skip: int = 0, limit: int = 100) -> List[Parametro]:
        """Obtener parámetros por tipo"""
        return db.query(Parametro).filter(
            Parametro.tipo == tipo,
            Parametro.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_editables(db: Session, skip: int = 0, limit: int = 100) -> List[Parametro]:
        """Obtener solo parámetros editables"""
        return db.query(Parametro).filter(
            Parametro.es_editable == True,
            Parametro.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def search_by_key(db: Session, key_pattern: str, skip: int = 0, limit: int = 100) -> List[Parametro]:
        """Buscar parámetros por patrón en la clave"""
        return db.query(Parametro).filter(
            Parametro.key.ilike(f"%{key_pattern}%"),
            Parametro.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def search_by_description(db: Session, description_pattern: str, skip: int = 0, limit: int = 100) -> List[Parametro]:
        """Buscar parámetros por patrón en la descripción"""
        return db.query(Parametro).filter(
            Parametro.description.ilike(f"%{description_pattern}%"),
            Parametro.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def update(db: Session, id_parametro: int, parametro_update: ParametroSchema) -> Optional[Parametro]:
        """Actualizar un parámetro existente"""
        db_parametro = db.query(Parametro).filter(
            Parametro.id_parametro == id_parametro,
            Parametro.status == True
        ).first()
        
        if not db_parametro:
            return None
        
        # Solo actualizar campos que no son None
        if parametro_update.key is not None:
            db_parametro.key = parametro_update.key
        if parametro_update.value is not None:
            db_parametro.value = parametro_update.value
        if parametro_update.description is not None:
            db_parametro.description = parametro_update.description
        if parametro_update.tipo is not None:
            db_parametro.tipo = parametro_update.tipo
        if parametro_update.categoria is not None:
            db_parametro.categoria = parametro_update.categoria
        if parametro_update.es_editable is not None:
            db_parametro.es_editable = parametro_update.es_editable
        if parametro_update.valor_por_defecto is not None:
            db_parametro.valor_por_defecto = parametro_update.valor_por_defecto
        if parametro_update.updated_by is not None:
            db_parametro.updated_by = parametro_update.updated_by
        
        db.commit()
        db.refresh(db_parametro)
        return db_parametro
    
    @staticmethod
    def update_value(db: Session, key: str, new_value: str, updated_by: str) -> Optional[Parametro]:
        """Actualizar solo el valor de un parámetro por clave"""
        db_parametro = db.query(Parametro).filter(
            Parametro.key == key,
            Parametro.status == True,
            Parametro.es_editable == True
        ).first()
        
        if not db_parametro:
            return None
        
        db_parametro.value = new_value
        db_parametro.updated_by = updated_by
        
        db.commit()
        db.refresh(db_parametro)
        return db_parametro
    
    @staticmethod
    def soft_delete(db: Session, id_parametro: int, deleted_by: str) -> bool:
        """Eliminación lógica de un parámetro"""
        db_parametro = db.query(Parametro).filter(
            Parametro.id_parametro == id_parametro,
            Parametro.status == True
        ).first()
        
        if db_parametro:
            db_parametro.status = False
            db_parametro.deleted_by = deleted_by
            db.commit()
            return True
        return False
    
    @staticmethod
    def restore(db: Session, id_parametro: int, updated_by: str) -> bool:
        """Restaurar un parámetro eliminado lógicamente"""
        db_parametro = db.query(Parametro).filter(
            Parametro.id_parametro == id_parametro,
            Parametro.status == False
        ).first()
        
        if db_parametro:
            db_parametro.status = True
            db_parametro.deleted_by = None
            db_parametro.updated_by = updated_by
            db.commit()
            return True
        return False
    
    @staticmethod
    def exists_by_key(db: Session, key: str) -> bool:
        """Verificar si existe un parámetro con esa clave"""
        return db.query(Parametro).filter(Parametro.key == key).first() is not None
    
    @staticmethod
    def get_value(db: Session, key: str) -> Optional[str]:
        """Obtener solo el valor de un parámetro por clave"""
        parametro = db.query(Parametro).filter(
            Parametro.key == key,
            Parametro.status == True
        ).first()
        return parametro.value if parametro else None
    
    @staticmethod
    def get_all_categories(db: Session) -> List[str]:
        """Obtener todas las categorías únicas de parámetros"""
        categorias = db.query(Parametro.categoria).filter(
            Parametro.status == True
        ).distinct().all()
        return [cat[0] for cat in categorias if cat[0]]
    
    @staticmethod
    def get_all_types(db: Session) -> List[str]:
        """Obtener todos los tipos únicos de parámetros"""
        tipos = db.query(Parametro.tipo).filter(
            Parametro.status == True
        ).distinct().all()
        return [tipo[0] for tipo in tipos if tipo[0]]