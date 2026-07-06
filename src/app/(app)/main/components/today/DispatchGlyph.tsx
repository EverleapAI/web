"use client";

// The dispatch glyph — colour + mark = identity. You know what kind of morning
// it is before you read a word.

import { DISPATCH_ACCENT, type DispatchType } from "./todayHeart.types";

export function DispatchGlyph({ type }: { type: DispatchType }) {
  const a = DISPATCH_ACCENT[type] ?? DISPATCH_ACCENT.learn;

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="flex h-[18px] w-[18px] items-center justify-center rounded-md text-[10px] leading-none"
        style={{
          color: `rgb(${a.rgb})`,
          background: `rgba(${a.rgb},0.14)`,
          border: `1px solid rgba(${a.rgb},0.32)`,
        }}
      >
        {a.glyph}
      </span>
      <span
        className="text-[10px] font-bold uppercase tracking-[0.16em]"
        style={{ color: `rgba(${a.rgb},0.85)` }}
      >
        {a.label}
      </span>
    </span>
  );
}
