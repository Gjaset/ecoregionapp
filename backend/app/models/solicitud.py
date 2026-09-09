from datetime import datetime, timezone
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.usuario import Usuario


class Solicitud(Base):
    """Copia de cada documento exportado por un usuario (trazabilidad para admin)."""

    __tablename__ = "solicitudes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), nullable=False, index=True)
    tipo: Mapped[str] = mapped_column(String(30), nullable=False, default="fun")
    nombre_archivo: Mapped[str] = mapped_column(String(255), nullable=False)
    ruta_archivo: Mapped[str] = mapped_column(String(512), nullable=False)
    tamano_bytes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    resumen: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    creado_en: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        index=True,
    )

    usuario: Mapped["Usuario"] = relationship()
