import traceback
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from features.review.schemas import ReviewRequest, ReviewResponse
from features.review.service import generate_literature_review
from config import settings

router = APIRouter()


@router.post("/generate", response_model=ReviewResponse)
def generate_review(request: ReviewRequest):
    try:
        result = generate_literature_review(
            request.topic, request.max_results, request.top_k, request.fast_mode
        )
    except Exception as e:
        print("=" * 60)
        print("FULL ERROR TRACEBACK:")
        traceback.print_exc()
        print("=" * 60)
        raise HTTPException(status_code=502, detail=f"Failed to generate review: {e}")
    return ReviewResponse(**result)


@router.get("/download/{filename}")
def download_file(filename: str):
    filepath = settings.outputs_dir / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path=filepath, filename=filename)