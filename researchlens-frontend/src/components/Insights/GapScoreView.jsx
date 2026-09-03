import { useState } from "react";
import { getGaps } from "../../lib/api";
import { IconSearch, IconCluster } from "../icons/icons";
import GapConstellation from "./GapConstellation";

export default function GapScoreView({ defaultTopic }) {
  const [topic, setTopic] = useState(defaultTopic || "");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFormula, setShowFormula] = useState(false);

  async function run(t) {
    if (!t.trim() || loading) return;
    setLoading(true);
    try {
      const res = await getGaps(t);
      setData(res);
    } finally {
      setLoading(false);
    }
  }

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
          placeholder="Topic to detect research gaps in"
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
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-ink-faint">
              <IconCluster size={14} />
              <span className="text-xs font-medium">
                {data.papers_analyzed} papers &middot; {data.n_clusters}{" "}
                clusters found
              </span>
            </div>
            <button
              onClick={() => setShowFormula((v) => !v)}
              className="text-xs text-lamp hover:underline"
            >
              {showFormula ? "Hide formula" : "How is this computed?"}
            </button>
          </div>

          {showFormula && (
            <div className="rounded-lg bg-paper-dim border border-paper-line p-4 text-xs text-ink-soft leading-relaxed">
              {data.formula_explanation}
            </div>
          )}

          <GapConstellation clusters={data.clusters} gaps={data.top_gaps} />

          <div>
            <h4 className="text-xs font-medium text-ink-soft mb-3">
              Topic clusters
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {data.clusters.map((c) => (
                <div
                  key={c.cluster_id}
                  className="rounded-lg border border-paper-line p-4"
                >
                  <p className="text-sm text-ink mb-2">
                    {c.top_terms.slice(0, 3).join(", ")}
                  </p>
                  <div className="flex gap-4 text-[11px] font-mono text-ink-faint mb-2">
                    <span>{c.size} papers</span>
                    <span>density {c.density}</span>
                    <span>~{c.avg_year}</span>
                  </div>
                  <p className="text-[11.5px] text-ink-faint leading-snug">
                    {c.sample_titles[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-ink-soft mb-3">
              Candidate research gaps
            </h4>
            <div className="space-y-2.5">
              {data.top_gaps.slice(0, 5).map((g, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-paper-line p-4 flex items-center justify-between gap-4"
                >
                  <p className="text-sm text-ink-soft">
                    <span className="text-ink">
                      {g.cluster_a_terms[0]}
                    </span>{" "}
                    <span className="text-ink-faint">&harr;</span>{" "}
                    <span className="text-ink">{g.cluster_b_terms[0]}</span>
                  </p>
                  <span className="font-mono text-xs text-lamp shrink-0">
                    {g.gap_score}
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
