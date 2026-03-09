from sqlalchemy.orm import Session
from datetime import datetime
from models import JobApplication, ApplicationNote
from schemas import JobApplicationCreate, JobApplicationUpdate, NoteCreate

def create_application(db: Session, application: JobApplicationCreate):
    db_application = JobApplication(**application.model_dump())
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

def get_all_applications(db: Session, skip: int = 0, limit: int = 100, status: str = None, search: str = None):
    query = db.query(JobApplication)
    
    if status:
        query = query.filter(JobApplication.status == status)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (JobApplication.company.ilike(search_filter)) | 
            (JobApplication.job_title.ilike(search_filter))
        )
    
    return query.offset(skip).limit(limit).all()

def get_application_by_id(db: Session, id: int):
    return db.query(JobApplication).filter(JobApplication.id == id).first()

def update_application(db: Session, id: int, application: JobApplicationUpdate):
    db_application = get_application_by_id(db, id)
    if not db_application:
        return None
    
    update_data = application.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_application, key, value)
    
    db_application.updated_at = datetime.now()
    db.commit()
    db.refresh(db_application)
    return db_application

def delete_application(db: Session, id: int):
    db_application = get_application_by_id(db, id)
    if not db_application:
        return None
    
    db.delete(db_application)
    db.commit()
    return db_application

def get_stats(db: Session):
    total = db.query(JobApplication).count()
    applied = db.query(JobApplication).filter(JobApplication.status == "Applied").count()
    screening = db.query(JobApplication).filter(JobApplication.status == "Screening").count()
    interview = db.query(JobApplication).filter(JobApplication.status == "Interview").count()
    offer = db.query(JobApplication).filter(JobApplication.status == "Offer").count()
    rejected = db.query(JobApplication).filter(JobApplication.status == "Rejected").count()
    ghosted = db.query(JobApplication).filter(JobApplication.status == "Ghosted").count()
    
    return {
        "total": total,
        "applied": applied,
        "screening": screening,
        "interview": interview,
        "offer": offer,
        "rejected": rejected,
        "ghosted": ghosted
    }

# Application Notes CRUD operations
def create_note(db: Session, note: NoteCreate):
    db_note = ApplicationNote(**note.model_dump())
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def get_notes_by_application(db: Session, application_id: int):
    return db.query(ApplicationNote).filter(
        ApplicationNote.application_id == application_id
    ).order_by(ApplicationNote.created_at.desc()).all()

def delete_note(db: Session, note_id: int):
    db_note = db.query(ApplicationNote).filter(ApplicationNote.id == note_id).first()
    if not db_note:
        return None
    db.delete(db_note)
    db.commit()
    return db_note
