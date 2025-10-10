from sqlalchemy.orm import Session
from ..models.sueldo_model import Sueldo
from ..models.usuario_model import Usuario
from ..schemas.sueldo_schema import Sueldo as SueldoSchema
from typing import List, Optional
from decimal import Decimal
from datetime import datetime, date

class SueldoDAO:
    
    @staticmethod
    def create(db: Session, sueldo: SueldoSchema) -> Sueldo:
        """Crear un nuevo registro de sueldo"""
        db_sueldo = Sueldo(
            id_usuario=sueldo.id_usuario,
            periodo_mes=sueldo.periodo_mes,
            periodo_anio=sueldo.periodo_anio,
            sueldo_basico=sueldo.sueldo_basico,
            descuentos=sueldo.descuentos,
            bonificaciones=sueldo.bonificaciones,
            sueldo_neto=sueldo.sueldo_neto,
            fecha_pago=sueldo.fecha_pago,
            observaciones=sueldo.observaciones,
            created_by=sueldo.created_by
        )
        db.add(db_sueldo)
        db.commit()
        db.refresh(db_sueldo)
        return db_sueldo
    
    @staticmethod
    def get_by_id(db: Session, id_sueldo: int) -> Optional[Sueldo]:
        """Obtener sueldo por ID"""
        return db.query(Sueldo).filter(
            Sueldo.id_sueldo == id_sueldo,
            Sueldo.status == True
        ).first()
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[Sueldo]:
        """Obtener todos los sueldos activos"""
        return db.query(Sueldo).filter(
            Sueldo.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_usuario(db: Session, id_usuario: int, skip: int = 0, limit: int = 100) -> List[Sueldo]:
        """Obtener sueldos por usuario"""
        return db.query(Sueldo).filter(
            Sueldo.id_usuario == id_usuario,
            Sueldo.status == True
        ).order_by(Sueldo.periodo_anio.desc(), Sueldo.periodo_mes.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_periodo(db: Session, mes: int, anio: int, skip: int = 0, limit: int = 100) -> List[Sueldo]:
        """Obtener sueldos por período (mes/año)"""
        return db.query(Sueldo).filter(
            Sueldo.periodo_mes == mes,
            Sueldo.periodo_anio == anio,
            Sueldo.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_usuario_and_periodo(db: Session, id_usuario: int, mes: int, anio: int) -> Optional[Sueldo]:
        """Obtener sueldo específico por usuario y período"""
        return db.query(Sueldo).filter(
            Sueldo.id_usuario == id_usuario,
            Sueldo.periodo_mes == mes,
            Sueldo.periodo_anio == anio,
            Sueldo.status == True
        ).first()
    
    @staticmethod
    def get_by_anio(db: Session, anio: int, skip: int = 0, limit: int = 100) -> List[Sueldo]:
        """Obtener sueldos por año"""
        return db.query(Sueldo).filter(
            Sueldo.periodo_anio == anio,
            Sueldo.status == True
        ).order_by(Sueldo.periodo_mes.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_fecha_pago_range(db: Session, fecha_inicio: date, fecha_fin: date, skip: int = 0, limit: int = 100) -> List[Sueldo]:
        """Obtener sueldos por rango de fechas de pago"""
        return db.query(Sueldo).filter(
            Sueldo.fecha_pago >= fecha_inicio,
            Sueldo.fecha_pago <= fecha_fin,
            Sueldo.status == True
        ).order_by(Sueldo.fecha_pago.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_pendientes_pago(db: Session, skip: int = 0, limit: int = 100) -> List[Sueldo]:
        """Obtener sueldos pendientes de pago (fecha_pago es None)"""
        return db.query(Sueldo).filter(
            Sueldo.fecha_pago.is_(None),
            Sueldo.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_with_usuario_info(db: Session, id_sueldo: int) -> Optional[dict]:
        """Obtener sueldo con información del usuario"""
        result = db.query(Sueldo, Usuario).join(Usuario).filter(
            Sueldo.id_sueldo == id_sueldo,
            Sueldo.status == True,
            Usuario.status == True
        ).first()
        
        if not result:
            return None
        
        sueldo, usuario = result
        return {
            "sueldo": sueldo,
            "usuario": {
                "legajo": usuario.legajo,
                "nombre": usuario.nombre,
                "apellido": usuario.apellido,
                "dni": usuario.dni,
                "email": usuario.email
            }
        }
    
    @staticmethod
    def get_sueldos_by_sueldo_range(db: Session, sueldo_min: Decimal, sueldo_max: Decimal, skip: int = 0, limit: int = 100) -> List[Sueldo]:
        """Obtener sueldos por rango de sueldo neto"""
        return db.query(Sueldo).filter(
            Sueldo.sueldo_neto >= sueldo_min,
            Sueldo.sueldo_neto <= sueldo_max,
            Sueldo.status == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def calculate_total_by_periodo(db: Session, mes: int, anio: int) -> Optional[Decimal]:
        """Calcular total de sueldos netos por período"""
        result = db.query(db.func.sum(Sueldo.sueldo_neto)).filter(
            Sueldo.periodo_mes == mes,
            Sueldo.periodo_anio == anio,
            Sueldo.status == True
        ).scalar()
        return result or Decimal('0')
    
    @staticmethod
    def calculate_total_by_usuario_anio(db: Session, id_usuario: int, anio: int) -> Optional[Decimal]:
        """Calcular total de sueldos de un usuario por año"""
        result = db.query(db.func.sum(Sueldo.sueldo_neto)).filter(
            Sueldo.id_usuario == id_usuario,
            Sueldo.periodo_anio == anio,
            Sueldo.status == True
        ).scalar()
        return result or Decimal('0')
    
    @staticmethod
    def update(db: Session, id_sueldo: int, sueldo_update: SueldoSchema) -> Optional[Sueldo]:
        """Actualizar un sueldo existente"""
        db_sueldo = db.query(Sueldo).filter(
            Sueldo.id_sueldo == id_sueldo,
            Sueldo.status == True
        ).first()
        
        if not db_sueldo:
            return None
        
        # Solo actualizar campos que no son None
        if sueldo_update.id_usuario is not None:
            db_sueldo.id_usuario = sueldo_update.id_usuario
        if sueldo_update.periodo_mes is not None:
            db_sueldo.periodo_mes = sueldo_update.periodo_mes
        if sueldo_update.periodo_anio is not None:
            db_sueldo.periodo_anio = sueldo_update.periodo_anio
        if sueldo_update.sueldo_basico is not None:
            db_sueldo.sueldo_basico = sueldo_update.sueldo_basico
        if sueldo_update.descuentos is not None:
            db_sueldo.descuentos = sueldo_update.descuentos
        if sueldo_update.bonificaciones is not None:
            db_sueldo.bonificaciones = sueldo_update.bonificaciones
        if sueldo_update.sueldo_neto is not None:
            db_sueldo.sueldo_neto = sueldo_update.sueldo_neto
        if sueldo_update.fecha_pago is not None:
            db_sueldo.fecha_pago = sueldo_update.fecha_pago
        if sueldo_update.observaciones is not None:
            db_sueldo.observaciones = sueldo_update.observaciones
        if sueldo_update.updated_by is not None:
            db_sueldo.updated_by = sueldo_update.updated_by
        
        db.commit()
        db.refresh(db_sueldo)
        return db_sueldo
    
    @staticmethod
    def marcar_como_pagado(db: Session, id_sueldo: int, fecha_pago: date, updated_by: str) -> Optional[Sueldo]:
        """Marcar un sueldo como pagado con fecha"""
        db_sueldo = db.query(Sueldo).filter(
            Sueldo.id_sueldo == id_sueldo,
            Sueldo.status == True
        ).first()
        
        if not db_sueldo:
            return None
        
        db_sueldo.fecha_pago = fecha_pago
        db_sueldo.updated_by = updated_by
        
        db.commit()
        db.refresh(db_sueldo)
        return db_sueldo
    
    @staticmethod
    def soft_delete(db: Session, id_sueldo: int, deleted_by: str) -> bool:
        """Eliminación lógica de un sueldo"""
        db_sueldo = db.query(Sueldo).filter(
            Sueldo.id_sueldo == id_sueldo,
            Sueldo.status == True
        ).first()
        
        if db_sueldo:
            db_sueldo.status = False
            db_sueldo.deleted_by = deleted_by
            db.commit()
            return True
        return False
    
    @staticmethod
    def restore(db: Session, id_sueldo: int, updated_by: str) -> bool:
        """Restaurar un sueldo eliminado lógicamente"""
        db_sueldo = db.query(Sueldo).filter(
            Sueldo.id_sueldo == id_sueldo,
            Sueldo.status == False
        ).first()
        
        if db_sueldo:
            db_sueldo.status = True
            db_sueldo.deleted_by = None
            db_sueldo.updated_by = updated_by
            db.commit()
            return True
        return False
    
    @staticmethod
    def exists_by_usuario_and_periodo(db: Session, id_usuario: int, mes: int, anio: int) -> bool:
        """Verificar si existe un sueldo para ese usuario y período"""
        return db.query(Sueldo).filter(
            Sueldo.id_usuario == id_usuario,
            Sueldo.periodo_mes == mes,
            Sueldo.periodo_anio == anio
        ).first() is not None
    
    @staticmethod
    def get_estadisticas_por_anio(db: Session, anio: int) -> dict:
        """Obtener estadísticas de sueldos por año"""
        sueldos = db.query(Sueldo).filter(
            Sueldo.periodo_anio == anio,
            Sueldo.status == True
        ).all()
        
        if not sueldos:
            return {}
        
        total_pagado = sum(s.sueldo_neto for s in sueldos)
        total_basico = sum(s.sueldo_basico for s in sueldos)
        total_descuentos = sum(s.descuentos for s in sueldos)
        total_bonificaciones = sum(s.bonificaciones for s in sueldos)
        
        return {
            "anio": anio,
            "total_registros": len(sueldos),
            "total_pagado": total_pagado,
            "total_basico": total_basico,
            "total_descuentos": total_descuentos,
            "total_bonificaciones": total_bonificaciones,
            "promedio_sueldo": total_pagado / len(sueldos) if sueldos else Decimal('0')
        }