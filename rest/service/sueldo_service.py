from sqlalchemy.orm import Session
from ..dao.sueldo_dao import SueldoDAO
from ..dao.usuario_dao import UsuarioDAO
from ..schemas.sueldo_schema import Sueldo as SueldoSchema
from typing import List, Optional
from decimal import Decimal
from datetime import datetime, date
from fastapi import HTTPException, status

class SueldoService:
    
    def __init__(self, db: Session):
        self.db = db
        self.sueldo_dao = SueldoDAO()
        self.usuario_dao = UsuarioDAO()
    
    def create_sueldo(self, sueldo: SueldoSchema, created_by: str) -> dict:
        """Crear un nuevo registro de sueldo con validaciones"""
        # Verificar que el usuario existe
        usuario = self.usuario_dao.get_by_id(self.db, sueldo.id_usuario)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No se encontró el usuario con ID {sueldo.id_usuario}"
            )
        
        # Verificar que no exista un sueldo para ese usuario y período
        if self.sueldo_dao.exists_by_usuario_and_periodo(
            self.db, sueldo.id_usuario, sueldo.periodo_mes, sueldo.periodo_anio
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un sueldo para {usuario.nombre} {usuario.apellido} en {sueldo.periodo_mes}/{sueldo.periodo_anio}"
            )
        
        # Calcular sueldo neto si no se proporciona
        if not sueldo.sueldo_neto:
            sueldo.sueldo_neto = sueldo.sueldo_basico + (sueldo.bonificaciones or Decimal('0')) - (sueldo.descuentos or Decimal('0'))
        
        # Asignar created_by
        sueldo.created_by = created_by
        
        # Crear el sueldo
        new_sueldo = self.sueldo_dao.create(self.db, sueldo)
        
        return {
            "message": "Sueldo registrado exitosamente",
            "sueldo": new_sueldo,
            "usuario": f"{usuario.nombre} {usuario.apellido}",
            "periodo": f"{sueldo.periodo_mes}/{sueldo.periodo_anio}",
            "created_by": created_by
        }
    
    def get_sueldo_by_id(self, id_sueldo: int, include_usuario: bool = False) -> dict:
        """Obtener sueldo por ID con opción de incluir información del usuario"""
        if include_usuario:
            sueldo_with_usuario = self.sueldo_dao.get_with_usuario_info(self.db, id_sueldo)
            if not sueldo_with_usuario:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"No se encontró el sueldo con ID {id_sueldo}"
                )
            return sueldo_with_usuario
        else:
            sueldo = self.sueldo_dao.get_by_id(self.db, id_sueldo)
            if not sueldo:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"No se encontró el sueldo con ID {id_sueldo}"
                )
            return {"sueldo": sueldo}
    
    def get_all_sueldos(self, skip: int = 0, limit: int = 100) -> dict:
        """Obtener todos los sueldos activos"""
        sueldos = self.sueldo_dao.get_all(self.db, skip, limit)
        
        return {
            "sueldos": sueldos,
            "total": len(sueldos),
            "skip": skip,
            "limit": limit
        }
    
    def get_sueldos_by_usuario(self, id_usuario: int, skip: int = 0, limit: int = 100) -> dict:
        """Obtener sueldos por usuario"""
        # Verificar que el usuario existe
        usuario = self.usuario_dao.get_by_id(self.db, id_usuario)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el usuario con ID {id_usuario}"
            )
        
        sueldos = self.sueldo_dao.get_by_usuario(self.db, id_usuario, skip, limit)
        
        return {
            "sueldos": sueldos,
            "usuario": f"{usuario.nombre} {usuario.apellido}",
            "legajo": usuario.legajo,
            "total": len(sueldos),
            "skip": skip,
            "limit": limit
        }
    
    def get_sueldos_by_periodo(self, mes: int, anio: int, skip: int = 0, limit: int = 100) -> dict:
        """Obtener sueldos por período"""
        # Validar mes
        if mes < 1 or mes > 12:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El mes debe estar entre 1 y 12"
            )
        
        sueldos = self.sueldo_dao.get_by_periodo(self.db, mes, anio, skip, limit)
        
        # Calcular total del período
        total_periodo = self.sueldo_dao.calculate_total_by_periodo(self.db, mes, anio)
        
        return {
            "sueldos": sueldos,
            "periodo": f"{mes}/{anio}",
            "total_registros": len(sueldos),
            "total_pagado": total_periodo,
            "skip": skip,
            "limit": limit
        }
    
    def get_sueldos_pendientes(self, skip: int = 0, limit: int = 100) -> dict:
        """Obtener sueldos pendientes de pago"""
        sueldos_pendientes = self.sueldo_dao.get_pendientes_pago(self.db, skip, limit)
        
        # Calcular total pendiente
        total_pendiente = sum(s.sueldo_neto for s in sueldos_pendientes)
        
        return {
            "sueldos_pendientes": sueldos_pendientes,
            "total_pendientes": len(sueldos_pendientes),
            "monto_total_pendiente": total_pendiente,
            "skip": skip,
            "limit": limit
        }
    
    def update_sueldo(self, id_sueldo: int, sueldo_update: SueldoSchema, updated_by: str) -> dict:
        """Actualizar sueldo existente"""
        # Verificar que el sueldo existe
        existing_sueldo = self.sueldo_dao.get_by_id(self.db, id_sueldo)
        if not existing_sueldo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el sueldo con ID {id_sueldo}"
            )
        
        # Verificar usuario si se está cambiando
        if sueldo_update.id_usuario and sueldo_update.id_usuario != existing_sueldo.id_usuario:
            usuario = self.usuario_dao.get_by_id(self.db, sueldo_update.id_usuario)
            if not usuario:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"No se encontró el usuario con ID {sueldo_update.id_usuario}"
                )
        
        # Verificar duplicado si se cambia período
        if ((sueldo_update.periodo_mes and sueldo_update.periodo_mes != existing_sueldo.periodo_mes) or
            (sueldo_update.periodo_anio and sueldo_update.periodo_anio != existing_sueldo.periodo_anio)):
            
            usuario_id = sueldo_update.id_usuario or existing_sueldo.id_usuario
            mes = sueldo_update.periodo_mes or existing_sueldo.periodo_mes
            anio = sueldo_update.periodo_anio or existing_sueldo.periodo_anio
            
            if self.sueldo_dao.exists_by_usuario_and_periodo(self.db, usuario_id, mes, anio):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Ya existe un sueldo para ese usuario en {mes}/{anio}"
                )
        
        # Recalcular sueldo neto si es necesario
        if (sueldo_update.sueldo_basico is not None or 
            sueldo_update.descuentos is not None or 
            sueldo_update.bonificaciones is not None):
            
            basico = sueldo_update.sueldo_basico or existing_sueldo.sueldo_basico
            descuentos = sueldo_update.descuentos or existing_sueldo.descuentos or Decimal('0')
            bonificaciones = sueldo_update.bonificaciones or existing_sueldo.bonificaciones or Decimal('0')
            
            sueldo_update.sueldo_neto = basico + bonificaciones - descuentos
        
        # Asignar updated_by
        sueldo_update.updated_by = updated_by
        
        # Actualizar
        updated_sueldo = self.sueldo_dao.update(self.db, id_sueldo, sueldo_update)
        
        return {
            "message": "Sueldo actualizado exitosamente",
            "sueldo": updated_sueldo,
            "updated_by": updated_by
        }
    
    def marcar_como_pagado(self, id_sueldo: int, fecha_pago: date, updated_by: str) -> dict:
        """Marcar un sueldo como pagado"""
        sueldo = self.sueldo_dao.get_by_id(self.db, id_sueldo)
        if not sueldo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el sueldo con ID {id_sueldo}"
            )
        
        if sueldo.fecha_pago:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Este sueldo ya está marcado como pagado"
            )
        
        # Marcar como pagado
        updated_sueldo = self.sueldo_dao.marcar_como_pagado(self.db, id_sueldo, fecha_pago, updated_by)
        
        return {
            "message": "Sueldo marcado como pagado exitosamente",
            "sueldo": updated_sueldo,
            "fecha_pago": fecha_pago,
            "updated_by": updated_by
        }
    
    def delete_sueldo(self, id_sueldo: int, deleted_by: str) -> dict:
        """Eliminar sueldo lógicamente"""
        sueldo = self.sueldo_dao.get_by_id(self.db, id_sueldo)
        if not sueldo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el sueldo con ID {id_sueldo}"
            )
        
        # Eliminar lógicamente
        success = self.sueldo_dao.soft_delete(self.db, id_sueldo, deleted_by)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al eliminar el sueldo"
            )
        
        return {
            "message": f"Sueldo del período {sueldo.periodo_mes}/{sueldo.periodo_anio} eliminado exitosamente",
            "deleted_by": deleted_by
        }
    
    def get_resumen_anual(self, anio: int, id_usuario: Optional[int] = None) -> dict:
        """Obtener resumen anual de sueldos"""
        if id_usuario:
            # Resumen para un usuario específico
            usuario = self.usuario_dao.get_by_id(self.db, id_usuario)
            if not usuario:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"No se encontró el usuario con ID {id_usuario}"
                )
            
            total_anual = self.sueldo_dao.calculate_total_by_usuario_anio(self.db, id_usuario, anio)
            sueldos_usuario = self.sueldo_dao.get_by_usuario(self.db, id_usuario, limit=1000)
            sueldos_del_anio = [s for s in sueldos_usuario if s.periodo_anio == anio]
            
            return {
                "anio": anio,
                "usuario": f"{usuario.nombre} {usuario.apellido}",
                "legajo": usuario.legajo,
                "total_anual": total_anual,
                "meses_pagados": len(sueldos_del_anio),
                "detalle_por_mes": [
                    {
                        "mes": s.periodo_mes,
                        "sueldo_neto": s.sueldo_neto,
                        "pagado": s.fecha_pago is not None
                    }
                    for s in sorted(sueldos_del_anio, key=lambda x: x.periodo_mes)
                ]
            }
        else:
            # Resumen general del año
            estadisticas = self.sueldo_dao.get_estadisticas_por_anio(self.db, anio)
            return estadisticas
    
    def get_sueldos_statistics(self) -> dict:
        """Obtener estadísticas generales de sueldos"""
        all_sueldos = self.sueldo_dao.get_all(self.db, skip=0, limit=10000)
        
        if not all_sueldos:
            return {"message": "No hay registros de sueldos"}
        
        # Estadísticas generales
        total_registros = len(all_sueldos)
        total_pagado = sum(s.sueldo_neto for s in all_sueldos)
        promedio_sueldo = total_pagado / total_registros
        
        # Sueldo máximo y mínimo
        sueldo_max = max(s.sueldo_neto for s in all_sueldos)
        sueldo_min = min(s.sueldo_neto for s in all_sueldos)
        
        # Estadísticas por año
        anios = list(set(s.periodo_anio for s in all_sueldos))
        estadisticas_por_anio = {}
        for anio in sorted(anios):
            estadisticas_por_anio[anio] = self.sueldo_dao.get_estadisticas_por_anio(self.db, anio)
        
        return {
            "resumen_general": {
                "total_registros": total_registros,
                "total_pagado": total_pagado,
                "promedio_sueldo": promedio_sueldo,
                "sueldo_maximo": sueldo_max,
                "sueldo_minimo": sueldo_min
            },
            "por_anio": estadisticas_por_anio,
            "anios_con_registros": sorted(anios)
        }