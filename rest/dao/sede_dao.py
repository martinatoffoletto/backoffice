from sqlalchemy.orm import Session
from ..models.sede_model import Sede
from ..schemas.sede_schema import Sede as SedeSchema
from typing import List, Optional

class SedeDAO:
    
    @staticmethod
    def create(db: Session, sede: SedeSchema) -> Sede:
        """Crear una nueva sede"""
        db_sede = Sede(
            codigo_sede=sede.codigo_sede,
            nombre_sede=sede.nombre_sede,
            direccion=sede.direccion,
            ciudad=sede.ciudad,
            provincia=sede.provincia,
            codigo_postal=sede.codigo_postal,
            telefono=sede.telefono,
            email=sede.email,
            tipo_sede=sede.tipo_sede,
            capacidad_maxima=sede.capacidad_maxima,
            observaciones=sede.observaciones,
            created_by=sede.created_by
        )
        db.add(db_sede)
        db.commit()
        db.refresh(db_sede)
        return db_sede
    
    @staticmethod
    def get_by_id(db: Session, id_sede: int) -> Optional[Sede]:
        """Obtener sede por ID"""
        return db.query(Sede).filter(
            Sede.id_sede == id_sede,
            Sede.status == True
        ).first()
    
    @staticmethod
    def get_by_codigo(db: Session, codigo_sede: str) -> Optional[Sede]:
        """Obtener sede por código único"""
        return db.query(Sede).filter(
            Sede.codigo_sede == codigo_sede,
            Sede.status == True
        ).first()
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[Sede]:
        """Obtener todas las sedes activas"""
        return db.query(Sede).filter(
            Sede.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_ciudad(db: Session, ciudad: str, skip: int = 0, limit: int = 100) -> List[Sede]:
        """Obtener sedes por ciudad"""
        return db.query(Sede).filter(
            Sede.ciudad.ilike(f"%{ciudad}%"),
            Sede.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_provincia(db: Session, provincia: str, skip: int = 0, limit: int = 100) -> List[Sede]:
        """Obtener sedes por provincia"""
        return db.query(Sede).filter(
            Sede.provincia.ilike(f"%{provincia}%"),
            Sede.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_tipo(db: Session, tipo_sede: str, skip: int = 0, limit: int = 100) -> List[Sede]:
        """Obtener sedes por tipo"""
        return db.query(Sede).filter(
            Sede.tipo_sede == tipo_sede,
            Sede.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def search_by_nombre(db: Session, nombre_pattern: str, skip: int = 0, limit: int = 100) -> List[Sede]:
        """Buscar sedes por patrón en el nombre"""
        return db.query(Sede).filter(
            Sede.nombre_sede.ilike(f"%{nombre_pattern}%"),
            Sede.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def search_by_direccion(db: Session, direccion_pattern: str, skip: int = 0, limit: int = 100) -> List[Sede]:
        """Buscar sedes por patrón en la dirección"""
        return db.query(Sede).filter(
            Sede.direccion.ilike(f"%{direccion_pattern}%"),
            Sede.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_with_capacity_greater_than(db: Session, capacidad_minima: int, skip: int = 0, limit: int = 100) -> List[Sede]:
        """Obtener sedes con capacidad mayor a la especificada"""
        return db.query(Sede).filter(
            Sede.capacidad_maxima >= capacidad_minima,
            Sede.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[Sede]:
        """Obtener sede por email"""
        return db.query(Sede).filter(
            Sede.email == email,
            Sede.status == True
        ).first()
    
    @staticmethod
    def get_by_telefono(db: Session, telefono: str) -> Optional[Sede]:
        """Obtener sede por teléfono"""
        return db.query(Sede).filter(
            Sede.telefono == telefono,
            Sede.status == True
        ).first()
    
    @staticmethod
    def update(db: Session, id_sede: int, sede_update: SedeSchema) -> Optional[Sede]:
        """Actualizar una sede existente"""
        db_sede = db.query(Sede).filter(
            Sede.id_sede == id_sede,
            Sede.status == True
        ).first()
        
        if not db_sede:
            return None
        
        # Solo actualizar campos que no son None
        if sede_update.codigo_sede is not None:
            db_sede.codigo_sede = sede_update.codigo_sede
        if sede_update.nombre_sede is not None:
            db_sede.nombre_sede = sede_update.nombre_sede
        if sede_update.direccion is not None:
            db_sede.direccion = sede_update.direccion
        if sede_update.ciudad is not None:
            db_sede.ciudad = sede_update.ciudad
        if sede_update.provincia is not None:
            db_sede.provincia = sede_update.provincia
        if sede_update.codigo_postal is not None:
            db_sede.codigo_postal = sede_update.codigo_postal
        if sede_update.telefono is not None:
            db_sede.telefono = sede_update.telefono
        if sede_update.email is not None:
            db_sede.email = sede_update.email
        if sede_update.tipo_sede is not None:
            db_sede.tipo_sede = sede_update.tipo_sede
        if sede_update.capacidad_maxima is not None:
            db_sede.capacidad_maxima = sede_update.capacidad_maxima
        if sede_update.observaciones is not None:
            db_sede.observaciones = sede_update.observaciones
        if sede_update.updated_by is not None:
            db_sede.updated_by = sede_update.updated_by
        
        db.commit()
        db.refresh(db_sede)
        return db_sede
    
    @staticmethod
    def soft_delete(db: Session, id_sede: int, deleted_by: str) -> bool:
        """Eliminación lógica de una sede"""
        db_sede = db.query(Sede).filter(
            Sede.id_sede == id_sede,
            Sede.status == True
        ).first()
        
        if db_sede:
            db_sede.status = False
            db_sede.deleted_by = deleted_by
            db.commit()
            return True
        return False
    
    @staticmethod
    def restore(db: Session, id_sede: int, updated_by: str) -> bool:
        """Restaurar una sede eliminada lógicamente"""
        db_sede = db.query(Sede).filter(
            Sede.id_sede == id_sede,
            Sede.status == False
        ).first()
        
        if db_sede:
            db_sede.status = True
            db_sede.deleted_by = None
            db_sede.updated_by = updated_by
            db.commit()
            return True
        return False
    
    @staticmethod
    def exists_by_codigo(db: Session, codigo_sede: str) -> bool:
        """Verificar si existe una sede con ese código"""
        return db.query(Sede).filter(Sede.codigo_sede == codigo_sede).first() is not None
    
    @staticmethod
    def exists_by_email(db: Session, email: str) -> bool:
        """Verificar si existe una sede con ese email"""
        return db.query(Sede).filter(Sede.email == email).first() is not None
    
    @staticmethod
    def exists_by_telefono(db: Session, telefono: str) -> bool:
        """Verificar si existe una sede con ese teléfono"""
        return db.query(Sede).filter(Sede.telefono == telefono).first() is not None
    
    @staticmethod
    def get_all_tipos(db: Session) -> List[str]:
        """Obtener todos los tipos únicos de sedes"""
        tipos = db.query(Sede.tipo_sede).filter(
            Sede.status == True
        ).distinct().all()
        return [tipo[0] for tipo in tipos if tipo[0]]
    
    @staticmethod
    def get_all_ciudades(db: Session) -> List[str]:
        """Obtener todas las ciudades únicas donde hay sedes"""
        ciudades = db.query(Sede.ciudad).filter(
            Sede.status == True
        ).distinct().all()
        return [ciudad[0] for ciudad in ciudades if ciudad[0]]
    
    @staticmethod
    def get_all_provincias(db: Session) -> List[str]:
        """Obtener todas las provincias únicas donde hay sedes"""
        provincias = db.query(Sede.provincia).filter(
            Sede.status == True
        ).distinct().all()
        return [provincia[0] for provincia in provincias if provincia[0]]