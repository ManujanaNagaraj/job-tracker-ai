from fastapi import APIRouter, HTTPException
from ..schemas import ParseURLRequest, ParseURLResponse
from ..services.url_parser import parse_job_url

router = APIRouter(prefix="/parse", tags=["parser"])

@router.post("/url", response_model=ParseURLResponse)
async def parse_url(request: ParseURLRequest):
    """
    Parse a job posting URL and extract job details
    """
    url = request.url.strip()
    
    # Basic URL validation
    if not url.startswith(('http://', 'https://')):
        raise HTTPException(
            status_code=400,
            detail="Invalid URL format. URL must start with http:// or https://"
        )
    
    try:
        result = await parse_job_url(url)
        return ParseURLResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error parsing URL: {str(e)}"
        )
