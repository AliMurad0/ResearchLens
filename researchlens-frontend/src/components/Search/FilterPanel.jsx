import { IconSliders } from "../icons/icons";

export default function FilterPanel({ filters, onChange, open, onToggleOpen }) {
  const set = (patch) => onChange({ ...filters, ...patch });

  return (
    <div className="w-full max-w-xl">
      <button
        onClick={onToggleOpen}
        className="flex items-center gap-1.5 text-xs text-ink-faint hover:text-ink-soft transition-colors mx-auto"
      >
        <IconSliders size={13} />
        {open ? "Hide filters" : "Filters"}
      </button>

      {open && (
        <div className="mt-4 rounded-xl border border-paper-line bg-surface/70 p-5 grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-ink-soft">
                Papers to scan
              </label>
              <span className="font-mono text-xs text-lamp">
                {filters.maxResults}
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={100}
              step={5}
              value={filters.maxResults}
              onChange={(e) => set({ maxResults: Number(e.target.value) })}
              className="w-full accent-lamp"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ink-soft block mb-1.5">
              Mode
            </label>
            <div className="flex rounded-lg border border-paper-line overflow-hidden text-xs">
              <button
                onClick={() => set({ fastMode: true })}
                className={`flex-1 py-2 transition-colors ${
                  filters.fastMode
                    ? "bg-lamp text-paper"
                    : "bg-surface text-ink-soft hover:bg-paper-dim"
                }`}
              >
                Quick
              </button>
              <button
                onClick={() => set({ fastMode: false })}
                className={`flex-1 py-2 transition-colors ${
                  !filters.fastMode
                    ? "bg-lamp text-paper"
                    : "bg-surface text-ink-soft hover:bg-paper-dim"
                }`}
              >
                Detailed
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-ink-soft block mb-1.5">
              Min. citations
            </label>
            <input
              type="number"
              min={0}
              value={filters.minCitations}
              onChange={(e) => set({ minCitations: Number(e.target.value) })}
              className="w-full rounded-lg border border-paper-line px-2.5 py-1.5 text-sm outline-none focus:border-lamp"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-ink-soft block mb-1.5">
              Year range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={filters.yearRange[0]}
                onChange={(e) =>
                  set({ yearRange: [Number(e.target.value), filters.yearRange[1]] })
                }
                className="w-full rounded-lg border border-paper-line px-2.5 py-1.5 text-sm outline-none focus:border-lamp"
              />
              <span className="text-ink-faint text-xs">to</span>
              <input
                type="number"
                value={filters.yearRange[1]}
                onChange={(e) =>
                  set({ yearRange: [filters.yearRange[0], Number(e.target.value)] })
                }
                className="w-full rounded-lg border border-paper-line px-2.5 py-1.5 text-sm outline-none focus:border-lamp"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
