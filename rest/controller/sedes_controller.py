from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from ..schemas.sede_schema import Sede

router = APIRouter(prefix="/sedes", tags=["Sedes"])

@router.post("/", response_model=Sede, status_code=status.HTTP_201_CREATED)
async def create_sede(sede: Sede):
    """
    Crear una nueva sede.
    """
    try:
        # TODO: Implementar lógica de creación en base de datos
        # Validar que el nombre sea único
        # db_sede = create_sede_in_db(sede)
        # return db_sede
        
        # Ejemplo temporal
        sede.id_sede = 1  # Simular ID generado
        return sede
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear la sede: {str(e)}"
        )

@router.get("/", response_model=List[Sede])
async def get_all_sedes():
    """
    Obtener todas las sedes activas.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # sedes = get_all_sedes_from_db()
        # return sedes
        
        # Ejemplo temporal
        return [
            Sede(
                id_sede=1,
                nombre="Sede Central",
                ubicacion="Av. Rivadavia 1234, CABA",
                status=True
            ),
            Sede(
                id_sede=2,
                nombre="Sede Norte",
                ubicacion="Av. Cabildo 5678, CABA",
                status=True
            )
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener las sedes: {str(e)}"
        )

@router.get("/{id_sede}", response_model=Sede)
async def get_sede_by_id(id_sede: int):
    """
    Obtener una sede por su ID.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # sede = get_sede_by_id_from_db(id_sede)
        # if not sede:
        #     raise HTTPException(status_code=404, detail="Sede no encontrada")
        # return sede
        
        # Ejemplo temporal
        if id_sede == 1:
            return Sede(
                id_sede=1,
                nombre="Sede Central",
                ubicacion="Av. Rivadavia 1234, CABA",
                status=True
            )
        else:
            raise HTTPException(status_code=404, detail="Sede no encontrada")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener la sede: {str(e)}"
        )

@router.get("/search/nombre/{nombre}", response_model=List[Sede])
async def get_sedes_by_name(nombre: str):
    """
    Buscar sedes por nombre (coincidencia parcial).
    """
    try:
        # TODO: Implementar búsqueda en base de datos
        # sedes = search_sedes_by_name_from_db(nombre)
        # return sedes
        
        # Ejemplo temporal
        sedes_ejemplo = [
            Sede(
                id_sede=1,
                nombre="Sede Central",
                ubicacion="Av. Rivadavia 1234, CABA",
                status=True
            ),
            Sede(
                id_sede=2,
                nombre="Sede Norte",
                ubicacion="Av. Cabildo 5678, CABA",
                status=True
            )
        ]
        
        # Filtrar por nombre que contenga la búsqueda
        return [s for s in sedes_ejemplo if nombre.lower() in s.nombre.lower()]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar sedes: {str(e)}"
        )

@router.get("/search/ubicacion/{ubicacion}", response_model=List[Sede])
async def get_sedes_by_ubicacion(ubicacion: str):
    """
    Buscar sedes por ubicación (coincidencia parcial).
    """
    try:
        # TODO: Implementar búsqueda en base de datos
        # sedes = search_sedes_by_ubicacion_from_db(ubicacion)
        # return sedes
        
        # Ejemplo temporal
        sedes_ejemplo = [
            Sede(
                id_sede=1,
                nombre="Sede Central",
                ubicacion="Av. Rivadavia 1234, CABA",
                status=True
            ),
            Sede(
                id_sede=2,
                nombre="Sede Norte",
                ubicacion="Av. Cabildo 5678, CABA",
                status=True
            )
        ]
        
        # Filtrar por ubicación que contenga la búsqueda
        return [s for s in sedes_ejemplo if ubicacion.lower() in s.ubicacion.lower()]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar sedes por ubicación: {str(e)}"
        )

@router.put("/{id_sede}", response_model=Sede)
async def update_sede(id_sede: int, sede_update: Sede):
    """
    Actualizar una sede por su ID.
    """
    try:
        # TODO: Implementar actualización en base de datos
        # existing_sede = get_sede_by_id_from_db(id_sede)
        # if not existing_sede:
        #     raise HTTPException(status_code=404, detail="Sede no encontrada")
        # 
        # updated_sede = update_sede_in_db(id_sede, sede_update)
        # return updated_sede
        
        # Ejemplo temporal
        if id_sede == 1:
            sede_update.id_sede = id_sede
            return sede_update
        else:
            raise HTTPException(status_code=404, detail="Sede no encontrada")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar la sede: {str(e)}"
        )

@router.delete("/{id_sede}", response_model=dict)
async def soft_delete_sede(id_sede: int):
    """
    Soft delete: marcar sede como inactiva.
    """
    try:
        # TODO: Implementar soft delete en base de datos
        # existing_sede = get_sede_by_id_from_db(id_sede)
        # if not existing_sede:
        #     raise HTTPException(status_code=404, detail="Sede no encontrada")
        # 
        # soft_delete_sede_in_db(id_sede)
        
        # Ejemplo temporal
        if id_sede == 1:
            return {"message": f"Sede con ID {id_sede} marcada como inactiva"}
        else:
            raise HTTPException(status_code=404, detail="Sede no encontrada")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar la sede: {str(e)}"
        )