from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.database import get_db
from app.models import Job
from app.schemas import JobCreate, JobResponse, JobUpdate

router = APIRouter(prefix="/api/applications", tags=["applications"])


# ── CREATE ────────────────────────────────────────────────────────────────────

@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_application(payload: JobCreate, db: AsyncSession = Depends(get_db)):
    job = Job(**payload.model_dump())
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job


# ── LIST (all) ────────────────────────────────────────────────────────────────

@router.get("/", response_model=list[JobResponse])
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
