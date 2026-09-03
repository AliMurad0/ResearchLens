"""
CONCEPT: We store venue and abstract in metadata now too, alongside
cited_by_count. Chroma's document text is used for embedding/search
similarity, but metadata is what gets read back out later to rebuild
a full structured Paper object (e.g. for the review's reference list,
or the extraction table) -- so anything the rest of the app needs to
display about a paper has to live in metadata, not just in the
embedded text.
"""
from db.chroma_client import get_papers_collection


def embed_and_store_papers(papers: list[dict]) -> int:
    collection = get_papers_collection()

    ids, documents, metadatas = [], [], []

    for paper in papers:
        if not paper.get("abstract") or not paper.get("id"):
            continue

        text = f"{paper.get('title', '')}\n\n{paper['abstract']}"

        ids.append(paper["id"])
        documents.append(text)
        metadatas.append({
            "title": paper.get("title") or "",
            "year": paper.get("year") or 0,
            "doi": paper.get("doi") or "",
            "authors": ", ".join(paper.get("authors", [])),
            "cited_by_count": paper.get("cited_by_count", 0),
            "venue": paper.get("venue") or "",
            "abstract": paper.get("abstract") or "",
        })

    if not ids:
        return 0

    collection.upsert(ids=ids, documents=documents, metadatas=metadatas)
    return len(ids)