import { motion, AnimatePresence } from "framer-motion";

export default function FeaturedPaperOverlay({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, x: -24, filter: "blur(6px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -16, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="hidden md:block absolute left-[8%] top-1/2 -translate-y-1/2 w-56 pointer-events-none"
        >
          <div className="rounded-sm border border-lamp/25 bg-surface/80 backdrop-blur-sm p-4 shadow-card">
            <span className="block font-mono text-[9px] tracking-wider text-lamp mb-2">
              RESEARCH PAPER
            </span>
            <div className="h-2 w-4/5 bg-ink/70 rounded-sm mb-1.5" />
            <div className="h-2 w-3/5 bg-ink/50 rounded-sm mb-4" />
            <div className="space-y-1 mb-4">
              <div className="h-1 w-full bg-ink/20 rounded-sm" />
              <div className="h-1 w-full bg-ink/20 rounded-sm" />
              <div className="h-1 w-4/5 bg-ink/20 rounded-sm" />
            </div>
            <div className="flex justify-between font-mono text-[8.5px] tracking-wide text-ink-faint">
              <span>METHOD</span>
              <span>RESULTS</span>
              <span>REFS</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
