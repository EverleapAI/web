// src/app/main/explore/renderers/HobbiesRenderer.tsx
"use client";

import * as React from "react";
import {
  Gamepad2,
  Dice5,
  Sparkles,
  ChevronRight,
  Bookmark,
  Flame,
} from "lucide-react";

import type { ExploreRendererProps } from "../content/types";

export default function HobbiesRenderer({ chip, dark }: ExploreRendererProps) {
  const area = chip.area;

  const shell = dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white";
  const soft = dark ? "border-white/10 bg-white/5" : "border-black/10 bg-slate-50";
  const titleC = dark ? "text-white" : "text-slate-900";
  const muted = dark ? "text-white/70" : "text-slate-600";

  const glow = `bg-gradient-to-br ${area.glowClass}`;

  // Make a fun “deck” by mixing nextMoves + cards (like a hobby feed)
  const deck = React.useMemo(() => {
    const moves =
      (area.nextMoves ?? []).map((m) => ({
        id: `m-${m.id}`,
        title: m.title,
        short: m.blurb,
        tag: "try",
        icon: "🔥",
      })) ?? [];

    const cards =
      (area.cards ?? []).map((c) => ({
        id: `c-${c.id}`,
        title: c.title,
        short: c.short,
        tag: "idea",
        icon: c.icon || "✨",
      })) ?? [];

    const out: Array<{ id: string; title: string; short: string; tag: string; icon: string }> = [];
    const max = Math.max(moves.length, cards.length);
    for (let i = 0; i < max; i++) {
      if (cards[i]) out.push(cards[i]);
      if (moves[i]) out.push(moves[i]);
    }
    return out.slice(0, 10);
  }, [area.cards, area.nextMoves]);

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
            <Gamepad2 className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className={`text-sm font-semibold ${titleC}`}>{area.headline}</div>
            <div className={`mt-1 text-sm ${muted}`}>{area.summary}</div>

            <div className="mt-2 flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                  dark
                    ? "border-white/10 bg-white/5 text-white/80"
                    : "border-black/10 bg-white text-slate-700"
                }`}
              >
                <Dice5 className="h-3.5 w-3.5 opacity-70" />
                playful
              </span>
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                  dark
                    ? "border-white/10 bg-white/5 text-white/80"
                    : "border-black/10 bg-white text-slate-700"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 opacity-70" />
                low stakes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Signals row (as “flavors”) */}
      {area.signals?.length ? (
        <div className={`rounded-3xl border p-4 ${shell}`}>
          <div
            className={`text-xs font-semibold uppercase tracking-[0.18em] ${
              dark ? "text-white/60" : "text-slate-500"
            }`}
          >
            Flavors
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
                <Flame className="h-3.5 w-3.5 opacity-60" />
                {s}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* Deck */}
      <div className={`rounded-3xl border p-4 ${shell}`}>
        <div
          className={`text-xs font-semibold uppercase tracking-[0.18em] ${
            dark ? "text-white/60" : "text-slate-500"
          }`}
        >
          Your hobby deck
        </div>

        <div className="mt-3 space-y-2">
          {deck.length ? (
            deck.map((d) => (
              <div key={d.id} className={`rounded-2xl border p-3 ${soft}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-xl border text-sm ${
                          dark
                            ? "border-white/10 bg-white/10 text-white"
                            : "border-black/10 bg-white text-slate-900"
                        }`}
                        aria-hidden
                      >
                        {d.icon}
                      </span>

                      <div className={`truncate text-sm font-semibold ${titleC}`}>
                        {d.title}
                      </div>

                      <span
                        className={`rounded-full px-2 py-0.5 text-[0.7rem] ${
                          dark ? "bg-white/10 text-white/75" : "bg-black/10 text-black/65"
                        }`}
                      >
                        {d.tag}
                      </span>
                    </div>

                    <div className={`mt-1 text-xs ${muted}`}>{d.short}</div>
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
                    Try this
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={`rounded-2xl border p-5 ${soft}`}>
              <div className={`text-sm font-semibold ${titleC}`}>No hobby ideas yet</div>
              <div className={`mt-1 text-sm ${muted}`}>
                Add items to <span className="font-mono text-[0.9em]">cards[]</span> or{" "}
                <span className="font-mono text-[0.9em]">nextMoves[]</span> in the hobbies content.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
