import os
import shutil
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.database import get_db
from app.models import Job
from app.schemas import JobCreate, JobResponse, JobUpdate

router = APIRouter(prefix="/api/applications", tags=["applications"])

# Ensure absolute path for uploads
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# ── CREATE ────────────────────────────────────────────────────────────────────

@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_application(
    company_name: str = Form(...),
    job_title: str = Form(...),
    job_description: str = Form(None),
    job_url: str = Form(None),
    status: str = Form("Applied"),
    location: str = Form(None),
    notes: str = Form(None),
    resume: UploadFile = File(None),
    db: AsyncSession = Depends(get_db)
):
    resume_filename = None
    if resume and resume.filename:
        # Generate a truly unique filename
        resume_filename = f"{uuid.uuid4().hex[:8]}_{resume.filename}"
        file_path = os.path.join(UPLOAD_DIR, resume_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(resume.file, buffer)

    job = Job(
        company_name=company_name,
        job_title=job_title,
        job_description=job_description,
        job_url=job_url,
        status=status,
        location=location,
        notes=notes,
        resume_filename=resume_filename
    )
    
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job


# ── LIST (all) ────────────────────────────────────────────────────────────────

@router.get("", response_model=list[JobResponse])
async def list_applications(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Job).order_by(Job.applied_at.desc()))
    return result.scalars().all()


# ── GET (single) ──────────────────────────────────────────────────────────────

@router.get("/{id}", response_model=JobResponse)
async def get_application(id: UUID, db: AsyncSession = Depends(get_db)):
    job = await db.get(Job, id)
    if not job:
        raise HTTPException(status_code=404, detail="Application not found")
    return job


# ── UPDATE (full) ─────────────────────────────────────────────────────────────

@router.put("/{id}", response_model=JobResponse)
async def update_application(id: UUID, payload: JobUpdate, db: AsyncSession = Depends(get_db)):
    job = await db.get(Job, id)
    if not job:
        raise HTTPException(status_code=404, detail="Application not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(job, field, value)

    await db.commit()
    await db.refresh(job)
    return job


# ── UPDATE STATUS (patch) ─────────────────────────────────────────────────────

@router.patch("/{id}/status", response_model=JobResponse)
async def update_status(id: UUID, payload: JobUpdate, db: AsyncSession = Depends(get_db)):
    job = await db.get(Job, id)
    if not job:
        raise HTTPException(status_code=404, detail="Application not found")

    if payload.status is not None:
        job.status = payload.status

    await db.commit()
    await db.refresh(job)
    return job


# ── DELETE ────────────────────────────────────────────────────────────────────

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_application(id: UUID, db: AsyncSession = Depends(get_db)):
    job = await db.get(Job, id)
    if not job:
        raise HTTPException(status_code=404, detail="Application not found")

    await db.delete(job)
    await db.commit()

from fastapi.responses import FileResponse

# ── RESUME DOWNLOAD ───────────────────────────────────────────────────────────

@router.get("/{id}/resume")
async def download_resume(id: UUID, db: AsyncSession = Depends(get_db)):
    job = await db.get(Job, id)
    if not job or not job.resume_filename:
        raise HTTPException(status_code=404, detail="Resume not found")

    file_path = os.path.join(UPLOAD_DIR, job.resume_filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found on server")

    return FileResponse(
        path=file_path,
        filename=job.resume_filename.split('_', 1)[-1], # Remove our prefix for the user
        media_type='application/pdf'
    )
