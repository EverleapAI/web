// apps/web/src/app/(app)/main/guide/GuideSky.tsx
//
// The manual as a ride.
//
// A canvas starfield carries the depth; SVG sits on top for the stars you can
// actually tap, because those need hit targets, focus rings and labels a canvas
// can't give for free. Dropping into a star throws the field into hyperspace and
// backing out reverses it — one variable (how fast z falls) produces both the
// idle glitter and the jump, because every star is drawn from where it WAS to
// where it IS.
//
// Mobile is the primary canvas: star count and pixel ratio are both capped, and
// the whole loop holds still under prefers-reduced-motion. On a laptop the sky
// roughly triples and the panel moves alongside it.

"use client";

import * as React from "react";
import { ArrowLeft } from "lucide-react";

import { GUIDE_SKIES, findNode, hasSky, type GuideNode } from "./guideTree";

const VIEW_W = 384;
const VIEW_H = 268;

type Star = {
  x: number; y: number; z: number;
  mag: number; phase: number; speed: number; tint: string;
};

function newStar(z: number): Star {
  return {
    x: (Math.random() - 0.5) * 2,
    y: (Math.random() - 0.5) * 2,
    z,
    // Own brightness and own twinkle rhythm, so it reads as a sky rather than a
    // regular grid of identical dots. A few run warm or cold.
    mag: Math.random() * 0.75 + 0.25,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.9 + 0.5,
    tint:
      Math.random() < 0.14
        ? Math.random() < 0.5
          ? "180,214,255"
          : "255,224,170"
        : "226,234,248",
  };
}

function Starfield({ warpRef }: { warpRef: React.MutableRefObject<(dir: number) => void> }) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = window.innerWidth < 640 ? 300 : 560;
    const field: Star[] = Array.from({ length: count }, () => newStar(Math.random() * 0.98 + 0.02));

    let w = 1, h = 1, raf = 0, warp = 0, warpUntil = 0;

    const size = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (s: Star) => ({
      x: w / 2 + (s.x / s.z) * w * 0.62,
      y: h / 2 + (s.y / s.z) * h * 0.62,
    });

    warpRef.current = (dir: number) => {
      if (reduced) return;
      warp = dir * 26;
      warpUntil = performance.now() + 640;
    };

    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      ctx.clearRect(0, 0, w, h);

      if (warp !== 0 && now > warpUntil) warp = 0;
      const push = warp !== 0 ? warp * 0.002 : 0;
      const warping = warp !== 0 && !reduced;

      for (let i = 0; i < field.length; i++) {
        const s = field[i];
        const before = project(s);
        s.z -= (0.000014 + push) * dt;

        // Recycle at both ends, so backing out never empties the field.
        if (s.z <= 0.02) { field[i] = newStar(1); continue; }
        if (s.z > 1) { field[i] = newStar(0.02); continue; }

        const p = project(s);
        if (p.x < -60 || p.x > w + 60 || p.y < -60 || p.y > h + 60) continue;

        const depth = 1 - s.z;
        const twinkle = reduced ? 1 : 0.7 + 0.3 * Math.sin(now * 0.0015 * s.speed + s.phase);
        const alpha = Math.min(1, s.mag * (0.3 + depth * 1.15) * twinkle);

        if (warping) {
          ctx.strokeStyle = `rgba(${s.tint},${alpha})`;
          ctx.lineWidth = Math.max(0.6, depth * 2.2);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(before.x, before.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${s.tint},${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.5, depth * 2 * s.mag), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver(size);
    ro.observe(cv);
    size();
    raf = requestAnimationFrame((t) => { last = t; frame(t); });

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [warpRef]);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}

export function GuideSky() {
  const [path, setPath] = React.useState<string[]>(["root"]);
  const [selected, setSelected] = React.useState<string>("story");
  const warpRef = React.useRef<(dir: number) => void>(() => {});

  const skyId = path[path.length - 1];
  const sky = GUIDE_SKIES[skyId];
  const node = findNode(selected);

  const descend = React.useCallback((id: string) => {
    warpRef.current(1);
    setPath((p) => [...p, id]);
    setSelected(GUIDE_SKIES[id].nodes[0].id);
  }, []);

  const ascendTo = React.useCallback((i: number) => {
    warpRef.current(-1);
    setPath((p) => {
      const next = p.slice(0, i + 1);
      setSelected(GUIDE_SKIES[next[next.length - 1]].nodes[0].id);
      return next;
    });
  }, []);

  // Tapping a ringed star you're already on goes inside it, so the sky is
  // directly explorable rather than making you find the link every time.
  const tap = (id: string) => {
    if (id === selected && hasSky(id)) descend(id);
    else setSelected(id);
  };

  return (
    <div className="space-y-4">
      <nav aria-label="Where you are" className="flex flex-wrap items-center gap-1.5">
        {path.map((id, i) => {
          const name = id === "root" ? "Everleap" : GUIDE_SKIES[id].title;
          const last = i === path.length - 1;
          return (
            <React.Fragment key={id}>
              {last ? (
                <span className="text-micro font-semibold uppercase tracking-eyebrow text-white/80">
                  {name}
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => ascendTo(i)}
                    className="text-micro font-semibold uppercase tracking-eyebrow text-white/45 transition hover:text-white"
                  >
                    {name}
                  </button>
                  <span aria-hidden className="text-micro text-white/20">›</span>
                </>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,1fr)] lg:items-start">
        <div
          className="relative overflow-hidden rounded-card border border-white/[0.07]"
          style={{
            aspectRatio: `${VIEW_W} / ${VIEW_H}`,
            background:
              "radial-gradient(120% 90% at 50% 40%, #0a1330 0%, #040a1e 55%, #01050f 100%)",
          }}
        >
          <Starfield warpRef={warpRef} />
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="A map of Everleap as a sky of stars"
          >
            {sky.edges.map(([a, b]) => {
              const A = sky.nodes.find((n) => n.id === a);
              const B = sky.nodes.find((n) => n.id === b);
              if (!A || !B) return null;
              return (
                <line
                  key={`${a}-${b}`}
                  x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                  stroke={`rgba(${B.accent},0.30)`}
                  strokeWidth={1.2}
                />
              );
            })}

            {sky.nodes.map((n: GuideNode) => {
              // The source is drawn larger than the things it feeds. That is the
              // only hierarchy in the picture, and it's a fact about the app.
              const r = n.id === "story" ? 7 : 5.5;
              return (
                <g
                  key={n.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${n.label}${hasSky(n.id) ? ", opens further" : ""}`}
                  className="cursor-pointer"
                  onClick={() => tap(n.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tap(n.id); }
                  }}
                >
                  <circle cx={n.x} cy={n.y} r={r * 2.6} fill={`rgba(${n.accent},0.09)`} />
                  <circle cx={n.x} cy={n.y} r={r} fill={`rgba(${n.accent},0.9)`} />
                  {hasSky(n.id) ? (
                    <circle
                      cx={n.x} cy={n.y} r={r + 9}
                      fill="none" stroke={`rgba(${n.accent},0.45)`}
                      strokeWidth={1} strokeDasharray="2 4"
                    />
                  ) : null}
                  {n.id === selected ? (
                    <circle
                      cx={n.x} cy={n.y} r={r + 15}
                      fill="none" stroke={`rgba(${n.accent},0.8)`} strokeWidth={1.2}
                    />
                  ) : null}
                  <text
                    x={n.x}
                    y={n.y + (n.y > 190 ? -20 : 28)}
                    textAnchor="middle"
                    className="pointer-events-none fill-white/55 text-micro font-semibold uppercase tracking-eyebrow"
                  >
                    {n.label}
                  </text>
                  <circle cx={n.x} cy={n.y} r={26} fill="transparent" />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="rounded-card border border-white/[0.07] bg-white/[0.03] p-4">
          {node?.photo ? (
            <figure className="mb-3 overflow-hidden rounded-panel border border-white/10">
              {/* A real scene photo from the catalogue, so going deeper shows the
                  thing itself rather than another diagram of it. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/guidance/day-scene-image?path=${encodeURIComponent(node.photo)}&moment=m0`}
                alt=""
                loading="lazy"
                className="block h-auto w-full"
              />
              {node.photoCaption ? (
                <figcaption className="px-3 py-2 text-micro font-semibold uppercase tracking-eyebrow text-white/50">
                  {node.photoCaption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}

          {node ? (
            <>
              <div
                className="text-micro font-semibold uppercase tracking-eyebrow"
                style={{ color: `rgb(${node.accent})` }}
              >
                <span aria-hidden>✦</span> {node.label}
              </div>
              <p className="mt-2 text-body leading-snug text-white/88">{node.what}</p>
              {node.fills ? (
                <p className="mt-3 border-l-2 border-white/12 pl-3 text-label leading-snug text-white/62">
                  {node.fills}
                </p>
              ) : null}
              {hasSky(node.id) ? (
                <button
                  type="button"
                  onClick={() => descend(node.id)}
                  className="mt-4 inline-flex items-center gap-1.5 text-label font-semibold transition hover:brightness-125"
                  style={{ color: `rgb(${node.accent})` }}
                >
                  Look inside ↓
                </button>
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      {path.length > 1 ? (
        <button
          type="button"
          onClick={() => ascendTo(path.length - 2)}
          className="inline-flex items-center gap-1.5 text-label font-medium text-white/60 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back out
        </button>
      ) : null}
    </div>
  );
}

export default GuideSky;
