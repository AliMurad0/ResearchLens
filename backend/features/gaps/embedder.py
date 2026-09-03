"""
CONCEPT: We need raw embedding VECTORS (numbers) to cluster, not just
"store text in Chroma and query by meaning" like embeddings/service.py
does. Rather than adding a new dependency (sentence-transformers +
torch), we reuse the exact same model ChromaDB already uses internally
-- all-MiniLM-L6-v2, running locally through ONNX -- by calling its
embedding function directly.

WHY THIS MATTERS FOR YOUR "NO LLM" ARGUMENT: this model has no notion
of language generation or reasoning. Given text, it always returns the
same 384 numbers. It is a fixed mathematical transformation, the same
class of tool as a hash function or a Fourier transform -- not an AI
that "answers" anything. Everything downstream (clustering, distance,
the GapScore formula) is classical statistics on top of these numbers.
"""

import numpy as np
from chromadb.utils.embedding_functions import DefaultEmbeddingFunction

_embedder = None


def get_embedder():
    global _embedder
    if _embedder is None:
        _embedder = DefaultEmbeddingFunction()
    return _embedder


def embed_texts(texts: list[str]) -> np.ndarray:
    """
    Takes a list of strings, returns an (n_texts, 384) numpy array.
    Deterministic: the same text always produces the same vector.
    """
    embedder = get_embedder()
    vectors = embedder(texts)
    return np.array(vectors)
