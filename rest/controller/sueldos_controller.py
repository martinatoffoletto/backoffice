from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from rest.schemas.sueldo_schema import SueldoCreate, SueldoUpdate


router = APIRouter(prefix="/sueldos", tags=["Sueldos"])

@router.get("/", summary="Listar sueldos")
async def listar_sueldos():
	"""Obtiene la lista de sueldos."""
	pass

@router.post("/", summary="Crear sueldo")
async def crear_sueldo(sueldo: SueldoCreate):
	"""Crea un nuevo sueldo."""
	pass

@router.get("/{sueldo_id}", summary="Obtener sueldo por ID")
async def obtener_sueldo(sueldo_id: str):
	"""Obtiene los datos de un sueldo por su ID."""
	pass

@router.put("/{sueldo_id}", summary="Actualizar sueldo por ID")
async def actualizar_sueldo(sueldo_id: str, sueldo: SueldoUpdate):
	"""Actualiza los datos de un sueldo por su ID."""

	pass

@router.delete("/{sueldo_id}", summary="Eliminar sueldo")
async def eliminar_sueldo(sueldo_id: str):
	"""Elimina un sueldo por su ID."""
	pass

