// src/app/main/explore/renderers/TravelRenderer.tsx
"use client";

import * as React from "react";
import { Plane, MapPin, ChevronRight, Bookmark, ArrowUpRight } from "lucide-react";

import type { ExploreRendererProps } from "../content/types";

export default function TravelRenderer({ chip, dark }: ExploreRendererProps) {
  const area = chip.area;

  const shell = dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white";
  const panel = dark ? "border-white/10 bg-white/5" : "border-black/10 bg-slate-50";
  const titleC = dark ? "text-white" : "text-slate-900";
  const muted = dark ? "text-white/70" : "text-slate-600";

  const glow = `bg-gradient-to-br ${area.glowClass}`;

  return (
    <div className="space-y-3">
      {/* Hero */}
      <div className={`relative overflow-hidden rounded-3xl border p-4 ${shell}`}>
        <div className="pointer-events-none absolute inset-0">
          <div
            className={`absolute -top-10 -left-10 h-56 w-56 rounded-full blur-3xl opacity-25 ${glow}`}
          />
          <div
            className={`absolute -bottom-16 -right-10 h-64 w-64 rounded-full blur-3xl opacity-20 ${glow}`}
          />
        </div>

        <div className="relative flex items-start gap-3">
          <div
            className={`mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border ${
              dark ? "border-white/10 bg-white/10 text-white" : "border-black/10 bg-white text-slate-900"
            }`}
            aria-hidden
          >
            <Plane className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className={`text-sm font-semibold ${titleC}`}>{area.headline}</div>
            <div className={`mt-1 text-sm ${muted}`}>{area.summary}</div>
            {area.hint ? <div className={`mt-2 text-xs ${muted}`}>{area.hint}</div> : null}
          </div>

          {area.href ? (
            <a
              href={area.href}
              className={`hidden sm:inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium ${
                dark
                  ? "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                  : "border-black/10 bg-white/80 text-black/70 hover:bg-white"
              }`}
            >
              Open <ArrowUpRight className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </div>

      {/* Signals as “vibes” */}
      {area.signals?.length ? (
        <div className={`rounded-3xl border p-4 ${shell}`}>
          <div
            className={`text-xs font-semibold uppercase tracking-[0.18em] ${
              dark ? "text-white/60" : "text-slate-500"
            }`}
          >
            Travel vibes
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {area.signals.map((s) => (
              <span
                key={s}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                  dark
                    ? "border-white/10 bg-white/5 text-white/80"
                    : "border-black/10 bg-white text-slate-700"
                }`}
              >
                <MapPin className="h-3.5 w-3.5 opacity-70" />
                {s}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* Next moves become “plan bites” */}
      {area.nextMoves?.length ? (
        <div className={`rounded-3xl border p-4 ${shell}`}>
          <div
            className={`text-xs font-semibold uppercase tracking-[0.18em] ${
              dark ? "text-white/60" : "text-slate-500"
            }`}
          >
            Plan bites
          </div>

          <div className="mt-3 space-y-2">
            {area.nextMoves.map((m) => (
              <div key={m.id} className={`rounded-2xl border p-3 ${panel}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className={`text-sm font-semibold ${titleC}`}>{m.title}</div>
                    <div className={`mt-1 text-xs ${muted}`}>{m.blurb}</div>
                  </div>
                  <ChevronRight className={`mt-0.5 h-4 w-4 ${dark ? "text-white/60" : "text-slate-500"}`} />
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.72rem] font-medium ${
                      dark
                        ? "border-white/10 bg-white/5 text-white/80"
                        : "border-black/10 bg-white/80 text-black/70"
                    }`}
                  >
                    <Bookmark className="h-3.5 w-3.5 opacity-70" />
                    Save
                  </button>

                  <button
                    type="button"
                    className={`rounded-full border px-3 py-1.5 text-[0.72rem] font-medium ${
                      dark
                        ? "border-white/10 bg-white/5 text-white/80"
                        : "border-black/10 bg-white/80 text-black/70"
                    }`}
                  >
                    Add to plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Cards become “destinations / ideas” */}
      {area.cards?.length ? (
        <div className={`rounded-3xl border p-4 ${shell}`}>
          <div
            className={`text-xs font-semibold uppercase tracking-[0.18em] ${
              dark ? "text-white/60" : "text-slate-500"
            }`}
          >
            Destinations & ideas
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {area.cards.map((c) => (
              <div
                key={c.id}
                className={`rounded-2xl border p-3 ${
                  dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl border ${
                      dark
                        ? "border-white/10 bg-white/10 text-white"
                        : "border-black/10 bg-slate-50 text-slate-900"
                    }`}
                    aria-hidden
                  >
                    <span className="text-base">{c.icon}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-semibold ${titleC}`}>{c.title}</div>
                    <div className={`mt-1 text-xs ${muted}`}>{c.short}</div>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={`rounded-full border px-3 py-1.5 text-[0.72rem] font-medium ${
                      dark
                        ? "border-white/10 bg-white/5 text-white/80"
                        : "border-black/10 bg-white/80 text-black/70"
                    }`}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className={`rounded-full border px-3 py-1.5 text-[0.72rem] font-medium ${
                      dark
                        ? "border-white/10 bg-white/5 text-white/80"
                        : "border-black/10 bg-white/80 text-black/70"
                    }`}
                  >
                    Explore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
