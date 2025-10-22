from sqlalchemy.orm import Session
from ..dao.usuario_carrera_dao import UsuarioCarreraDAO
from ..dao.usuario_dao import UsuarioDAO
from ..dao.carrera_dao import CarreraDAO
from ..schemas.usuario_carrera_schema import UsuarioCarrera as UsuarioCarreraSchema
from ..schemas.carrera_schema import Carrera as CarreraSchema
from ..schemas.usuario_schema import Usuario as UsuarioSchema
from typing import List, Optional
from uuid import UUID
from fastapi import HTTPException, status, Depends
from ..database import get_db

class UsuarioCarreraService:
    
    def __init__(self, db: Session):
        self.db = db
        self.usuario_carrera_dao = UsuarioCarreraDAO()
        self.usuario_dao = UsuarioDAO()
        self.carrera_dao = CarreraDAO()
    
    def assign_carrera(self, id_usuario: UUID, id_carrera: UUID, assigned_by: str) -> dict:
        
        usuario = self.usuario_dao.get_by_id(self.db, id_usuario)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el usuario con ID {id_usuario}"
            )

        carrera = self.carrera_dao.get_by_id(self.db, id_carrera)
        if not carrera:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró la carrera con ID {id_carrera}"
            )
        
        if self.usuario_carrera_dao.exists(self.db, id_usuario, id_carrera):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"El usuario ya está asignado a la carrera '{carrera.nombre}'"
            )
        
        new_assignment = self.usuario_carrera_dao.assign(self.db, id_usuario, id_carrera)
        
        return {
            "message": f"Carrera '{carrera.nombre}' asignada exitosamente al usuario '{usuario.legajo}'",
            "assignment": new_assignment,
            "assigned_by": assigned_by
        }
    
    def remove_carrera(self, id_usuario: UUID, id_carrera: UUID, removed_by: str) -> dict:
        if not self.usuario_carrera_dao.exists(self.db, id_usuario, id_carrera):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No se encontró la asignación de carrera especificada"
            )
        
        success = self.usuario_carrera_dao.remove(self.db, id_usuario, id_carrera)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al remover la carrera del usuario"
            )
        
        return {
            "message": "Carrera removida exitosamente del usuario",
            "removed_by": removed_by
        }
    
    def get_carreras_for_usuario(self, id_usuario: UUID) -> List[CarreraSchema]:
        if not self.usuario_dao.get_by_id(self.db, id_usuario):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el usuario con ID {id_usuario}"
            )
            
        return self.usuario_carrera_dao.get_carreras_by_usuario(self.db, id_usuario)

    def get_usuarios_for_carrera(self, id_carrera: UUID) -> List[UsuarioSchema]:
        if not self.carrera_dao.get_by_id(self.db, id_carrera):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró la carrera con ID {id_carrera}"
            )
            
        return self.usuario_carrera_dao.get_usuarios_by_carrera(self.db, id_carrera)

def get_usuario_carrera_service(db: Session = Depends(get_db)) -> UsuarioCarreraService:
    return UsuarioCarreraService(db)
