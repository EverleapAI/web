"use client";

import * as React from "react";

import { ConstellationAnchor } from "./ConstellationAnchor";

type Rgb = { r: number; g: number; b: number };

// The tamed constellation every agentic READ wears — Today's exact recipe, pulled
// out so Insights / Explore / Fun Facts wear it identically instead of passing a
// raw ConstellationAnchor.
//
// A raw anchor sits at full intensity with sharp star points over the whole card;
// on a tall read (Insights) that reads as a heavy background with hard edges. This
// dims it (opacity 0.5), softens the points (blur 1.2px), and masks it so the
// atmosphere lives up top behind the eyebrow and dissolves before the reading copy
// — text never sits on a bright star. Pass THIS, not ConstellationAnchor, as a
// voice card's `backdrop`.
export function ReadAtmosphere({ seed, accent }: { seed: string; accent: Rgb }) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        opacity: 0.5,
        filter: "blur(1.2px)",
        WebkitMaskImage:
          "linear-gradient(180deg, #000 0%, #000 14%, transparent 40%), linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)",
        WebkitMaskComposite: "source-in",
        maskImage:
          "linear-gradient(180deg, #000 0%, #000 14%, transparent 40%), linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)",
        maskComposite: "intersect",
      }}
    >
      <ConstellationAnchor seed={seed} accent={accent} />
    </div>
  );
}

export default ReadAtmosphere;
