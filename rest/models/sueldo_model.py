from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, Numeric
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Sueldo(Base):
    __tablename__ = "sueldos"
    
    id_sueldo = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"), nullable=False)
    cbu = Column(String(22), nullable=False)  # CBU argentino tiene 22 dígitos
    id_rol = Column(Integer, ForeignKey("roles.id_rol", ondelete="SET NULL"), nullable=True)
    sueldo_fijo = Column(Numeric(15, 2), nullable=False)
    sueldo_adicional = Column(Numeric(15, 2), default=0, nullable=False)
    sueldo_total = Column(Numeric(15, 2), nullable=False)  # Se calcula automáticamente
    observaciones = Column(Text, nullable=True)
    activo = Column(Boolean, default=True, nullable=False)
    
    # Relaciones
    usuario = relationship("Usuario", back_populates="sueldos")
    rol = relationship("Rol", back_populates="sueldos")
    
    def __repr__(self):
        return f"<Sueldo(id_sueldo={self.id_sueldo}, id_usuario={self.id_usuario}, sueldo_total={self.sueldo_total})>"