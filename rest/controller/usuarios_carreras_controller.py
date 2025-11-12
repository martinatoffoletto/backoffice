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

@router.put("/{id_usuario}/{id_carrera_antigua}", response_model=UsuarioCarrera, status_code=status.HTTP_200_OK)
async def update_usuario_carrera(
    id_usuario: UUID,
    id_carrera_antigua: UUID,
    id_carrera_nueva: UUID = Query(..., description="Nuevo ID de carrera"),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Modificar la carrera asignada a un usuario.
    Solo se puede cambiar el id_carrera.
    """
    try:
        updated = await UsuarioCarreraService.update_carrera(db, id_usuario, id_carrera_antigua, id_carrera_nueva)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró la relación usuario-carrera"
            )
        return updated
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
            detail=f"Error al modificar la relación: {str(e)}"
        )

@router.delete("/{id_usuario}/{id_carrera}", response_model=dict, status_code=status.HTTP_200_OK)
async def delete_usuario_carrera(
    id_usuario: UUID,
    id_carrera: UUID,
    db: AsyncSession = Depends(get_async_db)
):
    try:
        success, error_message = await UsuarioCarreraService.delete_usuario_carrera(db, id_usuario, id_carrera)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_message
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
