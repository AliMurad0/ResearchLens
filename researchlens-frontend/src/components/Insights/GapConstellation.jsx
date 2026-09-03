import { useMemo } from "react";

/**
 * A lightweight SVG "constellation" view: one circle per cluster
 * (sized by paper count, positioned by density x recency), with lines
 * connecting cluster pairs -- line thickness/opacity driven by that
 * pair's GapScore. This is the actual visual your Gap Score numbers
 * were missing; it's built from the same data already returned by
 * the /gaps/analyze response, no extra computation needed.
 */
export default function GapConstellation({ clusters, gaps }) {
  const width = 560;
  const height = 300;
  const pad = 56;

  const points = useMemo(() => {
    const maxSize = Math.max(...clusters.map((c) => c.size), 1);
    const maxDensity = Math.max(...clusters.map((c) => c.density), 0.01);
    return clusters.map((c) => ({
      ...c,
      x: pad + (c.density / maxDensity) * (width - pad * 2),
      y: height - pad - c.recency * (height - pad * 2),
      r: 10 + (c.size / maxSize) * 22,
    }));
  }, [clusters]);

  const byId = Object.fromEntries(points.map((p) => [p.cluster_id, p]));
  const maxGap = Math.max(...gaps.map((g) => g.gap_score), 1);

  return (
    <div className="rounded-xl border border-paper-line bg-surface p-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <line
          x1={pad}
          y1={height - pad}
          x2={width - pad}
          y2={height - pad}
          stroke="currentColor"
          className="text-paper-line"
        />
        <line
          x1={pad}
          y1={pad}
          x2={pad}
          y2={height - pad}
          stroke="currentColor"
          className="text-paper-line"
        />
        <text x={width - pad} y={height - pad + 16} textAnchor="end" className="fill-ink-faint text-[9px]">
          established &rarr;
        </text>
        <text x={pad - 6} y={pad - 8} textAnchor="start" className="fill-ink-faint text-[9px]">
          &uarr; active now
        </text>

        {gaps.map((g, i) => {
          const a = byId[g.cluster_a];
          const b = byId[g.cluster_b];
          if (!a || !b) return null;
          const strength = g.gap_score / maxGap;
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="currentColor"
              className="text-stamp"
              strokeWidth={0.5 + strength * 2.5}
              strokeOpacity={0.15 + strength * 0.55}
            />
          );
        })}

        {points.map((p) => (
          <g key={p.cluster_id}>
            <circle
              cx={p.x}
              cy={p.y}
              r={p.r}
              className="fill-lamp/20 stroke-lamp"
              strokeWidth={1.2}
            />
            <text
              x={p.x}
              y={p.y - p.r - 6}
              textAnchor="middle"
              className="fill-ink text-[10px]"
            >
              {p.top_terms[0]}
            </text>
          </g>
        ))}
      </svg>
      <p className="text-[11px] text-ink-faint mt-2 text-center">
        Circle size = cluster size. Line weight = GapScore between that pair.
      </p>
    </div>
  );
}
