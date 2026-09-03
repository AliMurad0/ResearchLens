"""
CONCEPT: Once papers are grouped into clusters, we need a human-
readable label for each one ("what is this cluster actually about?").
We reuse the exact same TF-IDF technique and stopword list already
built in trends/keyword_analyzer.py, rather than asking an LLM to
summarize the cluster. This is a deliberate consistency choice: the
whole gap-detection feature, start to finish, never calls Groq or any
other text-generation model.
"""

from sklearn.feature_extraction.text import TfidfVectorizer, ENGLISH_STOP_WORDS
from features.trends.keyword_analyzer import FILLER_WORDS

CUSTOM_STOPWORDS = list(ENGLISH_STOP_WORDS) + list(FILLER_WORDS)


def label_cluster(documents: list[str], top_n: int = 5) -> list[str]:
    """
    Returns the top_n highest-scoring TF-IDF terms (unigrams/bigrams)
    across this cluster's documents -- a compact, defensible label
    like ["neural machine translation", "attention mechanism"].
    """
    if len(documents) < 2:
        return []

    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        stop_words=CUSTOM_STOPWORDS,
        max_features=100,
        min_df=1,
    )
    try:
        matrix = vectorizer.fit_transform(documents)
    except ValueError:
        return []  # not enough distinct vocabulary in this cluster

    scores = matrix.sum(axis=0).A1
    vocab = vectorizer.get_feature_names_out()
    ranked = sorted(zip(vocab, scores), key=lambda x: x[1], reverse=True)
    return [term for term, _ in ranked[:top_n]]
