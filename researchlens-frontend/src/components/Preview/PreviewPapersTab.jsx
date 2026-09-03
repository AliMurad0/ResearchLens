import { useState, useRef, useEffect } from "react";
import PaperRow from "./PaperRow";
import HoverPreviewCard from "./HoverPreviewCard";

export default function PreviewPapersTab({ result, highlightedPaperId }) {
  const [hoveredPaper, setHoveredPaper] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const rowRefs = useRef({});

  useEffect(() => {
    if (highlightedPaperId && rowRefs.current[highlightedPaperId]) {
      rowRefs.current[highlightedPaperId].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedPaperId]);

  if (!result) {
    return (
      <div className="px-6 py-24 text-center">
        <p className="text-ink-faint text-sm">
          Run a search first — the papers behind your review will show up
          here.
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="font-serif text-2xl text-ink capitalize">
            Source papers
          </h2>
          <span className="font-mono text-xs text-ink-faint">
            {result.references.length} papers
          </span>
        </div>
        <p className="text-sm text-ink-faint mb-6">
          Hover a paper to preview it. Click to open the source.
        </p>

        <div>
          {result.references.map((paper) => (
            <PaperRow
              key={paper.id}
              ref={(el) => (rowRefs.current[paper.id] = el)}
              paper={paper}
              highlighted={paper.id === highlightedPaperId}
              onHoverStart={(p, e) => {
                setHoveredPaper(p);
                setMousePos({ x: e.clientX, y: e.clientY });
              }}
              onHoverMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
              onHoverEnd={() => setHoveredPaper(null)}
            />
          ))}
        </div>
      </div>

      <HoverPreviewCard paper={hoveredPaper} position={mousePos} />
    </div>
  );
}
