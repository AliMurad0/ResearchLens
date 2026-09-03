import { motion, AnimatePresence } from "framer-motion";
import { IconExternal } from "../icons/icons";
import { doiUrl } from "../../lib/citations";
import CitationBlock from "./CitationBlock";

export default function HoverPreviewCard({ paper, position }) {
  const hasLink = Boolean(paper?.doi);

  return (
    <AnimatePresence>
      {paper && (
        <motion.div
          key={paper.id}
          initial={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed z-50 w-80 pointer-events-none hidden lg:block"
          style={{
            left: Math.min(position.x + 24, window.innerWidth - 340),
            top: Math.min(position.y - 40, window.innerHeight - 340),
          }}
        >
          <div className="pointer-events-auto rounded-lg border border-paper-line bg-surface shadow-float p-4">
            <p className="font-serif text-[15px] leading-snug text-ink mb-1.5">
              {paper.title}
            </p>
            <p className="text-xs text-ink-faint mb-2.5">
              {paper.authors.join(", ")}
              {paper.venue ? ` \u00b7 ${paper.venue}` : ""} &middot; {paper.year}
            </p>
            <p className="text-[12.5px] leading-relaxed text-ink-soft mb-3 line-clamp-4">
              {paper.abstract || "No abstract available for this paper."}
            </p>

            {hasLink && (
              <a
                href={doiUrl(paper.doi)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11.5px] text-lamp hover:underline mb-3"
              >
                Open source <IconExternal size={11} />
              </a>
            )}

            <CitationBlock paper={paper} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
