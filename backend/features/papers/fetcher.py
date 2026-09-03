"""
CONCEPT: This file's ONLY job is talking to the OpenAlex API and
returning raw-ish data. It knows nothing about FastAPI, HTTP responses,
or your app's business rules — just "give me a topic, I return papers."

WHY OpenAlex: free, no API key required, huge open catalog of academic
papers. We send an email (not a real key) so OpenAlex puts us in their
"polite pool" — faster, more reliable rate limits.
"""

import httpx
from config import settings

OPENALEX_BASE_URL = "https://api.openalex.org/works"


def reconstruct_abstract(inverted_index: dict | None) -> str | None:
    """
    CONCEPT: OpenAlex doesn't store abstracts as plain sentences — it
    stores an "inverted index": {word: [positions where it appears]}.
    This is a copyright-friendly compression trick publishers require.
    Example: {"The": [0], "cat": [1], "sat": [2]} means "The cat sat".

    We rebuild the sentence by placing each word back at its position.
    """
    if not inverted_index:
        return None

    # Find the highest position number to know how long the sentence is
    max_position = max(pos for positions in inverted_index.values() for pos in positions)
    words = [""] * (max_position + 1)

    for word, positions in inverted_index.items():
        for pos in positions:
            words[pos] = word

    return " ".join(words)


def fetch_papers_from_openalex(topic: str, max_results: int = 10) -> list[dict]:
    """
    Calls OpenAlex's search endpoint and returns a list of raw paper
    dicts. Raises an exception on network/API failure — the caller
    (service.py) decides how to handle that.
    """
    params = {
        "search": topic,
        "per-page": max_results,
        "mailto": settings.openalex_email or None,
    }

    response = httpx.get(OPENALEX_BASE_URL, params=params, timeout=15)
    response.raise_for_status()

    data = response.json()
    return data.get("results", [])