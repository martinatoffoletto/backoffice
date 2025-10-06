from fastapi import APIRouter, HTTPException, status
from typing import List
from ..schemas.cronograma_schema import CronogramaCreate, CronogramaUpdate
from ..models.cronograma_model import Cronograma, ClaseIndividual, Evaluacion

router = APIRouter(tags=["Cronogramas"], prefix="/cronogramas")

@router.post(
    "/",
    summary="Crear cronograma",
    description="Crea un nuevo cronograma para un curso con sus clases y evaluaciones.\n\nIncluye:\n- Información general del curso\n- Lista de clases individuales con fechas y horarios\n- Lista de evaluaciones con tipos y fechas",
    responses={
        201: {"description": "Cronograma creado exitosamente"},
        400: {"description": "Datos inválidos"},
        500: {"description": "Error interno del servidor"}
    }
)
async def create_cronograma(cronograma_data: CronogramaCreate):
    pass

@router.get(
    "/",
    summary="Obtener todos los cronogramas",
    description="Obtiene la lista de todos los cronogramas registrados en el sistema.",
    responses={
        200: {"description": "Lista de cronogramas obtenida exitosamente"},
        500: {"description": "Error interno del servidor"}
    }
)
async def get_cronogramas():
    pass

@router.get(
    "/{cronograma_id}",
    summary="Obtener cronograma por ID",
    description="Obtiene un cronograma específico con todas sus clases y evaluaciones.",
    responses={
        200: {"description": "Cronograma obtenido exitosamente"},
        404: {"description": "Cronograma no encontrado"},
        500: {"description": "Error interno del servidor"}
    }
)
async def get_cronograma(cronograma_id: str):
    pass

@router.get(
    "/curso/{course_id}",
    summary="Obtener cronogramas por curso",
    description="Obtiene todos los cronogramas asociados a un curso específico.",
    responses={
        200: {"description": "Cronogramas del curso obtenidos exitosamente"},
        404: {"description": "Curso no encontrado"},
        500: {"description": "Error interno del servidor"}
    }
)
async def get_cronogramas_by_course(course_id: str):
    pass

@router.put(
    "/{cronograma_id}",
    summary="Actualizar cronograma",
    description="Actualiza un cronograma existente con nueva información de clases y evaluaciones.",
    responses={
        200: {"description": "Cronograma actualizado exitosamente"},
        404: {"description": "Cronograma no encontrado"},
        400: {"description": "Datos inválidos"},
        500: {"description": "Error interno del servidor"}
    }
)
async def update_cronograma(cronograma_id: str, cronograma_data: CronogramaUpdate):
    pass

@router.delete(
    "/{cronograma_id}",
    summary="Eliminar cronograma",
    description="Elimina un cronograma y todas sus clases y evaluaciones asociadas.",
    responses={
        204: {"description": "Cronograma eliminado exitosamente"},
        404: {"description": "Cronograma no encontrado"},
        500: {"description": "Error interno del servidor"}
    }
)
async def delete_cronograma(cronograma_id: str):
    pass