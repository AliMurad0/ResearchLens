/**
 * A shared "markdown-lite" parser for the LLM-generated review text.
 * Used by BOTH ReviewOutput.jsx (on-screen) and exportReport.js (PDF),
 * so the two can never drift out of sync again -- that mismatch was
 * exactly how raw "**" and "###" ended up visible on screen and in
 * the PDF: two separate ad-hoc parsers, each handling a different
 * subset of the actual markdown the backend produces.
 *
 * Handles:
 *   - Headings: any of # through ###### (not just "## ")
 *   - Horizontal rules ("---", "***", "___" alone on a line) -- skipped
 *   - List items ("- " or "* " at the start of a line)
 *   - Inline **bold** and *italic*
 *   - In-text (Author, Year) citations -- reuses parseCitations. Only
 *     a REAL match (a parenthetical that actually resolves to a known
 *     paper) creates a segment boundary; a non-citation parenthetical
 *     like "(TNT)" is left merged with its surrounding text. This
 *     matters because otherwise a bold span containing an abbreviation
 *     -- "**Transformer in Transformer (TNT)**" -- would get its
 *     "(TNT)" carved out into its own segment, severing the "**...**"
 *     pair across two segments that can no longer see each other,
 *     leaving both halves as literal asterisks.
 *
 * Output shape: array of blocks --
 *   { type: "heading", level: 1-6, segments }
 *   { type: "paragraph", segments }
 *   { type: "list", items: [segments, segments, ...] }
 * where segments is an array of:
 *   { type: "text", content }
 *   { type: "bold", content }
 *   { type: "italic", content }
 *   { type: "citation", content, paperId }
 */

import { parseCitations } from "./parseCitations.js";

const HR_PATTERN = /^(-{3,}|\*{3,}|_{3,})$/;
const HEADING_PATTERN = /^(#{1,6})\s+(.*)$/;
const LIST_ITEM_PATTERN = /^[-*]\s+(.*)$/;

function splitIntoRawBlocks(text) {
  const lines = text.split("\n");
  const blocks = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    const headingMatch = line.match(HEADING_PATTERN);
    if (headingMatch) {
      blocks.push({ type: "heading", level: headingMatch[1].length, content: headingMatch[2].trim() });
      continue;
    }
    if (HR_PATTERN.test(line) || line === "") {
      continue; // horizontal rules and blank lines are separators, not content
    }

    // A list marker is "-" or "*" followed by whitespace -- checked
    // AFTER the HR test above (so a lone "---" isn't mistaken for a
    // list item) and naturally never matches "**bold**", since a
    // second "*" immediately follows the first with no space there.
    const listMatch = line.match(LIST_ITEM_PATTERN);
    if (listMatch) {
      const last = blocks[blocks.length - 1];
      if (last && last.type === "list") {
        last.items.push(listMatch[1].trim());
      } else {
        blocks.push({ type: "list", items: [listMatch[1].trim()] });
      }
      continue;
    }

    const last = blocks[blocks.length - 1];
    if (last && last.type === "paragraph") {
      last.content += " " + line;
    } else {
      blocks.push({ type: "paragraph", content: line });
    }
  }

  return blocks;
}

// Splits a plain-text segment into text/bold/italic tokens.
function tokenizeInline(text) {
  const tokens = [];
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      tokens.push({ type: "bold", content: match[1] });
    } else {
      tokens.push({ type: "italic", content: match[2] });
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push({ type: "text", content: text.slice(lastIndex) });
  }
  return tokens;
}

function stripMarkdownMarkers(text) {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
}

// Runs citation-detection first (so parenthetical blobs stay intact),
// then tokenizes bold/italic within the surrounding plain text.
function buildSegments(rawText, papers) {
  const citationSegments = parseCitations(rawText, papers);
  const segments = [];

  for (const seg of citationSegments) {
    if (seg.type === "citation") {
      segments.push({
        type: "citation",
        content: stripMarkdownMarkers(seg.content),
        paperId: seg.paperId,
      });
    } else {
      segments.push(...tokenizeInline(seg.content));
    }
  }

  return segments;
}

export function parseReviewMarkdown(text, papers) {
  const rawBlocks = splitIntoRawBlocks(text);
  return rawBlocks.map((block) => {
    if (block.type === "list") {
      return {
        type: "list",
        items: block.items.map((item) => buildSegments(item, papers)),
      };
    }
    return {
      type: block.type,
      level: block.level,
      segments: buildSegments(block.content, papers),
    };
  });
}
