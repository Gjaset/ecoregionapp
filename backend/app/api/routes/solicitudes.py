import io
import re
import unicodedata
import zipfile
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.seguridad import get_current_user, require_admin
from app.core.solicitudes import leer_archivo
from app.database import get_db
from app.models.solicitud import Solicitud
from app.models.usuario import Usuario
from app.schemas.solicitudes import SolicitudRead

router = APIRouter(prefix="/solicitudes", tags=["Solicitudes"])


def _to_read(solicitud: Solicitud) -> SolicitudRead:
    usuario = solicitud.usuario
    return SolicitudRead(
        id=solicitud.id,
        usuario_id=solicitud.usuario_id,
        usuario_email=getattr(usuario, "email", "") or "",
        usuario_nombre=getattr(usuario, "nombre", "") or "",
        tipo=solicitud.tipo,
        nombre_archivo=solicitud.nombre_archivo,
        tamano_bytes=solicitud.tamano_bytes,
        creado_en=solicitud.creado_en,
    )


def _get_visible(solicitud_id: int, usuario: Usuario, db: Session) -> Solicitud:
    solicitud = db.get(Solicitud, solicitud_id)
    if solicitud is None:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada.")
    if usuario.rol != "admin" and solicitud.usuario_id != usuario.id:
        raise HTTPException(status_code=403, detail="No tienes acceso a esta solicitud.")
    return solicitud


@router.get("/mias", response_model=list[SolicitudRead])
def mis_solicitudes(
    usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)
):
    filas = db.scalars(
        select(Solicitud)
        .where(Solicitud.usuario_id == usuario.id)
        .order_by(Solicitud.creado_en.desc(), Solicitud.id.desc())
    )
    return [_to_read(s) for s in filas]


@router.get("", response_model=list[SolicitudRead])
def listar_solicitudes(
    usuario_id: int | None = None,
    db: Session = Depends(get_db),
    _admin: Usuario = Depends(require_admin),
):
    consulta = select(Solicitud).order_by(Solicitud.creado_en.desc(), Solicitud.id.desc())
    if usuario_id is not None:
        consulta = consulta.where(Solicitud.usuario_id == usuario_id)
    return [_to_read(s) for s in db.scalars(consulta)]


@router.get("/descargar-zip")
def descargar_zip(
    ids: str = Query(..., description="IDs separados por coma"),
    usuario: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        identificadores = sorted({int(parte) for parte in ids.split(",") if parte.strip()})
    except ValueError:
        raise HTTPException(status_code=422, detail="IDs inválidos.")
    if not identificadores:
        raise HTTPException(status_code=422, detail="Debes seleccionar al menos un documento.")
    if len(identificadores) > 50:
        raise HTTPException(status_code=422, detail="Máximo 50 documentos por descarga.")

    solicitudes = [_get_visible(i, usuario, db) for i in identificadores]
    marca = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M")
    duenos = {s.usuario_id for s in solicitudes}
    if len(duenos) == 1:
        base = solicitudes[0].usuario.nombre or solicitudes[0].usuario.email
        base = unicodedata.normalize("NFKD", base).encode("ascii", "ignore").decode()
        base = re.sub(r"[^A-Za-z0-9]+", "_", base).strip("_") or "usuario"
        nombre_zip = f"{base}_{marca}.zip"
    else:
        nombre_zip = f"solicitudes_{marca}.zip"

    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for solicitud in solicitudes:
            try:
                zf.writestr(solicitud.nombre_archivo, leer_archivo(solicitud))
            except FileNotFoundError:
                raise HTTPException(
                    status_code=410,
                    detail=f"Archivo no disponible: {solicitud.nombre_archivo}",
                ) from None
    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{nombre_zip}"'},
    )


@router.get("/{solicitud_id}/descargar")
def descargar_solicitud(
    solicitud_id: int,
    usuario: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    solicitud = _get_visible(solicitud_id, usuario, db)
    contenido = leer_archivo(solicitud)
    media = (
        "application/pdf"
        if solicitud.nombre_archivo.endswith(".pdf")
        else "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
    return StreamingResponse(
        io.BytesIO(contenido),
        media_type=media,
        headers={"Content-Disposition": f'attachment; filename="{solicitud.nombre_archivo}"'},
    )
