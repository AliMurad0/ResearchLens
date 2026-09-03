import { useState } from "react";
import { getTrends } from "../../lib/api";
import { IconSearch, IconTrend } from "../icons/icons";

export default function TrendsView({ defaultTopic }) {
  const [topic, setTopic] = useState(defaultTopic || "");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function run(t) {
    if (!t.trim() || loading) return;
    setLoading(true);
    try {
      const res = await getTrends(t);
      setData(res);
    } finally {
      setLoading(false);
    }
  }

  const maxCount = data
    ? Math.max(...data.year_counts.map((y) => y.count))
    : 1;

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(topic);
        }}
        className="flex items-center gap-2 rounded-full border border-paper-line bg-surface px-4 py-2 shadow-card lamp-glow max-w-md mx-auto mb-10"
      >
        <IconSearch size={15} className="text-ink-faint shrink-0" />
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic to analyze trends for"
          className="flex-1 outline-none text-sm bg-transparent"
        />
        <button
          type="submit"
          disabled={!topic.trim() || loading}
          className="rounded-full bg-lamp text-paper text-xs px-3.5 py-1.5 disabled:opacity-40"
        >
          {loading ? "..." : "Analyze"}
        </button>
      </form>

      {data && (
        <div className="space-y-10">
          <div>
            <div className="flex items-center gap-1.5 text-ink-faint mb-4">
              <IconTrend size={14} />
              <span className="text-xs font-medium">
                Papers per year &middot; {data.papers_analyzed} analyzed
              </span>
            </div>
            <div className="flex items-end gap-3 px-1">
              {data.year_counts.map((y) => (
                <div key={y.year} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full h-28 flex items-end">
                    <div
                      className="w-full rounded-t-sm bg-lamp/70 min-h-[3px]"
                      style={{ height: `${(y.count / maxCount) * 100}%` }}
                      title={`${y.count} papers`}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-ink-faint">
                    {y.year}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 px-1 mt-1">
              {data.year_counts.map((y) => (
                <span
                  key={y.year}
                  className="flex-1 text-center font-mono text-[10px] text-ink-faint/70"
                >
                  {y.count}
                </span>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs font-medium text-ink-soft mb-2.5">
                Emerging keywords
              </h4>
              <ul className="space-y-1.5">
                {data.emerging_keywords.map((k) => (
                  <li
                    key={k}
                    className="text-sm text-ink-soft flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-lamp shrink-0" />
                    {k}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-medium text-ink-soft mb-2.5">
                Saturated keywords
              </h4>
              <ul className="space-y-1.5">
                {data.saturated_keywords.map((k) => (
                  <li
                    key={k}
                    className="text-sm text-ink-faint flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-ink-faint/50 shrink-0" />
                    {k}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-ink-soft mb-2.5">
              Top authors
            </h4>
            <div className="border-t border-paper-line">
              {data.top_authors.map((a) => (
                <div
                  key={a.name}
                  className="flex justify-between py-2 border-b border-paper-line text-sm"
                >
                  <span className="text-ink-soft">{a.name}</span>
                  <span className="font-mono text-xs text-ink-faint">
                    {a.paper_count} papers
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
