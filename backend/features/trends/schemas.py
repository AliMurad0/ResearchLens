from pydantic import BaseModel


class TrendRequest(BaseModel):
    topic: str
    max_papers: int = 50


class YearCount(BaseModel):
    year: int
    count: int


class AuthorCount(BaseModel):
    name: str
    paper_count: int


class TrendResponse(BaseModel):
    topic: str
    papers_analyzed: int
    year_counts: list[YearCount]
    top_authors: list[AuthorCount]
    avg_citations: float
    emerging_keywords: list[str]
    saturated_keywords: list[str]