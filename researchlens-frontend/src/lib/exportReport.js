import jsPDF from "jspdf";
import { formatAPA } from "./citations";

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

    const lines = doc.splitTextToSize(text, contentWidth);

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

    const lines = doc.splitTextToSize(text, contentWidth);

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
    `Literature review - used ${result.sources_used} of ${papersScanned} papers scanned`,
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

  result.references.forEach((paper, index) => {
    writeWrappedText(`${index + 1}. ${formatAPA(paper)}`, {
      font: "helvetica",
      style: "normal",
      size: 9.5,
      lineHeight: 13,
      after: 7,
    });
  });

  doc.save(fileName(result.topic, "pdf"));
}

function fileName(topic, ext) {
  return `${topic
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase()}-review.${ext}`;
}