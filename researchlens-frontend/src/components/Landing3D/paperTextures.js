import * as THREE from "three";

/**
 * Draws fake academic-looking paper faces onto a canvas, then wraps
 * each as a THREE.CanvasTexture. Nothing here is real, readable text
 * -- it's visual symbolism (line blocks, boxes, dot-scatters, equation
 * -like squiggles) at a scale small enough that a visitor reads "this
 * is research" rather than trying to read a sentence.
 *
 * Generated once, cached, and reused across every paper instance of
 * that archetype -- cheap on the GPU, no runtime cost per paper.
 */

const W = 512;
const H = 680;
const PAPER_BG = "#FBF8F0";
const INK = "#2B2A25";
const INK_SOFT = "rgba(43,42,37,0.55)";
const INK_FAINT = "rgba(43,42,37,0.28)";
const ACCENT = "#8A6B2E";

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function lines(ctx, x, y, w, count, rnd, opts = {}) {
  const lh = opts.lineHeight ?? 9;
  const thickness = opts.thickness ?? 2.2;
  const color = opts.color ?? INK_SOFT;
  ctx.fillStyle = color;
  for (let i = 0; i < count; i++) {
    const lineW = w * (0.55 + rnd() * 0.45) * (i === count - 1 ? 0.5 : 1);
    ctx.fillRect(x, y + i * lh, lineW, thickness);
  }
  return y + count * lh;
}

function baseCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = PAPER_BG;
  ctx.fillRect(0, 0, W, H);
  // faint edge vignette so the page doesn't look like a flat swatch
  const grad = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(0,0,0,0.06)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  return { canvas, ctx };
}

function drawTitle(ctx, rnd, x, y, w) {
  ctx.fillStyle = INK;
  ctx.fillRect(x, y, w * (0.6 + rnd() * 0.3), 8);
  ctx.fillRect(x, y + 14, w * (0.4 + rnd() * 0.3), 8);
  return y + 34;
}

function drawByline(ctx, rnd, x, y, w) {
  ctx.fillStyle = INK_FAINT;
  ctx.fillRect(x, y, w * 0.45, 4);
  return y + 20;
}

// --- Archetypes ---------------------------------------------------

function journal(rnd) {
  const { canvas, ctx } = baseCanvas();
  const m = 40;
  let y = drawTitle(ctx, rnd, m, 44, W - m * 2);
  y = drawByline(ctx, rnd, m, y, W - m * 2);
  y += 12;
  const colW = (W - m * 2 - 24) / 2;
  lines(ctx, m, y, colW, 24, rnd);
  lines(ctx, m + colW + 24, y, colW, 24, rnd);
  ctx.fillStyle = INK_FAINT;
  ctx.font = "10px monospace";
  ctx.fillText("J. RES. VOL 14", m, H - 24);
  return canvas;
}

function mlArchitecture(rnd) {
  const { canvas, ctx } = baseCanvas();
  const m = 40;
  let y = drawTitle(ctx, rnd, m, 44, W - m * 2);
  y = drawByline(ctx, rnd, m, y, W - m * 2);
  y += 20;
  // architecture boxes + arrows
  const boxW = 70, boxH = 34, gap = 26;
  let bx = m;
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(bx, y, boxW, boxH);
    if (i < 3) {
      ctx.beginPath();
      ctx.moveTo(bx + boxW, y + boxH / 2);
      ctx.lineTo(bx + boxW + gap, y + boxH / 2);
      ctx.stroke();
    }
    bx += boxW + gap;
  }
  y += boxH + 30;
  // small equation line
  ctx.fillStyle = INK_SOFT;
  ctx.font = "italic 13px serif";
  ctx.fillText("L = Σ log p(y|x) + λ‖θ‖²", m, y);
  y += 26;
  // training curve
  ctx.strokeStyle = INK_FAINT;
  ctx.beginPath();
  ctx.moveTo(m, y + 60);
  for (let i = 0; i <= 40; i++) {
    const px = m + (i / 40) * (W - m * 2);
    const py = y + 60 - (60 - 60 * Math.exp(-i / 12)) - rnd() * 3;
    ctx.lineTo(px, py);
  }
  ctx.stroke();
  y += 90;
  lines(ctx, m, y, W - m * 2, 6, rnd);
  return canvas;
}

function statistical(rnd) {
  const { canvas, ctx } = baseCanvas();
  const m = 40;
  let y = drawTitle(ctx, rnd, m, 44, W - m * 2);
  y = drawByline(ctx, rnd, m, y, W - m * 2);
  y += 24;
  const chartH = 200;
  ctx.strokeStyle = INK_FAINT;
  ctx.strokeRect(m, y, W - m * 2, chartH);
  ctx.fillStyle = ACCENT;
  for (let i = 0; i < 60; i++) {
    const px = m + rnd() * (W - m * 2);
    const py = y + chartH - rnd() * rnd() * chartH;
    ctx.beginPath();
    ctx.arc(px, py, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }
  y += chartH + 24;
  // small table grid
  const rows = 4, cols = 3, tableW = W - m * 2, rowH = 16;
  ctx.strokeStyle = INK_FAINT;
  for (let r = 0; r <= rows; r++) {
    ctx.beginPath();
    ctx.moveTo(m, y + r * rowH);
    ctx.lineTo(m + tableW, y + r * rowH);
    ctx.stroke();
  }
  for (let c = 0; c <= cols; c++) {
    ctx.beginPath();
    ctx.moveTo(m + (c * tableW) / cols, y);
    ctx.lineTo(m + (c * tableW) / cols, y + rows * rowH);
    ctx.stroke();
  }
  return canvas;
}

function medical(rnd) {
  const { canvas, ctx } = baseCanvas();
  const m = 40;
  let y = drawTitle(ctx, rnd, m, 44, W - m * 2);
  y = drawByline(ctx, rnd, m, y, W - m * 2);
  y += 20;
  // figure box with cross-hatch
  const figH = 160;
  ctx.strokeStyle = INK_FAINT;
  ctx.strokeRect(m, y, W - m * 2, figH);
  ctx.save();
  ctx.beginPath();
  ctx.rect(m, y, W - m * 2, figH);
  ctx.clip();
  ctx.strokeStyle = "rgba(43,42,37,0.12)";
  for (let i = -figH; i < W; i += 14) {
    ctx.beginPath();
    ctx.moveTo(m + i, y);
    ctx.lineTo(m + i + figH, y + figH);
    ctx.stroke();
  }
  ctx.restore();
  y += figH + 24;
  ctx.fillStyle = INK_FAINT;
  ctx.font = "10px monospace";
  ctx.fillText("FIG. 2 — STUDY COHORT, N=214", m, y);
  y += 24;
  // results table rows
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i % 2 === 0 ? "rgba(43,42,37,0.05)" : "transparent";
    ctx.fillRect(m, y + i * 18, W - m * 2, 18);
    ctx.fillStyle = INK_FAINT;
    ctx.fillRect(m + 6, y + i * 18 + 7, W - m * 2 - 100, 3);
  }
  return canvas;
}

function mathematics(rnd) {
  const { canvas, ctx } = baseCanvas();
  const m = 40;
  let y = drawTitle(ctx, rnd, m, 44, W - m * 2);
  y += 30;
  ctx.font = "italic 15px serif";
  ctx.fillStyle = INK_SOFT;
  const symbols = ["∀ε>0 ∃δ>0", "∫f(x)dx = F(b)−F(a)", "Σᵢ₌₁ⁿ aᵢxᵢ", "lim_{n→∞} aₙ = L", "‖Ax‖ ≤ λ‖x‖"];
  symbols.forEach((s, i) => {
    ctx.fillText(s, m, y + i * 34);
  });
  y += symbols.length * 34 + 16;
  ctx.font = "10px monospace";
  ctx.fillStyle = INK_FAINT;
  ctx.fillText("PROOF.", m, y);
  y += 16;
  lines(ctx, m, y, W - m * 2, 10, rnd, { lineHeight: 14 });
  return canvas;
}

function conference(rnd) {
  const { canvas, ctx } = baseCanvas();
  const m = 40;
  ctx.fillStyle = INK_FAINT;
  ctx.font = "9px monospace";
  ctx.fillText("PROC. INT'L CONF. — 2026", m, 26);
  let y = drawTitle(ctx, rnd, m, 50, W - m * 2);
  y = drawByline(ctx, rnd, m, y, W - m * 2);
  y += 16;
  const figH = 150;
  ctx.strokeStyle = ACCENT;
  ctx.lineWidth = 1.2;
  ctx.strokeRect(m, y, W - m * 2, figH);
  ctx.beginPath();
  for (let i = 0; i <= 30; i++) {
    const px = m + (i / 30) * (W - m * 2);
    const py = y + figH / 2 + Math.sin(i / 2.4 + rnd()) * (figH / 2 - 10);
    ctx.lineTo(px, py);
  }
  ctx.strokeStyle = INK_FAINT;
  ctx.stroke();
  y += figH + 20;
  const colW = (W - m * 2 - 24) / 2;
  lines(ctx, m, y, colW, 14, rnd);
  lines(ctx, m + colW + 24, y, colW, 14, rnd);
  return canvas;
}

function litReview(rnd) {
  const { canvas, ctx } = baseCanvas();
  const m = 40;
  let y = drawTitle(ctx, rnd, m, 44, W - m * 2);
  y = drawByline(ctx, rnd, m, y, W - m * 2);
  y += 16;
  lines(ctx, m, y, W - m * 2, 10, rnd);
  y += 10 * 9 + 20;
  ctx.fillStyle = INK_FAINT;
  ctx.font = "10px monospace";
  ctx.fillText("REFERENCES", m, y);
  y += 16;
  for (let i = 0; i < 12; i++) {
    ctx.fillStyle = INK_FAINT;
    ctx.font = "9px monospace";
    ctx.fillText(`[${i + 1}]`, m, y + i * 15);
    ctx.fillStyle = "rgba(43,42,37,0.35)";
    ctx.fillRect(m + 26, y + i * 15 - 6, (W - m * 2 - 26) * (0.5 + rnd() * 0.4), 2.2);
  }
  return canvas;
}

function thesis(rnd) {
  const { canvas, ctx } = baseCanvas();
  const m = 40;
  ctx.fillStyle = INK_FAINT;
  ctx.font = "10px monospace";
  ctx.fillText("CHAPTER 03", m, 40);
  ctx.fillStyle = INK;
  ctx.fillRect(m, 56, W * 0.55, 10);
  ctx.fillRect(m, 74, W * 0.35, 10);
  let y = 116;
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = INK_SOFT;
    ctx.fillRect(m, y, W * (0.3 - i * 0.02), 6);
    y += 16;
    lines(ctx, m, y, W - m * 2, 4, rnd);
    y += 4 * 9 + 14;
  }
  ctx.fillStyle = INK_FAINT;
  ctx.font = "9px monospace";
  ctx.fillText("FIG. 3.1 ................... 84", m, H - 40);
  return canvas;
}

const GENERATORS = [
  journal,
  mlArchitecture,
  statistical,
  medical,
  mathematics,
  conference,
  litReview,
  thesis,
];

let cached = null;

export function getPaperTextures() {
  if (cached) return cached;
  cached = GENERATORS.map((gen, i) => {
    const rnd = seeded(1000 + i * 77);
    const canvas = gen(rnd);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  });
  return cached;
}

export const ARCHETYPE_COUNT = GENERATORS.length;
