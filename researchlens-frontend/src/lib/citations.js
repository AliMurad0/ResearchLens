/**
 * Pure string formatting from paper metadata. No API calls, no LLM --
 * these are deterministic academic citation formats.
 */

function lastNameFirst(author) {
  // "R. Gulshan" -> "Gulshan, R."
  const parts = author.trim().split(" ");
  if (parts.length < 2) return author;
  const last = parts[parts.length - 1];
  const initials = parts.slice(0, -1).join(" ");
  return `${last}, ${initials}`;
}

// OpenAlex returns doi as a full URL ("https://doi.org/10.1001/...");
// mock data and some other sources use a bare DOI ("10.1001/...").
// These two helpers normalize either form so nothing downstream has
// to know or care which one it received.
function bareDoi(doi) {
  if (!doi) return "";
  return doi.replace(/^https?:\/\/doi\.org\//i, "");
}

export function doiUrl(doi) {
  if (!doi) return "";
  return doi.startsWith("http") ? doi : `https://doi.org/${doi}`;
}

function safeYear(paper) {
  return paper.year || "n.d.";
}

function bibtexYear(paper) {
  return paper.year || "nd";
}

function safeVenue(paper) {
  return paper.venue || null;
}

export function formatAPA(paper) {
  const authorList =
    paper.authors.length > 1
      ? paper.authors.slice(0, -1).map(lastNameFirst).join(", ") +
        ", & " +
        lastNameFirst(paper.authors[paper.authors.length - 1])
      : lastNameFirst(paper.authors[0]);
  const doiPart = paper.doi ? ` ${doiUrl(paper.doi)}` : "";
  const venue = safeVenue(paper);
  const venuePart = venue ? ` ${venue}.` : "";
  return `${authorList} (${safeYear(paper)}). ${paper.title}.${venuePart}${doiPart}`;
}

export function formatMLA(paper) {
  const first = lastNameFirst(paper.authors[0]);
  const etAl = paper.authors.length > 1 ? ", et al." : ".";
  const doiPart = paper.doi ? ` doi:${bareDoi(paper.doi)}.` : "";
  const venue = safeVenue(paper);
  const venuePart = venue ? `${venue}, ` : "";
  const year = safeYear(paper);
  const yearPart = year.endsWith(".") ? year : `${year}.`;
  return `${first}${etAl} "${paper.title}." ${venuePart}${yearPart}${doiPart}`;
}

function bibtexKey(paper) {
  const lastName = paper.authors[0].trim().split(" ").pop().replace(/[^a-zA-Z]/g, "");
  return `${lastName}${bibtexYear(paper)}`;
}

export function formatBibTeX(paper) {
  const key = bibtexKey(paper);
  const authors = paper.authors.join(" and ");
  return `@article{${key},
  author  = {${authors}},
  title   = {${paper.title}},
  journal = {${safeVenue(paper) || ""}},
  year    = {${safeYear(paper)}},
  doi     = {${bareDoi(paper.doi)}}
}`;
}

export function formatCitation(paper, style) {
  if (style === "mla") return formatMLA(paper);
  if (style === "bibtex") return formatBibTeX(paper);
  return formatAPA(paper);
}
