import { Canvas } from "@react-three/fiber";
import ResearchScene from "./ResearchScene";

export default function SceneCanvas({ pointerRef, reducedMotion, isMobile }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 42 }}
      dpr={[1, isMobile ? 1.3 : 1.6]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      className="!absolute !inset-0"
    >
      <ResearchScene pointerRef={pointerRef} reducedMotion={reducedMotion} isMobile={isMobile} />
    </Canvas>
  );
}
