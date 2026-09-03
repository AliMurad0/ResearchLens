import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import PapersField from "./PapersField";
import ParticlesField from "./ParticlesField";
import { buildPapers } from "./paperLayout";

// Kept as literal hex (not CSS vars) because Three.js materials can't
// read CSS custom properties -- these are the WebGL-side equivalents
// of the app's golden-white / light-grey palette in index.css.
const BG_COLOR = "#EDE8DB";

export default function ResearchScene({ pointerRef, reducedMotion, isMobile }) {
  const groupRef = useRef();
  const papers = useMemo(() => buildPapers(isMobile), [isMobile]);

  useFrame(() => {
    if (reducedMotion || !groupRef.current) return;
    const pointer = pointerRef.current;
    const targetRotY = pointer.active ? pointer.x * 0.06 : 0;
    const targetRotX = pointer.active ? -pointer.y * 0.035 : 0;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.04;
  });

  return (
    <>
      <color attach="background" args={[BG_COLOR]} />
      <fog attach="fog" args={[BG_COLOR, 7, 21]} />

      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 8, 6]} intensity={0.55} color="#FFFBF0" />
      <pointLight position={[-7, -3, 4]} intensity={0.4} color="#C7A05C" />
      <pointLight position={[6, 4, -3]} intensity={0.25} color="#FFFDF7" />

      <group ref={groupRef}>
        <PapersField papers={papers} pointerRef={pointerRef} reducedMotion={reducedMotion} />
        <ParticlesField isMobile={isMobile} reducedMotion={reducedMotion} />
      </group>
    </>
  );
}
