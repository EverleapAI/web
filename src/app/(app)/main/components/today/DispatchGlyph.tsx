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

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="flex h-[26px] w-[26px] items-center justify-center rounded-lg text-[13px] leading-none"
        style={{
          color: `rgb(${a.rgb})`,
          background: `rgba(${a.rgb},0.12)`,
          border: `1px solid rgba(${a.rgb},0.3)`,
        }}
      >
        {a.glyph}
      </span>
      {showLabel ? (
        <span
          className="text-[10px] font-bold uppercase tracking-[0.16em]"
          style={{ color: `rgba(${a.rgb},0.85)` }}
        >
          {a.label}
        </span>
      ) : null}
    </span>
  );
}
