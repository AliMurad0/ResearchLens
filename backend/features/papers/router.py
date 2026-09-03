"""
CONCEPT: This file ONLY defines "what URL triggers what function." It
should contain almost no logic. Real work happens in service.py (added
in the next step, when we build the real OpenAlex fetcher).

WHY separate router from logic: this file talks HTTP (requests,
responses, status codes). service.py will talk pure Python (topic in,
list of papers out). That means you can test service.py directly in a
script or notebook with zero web server involved, and reuse it later
even if you swap out FastAPI.
"""

from fastapi import APIRouter, HTTPException

from features.papers.schemas import PaperSearchRequest, PaperSearchResponse
from features.papers.service import search_papers as run_paper_search

router = APIRouter()


@router.post("/search", response_model=PaperSearchResponse)
def search_papers(request: PaperSearchRequest):
    try:
        papers = run_paper_search(request.topic, request.max_results)
    except Exception as e:
        # CONCEPT: turn an internal Python error into a proper HTTP
        # error response, instead of crashing the server or leaking a
        # raw stack trace to the frontend.
        raise HTTPException(status_code=502, detail=f"Failed to fetch papers: {e}")

    return PaperSearchResponse(
        query=request.topic,
        count=len(papers),
        papers=papers,
    )