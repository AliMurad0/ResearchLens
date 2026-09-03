"""
CONCEPT: One batched LLM call that reads every retrieved paper's
abstract and pulls out four fixed fields (methodology, dataset, key
finding, limitation) as structured JSON -- one call for all papers,
not one call per paper, since that's both cheaper and faster.

HONEST LIMITATION: this only has ABSTRACTS to work with, not full
paper text. So the model is instructed to say "Not stated in
abstract" rather than guess when a field genuinely isn't there --
a wrong-but-confident extraction is worse than an honest gap, and
"Not stated" is also exactly what powers the completeness score below.

UNLIKE gap detection: this feature genuinely needs an LLM (structuring
free text is not something classical statistics can do). That's a
different, and separate, defensibility argument from Gap Score's
"zero LLM calls" story -- don't present them as the same kind of claim.
"""

import json
import re
from groq import Groq
from config import settings

MAX_EXCERPT_CHARS = 600
NOT_STATED = "not stated in abstract"

# A smaller/faster model is enough for structured extraction -- this
# isn't creative synthesis, it's pattern-matching against a fixed
# schema, so there's no need to pay for the 70B model here.
EXTRACTION_MODEL = "llama-3.1-8b-instant"


def build_extraction_prompt(chunks: list[dict]) -> str:
    excerpts = "\n\n".join(
        f'[PAPER_ID: {c["id"]}]\n'
        f'Title: {c["metadata"].get("title", "Untitled")}\n'
        f'Abstract: {c["document"][:MAX_EXCERPT_CHARS]}'
        for c in chunks
    )
    return f"""You are extracting structured data from academic paper abstracts.

For EACH paper below, extract exactly these four fields:
- methodology: the research method or approach used (one short phrase)
- dataset: the dataset, sample, or study population (one short phrase)
- key_finding: the main result or conclusion (one short sentence)
- limitation: a stated limitation or constraint (one short phrase)

CRITICAL RULES:
- Use ONLY information explicitly stated in the abstract. Do not infer or invent anything.
- If a field is not stated in the abstract, use exactly the string "Not stated in abstract" for that field.
- Return ONLY valid JSON, no other text, no markdown code fences.
- The JSON must be an object with one key, "extractions", whose value is an array with
  exactly one object per paper below, in the same order, each with exactly these keys:
  paper_id, methodology, dataset, key_finding, limitation.

PAPERS:
{excerpts}

Return the JSON now."""


def _parse_json_response(raw: str) -> list[dict]:
    # Models sometimes wrap JSON in ```json fences even when told not to --
    # strip those before parsing rather than failing on them.
    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw.strip())
    data = json.loads(cleaned)
    extractions = data.get("extractions", [])
    if not isinstance(extractions, list):
        raise ValueError("'extractions' was not a list")
    return extractions


def extract_paper_data(chunks: list[dict]) -> list[dict]:
    """
    Returns a list of extraction dicts, one per chunk, in the same
    shape as the PaperExtraction schema. On ANY failure (API error,
    malformed JSON, missing fields) this returns an empty list rather
    than raising -- a broken extraction table should never take down
    the review generation that already works.
    """
    if not chunks:
        return []

    try:
        client = Groq(api_key=settings.groq_api_key)
        prompt = build_extraction_prompt(chunks)

        response = client.chat.completions.create(
            model=EXTRACTION_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=2000,
            response_format={"type": "json_object"},
        )
        raw = response.choices[0].message.content
        extractions = _parse_json_response(raw)

        # Normalize: guarantee every expected key exists on every row,
        # even if the model dropped one -- the frontend shouldn't have
        # to defend against missing keys.
        valid_ids = {c["id"] for c in chunks}
        cleaned = []
        for row in extractions:
            paper_id = row.get("paper_id")
            if paper_id not in valid_ids:
                continue
            cleaned.append({
                "paper_id": paper_id,
                "methodology": row.get("methodology") or NOT_STATED,
                "dataset": row.get("dataset") or NOT_STATED,
                "key_finding": row.get("key_finding") or NOT_STATED,
                "limitation": row.get("limitation") or NOT_STATED,
            })
        return cleaned

    except Exception as e:
        print(f"[extraction] failed, continuing without it: {e}")
        return []


def compute_completeness(extractions: list[dict]) -> float:
    """
    % of fields across all extracted papers that are NOT "Not stated
    in abstract" -- a free metric computed on data the extraction call
    already produced, no extra LLM call needed.
    """
    if not extractions:
        return 0.0

    fields = ["methodology", "dataset", "key_finding", "limitation"]
    total = len(extractions) * len(fields)
    filled = sum(
        1
        for row in extractions
        for f in fields
        if str(row.get(f, "")).strip().lower() != NOT_STATED
    )
    return round(100 * filled / total, 1) if total else 0.0
