import { useState } from "react";
import { IconSearch } from "../icons/icons";
import FilterPanel from "./FilterPanel";
import LoadingProgress from "./LoadingProgress";
import ReviewOutput from "./ReviewOutput";
import { generateReview } from "../../lib/api";

const EXAMPLE_TOPICS = [
  "diabetic retinopathy deep learning",
  "large language models in education",
  "CRISPR gene editing safety",
];

const DEFAULT_FILTERS = {
  maxResults: 40,
  fastMode: false,
  yearRange: [2018, 2026],
  minCitations: 0,
};

export default function SearchTab({ result, onResult, onCiteClick }) {
  const [topic, setTopic] = useState(result?.topic ?? "");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("");
  const [error, setError] = useState(null);

  async function runSearch(searchTopic) {
    if (!searchTopic.trim() || loading) return;
    setError(null);
    setLoading(true);
    try {
      const data = await generateReview(searchTopic, filters, setStage);
      onResult(searchTopic, data);
    } catch (e) {
      setError(e.message || "Something went wrong generating this review.");
    } finally {
      setLoading(false);
      setStage("");
    }
  }

  return (
    <div className="px-6 py-14">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="font-serif text-3xl text-ink mb-2">
          {result ? "Search another topic" : "Enter a research topic"}
        </h1>
        <p className="text-sm text-ink-faint mb-8">
          Scans real papers and writes a grounded literature review with
          in-text citations.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch(topic);
          }}
          className="flex items-center gap-2 rounded-full border border-paper-line bg-surface px-4 py-2.5 shadow-card focus-within:border-lamp/50 lamp-glow transition-colors"
        >
          <IconSearch size={16} className="text-ink-faint shrink-0" />
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. graph neural networks for drug discovery"
            className="flex-1 outline-none text-sm bg-transparent placeholder:text-ink-faint/70"
          />
          <button
            type="submit"
            disabled={!topic.trim() || loading}
            className="rounded-full bg-lamp text-paper text-sm px-4 py-1.5 disabled:opacity-40 hover:bg-lamp-light transition-colors"
          >
            Search
          </button>
        </form>

        {!result && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {EXAMPLE_TOPICS.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTopic(t);
                  runSearch(t);
                }}
                className="text-xs text-ink-faint border border-paper-line rounded-full px-3 py-1.5 hover:border-lamp/40 hover:text-lamp transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            open={filtersOpen}
            onToggleOpen={() => setFiltersOpen((v) => !v)}
          />
        </div>

        {error && (
          <p className="mt-4 text-sm text-stamp">{error}</p>
        )}
      </div>

      {loading && <LoadingProgress stage={stage} />}

      {!loading && result && (
        <div className="mt-14">
          <ReviewOutput result={result} onCiteClick={onCiteClick} />
        </div>
      )}
    </div>
  );
}
