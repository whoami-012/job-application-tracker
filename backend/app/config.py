import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/jobappdb"
    GCS_BUCKET_NAME: str = "job-tracker-resumes"
    GOOGLE_APPLICATION_CREDENTIALS: str = ""
    CORS_ORIGINS: str = "http://localhost:5173"

    class Config:
        env_file = os.path.join(os.path.dirname(__file__), "..", ".env")
        extra = "allow"

settings = Settings()