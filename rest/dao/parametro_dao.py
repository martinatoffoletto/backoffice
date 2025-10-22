from sqlalchemy.orm import Session
from ..models.parametro_model import Parametro
from ..schemas.parametro_schema import Parametro as ParametroSchema
from typing import List, Optional, Dict

class ParametroDAO:
    
    @staticmethod
    def create(db: Session, parametro: ParametroSchema) -> Parametro:
        """Crear un nuevo parámetro del sistema"""
        db_parametro = Parametro(
            nombre=parametro.nombre,
            tipo=parametro.tipo,
            valor_numerico=parametro.valor_numerico,
            valor_texto=parametro.valor_texto,
            status=parametro.status
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
    def get_by_nombre(db: Session, nombre: str) -> Optional[Parametro]:
        """Obtener parámetro por nombre único"""
        return db.query(Parametro).filter(
            Parametro.nombre == nombre,
            Parametro.status == True
        ).first()
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[Parametro]:
        """Obtener todos los parámetros activos"""
        return db.query(Parametro).filter(
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
    def search_by_nombre(db: Session, nombre_pattern: str, skip: int = 0, limit: int = 100) -> List[Parametro]:
        """Buscar parámetros por patrón en el nombre"""
        return db.query(Parametro).filter(
            Parametro.nombre.ilike(f"%{nombre_pattern}%"),
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
        
        if parametro_update.nombre is not None:
            db_parametro.nombre = parametro_update.nombre
        if parametro_update.tipo is not None:
            db_parametro.tipo = parametro_update.tipo
        if parametro_update.valor_numerico is not None:
            db_parametro.valor_numerico = parametro_update.valor_numerico
        if parametro_update.valor_texto is not None:
            db_parametro.valor_texto = parametro_update.valor_texto
        if parametro_update.status is not None:
            db_parametro.status = parametro_update.status
        
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
            db.commit()
            return True
        return False
    
    @staticmethod
    def exists_by_nombre(db: Session, nombre: str, exclude_id: Optional[int] = None) -> bool:
        """Verificar si existe un parámetro con ese nombre"""
        query = db.query(Parametro).filter(Parametro.nombre == nombre)
        if exclude_id:
            query = query.filter(Parametro.id_parametro != exclude_id)
        return query.first() is not None
    
    @staticmethod
    def get_valores_by_nombre(db: Session, nombre: str) -> Optional[Dict[str, any]]:
        """Obtener los valores (numerico y texto) de un parámetro por nombre"""
        parametro = db.query(Parametro).filter(
            Parametro.nombre == nombre,
            Parametro.status == True
        ).first()
        if not parametro:
            return None
        return {
            "valor_numerico": parametro.valor_numerico,
            "valor_texto": parametro.valor_texto
        }
    
    @staticmethod
    def get_all_tipos(db: Session) -> List[str]:
        """Obtener todos los tipos únicos de parámetros"""
        tipos = db.query(Parametro.tipo).filter(
            Parametro.status == True
        ).distinct().all()
        return [tipo[0] for tipo in tipos if tipo[0]]