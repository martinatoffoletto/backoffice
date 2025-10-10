from sqlalchemy.orm import Session
from models.cronograma_model import Cronograma
from models.usuario_model import Usuario
from models.espacio_model import Espacio
from models.sede_model import Sede
from schemas.cronograma_schema import Cronograma as CronogramaSchema
from typing import List, Optional
from datetime import datetime, date, time

class CronogramaDAO:
    
    @staticmethod
    def create(db: Session, cronograma: CronogramaSchema) -> Cronograma:
        """Crear un nuevo cronograma"""
        db_cronograma = Cronograma(
            id_usuario=cronograma.id_usuario,
            id_espacio=cronograma.id_espacio,
            fecha=cronograma.fecha,
            hora_inicio=cronograma.hora_inicio,
            hora_fin=cronograma.hora_fin,
            tipo_clase=cronograma.tipo_clase,
            materia=cronograma.materia,
            descripcion=cronograma.descripcion,
            estado=cronograma.estado,
            observaciones=cronograma.observaciones,
            created_by=cronograma.created_by
        )
        db.add(db_cronograma)
        db.commit()
        db.refresh(db_cronograma)
        return db_cronograma
    
    @staticmethod
    def get_by_id(db: Session, id_cronograma: int) -> Optional[Cronograma]:
        """Obtener cronograma por ID"""
        return db.query(Cronograma).filter(
            Cronograma.id_cronograma == id_cronograma,
            Cronograma.status == True
        ).first()
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[Cronograma]:
        """Obtener todos los cronogramas activos"""
        return db.query(Cronograma).filter(
            Cronograma.status == True
        ).order_by(Cronograma.fecha.desc(), Cronograma.hora_inicio.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_usuario(db: Session, id_usuario: int, skip: int = 0, limit: int = 100) -> List[Cronograma]:
        """Obtener cronogramas por usuario"""
        return db.query(Cronograma).filter(
            Cronograma.id_usuario == id_usuario,
            Cronograma.status == True
        ).order_by(Cronograma.fecha.desc(), Cronograma.hora_inicio.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_espacio(db: Session, id_espacio: int, skip: int = 0, limit: int = 100) -> List[Cronograma]:
        """Obtener cronogramas por espacio"""
        return db.query(Cronograma).filter(
            Cronograma.id_espacio == id_espacio,
            Cronograma.status == True
        ).order_by(Cronograma.fecha.desc(), Cronograma.hora_inicio.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_fecha(db: Session, fecha: date, skip: int = 0, limit: int = 100) -> List[Cronograma]:
        """Obtener cronogramas por fecha específica"""
        return db.query(Cronograma).filter(
            Cronograma.fecha == fecha,
            Cronograma.status == True
        ).order_by(Cronograma.hora_inicio).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_fecha_range(db: Session, fecha_inicio: date, fecha_fin: date, skip: int = 0, limit: int = 100) -> List[Cronograma]:
        """Obtener cronogramas por rango de fechas"""
        return db.query(Cronograma).filter(
            Cronograma.fecha >= fecha_inicio,
            Cronograma.fecha <= fecha_fin,
            Cronograma.status == True
        ).order_by(Cronograma.fecha, Cronograma.hora_inicio).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_tipo_clase(db: Session, tipo_clase: str, skip: int = 0, limit: int = 100) -> List[Cronograma]:
        """Obtener cronogramas por tipo de clase"""
        return db.query(Cronograma).filter(
            Cronograma.tipo_clase == tipo_clase,
            Cronograma.status == True
        ).order_by(Cronograma.fecha.desc(), Cronograma.hora_inicio.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_materia(db: Session, materia: str, skip: int = 0, limit: int = 100) -> List[Cronograma]:
        """Obtener cronogramas por materia"""
        return db.query(Cronograma).filter(
            Cronograma.materia.ilike(f"%{materia}%"),
            Cronograma.status == True
        ).order_by(Cronograma.fecha.desc(), Cronograma.hora_inicio.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_estado(db: Session, estado: str, skip: int = 0, limit: int = 100) -> List[Cronograma]:
        """Obtener cronogramas por estado"""
        return db.query(Cronograma).filter(
            Cronograma.estado == estado,
            Cronograma.status == True
        ).order_by(Cronograma.fecha.desc(), Cronograma.hora_inicio.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_proximos(db: Session, fecha_desde: date = None, skip: int = 0, limit: int = 100) -> List[Cronograma]:
        """Obtener cronogramas próximos (desde hoy o fecha específica)"""
        if fecha_desde is None:
            fecha_desde = date.today()
        
        return db.query(Cronograma).filter(
            Cronograma.fecha >= fecha_desde,
            Cronograma.status == True
        ).order_by(Cronograma.fecha, Cronograma.hora_inicio).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_conflictos_espacio(db: Session, id_espacio: int, fecha: date, hora_inicio: time, hora_fin: time, excluir_id: int = None) -> List[Cronograma]:
        """Verificar conflictos de horario en un espacio"""
        query = db.query(Cronograma).filter(
            Cronograma.id_espacio == id_espacio,
            Cronograma.fecha == fecha,
            Cronograma.status == True,
            # Verificar solapamiento de horarios
            Cronograma.hora_inicio < hora_fin,
            Cronograma.hora_fin > hora_inicio
        )
        
        if excluir_id:
            query = query.filter(Cronograma.id_cronograma != excluir_id)
        
        return query.all()
    
    @staticmethod
    def get_conflictos_usuario(db: Session, id_usuario: int, fecha: date, hora_inicio: time, hora_fin: time, excluir_id: int = None) -> List[Cronograma]:
        """Verificar conflictos de horario para un usuario"""
        query = db.query(Cronograma).filter(
            Cronograma.id_usuario == id_usuario,
            Cronograma.fecha == fecha,
            Cronograma.status == True,
            # Verificar solapamiento de horarios
            Cronograma.hora_inicio < hora_fin,
            Cronograma.hora_fin > hora_inicio
        )
        
        if excluir_id:
            query = query.filter(Cronograma.id_cronograma != excluir_id)
        
        return query.all()
    
    @staticmethod
    def get_with_details(db: Session, id_cronograma: int) -> Optional[dict]:
        """Obtener cronograma con información detallada de usuario, espacio y sede"""
        result = db.query(Cronograma, Usuario, Espacio, Sede).join(Usuario).join(Espacio).join(Sede, Espacio.id_sede == Sede.id_sede).filter(
            Cronograma.id_cronograma == id_cronograma,
            Cronograma.status == True,
            Usuario.status == True,
            Espacio.status == True,
            Sede.status == True
        ).first()
        
        if not result:
            return None
        
        cronograma, usuario, espacio, sede = result
        return {
            "cronograma": cronograma,
            "usuario": {
                "legajo": usuario.legajo,
                "nombre": usuario.nombre,
                "apellido": usuario.apellido,
                "email": usuario.email
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
    def update(db: Session, id_cronograma: int, cronograma_update: CronogramaSchema) -> Optional[Cronograma]:
        """Actualizar un cronograma existente"""
        db_cronograma = db.query(Cronograma).filter(
            Cronograma.id_cronograma == id_cronograma,
            Cronograma.status == True
        ).first()
        
        if not db_cronograma:
            return None
        
        # Solo actualizar campos que no son None
        if cronograma_update.id_usuario is not None:
            db_cronograma.id_usuario = cronograma_update.id_usuario
        if cronograma_update.id_espacio is not None:
            db_cronograma.id_espacio = cronograma_update.id_espacio
        if cronograma_update.fecha is not None:
            db_cronograma.fecha = cronograma_update.fecha
        if cronograma_update.hora_inicio is not None:
            db_cronograma.hora_inicio = cronograma_update.hora_inicio
        if cronograma_update.hora_fin is not None:
            db_cronograma.hora_fin = cronograma_update.hora_fin
        if cronograma_update.tipo_clase is not None:
            db_cronograma.tipo_clase = cronograma_update.tipo_clase
        if cronograma_update.materia is not None:
            db_cronograma.materia = cronograma_update.materia
        if cronograma_update.descripcion is not None:
            db_cronograma.descripcion = cronograma_update.descripcion
        if cronograma_update.estado is not None:
            db_cronograma.estado = cronograma_update.estado
        if cronograma_update.observaciones is not None:
            db_cronograma.observaciones = cronograma_update.observaciones
        if cronograma_update.updated_by is not None:
            db_cronograma.updated_by = cronograma_update.updated_by
        
        db.commit()
        db.refresh(db_cronograma)
        return db_cronograma
    
    @staticmethod
    def cambiar_estado(db: Session, id_cronograma: int, nuevo_estado: str, updated_by: str) -> Optional[Cronograma]:
        """Cambiar el estado de un cronograma"""
        db_cronograma = db.query(Cronograma).filter(
            Cronograma.id_cronograma == id_cronograma,
            Cronograma.status == True
        ).first()
        
        if not db_cronograma:
            return None
        
        db_cronograma.estado = nuevo_estado
        db_cronograma.updated_by = updated_by
        
        db.commit()
        db.refresh(db_cronograma)
        return db_cronograma
    
    @staticmethod
    def soft_delete(db: Session, id_cronograma: int, deleted_by: str) -> bool:
        """Eliminación lógica de un cronograma"""
        db_cronograma = db.query(Cronograma).filter(
            Cronograma.id_cronograma == id_cronograma,
            Cronograma.status == True
        ).first()
        
        if db_cronograma:
            db_cronograma.status = False
            db_cronograma.deleted_by = deleted_by
            db.commit()
            return True
        return False
    
    @staticmethod
    def restore(db: Session, id_cronograma: int, updated_by: str) -> bool:
        """Restaurar un cronograma eliminado lógicamente"""
        db_cronograma = db.query(Cronograma).filter(
            Cronograma.id_cronograma == id_cronograma,
            Cronograma.status == False
        ).first()
        
        if db_cronograma:
            db_cronograma.status = True
            db_cronograma.deleted_by = None
            db_cronograma.updated_by = updated_by
            db.commit()
            return True
        return False
    
    @staticmethod
    def has_conflicts(db: Session, id_espacio: int, fecha: date, hora_inicio: time, hora_fin: time, excluir_id: int = None) -> bool:
        """Verificar si hay conflictos de horario"""
        conflictos = CronogramaDAO.get_conflictos_espacio(db, id_espacio, fecha, hora_inicio, hora_fin, excluir_id)
        return len(conflictos) > 0
    
    @staticmethod
    def get_estadisticas_por_periodo(db: Session, fecha_inicio: date, fecha_fin: date) -> dict:
        """Obtener estadísticas de cronogramas por período"""
        cronogramas = db.query(Cronograma).filter(
            Cronograma.fecha >= fecha_inicio,
            Cronograma.fecha <= fecha_fin,
            Cronograma.status == True
        ).all()
        
        if not cronogramas:
            return {}
        
        estados = {}
        tipos_clase = {}
        for cronograma in cronogramas:
            # Contar por estado
            if cronograma.estado in estados:
                estados[cronograma.estado] += 1
            else:
                estados[cronograma.estado] = 1
            
            # Contar por tipo de clase
            if cronograma.tipo_clase in tipos_clase:
                tipos_clase[cronograma.tipo_clase] += 1
            else:
                tipos_clase[cronograma.tipo_clase] = 1
        
        return {
            "periodo": f"{fecha_inicio} - {fecha_fin}",
            "total_cronogramas": len(cronogramas),
            "por_estado": estados,
            "por_tipo_clase": tipos_clase
        }