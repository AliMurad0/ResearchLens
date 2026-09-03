import jsPDF from "jspdf";
import { formatAPA } from "./citations";

/**
 * Bundles the review + references into a downloadable markdown file.
 */
export function exportReportAsMarkdown(result) {
  const references = result.references
    .map((p, i) => `${i + 1}. ${formatAPA(p)}`)
    .join("\n");

  const content = `# Literature Review: ${result.topic}\n\n${result.review_text}\n\n## References\n\n${references}\n`;

  downloadBlob(content, "text/markdown", fileName(result.topic, "md"));
}

/**
 * Generates a real PDF client-side with jsPDF -- proper pagination,
 * heading styles, and wrapped body text. No server round-trip needed.
 * (Your backend's review/exporter.py already does docx/PDF generation
 * server-side too, once connected -- this is the frontend-only path.)
 */
export function exportReportAsPDF(result) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 56;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  function ensureSpace(lineHeight) {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  }

  function writeParagraph(text, { size = 11, font = "times", style = "normal", gap = 16 } = {}) {
    doc.setFont(font, style);
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, maxWidth);
    for (const line of lines) {
      ensureSpace(size * 1.4);
      doc.text(line, margin, y);
      y += size * 1.4;
    }
    y += gap;
  }

  // Title
  doc.setFont("times", "bold");
  doc.setFontSize(20);
  const titleLines = doc.splitTextToSize(result.topic, maxWidth);
  titleLines.forEach((line) => {
    doc.text(line, margin, y);
    y += 26;
  });
  y += 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Literature review · used ${result.sources_used} of ${result.papers_scanned} papers scanned`,
    margin,
    y
  );
  doc.setTextColor(20, 20, 20);
  y += 28;

  // Body -- split on the same lightweight "## Heading" markdown used on screen
  const blocks = result.review_text.split("\n").reduce((acc, line) => {
    if (line.startsWith("## ")) {
      acc.push({ type: "heading", content: line.slice(3).trim() });
    } else if (line.trim() === "") {
      acc.push({ type: "gap" });
    } else {
      const last = acc[acc.length - 1];
      if (last && last.type === "paragraph") last.content += " " + line.trim();
      else acc.push({ type: "paragraph", content: line.trim() });
    }
    return acc;
  }, []).filter((b) => b.type !== "gap");

  for (const block of blocks) {
    if (block.type === "heading") {
      ensureSpace(30);
      writeParagraph(block.content, { size: 14, font: "times", style: "bold", gap: 10 });
    } else {
      writeParagraph(block.content, { size: 11, font: "times", style: "normal", gap: 14 });
    }
  }

  // References
  ensureSpace(40);
  writeParagraph("References", { size: 14, font: "times", style: "bold", gap: 10 });
  result.references.forEach((paper, i) => {
    writeParagraph(`${i + 1}. ${formatAPA(paper)}`, { size: 9.5, font: "helvetica", style: "normal", gap: 8 });
  });

  doc.save(fileName(result.topic, "pdf"));
}

function fileName(topic, ext) {
  return `${topic.replace(/\s+/g, "-").toLowerCase()}-review.${ext}`;
}

function downloadBlob(content, type, name) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

