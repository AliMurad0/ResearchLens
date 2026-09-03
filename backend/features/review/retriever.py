"""
CONCEPT: This is the "R" in RAG (Retrieval-Augmented Generation). It
embeds the search topic itself the same way we embedded the papers,
then asks ChromaDB for the stored papers whose vectors are closest in
meaning. This only works AFTER papers have been embedded and stored —
which is why service.py (below) does embedding first, every time.
"""

from db.chroma_client import get_papers_collection


def retrieve_relevant_chunks(topic: str, k: int = 5) -> list[dict]:
    collection = get_papers_collection()
    results = collection.query(query_texts=[topic], n_results=k)

    chunks = []
    for i in range(len(results["ids"][0])):
        chunks.append({
            "id": results["ids"][0][i],
            "document": results["documents"][0][i],
            "metadata": results["metadatas"][0][i],
        })
    return chunks