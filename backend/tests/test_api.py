from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


BASE_FORM = {
    "titular": {
        "nombre": "ECO REGIÓN SAS BIC",
        "nit": "900000000-1",
        "representante_legal": "Persona Responsable",
        "direccion": "Bogotá",
    },
    "predio": {
        "nombre": "Predio Demo",
        "municipio": "Bogotá D.C.",
        "vereda": "Vereda Demo",
        "latitud": "4.6639",
        "longitud": "-74.0721",
    },
    "aprovechamiento": {
        "tipo": "leña para consumo propio",
        "justificacion": "Consumo propio",
        "volumen_total": 1.5,
        "unidad": "m3",
    },
    "especies": [{"nombre": "pino", "cantidad": 2, "diametro_cm": 20}],
}


def test_normalizar_endpoint_devuelve_checklist():
    response = client.post("/api/formulario/normalizar", json=BASE_FORM)

    assert response.status_code == 200
    resultado = response.json()
    assert resultado["autoridad"]["sigla"] == "SDA"
    assert resultado["requisitos"]["anexos"]
    assert resultado["listo_para_generar"] is True


def test_normalizar_endpoint_bloquea_coordenada_fuera_de_colombia():
    formulario = {
        **BASE_FORM,
        "predio": {**BASE_FORM["predio"], "latitud": "40.7128"},
    }

    response = client.post("/api/formulario/normalizar", json=formulario)

    assert response.status_code == 200
    assert response.json()["listo_para_generar"] is False


def test_normalizar_endpoint_permite_confirmacion_explicita():
    formulario = {
        **BASE_FORM,
        "predio": {**BASE_FORM["predio"], "latitud": "40.7128"},
        "confirmar_revision": True,
    }

    response = client.post("/api/formulario/normalizar", json=formulario)

    assert response.status_code == 200
    resultado = response.json()
    assert resultado["requiere_revision"] is True
    assert resultado["revision_confirmada"] is True
    assert resultado["listo_para_generar"] is True
