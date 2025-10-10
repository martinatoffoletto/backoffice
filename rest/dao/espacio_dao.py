from sqlalchemy.orm import Session
from ..models.espacio_model import Espacio
from ..models.sede_model import Sede
from ..schemas.espacio_schema import Espacio as EspacioSchema
from typing import List, Optional

class EspacioDAO:
    
    @staticmethod
    def create(db: Session, espacio: EspacioSchema) -> Espacio:
        """Crear un nuevo espacio"""
        db_espacio = Espacio(
            nombre_espacio=espacio.nombre_espacio,
            id_sede=espacio.id_sede,
            tipo_espacio=espacio.tipo_espacio,
            capacidad=espacio.capacidad,
            tiene_proyector=espacio.tiene_proyector,
            tiene_sonido=espacio.tiene_sonido,
            tiene_internet=espacio.tiene_internet,
            tiene_aire_acondicionado=espacio.tiene_aire_acondicionado,
            observaciones=espacio.observaciones,
            created_by=espacio.created_by
        )
        db.add(db_espacio)
        db.commit()
        db.refresh(db_espacio)
        return db_espacio
    
    @staticmethod
    def get_by_id(db: Session, id_espacio: int) -> Optional[Espacio]:
        """Obtener espacio por ID"""
        return db.query(Espacio).filter(
            Espacio.id_espacio == id_espacio,
            Espacio.status == True
        ).first()
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[Espacio]:
        """Obtener todos los espacios activos"""
        return db.query(Espacio).filter(
            Espacio.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_sede(db: Session, id_sede: int, skip: int = 0, limit: int = 100) -> List[Espacio]:
        """Obtener espacios por sede"""
        return db.query(Espacio).filter(
            Espacio.id_sede == id_sede,
            Espacio.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_tipo(db: Session, tipo_espacio: str, skip: int = 0, limit: int = 100) -> List[Espacio]:
        """Obtener espacios por tipo"""
        return db.query(Espacio).filter(
            Espacio.tipo_espacio == tipo_espacio,
            Espacio.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def search_by_nombre(db: Session, nombre_pattern: str, skip: int = 0, limit: int = 100) -> List[Espacio]:
        """Buscar espacios por patrón en el nombre"""
        return db.query(Espacio).filter(
            Espacio.nombre_espacio.ilike(f"%{nombre_pattern}%"),
            Espacio.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_with_capacity_greater_than(db: Session, capacidad_minima: int, skip: int = 0, limit: int = 100) -> List[Espacio]:
        """Obtener espacios con capacidad mayor a la especificada"""
        return db.query(Espacio).filter(
            Espacio.capacidad >= capacidad_minima,
            Espacio.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_with_projector(db: Session, skip: int = 0, limit: int = 100) -> List[Espacio]:
        """Obtener espacios que tienen proyector"""
        return db.query(Espacio).filter(
            Espacio.tiene_proyector == True,
            Espacio.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_with_sound(db: Session, skip: int = 0, limit: int = 100) -> List[Espacio]:
        """Obtener espacios que tienen sonido"""
        return db.query(Espacio).filter(
            Espacio.tiene_sonido == True,
            Espacio.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_with_internet(db: Session, skip: int = 0, limit: int = 100) -> List[Espacio]:
        """Obtener espacios que tienen internet"""
        return db.query(Espacio).filter(
            Espacio.tiene_internet == True,
            Espacio.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_with_air_conditioning(db: Session, skip: int = 0, limit: int = 100) -> List[Espacio]:
        """Obtener espacios que tienen aire acondicionado"""
        return db.query(Espacio).filter(
            Espacio.tiene_aire_acondicionado == True,
            Espacio.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_filters(db: Session, 
                      id_sede: Optional[int] = None,
                      tipo_espacio: Optional[str] = None,
                      capacidad_minima: Optional[int] = None,
                      necesita_proyector: Optional[bool] = None,
                      necesita_sonido: Optional[bool] = None,
                      necesita_internet: Optional[bool] = None,
                      necesita_aire: Optional[bool] = None,
                      skip: int = 0, limit: int = 100) -> List[Espacio]:
        """Obtener espacios aplicando múltiples filtros"""
        query = db.query(Espacio).filter(Espacio.status == True)
        
        if id_sede is not None:
            query = query.filter(Espacio.id_sede == id_sede)
        if tipo_espacio is not None:
            query = query.filter(Espacio.tipo_espacio == tipo_espacio)
        if capacidad_minima is not None:
            query = query.filter(Espacio.capacidad >= capacidad_minima)
        if necesita_proyector is not None:
            query = query.filter(Espacio.tiene_proyector == necesita_proyector)
        if necesita_sonido is not None:
            query = query.filter(Espacio.tiene_sonido == necesita_sonido)
        if necesita_internet is not None:
            query = query.filter(Espacio.tiene_internet == necesita_internet)
        if necesita_aire is not None:
            query = query.filter(Espacio.tiene_aire_acondicionado == necesita_aire)
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def get_with_sede_info(db: Session, id_espacio: int) -> Optional[dict]:
        """Obtener espacio con información de la sede"""
        result = db.query(Espacio, Sede).join(Sede).filter(
            Espacio.id_espacio == id_espacio,
            Espacio.status == True,
            Sede.status == True
        ).first()
        
        if not result:
            return None
        
        espacio, sede = result
        return {
            "espacio": espacio,
            "sede": {
                "nombre_sede": sede.nombre_sede,
                "ciudad": sede.ciudad,
                "provincia": sede.provincia,
                "direccion": sede.direccion
            }
        }
    
    @staticmethod
    def update(db: Session, id_espacio: int, espacio_update: EspacioSchema) -> Optional[Espacio]:
        """Actualizar un espacio existente"""
        db_espacio = db.query(Espacio).filter(
            Espacio.id_espacio == id_espacio,
            Espacio.status == True
        ).first()
        
        if not db_espacio:
            return None
        
        # Solo actualizar campos que no son None
        if espacio_update.nombre_espacio is not None:
            db_espacio.nombre_espacio = espacio_update.nombre_espacio
        if espacio_update.id_sede is not None:
            db_espacio.id_sede = espacio_update.id_sede
        if espacio_update.tipo_espacio is not None:
            db_espacio.tipo_espacio = espacio_update.tipo_espacio
        if espacio_update.capacidad is not None:
            db_espacio.capacidad = espacio_update.capacidad
        if espacio_update.tiene_proyector is not None:
            db_espacio.tiene_proyector = espacio_update.tiene_proyector
        if espacio_update.tiene_sonido is not None:
            db_espacio.tiene_sonido = espacio_update.tiene_sonido
        if espacio_update.tiene_internet is not None:
            db_espacio.tiene_internet = espacio_update.tiene_internet
        if espacio_update.tiene_aire_acondicionado is not None:
            db_espacio.tiene_aire_acondicionado = espacio_update.tiene_aire_acondicionado
        if espacio_update.observaciones is not None:
            db_espacio.observaciones = espacio_update.observaciones
        if espacio_update.updated_by is not None:
            db_espacio.updated_by = espacio_update.updated_by
        
        db.commit()
        db.refresh(db_espacio)
        return db_espacio
    
    @staticmethod
    def soft_delete(db: Session, id_espacio: int, deleted_by: str) -> bool:
        """Eliminación lógica de un espacio"""
        db_espacio = db.query(Espacio).filter(
            Espacio.id_espacio == id_espacio,
            Espacio.status == True
        ).first()
        
        if db_espacio:
            db_espacio.status = False
            db_espacio.deleted_by = deleted_by
            db.commit()
            return True
        return False
    
    @staticmethod
    def restore(db: Session, id_espacio: int, updated_by: str) -> bool:
        """Restaurar un espacio eliminado lógicamente"""
        db_espacio = db.query(Espacio).filter(
            Espacio.id_espacio == id_espacio,
            Espacio.status == False
        ).first()
        
        if db_espacio:
            db_espacio.status = True
            db_espacio.deleted_by = None
            db_espacio.updated_by = updated_by
            db.commit()
            return True
        return False
    
    @staticmethod
    def exists_by_nombre_and_sede(db: Session, nombre_espacio: str, id_sede: int) -> bool:
        """Verificar si existe un espacio con ese nombre en esa sede"""
        return db.query(Espacio).filter(
            Espacio.nombre_espacio == nombre_espacio,
            Espacio.id_sede == id_sede
        ).first() is not None
    
    @staticmethod
    def get_all_tipos(db: Session) -> List[str]:
        """Obtener todos los tipos únicos de espacios"""
        tipos = db.query(Espacio.tipo_espacio).filter(
            Espacio.status == True
        ).distinct().all()
        return [tipo[0] for tipo in tipos if tipo[0]]
    
    @staticmethod
    def count_by_sede(db: Session, id_sede: int) -> int:
        """Contar espacios activos por sede"""
        return db.query(Espacio).filter(
            Espacio.id_sede == id_sede,
            Espacio.status == True
        ).count()