from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from datetime import datetime
from ..schemas.cronograma_schema import Cronograma
from ..schemas.clase_individual_schema import ClaseIndividual, ClaseConCronograma, EstadoClase
from ..schemas.evaluacion_schema import Evaluacion, EvaluacionConCronograma, TipoEvaluacion

router = APIRouter(prefix="/schedules", tags=["Schedules"])

# ========== CRONOGRAMAS ==========

@router.post("/", response_model=Cronograma, status_code=status.HTTP_201_CREATED)
async def create_cronograma(cronograma: Cronograma):
    """
    Crear un nuevo cronograma.
    """
    try:
        # TODO: Implementar lógica de creación en base de datos
        # Validar que courseId sea válido en el módulo CORE
        # db_cronograma = create_cronograma_in_db(cronograma)
        # return db_cronograma
        
        # Ejemplo temporal
        cronograma.id_cronograma = 1  # Simular ID generado
        cronograma.fecha_creacion = datetime.now()
        return cronograma
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear el cronograma: {str(e)}"
        )

@router.get("/", response_model=List[Cronograma])
async def get_all_cronogramas():
    """
    Obtener todos los cronogramas activos.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # cronogramas = get_all_cronogramas_from_db()
        # return cronogramas
        
        # Ejemplo temporal
        return [
            Cronograma(
                id_cronograma=1,
                courseId="CORE001",
                courseName="Base de Datos II",
                totalClasses=16,
                fecha_creacion=datetime.now(),
                status=True
            )
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener los cronogramas: {str(e)}"
        )

@router.get("/{id_cronograma}", response_model=Cronograma)
async def get_cronograma_by_id(id_cronograma: int):
    """
    Obtener un cronograma por su ID.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # cronograma = get_cronograma_by_id_from_db(id_cronograma)
        # if not cronograma:
        #     raise HTTPException(status_code=404, detail="Cronograma no encontrado")
        # return cronograma
        
        # Ejemplo temporal
        if id_cronograma == 1:
            return Cronograma(
                id_cronograma=1,
                courseId="CORE001",
                courseName="Base de Datos II",
                totalClasses=16,
                fecha_creacion=datetime.now(),
                status=True
            )
        else:
            raise HTTPException(status_code=404, detail="Cronograma no encontrado")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener el cronograma: {str(e)}"
        )

@router.get("/search/curso/{nombre_curso}", response_model=List[Cronograma])
async def get_cronogramas_by_course_name(nombre_curso: str):
    """
    Buscar cronogramas por nombre de curso (coincidencia parcial).
    """
    try:
        # TODO: Implementar búsqueda en base de datos
        # cronogramas = search_cronogramas_by_course_name_from_db(nombre_curso)
        # return cronogramas
        
        # Ejemplo temporal
        cronogramas_ejemplo = [
            Cronograma(
                id_cronograma=1,
                courseId="CORE001",
                courseName="Base de Datos II",
                totalClasses=16,
                fecha_creacion=datetime.now(),
                status=True
            ),
            Cronograma(
                id_cronograma=2,
                courseId="CORE002",
                courseName="Base de Datos Avanzado",
                totalClasses=12,
                fecha_creacion=datetime.now(),
                status=True
            )
        ]
        
        # Filtrar por nombre de curso que contenga la búsqueda
        return [c for c in cronogramas_ejemplo if nombre_curso.lower() in c.courseName.lower()]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar cronogramas: {str(e)}"
        )

@router.put("/{id_cronograma}", response_model=Cronograma)
async def update_cronograma(id_cronograma: int, cronograma_update: Cronograma):
    """
    Actualizar un cronograma por su ID.
    """
    try:
        # TODO: Implementar actualización en base de datos
        # existing_cronograma = get_cronograma_by_id_from_db(id_cronograma)
        # if not existing_cronograma:
        #     raise HTTPException(status_code=404, detail="Cronograma no encontrado")
        # 
        # updated_cronograma = update_cronograma_in_db(id_cronograma, cronograma_update)
        # return updated_cronograma
        
        # Ejemplo temporal
        if id_cronograma == 1:
            cronograma_update.id_cronograma = id_cronograma
            return cronograma_update
        else:
            raise HTTPException(status_code=404, detail="Cronograma no encontrado")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar el cronograma: {str(e)}"
        )

@router.delete("/{id_cronograma}", response_model=dict)
async def soft_delete_cronograma(id_cronograma: int):
    """
    Soft delete: marcar cronograma como inactivo.
    """
    try:
        # TODO: Implementar soft delete en base de datos
        # existing_cronograma = get_cronograma_by_id_from_db(id_cronograma)
        # if not existing_cronograma:
        #     raise HTTPException(status_code=404, detail="Cronograma no encontrado")
        # 
        # soft_delete_cronograma_in_db(id_cronograma)
        
        # Ejemplo temporal
        if id_cronograma == 1:
            return {"message": f"Cronograma con ID {id_cronograma} marcado como inactivo"}
        else:
            raise HTTPException(status_code=404, detail="Cronograma no encontrado")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar el cronograma: {str(e)}"
        )

# ========== CLASES INDIVIDUALES ==========

@router.post("/{id_cronograma}/clases", response_model=ClaseIndividual, status_code=status.HTTP_201_CREATED)
async def create_clase(id_cronograma: int, clase: ClaseIndividual):
    """
    Crear una nueva clase individual para un cronograma.
    """
    try:
        # TODO: Implementar lógica de creación en base de datos
        # Validar que el cronograma exista
        # clase.id_cronograma = id_cronograma
        # db_clase = create_clase_in_db(clase)
        # return db_clase
        
        # Ejemplo temporal
        clase.id_clase = 1  # Simular ID generado
        clase.id_cronograma = id_cronograma
        return clase
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear la clase: {str(e)}"
        )

@router.get("/{id_cronograma}/clases", response_model=List[ClaseIndividual])
async def get_clases_by_cronograma(id_cronograma: int):
    """
    Obtener todas las clases de un cronograma específico.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # clases = get_clases_by_cronograma_from_db(id_cronograma)
        # return clases
        
        # Ejemplo temporal
        if id_cronograma == 1:
            return [
                ClaseIndividual(
                    id_clase=1,
                    id_cronograma=1,
                    titulo="Introducción a NoSQL",
                    descripcion="Conceptos básicos de bases de datos NoSQL",
                    fecha=datetime(2025, 8, 5, 9, 0),
                    hora_inicio="09:00",
                    hora_fin="11:00",
                    estado=EstadoClase.PROGRAMADA,
                    status=True
                )
            ]
        else:
            return []
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener las clases: {str(e)}"
        )

@router.get("/clases/{id_clase}", response_model=ClaseIndividual)
async def get_clase_by_id(id_clase: int):
    """
    Obtener una clase por su ID.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # clase = get_clase_by_id_from_db(id_clase)
        # if not clase:
        #     raise HTTPException(status_code=404, detail="Clase no encontrada")
        # return clase
        
        # Ejemplo temporal
        if id_clase == 1:
            return ClaseIndividual(
                id_clase=1,
                id_cronograma=1,
                titulo="Introducción a NoSQL",
                descripcion="Conceptos básicos de bases de datos NoSQL",
                fecha=datetime(2025, 8, 5, 9, 0),
                hora_inicio="09:00",
                hora_fin="11:00",
                estado=EstadoClase.PROGRAMADA,
                status=True
            )
        else:
            raise HTTPException(status_code=404, detail="Clase no encontrada")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener la clase: {str(e)}"
        )

@router.get("/clases/search/titulo/{titulo}", response_model=List[ClaseIndividual])
async def get_clases_by_titulo(titulo: str):
    """
    Buscar clases por título (coincidencia parcial).
    """
    try:
        # TODO: Implementar búsqueda en base de datos
        # clases = search_clases_by_titulo_from_db(titulo)
        # return clases
        
        # Ejemplo temporal
        clases_ejemplo = [
            ClaseIndividual(
                id_clase=1,
                id_cronograma=1,
                titulo="Introducción a NoSQL",
                descripcion="Conceptos básicos de bases de datos NoSQL",
                fecha=datetime(2025, 8, 5, 9, 0),
                hora_inicio="09:00",
                hora_fin="11:00",
                estado=EstadoClase.PROGRAMADA,
                status=True
            )
        ]
        
        # Filtrar por título que contenga la búsqueda
        return [c for c in clases_ejemplo if titulo.lower() in c.titulo.lower()]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar clases: {str(e)}"
        )

@router.put("/clases/{id_clase}", response_model=ClaseIndividual)
async def update_clase(id_clase: int, clase_update: ClaseIndividual):
    """
    Actualizar una clase por su ID.
    """
    try:
        # TODO: Implementar actualización en base de datos
        # existing_clase = get_clase_by_id_from_db(id_clase)
        # if not existing_clase:
        #     raise HTTPException(status_code=404, detail="Clase no encontrada")
        # 
        # updated_clase = update_clase_in_db(id_clase, clase_update)
        # return updated_clase
        
        # Ejemplo temporal
        if id_clase == 1:
            clase_update.id_clase = id_clase
            return clase_update
        else:
            raise HTTPException(status_code=404, detail="Clase no encontrada")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar la clase: {str(e)}"
        )

@router.delete("/clases/{id_clase}", response_model=dict)
async def soft_delete_clase(id_clase: int):
    """
    Soft delete: marcar clase como inactiva.
    """
    try:
        # TODO: Implementar soft delete en base de datos
        # existing_clase = get_clase_by_id_from_db(id_clase)
        # if not existing_clase:
        #     raise HTTPException(status_code=404, detail="Clase no encontrada")
        # 
        # soft_delete_clase_in_db(id_clase)
        
        # Ejemplo temporal
        if id_clase == 1:
            return {"message": f"Clase con ID {id_clase} marcada como inactiva"}
        else:
            raise HTTPException(status_code=404, detail="Clase no encontrada")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar la clase: {str(e)}"
        )

# ========== EVALUACIONES ==========

@router.post("/{id_cronograma}/evaluaciones", response_model=Evaluacion, status_code=status.HTTP_201_CREATED)
async def create_evaluacion(id_cronograma: int, evaluacion: Evaluacion):
    """
    Crear una nueva evaluación para un cronograma.
    """
    try:
        # TODO: Implementar lógica de creación en base de datos
        # Validar que el cronograma exista y que la ponderación sea válida
        # evaluacion.id_cronograma = id_cronograma
        # db_evaluacion = create_evaluacion_in_db(evaluacion)
        # return db_evaluacion
        
        # Ejemplo temporal
        evaluacion.id_evaluacion = 1  # Simular ID generado
        evaluacion.id_cronograma = id_cronograma
        return evaluacion
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear la evaluación: {str(e)}"
        )

@router.get("/{id_cronograma}/evaluaciones", response_model=List[Evaluacion])
async def get_evaluaciones_by_cronograma(id_cronograma: int):
    """
    Obtener todas las evaluaciones de un cronograma específico.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # evaluaciones = get_evaluaciones_by_cronograma_from_db(id_cronograma)
        # return evaluaciones
        
        # Ejemplo temporal
        if id_cronograma == 1:
            return [
                Evaluacion(
                    id_evaluacion=1,
                    id_cronograma=1,
                    nombre="Parcial NoSQL",
                    descripcion="Evaluación sobre conceptos de NoSQL",
                    fecha=datetime(2025, 10, 5, 9, 0),
                    hora_inicio="09:00",
                    hora_fin="11:00",
                    tipo=TipoEvaluacion.PARCIAL,
                    ponderacion=40.0,
                    status=True
                )
            ]
        else:
            return []
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener las evaluaciones: {str(e)}"
        )

@router.get("/evaluaciones/{id_evaluacion}", response_model=Evaluacion)
async def get_evaluacion_by_id(id_evaluacion: int):
    """
    Obtener una evaluación por su ID.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # evaluacion = get_evaluacion_by_id_from_db(id_evaluacion)
        # if not evaluacion:
        #     raise HTTPException(status_code=404, detail="Evaluación no encontrada")
        # return evaluacion
        
        # Ejemplo temporal
        if id_evaluacion == 1:
            return Evaluacion(
                id_evaluacion=1,
                id_cronograma=1,
                nombre="Parcial NoSQL",
                descripcion="Evaluación sobre conceptos de NoSQL",
                fecha=datetime(2025, 10, 5, 9, 0),
                hora_inicio="09:00",
                hora_fin="11:00",
                tipo=TipoEvaluacion.PARCIAL,
                ponderacion=40.0,
                status=True
            )
        else:
            raise HTTPException(status_code=404, detail="Evaluación no encontrada")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener la evaluación: {str(e)}"
        )

@router.get("/evaluaciones/search/nombre/{nombre}", response_model=List[Evaluacion])
async def get_evaluaciones_by_nombre(nombre: str):
    """
    Buscar evaluaciones por nombre (coincidencia parcial).
    """
    try:
        # TODO: Implementar búsqueda en base de datos
        # evaluaciones = search_evaluaciones_by_nombre_from_db(nombre)
        # return evaluaciones
        
        # Ejemplo temporal
        evaluaciones_ejemplo = [
            Evaluacion(
                id_evaluacion=1,
                id_cronograma=1,
                nombre="Parcial NoSQL",
                descripcion="Evaluación sobre conceptos de NoSQL",
                fecha=datetime(2025, 10, 5, 9, 0),
                hora_inicio="09:00",
                hora_fin="11:00",
                tipo=TipoEvaluacion.PARCIAL,
                ponderacion=40.0,
                status=True
            )
        ]
        
        # Filtrar por nombre que contenga la búsqueda
        return [e for e in evaluaciones_ejemplo if nombre.lower() in e.nombre.lower()]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar evaluaciones: {str(e)}"
        )

@router.get("/evaluaciones/tipo/{tipo}", response_model=List[Evaluacion])
async def get_evaluaciones_by_tipo(tipo: TipoEvaluacion):
    """
    Obtener evaluaciones por tipo.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # evaluaciones = get_evaluaciones_by_tipo_from_db(tipo)
        # return evaluaciones
        
        # Ejemplo temporal
        evaluaciones_ejemplo = [
            Evaluacion(
                id_evaluacion=1,
                id_cronograma=1,
                nombre="Parcial NoSQL",
                descripcion="Evaluación sobre conceptos de NoSQL",
                fecha=datetime(2025, 10, 5, 9, 0),
                hora_inicio="09:00",
                hora_fin="11:00",
                tipo=TipoEvaluacion.PARCIAL,
                ponderacion=40.0,
                status=True
            )
        ]
        
        # Filtrar por tipo
        return [e for e in evaluaciones_ejemplo if e.tipo == tipo]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener evaluaciones por tipo: {str(e)}"
        )

@router.put("/evaluaciones/{id_evaluacion}", response_model=Evaluacion)
async def update_evaluacion(id_evaluacion: int, evaluacion_update: Evaluacion):
    """
    Actualizar una evaluación por su ID.
    """
    try:
        # TODO: Implementar actualización en base de datos
        # existing_evaluacion = get_evaluacion_by_id_from_db(id_evaluacion)
        # if not existing_evaluacion:
        #     raise HTTPException(status_code=404, detail="Evaluación no encontrada")
        # 
        # updated_evaluacion = update_evaluacion_in_db(id_evaluacion, evaluacion_update)
        # return updated_evaluacion
        
        # Ejemplo temporal
        if id_evaluacion == 1:
            evaluacion_update.id_evaluacion = id_evaluacion
            return evaluacion_update
        else:
            raise HTTPException(status_code=404, detail="Evaluación no encontrada")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar la evaluación: {str(e)}"
        )

@router.delete("/evaluaciones/{id_evaluacion}", response_model=dict)
async def soft_delete_evaluacion(id_evaluacion: int):
    """
    Soft delete: marcar evaluación como inactiva.
    """
    try:
        # TODO: Implementar soft delete en base de datos
        # existing_evaluacion = get_evaluacion_by_id_from_db(id_evaluacion)
        # if not existing_evaluacion:
        #     raise HTTPException(status_code=404, detail="Evaluación no encontrada")
        # 
        # soft_delete_evaluacion_in_db(id_evaluacion)
        
        # Ejemplo temporal
        if id_evaluacion == 1:
            return {"message": f"Evaluación con ID {id_evaluacion} marcada como inactiva"}
        else:
            raise HTTPException(status_code=404, detail="Evaluación no encontrada")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar la evaluación: {str(e)}"
        )