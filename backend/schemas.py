from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class JobApplicationCreate(BaseModel):
    company: str
    job_title: str
    job_url: Optional[str] = None
    job_description: Optional[str] = None
    status: Optional[str] = "Applied"
    applied_date: Optional[datetime] = None
    salary_range: Optional[str] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    resume_version: Optional[str] = None
    follow_up_date: Optional[datetime] = None

class JobApplicationUpdate(BaseModel):
    company: Optional[str] = None
    job_title: Optional[str] = None
    job_url: Optional[str] = None
    job_description: Optional[str] = None
    status: Optional[str] = None
    applied_date: Optional[datetime] = None
    salary_range: Optional[str] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    resume_version: Optional[str] = None
    follow_up_date: Optional[datetime] = None

class JobApplicationResponse(BaseModel):
    id: int
    company: str
    job_title: str
    job_url: Optional[str]
    job_description: Optional[str]
    status: str
    applied_date: Optional[datetime]
    salary_range: Optional[str]
    location: Optional[str]
    notes: Optional[str]
    resume_version: Optional[str]
    ai_tips: Optional[str]
    reminder_sent: bool
    follow_up_date: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]
    
    model_config = ConfigDict(from_attributes=True)

class StatsResponse(BaseModel):
    total: int
    applied: int
    screening: int
    interview: int
    offer: int
    rejected: int
    ghosted: int
