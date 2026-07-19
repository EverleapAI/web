// apps/web/src/app/(app)/main/explore/_components/DayRibbon.tsx
//
// The day, drawn.
//
// The depth brief's unbuilt object was "a day, scrubbable" — the shape of a
// working day you grasp at a glance instead of reading four paragraphs to
// assemble. This is that: one continuous dawn-to-dusk band, with a marker per
// moment, that you can tap to jump.
//
// It is deliberately NOT a calendar grid. Of 1,599 day-moments in the catalog,
// 1,594 carry a named period ("Late morning", "After school", "Late night") and
// five carry a clock time. Drawing 09:00–10:30 blocks would invent precision we
// don't have — and plenty of these careers aren't nine-to-five, so an office-day
// grid would quietly misrepresent every shift worker in it.
//
// So the band is honest about what it knows: order, rough time of day, and the
// light at that hour. The gradient carries the fact; the labels confirm it.

"use client";

import * as React from "react";

import { hourOf, skyTintAt } from "./DayDescent";

export type RibbonMoment = { id: string; timeLabel?: string; title: string };

export function DayRibbon({
  moments,
  active,
  onJump,
  outroActive = false,
}: {
  moments: RibbonMoment[];
  /** Index of the current moment. */
  active: number;
  onJump: (index: number) => void;
  /** True when the reader is past the last moment, on the closing step. */
  outroActive?: boolean;
}) {
  const hours = React.useMemo(() => moments.map((m) => hourOf(m.timeLabel)), [moments]);

  // The band runs from a little before the first moment to a little after the
  // last, so the day has edges rather than starting abruptly on someone's first
  // appointment.
  const { from, to } = React.useMemo(() => {
    if (hours.length === 0) return { from: 6, to: 20 };
    const lo = Math.min(...hours);
    const hi = Math.max(...hours);
    // A day that spans nothing (all moments the same hour) still needs width.
    return { from: Math.max(0, lo - 1.5), to: Math.min(24, Math.max(hi + 1.5, lo + 4)) };
  }, [hours]);

  const pos = React.useCallback(
    (hour: number) => {
      const span = Math.max(1, to - from);
      return Math.min(97, Math.max(3, ((hour - from) / span) * 100));
    },
    [from, to]
  );

  // Named periods are coarse, so two moments in the same one — "Midday" and
  // "Afternoon", or simply two morning beats — land on the identical hour and
  // draw one marker on top of another. The day then looks shorter than it is and
  // the buried moment can't be tapped at all.
  //
  // So hours propose and this disposes: walk left to right and push each marker
  // far enough past the previous one to stay its own target, then shift the whole
  // run back if that pushed it off the end. Order and rough time of day survive;
  // only exact spacing gives, and that was never precise to begin with.
  const marks = React.useMemo(() => {
    const MIN_GAP = 7;
    const laid = hours.map((h) => pos(h));
    for (let i = 1; i < laid.length; i++) {
      laid[i] = Math.max(laid[i], laid[i - 1] + MIN_GAP);
    }
    const overflow = (laid[laid.length - 1] ?? 0) - 97;
    if (overflow > 0) {
      const shift = Math.min(overflow, (laid[0] ?? 0) - 3);
      for (let i = 0; i < laid.length; i++) laid[i] -= shift;
      // Still too wide to give everyone their gap: spread evenly instead of
      // letting the tail run off the edge.
      if ((laid[laid.length - 1] ?? 0) > 97) {
        const span = 94 / Math.max(1, laid.length - 1);
        for (let i = 0; i < laid.length; i++) laid[i] = 3 + i * span;
      }
    }
    return laid;
  }, [hours, pos]);

  // Sample the sky across the band so the gradient is the actual arc of light,
  // not a blend between two endpoints.
  const gradient = React.useMemo(() => {
    const stops: string[] = [];
    const steps = 8;
    for (let i = 0; i <= steps; i++) {
      const hour = from + ((to - from) * i) / steps;
      stops.push(`${skyTintAt(hour)} ${(i / steps) * 100}%`);
    }
    return `linear-gradient(90deg, ${stops.join(", ")})`;
  }, [from, to]);

  const current = moments[active];

  return (
    <div className="min-w-0">
      <div className="relative h-3">
        {/* The day itself. */}
        <div
          className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full"
          style={{ background: gradient, opacity: 0.9 }}
        />
        {/* Where you've been dims what's ahead, so progress is still legible. */}
        <div
          className="pointer-events-none absolute top-1/2 h-2 -translate-y-1/2 rounded-r-full bg-[#05070f]/30 transition-all duration-300"
          style={{
            left: `${outroActive ? 100 : marks[active] ?? 50}%`,
            right: 0,
          }}
        />
        {moments.map((m, i) => {
          const left = marks[i] ?? 50;
          const isNow = i === active && !outroActive;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onJump(i)}
              aria-label={`${m.timeLabel ? `${m.timeLabel}: ` : ""}${m.title}`}
              aria-current={isNow ? "step" : undefined}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all"
              style={{
                left: `${left}%`,
                width: isNow ? 14 : 9,
                height: isNow ? 14 : 9,
                background: isNow ? "#fff" : "rgba(255,255,255,0.85)",
                boxShadow: isNow
                  ? `0 0 0 4px rgba(255,255,255,0.18), 0 0 14px 3px ${skyTintAt(hours[i] ?? 12)}`
                  : "0 0 0 2px rgba(5,7,15,0.55)",
              }}
            />
          );
        })}
      </div>

      {/* One label, for the moment you're on. Four period names won't fit across
          a phone, and abbreviating them would lose the plain-language reading. */}
      <div className="mt-1.5 flex items-baseline justify-between gap-2">
        <span className="truncate text-micro font-semibold uppercase tracking-eyebrow text-white/60">
          {outroActive ? "That’s the day" : current?.timeLabel || "Through the day"}
        </span>
        <span className="shrink-0 text-micro text-white/35">
          {outroActive ? "" : `${active + 1} / ${moments.length}`}
        </span>
      </div>
    </div>
  );
}

export default DayRibbon;
