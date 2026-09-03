"""
CONCEPT: This version fetches FRESH from OpenAlex every time, using
the exact same search_papers() function as the Search and Generate
Review features — no dependency on what's already stored in ChromaDB,
no distance filtering needed. You ask for a topic, you get real
papers on that topic, every time, independent of search history.

TRADEOFF: since nothing is cached, analyzing the same topic twice
means two real OpenAlex calls. That's fine — OpenAlex is free and
fast — but it does mean this is slightly slower than reusing stored
data would be.
"""

from collections import Counter
from features.papers.service import search_papers
from features.trends.keyword_analyzer import compare_keyword_trends


def analyze_trends(topic: str, max_papers: int = 50) -> dict:
    papers = search_papers(topic, max_papers)
    if not papers:
        raise ValueError("No papers found on OpenAlex for this topic. Try a different or broader keyword.")

    # CONCEPT: reshape into the same {document, metadata} format the
    # keyword analyzer already expects, so no changes needed there.
    records = []
    for p in papers:
        abstract = p.get("abstract") or ""
        title = p.get("title") or ""
        text = f"{title}\n\n{abstract}".strip()
        records.append({
            "document": text,
            "metadata": {
                "year": p.get("year") or 0,
                "authors": p.get("authors") or [],
                "cited_by_count": p.get("cited_by_count", 0),
            },
        })

    year_counter = Counter(r["metadata"]["year"] for r in records if r["metadata"]["year"])
    year_counts = [{"year": y, "count": c} for y, c in sorted(year_counter.items())]

    author_counter = Counter()
    for r in records:
        for name in r["metadata"]["authors"]:
            author_counter[name] += 1
    top_authors = [{"name": n, "paper_count": c} for n, c in author_counter.most_common(5)]

    citations = [r["metadata"]["cited_by_count"] for r in records]
    avg_citations = round(sum(citations) / len(citations), 1) if citations else 0.0

    # Only papers with real abstract text are useful for keyword frequency —
    # an empty document would just add noise.
    keyword_records = [r for r in records if r["document"]]
    emerging, saturated = compare_keyword_trends(keyword_records)

    return {
        "topic": topic,
        "papers_analyzed": len(papers),
        "year_counts": year_counts,
        "top_authors": top_authors,
        "avg_citations": avg_citations,
        "emerging_keywords": emerging,
        "saturated_keywords": saturated,
    }