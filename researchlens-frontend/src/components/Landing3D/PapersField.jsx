import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import PaperMesh from "./PaperMesh";
import { LAYER_DEFS } from "./paperLayout";

const tempVec = new THREE.Vector3();
const LENS_RADIUS = 0.55;
const INTRO_DURATION = 1.3;

/**
 * Drives every paper's transform + material opacity each frame via
 * direct ref mutation -- no React re-renders in the animation loop,
 * which is what keeps ~24 objects at 60fps.
 *
 * Handles: continuous drift (right -> center -> left, wrapping),
 * organic curve/tumble, the cinematic intro fade, and the cursor-lens
 * effect (papers near the pointer sharpen toward full opacity/scale).
 */
export default function PapersField({ papers, pointerRef, reducedMotion }) {
  const meshRefs = useRef([]);
  const clockRef = useRef(0);

  useFrame((state, delta) => {
    if (!reducedMotion) {
      clockRef.current += delta;
    }
    const t = clockRef.current;
    const introFactor = Math.min(1, t / INTRO_DURATION);
    const pointer = pointerRef.current;

    papers.forEach((p, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;

      if (reducedMotion) {
        // Static, intentionally composed layout -- no motion, but still
        // a real 3D scene with depth, not a blank void.
        mesh.position.set(p.startX * 0.6, p.y, p.z);
        mesh.rotation.set(0, p.rotBaseY, p.tiltZ);
      } else {
        const def = LAYER_DEFS[p.layer];
        const localT = t * (p.speed / 10) + p.t0;

        let x = p.startX - localT * def.driftSpeed;
        const bound = def.xBound;
        x = ((((x + bound) % (bound * 2)) + bound * 2) % (bound * 2)) - bound;

        const y = p.y + Math.sin(localT * p.curveFreq + p.phase) * p.curveAmpl;
        const z = p.z + Math.sin(localT * 0.25 + p.phase2) * 0.3;

        mesh.position.set(x, y, z);
        mesh.rotation.y = p.rotBaseY + Math.sin(localT * 0.35 + p.phase) * 0.4;
        mesh.rotation.z = p.tiltZ + Math.sin(localT * 0.2 + p.phase2) * 0.06;
        mesh.rotation.x = Math.sin(localT * 0.15 + p.phase) * 0.05;
      }

      let targetOpacity = reducedMotion ? p.baseOpacity : p.baseOpacity * introFactor;
      let targetScale = p.baseScale;

      if (!reducedMotion && pointer.active && p.layer !== "far") {
        mesh.updateMatrixWorld();
        mesh.getWorldPosition(tempVec);
        tempVec.project(state.camera);
        const dx = tempVec.x - pointer.x;
        const dy = tempVec.y - pointer.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LENS_RADIUS) {
          const strength = 1 - dist / LENS_RADIUS;
          targetOpacity = Math.min(1, targetOpacity + strength * 0.3);
          targetScale = p.baseScale * (1 + strength * 0.07);
        }
      }

      const mats = mesh.material;
      const lerpSpeed = reducedMotion ? 1 : 0.08;
      for (let m = 0; m < mats.length; m++) {
        mats[m].opacity += (targetOpacity - mats[m].opacity) * lerpSpeed;
      }
      mesh.scale.setScalar(mesh.scale.x + (targetScale - mesh.scale.x) * lerpSpeed);
    });
  });

  return (
    <>
      {papers.map((p, i) => (
        <PaperMesh
          key={p.id}
          archetypeIndex={p.archetypeIndex}
          initialScale={reducedMotion ? p.baseScale : 0.001}
          ref={(el) => (meshRefs.current[i] = el)}
        />
      ))}
    </>
  );
}
