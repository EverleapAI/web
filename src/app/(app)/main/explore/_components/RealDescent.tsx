// apps/web/src/app/(app)/main/explore/_components/RealDescent.tsx
//
// "Try it for real", as its own screen.
//
// This is the star the whole constellation points at — the one that turns
// reading into going — and it was a card wedged under the map, the same size as
// everything else, competing with a star field for attention. On its own screen
// there is nothing else to look at, which is the correct amount of competition
// for the only control here that asks you to leave the app and go do something.
//
// Honey rather than the lane's colour, because a mission is a mission whichever
// lane you reached it from.

"use client";

import * as React from "react";
import { ArrowRight, Check, Loader2, Wand2 } from "lucide-react";

import { DescentShell } from "./DescentShell";

const HONEY = "244, 192, 103";

export function RealDescent({
  specialtyTitle,
  creating,
  onStart,
  onClose,
}: {
  specialtyTitle: string;
  creating: boolean;
  onStart: () => void;
  onClose: () => void;
}) {
  return (
    <DescentShell accent={HONEY} step={0} total={1} onClose={onClose} backTo={specialtyTitle}>
      <div className="text-micro font-semibold uppercase tracking-eyebrow" style={{ color: `rgb(${HONEY})` }}>
        {specialtyTitle}
      </div>
      <h1 className="mt-2 text-title font-semibold leading-display tracking-title text-white">
        The deep end is a taste, not a paragraph.
      </h1>
      <p className="mt-3 text-read leading-read text-white/82">
        One small, real thing to actually do this week — proof you didn&rsquo;t just read about{" "}
        {specialtyTitle}, you went.
      </p>

      <button
        type="button"
        onClick={onStart}
        disabled={creating}
        className="mt-6 flex w-full items-center justify-between gap-3 rounded-xl px-5 py-4 text-left text-label font-semibold transition hover:brightness-105 disabled:opacity-70"
        style={{ background: `linear-gradient(180deg, #ffdf9e, rgb(${HONEY}))`, color: "#1a1204" }}
      >
        <span className="inline-flex items-center gap-2.5">
          <Wand2 className="h-5 w-5 shrink-0" />
          Try {specialtyTitle} for real — start a mission
        </span>
        {creating ? (
          <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
        ) : (
          <ArrowRight className="h-5 w-5 shrink-0" />
        )}
      </button>

      <div className="mt-4 flex items-start gap-2.5 text-meta leading-read" style={{ color: `rgb(${HONEY})` }}>
        <span
          className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border border-dashed"
          style={{ borderColor: `rgba(${HONEY},0.6)` }}
        >
          <Check className="h-3 w-3" />
        </span>
        <span>Doing it drops a moment you keep — and a Direction starts forming.</span>
      </div>
    </DescentShell>
  );
}

export default RealDescent;
