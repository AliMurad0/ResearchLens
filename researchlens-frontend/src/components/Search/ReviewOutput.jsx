import { parseCitations } from "../../lib/parseCitations";

/**
 * Minimal renderer for the review's lightweight markdown:
 *   "## Heading"  -> section heading
 *   blank-line-separated blocks -> paragraphs
 * Citations inside paragraphs are parsed and turned into clickable
 * links that jump to the matching paper in the Preview Papers tab.
 */
function renderBlocks(text) {
  return text
    .split("\n")
    .reduce((blocks, line) => {
      if (line.startsWith("## ")) {
        blocks.push({ type: "heading", content: line.slice(3).trim() });
      } else if (line.trim() === "") {
        blocks.push({ type: "gap" });
      } else {
        const last = blocks[blocks.length - 1];
        if (last && last.type === "paragraph") {
          last.content += " " + line.trim();
        } else {
          blocks.push({ type: "paragraph", content: line.trim() });
        }
      }
      return blocks;
    }, [])
    .filter((b) => b.type !== "gap");
}

function Paragraph({ content, papers, onCiteClick }) {
  const segments = parseCitations(content, papers);
  return (
    <p className="text-[15.5px] leading-[1.85] text-ink-soft font-serif">
      {segments.map((seg, i) =>
        seg.type === "citation" ? (
          <button
            key={i}
            onClick={() => onCiteClick(seg.paperId)}
            className="text-stamp hover:underline decoration-stamp/50 underline-offset-2 font-sans text-[14px] align-baseline"
          >
            {seg.content}
          </button>
        ) : (
          <span key={i}>{seg.content}</span>
        )
      )}
    </p>
  );
}

export default function ReviewOutput({ result, onCiteClick }) {
  const blocks = renderBlocks(result.review_text);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="border-t border-ink pt-5 mb-8 flex items-baseline justify-between flex-wrap gap-2">
        <h2 className="font-serif text-2xl text-ink capitalize">
          {result.topic}
        </h2>
        <span className="font-mono text-xs text-ink-faint">
          Used {result.sources_used} of {result.papers_scanned} papers scanned
        </span>
      </div>

      <div className="space-y-5">
        {blocks.map((block, i) =>
          block.type === "heading" ? (
            <h3
              key={i}
              className="font-serif text-lg text-ink pt-3 first:pt-0"
            >
              {block.content}
            </h3>
          ) : (
            <Paragraph
              key={i}
              content={block.content}
              papers={result.references}
              onCiteClick={onCiteClick}
            />
          )
        )}
      </div>
    </div>
  );
}
