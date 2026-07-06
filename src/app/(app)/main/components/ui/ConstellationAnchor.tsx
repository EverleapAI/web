// src/app/(app)/main/components/ui/ConstellationAnchor.tsx
//
// A generative "creative anchor" for hero cards: a constellation seeded
// deterministically from an entity id, so every path / insight / mission gets
// its own unique-but-consistent star-map, tinted to a brand accent. Weighted to
// the right and faded toward the left so overlaid titles stay readable. Zero
// assets, infinite coverage — drop it in as the first child of a `relative
// overflow-hidden` hero card (like SectionCard tone="hero"), behind the content.

"use client";

import * as React from "react";

type Rgb = { r: number; g: number; b: number };

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStr(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function drawConstellation(
  canvas: HTMLCanvasElement,
  w: number,
  h: number,
  accent: Rgb,
  seed: string
) {
  const dpr = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);
  canvas.width = Math.max(1, Math.round(w * dpr));
  canvas.height = Math.max(1, Math.round(h * dpr));
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  const { r, g, b } = accent;
  const rgba = (a: number) => `rgba(${r},${g},${b},${a})`;
  const rnd = mulberry32(hashStr(seed || "everleap"));

  // Ambient glow, weighted to the right so the left (text) stays clean.
  const gx = w * (0.72 + rnd() * 0.15);
  const gy = h * (0.28 + rnd() * 0.44);
  const bloom = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.6);
  bloom.addColorStop(0, rgba(0.16));
  bloom.addColorStop(0.5, rgba(0.05));
  bloom.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = bloom;
  ctx.fillRect(0, 0, w, h);

  // Seeded stars, biased right, brightness fading toward the left edge.
  const N = 10 + Math.floor(rnd() * 8);
  const stars: { x: number; y: number; size: number; bright: number }[] = [];
  for (let i = 0; i < N; i++) {
    const x = w * (0.42 + rnd() * 0.56);
    const y = h * (0.1 + rnd() * 0.8);
    const size = 0.7 + rnd() * 2.2;
    const bright = Math.min(1, Math.max(0, (x / w - 0.35) / 0.5));
    stars.push({ x, y, size, bright });
  }

  // Constellation edges: each star links to its 1–2 nearest neighbours.
  ctx.lineWidth = 1;
  for (let i = 0; i < stars.length; i++) {
    const a = stars[i];
    const near = stars
      .map((s, j) => ({ j, d: (s.x - a.x) ** 2 + (s.y - a.y) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((p, q) => p.d - q.d);
    const links = 1 + (rnd() < 0.5 ? 1 : 0);
    for (let k = 0; k < links && k < near.length; k++) {
      const bpt = stars[near[k].j];
      const al = 0.1 * Math.min(a.bright, bpt.bright);
      const grad = ctx.createLinearGradient(a.x, a.y, bpt.x, bpt.y);
      grad.addColorStop(0, rgba(al));
      grad.addColorStop(1, rgba(al * 0.6));
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(bpt.x, bpt.y);
      ctx.stroke();
    }
  }

  // A soft orbital arc for a sense of journey.
  ctx.save();
  ctx.translate(gx, gy);
  ctx.rotate(rnd() * Math.PI);
  ctx.strokeStyle = rgba(0.1);
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(0, 0, w * 0.3, w * 0.3 * (0.4 + rnd() * 0.3), 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Stars with glow.
  for (const s of stars) {
    const gl = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 5);
    gl.addColorStop(0, rgba(0.9 * s.bright));
    gl.addColorStop(0.25, rgba(0.45 * s.bright));
    gl.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gl;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size * 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(255,255,255,${0.85 * s.bright})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function ConstellationAnchor({
  seed,
  accent,
  className = "",
}: {
  seed: string;
  accent: Rgb;
  className?: string;
}) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const render = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w > 0 && h > 0) drawConstellation(canvas, w, h, accent, seed);
    };
    render();
    const id = requestAnimationFrame(() => setShown(true)); // gentle fade-in
    const ro = new ResizeObserver(render);
    ro.observe(wrap);
    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
    };
  }, [seed, accent.r, accent.g, accent.b]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ opacity: shown ? 1 : 0, transition: "opacity 900ms ease-out" }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

export default ConstellationAnchor;
