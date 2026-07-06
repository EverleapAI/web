"use client";

import * as React from "react";

// Shown while today's guidance is still loading, so the hero is never a blank
// glowing box. Mirrors TodayCard's shape (eyebrow, headline, a paragraph, the
// "what caught my attention" accent block, and the CTA).
export function TodayCardSkeleton() {
  return (
    <div className="min-h-[330px] animate-pulse" aria-hidden>
      <div className="mb-5 flex items-center gap-2">
        <span className="h-5 w-5 rounded-full bg-white/[0.06]" />
        <span className="h-2.5 w-14 rounded bg-white/[0.06]" />
      </div>

      <div className="space-y-2.5">
        <div className="h-6 w-4/5 rounded-lg bg-white/[0.10]" />
        <div className="h-6 w-3/5 rounded-lg bg-white/[0.10]" />
      </div>

      <div className="mt-6 space-y-3">
        <div className="h-3.5 w-full rounded bg-white/[0.055]" />
        <div className="h-3.5 w-11/12 rounded bg-white/[0.055]" />

        <div className="mt-4 space-y-2 border-l-2 border-cyan-300/25 pl-4">
          <div className="h-2.5 w-40 rounded bg-cyan-300/12" />
          <div className="h-4 w-full rounded bg-white/[0.07]" />
          <div className="h-4 w-4/5 rounded bg-white/[0.07]" />
        </div>

        <div className="h-3.5 w-3/4 rounded bg-white/[0.05]" />
      </div>

      <div className="mt-7 flex justify-end">
        <div className="h-9 w-40 rounded-full bg-white/[0.07]" />
      </div>
    </div>
  );
}
