import html
import re

from docx import Document
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)

from config import settings


def _safe_filename(topic: str) -> str:
    return re.sub(r"[^a-zA-Z0-9]+", "_", topic.strip()).strip("_").lower()


def _escape(text: str) -> str:
    """
    Escape text safely for ReportLab Paragraph.
    """
    return html.escape(text.strip())


def _is_main_heading(line: str) -> bool:
    """
    Matches headings such as:

    1. Introduction
    2. Key Themes
    3. Points of Agreement and Disagreement
    4. Research Gaps
    5. Conclusion
    """
    return bool(re.match(r"^\d+\.\s+.+$", line))


def _is_sub_heading(line: str) -> bool:
    """
    Matches headings such as:

    2.1 Hierarchical and Multi-Scale Vision Transformers
    2.2 Efficient Attention for High-Resolution Restoration
    """
    return bool(re.match(r"^\d+\.\d+\s+.+$", line))


def _normalise_review_blocks(review_text: str) -> list[tuple[str, str]]:
    """
    Convert generated review text into typed blocks.

    Returns:
        [
            ("heading", "..."),
            ("subheading", "..."),
            ("paragraph", "..."),
        ]
    """

    lines = [line.strip() for line in review_text.splitlines()]

    blocks: list[tuple[str, str]] = []
    paragraph_buffer: list[str] = []

    def flush_paragraph() -> None:
        if paragraph_buffer:
            text = " ".join(paragraph_buffer).strip()
            if text:
                blocks.append(("paragraph", text))
            paragraph_buffer.clear()

    for line in lines:
        if not line:
            flush_paragraph()
            continue

        # Markdown heading support
        if line.startswith("### "):
            flush_paragraph()
            blocks.append(("subheading", line[4:].strip()))
            continue

        if line.startswith("## "):
            flush_paragraph()
            blocks.append(("heading", line[3:].strip()))
            continue

        # Numbered academic heading support
        if _is_sub_heading(line):
            flush_paragraph()
            blocks.append(("subheading", line))
            continue

        if _is_main_heading(line):
            flush_paragraph()
            blocks.append(("heading", line))
            continue

        # Ordinary paragraph text
        paragraph_buffer.append(line)

    flush_paragraph()

    return blocks


def export_to_docx(
    topic: str,
    review_text: str,
    references: list[str],
) -> str:
    """
    Export the review to DOCX while preserving heading hierarchy.
    """

    settings.outputs_dir.mkdir(parents=True, exist_ok=True)

    doc = Document()

    # Title
    doc.add_heading(f"Literature Review: {topic}", level=1)

    # Review content
    blocks = _normalise_review_blocks(review_text)

    for block_type, content in blocks:
        if block_type == "heading":
            doc.add_heading(content, level=2)

        elif block_type == "subheading":
            doc.add_heading(content, level=3)

        else:
            doc.add_paragraph(content)

    # References
    doc.add_heading("References", level=2)

    for reference in references:
        doc.add_paragraph(reference, style="List Number")

    filename = f"{_safe_filename(topic)}_review.docx"
    doc.save(settings.outputs_dir / filename)

    return filename


def export_to_pdf(
    topic: str,
    review_text: str,
    references: list[str],
) -> str:
    """
    Export a properly structured academic PDF using ReportLab.

    The document contains:
    - title
    - numbered section headings
    - numbered subsection headings
    - normal body paragraphs
    - references
    """

    settings.outputs_dir.mkdir(parents=True, exist_ok=True)

    filename = f"{_safe_filename(topic)}_review.pdf"
    filepath = settings.outputs_dir / filename

    doc = SimpleDocTemplate(
        str(filepath),
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
        title=f"Literature Review: {topic}",
        author="ResearchLens",
    )

    styles = getSampleStyleSheet()

    # ---------------------------------------------------------
    # Styles
    # ---------------------------------------------------------

    title_style = ParagraphStyle(
        "ResearchLensTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        alignment=TA_CENTER,
        spaceAfter=14,
    )

    heading_style = ParagraphStyle(
        "ResearchLensHeading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=18,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True,
    )

    subheading_style = ParagraphStyle(
        "ResearchLensSubHeading",
        parent=styles["Heading3"],
        fontName="Helvetica-Bold",
        fontSize=11.5,
        leading=15,
        spaceBefore=9,
        spaceAfter=6,
        keepWithNext=True,
    )

    body_style = ParagraphStyle(
        "ResearchLensBody",
        parent=styles["BodyText"],
        fontName="Times-Roman",
        fontSize=10.5,
        leading=15,
        spaceAfter=8,
        alignment=0,
    )

    reference_style = ParagraphStyle(
        "ResearchLensReference",
        parent=styles["BodyText"],
        fontName="Times-Roman",
        fontSize=9,
        leading=12,
        leftIndent=14,
        firstLineIndent=-14,
        spaceAfter=7,
    )

    metadata_style = ParagraphStyle(
        "ResearchLensMetadata",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor="#666666",
        spaceAfter=12,
    )

    # ---------------------------------------------------------
    # Document content
    # ---------------------------------------------------------

    story = []

    # Title
    story.append(
        Paragraph(
            _escape(f"Literature Review: {topic}"),
            title_style,
        )
    )

    # Review content
    blocks = _normalise_review_blocks(review_text)

    for block_type, content in blocks:

        if block_type == "heading":
            story.append(
                KeepTogether(
                    [
                        Paragraph(
                            _escape(content),
                            heading_style,
                        ),
                    ]
                )
            )

        elif block_type == "subheading":
            story.append(
                KeepTogether(
                    [
                        Paragraph(
                            _escape(content),
                            subheading_style,
                        ),
                    ]
                )
            )

        elif block_type == "paragraph":
            story.append(
                Paragraph(
                    _escape(content),
                    body_style,
                )
            )

    # References
    story.append(Spacer(1, 8))

    story.append(
        Paragraph(
            "References",
            heading_style,
        )
    )

    for index, reference in enumerate(references, start=1):
        story.append(
            Paragraph(
                f"{index}. {_escape(reference)}",
                reference_style,
            )
        )

    # Build PDF
    doc.build(story)

    return filename