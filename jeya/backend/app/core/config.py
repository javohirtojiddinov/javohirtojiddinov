from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://jeya:jeya_pass@localhost:5432/jeya_db"
    REDIS_URL: str = "redis://localhost:6379"

    # Auth
    SECRET_KEY: str = "changeme-in-production-very-long-secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # AI APIs
    ANTHROPIC_API_KEY: str = ""
    OPENAI_API_KEY: str = ""

    # Storage
    S3_ENDPOINT: str = "http://localhost:9000"
    S3_ACCESS_KEY: str = "minioadmin"
    S3_SECRET_KEY: str = "minioadmin"
    S3_BUCKET: str = "jeya-files"

    # Search
    SEARCH_API_KEY: str = ""
    SEARCH_ENGINE_ID: str = ""

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # Voice
    MOHIR_AI_API_KEY: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
