from sqlalchemy.orm import Session
from ..dao.sede_dao import SedeDAO
from ..dao.espacio_dao import EspacioDAO
from ..schemas.espacio_schema import Espacio as EspacioSchema
from typing import List, Optional
from fastapi import HTTPException, status

class EspacioService:
    
    def __init__(self, db: Session):
        self.db = db
        self.espacio_dao = EspacioDAO()
        self.sede_dao = SedeDAO()
    
    def create_espacio(self, espacio: EspacioSchema, created_by: str) -> dict:
        """Crear un nuevo espacio con validaciones"""
        # Verificar que la sede existe
        sede = self.sede_dao.get_by_id(self.db, espacio.id_sede)
        if not sede:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No se encontró la sede con ID {espacio.id_sede}"
            )
        
        # Verificar que no exista un espacio con el mismo nombre en la misma sede
        if self.espacio_dao.exists_by_nombre_and_sede(self.db, espacio.nombre_espacio, espacio.id_sede):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un espacio con el nombre '{espacio.nombre_espacio}' en la sede '{sede.nombre_sede}'"
            )
        
        # Asignar created_by
        espacio.created_by = created_by
        
        # Crear el espacio
        new_espacio = self.espacio_dao.create(self.db, espacio)
        
        return {
            "message": "Espacio creado exitosamente",
            "espacio": new_espacio,
            "sede": sede.nombre_sede,
            "created_by": created_by
        }
    
    def get_espacio_by_id(self, id_espacio: int, include_sede: bool = False) -> dict:
        """Obtener espacio por ID con opción de incluir información de sede"""
        if include_sede:
            espacio_with_sede = self.espacio_dao.get_with_sede_info(self.db, id_espacio)
            if not espacio_with_sede:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"No se encontró el espacio con ID {id_espacio}"
                )
            return espacio_with_sede
        else:
            espacio = self.espacio_dao.get_by_id(self.db, id_espacio)
            if not espacio:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"No se encontró el espacio con ID {id_espacio}"
                )
            return {"espacio": espacio}
    
    def get_all_espacios(self, skip: int = 0, limit: int = 100) -> dict:
        """Obtener todos los espacios activos"""
        espacios = self.espacio_dao.get_all(self.db, skip, limit)
        
        return {
            "espacios": espacios,
            "total": len(espacios),
            "skip": skip,
            "limit": limit
        }
    
    def get_espacios_by_sede(self, id_sede: int, skip: int = 0, limit: int = 100) -> dict:
        """Obtener espacios por sede"""
        # Verificar que la sede existe
        sede = self.sede_dao.get_by_id(self.db, id_sede)
        if not sede:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró la sede con ID {id_sede}"
            )
        
        espacios = self.espacio_dao.get_by_sede(self.db, id_sede, skip, limit)
        
        return {
            "espacios": espacios,
            "sede": sede.nombre_sede,
            "total": len(espacios),
            "skip": skip,
            "limit": limit
        }
    
    def search_espacios_disponibles(self, 
                                  id_sede: Optional[int] = None,
                                  tipo_espacio: Optional[str] = None,
                                  capacidad_minima: Optional[int] = None,
                                  necesita_proyector: Optional[bool] = None,
                                  necesita_sonido: Optional[bool] = None,
                                  necesita_internet: Optional[bool] = None,
                                  necesita_aire: Optional[bool] = None,
                                  skip: int = 0, limit: int = 100) -> dict:
        """Buscar espacios con filtros específicos"""
        espacios = self.espacio_dao.get_by_filters(
            self.db, id_sede, tipo_espacio, capacidad_minima,
            necesita_proyector, necesita_sonido, necesita_internet, necesita_aire,
            skip, limit
        )
        
        return {
            "espacios": espacios,
            "filtros_aplicados": {
                "sede": id_sede,
                "tipo": tipo_espacio,
                "capacidad_minima": capacidad_minima,
                "proyector": necesita_proyector,
                "sonido": necesita_sonido,
                "internet": necesita_internet,
                "aire_acondicionado": necesita_aire
            },
            "total_encontrados": len(espacios),
            "skip": skip,
            "limit": limit
        }
    
    def update_espacio(self, id_espacio: int, espacio_update: EspacioSchema, updated_by: str) -> dict:
        """Actualizar espacio con validaciones"""
        # Verificar que el espacio existe
        existing_espacio = self.espacio_dao.get_by_id(self.db, id_espacio)
        if not existing_espacio:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el espacio con ID {id_espacio}"
            )
        
        # Verificar sede si se está cambiando
        if espacio_update.id_sede and espacio_update.id_sede != existing_espacio.id_sede:
            sede = self.sede_dao.get_by_id(self.db, espacio_update.id_sede)
            if not sede:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"No se encontró la sede con ID {espacio_update.id_sede}"
                )
        
        # Verificar nombre único en la sede si se está cambiando
        if (espacio_update.nombre_espacio and 
            espacio_update.nombre_espacio != existing_espacio.nombre_espacio):
            
            sede_id = espacio_update.id_sede or existing_espacio.id_sede
            if self.espacio_dao.exists_by_nombre_and_sede(self.db, espacio_update.nombre_espacio, sede_id):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Ya existe un espacio con el nombre '{espacio_update.nombre_espacio}' en esa sede"
                )
        
        # Asignar updated_by
        espacio_update.updated_by = updated_by
        
        # Actualizar
        updated_espacio = self.espacio_dao.update(self.db, id_espacio, espacio_update)
        
        return {
            "message": "Espacio actualizado exitosamente",
            "espacio": updated_espacio,
            "updated_by": updated_by
        }
    
    def delete_espacio(self, id_espacio: int, deleted_by: str) -> dict:
        """Eliminar espacio lógicamente"""
        espacio = self.espacio_dao.get_by_id(self.db, id_espacio)
        if not espacio:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el espacio con ID {id_espacio}"
            )
        
        # TODO: Verificar que no hay cronogramas o clases programadas en este espacio
        # cronogramas_activos = self.cronograma_dao.get_by_espacio(self.db, id_espacio, limit=1)
        # if cronogramas_activos:
        #     raise HTTPException(
        #         status_code=status.HTTP_400_BAD_REQUEST,
        #         detail="No se puede eliminar el espacio porque tiene cronogramas activos"
        #     )
        
        # Eliminar lógicamente
        success = self.espacio_dao.soft_delete(self.db, id_espacio, deleted_by)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al eliminar el espacio"
            )
        
        return {
            "message": f"Espacio '{espacio.nombre_espacio}' eliminado exitosamente",
            "deleted_by": deleted_by
        }
    
    def get_espacios_statistics(self) -> dict:
        """Obtener estadísticas de espacios"""
        all_espacios = self.espacio_dao.get_all(self.db, skip=0, limit=1000)
        
        # Estadísticas por tipo
        tipos = self.espacio_dao.get_all_tipos(self.db)
        espacios_por_tipo = {}
        for tipo in tipos:
            espacios_por_tipo[tipo] = len(self.espacio_dao.get_by_tipo(self.db, tipo, limit=1000))
        
        # Estadísticas por sede
        espacios_por_sede = {}
        for espacio in all_espacios:
            sede = self.sede_dao.get_by_id(self.db, espacio.id_sede)
            if sede:
                if sede.nombre_sede not in espacios_por_sede:
                    espacios_por_sede[sede.nombre_sede] = 0
                espacios_por_sede[sede.nombre_sede] += 1
        
        # Estadísticas de equipamiento
        con_proyector = len(self.espacio_dao.get_with_projector(self.db, limit=1000))
        con_sonido = len(self.espacio_dao.get_with_sound(self.db, limit=1000))
        con_internet = len(self.espacio_dao.get_with_internet(self.db, limit=1000))
        con_aire = len(self.espacio_dao.get_with_air_conditioning(self.db, limit=1000))
        
        return {
            "total_espacios": len(all_espacios),
            "por_tipo": espacios_por_tipo,
            "por_sede": espacios_por_sede,
            "equipamiento": {
                "con_proyector": con_proyector,
                "con_sonido": con_sonido,
                "con_internet": con_internet,
                "con_aire_acondicionado": con_aire
            },
            "capacidad_promedio": sum(e.capacidad for e in all_espacios) / len(all_espacios) if all_espacios else 0
        }