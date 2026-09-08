import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    # API Settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "EcoRegión App"

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://ecoregion:ecoregion_pass@localhost:5432/ecoregion_db")

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-only-change-me")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "11520"))  # 8 days

    # Anthropic API
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")

    # Paths
    DATA_PATH: str = os.getenv("DATA_PATH", "./data")
    TEMPLATES_PATH: str = os.getenv("TEMPLATES_PATH", "./templates")
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS", "http://localhost:5173"
        ).split(",")
        if origin.strip()
    ]

settings = Settings()