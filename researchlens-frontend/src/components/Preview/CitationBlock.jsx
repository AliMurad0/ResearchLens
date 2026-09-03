import { useState } from "react";
import { formatCitation } from "../../lib/citations";
import { IconCopy, IconCheck } from "../icons/icons";

const STYLES = [
  { id: "apa", label: "APA" },
  { id: "mla", label: "MLA" },
  { id: "bibtex", label: "BibTeX" },
];

export default function CitationBlock({ paper }) {
  const [style, setStyle] = useState("apa");
  const [copied, setCopied] = useState(false);

  const text = formatCitation(paper, style);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable -- silently ignore, text is still selectable
    }
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-1 mb-1.5">
        {STYLES.map((s) => (
          <button
            key={s.id}
            onClick={() => setStyle(s.id)}
            className={`text-[10.5px] px-2 py-0.5 rounded-full border transition-colors ${
              style === s.id
                ? "bg-lamp text-paper border-lamp"
                : "border-paper-line text-ink-faint hover:text-ink-soft"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="relative">
        <pre className="whitespace-pre-wrap break-words text-[11px] leading-relaxed font-mono bg-paper-dim rounded-md p-2.5 pr-8 text-ink-soft">
          {text}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-1.5 right-1.5 p-1 rounded text-ink-faint hover:text-lamp"
          aria-label="Copy citation"
        >
          {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
        </button>
      </div>
    </div>
  );
}
