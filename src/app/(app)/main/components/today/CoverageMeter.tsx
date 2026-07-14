"use client";

// The coverage meter — the honest "signal" readout. Six segments fill in as
// Everleap learns real things about you. The empty cells are the ask.

import type { Coverage } from "./todayHeart.types";

export function CoverageMeter({
  coverage,
  accentRgb,
}: {
  coverage: Coverage;
  accentRgb: string;
}) {
  const { areas, filledCount, total, nextGapLabel } = coverage;

  return (
    <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3">
      <div className="flex items-baseline justify-between">
        <div className="text-micro font-semibold uppercase tracking-eyebrow text-white/40">
          The picture forming
        </div>
        <div className="text-micro tabular-nums text-white/55">
          {filledCount} / {total}
        </div>
      </div>

      <div className="mt-2 flex gap-1.5">
        {areas.map((area) => (
          <span
            key={area.key}
            title={`${area.label}${area.filled ? "" : " — not yet"}`}
            className="h-1.5 flex-1 rounded-full transition-colors"
            style={
              area.filled
                ? {
                    background: `rgb(${accentRgb})`,
                    boxShadow: `0 0 8px rgba(${accentRgb},0.5)`,
                  }
                : { background: "rgba(255,255,255,0.08)" }
            }
          />
        ))}
      </div>

      {nextGapLabel ? (
        <div className="mt-2 text-micro text-white/55">
          Next:{" "}
          <span style={{ color: `rgb(${accentRgb})` }} className="font-medium">
            {nextGapLabel}
          </span>
        </div>
      ) : (
        <div className="mt-2 text-micro text-white/55">
          Your picture is full — nice.
        </div>
      )}
    </div>
  );
}
