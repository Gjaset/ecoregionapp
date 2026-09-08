import io
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.core.normalizacion import municipios, especies, coordenadas, tipo_aprovechamiento
from app.core.reglas import car_selector
from app.core.reglas import requisitos
from app.core.generacion import documento_word
from app.schemas.formulario import FormularioCompleto

router = APIRouter(prefix="/formulario", tags=["Formulario"])

@router.post("/normalizar")
async def normalizar(datos: FormularioCompleto):
    muni = municipios.normalizar_municipio(datos.predio.municipio)
    lat = coordenadas.normalizar_coordenada(datos.predio.latitud)
    lng = coordenadas.normalizar_coordenada(datos.predio.longitud)
    tipo = tipo_aprovechamiento.clasificar_tipo(datos.aprovechamiento.tipo)
    auth = car_selector.seleccionar_autoridad(muni.get("codigo_dane", ""))
    checklist = requisitos.obtener_requisitos(auth.get("sigla", ""))
    esps = [
        {**e.model_dump(), "normalizacion": especies.normalizar_especie(e.nombre, datos.predio.municipio)}
        for e in datos.especies
    ]
    especies_requieren_revision = any(
        especie.get("normalizacion", {}).get("requiere_revision")
        or especie.get("normalizacion", {}).get("error")
        for especie in esps
    )
    requiere_revision = any([
        muni.get("requiere_confirmacion"),
        lat.get("error"),
        not lat.get("en_colombia", False),
        lng.get("error"),
        not lng.get("en_colombia", False),
        tipo.get("error"),
        auth.get("error"),
        checklist.get("error"),
        especies_requieren_revision,
    ])
    listo = not requiere_revision or datos.confirmar_revision
    return {"municipio": muni, "latitud": lat, "longitud": lng,
            "tipo_aprovechamiento": tipo, "autoridad": auth,
            "requisitos": checklist,
            "especies": esps, "listo_para_generar": listo,
            "requiere_revision": requiere_revision,
            "revision_confirmada": datos.confirmar_revision}

@router.post("/generar-documento")
async def generar_documento(datos: FormularioCompleto):
    norm = await normalizar(datos)
    if not norm["listo_para_generar"]:
        raise HTTPException(422, "Hay campos pendientes de confirmación.")
    doc_bytes = documento_word.generar_documento({
        **norm,
        "titular": datos.titular.model_dump(),
        "predio": datos.predio.model_dump(),
        "aprovechamiento": datos.aprovechamiento.model_dump(),
    })
    return StreamingResponse(
        io.BytesIO(doc_bytes),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": "attachment; filename=aprovechamiento_forestal.docx"},
    )