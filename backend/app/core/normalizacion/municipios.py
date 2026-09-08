import json
import unicodedata
import re
from pathlib import Path
from rapidfuzz import process, fuzz

DATA_PATH = Path(__file__).parent.parent.parent.parent / "data"

def _normalize_text(text: str) -> str:
    """
    Normalize text for better matching:
    - Convert to lowercase
    - Remove accents/diacritics
    - Remove extra punctuation and special characters
    - Normalize whitespace
    """
    if not text:
        return ""

    # Convert to lowercase
    text = text.lower()

    # Normalize unicode characters (decompose accented characters)
    text = unicodedata.normalize('NFD', text)
    # Remove combining characters (accents)
    text = ''.join(c for c in text if not unicodedata.combining(c))

    # Remove punctuation and special characters, keep only letters, numbers, and spaces
    text = re.sub(r'[^a-z0-9\s]', ' ', text)

    # Normalize whitespace (multiple spaces to single space)
    text = re.sub(r'\s+', ' ', text).strip()

    return text

# Load DANE municipalities data
try:
    with open(DATA_PATH / "municipios_dane.json", encoding="utf-8") as f:
        MUNICIPIOS_DANE = json.load(f)
except FileNotFoundError:
    # Create placeholder data if file doesn't exist
    MUNICIPIOS_DANE = [
        {"nombre": "Bogotá D.C.", "codigo": "11001", "departamento": "Cundinamarca"},
        {"nombre": "Duitama", "codigo": "15244", "departamento": "Boyacá"},
        {"nombre": "Medellín", "codigo": "05001", "departamento": "Antioquia"},
        {"nombre": "Cali", "codigo": "76001", "departamento": "Valle del Cauca"},
        {"nombre": "Barranquilla", "codigo": "08001", "departamento": "Atlántico"},
        {"nombre": "Cartagena", "codigo": "13001", "departamento": "Bolívar"},
        {"nombre": "Cúcuta", "codigo": "54001", "departamento": "Norte de Santander"},
        {"nombre": "Soledad", "codigo": "08074", "departamento": "Atlántico"},
        {"nombre": "Ibagué", "codigo": "73001", "departamento": "Tolima"},
        {"nombre": "Villavicencio", "codigo": "50001", "departamento": "Meta"},
        {"nombre": "Santa Marta", "codigo": "47001", "departamento": "Magdalena"},
        {"nombre": "Valledupar", "codigo": "20001", "departamento": "Cesar"},
        {"nombre": "Montería", "codigo": "23001", "departamento": "Córdoba"},
        {"nombre": "Manizales", "codigo": "17001", "departamento": "Caldas"},
        {"nombre": "Pereira", "codigo": "66001", "departamento": "Risaralda"},
        {"nombre": "Popayán", "codigo": "19001", "departamento": "Cauca"},
        {"nombre": "Neiva", "codigo": "41001", "departamento": "Huila"},
        {"nombre": "Santafe de Antioquia", "codigo": "05387", "departamento": "Antioquia"},
        {"nombre": "Girardot", "codigo": "25239", "departamento": "Cundinamarca"},
        {"nombre": "Facatativá", "codigo": "25269", "departamento": "Cundinamarca"}
    ]
    # Save placeholder data
    DATA_PATH.mkdir(exist_ok=True)
    with open(DATA_PATH / "municipios_dane.json", "w", encoding="utf-8") as f:
        json.dump(MUNICIPIOS_DANE, f, indent=2, ensure_ascii=False)

# Create normalized versions for matching
NOMBRES_NORMALIZADOS = [_normalize_text(m["nombre"]) for m in MUNICIPIOS_DANE]
MUNI_MAP = {m["nombre"]: m for m in MUNICIPIOS_DANE}
UMBRAL = 85

def normalizar_municipio(entrada: str) -> dict:
    entrada_limpia = entrada.strip()
    entrada_normalizada = _normalize_text(entrada_limpia)

    matched_normalized, score, indice = process.extractOne(
        entrada_normalizada,
        NOMBRES_NORMALIZADOS,
        scorer=fuzz.WRatio
    )

    muni = MUNICIPIOS_DANE[indice]
    nombre_original_entrada = entrada_limpia

    return {
        "nombre_oficial":        muni["nombre"],
        "codigo_dane":           muni["codigo"],
        "departamento":          muni["departamento"],
        "confianza":             round(score, 2),
        "requiere_confirmacion": score < UMBRAL,
        "entrada_original":      nombre_original_entrada,
    }