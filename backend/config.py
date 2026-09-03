"""
CONCEPT: Every setting your app needs (API keys, folder paths, database
location) lives in ONE place instead of being scattered as magic strings
across files. This is called "centralized configuration."

WHY: If you hardcode a folder path in 5 files and it changes, you edit
5 files. If it's here, you edit 1 line.

pydantic-settings reads values from a .env file, validates types (a typo
like PORT="abc" fails loudly, not silently), and gives editor autocomplete.

ALTERNATIVES:
- os.environ.get("KEY") everywhere -> no validation, typo a key name and
  get None silently.
- python-dotenv + a dict -> same issue, no type safety.
BEST PRACTICE: pydantic-settings, the modern standard for FastAPI apps.
"""

from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    app_name: str = "ResearchLens API"

    groq_api_key: str = ""
    openalex_email: str = ""  # OpenAlex "polite pool" = faster, no key needed

    base_dir: Path = Path(__file__).resolve().parent
    data_dir: Path = base_dir / "data"
    papers_dir: Path = data_dir / "papers"
    chroma_dir: Path = data_dir / "chroma_db"
    outputs_dir: Path = data_dir / "outputs"

    class Config:
        env_file = ".env"


# ONE shared instance, imported everywhere else ("singleton" pattern)
settings = Settings()