from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from schemas import JobApplicationCreate, JobApplicationUpdate, JobApplicationResponse, StatsResponse, NoteCreate, NoteResponse
from services.auth_service import get_current_user
from models import User
import crud

router = APIRouter(prefix="/applications", tags=["applications"])

@router.post("/", response_model=JobApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(
    application: JobApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.create_application(db, application, owner_id=current_user.id)

@router.get("/", response_model=List[JobApplicationResponse])
def list_applications(
    status: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.get_all_applications(
        db, skip=skip, limit=limit, status=status, search=search, owner_id=current_user.id
    )

@router.get("/stats", response_model=StatsResponse)
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.get_stats(db, owner_id=current_user.id)

@router.get("/{id}", response_model=JobApplicationResponse)
def get_application(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    application = crud.get_application_by_id(db, id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check ownership
    if application.owner_id and application.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this application")
    
    return application

@router.put("/{id}", response_model=JobApplicationResponse)
def update_application(
    id: int,
    application: JobApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_application = crud.get_application_by_id(db, id)
    if not db_application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check ownership
    if db_application.owner_id and db_application.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this application")
    
    updated = crud.update_application(db, id, application)
    return updated

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_application = crud.get_application_by_id(db, id)
    if not db_application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check ownership
    if db_application.owner_id and db_application.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this application")
    
    crud.delete_application(db, id)
    return None

# Application Notes endpoints
@router.post("/{id}/notes", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(
    id: int,
    note: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify application exists and user owns it
    application = crud.get_application_by_id(db, id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.owner_id and application.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to add notes to this application")
    
    # Ensure note is for the correct application
    note.application_id = id
    return crud.create_note(db, note)

@router.get("/{id}/notes", response_model=List[NoteResponse])
def get_notes(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify application exists and user owns it
    application = crud.get_application_by_id(db, id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.owner_id and application.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view notes for this application")
    
    return crud.get_notes_by_application(db, id)

@router.delete("/{id}/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    id: int,
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify application exists and user owns it
    application = crud.get_application_by_id(db, id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.owner_id and application.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete notes from this application")
    
    deleted = crud.delete_note(db, note_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Note not found")
    return None
