"use client";

// The pulse — the honest rhythm readout. A 7-day trace where each day's spike
// scales with real activity. A brand-new user has no week to draw, so we show
// "your first beat" instead of a fabricated trace.

import * as React from "react";
import type { Rhythm } from "./todayHeart.types";

export function PulseTrace({
  rhythm,
  accentRgb,
}: {
  rhythm: Rhythm;
  accentRgb: string;
}) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (rhythm.firstBeat) return;

    const canvas = ref.current;
    if (!canvas) return;

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = w * dpr;
      canvas.height = h * dpr;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const days = rhythm.days;
      const n = days.length || 7;
      const max = Math.max(1, ...days.map((d) => d.count));
      const base = h * 0.56;
      const gap = w / n;

      // baseline
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, base);
      ctx.lineTo(w, base);
      ctx.stroke();

      // trace — a spike per day, amplitude ∝ that day's real activity
      ctx.strokeStyle = `rgba(${accentRgb},0.85)`;
      ctx.lineWidth = 1.7;
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(0, base);
      days.forEach((d, i) => {
        const x = gap * (i + 0.5);
        const amp = d.count > 0 ? h * 0.14 + h * 0.3 * (d.count / max) : 0;
        ctx.lineTo(x - gap * 0.28, base);
        if (amp > 0) {
          ctx.lineTo(x - gap * 0.12, base + 5);
          ctx.lineTo(x, base - amp);
          ctx.lineTo(x + gap * 0.12, base + 6);
        }
        ctx.lineTo(x + gap * 0.28, base);
      });
      ctx.lineTo(w, base);
      ctx.stroke();

      // day markers — filled when the day had activity, hollow otherwise
      days.forEach((d, i) => {
        const x = gap * (i + 0.5);
        ctx.beginPath();
        ctx.arc(x, h * 0.86, 3, 0, 6.283);
        if (d.count > 0) {
          ctx.fillStyle = `rgba(${accentRgb},0.9)`;
          ctx.fill();
        } else {
          ctx.fillStyle = "#0a0d15";
          ctx.fill();
          ctx.strokeStyle = `rgba(${accentRgb},0.5)`;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
      });
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [rhythm, accentRgb]);

  return (
    <div className="mt-3">
      <div className="flex items-baseline justify-between">
        <div className="text-micro font-semibold uppercase tracking-eyebrow text-white/40">
          Your rhythm
        </div>
        {!rhythm.firstBeat ? (
          <div className="text-micro text-white/50">
            {rhythm.total7d} {rhythm.total7d === 1 ? "beat" : "beats"} this week
          </div>
        ) : null}
      </div>

      {rhythm.firstBeat ? (
        <div className="mt-1.5 flex items-center gap-2.5 rounded-xl border border-dashed border-white/[0.12] px-3 py-2">
          <span
            className="h-[7px] w-[7px] rounded-full border-[1.5px]"
            style={{ borderColor: `rgb(${accentRgb})` }}
          />
          <span className="text-micro text-white/55">
            Begins today — this is your first beat.
          </span>
        </div>
      ) : (
        <canvas ref={ref} className="mt-1 block h-[42px] w-full" />
      )}
    </div>
  );
}
