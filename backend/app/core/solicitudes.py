"""Persistencia de copias de documentos exportados (trazabilidad por usuario)."""

import re
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy.orm import Session

from app.config import settings
from app.models.solicitud import Solicitud


def _slug(texto: str, max_len: int = 60) -> str:
    texto = unicodedata.normalize("NFKD", texto or "").encode("ascii", "ignore").decode()
    texto = re.sub(r"[^A-Za-z0-9]+", "_", texto).strip("_")
    return (texto or "documento")[:max_len]


def guardar_solicitud(
    db: Session,
    *,
    usuario_id: int,
    tipo: str,
    contenido: bytes,
    nombre_base: str,
    extension: str,
    resumen: dict | None = None,
) -> Solicitud:
    carpeta = Path(settings.GENERATED_PATH)
    carpeta.mkdir(parents=True, exist_ok=True)
    marca = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    nombre_archivo = f"{tipo}_{usuario_id}_{marca}_{_slug(nombre_base)}{extension}"
    ruta = carpeta / nombre_archivo
    ruta.write_bytes(contenido)
    solicitud = Solicitud(
        usuario_id=usuario_id,
        tipo=tipo,
        nombre_archivo=nombre_archivo,
        ruta_archivo=str(ruta),
        tamano_bytes=len(contenido),
        resumen=resumen or {},
    )
    db.add(solicitud)
    db.commit()
    db.refresh(solicitud)
    return solicitud


def leer_archivo(solicitud: Solicitud) -> bytes:
    return Path(solicitud.ruta_archivo).read_bytes()
