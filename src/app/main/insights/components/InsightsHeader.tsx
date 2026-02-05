// src/app/main/insights/components/InsightsHeader.tsx
"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { InsightsLens } from "../domain/types";

export function InsightsHeader(props: {
  dark: boolean;
  lens: InsightsLens;
  onLens: (lens: InsightsLens) => void;
}) {
  const { dark, lens, onLens } = props;

  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = React.useState(false);
  const [canRight, setCanRight] = React.useState(false);

  function compute() {
    const el = wrapRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  React.useEffect(() => {
    compute();
    const onResize = () => compute();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const chipBase = dark
    ? "border-white/10 bg-white/5 text-white/80 hover:bg-white/8"
    : "border-black/10 bg-white/75 text-slate-800 hover:bg-white";

  const chipActive = dark
    ? "border-white/18 bg-gradient-to-r from-white/12 via-white/8 to-white/6 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_10px_28px_rgba(56,189,248,0.12)]"
    : "border-sky-300 bg-gradient-to-r from-sky-50 via-white to-white text-slate-900 shadow-[0_0_0_1px_rgba(56,189,248,0.20),0_10px_24px_rgba(56,189,248,0.12)]";

  const labelMuted = dark
    ? "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/55"
    : "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500";

  const titleClass = dark ? "text-white" : "text-slate-900";
  const subClass = dark ? "text-white/65" : "text-slate-600";

  const lenses: Array<{ id: InsightsLens; label: string; sub: string }> = [
    { id: "all", label: "All", sub: "Full read" },
    { id: "motivations", label: "Motivations", sub: "What drives you" },
    { id: "strengths", label: "Strengths", sub: "How you operate" },
    { id: "skills", label: "Skills", sub: "What you build" },
    { id: "doppelganger", label: "Doppelgänger", sub: "Fun match" },
  ];

  const scroll = (dir: "left" | "right") => {
    const el = wrapRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -260 : 260, behavior: "smooth" });
    window.setTimeout(compute, 250);
  };

  return (
    <div className="mb-5">
      <div className={labelMuted}>Insights</div>
      <div className={`mt-1 text-2xl font-semibold ${titleClass}`}>Your report so far</div>
      <div className={`mt-1 max-w-2xl text-sm ${subClass}`}>
        A coach-style read of your Motivations, Strengths, and Skills — plus what to do next.
      </div>

      <div className="relative mt-4">
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 left-0 w-10 ${
            dark ? "bg-gradient-to-r from-slate-950/70 to-transparent" : "bg-gradient-to-r from-white/80 to-transparent"
          } ${canLeft ? "opacity-100" : "opacity-0"} transition-opacity`}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 right-0 w-10 ${
            dark ? "bg-gradient-to-l from-slate-950/70 to-transparent" : "bg-gradient-to-l from-white/80 to-transparent"
          } ${canRight ? "opacity-100" : "opacity-0"} transition-opacity`}
        />

        {canLeft ? (
          <button
            type="button"
            onClick={() => scroll("left")}
            className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border p-2 shadow-lg transition active:scale-95 ${
              dark ? "border-white/10 bg-slate-950/55 text-white hover:bg-slate-950/70" : "border-slate-200 bg-white/85 text-slate-800 hover:bg-white"
            }`}
            aria-label="Scroll lenses left"
            title="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        ) : null}

        {canRight ? (
          <button
            type="button"
            onClick={() => scroll("right")}
            className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border p-2 shadow-lg transition active:scale-95 ${
              dark ? "border-white/10 bg-slate-950/55 text-white hover:bg-slate-950/70" : "border-slate-200 bg-white/85 text-slate-800 hover:bg-white"
            }`}
            aria-label="Scroll lenses right"
            title="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : null}

        <div
          ref={wrapRef}
          onScroll={() => compute()}
          className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex items-stretch gap-2 pr-2">
            {lenses.map((l) => {
              const active = l.id === lens;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => onLens(l.id)}
                  className={[
                    "relative inline-flex shrink-0 flex-col items-start gap-0.5 rounded-2xl border px-4 py-2.5 text-left transition",
                    active ? chipActive : chipBase,
                  ].join(" ")}
                >
                  {active ? (
                    <span
                      aria-hidden
                      className={`absolute left-1 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full ${
                        dark ? "bg-white/35" : "bg-sky-400/70"
                      }`}
                    />
                  ) : null}
                  <span className="text-sm font-semibold leading-tight">{l.label}</span>
                  <span className={`text-xs leading-tight ${dark ? "text-white/55" : "text-slate-600/80"}`}>
                    {l.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
