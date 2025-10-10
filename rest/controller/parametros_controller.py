from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from ..schemas.parametro_schema import Parametro

router = APIRouter(prefix="/parametros", tags=["Parámetros"])

@router.post("/", response_model=Parametro, status_code=status.HTTP_201_CREATED)
async def create_parametro(parametro: Parametro):
    """
    Crear un nuevo parámetro del sistema.
    """
    try:
        # TODO: Implementar lógica de creación en base de datos
        # Validar que el nombre sea único
        # db_parametro = create_parametro_in_db(parametro)
        # return db_parametro
        
        # Ejemplo temporal
        parametro.id_parametro = 1  # Simular ID generado
        parametro.fecha_modificacion = "2025-10-09T10:00:00"
        return parametro
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear el parámetro: {str(e)}"
        )

@router.get("/", response_model=List[Parametro])
async def get_all_parametros():
    """
    Obtener todos los parámetros activos.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # parametros = get_all_parametros_from_db()
        # return parametros
        
        # Ejemplo temporal
        return [
            Parametro(
                id_parametro=1,
                nombre="multa_dia_retraso",
                tipo="multa",
                valor_numerico=150.00,
                status=True
            ),
            Parametro(
                id_parametro=2,
                nombre="max_reservas_usuario",
                tipo="reserva",
                valor_numerico=3,
                status=True
            )
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener los parámetros: {str(e)}"
        )

@router.get("/{id_parametro}", response_model=Parametro)
async def get_parametro_by_id(id_parametro: int):
    """
    Obtener un parámetro por su ID.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # parametro = get_parametro_by_id_from_db(id_parametro)
        # if not parametro:
        #     raise HTTPException(status_code=404, detail="Parámetro no encontrado")
        # return parametro
        
        # Ejemplo temporal
        if id_parametro == 1:
            return Parametro(
                id_parametro=1,
                nombre="multa_dia_retraso",
                tipo="multa",
                valor_numerico=150.00,
                status=True
            )
        else:
            raise HTTPException(status_code=404, detail="Parámetro no encontrado")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener el parámetro: {str(e)}"
        )

@router.get("/search/nombre/{nombre}", response_model=List[Parametro])
async def get_parametros_by_name(nombre: str):
    """
    Buscar parámetros por nombre (coincidencia parcial).
    """
    try:
        # TODO: Implementar búsqueda en base de datos
        # parametros = search_parametros_by_name_from_db(nombre)
        # return parametros
        
        # Ejemplo temporal
        parametros_ejemplo = [
            Parametro(
                id_parametro=1,
                nombre="multa_dia_retraso",
                tipo="multa",
                valor_numerico=150.00,
                status=True
            ),
            Parametro(
                id_parametro=2,
                nombre="multa_limite_libros",
                tipo="multa",
                valor_numerico=500.00,
                status=True
            )
        ]
        
        # Filtrar por nombre que contenga la búsqueda
        return [p for p in parametros_ejemplo if nombre.lower() in p.nombre.lower()]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar parámetros: {str(e)}"
        )

@router.get("/tipo/{tipo}", response_model=List[Parametro])
async def get_parametros_by_tipo(tipo: str):
    """
    Obtener parámetros por tipo.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # parametros = get_parametros_by_tipo_from_db(tipo)
        # return parametros
        
        # Ejemplo temporal
        parametros_ejemplo = [
            Parametro(
                id_parametro=1,
                nombre="multa_dia_retraso",
                tipo="multa",
                valor_numerico=150.00,
                status=True
            ),
            Parametro(
                id_parametro=2,
                nombre="max_reservas_usuario",
                tipo="reserva",
                valor_numerico=3,
                status=True
            )
        ]
        
        # Filtrar por tipo
        return [p for p in parametros_ejemplo if p.tipo.lower() == tipo.lower()]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener parámetros por tipo: {str(e)}"
        )

@router.put("/{id_parametro}", response_model=Parametro)
async def update_parametro(id_parametro: int, parametro_update: Parametro):
    """
    Actualizar un parámetro por su ID.
    """
    try:
        # TODO: Implementar actualización en base de datos
        # existing_parametro = get_parametro_by_id_from_db(id_parametro)
        # if not existing_parametro:
        #     raise HTTPException(status_code=404, detail="Parámetro no encontrado")
        # 
        # updated_parametro = update_parametro_in_db(id_parametro, parametro_update)
        # return updated_parametro
        
        # Ejemplo temporal
        if id_parametro == 1:
            parametro_update.id_parametro = id_parametro
            parametro_update.fecha_modificacion = "2025-10-09T11:00:00"
            return parametro_update
        else:
            raise HTTPException(status_code=404, detail="Parámetro no encontrado")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar el parámetro: {str(e)}"
        )

@router.delete("/{id_parametro}", response_model=dict)
async def soft_delete_parametro(id_parametro: int):
    """
    Soft delete: marcar parámetro como inactivo.
    """
    try:
        # TODO: Implementar soft delete en base de datos
        # existing_parametro = get_parametro_by_id_from_db(id_parametro)
        # if not existing_parametro:
        #     raise HTTPException(status_code=404, detail="Parámetro no encontrado")
        # 
        # soft_delete_parametro_in_db(id_parametro)
        
        # Ejemplo temporal
        if id_parametro == 1:
            return {"message": f"Parámetro con ID {id_parametro} marcado como inactivo"}
        else:
            raise HTTPException(status_code=404, detail="Parámetro no encontrado")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar el parámetro: {str(e)}"
        )