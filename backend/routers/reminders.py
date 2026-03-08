from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import List
from ..database import get_db
from ..schemas import JobApplicationResponse
from ..services.email_service import send_reminder_email
from .. import crud

router = APIRouter(prefix="/reminders", tags=["reminders"])


class SendReminderRequest(BaseModel):
    email: str


class SnoozeRequest(BaseModel):
    days: int = 7


@router.get("/", response_model=List[JobApplicationResponse])
def get_pending_reminders(db: Session = Depends(get_db)):
    """
    Get applications that need follow-up
    (status=Applied or Screening, applied_date > 7 days ago, reminder_sent=False)
    """
    cutoff_date = datetime.now() - timedelta(days=7)
    
    # Get all applications
    all_apps = crud.get_all_applications(db)
    
    # Filter for pending reminders
    pending = [
        app for app in all_apps
        if app.applied_date
        and app.applied_date < cutoff_date
        and not app.reminder_sent
        and app.status in ['Applied', 'Screening']
    ]
    
    return pending


@router.get("/upcoming", response_model=List[JobApplicationResponse])
def get_upcoming_followups(db: Session = Depends(get_db)):
    """
    Get applications with follow_up_date in next 7 days
    """
    today = datetime.now().date()
    next_week = today + timedelta(days=7)
    
    # Get all applications
    all_apps = crud.get_all_applications(db)
    
    # Filter for upcoming follow-ups
    upcoming = [
        app for app in all_apps
        if app.follow_up_date
        and today <= app.follow_up_date.date() <= next_week
    ]
    
    # Sort by follow_up_date
    upcoming.sort(key=lambda x: x.follow_up_date)
    
    return upcoming


@router.post("/send/{application_id}")
def send_reminder(
    application_id: int,
    request: SendReminderRequest,
    db: Session = Depends(get_db)
):
    """
    Manually send a reminder email for an application
    """
    # Get application
    job = crud.get_application_by_id(db, application_id)
    if not job:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Calculate days since applied
    if job.applied_date:
        days_ago = (datetime.now() - job.applied_date).days
    else:
        days_ago = 0
    
    # Send email
    success = send_reminder_email(
        to_email=request.email,
        company=job.company,
        job_title=job.job_title,
        days_ago=days_ago
    )
    
    if not success:
        raise HTTPException(
            status_code=500,
            detail="Failed to send email. Check your email configuration."
        )
    
    # Update reminder_sent flag
    crud.update_application(db, application_id, {"reminder_sent": True})
    
    return {
        "message": f"Reminder email sent to {request.email}",
        "success": True
    }


@router.put("/snooze/{application_id}")
def snooze_reminder(
    application_id: int,
    request: SnoozeRequest,
    db: Session = Depends(get_db)
):
    """
    Snooze a reminder by updating follow_up_date
    """
    job = crud.get_application_by_id(db, application_id)
    if not job:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Set follow_up_date to X days from now
    new_date = datetime.now() + timedelta(days=request.days)
    
    crud.update_application(
        db,
        application_id,
        {"follow_up_date": new_date, "reminder_sent": False}
    )
    
    return {
        "message": f"Reminder snoozed for {request.days} days",
        "follow_up_date": new_date
    }


@router.put("/mark-updated/{application_id}")
def mark_as_updated(application_id: int, db: Session = Depends(get_db)):
    """
    Mark an application as updated (sets reminder_sent=True)
    """
    job = crud.get_application_by_id(db, application_id)
    if not job:
        raise HTTPException(status_code=404, detail="Application not found")
    
    crud.update_application(db, application_id, {"reminder_sent": True})
    
    return {"message": "Application marked as updated"}
