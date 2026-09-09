import io

from fastapi.testclient import TestClient
from pypdf import PdfReader

from app.main import app


client = TestClient(app)


def _token(email="fun@example.com"):
    client.post(
        "/api/auth/register",
        json={"email": email, "nombre": "Fun", "password": "clave-segura-123"},
    )
    login = client.post(
        "/api/auth/login", data={"username": email, "password": "clave-segura-123"}
    )
    return login.json()["access_token"]


def _auth(email="fun@example.com"):
    return {"Authorization": f"Bearer {_token(email)}"}


def test_exportar_fun_pdf_devuelve_plantilla_rellena():
    response = client.post(
        "/api/formulario/fun/exportar-pdf",
        json={
            "tipoSolicitud": "nueva",
            "tipoPersona": "juridicaPrivada",
            "nombreRazonSocial": "ECO REGIÓN SAS BIC",
            "tipoIdentificacion": "NIT",
            "numeroIdentificacion": "900123456-7",
            "especies": [
                {
                    "cantidad": "44,7",
                    "unidadMedida": "Metros cúbicos",
                    "nombreComun": "Eucalipto",
                    "nombreCientifico": "Eucalyptus Globulus",
                }
            ],
        },
        headers=_auth(),
    )

    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    doc = PdfReader(io.BytesIO(response.content))
    assert len(doc.pages) == 10


def test_exportar_fun_pdf_acepta_borrador_vacio():
    response = client.post("/api/formulario/fun/exportar-pdf", json={}, headers=_auth("vacio@example.com"))

    assert response.status_code == 200
    doc = PdfReader(io.BytesIO(response.content))
    assert len(doc.pages) == 10


def test_exportar_fun_pdf_exige_login():
    assert client.post("/api/formulario/fun/exportar-pdf", json={}).status_code == 401
