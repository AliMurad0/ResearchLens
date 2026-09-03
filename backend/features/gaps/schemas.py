"""
CONCEPT: Same pattern as every other feature -- schemas.py only defines
the SHAPE of the data. No logic lives here.
"""

from pydantic import BaseModel


class GapRequest(BaseModel):
    topic: str
    max_results: int = 40


class ClusterSummary(BaseModel):
    cluster_id: int
    size: int
    top_terms: list[str]
    avg_year: float
    density: float          # size / total_papers, 0-1
    recency: float          # 0-1, scaled across this result set
    sample_titles: list[str]  # 2-3 papers closest to the cluster centroid


class GapCandidate(BaseModel):
    cluster_a: int
    cluster_b: int
    cluster_a_terms: list[str]
    cluster_b_terms: list[str]
    distance: float          # raw Euclidean distance between centroids
    norm_distance: float     # 0-1, scaled across all cluster pairs in this result
    gap_score: float         # 0-100


class GapResponse(BaseModel):
    topic: str
    papers_analyzed: int
    n_clusters: int
    clusters: list[ClusterSummary]
    top_gaps: list[GapCandidate]
    formula_explanation: str
