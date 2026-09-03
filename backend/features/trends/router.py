from fastapi import APIRouter, HTTPException

from features.trends.schemas import TrendRequest, TrendResponse
from features.trends.service import analyze_trends

router = APIRouter()


@router.post("/analyze", response_model=TrendResponse)
def get_trends(request: TrendRequest):
    try:
        result = analyze_trends(request.topic, request.max_papers)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to analyze trends: {e}")
    return TrendResponse(**result)