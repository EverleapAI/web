// src/app/(app)/main/components/CelebrationBurst.tsx
//
// A celebratory constellation burst — glowing stars that radiate from a point
// (the checkbox you just ticked) and drift away, tying Everleap's cosmic visual
// language to the reward of actually *doing* something. Listens on the actionsBus
// CELEBRATE event; a full-viewport, pointer-events-none canvas overlay. Honors
// prefers-reduced-motion (a brief, still sparkle instead of a physics burst).

"use client";

import * as React from "react";

import { CELEBRATE } from "@/lib/actionsBus";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: [number, number, number];
};

// success-warm: emerald, gold, white, and a touch of sky (the app's core accent)
const COLORS: [number, number, number][] = [
  [87, 214, 160],
  [244, 198, 103],
  [255, 255, 255],
  [92, 180, 255],
];

export function CelebrationBurst() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      // canvas is a replaced element — `inset-0` alone won't stretch it, so pin
      // the CSS box to the viewport or particles draw outside the visible area.
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    const parts: Particle[] = [];
    let raf = 0;
    let running = false;
    let last = 0;

    const spawn = (cx: number, cy: number) => {
      const n = reduced ? 10 : 24;
      for (let i = 0; i < n; i++) {
        const ang = (Math.PI * 2 * i) / n + Math.random() * 0.5;
        const sp = reduced ? 0 : 2 + Math.random() * 5;
        parts.push({
          x: cx,
          y: cy,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp - (reduced ? 0 : 3), // slight upward bias
          size: 1 + Math.random() * 2.4,
          life: 0,
          maxLife: 750 + Math.random() * 650,
          color: COLORS[(Math.random() * COLORS.length) | 0],
        });
      }
      if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(48, now - last);
      const f = dt / 16.67; // frame-normalized step
      last = now;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const p of parts) {
        p.life += dt;
        if (!reduced) {
          p.vy += 0.16 * f; // gravity
          p.vx *= Math.pow(0.985, f);
          p.vy *= Math.pow(0.985, f);
          p.x += p.vx * f;
          p.y += p.vy * f;
        }
        const a = Math.max(0, 1 - p.life / p.maxLife);
        const [r, g, b] = p.color;
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
        glow.addColorStop(0, `rgba(${r},${g},${b},${0.9 * a})`);
        glow.addColorStop(0.3, `rgba(${r},${g},${b},${0.4 * a})`);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${0.9 * a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = parts.length - 1; i >= 0; i--) {
        if (parts[i].life >= parts[i].maxLife) parts.splice(i, 1);
      }

      if (parts.length > 0) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    const onCelebrate = (e: Event) => {
      const d = (e as CustomEvent).detail || {};
      spawn(
        typeof d.x === "number" ? d.x : window.innerWidth / 2,
        typeof d.y === "number" ? d.y : window.innerHeight / 2
      );
    };

    window.addEventListener(CELEBRATE, onCelebrate);
    return () => {
      window.removeEventListener(CELEBRATE, onCelebrate);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70]"
    />
  );
}

export default CelebrationBurst;
