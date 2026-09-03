"""
CONCEPT: generate_review_text now returns both the text AND how many
tokens Groq actually used, straight from the API's own usage report —
so the dashboard can show a REAL token count, not a guess.
"""

from groq import Groq
from config import settings

MAX_EXCERPT_CHARS = 800


def build_review_prompt(topic: str, chunks: list[dict]) -> str:
    excerpts = "\n\n".join(
        f"[Source: {c['metadata']['title']} — {c['metadata']['authors']} ({c['metadata']['year']})]\n"
        f"{c['document'][:MAX_EXCERPT_CHARS]}"
        for c in chunks
    )
    return f"""You are an academic researcher writing a detailed literature review on "{topic}".

Using ONLY the research excerpts below, write a thorough literature review with these sections:

1. Introduction — context and why this topic matters
2. Key Themes — group and discuss the main ideas across sources, in depth
3. Points of Agreement and Disagreement — where sources align or conflict
4. Research Gaps — what's missing or under-explored
5. Conclusion — synthesis and outlook

Rules:
- When referencing a specific finding, cite it in-text like (Author, Year) using the source's actual author/year given below
- Do not invent facts, authors, or findings not present in the excerpts
- Write in formal academic prose, not bullet points

EXCERPTS:
{excerpts}"""


def generate_review_text(topic: str, chunks: list[dict], model: str = "llama-3.3-70b-versatile", max_tokens: int = 3000) -> tuple[str, int]:
    client = Groq(api_key=settings.groq_api_key)
    prompt = build_review_prompt(topic, chunks)

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=max_tokens,
    )
    text = response.choices[0].message.content
    tokens_used = response.usage.total_tokens if response.usage else 0
    return text, tokens_used