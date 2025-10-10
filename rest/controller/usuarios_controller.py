from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from ..schemas.usuario_schema import Usuario
from ..schemas.usuario_rol_schema import UsuarioConRoles

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=Usuario, status_code=status.HTTP_201_CREATED)
async def create_usuario(usuario: Usuario):
    """
    Crear un nuevo usuario.
    """
    try:
        # TODO: Implementar lógica de creación en base de datos
        # Validar que legajo y DNI sean únicos
        # db_usuario = create_usuario_in_db(usuario)
        # return db_usuario
        
        # Ejemplo temporal
        usuario.id_usuario = 1  # Simular ID generado
        usuario.fecha_alta = "2025-10-09T10:00:00"
        return usuario
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear el usuario: {str(e)}"
        )

@router.get("/", response_model=List[Usuario])
async def get_all_usuarios():
    """
    Obtener todos los usuarios activos.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # usuarios = get_all_usuarios_from_db()
        # return usuarios
        
        # Ejemplo temporal
        return [
            Usuario(
                id_usuario=1,
                nombre="Juan",
                apellido="Pérez",
                legajo="12345",
                dni="12345678",
                correo_personal="juan.perez@email.com",
                telefono_personal="1234567890",
                status=True
            )
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener los usuarios: {str(e)}"
        )

@router.get("/{id_usuario}", response_model=Usuario)
async def get_usuario_by_id(id_usuario: int):
    """
    Obtener un usuario por su ID.
    """
    try:
        # TODO: Implementar consulta a base de datos
        # usuario = get_usuario_by_id_from_db(id_usuario)
        # if not usuario:
        #     raise HTTPException(status_code=404, detail="Usuario no encontrado")
        # return usuario
        
        # Ejemplo temporal
        if id_usuario == 1:
            return Usuario(
                id_usuario=1,
                nombre="Juan",
                apellido="Pérez",
                legajo="12345",
                dni="12345678",
                correo_personal="juan.perez@email.com",
                telefono_personal="1234567890",
                status=True
            )
        else:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener el usuario: {str(e)}"
        )

@router.get("/search/nombre/{nombre}", response_model=List[Usuario])
async def get_usuarios_by_name(nombre: str):
    """
    Buscar usuarios por nombre o apellido (coincidencia parcial).
    """
    try:
        # TODO: Implementar búsqueda en base de datos
        # usuarios = search_usuarios_by_name_from_db(nombre)
        # return usuarios
        
        # Ejemplo temporal
        usuarios_ejemplo = [
            Usuario(
                id_usuario=1,
                nombre="Juan",
                apellido="Pérez",
                legajo="12345",
                dni="12345678",
                correo_personal="juan.perez@email.com",
                telefono_personal="1234567890",
                status=True
            ),
            Usuario(
                id_usuario=2,
                nombre="Juan Carlos",
                apellido="González",
                legajo="54321",
                dni="87654321",
                correo_personal="juan.gonzalez@email.com",
                telefono_personal="0987654321",
                status=True
            )
        ]
        
        # Filtrar por nombre o apellido que contenga la búsqueda
        return [u for u in usuarios_ejemplo 
                if nombre.lower() in u.nombre.lower() or nombre.lower() in u.apellido.lower()]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar usuarios: {str(e)}"
        )

@router.get("/search/legajo/{legajo}", response_model=Usuario)
async def get_usuario_by_legajo(legajo: str):
    """
    Buscar usuario por legajo.
    """
    try:
        # TODO: Implementar búsqueda en base de datos
        # usuario = get_usuario_by_legajo_from_db(legajo)
        # if not usuario:
        #     raise HTTPException(status_code=404, detail="Usuario no encontrado")
        # return usuario
        
        # Ejemplo temporal
        if legajo == "12345":
            return Usuario(
                id_usuario=1,
                nombre="Juan",
                apellido="Pérez",
                legajo="12345",
                dni="12345678",
                correo_personal="juan.perez@email.com",
                telefono_personal="1234567890",
                status=True
            )
        else:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar usuario: {str(e)}"
        )

@router.get("/{id_usuario}/roles", response_model=UsuarioConRoles)
async def get_usuario_with_roles(id_usuario: int):
    """
    Obtener usuario con sus roles.
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

@router.put("/{id_usuario}", response_model=Usuario)
async def update_usuario(id_usuario: int, usuario_update: Usuario):
    """
    Actualizar un usuario por su ID.
    """
    try:
        # TODO: Implementar actualización en base de datos
        # existing_usuario = get_usuario_by_id_from_db(id_usuario)
        # if not existing_usuario:
        #     raise HTTPException(status_code=404, detail="Usuario no encontrado")
        # 
        # updated_usuario = update_usuario_in_db(id_usuario, usuario_update)
        # return updated_usuario
        
        # Ejemplo temporal
        if id_usuario == 1:
            usuario_update.id_usuario = id_usuario
            return usuario_update
        else:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar el usuario: {str(e)}"
        )

@router.delete("/{id_usuario}", response_model=dict)
async def soft_delete_usuario(id_usuario: int):
    """
    Soft delete: marcar usuario como inactivo.
    """
    try:
        # TODO: Implementar soft delete en base de datos
        # existing_usuario = get_usuario_by_id_from_db(id_usuario)
        # if not existing_usuario:
        #     raise HTTPException(status_code=404, detail="Usuario no encontrado")
        # 
        # soft_delete_usuario_in_db(id_usuario)
        
        # Ejemplo temporal
        if id_usuario == 1:
            return {"message": f"Usuario con ID {id_usuario} marcado como inactivo"}
        else:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar el usuario: {str(e)}"
        )