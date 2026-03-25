from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
from uuid import UUID

# Valid status values based on the application workflow
JobStatus = Literal[
    "Applied",
    "Under Review",
    "Interview Scheduled",
    "Interviewed",
    "Offer Received",
    "Accepted",
    "Rejected",
    "Withdrawn",
]

class JobCreate(BaseModel):
    company_name: str
    job_title: str
    job_description: Optional[str] = None
    job_url: Optional[str] = None
    status: JobStatus = "Applied"
    location: Optional[str] = None
    notes: Optional[str] = None
    resume_filename: Optional[str] = None

class JobResponse(BaseModel):
    id: UUID
    company_name: str
    job_title: str
    job_description: Optional[str]
    job_url: Optional[str]
    status: str
    location: Optional[str]
    notes: Optional[str]
    resume_filename: Optional[str]
    applied_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class JobUpdate(BaseModel):
    company_name: Optional[str] = None
    job_title: Optional[str] = None
    job_description: Optional[str] = None
    job_url: Optional[str] = None
    status: Optional[JobStatus] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    resume_filename: Optional[str] = None
