# EcoRegión App

Plataforma web para automatizar la gestión del permiso de **Aprovechamiento Forestal** de la empresa **ECO REGIÓN SAS BIC** (consultora ambiental colombiana).

## Descripción

EcoRegión App reemplaza el proceso manual (WhatsApp + correos + Word) con un formulario guiado, normalización automática de datos y generación del documento técnico Word listo para radicar ante la CAR o la SDA.

## Stack Técnico

| Capa | Tecnología |
|------|------------|
| Backend API | Python 3.12 + FastAPI + Uvicorn |
| ORM / DB | SQLAlchemy 2.0 + PostgreSQL 16 |
| Generación Word | `docxtpl` (Jinja2 sobre plantilla .docx) |
| Fuzzy matching | `rapidfuzz` (municipios y especies) |
| Clasificación ML | Anthropic Claude API (`claude-sonnet-4-6`) |
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Contenedores | Docker + Docker Compose |
| Migraciones | Alembic |
| Testing | Pytest + pytest-asyncio |

## Estructura del Proyecto

```
ecoregionapp/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── core/
│   │   │   ├── normalizacion/
│   │   │   │   ├── municipios.py
│   │   │   │   ├── especies.py
│   │   │   │   ├── coordenadas.py
│   │   │   │   └── tipo_aprovechamiento.py
│   │   │   ├── reglas/
│   │   │   │   ├── car_selector.py
│   │   │   │   └── requisitos.py
│   │   │   └── generacion/
│   │   │       ├── documento_word.py
│   │   │       └── checklist_anexos.py
│   │   ├── api/
│   │   │   └── routes/
│   │   │       └── formulario.py
│   │   ├── models/
│   │   │   └── tramite.py
│   │   └── schemas/
│   │       └── formulario.py
│   ├── data/
│   │   ├── municipios_dane.json
│   │   ├── especies_ideam.json
│   │   ├── car_por_municipio.json
│   │   └── requisitos_por_autoridad.json
│   ├── templates/
│   │   └── aprovechamiento_forestal.docx
│   ├── tests/
│   ├── alembic/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── hooks/
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
├── .env.example
└── README.md
```

## Instrucciones de Instalación

### Prerrequisitos

- Docker y Docker Compose
- Node.js 18+ y npm
- Python 3.12
- API key de Anthropic (para las funcionalidades de ML)

### Paso a Paso

1. Clonar el repositorio:
   ```bash
   git clone <repository-url>
   cd ecoregionapp
   ```

2. Configurar variables de entorno:
   ```bash
   cp backend/.env.example backend/.env
   # Editar backend/.env con tus valores reales
   ```

3. Construir y levantar los contenedores:
   ```bash
   docker-compose up --build
   ```

4. El backend estará disponible en: http://localhost:8000
5. El frontend estará disponible en: http://localhost:5173

## Desarrollo

### Backend

Para ejecutar el backend en modo desarrollo:
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend

Para ejecutar el frontend en modo desarrollo:
```bash
cd frontend
npm install
npm run dev
```

## Testing

Ejecutar los tests:
```bash
uv run pytest -q
```

La aplicación incluye el flujo MVP de normalización, confirmación manual,
checklist de anexos por autoridad y generación del documento Word. La plantilla
de desarrollo disponible es `backend/templates/aprovechamiento_forestal_fixed.docx`.

## API Endpoints

- `POST /api/formulario/normalizar` - Normaliza los datos del formulario
- `POST /api/formulario/generar-documento` - Genera el documento Word

## Licencia

Este proyecto está bajo licencia privada - ECO REGIÓN SAS BIC.