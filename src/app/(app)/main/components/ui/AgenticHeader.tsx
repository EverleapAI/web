"use client";

// The header every agentic surface wears — Today, Insights, Explore.
//
// One glyph, one eyebrow, both LEFT. The eyebrow used to be absolutely centred on
// Today (`left-1/2 -translate-x-1/2`), which was fine while the masthead was
// centred too. Once the masthead went left-aligned the eyebrow was left floating
// in the middle of the row over nothing, with the glyph stranded at the far edge —
// it read as a bug, because it was one.
//
// The eyebrow names WHERE (or WHEN) you are: Today says the weekday, because the
// day is Today's whole context; Insights and Explore say their own name. It is
// deliberately the quietest thing on the card — the agent's opening sentence, one
// line below, is what should land first.

import * as React from "react";

import { EYEBROW_CLASS } from "@/lib/ui/prose";

export function AgenticHeader({
  glyph,
  eyebrow,
  accentRgb,
  action,
}: {
  /** The surface's mark — Today's dispatch glyph, Insights' sparkles, Explore's compass. */
  glyph: React.ReactNode;
  /** Weekday on Today; the surface name elsewhere. Rendered uppercase. */
  eyebrow: string;
  /** "r, g, b" — the surface's accent, so the eyebrow tints to match the card. */
  accentRgb: string;
  /** Optional trailing control (e.g. the prompt-lab dot). */
  action?: React.ReactNode;
}) {
  return (
    <div className="relative mb-3 flex items-center gap-2.5">
      {glyph}

      <span
        className={EYEBROW_CLASS}
        style={{ color: `rgb(${accentRgb})`, opacity: 0.55 }}
      >
        {eyebrow}
      </span>

      {action ? <span className="ml-auto">{action}</span> : null}
    </div>
  );
}

export default AgenticHeader;
