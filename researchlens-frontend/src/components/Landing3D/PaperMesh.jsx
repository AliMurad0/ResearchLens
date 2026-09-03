import { useMemo, forwardRef } from "react";
import * as THREE from "three";
import { getPaperTextures } from "./paperTextures";

const ASPECT = 680 / 512;

/**
 * A thin box, not a flat plane -- so when a paper rotates edge-on
 * during its tumble, it genuinely has a visible edge and a darker
 * backside, per the brief's "paper thickness" requirement. Cheap:
 * one shared texture per archetype, only the material instances
 * (for independent opacity) are per-paper.
 */
const PaperMesh = forwardRef(function PaperMesh({ archetypeIndex, initialScale }, ref) {
  const textures = getPaperTextures();
  const frontTex = textures[archetypeIndex];

  const materials = useMemo(() => {
    const front = new THREE.MeshStandardMaterial({
      map: frontTex,
      roughness: 0.9,
      metalness: 0,
      transparent: true,
      opacity: 0,
    });
    const back = new THREE.MeshStandardMaterial({
      color: "#D9D2BE",
      roughness: 0.95,
      metalness: 0,
      transparent: true,
      opacity: 0,
    });
    const edge = new THREE.MeshStandardMaterial({
      color: "#B8AE92",
      roughness: 0.95,
      metalness: 0,
      transparent: true,
      opacity: 0,
    });
    // BoxGeometry face group order: +x, -x, +y, -y, +z(front), -z(back)
    return [edge, edge, edge, edge, front, back];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frontTex]);

  return (
    <mesh ref={ref} material={materials} scale={initialScale}>
      <boxGeometry args={[1, ASPECT, 0.014]} />
    </mesh>
  );
});

export default PaperMesh;
