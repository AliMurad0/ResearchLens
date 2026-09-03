import { useState } from "react";
import { compareTopics } from "../../lib/api";
import { IconScales } from "../icons/icons";

export default function CompareTopics({ defaultTopic }) {
  const [topicA, setTopicA] = useState(defaultTopic || "");
  const [topicB, setTopicB] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!topicA.trim() || !topicB.trim() || loading) return;
    setLoading(true);
    try {
      const res = await compareTopics(topicA, topicB);
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
          run();
        }}
        className="max-w-xl mx-auto mb-10"
      >
        <div className="flex items-center gap-3">
          <input
            value={topicA}
            onChange={(e) => setTopicA(e.target.value)}
            placeholder="Topic A"
            className="flex-1 rounded-full border border-paper-line bg-surface px-4 py-2.5 text-sm outline-none focus:border-lamp/50 shadow-card lamp-glow"
          />
          <IconScales size={16} className="text-ink-faint shrink-0" />
          <input
            value={topicB}
            onChange={(e) => setTopicB(e.target.value)}
            placeholder="Topic B"
            className="flex-1 rounded-full border border-paper-line bg-surface px-4 py-2.5 text-sm outline-none focus:border-lamp/50 shadow-card lamp-glow"
          />
        </div>
        <button
          type="submit"
          disabled={!topicA.trim() || !topicB.trim() || loading}
          className="mt-4 mx-auto block rounded-full bg-lamp text-paper text-sm px-5 py-2 disabled:opacity-40"
        >
          {loading ? "Comparing..." : "Compare"}
        </button>
      </form>

      {data && (
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex items-center justify-between border-t border-ink pt-4">
            <p className="font-serif text-lg text-ink capitalize">
              {data.topic_a} <span className="text-ink-faint">vs.</span>{" "}
              {data.topic_b}
            </p>
            <span className="font-mono text-xs text-ink-faint">
              overlap {Math.round(data.overlap_score * 100)}%
            </span>
          </div>

          <div>
            <h4 className="text-xs font-medium text-ink-soft mb-2.5">
              Shared themes
            </h4>
            <ul className="space-y-1.5">
              {data.shared_themes.map((t, i) => (
                <li key={i} className="text-sm text-ink-soft">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs font-medium text-ink-soft mb-2.5 capitalize">
                Distinct to {data.topic_a}
              </h4>
              <ul className="space-y-1.5">
                {data.distinct_to_a.map((t, i) => (
                  <li key={i} className="text-sm text-ink-faint">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-medium text-ink-soft mb-2.5 capitalize">
                Distinct to {data.topic_b}
              </h4>
              <ul className="space-y-1.5">
                {data.distinct_to_b.map((t, i) => (
                  <li key={i} className="text-sm text-ink-faint">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-lg bg-lamp-tint p-4">
            <h4 className="text-xs font-medium text-lamp mb-1.5">
              Bridging opportunity
            </h4>
            <p className="text-sm text-ink-soft leading-relaxed">
              {data.bridging_opportunity}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
