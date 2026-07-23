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
// day is Today's whole context; Insights and Explore say their own name.
//
// It is the section MASTHEAD, and it is meant to be seen. A voice screen has no
// headline over its prose (the one-voice rule — "people do not talk in headers"),
// so without this the screen had no anchor at all and read as starting mid-sentence
// under a faint label. The masthead is furniture, not the agent talking — an
// all-caps tracked signpost — so making it prominent does not reintroduce a headline
// over the read: it just tells you what screen you are on, the way Actions' title
// does. See SECTION_MASTHEAD_CLASS in lib/ui/prose.

import * as React from "react";

import { SECTION_MASTHEAD_CLASS } from "@/lib/ui/prose";

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
        className={SECTION_MASTHEAD_CLASS}
        style={{ color: `rgb(${accentRgb})`, opacity: 0.92 }}
      >
        {eyebrow}
      </span>

      {action ? <span className="ml-auto">{action}</span> : null}
    </div>
  );
}

export default AgenticHeader;
