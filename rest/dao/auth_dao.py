from sqlalchemy.orm import Session
from ..models.usuario_model import Usuario
from typing import Optional

class AuthDAO:
    """
    DAO específico para operaciones de autenticación
    """
    
    @staticmethod
    def get_user_by_email_for_auth(db: Session, email: str) -> Optional[Usuario]:
        """
        Obtener usuario por email para autenticación
        Incluye verificación de status activo
        """
        return db.query(Usuario).filter(
            Usuario.email == email,
            Usuario.status == True
        ).first()
    
    @staticmethod
    def verify_user_exists_and_active(db: Session, email: str) -> bool:
        """
        Verificar que un usuario existe y está activo
        """
        user = db.query(Usuario).filter(
            Usuario.email == email,
            Usuario.status == True
        ).first()
        return user is not None
    
    @staticmethod
    def get_user_basic_info(db: Session, email: str) -> Optional[dict]:
        """
        Obtener información básica del usuario para autenticación
        """
        user = db.query(Usuario).filter(
            Usuario.email == email,
            Usuario.status == True
        ).first()
        
        if not user:
            return None
        
        return {
            "id_usuario": user.id_usuario,
            "legajo": user.legajo,
            "nombre": user.nombre,
            "apellido": user.apellido,
            "email": user.email,
            "password": user.password,
            "status": user.status
        }