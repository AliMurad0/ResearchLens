from fastapi import APIRouter, HTTPException

from features.gaps.schemas import GapRequest, GapResponse
from features.gaps.service import analyze_research_gaps

router = APIRouter()


@router.post("/analyze", response_model=GapResponse)
def analyze_gaps(request: GapRequest):
    try:
        result = analyze_research_gaps(request.topic, request.max_results)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to analyze research gaps: {e}")
    return GapResponse(**result)
