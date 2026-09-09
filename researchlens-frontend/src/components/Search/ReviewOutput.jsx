import { parseReviewMarkdown } from "../../lib/parseReviewMarkdown";

const HEADING_STYLES = {
  1: "font-serif text-2xl text-ink pt-4 first:pt-0",
  2: "font-serif text-xl text-ink pt-4 first:pt-0",
  3: "font-serif text-lg text-ink pt-3 first:pt-0",
  4: "font-serif text-base font-medium text-ink-soft pt-2 first:pt-0",
  5: "font-serif text-base font-medium text-ink-soft pt-2 first:pt-0",
  6: "font-serif text-base font-medium text-ink-soft pt-2 first:pt-0",
};

function Segment({ seg, onCiteClick }) {
  if (seg.type === "citation") {
    return (
      <button
        onClick={() => onCiteClick(seg.paperId)}
        className="text-stamp hover:underline decoration-stamp/50 underline-offset-2 font-sans text-[14px] align-baseline"
      >
        {seg.content}
      </button>
    );
  }
  if (seg.type === "bold") return <strong className="font-semibold text-ink">{seg.content}</strong>;
  if (seg.type === "italic") return <em>{seg.content}</em>;
  return <>{seg.content}</>;
}

function Paragraph({ segments, onCiteClick }) {
  return (
    <p className="text-[15.5px] leading-[1.85] text-ink-soft font-serif">
      {segments.map((seg, i) => (
        <Segment key={i} seg={seg} onCiteClick={onCiteClick} />
      ))}
    </p>
  );
}

function Heading({ level, segments }) {
  const Tag = `h${Math.min(level + 1, 6)}`; // review's level-1 heading renders as h2, since h1 is the topic title above
  return (
    <Tag className={HEADING_STYLES[level] || HEADING_STYLES[3]}>
      {segments.map((seg, i) => (
        <Segment key={i} seg={seg} onCiteClick={() => {}} />
      ))}
    </Tag>
  );
}

function List({ items, onCiteClick }) {
  return (
    <ul className="list-disc pl-5 space-y-2 marker:text-ink-faint">
      {items.map((segments, i) => (
        <li key={i} className="text-[15.5px] leading-[1.85] text-ink-soft font-serif">
          {segments.map((seg, j) => (
            <Segment key={j} seg={seg} onCiteClick={onCiteClick} />
          ))}
        </li>
      ))}
    </ul>
  );
}

export default function ReviewOutput({ result, onCiteClick }) {
  const blocks = parseReviewMarkdown(result.review_text, result.references);

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
        {blocks.map((block, i) => {
          if (block.type === "heading") {
            return <Heading key={i} level={block.level} segments={block.segments} />;
          }
          if (block.type === "list") {
            return <List key={i} items={block.items} onCiteClick={onCiteClick} />;
          }
          return <Paragraph key={i} segments={block.segments} onCiteClick={onCiteClick} />;
        })}
      </div>
    </div>
  );
}
