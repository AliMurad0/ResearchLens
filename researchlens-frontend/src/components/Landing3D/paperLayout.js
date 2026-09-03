import { ARCHETYPE_COUNT } from "./paperTextures";

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export const LAYER_DEFS = {
  far: { xBound: 15, driftSpeed: 3.2, scale: [0.28, 0.46], opacity: [0.16, 0.32] },
  mid: { xBound: 11, driftSpeed: 4.4, scale: [0.58, 0.82], opacity: [0.44, 0.66] },
  near: { xBound: 8.5, driftSpeed: 5.6, scale: [0.92, 1.26], opacity: [0.78, 1.0] },
};

const COUNTS = {
  desktop: { far: 10, mid: 8, near: 6 },
  mobile: { far: 4, mid: 3, near: 2 },
};

function sampleY(layer, rnd) {
  const spread = layer === "near" ? 3.6 : layer === "mid" ? 4.2 : 5.2;
  let y = (rnd() - 0.5) * spread * 2;
  // keep near/mid papers from constantly crossing the center band
  // where the hero text sits
  if (layer !== "far" && Math.abs(y) < 1.3) {
    y += y >= 0 ? 1.3 : -1.3;
  }
  return y;
}

export function buildPapers(isMobile) {
  const rnd = seeded(42);
  const counts = isMobile ? COUNTS.mobile : COUNTS.desktop;
  const papers = [];
  let id = 0;

  for (const layer of ["far", "mid", "near"]) {
    const def = LAYER_DEFS[layer];
    const count = counts[layer];
    for (let i = 0; i < count; i++) {
      const [sMin, sMax] = def.scale;
      const [oMin, oMax] = def.opacity;
      papers.push({
        id: id++,
        layer,
        archetypeIndex: Math.floor(rnd() * ARCHETYPE_COUNT),
        startX: (rnd() * 2 - 1) * def.xBound,
        y: sampleY(layer, rnd),
        z:
          layer === "far"
            ? -12 - rnd() * 3
            : layer === "mid"
            ? -5 - rnd() * 3
            : rnd() * 2.4,
        t0: rnd() * 40,
        speed: def.driftSpeed * (0.85 + rnd() * 0.3),
        curveFreq: 0.15 + rnd() * 0.15,
        curveAmpl: layer === "near" ? 0.35 : layer === "mid" ? 0.5 : 0.7,
        phase: rnd() * Math.PI * 2,
        phase2: rnd() * Math.PI * 2,
        rotBaseY: (rnd() - 0.5) * 0.6,
        tiltZ: (rnd() - 0.5) * 0.12,
        baseScale: sMin + rnd() * (sMax - sMin),
        baseOpacity: oMin + rnd() * (oMax - oMin),
      });
    }
  }

  return papers;
}
