from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SolicitudRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    usuario_id: int
    usuario_email: str = ""
    usuario_nombre: str = ""
    tipo: str
    nombre_archivo: str
    tamano_bytes: int
    creado_en: datetime
