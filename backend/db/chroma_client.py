"""
CONCEPT: ChromaDB stores text as vectors ("embeddings") so you can
search by MEANING instead of exact keywords. This file creates ONE
shared, persistent ChromaDB client that every other file imports,
instead of each file opening its own connection.

WHY ONE SHARED CLIENT: ChromaDB writes to disk. If multiple parts of
your app opened separate connections to the same folder, you'd risk
file-lock conflicts. This pattern — a single function that creates
something once and reuses it — is called a "singleton."

WHY PersistentClient: so embeddings survive a backend restart. Without
this, you'd re-embed every paper from scratch every time you run the
server — slow and wasteful.
"""

import chromadb
from config import settings

_client = None


def get_chroma_client():
    global _client
    if _client is None:
        settings.chroma_dir.mkdir(parents=True, exist_ok=True)
        _client = chromadb.PersistentClient(path=str(settings.chroma_dir))
    return _client


def get_papers_collection():
    """
    CONCEPT: A 'collection' is ChromaDB's version of a table — a named
    bucket of vectors + metadata. We use one collection for all papers.

    We don't pass an embedding_function here, so ChromaDB uses its
    DEFAULT local model (all-MiniLM-L6-v2). It downloads once (~80MB)
    the first time you use it, then runs completely offline and free
    from then on.
    """
    client = get_chroma_client()
    return client.get_or_create_collection(name="papers")