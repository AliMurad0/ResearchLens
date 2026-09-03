import { useState } from "react";
import CompareTopics from "./CompareTopics";
import TrendsView from "./TrendsView";
import GapScoreView from "./GapScoreView";

const VIEWS = [
  { id: "compare", label: "Compare topics" },
  { id: "trends", label: "Trends" },
  { id: "gaps", label: "Gap score" },
];

export default function InsightsTab({ defaultTopic }) {
  const [view, setView] = useState("compare");

  return (
    <div className="px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-full border border-paper-line bg-surface p-1 shadow-card">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-colors ${
                  view === v.id
                    ? "bg-lamp text-paper"
                    : "text-ink-faint hover:text-ink-soft"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {view === "compare" && <CompareTopics defaultTopic={defaultTopic} />}
        {view === "trends" && <TrendsView defaultTopic={defaultTopic} />}
        {view === "gaps" && <GapScoreView defaultTopic={defaultTopic} />}
      </div>
    </div>
  );
}
