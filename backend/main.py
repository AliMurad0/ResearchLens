from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from features.papers.router import router as papers_router
from features.embeddings.router import router as embeddings_router
from features.review.router import router as review_router
from features.trends.router import router as trends_router
from features.gaps.router import router as gaps_router

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": settings.app_name}


app.include_router(papers_router, prefix="/papers", tags=["papers"])
app.include_router(embeddings_router, prefix="/embeddings", tags=["embeddings"])
app.include_router(review_router, prefix="/review", tags=["review"])
app.include_router(trends_router, prefix="/trends", tags=["trends"])
app.include_router(gaps_router, prefix="/gaps", tags=["gaps"])