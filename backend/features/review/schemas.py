from pydantic import BaseModel
from features.papers.schemas import Paper


class ReviewRequest(BaseModel):
    topic: str
    max_results: int = 30
    top_k: int = 12
    fast_mode: bool = False


class PaperExtraction(BaseModel):
    """
    One row of the structured extraction table -- four fixed fields
    pulled from a single paper's abstract. paper_id matches a
    reference's id, so the frontend can line this row up with the
    right paper's title/authors/DOI.
    """
    paper_id: str
    methodology: str
    dataset: str
    key_finding: str
    limitation: str


class ReviewResponse(BaseModel):
    topic: str
    review_text: str
    references: list[Paper]
    sources_used: int
    papers_scanned: int
    tokens_used: int
    docx_filename: str
    pdf_filename: str
    extraction: list[PaperExtraction] = []
    extraction_completeness: float = 0.0