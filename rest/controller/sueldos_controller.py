from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from ..schemas.sueldo_schema import Sueldo, SueldoDetallado

router = APIRouter(prefix="/sueldos", tags=["Sueldos"])

@router.post("/", response_model=Sueldo, status_code=status.HTTP_201_CREATED)
async def create_sueldo(sueldo: Sueldo):
    """
    Crear un nuevo registro de sueldo.
    """
    try:
        # TODO: Implementar lógica de creación en base de datos
        # Validar que el usuario exista y calcular sueldo_total
        # sueldo.sueldo_total = sueldo.sueldo_fijo + sueldo.sueldo_adicional
        # db_sueldo = create_sueldo_in_db(sueldo)
        # return db_sueldo
        
        # Ejemplo temporal
        sueldo.id_sueldo = 1  # Simular ID generado
        sueldo.sueldo_total = sueldo.sueldo_fijo + sueldo.sueldo_adicional
        return sueldo
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear el sueldo: {str(e)}"
        )

@router.get("/", response_model=List[Sueldo])
async def get_all_sueldos():
    """
    Obtener todos los sueldos activos.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # sueldos = get_all_sueldos_from_db()
        # return sueldos
        
        # Ejemplo temporal
        return [
            Sueldo(
                id_sueldo=1,
                id_usuario=1,
                cbu="1234567890123456789012",
                id_rol=1,
                sueldo_fijo=850000.00,
                sueldo_adicional=0.00,
                sueldo_total=850000.00,
                observaciones="Sueldo base docente",
                activo=True
            )
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener los sueldos: {str(e)}"
        )

@router.get("/{id_sueldo}", response_model=Sueldo)
async def get_sueldo_by_id(id_sueldo: int):
    """
    Obtener un sueldo por su ID.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # sueldo = get_sueldo_by_id_from_db(id_sueldo)
        # if not sueldo:
        #     raise HTTPException(status_code=404, detail="Sueldo no encontrado")
        # return sueldo
        
        # Ejemplo temporal
        if id_sueldo == 1:
            return Sueldo(
                id_sueldo=1,
                id_usuario=1,
                cbu="1234567890123456789012",
                id_rol=1,
                sueldo_fijo=850000.00,
                sueldo_adicional=0.00,
                sueldo_total=850000.00,
                observaciones="Sueldo base docente",
                activo=True
            )
        else:
            raise HTTPException(status_code=404, detail="Sueldo no encontrado")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener el sueldo: {str(e)}"
        )

@router.get("/usuario/{id_usuario}", response_model=List[Sueldo])
async def get_sueldos_by_usuario(id_usuario: int):
    """
    Obtener todos los sueldos de un usuario específico.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # sueldos = get_sueldos_by_usuario_from_db(id_usuario)
        # return sueldos
        
        # Ejemplo temporal
        if id_usuario == 1:
            return [
                Sueldo(
                    id_sueldo=1,
                    id_usuario=1,
                    cbu="1234567890123456789012",
                    id_rol=1,
                    sueldo_fijo=850000.00,
                    sueldo_adicional=0.00,
                    sueldo_total=850000.00,
                    observaciones="Sueldo base docente",
                    activo=True
                ),
                Sueldo(
                    id_sueldo=2,
                    id_usuario=1,
                    cbu="1234567890123456789012",
                    id_rol=2,
                    sueldo_fijo=420000.00,
                    sueldo_adicional=80000.00,
                    sueldo_total=500000.00,
                    observaciones="Sueldo administrativo con plus",
                    activo=True
                )
            ]
        else:
            return []
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener sueldos del usuario: {str(e)}"
        )

@router.get("/rol/{id_rol}", response_model=List[Sueldo])
async def get_sueldos_by_rol(id_rol: int):
    """
    Obtener todos los sueldos por rol específico.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # sueldos = get_sueldos_by_rol_from_db(id_rol)
        # return sueldos
        
        # Ejemplo temporal
        if id_rol == 1:
            return [
                Sueldo(
                    id_sueldo=1,
                    id_usuario=1,
                    cbu="1234567890123456789012",
                    id_rol=1,
                    sueldo_fijo=850000.00,
                    sueldo_adicional=0.00,
                    sueldo_total=850000.00,
                    observaciones="Sueldo base docente",
                    activo=True
                )
            ]
        else:
            return []
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener sueldos por rol: {str(e)}"
        )

@router.get("/search/cbu/{cbu}", response_model=List[Sueldo])
async def get_sueldos_by_cbu(cbu: str):
    """
    Buscar sueldos por CBU (coincidencia parcial).
    """
    try:
        # TODO: Implementar búsqueda en base de datos
        # sueldos = search_sueldos_by_cbu_from_db(cbu)
        # return sueldos
        
        # Ejemplo temporal
        sueldos_ejemplo = [
            Sueldo(
                id_sueldo=1,
                id_usuario=1,
                cbu="1234567890123456789012",
                id_rol=1,
                sueldo_fijo=850000.00,
                sueldo_adicional=0.00,
                sueldo_total=850000.00,
                observaciones="Sueldo base docente",
                activo=True
            )
        ]
        
        # Filtrar por CBU que contenga la búsqueda
        return [s for s in sueldos_ejemplo if cbu in s.cbu]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar sueldos por CBU: {str(e)}"
        )

@router.get("/{id_sueldo}/detallado", response_model=SueldoDetallado)
async def get_sueldo_detallado(id_sueldo: int):
    """
    Obtener sueldo con información detallada del usuario y rol.
    """
    try:
        # TODO: Implementar consulta con JOIN a base de datos
        # sueldo_detallado = get_sueldo_detallado_from_db(id_sueldo)
        # if not sueldo_detallado:
        #     raise HTTPException(status_code=404, detail="Sueldo no encontrado")
        # return sueldo_detallado
        
        # Ejemplo temporal
        if id_sueldo == 1:
            return SueldoDetallado(
                id_sueldo=1,
                cbu="1234567890123456789012",
                sueldo_fijo=850000.00,
                sueldo_adicional=0.00,
                sueldo_total=850000.00,
                observaciones="Sueldo base docente",
                activo=True,
                usuario_nombre="Juan Pérez",
                usuario_legajo="12345",
                rol_nombre="docente"
            )
        else:
            raise HTTPException(status_code=404, detail="Sueldo no encontrado")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener sueldo detallado: {str(e)}"
        )

@router.put("/{id_sueldo}", response_model=Sueldo)
async def update_sueldo(id_sueldo: int, sueldo_update: Sueldo):
    """
    Actualizar un sueldo por su ID.
    """
    try:
        # TODO: Implementar actualización en base de datos
        # existing_sueldo = get_sueldo_by_id_from_db(id_sueldo)
        # if not existing_sueldo:
        #     raise HTTPException(status_code=404, detail="Sueldo no encontrado")
        # 
        # sueldo_update.sueldo_total = sueldo_update.sueldo_fijo + sueldo_update.sueldo_adicional
        # updated_sueldo = update_sueldo_in_db(id_sueldo, sueldo_update)
        # return updated_sueldo
        
        # Ejemplo temporal
        if id_sueldo == 1:
            sueldo_update.id_sueldo = id_sueldo
            sueldo_update.sueldo_total = sueldo_update.sueldo_fijo + sueldo_update.sueldo_adicional
            return sueldo_update
        else:
            raise HTTPException(status_code=404, detail="Sueldo no encontrado")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar el sueldo: {str(e)}"
        )

@router.delete("/{id_sueldo}", response_model=dict)
async def soft_delete_sueldo(id_sueldo: int):
    """
    Soft delete: marcar sueldo como inactivo.
    """
    try:
        # TODO: Implementar soft delete en base de datos
        # existing_sueldo = get_sueldo_by_id_from_db(id_sueldo)
        # if not existing_sueldo:
        #     raise HTTPException(status_code=404, detail="Sueldo no encontrado")
        # 
        # soft_delete_sueldo_in_db(id_sueldo)
        
        # Ejemplo temporal
        if id_sueldo == 1:
            return {"message": f"Sueldo con ID {id_sueldo} marcado como inactivo"}
        else:
            raise HTTPException(status_code=404, detail="Sueldo no encontrado")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar el sueldo: {str(e)}"
        )