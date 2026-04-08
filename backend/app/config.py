import os
from urllib.parse import urlparse

from pydantic import Field
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = Field(..., min_length=1)
    GCS_BUCKET_NAME: str = "job-tracker-resumes"
    GOOGLE_APPLICATION_CREDENTIALS: str = ""
    CORS_ORIGINS: str = "http://localhost:5173"

    @property
    def database_target(self) -> str:
        parsed = urlparse(self.DATABASE_URL)
        return (
            f"{parsed.scheme}://{parsed.username or ''}@"
            f"{parsed.hostname or 'unknown'}:{parsed.port or 'default'}"
            f"{parsed.path or ''}"
        )

    class Config:
        env_file = os.path.join(os.path.dirname(__file__), "..", ".env")
        extra = "allow"

settings = Settings()
