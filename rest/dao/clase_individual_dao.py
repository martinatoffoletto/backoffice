from sqlalchemy.orm import Session
from models.clase_individual_model import ClaseIndividual
from models.usuario_model import Usuario
from models.espacio_model import Espacio
from models.sede_model import Sede
from schemas.clase_individual_schema import ClaseIndividual as ClaseIndividualSchema
from typing import List, Optional
from decimal import Decimal
from datetime import datetime, date, time

class ClaseIndividualDAO:
    
    @staticmethod
    def create(db: Session, clase: ClaseIndividualSchema) -> ClaseIndividual:
        """Crear una nueva clase individual"""
        db_clase = ClaseIndividual(
            id_profesor=clase.id_profesor,
            id_estudiante=clase.id_estudiante,
            id_espacio=clase.id_espacio,
            fecha=clase.fecha,
            hora_inicio=clase.hora_inicio,
            hora_fin=clase.hora_fin,
            materia=clase.materia,
            tema=clase.tema,
            descripcion=clase.descripcion,
            precio_hora=clase.precio_hora,
            horas_clase=clase.horas_clase,
            total_cobrar=clase.total_cobrar,
            estado=clase.estado,
            observaciones=clase.observaciones,
            created_by=clase.created_by
        )
        db.add(db_clase)
        db.commit()
        db.refresh(db_clase)
        return db_clase
    
    @staticmethod
    def get_by_id(db: Session, id_clase: int) -> Optional[ClaseIndividual]:
        """Obtener clase individual por ID"""
        return db.query(ClaseIndividual).filter(
            ClaseIndividual.id_clase == id_clase,
            ClaseIndividual.status == True
        ).first()
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[ClaseIndividual]:
        """Obtener todas las clases individuales activas"""
        return db.query(ClaseIndividual).filter(
            ClaseIndividual.status == True
        ).order_by(ClaseIndividual.fecha.desc(), ClaseIndividual.hora_inicio.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_profesor(db: Session, id_profesor: int, skip: int = 0, limit: int = 100) -> List[ClaseIndividual]:
        """Obtener clases individuales por profesor"""
        return db.query(ClaseIndividual).filter(
            ClaseIndividual.id_profesor == id_profesor,
            ClaseIndividual.status == True
        ).order_by(ClaseIndividual.fecha.desc(), ClaseIndividual.hora_inicio.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_estudiante(db: Session, id_estudiante: int, skip: int = 0, limit: int = 100) -> List[ClaseIndividual]:
        """Obtener clases individuales por estudiante"""
        return db.query(ClaseIndividual).filter(
            ClaseIndividual.id_estudiante == id_estudiante,
            ClaseIndividual.status == True
        ).order_by(ClaseIndividual.fecha.desc(), ClaseIndividual.hora_inicio.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_espacio(db: Session, id_espacio: int, skip: int = 0, limit: int = 100) -> List[ClaseIndividual]:
        """Obtener clases individuales por espacio"""
        return db.query(ClaseIndividual).filter(
            ClaseIndividual.id_espacio == id_espacio,
            ClaseIndividual.status == True
        ).order_by(ClaseIndividual.fecha.desc(), ClaseIndividual.hora_inicio.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_fecha(db: Session, fecha: date, skip: int = 0, limit: int = 100) -> List[ClaseIndividual]:
        """Obtener clases individuales por fecha específica"""
        return db.query(ClaseIndividual).filter(
            ClaseIndividual.fecha == fecha,
            ClaseIndividual.status == True
        ).order_by(ClaseIndividual.hora_inicio).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_fecha_range(db: Session, fecha_inicio: date, fecha_fin: date, skip: int = 0, limit: int = 100) -> List[ClaseIndividual]:
        """Obtener clases individuales por rango de fechas"""
        return db.query(ClaseIndividual).filter(
            ClaseIndividual.fecha >= fecha_inicio,
            ClaseIndividual.fecha <= fecha_fin,
            ClaseIndividual.status == True
        ).order_by(ClaseIndividual.fecha, ClaseIndividual.hora_inicio).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_materia(db: Session, materia: str, skip: int = 0, limit: int = 100) -> List[ClaseIndividual]:
        """Obtener clases individuales por materia"""
        return db.query(ClaseIndividual).filter(
            ClaseIndividual.materia.ilike(f"%{materia}%"),
            ClaseIndividual.status == True
        ).order_by(ClaseIndividual.fecha.desc(), ClaseIndividual.hora_inicio.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_estado(db: Session, estado: str, skip: int = 0, limit: int = 100) -> List[ClaseIndividual]:
        """Obtener clases individuales por estado"""
        return db.query(ClaseIndividual).filter(
            ClaseIndividual.estado == estado,
            ClaseIndividual.status == True
        ).order_by(ClaseIndividual.fecha.desc(), ClaseIndividual.hora_inicio.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_proximas(db: Session, fecha_desde: date = None, skip: int = 0, limit: int = 100) -> List[ClaseIndividual]:
        """Obtener clases individuales próximas (desde hoy o fecha específica)"""
        if fecha_desde is None:
            fecha_desde = date.today()
        
        return db.query(ClaseIndividual).filter(
            ClaseIndividual.fecha >= fecha_desde,
            ClaseIndividual.status == True
        ).order_by(ClaseIndividual.fecha, ClaseIndividual.hora_inicio).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_conflictos_espacio(db: Session, id_espacio: int, fecha: date, hora_inicio: time, hora_fin: time, excluir_id: int = None) -> List[ClaseIndividual]:
        """Verificar conflictos de horario en un espacio"""
        query = db.query(ClaseIndividual).filter(
            ClaseIndividual.id_espacio == id_espacio,
            ClaseIndividual.fecha == fecha,
            ClaseIndividual.status == True,
            # Verificar solapamiento de horarios
            ClaseIndividual.hora_inicio < hora_fin,
            ClaseIndividual.hora_fin > hora_inicio
        )
        
        if excluir_id:
            query = query.filter(ClaseIndividual.id_clase != excluir_id)
        
        return query.all()
    
    @staticmethod
    def get_conflictos_profesor(db: Session, id_profesor: int, fecha: date, hora_inicio: time, hora_fin: time, excluir_id: int = None) -> List[ClaseIndividual]:
        """Verificar conflictos de horario para un profesor"""
        query = db.query(ClaseIndividual).filter(
            ClaseIndividual.id_profesor == id_profesor,
            ClaseIndividual.fecha == fecha,
            ClaseIndividual.status == True,
            # Verificar solapamiento de horarios
            ClaseIndividual.hora_inicio < hora_fin,
            ClaseIndividual.hora_fin > hora_inicio
        )
        
        if excluir_id:
            query = query.filter(ClaseIndividual.id_clase != excluir_id)
        
        return query.all()
    
    @staticmethod
    def get_conflictos_estudiante(db: Session, id_estudiante: int, fecha: date, hora_inicio: time, hora_fin: time, excluir_id: int = None) -> List[ClaseIndividual]:
        """Verificar conflictos de horario para un estudiante"""
        query = db.query(ClaseIndividual).filter(
            ClaseIndividual.id_estudiante == id_estudiante,
            ClaseIndividual.fecha == fecha,
            ClaseIndividual.status == True,
            # Verificar solapamiento de horarios
            ClaseIndividual.hora_inicio < hora_fin,
            ClaseIndividual.hora_fin > hora_inicio
        )
        
        if excluir_id:
            query = query.filter(ClaseIndividual.id_clase != excluir_id)
        
        return query.all()
    
    @staticmethod
    def get_with_details(db: Session, id_clase: int) -> Optional[dict]:
        """Obtener clase individual con información detallada"""
        result = db.query(
            ClaseIndividual,
            Usuario.alias('profesor'),
            Usuario.alias('estudiante'),
            Espacio,
            Sede
        ).join(
            Usuario.alias('profesor'), ClaseIndividual.id_profesor == Usuario.alias('profesor').c.id_usuario
        ).join(
            Usuario.alias('estudiante'), ClaseIndividual.id_estudiante == Usuario.alias('estudiante').c.id_usuario
        ).join(Espacio).join(Sede, Espacio.id_sede == Sede.id_sede).filter(
            ClaseIndividual.id_clase == id_clase,
            ClaseIndividual.status == True
        ).first()
        
        if not result:
            return None
        
        clase, profesor, estudiante, espacio, sede = result
        return {
            "clase": clase,
            "profesor": {
                "legajo": profesor.legajo,
                "nombre": profesor.nombre,
                "apellido": profesor.apellido,
                "email": profesor.email
            },
            "estudiante": {
                "legajo": estudiante.legajo,
                "nombre": estudiante.nombre,
                "apellido": estudiante.apellido,
                "email": estudiante.email
            },
            "espacio": {
                "nombre_espacio": espacio.nombre_espacio,
                "tipo_espacio": espacio.tipo_espacio,
                "capacidad": espacio.capacidad
            },
            "sede": {
                "nombre_sede": sede.nombre_sede,
                "ciudad": sede.ciudad,
                "direccion": sede.direccion
            }
        }
    
    @staticmethod
    def calculate_total_ingresos_by_profesor(db: Session, id_profesor: int, fecha_inicio: date = None, fecha_fin: date = None) -> Decimal:
        """Calcular total de ingresos por profesor en un período"""
        query = db.query(db.func.sum(ClaseIndividual.total_cobrar)).filter(
            ClaseIndividual.id_profesor == id_profesor,
            ClaseIndividual.status == True
        )
        
        if fecha_inicio:
            query = query.filter(ClaseIndividual.fecha >= fecha_inicio)
        if fecha_fin:
            query = query.filter(ClaseIndividual.fecha <= fecha_fin)
        
        result = query.scalar()
        return result or Decimal('0')
    
    @staticmethod
    def calculate_total_ingresos_by_periodo(db: Session, fecha_inicio: date, fecha_fin: date) -> Decimal:
        """Calcular total de ingresos por período"""
        result = db.query(db.func.sum(ClaseIndividual.total_cobrar)).filter(
            ClaseIndividual.fecha >= fecha_inicio,
            ClaseIndividual.fecha <= fecha_fin,
            ClaseIndividual.status == True
        ).scalar()
        return result or Decimal('0')
    
    @staticmethod
    def update(db: Session, id_clase: int, clase_update: ClaseIndividualSchema) -> Optional[ClaseIndividual]:
        """Actualizar una clase individual existente"""
        db_clase = db.query(ClaseIndividual).filter(
            ClaseIndividual.id_clase == id_clase,
            ClaseIndividual.status == True
        ).first()
        
        if not db_clase:
            return None
        
        # Solo actualizar campos que no son None
        if clase_update.id_profesor is not None:
            db_clase.id_profesor = clase_update.id_profesor
        if clase_update.id_estudiante is not None:
            db_clase.id_estudiante = clase_update.id_estudiante
        if clase_update.id_espacio is not None:
            db_clase.id_espacio = clase_update.id_espacio
        if clase_update.fecha is not None:
            db_clase.fecha = clase_update.fecha
        if clase_update.hora_inicio is not None:
            db_clase.hora_inicio = clase_update.hora_inicio
        if clase_update.hora_fin is not None:
            db_clase.hora_fin = clase_update.hora_fin
        if clase_update.materia is not None:
            db_clase.materia = clase_update.materia
        if clase_update.tema is not None:
            db_clase.tema = clase_update.tema
        if clase_update.descripcion is not None:
            db_clase.descripcion = clase_update.descripcion
        if clase_update.precio_hora is not None:
            db_clase.precio_hora = clase_update.precio_hora
        if clase_update.horas_clase is not None:
            db_clase.horas_clase = clase_update.horas_clase
        if clase_update.total_cobrar is not None:
            db_clase.total_cobrar = clase_update.total_cobrar
        if clase_update.estado is not None:
            db_clase.estado = clase_update.estado
        if clase_update.observaciones is not None:
            db_clase.observaciones = clase_update.observaciones
        if clase_update.updated_by is not None:
            db_clase.updated_by = clase_update.updated_by
        
        db.commit()
        db.refresh(db_clase)
        return db_clase
    
    @staticmethod
    def cambiar_estado(db: Session, id_clase: int, nuevo_estado: str, updated_by: str) -> Optional[ClaseIndividual]:
        """Cambiar el estado de una clase individual"""
        db_clase = db.query(ClaseIndividual).filter(
            ClaseIndividual.id_clase == id_clase,
            ClaseIndividual.status == True
        ).first()
        
        if not db_clase:
            return None
        
        db_clase.estado = nuevo_estado
        db_clase.updated_by = updated_by
        
        db.commit()
        db.refresh(db_clase)
        return db_clase
    
    @staticmethod
    def soft_delete(db: Session, id_clase: int, deleted_by: str) -> bool:
        """Eliminación lógica de una clase individual"""
        db_clase = db.query(ClaseIndividual).filter(
            ClaseIndividual.id_clase == id_clase,
            ClaseIndividual.status == True
        ).first()
        
        if db_clase:
            db_clase.status = False
            db_clase.deleted_by = deleted_by
            db.commit()
            return True
        return False
    
    @staticmethod
    def restore(db: Session, id_clase: int, updated_by: str) -> bool:
        """Restaurar una clase individual eliminada lógicamente"""
        db_clase = db.query(ClaseIndividual).filter(
            ClaseIndividual.id_clase == id_clase,
            ClaseIndividual.status == False
        ).first()
        
        if db_clase:
            db_clase.status = True
            db_clase.deleted_by = None
            db_clase.updated_by = updated_by
            db.commit()
            return True
        return False
    
    @staticmethod
    def has_conflicts(db: Session, id_espacio: int, fecha: date, hora_inicio: time, hora_fin: time, excluir_id: int = None) -> bool:
        """Verificar si hay conflictos de horario"""
        conflictos = ClaseIndividualDAO.get_conflictos_espacio(db, id_espacio, fecha, hora_inicio, hora_fin, excluir_id)
        return len(conflictos) > 0
    
    @staticmethod
    def get_estadisticas_por_periodo(db: Session, fecha_inicio: date, fecha_fin: date) -> dict:
        """Obtener estadísticas de clases individuales por período"""
        clases = db.query(ClaseIndividual).filter(
            ClaseIndividual.fecha >= fecha_inicio,
            ClaseIndividual.fecha <= fecha_fin,
            ClaseIndividual.status == True
        ).all()
        
        if not clases:
            return {}
        
        total_ingresos = sum(c.total_cobrar for c in clases)
        total_horas = sum(c.horas_clase for c in clases)
        
        estados = {}
        materias = {}
        for clase in clases:
            # Contar por estado
            if clase.estado in estados:
                estados[clase.estado] += 1
            else:
                estados[clase.estado] = 1
            
            # Contar por materia
            if clase.materia in materias:
                materias[clase.materia] += 1
            else:
                materias[clase.materia] = 1
        
        return {
            "periodo": f"{fecha_inicio} - {fecha_fin}",
            "total_clases": len(clases),
            "total_ingresos": total_ingresos,
            "total_horas": total_horas,
            "promedio_por_clase": total_ingresos / len(clases) if clases else Decimal('0'),
            "por_estado": estados,
            "por_materia": materias
        }