import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

const NODES = [
  { x: 30, y: 40 },
  { x: 90, y: 20 },
  { x: 120, y: 70 },
  { x: 60, y: 100 },
  { x: 140, y: 30 },
  { x: 20, y: 90 },
];
const EDGES = [
  [0, 1],
  [0, 3],
  [1, 2],
  [2, 4],
  [3, 5],
  [1, 4],
];

export default function CitationNetworkOverlay({ active }) {
  const pathData = useMemo(() => EDGES, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, x: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: 16, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="hidden md:block absolute right-[8%] top-1/2 -translate-y-1/2 w-44 pointer-events-none"
        >
          <span className="block font-mono text-[9px] tracking-wider text-lamp mb-2">
            CITATION NETWORK
          </span>
          <svg viewBox="0 0 160 120" className="w-full h-auto">
            {pathData.map(([a, b], i) => (
              <line
                key={i}
                x1={NODES[a].x}
                y1={NODES[a].y}
                x2={NODES[b].x}
                y2={NODES[b].y}
                stroke="#7A5E2A"
                strokeOpacity={0.4}
                strokeWidth={1}
              />
            ))}
            {NODES.map((n, i) => (
              <circle
                key={i}
                cx={n.x}
                cy={n.y}
                r={i === 0 ? 4.5 : 3}
                fill={i === 0 ? "#7A5E2A" : "#2B2A25"}
                fillOpacity={i === 0 ? 0.9 : 0.35}
              />
            ))}
          </svg>
          <div className="flex justify-between font-mono text-[8.5px] tracking-wide text-ink-faint mt-2">
            <span>CITED BY</span>
            <span>SUPPORTING</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
