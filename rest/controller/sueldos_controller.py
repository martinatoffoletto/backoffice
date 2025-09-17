from fastapi import APIRouter, HTTPException, status, Depends
from rest.service.auth_service import get_current_user
from typing import List
from pydantic import BaseModel
from rest.schemas.sueldo_schema import SueldoCreate, SueldoUpdate


router = APIRouter(prefix="/salaries", tags=["Salaries"])

@router.get(
	"/",
	summary="Listar sueldos",
	description="Obtiene la lista de sueldos.",
	response_description="Lista de sueldos",
	responses={
		200: {"description": "Lista de sueldos encontrada"},
		500: {"description": "Error interno del servidor"}
	}
)
async def listar_sueldos(user=Depends(get_current_user)):
	"""Obtiene la lista de sueldos."""
	pass

@router.post(
	"/",
	summary="Crear sueldo",
	description="Crea un nuevo sueldo.",
	response_description="Sueldo creado",
	responses={
		201: {"description": "Sueldo creado exitosamente"},
		400: {"description": "Datos inválidos"},
		409: {"description": "Sueldo ya existe"},
		500: {"description": "Error interno del servidor"}
	}
)
async def crear_sueldo(sueldo: SueldoCreate, user=Depends(get_current_user)):
	"""Crea un nuevo sueldo."""
	pass

@router.get(
	"/{sueldo_id}",
	summary="Obtener sueldo por ID",
	description="Obtiene los datos de un sueldo por su ID.",
	response_description="Datos del sueldo",
	responses={
		200: {"description": "Sueldo encontrado"},
		404: {"description": "Sueldo no encontrado"},
		500: {"description": "Error interno del servidor"}
	}
)
async def obtener_sueldo(sueldo_id: str, user=Depends(get_current_user)):
	"""Obtiene los datos de un sueldo por su ID."""
	pass

@router.put(
	"/{sueldo_id}",
	summary="Actualizar sueldo por ID",
	description="Actualiza los datos de un sueldo por su ID.",
	response_description="Sueldo actualizado",
	responses={
		200: {"description": "Sueldo actualizado exitosamente"},
		400: {"description": "Datos inválidos"},
		404: {"description": "Sueldo no encontrado"},
		500: {"description": "Error interno del servidor"}
	}
)
async def actualizar_sueldo(sueldo_id: str, sueldo: SueldoUpdate, user=Depends(get_current_user)):
	"""Actualiza los datos de un sueldo por su ID."""
	pass

@router.delete(
	"/{sueldo_id}",
	summary="Eliminar sueldo",
	description="Elimina un sueldo por su ID.",
	response_description="Sueldo eliminado",
	responses={
		200: {"description": "Sueldo eliminado exitosamente"},
		403: {"description": "No tienes permisos para eliminar este sueldo"},
		404: {"description": "Sueldo no encontrado"},
		500: {"description": "Error interno del servidor"}
	}
)
async def eliminar_sueldo(sueldo_id: str, user=Depends(get_current_user)):
	"""Elimina un sueldo por su ID."""
	pass

