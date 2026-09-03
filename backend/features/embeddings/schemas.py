from pydantic import BaseModel


class EmbedRequest(BaseModel):
    topic: str
    max_results: int = 10


class EmbedResponse(BaseModel):
    topic: str
    papers_found: int
    papers_embedded: int