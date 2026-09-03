"""
CONCEPT: Notice this router calls features.papers.service directly —
a plain Python function call, not an HTTP request. Two features living
in the same backend process can call each other's service.py directly.
(This is different from frontend<->backend, which MUST go through
HTTP, since those are two separate processes.)
"""

from fastapi import APIRouter, HTTPException

from features.papers.service import search_papers
from features.embeddings.service import embed_and_store_papers
from features.embeddings.schemas import EmbedRequest, EmbedResponse

router = APIRouter()


@router.post("/store", response_model=EmbedResponse)
def store_embeddings(request: EmbedRequest):
    try:
        papers = search_papers(request.topic, request.max_results)
        stored_count = embed_and_store_papers(papers)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to embed papers: {e}")

    return EmbedResponse(
        topic=request.topic,
        papers_found=len(papers),
        papers_embedded=stored_count,
    )