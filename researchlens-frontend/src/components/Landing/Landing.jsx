import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePointer } from "../../hooks/usePointer";
import { usePrefersReducedMotion, useIsCoarsePointer } from "../../hooks/useEnvironment";
import { useResearchZone } from "../../hooks/useResearchZone";
import GhostMetadata from "../Landing3D/GhostMetadata";
import FeaturedPaperOverlay from "../Landing3D/FeaturedPaperOverlay";
import CitationNetworkOverlay from "../Landing3D/CitationNetworkOverlay";
import { IconArrowDown } from "../icons/icons";

// The 3D scene pulls in three.js -- lazy-loaded so it never blocks the
// rest of the app's initial bundle.
const SceneCanvas = lazy(() => import("../Landing3D/SceneCanvas"));

const TRANSITION_MS = 700;

export default function Landing({ onEnter }) {
  const triggeredRef = useRef(false);
  const [transitioning, setTransitioning] = useState(false);
  const pointerRef = usePointer();
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsCoarsePointer();
  const zone = useResearchZone(pointerRef, !reducedMotion && !isMobile);

  function beginTransition() {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    if (reducedMotion) {
      onEnter();
      return;
    }
    setTransitioning(true);
    setTimeout(onEnter, TRANSITION_MS);
  }

  useEffect(() => {
    function handleWheel(e) {
      if (e.deltaY > 24) beginTransition();
    }
    function handleKeyDown(e) {
      if (["ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) beginTransition();
    }
    const touchStartY = { current: 0 };
    function handleTouchStart(e) {
      touchStartY.current = e.touches[0].clientY;
    }
    function handleTouchMove(e) {
      if (touchStartY.current - e.touches[0].clientY > 40) beginTransition();
    }

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-paper">
      {/* 3D research environment */}
      <motion.div
        className="absolute inset-0"
        animate={
          transitioning
            ? { scale: 1.35, opacity: 0, filter: "blur(10px)" }
            : { scale: 1, opacity: 1, filter: "blur(0px)" }
        }
        transition={{ duration: TRANSITION_MS / 1000, ease: [0.55, 0, 0.85, 0.35] }}
      >
        <Suspense fallback={null}>
          <SceneCanvas pointerRef={pointerRef} reducedMotion={reducedMotion} isMobile={isMobile} />
        </Suspense>
      </motion.div>

      <GhostMetadata />
      <FeaturedPaperOverlay active={zone === "left"} />
      <CitationNetworkOverlay active={zone === "right"} />

      {/* Hero content */}
      <AnimatePresence>
        {!transitioning && (
          <motion.div
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center"
          >
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="font-mono text-[11px] tracking-[0.2em] text-ink-faint mb-5"
            >
              A RESEARCH READING TOOL
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="font-serif text-5xl sm:text-6xl md:text-7xl leading-[1.05] text-ink max-w-3xl"
            >
              ResearchLens
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-4 h-px w-14 bg-ink/20"
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-5 max-w-md text-ink-soft text-base sm:text-lg font-light"
            >
              Search a topic. Read a literature review grounded in the real
              papers behind it.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.15 }}
              onClick={beginTransition}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="mt-9 inline-flex items-center gap-2 rounded-md bg-lamp px-6 py-3 text-paper text-sm font-medium shadow-lamp hover:bg-lamp-light transition-all"
            >
              Start a search
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {!transitioning && (
        <motion.button
          onClick={beginTransition}
          aria-label="Scroll down"
          className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 text-ink-faint hover:text-ink transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: reducedMotion ? 0 : [0, 8, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 1.3 },
            y: { duration: 1.8, repeat: reducedMotion ? 0 : Infinity, ease: "easeInOut", delay: 1.3 },
          }}
        >
          <IconArrowDown size={22} />
        </motion.button>
      )}
    </section>
  );
}
