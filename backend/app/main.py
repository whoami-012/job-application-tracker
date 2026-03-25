from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import applications

app = FastAPI(title="Job Application Tracker", version="1.0.0")

# CORS — allow development access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(applications.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
