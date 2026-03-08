from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import json
from ..database import get_db
from ..schemas import AITipsResponse, CoverLetterRequest, CoverLetterResponse
from ..services.ai_service import generate_resume_tips, generate_cover_letter
from .. import crud

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/tips/{application_id}", response_model=AITipsResponse)
async def get_ai_tips(application_id: int, db: Session = Depends(get_db)):
    """
    Generate or retrieve AI-powered resume tips for a job application
    """
    # Fetch job application
    job = crud.get_application_by_id(db, application_id)
    if not job:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Return cached tips if they exist
    if job.ai_tips:
        try:
            cached_tips = json.loads(job.ai_tips)
            return AITipsResponse(**cached_tips)
        except json.JSONDecodeError:
            pass  # If parsing fails, regenerate
    
    # Generate new tips
    result = await generate_resume_tips(
        job_title=job.job_title,
        company=job.company,
        job_description=job.job_description or "No description provided"
    )
    
    # Cache the tips in database if successful
    if not result.get('error'):
        crud.update_application(
            db,
            application_id,
            {"ai_tips": json.dumps(result)}
        )
    
    return AITipsResponse(**result)


@router.post("/cover-letter/{application_id}", response_model=CoverLetterResponse)
async def get_cover_letter(
    application_id: int,
    request: CoverLetterRequest,
    db: Session = Depends(get_db)
):
    """
    Generate a cover letter for a job application
    """
    # Fetch job application
    job = crud.get_application_by_id(db, application_id)
    if not job:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Generate cover letter
    cover_letter = await generate_cover_letter(
        job_title=job.job_title,
        company=job.company,
        job_description=job.job_description or "No description provided",
        user_background=request.user_background
    )
    
    return CoverLetterResponse(cover_letter=cover_letter)


@router.delete("/tips/{application_id}")
def clear_ai_tips(application_id: int, db: Session = Depends(get_db)):
    """
    Clear cached AI tips to allow regeneration
    """
    job = crud.get_application_by_id(db, application_id)
    if not job:
        raise HTTPException(status_code=404, detail="Application not found")
    
    crud.update_application(db, application_id, {"ai_tips": None})
    
    return {"message": "AI tips cleared successfully"}
