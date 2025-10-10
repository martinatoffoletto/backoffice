from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from ..schemas.espacio_schema import Espacio, EspacioConSede, TipoEspacio, EstadoEspacio

router = APIRouter(prefix="/spaces", tags=["Spaces"])

@router.post("/", response_model=Espacio, status_code=status.HTTP_201_CREATED)
async def create_espacio(espacio: Espacio):
    """
    Crear un nuevo espacio.
    """
    try:
        # TODO: Implementar lógica de creación en base de datos
        # Validar que el nombre sea único y que la sede exista
        # db_espacio = create_espacio_in_db(espacio)
        # return db_espacio
        
        # Ejemplo temporal
        espacio.id_espacio = 1  # Simular ID generado
        return espacio
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear el espacio: {str(e)}"
        )

@router.get("/", response_model=List[Espacio])
async def get_all_espacios():
    """
    Obtener todos los espacios activos.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # espacios = get_all_espacios_from_db()
        # return espacios
        
        # Ejemplo temporal
        return [
            Espacio(
                id_espacio=1,
                nombre="Aula 203",
                tipo=TipoEspacio.AULA,
                capacidad=30,
                ubicacion="2° piso, ala norte",
                estado=EstadoEspacio.DISPONIBLE,
                id_sede=1,
                status=True
            ),
            Espacio(
                id_espacio=2,
                nombre="Lab Informática 1",
                tipo=TipoEspacio.LABORATORIO,
                capacidad=25,
                ubicacion="1° piso, ala este",
                estado=EstadoEspacio.DISPONIBLE,
                id_sede=1,
                status=True
            )
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener los espacios: {str(e)}"
        )

@router.get("/{id_espacio}", response_model=Espacio)
async def get_espacio_by_id(id_espacio: int):
    """
    Obtener un espacio por su ID.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # espacio = get_espacio_by_id_from_db(id_espacio)
        # if not espacio:
        #     raise HTTPException(status_code=404, detail="Espacio no encontrado")
        # return espacio
        
        # Ejemplo temporal
        if id_espacio == 1:
            return Espacio(
                id_espacio=1,
                nombre="Aula 203",
                tipo=TipoEspacio.AULA,
                capacidad=30,
                ubicacion="2° piso, ala norte",
                estado=EstadoEspacio.DISPONIBLE,
                id_sede=1,
                status=True
            )
        else:
            raise HTTPException(status_code=404, detail="Espacio no encontrado")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener el espacio: {str(e)}"
        )

@router.get("/search/nombre/{nombre}", response_model=List[Espacio])
async def get_espacios_by_name(nombre: str):
    """
    Buscar espacios por nombre (coincidencia parcial).
    """
    try:
        # TODO: Implementar búsqueda en base de datos
        # espacios = search_espacios_by_name_from_db(nombre)
        # return espacios
        
        # Ejemplo temporal
        espacios_ejemplo = [
            Espacio(
                id_espacio=1,
                nombre="Aula 203",
                tipo=TipoEspacio.AULA,
                capacidad=30,
                ubicacion="2° piso, ala norte",
                estado=EstadoEspacio.DISPONIBLE,
                id_sede=1,
                status=True
            ),
            Espacio(
                id_espacio=2,
                nombre="Aula 204",
                tipo=TipoEspacio.AULA,
                capacidad=35,
                ubicacion="2° piso, ala sur",
                estado=EstadoEspacio.DISPONIBLE,
                id_sede=1,
                status=True
            )
        ]
        
        # Filtrar por nombre que contenga la búsqueda
        return [e for e in espacios_ejemplo if nombre.lower() in e.nombre.lower()]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar espacios: {str(e)}"
        )



@router.get("/tipo/{tipo}", response_model=List[Espacio])
async def get_espacios_by_tipo(tipo: TipoEspacio):
    """
    Obtener espacios por tipo.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # espacios = get_espacios_by_tipo_from_db(tipo)
        # return espacios
        
        # Ejemplo temporal
        espacios_ejemplo = [
            Espacio(
                id_espacio=1,
                nombre="Aula 203",
                tipo=TipoEspacio.AULA,
                capacidad=30,
                ubicacion="2° piso, ala norte",
                estado=EstadoEspacio.DISPONIBLE,
                id_sede=1,
                status=True
            ),
            Espacio(
                id_espacio=2,
                nombre="Lab Informática 1",
                tipo=TipoEspacio.LABORATORIO,
                capacidad=25,
                ubicacion="1° piso, ala este",
                estado=EstadoEspacio.DISPONIBLE,
                id_sede=1,
                status=True
            )
        ]
        
        # Filtrar por tipo
        return [e for e in espacios_ejemplo if e.tipo == tipo]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener espacios por tipo: {str(e)}"
        )

@router.get("/estado/{estado}", response_model=List[Espacio])
async def get_espacios_by_estado(estado: EstadoEspacio):
    """
    Obtener espacios por estado.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # espacios = get_espacios_by_estado_from_db(estado)
        # return espacios
        
        # Ejemplo temporal
        espacios_ejemplo = [
            Espacio(
                id_espacio=1,
                nombre="Aula 203",
                tipo=TipoEspacio.AULA,
                capacidad=30,
                ubicacion="2° piso, ala norte",
                estado=EstadoEspacio.DISPONIBLE,
                id_sede=1,
                status=True
            )
        ]
        
        # Filtrar por estado
        return [e for e in espacios_ejemplo if e.estado == estado]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener espacios por estado: {str(e)}"
        )


@router.put("/{id_espacio}", response_model=Espacio)
async def update_espacio(id_espacio: int, espacio_update: Espacio):
    """
    Actualizar un espacio por su ID.
    """
    try:
        # TODO: Implementar actualización en base de datos
        # existing_espacio = get_espacio_by_id_from_db(id_espacio)
        # if not existing_espacio:
        #     raise HTTPException(status_code=404, detail="Espacio no encontrado")
        # 
        # updated_espacio = update_espacio_in_db(id_espacio, espacio_update)
        # return updated_espacio
        
        # Ejemplo temporal
        if id_espacio == 1:
            espacio_update.id_espacio = id_espacio
            return espacio_update
        else:
            raise HTTPException(status_code=404, detail="Espacio no encontrado")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar el espacio: {str(e)}"
        )

@router.delete("/{id_espacio}", response_model=dict)
async def soft_delete_espacio(id_espacio: int):
    """
    Soft delete: marcar espacio como inactivo.
    """
    try:
        # TODO: Implementar soft delete en base de datos
        # existing_espacio = get_espacio_by_id_from_db(id_espacio)
        # if not existing_espacio:
        #     raise HTTPException(status_code=404, detail="Espacio no encontrado")
        # 
        # soft_delete_espacio_in_db(id_espacio)
        
        # Ejemplo temporal
        if id_espacio == 1:
            return {"message": f"Espacio con ID {id_espacio} marcado como inactivo"}
        else:
            raise HTTPException(status_code=404, detail="Espacio no encontrado")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar el espacio: {str(e)}"
        )