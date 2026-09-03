import { AnimatePresence, motion } from "framer-motion";

export default function LoadingProgress({ stage }) {
  return (
    <div className="w-full max-w-lg mx-auto py-16 text-center">
      <div className="h-6 relative">
        <AnimatePresence mode="wait">
          <motion.p
            key={stage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="text-sm text-ink-soft"
          >
            {stage}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="mt-6 space-y-2.5 max-w-sm mx-auto">
        {[100, 88, 70].map((w, i) => (
          <motion.div
            key={i}
            className="h-2.5 rounded-full bg-paper-dim overflow-hidden"
            style={{ width: `${w}%`, margin: "0 auto" }}
          >
            <motion.div
              className="h-full bg-lamp/25 rounded-full"
              animate={{ x: ["-100%", "120%"] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
              style={{ width: "40%" }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
