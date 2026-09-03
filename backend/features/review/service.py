from features.papers.service import search_papers
from features.embeddings.service import embed_and_store_papers
from features.review.retriever import retrieve_relevant_chunks
from features.review.generator import generate_review_text
from features.review.exporter import export_to_docx, export_to_pdf
from features.review.extractor import extract_paper_data, compute_completeness


def build_references_list(chunks: list[dict]) -> list[dict]:
    """
    Returns structured paper objects (matching features.papers.schemas.Paper),
    not pre-formatted citation strings -- the frontend needs real fields
    (title, authors as a list, doi, venue, abstract...) to render the
    Preview Papers list, hover cards, and citation formatting, and to
    match extraction table rows back to the paper they came from.
    """
    references = []
    for c in chunks:
        meta = c["metadata"]
        authors_str = meta.get("authors") or ""
        authors = [a.strip() for a in authors_str.split(",") if a.strip()] or ["Unknown"]

        references.append({
            "id": c["id"],
            "title": meta.get("title") or "Untitled",
            "year": meta.get("year") or None,
            "doi": meta.get("doi") or None,
            "venue": meta.get("venue") or None,
            "cited_by_count": meta.get("cited_by_count", 0),
            "authors": authors,
            "abstract": meta.get("abstract") or None,
        })
    return references


def generate_literature_review(topic: str, max_results: int = 30, top_k: int = 12, fast_mode: bool = False) -> dict:
    papers = search_papers(topic, max_results)
    embed_and_store_papers(papers)

    effective_top_k = min(top_k, 8) if fast_mode else top_k
    chunks = retrieve_relevant_chunks(topic, k=effective_top_k)
    if not chunks:
        raise ValueError("No relevant papers found to generate a review from.")

    model = "llama-3.1-8b-instant" if fast_mode else "llama-3.3-70b-versatile"
    max_tokens = 1500 if fast_mode else 3000

    review_text, tokens_used = generate_review_text(topic, chunks, model=model, max_tokens=max_tokens)
    references = build_references_list(chunks)

    # Structured extraction table -- one extra Groq call, batched across
    # all chunks. Wrapped so a failure here never breaks the review
    # generation that already works.
    extraction = extract_paper_data(chunks)
    extraction_completeness = compute_completeness(extraction)

    docx_filename = export_to_docx(topic, review_text, references)
    pdf_filename = export_to_pdf(topic, review_text, references)

    return {
        "topic": topic,
        "review_text": review_text,
        "references": references,
        "sources_used": len(chunks),
        "papers_scanned": len(papers),
        "tokens_used": tokens_used,
        "docx_filename": docx_filename,
        "pdf_filename": pdf_filename,
        "extraction": extraction,
        "extraction_completeness": extraction_completeness,
    }