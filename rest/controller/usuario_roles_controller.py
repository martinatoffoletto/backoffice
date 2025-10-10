from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from ..schemas.usuario_rol_schema import UsuarioRol, UsuarioConRoles

router = APIRouter(prefix="/usuario-roles", tags=["Usuario-Roles"])

@router.post("/", response_model=UsuarioRol, status_code=status.HTTP_201_CREATED)
async def assign_rol_to_usuario(usuario_rol: UsuarioRol):
    """
    Asignar un rol a un usuario.
    """
    try:
        # TODO: Implementar lógica de creación en base de datos
        # Validar que el usuario y rol existan
        # Validar que no exista ya la relación
        # db_usuario_rol = create_usuario_rol_in_db(usuario_rol)
        # return db_usuario_rol
        
        # Ejemplo temporal
        return usuario_rol
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al asignar el rol al usuario: {str(e)}"
        )

@router.get("/usuario/{id_usuario}", response_model=List[UsuarioRol])
async def get_roles_by_usuario(id_usuario: int):
    """
    Obtener todos los roles de un usuario específico.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # roles = get_roles_by_usuario_from_db(id_usuario)
        # return roles
        
        # Ejemplo temporal
        if id_usuario == 1:
            return [
                UsuarioRol(id_usuario=1, id_rol=1),
                UsuarioRol(id_usuario=1, id_rol=2)
            ]
        else:
            return []
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener roles del usuario: {str(e)}"
        )

@router.get("/rol/{id_rol}", response_model=List[UsuarioRol])
async def get_usuarios_by_rol(id_rol: int):
    """
    Obtener todos los usuarios que tienen un rol específico.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # usuarios = get_usuarios_by_rol_from_db(id_rol)
        # return usuarios
        
        # Ejemplo temporal
        if id_rol == 1:
            return [
                UsuarioRol(id_usuario=1, id_rol=1),
                UsuarioRol(id_usuario=2, id_rol=1)
            ]
        else:
            return []
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener usuarios del rol: {str(e)}"
        )

@router.get("/", response_model=List[UsuarioRol])
async def get_all_usuario_roles():
    """
    Obtener todas las relaciones usuario-rol.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # usuario_roles = get_all_usuario_roles_from_db()
        # return usuario_roles
        
        # Ejemplo temporal
        return [
            UsuarioRol(id_usuario=1, id_rol=1),
            UsuarioRol(id_usuario=1, id_rol=2),
            UsuarioRol(id_usuario=2, id_rol=1)
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener las relaciones usuario-rol: {str(e)}"
        )

@router.get("/usuario/{id_usuario}/detallado", response_model=UsuarioConRoles)
async def get_usuario_with_roles_detailed(id_usuario: int):
    """
    Obtener usuario con información detallada de sus roles.
    """
    try:
        # TODO: Implementar consulta con JOIN a base de datos
        # usuario_con_roles = get_usuario_with_roles_from_db(id_usuario)
        # if not usuario_con_roles:
        #     raise HTTPException(status_code=404, detail="Usuario no encontrado")
        # return usuario_con_roles
        
        # Ejemplo temporal
        if id_usuario == 1:
            return UsuarioConRoles(
                id_usuario=1,
                nombre="Juan",
                apellido="Pérez",
                legajo="12345",
                roles=["docente", "administrativo"]
            )
        else:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener usuario con roles: {str(e)}"
        )

@router.delete("/usuario/{id_usuario}/rol/{id_rol}", response_model=dict)
async def remove_rol_from_usuario(id_usuario: int, id_rol: int):
    """
    Remover un rol específico de un usuario.
    """
    try:
        # TODO: Implementar eliminación en base de datos
        # existing_relation = get_usuario_rol_from_db(id_usuario, id_rol)
        # if not existing_relation:
        #     raise HTTPException(status_code=404, detail="Relación usuario-rol no encontrada")
        # 
        # delete_usuario_rol_from_db(id_usuario, id_rol)
        
        # Ejemplo temporal
        if id_usuario == 1 and id_rol == 1:
            return {"message": f"Rol {id_rol} removido del usuario {id_usuario}"}
        else:
            raise HTTPException(status_code=404, detail="Relación usuario-rol no encontrada")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al remover el rol del usuario: {str(e)}"
        )

@router.delete("/usuario/{id_usuario}/roles", response_model=dict)
async def remove_all_roles_from_usuario(id_usuario: int):
    """
    Remover todos los roles de un usuario específico.
    """
    try:
        # TODO: Implementar eliminación en base de datos
        # existing_user = get_usuario_by_id_from_db(id_usuario)
        # if not existing_user:
        #     raise HTTPException(status_code=404, detail="Usuario no encontrado")
        # 
        # delete_all_roles_from_usuario_in_db(id_usuario)
        
        # Ejemplo temporal
        if id_usuario == 1:
            return {"message": f"Todos los roles removidos del usuario {id_usuario}"}
        else:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al remover roles del usuario: {str(e)}"
        )