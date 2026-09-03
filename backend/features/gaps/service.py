"""
CONCEPT: Same "orchestration layer" pattern as review/service.py --
this file calls the other pieces in order and shapes the final result.
Nothing in this file, or anything it calls, makes a Groq/LLM call.
"""

from collections import defaultdict
from itertools import combinations

import numpy as np

from features.papers.service import search_papers
from features.gaps.embedder import embed_texts
from features.gaps.clusterer import choose_best_k, cluster_embeddings
from features.gaps.labeler import label_cluster
from features.gaps.formula import compute_density, compute_recency, normalize, gap_score

FORMULA_EXPLANATION = (
    "GapScore(A,B) = 100 x Density(A) x Density(B) x AvgRecency(A,B) x NormDistance(A,B). "
    "Density = cluster size / total papers analyzed (how established the area is). "
    "Recency = how recent the cluster's papers are on average, scaled 0-1 across this result set. "
    "NormDistance = Euclidean distance between cluster centroids in embedding space, scaled 0-1 "
    "across every cluster pair in this result. A high score flags two well-established, currently "
    "active research clusters that remain conceptually far apart -- a candidate bridging research "
    "direction. Papers are grouped with KMeans (k chosen automatically via silhouette score) on "
    "sentence embeddings from a local MiniLM model. Every step from clustering onward is classical "
    "statistics computed locally -- no LLM or external AI reasoning call is used at this stage; the "
    "embedding model only converts text to numbers, the same way a calculator converts digits to a result."
)

MIN_PAPERS_REQUIRED = 6


def _closest_titles(papers: list[dict], embeddings: np.ndarray, centroid: np.ndarray, n: int = 3) -> list[str]:
    distances = np.linalg.norm(embeddings - centroid, axis=1)
    order = np.argsort(distances)[:n]
    return [papers[i].get("title") or "Untitled" for i in order]


def analyze_research_gaps(topic: str, max_results: int = 40) -> dict:
    papers = search_papers(topic, max_results)
    papers = [p for p in papers if p.get("abstract") and p.get("title")]

    if len(papers) < MIN_PAPERS_REQUIRED:
        raise ValueError(
            f"Only {len(papers)} papers with usable abstracts were found for this topic. "
            f"Gap analysis needs at least {MIN_PAPERS_REQUIRED} to form meaningful clusters -- "
            "try a broader topic or a higher max_results."
        )

    texts = [f"{p['title']}\n\n{p['abstract']}" for p in papers]
    embeddings = embed_texts(texts)

    k_max = min(6, len(papers) // 3)
    k = choose_best_k(embeddings, k_min=2, k_max=k_max)

    if k < 2:
        raise ValueError(
            "This set of papers didn't separate into distinct topic clusters -- they may all be "
            "too similar. Try a broader topic or more results."
        )

    labels, centroids = cluster_embeddings(embeddings, k)

    # Group papers, texts, embeddings, and years by cluster
    cluster_papers: dict[int, list[dict]] = defaultdict(list)
    cluster_texts: dict[int, list[str]] = defaultdict(list)
    cluster_embeds: dict[int, list[np.ndarray]] = defaultdict(list)

    for paper, text, vector, label in zip(papers, texts, embeddings, labels):
        cluster_papers[int(label)].append(paper)
        cluster_texts[int(label)].append(text)
        cluster_embeds[int(label)].append(vector)

    cluster_sizes = {c: len(ps) for c, ps in cluster_papers.items()}
    cluster_years = {c: [p.get("year") for p in ps] for c, ps in cluster_papers.items()}

    densities = compute_density(cluster_sizes, total_papers=len(papers))
    recencies = compute_recency(cluster_years)

    cluster_terms: dict[int, list[str]] = {}
    cluster_summaries = []
    for c in sorted(cluster_papers.keys()):
        terms = label_cluster(cluster_texts[c], top_n=5)
        cluster_terms[c] = terms

        years = [y for y in cluster_years[c] if y]
        avg_year = sum(years) / len(years) if years else 0.0

        cluster_summaries.append({
            "cluster_id": c,
            "size": cluster_sizes[c],
            "top_terms": terms,
            "avg_year": round(avg_year, 1),
            "density": round(densities[c], 3),
            "recency": round(recencies[c], 3),
            "sample_titles": _closest_titles(
                cluster_papers[c],
                np.array(cluster_embeds[c]),
                centroids[c],
            ),
        })

    # Pairwise gap scores across every combination of clusters
    pairs = list(combinations(sorted(cluster_papers.keys()), 2))
    raw_distances = [float(np.linalg.norm(centroids[a] - centroids[b])) for a, b in pairs]
    norm_distances = normalize(raw_distances)

    gaps = []
    for (a, b), raw_dist, norm_dist in zip(pairs, raw_distances, norm_distances):
        score = gap_score(densities[a], densities[b], recencies[a], recencies[b], norm_dist)
        gaps.append({
            "cluster_a": a,
            "cluster_b": b,
            "cluster_a_terms": cluster_terms[a],
            "cluster_b_terms": cluster_terms[b],
            "distance": round(raw_dist, 4),
            "norm_distance": round(norm_dist, 3),
            "gap_score": round(score, 2),
        })

    gaps.sort(key=lambda g: g["gap_score"], reverse=True)

    return {
        "topic": topic,
        "papers_analyzed": len(papers),
        "n_clusters": k,
        "clusters": cluster_summaries,
        "top_gaps": gaps,
        "formula_explanation": FORMULA_EXPLANATION,
    }
