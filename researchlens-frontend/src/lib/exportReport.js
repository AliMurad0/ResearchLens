import jsPDF from "jspdf";
import { formatAPA } from "./citations";

/**
 * jsPDF's built-in fonts (times, helvetica, courier) are WinAnsi/Latin-1 only.
 * If a single character outside that set appears in a string, jsPDF silently
 * re-encodes the ENTIRE line as UTF-16. The standard font can't read UTF-16,
 * so the line renders as spread-out garbage AND its advance widths come out
 * wrong -- the text runs past the right margin and the next line draws on top
 * of it.
 *
 * In practice the LLM output triggers this with non-breaking hyphens (U+2011)
 * inside compounds like "hand-crafted", "high-dimensional", "end-to-end".
 *
 * Everything gets normalized to safe equivalents, and the final character-class
 * strip is the safety net: an unexpected glyph from some future paper title
 * can't silently corrupt a line again.
 */
function toWinAnsi(text) {
  return String(text)
    .replace(/[\u2010\u2011\u2012\u2013\u2212]/g, "-") // hyphen / dash / minus variants
    .replace(/\u2014/g, "--") // em dash
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'") // curly single quotes
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"') // curly double quotes
    .replace(/\u2026/g, "...") // ellipsis
    .replace(/[\u00A0\u2007\u2009\u202F]/g, " ") // exotic spaces
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, ""); // drop anything still unsupported
}

export function exportReportAsPDF(result) {
  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const marginLeft = 56;
  const marginRight = 56;
  const marginTop = 56;
  const marginBottom = 56;

  const contentWidth = pageWidth - marginLeft - marginRight;

  let y = marginTop;

  function newPage() {
    doc.addPage();
    y = marginTop;
  }

  function ensureSpace(requiredHeight) {
    if (y + requiredHeight > pageHeight - marginBottom) {
      newPage();
    }
  }

  function writeWrappedText(
    text,
    {
      font = "times",
      style = "normal",
      size = 11,
      lineHeight = 16,
      after = 10,
    } = {}
  ) {
    doc.setFont(font, style);
    doc.setFontSize(size);

    // Sanitize BEFORE measuring -- splitTextToSize computes widths from the
    // string it is given, so cleaning afterwards would still wrap using the
    // wrong widths.
    const lines = doc.splitTextToSize(toWinAnsi(text), contentWidth);

    for (const line of lines) {
      ensureSpace(lineHeight);

      doc.text(line, marginLeft, y);
      y += lineHeight;
    }

    y += after;
  }

  function writeHeading(
    text,
    {
      size = 15,
      lineHeight = 19,
      before = 12,
      after = 8,
    } = {}
  ) {
    ensureSpace(before + lineHeight + after);

    y += before;

    doc.setFont("times", "bold");
    doc.setFontSize(size);

    const lines = doc.splitTextToSize(toWinAnsi(text), contentWidth);

    for (const line of lines) {
      ensureSpace(lineHeight);
      doc.text(line, marginLeft, y);
      y += lineHeight;
    }

    y += after;
  }

  // ------------------------------------------------------------
  // TITLE
  // ------------------------------------------------------------

  writeHeading(`Literature Review: ${result.topic}`, {
    size: 20,
    lineHeight: 24,
    before: 0,
    after: 4,
  });

  // Metadata
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  const papersScanned =
    result.papers_scanned ??
    result.max_results ??
    "N/A";

  doc.setTextColor(120, 120, 120);

  doc.text(
    toWinAnsi(
      `Literature review - used ${result.sources_used} of ${papersScanned} papers scanned`
    ),
    marginLeft,
    y
  );

  doc.setTextColor(20, 20, 20);

  y += 26;

  // ------------------------------------------------------------
  // PARSE REVIEW
  // ------------------------------------------------------------

  const lines = result.review_text.split("\n");

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      y += 6;
      continue;
    }

    // Markdown heading: ## Introduction
    if (line.startsWith("## ")) {
      writeHeading(line.slice(3).trim(), {
        size: 15,
        lineHeight: 19,
        before: 12,
        after: 8,
      });
      continue;
    }

    // Numbered main heading:
    // 1. Introduction
    // 2. Key Themes
    // 3. Research Gaps
    // etc.
    if (/^\d+\.\s+[^.]+$/.test(line)) {
      writeHeading(line, {
        size: 15,
        lineHeight: 19,
        before: 12,
        after: 8,
      });
      continue;
    }

    // Numbered subsection:
    // 2.1 Hierarchical and Multi-Scale Vision Transformers
    // 2.2 Efficient Attention...
    if (/^\d+\.\d+\s+/.test(line)) {
      writeHeading(line, {
        size: 12.5,
        lineHeight: 17,
        before: 8,
        after: 6,
      });
      continue;
    }

    // Normal paragraph
    writeWrappedText(line, {
      font: "times",
      style: "normal",
      size: 11,
      lineHeight: 16,
      after: 10,
    });
  }

  // ------------------------------------------------------------
  // REFERENCES
  // ------------------------------------------------------------

  writeHeading("References", {
    size: 16,
    lineHeight: 20,
    before: 14,
    after: 10,
  });

  const references = result.references ?? [];

  if (references.length === 0) {
    writeWrappedText("No references were returned for this review.", {
      font: "helvetica",
      style: "normal",
      size: 9.5,
      lineHeight: 13,
      after: 7,
    });
  }

  references.forEach((paper, index) => {
    writeWrappedText(`${index + 1}. ${formatAPA(paper)}`, {
      font: "helvetica",
      style: "normal",
      size: 9.5,
      lineHeight: 14, // was 13 -- too tight for 9.5pt, lines visually touched
      after: 7,
    });
  });

  doc.save(fileName(result.topic, "pdf"));
}

// ------------------------------------------------------------
// MARKDOWN EXPORT
// ------------------------------------------------------------

export function exportReportAsMarkdown(result) {
  const papersScanned =
    result.papers_scanned ??
    result.max_results ??
    "N/A";

  const parts = [];

  parts.push(`# Literature Review: ${result.topic}`);
  parts.push("");
  parts.push(
    `_Literature review - used ${result.sources_used} of ${papersScanned} papers scanned_`
  );
  parts.push("");
  parts.push(result.review_text.trim());
  parts.push("");
  parts.push("## References");
  parts.push("");

  const references = result.references ?? [];

  if (references.length === 0) {
    parts.push("_No references were returned for this review._");
  } else {
    references.forEach((paper, index) => {
      parts.push(`${index + 1}. ${formatAPA(paper)}`);
    });
  }

  const markdown = parts.join("\n");

  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName(result.topic, "md");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

function fileName(topic, ext) {
  return `${topic
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase()}-review.${ext}`;
}