/**
 * Scans generated review text for parenthetical citations like
 * "(Gulshan et al., 2023)" and matches each one against the paper
 * list by first-author last name + year. Pure string matching against
 * data already returned by the backend -- no LLM call involved.
 *
 * Returns an array of segments so the renderer can turn matched
 * citations into clickable links:
 *   { type: "text", content } | { type: "citation", content, paperId }
 */

function findMatchingPaper(parenText, papers) {
  const yearMatch = parenText.match(/(19|20)\d{2}/);
  if (!yearMatch) return null;
  const year = parseInt(yearMatch[0], 10);
  const lower = parenText.toLowerCase();

  return (
    papers.find((p) => {
      if (p.year !== year) return false;
      const lastName = p.authors[0].trim().split(" ").pop().toLowerCase();
      return lastName.length > 1 && lower.includes(lastName);
    }) || null
  );
}

export function parseCitations(text, papers) {
  const parenRegex = /\([^()]{3,100}\)/g;
  const segments = [];
  let bufferStart = 0;
  let match;

  while ((match = parenRegex.exec(text)) !== null) {
    const full = match[0];
    const start = match.index;
    const paper = findMatchingPaper(full, papers);

    // Only a REAL match creates a segment boundary. A parenthetical
    // that isn't a citation -- e.g. "(TNT)" -- is left right where it
    // is, merged with the surrounding text, so it can't fracture a
    // "**bold span (TNT)**" that happens to contain it into two
    // disconnected halves.
    if (paper) {
      if (start > bufferStart) {
        segments.push({ type: "text", content: text.slice(bufferStart, start) });
      }
      segments.push({ type: "citation", content: full, paperId: paper.id });
      bufferStart = start + full.length;
    }
  }

  if (bufferStart < text.length) {
    segments.push({ type: "text", content: text.slice(bufferStart) });
  }

  return segments;
}
