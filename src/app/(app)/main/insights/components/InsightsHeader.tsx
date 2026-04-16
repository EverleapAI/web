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

  const lenses: Array<{ id: InsightsLens; label: string }> = [
    { id: "all", label: "All" },
    { id: "motivations", label: "Motivations" },
    { id: "strengths", label: "Strengths" },
    { id: "skills", label: "Skills" },
    { id: "doppelganger", label: "Doppelgänger" },
  ];

  const pillBase = [
    "relative inline-flex items-center",
    "rounded-full border px-4 py-2.5",
    "text-sm font-semibold tracking-[-0.01em]",
    "backdrop-blur-xl",
    "transition",
    "active:scale-95",
    "whitespace-nowrap",
  ].join(" ");

  const pillInactive = dark
    ? "border-white/10 bg-white/[0.05] text-white/70 hover:bg-white/[0.08]"
    : "border-black/10 bg-black/[0.04] text-slate-800 hover:bg-black/[0.06]";

  const pillActive = dark
    ? "border-white/20 bg-gradient-to-b from-white/[0.16] to-white/[0.04] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_10px_30px_rgba(0,0,0,0.35)]"
    : "border-slate-300 bg-white text-slate-900 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.12)]";

  function scroll(dir: "left" | "right") {
    const el = wrapRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir === "left" ? -220 : 220,
      behavior: "smooth",
    });
    window.setTimeout(compute, 240);
  }

  return (
    <div className="mb-3">
      <div className="relative">
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-8 ${
            dark
              ? "bg-gradient-to-r from-[#0b1220] to-transparent"
              : "bg-gradient-to-r from-white to-transparent"
          } ${canLeft ? "opacity-100" : "opacity-0"} transition-opacity`}
        />

        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-8 ${
            dark
              ? "bg-gradient-to-l from-[#0b1220] to-transparent"
              : "bg-gradient-to-l from-white to-transparent"
          } ${canRight ? "opacity-100" : "opacity-0"} transition-opacity`}
        />

        {canLeft ? (
          <button
            type="button"
            onClick={() => scroll("left")}
            className={[
              "absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border p-2 transition active:scale-95 md:flex",
              dark
                ? "border-white/10 bg-[#0b1220]/80 text-white/72 hover:bg-[#0b1220]"
                : "border-black/10 bg-white/90 text-slate-800 hover:bg-white",
            ].join(" ")}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        ) : null}

        {canRight ? (
          <button
            type="button"
            onClick={() => scroll("right")}
            className={[
              "absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border p-2 transition active:scale-95 md:flex",
              dark
                ? "border-white/10 bg-[#0b1220]/80 text-white/72 hover:bg-[#0b1220]"
                : "border-black/10 bg-white/90 text-slate-800 hover:bg-white",
            ].join(" ")}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : null}

        <div
          ref={wrapRef}
          onScroll={compute}
          className="flex gap-2 overflow-x-auto pr-8 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-8"
        >
          {lenses.map((l) => {
            const active = l.id === lens;

            return (
              <button
                key={l.id}
                type="button"
                onClick={() => onLens(l.id)}
                className={[pillBase, active ? pillActive : pillInactive].join(
                  " "
                )}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}