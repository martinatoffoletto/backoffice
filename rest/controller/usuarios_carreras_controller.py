from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_async_db
from ..service.usuario_carrera_service import UsuarioCarreraService
from ..schemas.usuario_carrera_schema import UsuarioCarrera, UsuarioCarreraCreate
from typing import List, Optional
from uuid import UUID

router = APIRouter(prefix="/usuarios-carreras", tags=["Usuario-Carrera"])

@router.get("/", response_model=List[UsuarioCarrera], response_model_exclude_none=True)
async def get_all_usuario_carreras(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    param: Optional[str] = Query(None, description="Parámetro de búsqueda opcional: id, id_usuario, id_carrera, status"),
    value: Optional[str] = Query(None, description="Valor a buscar cuando se usa 'param'"),
    status_filter: Optional[bool] = Query(None, description="Filtrar por estado activo/inactivo"),
    db: AsyncSession = Depends(get_async_db)
):
    """Obtener todas las relaciones usuario-carrera con filtros opcionales"""
    try:
        if param is not None:
            valid_params = ["id", "id_usuario", "id_carrera", "status"]
            if param.lower() not in valid_params:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Parámetro de búsqueda inválido: {param}. Parámetros válidos: {', '.join(valid_params)}"
                )
            if value is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cuando se especifica 'param' también debe enviarse 'value'"
                )
            relaciones = await UsuarioCarreraService.search_usuario_carreras(db, param, value, skip, limit, status_filter)
            return relaciones

        return await UsuarioCarreraService.get_all_usuario_carreras(db, skip, limit, status_filter)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener las relaciones: {str(e)}"
        )

@router.get("/{id_usuario}/{id_carrera}", response_model=UsuarioCarrera, response_model_exclude_none=True)
async def get_usuario_carrera_by_id(
    id_usuario: UUID,
    id_carrera: UUID,
    status_filter: Optional[bool] = Query(None, description="Filtrar por estado activo/inactivo"),
    db: AsyncSession = Depends(get_async_db)
):
    """Obtener una relación usuario-carrera por IDs"""
    try:
        relacion = await UsuarioCarreraService.get_usuario_carrera_by_id(db, id_usuario, id_carrera, status_filter)
        if not relacion:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró la relación usuario-carrera"
            )
        return relacion
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener la relación: {str(e)}"
        )

@router.post("/", response_model=UsuarioCarrera, status_code=status.HTTP_201_CREATED)
async def create_usuario_carrera_assignment(
    assignment: UsuarioCarreraCreate,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Asignar una carrera a un usuario.
    """
    try:
        result = await UsuarioCarreraService.create_assignment(db, assignment)
        if result is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Usuario con ID {assignment.id_usuario} no encontrado"
            )
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al asignar la carrera: {str(e)}"
        )

@router.delete("/{id_usuario}/{id_carrera}", response_model=dict, status_code=status.HTTP_200_OK)
async def delete_usuario_carrera(
    id_usuario: UUID,
    id_carrera: UUID,
    db: AsyncSession = Depends(get_async_db)
):
    """Eliminar una relación usuario-carrera"""
    try:
        success = await UsuarioCarreraService.delete_usuario_carrera(db, id_usuario, id_carrera)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró la relación usuario-carrera"
            )
        return {
            "message": "Relación eliminada exitosamente",
            "id_usuario": str(id_usuario),
            "id_carrera": str(id_carrera),
            "status": False
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar la relación: {str(e)}"
        )

@router.delete("/", response_model=dict)
async def remove_usuario_carrera_assignment(
    id_usuario: UUID = Query(..., description="ID del usuario"),
    id_carrera: UUID = Query(..., description="ID de la carrera"),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Remover una carrera de un usuario.
    """
    try:
        success = await UsuarioCarreraService.remove_assignment(db, id_usuario, id_carrera)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No se encontró la asignación especificada"
            )
        return {
            "message": "Asignación removida exitosamente",
            "success": success
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al remover la asignación: {str(e)}"
        )

@router.get("/usuario/{id_usuario}", response_model=UsuarioCarrera, response_model_exclude_none=True)
async def get_carrera_by_usuario(
    id_usuario: UUID,
    status_filter: Optional[bool] = Query(None, description="Filtrar por estado activo/inactivo"),
    db: AsyncSession = Depends(get_async_db)
):
    """Obtener la carrera activa asignada a un usuario especifico."""
    try:
        carrera = await UsuarioCarreraService.get_carrera_by_usuario(db, id_usuario, status_filter)
        if carrera is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Usuario con ID {id_usuario} no encontrado o sin carrera activa"
            )
        return carrera
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener carreras del usuario: {str(e)}"
        )

@router.get("/carrera/{id_carrera}", response_model=List[UsuarioCarrera], response_model_exclude_none=True)
async def get_usuarios_by_carrera(
    id_carrera: UUID,
    status_filter: Optional[bool] = Query(None, description="Filtrar por estado activo/inactivo"),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtener todos los usuarios asignados a una carrera específica.
    Retorna las relaciones usuario-carrera (solo IDs).
    """
    try:
        return await UsuarioCarreraService.get_usuarios_by_carrera(db, id_carrera, status_filter)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener usuarios de la carrera: {str(e)}"
        )

@router.get("/exists", response_model=dict)
async def check_assignment_exists(
    id_usuario: UUID = Query(..., description="ID del usuario"),
    id_carrera: UUID = Query(..., description="ID de la carrera"),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Verificar si existe una asignación específica usuario-carrera.
    """
    try:
        exists = await UsuarioCarreraService.check_assignment_exists(db, id_usuario, id_carrera)
        return {
            "exists": exists,
            "id_usuario": id_usuario,
            "id_carrera": id_carrera
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al verificar la asignación: {str(e)}"
        )
