"""
CONCEPT: This is the "business logic" layer. It calls fetcher.py to get
raw data, then shapes it into exactly what the rest of your app needs.
"""

from features.papers.fetcher import fetch_papers_from_openalex, reconstruct_abstract


def search_papers(topic: str, max_results: int = 10) -> list[dict]:
    raw_results = fetch_papers_from_openalex(topic, max_results)

    cleaned = []
    for paper in raw_results:
        primary_location = paper.get("primary_location") or {}
        source = primary_location.get("source") or {}

        cleaned.append({
            "id": paper.get("id"),  # OpenAlex's unique ID, e.g. "https://openalex.org/W123..."
            "title": paper.get("title"),
            "year": paper.get("publication_year"),
            "doi": paper.get("doi"),
            "venue": source.get("display_name"),
            "cited_by_count": paper.get("cited_by_count", 0),
            "authors": [
                a["author"]["display_name"]
                for a in paper.get("authorships", [])
            ],
            "abstract": reconstruct_abstract(paper.get("abstract_inverted_index")),
        })

    return cleaned