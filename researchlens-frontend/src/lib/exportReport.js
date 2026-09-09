import jsPDF from "jspdf";
import { formatAPA } from "./citations";
import { parseReviewMarkdown } from "./parseReviewMarkdown";

/**
 * Bundles the review + references into a downloadable markdown file.
 * This one's easy -- the review text is already markdown, so it's
 * written through untouched.
 */
export function exportReportAsMarkdown(result) {
  const references = result.references
    .map((p, i) => `${i + 1}. ${formatAPA(p)}`)
    .join("\n");

  const content = `# ${result.topic}\n\n${result.review_text}\n\n## References\n\n${references}\n`;

  downloadBlob(content, "text/markdown", fileName(result.topic, "md"));
}

const CITATION_COLOR = [156, 90, 66]; // matches the app's --color-stamp
const BODY_COLOR = [20, 20, 20];

/**
 * Generates a real PDF client-side with jsPDF. Uses the same
 * parseReviewMarkdown() as the on-screen review, so headings/bold/
 * italic/citations render identically in both places instead of two
 * independent parsers drifting apart (which is exactly how raw "**"
 * and "###" ended up visible in the PDF before).
 *
 * jsPDF has no built-in rich-text paragraph support -- splitTextToSize
 * only works for a single font style at a time -- so mixed bold/
 * italic/normal text within one wrapped paragraph is laid out here
 * word-by-word, tracking the running x position manually.
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

  // Splits segments into text/space tokens, preserving exactly where
  // whitespace did and didn't occur -- so punctuation that directly
  // follows a word (no space in the original) doesn't get an
  // unwanted gap inserted before it during layout.
  function segmentsToTokens(segments) {
    const tokens = [];
    for (const seg of segments) {
      const style = seg.type === "bold" ? "bold" : seg.type === "italic" ? "italic" : "normal";
      const isCitation = seg.type === "citation";
      const pieces = seg.content.split(/(\s+)/).filter((p) => p.length > 0);
      for (const piece of pieces) {
        if (/^\s+$/.test(piece)) {
          tokens.push({ type: "space" });
        } else {
          tokens.push({ type: "word", text: piece, style, isCitation });
        }
      }
    }
    return tokens;
  }

  function writeRichParagraph(segments, { size = 11, font = "times", gap = 14, forceBold = false, indent = 0 } = {}) {
    const tokens = segmentsToTokens(segments);
    doc.setFont(font, forceBold ? "bold" : "normal");
    doc.setFontSize(size);
    const spaceWidth = doc.getTextWidth(" ");
    const leftEdge = margin + indent;
    const rightEdge = margin + maxWidth;

    let x = leftEdge;
    let atLineStart = true;
    ensureSpace(size * 1.4);

    if (indent > 0) {
      doc.setTextColor(...BODY_COLOR);
      doc.text("\u2022", margin + indent - 12, y);
    }

    for (const token of tokens) {
      if (token.type === "space") {
        if (!atLineStart) x += spaceWidth;
        continue;
      }

      const style = forceBold ? "bold" : token.style;
      doc.setFont(font, style);
      doc.setFontSize(size);
      const wordWidth = doc.getTextWidth(token.text);

      if (!atLineStart && x + wordWidth > rightEdge) {
        x = leftEdge;
        y += size * 1.4;
        ensureSpace(size * 1.4);
        atLineStart = true;
      }

      doc.setTextColor(...(token.isCitation ? CITATION_COLOR : BODY_COLOR));
      doc.text(token.text, x, y);
      x += wordWidth;
      atLineStart = false;
    }

    doc.setTextColor(...BODY_COLOR);
    y += size * 1.4 + gap;
  }

  function writePlainText(text, { size = 11, font = "times", style = "normal", gap = 16 } = {}) {
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
  writePlainText(result.topic, { size: 20, font: "times", style: "bold", gap: 4 });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Literature review \u00b7 used ${result.sources_used} of ${result.papers_scanned} papers scanned`,
    margin,
    y
  );
  doc.setTextColor(...BODY_COLOR);
  y += 28;

  // Body -- same parser used for the on-screen review
  const blocks = parseReviewMarkdown(result.review_text, result.references);

  const HEADING_SIZES = { 1: 16, 2: 15, 3: 13.5, 4: 12, 5: 12, 6: 12 };

  for (const block of blocks) {
    if (block.type === "heading") {
      ensureSpace(30);
      writeRichParagraph(block.segments, {
        size: HEADING_SIZES[block.level] || 13,
        font: "times",
        gap: 10,
        forceBold: true,
      });
    } else if (block.type === "list") {
      for (const itemSegments of block.items) {
        writeRichParagraph(itemSegments, { size: 11, font: "times", gap: 6, indent: 16 });
      }
      y += 8; // small extra gap after the whole list
    } else {
      writeRichParagraph(block.segments, { size: 11, font: "times", gap: 14 });
    }
  }

  // References
  ensureSpace(40);
  writePlainText("References", { size: 14, font: "times", style: "bold", gap: 10 });
  result.references.forEach((paper, i) => {
    writePlainText(`${i + 1}. ${formatAPA(paper)}`, { size: 9.5, font: "helvetica", style: "normal", gap: 8 });
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
