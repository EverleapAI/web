"use client";

// The dispatch glyph — colour + mark = identity. You know what kind of morning
// it is before you read a word.

import { DISPATCH_ACCENT, type DispatchType } from "./todayHeart.types";

export function DispatchGlyph({
  type,
  showLabel = true,
}: {
  type: DispatchType;
  showLabel?: boolean;
}) {
  const a = DISPATCH_ACCENT[type] ?? DISPATCH_ACCENT.learn;

  // The mark keeps its per-type shape but sits in a quiet neutral — gold is
  // rationed to a single element per card (the CTA), so the glyph doesn't
  // compete for that one accent.
  const neutral = "181,186,196"; // --text-secondary

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="flex h-[26px] w-[26px] items-center justify-center rounded-lg text-[13px] leading-none"
        style={{
          color: `rgba(${neutral},0.72)`,
          background: `rgba(${neutral},0.05)`,
          border: `1px solid rgba(${neutral},0.12)`,
        }}
      >
        {a.glyph}
      </span>
      {showLabel ? (
        <span
          className="text-[10px] font-bold uppercase tracking-[0.16em]"
          style={{ color: `rgba(${neutral},0.72)` }}
        >
          {a.label}
        </span>
      ) : null}
    </span>
  );
}
