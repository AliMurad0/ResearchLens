import { useEffect, useRef } from "react";

/**
 * Tracks pointer position as normalized [-1, 1] coordinates (NDC-style,
 * matching Three.js convention) without triggering React re-renders on
 * every mousemove -- consumers read pointerRef.current in their own
 * useFrame/rAF loop instead.
 */
export function usePointer() {
  const pointerRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    function handleMove(clientX, clientY) {
      pointerRef.current.x = (clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -((clientY / window.innerHeight) * 2 - 1);
      pointerRef.current.active = true;
    }
    function onMouseMove(e) {
      handleMove(e.clientX, e.clientY);
    }
    function onTouchMove(e) {
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
    function onLeave() {
      pointerRef.current.active = false;
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return pointerRef;
}
