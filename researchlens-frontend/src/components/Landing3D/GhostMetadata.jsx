const LABELS = [
  { text: "RESEARCH INDEX / 01", className: "top-6 left-6" },
  { text: "127 PAPERS", className: "top-6 right-6 text-right" },
  { text: "CITATION NETWORK", className: "bottom-6 left-6" },
  { text: "EVIDENCE · LITERATURE · 2026", className: "bottom-6 right-6 text-right" },
];

export default function GhostMetadata() {
  return (
    <div className="absolute inset-0 pointer-events-none hidden sm:block" aria-hidden="true">
      {LABELS.map((l) => (
        <span
          key={l.text}
          className={`absolute font-mono text-[9px] tracking-[0.15em] text-ink/10 ${l.className}`}
        >
          {l.text}
        </span>
      ))}
    </div>
  );
}
