"""
CONCEPT: Grouping papers into topic clusters using KMeans -- a
standard, well-established classical ML algorithm (not an LLM). It
runs entirely on your own machine via scikit-learn, which is already
a dependency of this project (used in trends/keyword_analyzer.py).

WHY AUTO-PICK k INSTEAD OF HARDCODING IT: hardcoding "always 4
clusters" is arbitrary and hard to defend. Instead we try several
values of k and keep the one with the best silhouette score -- a
standard, textbook metric for "how well-separated are these clusters,"
computed with zero AI involvement. This makes the choice of k
reproducible and justifiable on its own terms.
"""

import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

RANDOM_STATE = 42  # fixed seed -> same input always gives the same clusters


def choose_best_k(embeddings: np.ndarray, k_min: int = 2, k_max: int = 6) -> int:
    n_samples = len(embeddings)
    upper = min(k_max, n_samples - 1)

    if upper < k_min:
        # Too few papers to form more than one meaningful group.
        return 1

    best_k, best_score = k_min, -1.0
    for k in range(k_min, upper + 1):
        model = KMeans(n_clusters=k, random_state=RANDOM_STATE, n_init=10)
        labels = model.fit_predict(embeddings)
        if len(set(labels)) < 2:
            continue
        score = silhouette_score(embeddings, labels)
        if score > best_score:
            best_score, best_k = score, k

    return best_k


def cluster_embeddings(embeddings: np.ndarray, k: int) -> tuple[np.ndarray, np.ndarray]:
    """
    Returns (labels, centroids):
      labels    -- which cluster (0..k-1) each paper was assigned to
      centroids -- the (k, 384) array of cluster center vectors
    """
    model = KMeans(n_clusters=k, random_state=RANDOM_STATE, n_init=10)
    labels = model.fit_predict(embeddings)
    return labels, model.cluster_centers_
