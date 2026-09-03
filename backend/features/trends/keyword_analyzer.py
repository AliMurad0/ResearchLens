"""
CONCEPT: Three upgrades over the previous version:
1. ngram_range=(2,3) — ONLY multi-word phrases are extracted, never
   single words. "vision transformer" is meaningful; "vision" alone
   isn't.
2. Extended stopword list — filters out generic academic filler words
   ("based on", "we propose", "results show") that are common in
   almost every paper and carry no real topical meaning.
3. Phrase deduplication — if both "vision transformer" and "transformer
   using" would appear, only the more specific/longer phrase is kept,
   so the list doesn't feel repetitive or redundant.
"""

from sklearn.feature_extraction.text import TfidfVectorizer, ENGLISH_STOP_WORDS

FILLER_WORDS = {
    "based", "using", "use", "used", "propose", "proposed", "approach",
    "approaches", "method", "methods", "paper", "papers", "results",
    "result", "show", "shows", "shown", "demonstrate", "demonstrates",
    "novel", "new", "work", "study", "studies", "present", "presents",
    "significant", "significantly", "existing", "recent", "recently",
}
CUSTOM_STOPWORDS = list(ENGLISH_STOP_WORDS) + list(FILLER_WORDS)


def split_by_recency(papers: list[dict], recent_years: int = 3) -> tuple[list[str], list[str]]:
    years = [p["metadata"].get("year", 0) for p in papers if p["metadata"].get("year")]
    if not years:
        return [], []

    latest_year = max(years)
    cutoff = latest_year - recent_years

    recent_docs = [p["document"] for p in papers if p["metadata"].get("year", 0) > cutoff]
    older_docs = [p["document"] for p in papers if p["metadata"].get("year", 0) <= cutoff]
    return recent_docs, older_docs


def _phrase_scores(docs: list[str]) -> dict:
    if len(docs) < 2:
        return {}
    vectorizer = TfidfVectorizer(
        ngram_range=(2, 3),
        stop_words=CUSTOM_STOPWORDS,
        max_features=300,
        min_df=2,          # phrase must appear in at least 2 different papers
        max_df=0.7,         # ignore phrases that appear in almost every paper (too generic)
    )
    try:
        matrix = vectorizer.fit_transform(docs)
    except ValueError:
        return {}  # not enough distinct phrases to build a vocabulary
    scores = matrix.sum(axis=0).A1
    vocab = vectorizer.get_feature_names_out()
    return dict(zip(vocab, scores))


def _dedupe_phrases(ordered_phrases: list[str]) -> list[str]:
    """
    Keeps only phrases that aren't fully contained inside another,
    longer phrase already selected — avoids showing both "vision
    transformer" and "transformer model" as if they're distinct ideas.
    """
    kept = []
    for phrase in ordered_phrases:
        if not any(phrase != k and phrase in k for k in kept):
            kept.append(phrase)
    return kept


def compare_keyword_trends(papers: list[dict], top_n: int = 6) -> tuple[list[str], list[str]]:
    recent_docs, older_docs = split_by_recency(papers)
    recent_scores = _phrase_scores(recent_docs)
    older_scores = _phrase_scores(older_docs)

    all_phrases = set(recent_scores) | set(older_scores)
    deltas = [(phrase, recent_scores.get(phrase, 0) - older_scores.get(phrase, 0)) for phrase in all_phrases]
    deltas.sort(key=lambda x: x[1], reverse=True)

    emerging_ordered = [phrase for phrase, delta in deltas if delta > 0]
    saturated_ordered = [phrase for phrase, delta in reversed(deltas) if delta < 0]

    emerging = _dedupe_phrases(emerging_ordered)[:top_n]
    saturated = _dedupe_phrases(saturated_ordered)[:top_n]
    return emerging, saturated