import os
from pathlib import Path
from pydantic_settings import BaseSettings

# Root directory of the backend
BACKEND_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    APP_NAME: str = "CCTV Forensic Platform Core"
    VERSION: str = "3.0.0"
    API_PREFIX: str = "/api"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "cctv_forensic_jwt_secret_key_2026_secure_hash_seed")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Database Configuration (PostgreSQL with SQLite fallback)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{BACKEND_DIR / 'forensic_vault.db'}"
    )
    
    # Storage paths
    STORAGE_DIR: Path = BACKEND_DIR / "storage"
    EVIDENCE_DIR: Path = BACKEND_DIR / "storage" / "evidence"
    THUMBNAIL_DIR: Path = BACKEND_DIR / "storage" / "thumbnails"
    REPORT_DIR: Path = BACKEND_DIR / "storage" / "reports"
    
    # AI Integration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

# Ensure storage directories exist
settings.STORAGE_DIR.mkdir(parents=True, exist_ok=True)
settings.EVIDENCE_DIR.mkdir(parents=True, exist_ok=True)
settings.THUMBNAIL_DIR.mkdir(parents=True, exist_ok=True)
settings.REPORT_DIR.mkdir(parents=True, exist_ok=True)
