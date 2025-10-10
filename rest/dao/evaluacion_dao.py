from sqlalchemy.orm import Session
from models.evaluacion_model import Evaluacion
from models.usuario_model import Usuario
from schemas.evaluacion_schema import Evaluacion as EvaluacionSchema
from typing import List, Optional
from decimal import Decimal
from datetime import datetime, date

class EvaluacionDAO:
    
    @staticmethod
    def create(db: Session, evaluacion: EvaluacionSchema) -> Evaluacion:
        """Crear una nueva evaluación"""
        db_evaluacion = Evaluacion(
            id_estudiante=evaluacion.id_estudiante,
            id_profesor=evaluacion.id_profesor,
            materia=evaluacion.materia,
            tipo_evaluacion=evaluacion.tipo_evaluacion,
            fecha_evaluacion=evaluacion.fecha_evaluacion,
            nota_numerica=evaluacion.nota_numerica,
            nota_conceptual=evaluacion.nota_conceptual,
            observaciones=evaluacion.observaciones,
            peso_porcentual=evaluacion.peso_porcentual,
            created_by=evaluacion.created_by
        )
        db.add(db_evaluacion)
        db.commit()
        db.refresh(db_evaluacion)
        return db_evaluacion
    
    @staticmethod
    def get_by_id(db: Session, id_evaluacion: int) -> Optional[Evaluacion]:
        """Obtener evaluación por ID"""
        return db.query(Evaluacion).filter(
            Evaluacion.id_evaluacion == id_evaluacion,
            Evaluacion.status == True
        ).first()
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[Evaluacion]:
        """Obtener todas las evaluaciones activas"""
        return db.query(Evaluacion).filter(
            Evaluacion.status == True
        ).order_by(Evaluacion.fecha_evaluacion.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_estudiante(db: Session, id_estudiante: int, skip: int = 0, limit: int = 100) -> List[Evaluacion]:
        """Obtener evaluaciones por estudiante"""
        return db.query(Evaluacion).filter(
            Evaluacion.id_estudiante == id_estudiante,
            Evaluacion.status == True
        ).order_by(Evaluacion.fecha_evaluacion.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_profesor(db: Session, id_profesor: int, skip: int = 0, limit: int = 100) -> List[Evaluacion]:
        """Obtener evaluaciones por profesor"""
        return db.query(Evaluacion).filter(
            Evaluacion.id_profesor == id_profesor,
            Evaluacion.status == True
        ).order_by(Evaluacion.fecha_evaluacion.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_materia(db: Session, materia: str, skip: int = 0, limit: int = 100) -> List[Evaluacion]:
        """Obtener evaluaciones por materia"""
        return db.query(Evaluacion).filter(
            Evaluacion.materia.ilike(f"%{materia}%"),
            Evaluacion.status == True
        ).order_by(Evaluacion.fecha_evaluacion.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_tipo(db: Session, tipo_evaluacion: str, skip: int = 0, limit: int = 100) -> List[Evaluacion]:
        """Obtener evaluaciones por tipo"""
        return db.query(Evaluacion).filter(
            Evaluacion.tipo_evaluacion == tipo_evaluacion,
            Evaluacion.status == True
        ).order_by(Evaluacion.fecha_evaluacion.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_fecha_range(db: Session, fecha_inicio: date, fecha_fin: date, skip: int = 0, limit: int = 100) -> List[Evaluacion]:
        """Obtener evaluaciones por rango de fechas"""
        return db.query(Evaluacion).filter(
            Evaluacion.fecha_evaluacion >= fecha_inicio,
            Evaluacion.fecha_evaluacion <= fecha_fin,
            Evaluacion.status == True
        ).order_by(Evaluacion.fecha_evaluacion.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_estudiante_and_materia(db: Session, id_estudiante: int, materia: str, skip: int = 0, limit: int = 100) -> List[Evaluacion]:
        """Obtener evaluaciones por estudiante y materia"""
        return db.query(Evaluacion).filter(
            Evaluacion.id_estudiante == id_estudiante,
            Evaluacion.materia.ilike(f"%{materia}%"),
            Evaluacion.status == True
        ).order_by(Evaluacion.fecha_evaluacion.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_nota_range(db: Session, nota_min: Decimal, nota_max: Decimal, skip: int = 0, limit: int = 100) -> List[Evaluacion]:
        """Obtener evaluaciones por rango de notas"""
        return db.query(Evaluacion).filter(
            Evaluacion.nota_numerica >= nota_min,
            Evaluacion.nota_numerica <= nota_max,
            Evaluacion.status == True
        ).order_by(Evaluacion.fecha_evaluacion.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_nota_conceptual(db: Session, nota_conceptual: str, skip: int = 0, limit: int = 100) -> List[Evaluacion]:
        """Obtener evaluaciones por nota conceptual"""
        return db.query(Evaluacion).filter(
            Evaluacion.nota_conceptual == nota_conceptual,
            Evaluacion.status == True
        ).order_by(Evaluacion.fecha_evaluacion.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_with_details(db: Session, id_evaluacion: int) -> Optional[dict]:
        """Obtener evaluación con información detallada de estudiante y profesor"""
        result = db.query(
            Evaluacion,
            Usuario.alias('estudiante'),
            Usuario.alias('profesor')
        ).join(
            Usuario.alias('estudiante'), Evaluacion.id_estudiante == Usuario.alias('estudiante').c.id_usuario
        ).join(
            Usuario.alias('profesor'), Evaluacion.id_profesor == Usuario.alias('profesor').c.id_usuario
        ).filter(
            Evaluacion.id_evaluacion == id_evaluacion,
            Evaluacion.status == True
        ).first()
        
        if not result:
            return None
        
        evaluacion, estudiante, profesor = result
        return {
            "evaluacion": evaluacion,
            "estudiante": {
                "legajo": estudiante.legajo,
                "nombre": estudiante.nombre,
                "apellido": estudiante.apellido,
                "email": estudiante.email
            },
            "profesor": {
                "legajo": profesor.legajo,
                "nombre": profesor.nombre,
                "apellido": profesor.apellido,
                "email": profesor.email
            }
        }
    
    @staticmethod
    def calculate_promedio_by_estudiante(db: Session, id_estudiante: int, materia: str = None) -> Optional[Decimal]:
        """Calcular promedio de notas por estudiante (opcionalmente por materia)"""
        query = db.query(db.func.avg(Evaluacion.nota_numerica)).filter(
            Evaluacion.id_estudiante == id_estudiante,
            Evaluacion.status == True,
            Evaluacion.nota_numerica.isnot(None)
        )
        
        if materia:
            query = query.filter(Evaluacion.materia.ilike(f"%{materia}%"))
        
        result = query.scalar()
        return result
    
    @staticmethod
    def calculate_promedio_by_materia(db: Session, materia: str) -> Optional[Decimal]:
        """Calcular promedio general de una materia"""
        result = db.query(db.func.avg(Evaluacion.nota_numerica)).filter(
            Evaluacion.materia.ilike(f"%{materia}%"),
            Evaluacion.status == True,
            Evaluacion.nota_numerica.isnot(None)
        ).scalar()
        return result
    
    @staticmethod
    def calculate_promedio_ponderado_by_estudiante(db: Session, id_estudiante: int, materia: str = None) -> Optional[Decimal]:
        """Calcular promedio ponderado por estudiante (usando peso_porcentual)"""
        query = db.query(
            db.func.sum(Evaluacion.nota_numerica * Evaluacion.peso_porcentual),
            db.func.sum(Evaluacion.peso_porcentual)
        ).filter(
            Evaluacion.id_estudiante == id_estudiante,
            Evaluacion.status == True,
            Evaluacion.nota_numerica.isnot(None),
            Evaluacion.peso_porcentual.isnot(None)
        )
        
        if materia:
            query = query.filter(Evaluacion.materia.ilike(f"%{materia}%"))
        
        result = query.first()
        if result and result[1] and result[1] > 0:
            return result[0] / result[1]
        return None
    
    @staticmethod
    def get_mejores_notas_by_materia(db: Session, materia: str, limit: int = 10) -> List[dict]:
        """Obtener las mejores notas de una materia"""
        results = db.query(
            Evaluacion,
            Usuario.nombre,
            Usuario.apellido,
            Usuario.legajo
        ).join(Usuario, Evaluacion.id_estudiante == Usuario.id_usuario).filter(
            Evaluacion.materia.ilike(f"%{materia}%"),
            Evaluacion.status == True,
            Usuario.status == True,
            Evaluacion.nota_numerica.isnot(None)
        ).order_by(Evaluacion.nota_numerica.desc()).limit(limit).all()
        
        return [
            {
                "evaluacion": evaluacion,
                "estudiante": {
                    "nombre": nombre,
                    "apellido": apellido,
                    "legajo": legajo
                }
            }
            for evaluacion, nombre, apellido, legajo in results
        ]
    
    @staticmethod
    def update(db: Session, id_evaluacion: int, evaluacion_update: EvaluacionSchema) -> Optional[Evaluacion]:
        """Actualizar una evaluación existente"""
        db_evaluacion = db.query(Evaluacion).filter(
            Evaluacion.id_evaluacion == id_evaluacion,
            Evaluacion.status == True
        ).first()
        
        if not db_evaluacion:
            return None
        
        # Solo actualizar campos que no son None
        if evaluacion_update.id_estudiante is not None:
            db_evaluacion.id_estudiante = evaluacion_update.id_estudiante
        if evaluacion_update.id_profesor is not None:
            db_evaluacion.id_profesor = evaluacion_update.id_profesor
        if evaluacion_update.materia is not None:
            db_evaluacion.materia = evaluacion_update.materia
        if evaluacion_update.tipo_evaluacion is not None:
            db_evaluacion.tipo_evaluacion = evaluacion_update.tipo_evaluacion
        if evaluacion_update.fecha_evaluacion is not None:
            db_evaluacion.fecha_evaluacion = evaluacion_update.fecha_evaluacion
        if evaluacion_update.nota_numerica is not None:
            db_evaluacion.nota_numerica = evaluacion_update.nota_numerica
        if evaluacion_update.nota_conceptual is not None:
            db_evaluacion.nota_conceptual = evaluacion_update.nota_conceptual
        if evaluacion_update.observaciones is not None:
            db_evaluacion.observaciones = evaluacion_update.observaciones
        if evaluacion_update.peso_porcentual is not None:
            db_evaluacion.peso_porcentual = evaluacion_update.peso_porcentual
        if evaluacion_update.updated_by is not None:
            db_evaluacion.updated_by = evaluacion_update.updated_by
        
        db.commit()
        db.refresh(db_evaluacion)
        return db_evaluacion
    
    @staticmethod
    def soft_delete(db: Session, id_evaluacion: int, deleted_by: str) -> bool:
        """Eliminación lógica de una evaluación"""
        db_evaluacion = db.query(Evaluacion).filter(
            Evaluacion.id_evaluacion == id_evaluacion,
            Evaluacion.status == True
        ).first()
        
        if db_evaluacion:
            db_evaluacion.status = False
            db_evaluacion.deleted_by = deleted_by
            db.commit()
            return True
        return False
    
    @staticmethod
    def restore(db: Session, id_evaluacion: int, updated_by: str) -> bool:
        """Restaurar una evaluación eliminada lógicamente"""
        db_evaluacion = db.query(Evaluacion).filter(
            Evaluacion.id_evaluacion == id_evaluacion,
            Evaluacion.status == False
        ).first()
        
        if db_evaluacion:
            db_evaluacion.status = True
            db_evaluacion.deleted_by = None
            db_evaluacion.updated_by = updated_by
            db.commit()
            return True
        return False
    
    @staticmethod
    def get_all_materias(db: Session) -> List[str]:
        """Obtener todas las materias únicas"""
        materias = db.query(Evaluacion.materia).filter(
            Evaluacion.status == True
        ).distinct().all()
        return [materia[0] for materia in materias if materia[0]]
    
    @staticmethod
    def get_all_tipos_evaluacion(db: Session) -> List[str]:
        """Obtener todos los tipos de evaluación únicos"""
        tipos = db.query(Evaluacion.tipo_evaluacion).filter(
            Evaluacion.status == True
        ).distinct().all()
        return [tipo[0] for tipo in tipos if tipo[0]]
    
    @staticmethod
    def get_estadisticas_por_periodo(db: Session, fecha_inicio: date, fecha_fin: date) -> dict:
        """Obtener estadísticas de evaluaciones por período"""
        evaluaciones = db.query(Evaluacion).filter(
            Evaluacion.fecha_evaluacion >= fecha_inicio,
            Evaluacion.fecha_evaluacion <= fecha_fin,
            Evaluacion.status == True,
            Evaluacion.nota_numerica.isnot(None)
        ).all()
        
        if not evaluaciones:
            return {}
        
        notas = [e.nota_numerica for e in evaluaciones]
        promedio_general = sum(notas) / len(notas)
        nota_maxima = max(notas)
        nota_minima = min(notas)
        
        # Contar por tipo de evaluación
        tipos = {}
        materias = {}
        for evaluacion in evaluaciones:
            # Contar por tipo
            if evaluacion.tipo_evaluacion in tipos:
                tipos[evaluacion.tipo_evaluacion] += 1
            else:
                tipos[evaluacion.tipo_evaluacion] = 1
            
            # Contar por materia
            if evaluacion.materia in materias:
                materias[evaluacion.materia] += 1
            else:
                materias[evaluacion.materia] = 1
        
        return {
            "periodo": f"{fecha_inicio} - {fecha_fin}",
            "total_evaluaciones": len(evaluaciones),
            "promedio_general": promedio_general,
            "nota_maxima": nota_maxima,
            "nota_minima": nota_minima,
            "por_tipo": tipos,
            "por_materia": materias
        }