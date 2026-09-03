import { forwardRef } from "react";
import { doiUrl } from "../../lib/citations";
import { IconExternal } from "../icons/icons";

const PaperRow = forwardRef(function PaperRow(
  { paper, highlighted, onHoverStart, onHoverMove, onHoverEnd },
  ref
) {
  const hasLink = Boolean(paper.doi);
  const Tag = hasLink ? "a" : "div";
  const linkProps = hasLink
    ? { href: doiUrl(paper.doi), target: "_blank", rel: "noreferrer" }
    : {};

  return (
    <Tag
      ref={ref}
      {...linkProps}
      onMouseEnter={(e) => onHoverStart(paper, e)}
      onMouseMove={(e) => onHoverMove(e)}
      onMouseLeave={onHoverEnd}
      className={`group flex items-center justify-between gap-6 py-3.5 border-b border-paper-line transition-colors ${
        hasLink ? "" : "cursor-default"
      } ${highlighted ? "bg-lamp-tint" : "hover:bg-paper-dim/60"}`}
    >
      <span className="text-sm text-ink-soft group-hover:text-ink transition-colors truncate flex items-center gap-1.5">
        {paper.title}
        {hasLink && (
          <IconExternal
            size={11}
            className="opacity-0 group-hover:opacity-60 transition-opacity shrink-0"
          />
        )}
      </span>
      <span className="text-xs text-ink-faint shrink-0 font-mono">
        {paper.venue} &middot; {paper.year}
      </span>
    </Tag>
  );
});

export default PaperRow;
