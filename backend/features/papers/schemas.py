"""
CONCEPT: A "schema" defines the exact SHAPE of data going in/out of an
endpoint — field names, types, which are required.
"""

from pydantic import BaseModel


class PaperSearchRequest(BaseModel):
    topic: str
    max_results: int = 20


class Paper(BaseModel):
    id: str | None
    title: str | None
    year: int | None
    doi: str | None
    venue: str | None
    cited_by_count: int
    authors: list[str]
    abstract: str | None


class PaperSearchResponse(BaseModel):
    query: str
    count: int
    papers: list[Paper]