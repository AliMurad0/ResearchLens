import { useEffect, useRef, useState } from "react";

const THRESHOLD = 0.32;

/**
 * Reads pointerRef every animation frame but only calls setState when
 * the zone actually changes -- so this never causes a re-render storm
 * from raw mousemove events.
 */
export function useResearchZone(pointerRef, enabled) {
  const [zone, setZone] = useState("center");
  const zoneRef = useRef("center");
  const rafRef = useRef();

  useEffect(() => {
    if (!enabled) {
      setZone("center");
      return;
    }

    function tick() {
      const { x, active } = pointerRef.current;
      let next = "center";
      if (active) {
        if (x < -THRESHOLD) next = "left";
        else if (x > THRESHOLD) next = "right";
      }
      if (next !== zoneRef.current) {
        zoneRef.current = next;
        setZone(next);
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pointerRef, enabled]);

  return zone;
}
