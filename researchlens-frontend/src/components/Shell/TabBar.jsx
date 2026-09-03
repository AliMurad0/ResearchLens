import { useState, useRef, useEffect } from "react";
import { IconSearch, IconStack, IconCompass, IconDownload, IconChevronDown } from "../icons/icons";

const TABS = [
  { id: "search", label: "Search", Icon: IconSearch },
  { id: "preview", label: "Preview Papers", Icon: IconStack },
  { id: "insights", label: "Insights", Icon: IconCompass },
];

function ExportMenu({ onExportPDF, onExportMarkdown }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-ink-faint hover:text-lamp transition-colors py-3.5"
      >
        <IconDownload size={13} />
        Export report
        <IconChevronDown size={11} className={open ? "rotate-180" : ""} />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-20 w-40 rounded-lg border border-paper-line bg-surface shadow-float p-1">
          <button
            onClick={() => {
              onExportPDF();
              setOpen(false);
            }}
            className="w-full text-left px-2.5 py-2 rounded-md text-sm text-ink-soft hover:bg-paper-dim transition-colors"
          >
            Export as PDF
          </button>
          <button
            onClick={() => {
              onExportMarkdown();
              setOpen(false);
            }}
            className="w-full text-left px-2.5 py-2 rounded-md text-sm text-ink-soft hover:bg-paper-dim transition-colors"
          >
            Export as Markdown
          </button>
        </div>
      )}
    </div>
  );
}

export default function TabBar({
  active,
  onChange,
  disabled,
  onExportPDF,
  onExportMarkdown,
  exportEnabled,
}) {
  return (
    <div className="sticky top-0 z-30 bg-paper/85 backdrop-blur-sm border-b border-paper-line">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
        <nav className="flex gap-1">
          {TABS.map(({ id, label, Icon }) => {
            const isActive = active === id;
            const isDisabled = disabled && id !== "search";
            return (
              <button
                key={id}
                disabled={isDisabled}
                onClick={() => onChange(id)}
                className={`relative flex items-center gap-1.5 px-4 py-3.5 text-sm transition-colors ${
                  isDisabled
                    ? "text-ink-faint/50 cursor-not-allowed"
                    : isActive
                    ? "text-ink"
                    : "text-ink-faint hover:text-ink-soft"
                }`}
              >
                <Icon size={15} />
                {label}
                {isActive && (
                  <span className="absolute left-4 right-4 -bottom-px h-[2px] bg-lamp rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
        {exportEnabled && (
          <ExportMenu onExportPDF={onExportPDF} onExportMarkdown={onExportMarkdown} />
        )}
      </div>
    </div>
  );
}
