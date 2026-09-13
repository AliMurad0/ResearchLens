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

1. Introduction
2. Key Themes
3. Points of Agreement and Disagreement
4. Research Gaps
5. Conclusion

Rules:
- Output each main section heading on its own line.
- Output each subsection heading on its own line.
- Use numbered headings exactly like:
  1. Introduction
  2. Key Themes
  2.1 First Subtheme
  2.2 Second Subtheme
  3. Points of Agreement and Disagreement
  4. Research Gaps
  5. Conclusion
- Never put a heading on the same line as paragraph text.
- Leave one blank line between headings and paragraphs.
- When referencing a specific finding, cite it in-text like (Author, Year) using the source's actual author/year given below
- Do not invent facts, authors, or findings not present in the excerpts
- Write in formal academic prose, not bullet points

EXCERPTS:
{excerpts}"""


def generate_review_text(topic: str, chunks: list[dict], model: str = "openai/gpt-oss-120b", max_tokens: int = 3000) -> tuple[str, int]:
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