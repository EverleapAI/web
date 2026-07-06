// src/app/(app)/main/components/ui/ConstellationAnchor.tsx
//
// A generative "creative anchor" for hero cards: a constellation seeded
// deterministically from an entity id, so every path / insight / mission gets
// its own unique-but-consistent star-map, tinted to a brand accent. Weighted to
// the right and faded toward the left so overlaid titles stay readable. Zero
// assets, infinite coverage — pass it via SectionCard's `backdrop` prop so it
// fills the whole rounded card (not the inset content box).
//
// The scene (positions, links, glow) is computed once; a light ~30fps loop then
// only re-varies each star's brightness for a gentle twinkle. Paused when the
// card scrolls off-screen, and held static under prefers-reduced-motion.

"use client";

import * as React from "react";

type Rgb = { r: number; g: number; b: number };

const TAU = Math.PI * 2;

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

type Star = { x: number; y: number; size: number; bright: number; phase: number; speed: number };
type Edge = { ax: number; ay: number; bx: number; by: number; alpha: number };
type Scene = {
  gx: number;
  gy: number;
  stars: Star[];
  edges: Edge[];
  arc: { cx: number; cy: number; rx: number; ry: number; rot: number };
};

function computeScene(w: number, h: number, seed: string): Scene {
  const rnd = mulberry32(hashStr(seed || "everleap"));

  const gx = w * (0.72 + rnd() * 0.15);
  const gy = h * (0.28 + rnd() * 0.44);

  const N = 10 + Math.floor(rnd() * 8);
  const stars: Star[] = [];
  for (let i = 0; i < N; i++) {
    const x = w * (0.42 + rnd() * 0.56);
    const y = h * (0.1 + rnd() * 0.8);
    const size = 0.7 + rnd() * 2.2;
    const bright = Math.min(1, Math.max(0, (x / w - 0.35) / 0.5));
    stars.push({ x, y, size, bright, phase: rnd() * TAU, speed: 0.0007 + rnd() * 0.0015 });
  }

  // Each star links to its 1–2 nearest neighbours.
  const edges: Edge[] = [];
  for (let i = 0; i < stars.length; i++) {
    const a = stars[i];
    const near = stars
      .map((s, j) => ({ j, d: (s.x - a.x) ** 2 + (s.y - a.y) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((p, q) => p.d - q.d);
    const links = 1 + (rnd() < 0.5 ? 1 : 0);
    for (let k = 0; k < links && k < near.length; k++) {
      const bpt = stars[near[k].j];
      edges.push({ ax: a.x, ay: a.y, bx: bpt.x, by: bpt.y, alpha: 0.1 * Math.min(a.bright, bpt.bright) });
    }
  }

  const arc = { cx: gx, cy: gy, rx: w * 0.3, ry: w * 0.3 * (0.4 + rnd() * 0.3), rot: rnd() * Math.PI };

  return { gx, gy, stars, edges, arc };
}

function render(ctx: CanvasRenderingContext2D, w: number, h: number, accent: Rgb, scene: Scene, t: number) {
  const { r, g, b } = accent;
  const rgba = (a: number) => `rgba(${r},${g},${b},${a})`;

  ctx.clearRect(0, 0, w, h);

  // Ambient glow, weighted right so the left (text) stays clean.
  const bloom = ctx.createRadialGradient(scene.gx, scene.gy, 0, scene.gx, scene.gy, Math.max(w, h) * 0.6);
  bloom.addColorStop(0, rgba(0.16));
  bloom.addColorStop(0.5, rgba(0.05));
  bloom.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = bloom;
  ctx.fillRect(0, 0, w, h);

  // Constellation edges.
  ctx.lineWidth = 1;
  for (const e of scene.edges) {
    ctx.strokeStyle = rgba(e.alpha);
    ctx.beginPath();
    ctx.moveTo(e.ax, e.ay);
    ctx.lineTo(e.bx, e.by);
    ctx.stroke();
  }

  // Soft orbital arc for a sense of journey.
  ctx.save();
  ctx.translate(scene.arc.cx, scene.arc.cy);
  ctx.rotate(scene.arc.rot);
  ctx.strokeStyle = rgba(0.1);
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(0, 0, scene.arc.rx, scene.arc.ry, 0, 0, TAU);
  ctx.stroke();
  ctx.restore();

  // Stars, each twinkling on its own gentle phase.
  for (const s of scene.stars) {
    const tw = 0.68 + 0.32 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
    const a = s.bright * tw;
    const gl = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 5);
    gl.addColorStop(0, rgba(0.9 * a));
    gl.addColorStop(0.25, rgba(0.45 * a));
    gl.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gl;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size * 5, 0, TAU);
    ctx.fill();
    ctx.fillStyle = `rgba(255,255,255,${0.85 * a})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size * 0.7, 0, TAU);
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
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const t0 = performance.now();

    let scene: Scene | null = null;
    let w = 0;
    let h = 0;

    const setup = () => {
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      if (w <= 0 || h <= 0) return false;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      scene = computeScene(w, h, seed);
      return true;
    };

    const paint = (t: number) => {
      if (!scene) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render(ctx, w, h, accent, scene, t);
    };

    let raf = 0;
    let last = 0;
    let visible = true;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return; // ~30fps is plenty for a twinkle
      last = now;
      paint(now - t0);
    };
    const start = () => {
      if (!raf && !reduced && visible) {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    setup();
    paint(0);
    requestAnimationFrame(() => setShown(true)); // gentle fade-in

    const ro = new ResizeObserver(() => {
      if (setup()) paint(performance.now() - t0);
    });
    ro.observe(wrap);

    const io = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
      if (visible) start();
      else stop();
    });
    io.observe(wrap);

    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
