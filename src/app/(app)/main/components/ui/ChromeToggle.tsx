"use client";

// Dev-only design A/B switch. Renders nothing in production, so it cannot leak to
// users even if this branch ships. Delete along with lib/ui/chrome.ts once the
// calls are made.

import * as React from "react";
import type { ChromeMode, ReadFace } from "@/lib/ui/chrome";

function Row<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 text-[9px] font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </span>
      <div className="flex items-center gap-1">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            aria-pressed={value === o.id}
            className={[
              "rounded-full px-2.5 py-1 text-[11px] font-semibold transition",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400",
              value === o.id
                ? "bg-white text-black"
                : "text-white/55 hover:text-white/85",
            ].join(" ")}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ChromeToggle({
  mode,
  onChange,
  face,
  onFaceChange,
}: {
  mode: ChromeMode;
  onChange: (m: ChromeMode) => void;
  face: ReadFace;
  onFaceChange: (f: ReadFace) => void;
}) {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-24 left-3 z-50 flex flex-col gap-1.5 rounded-2xl border border-white/10 bg-black/75 p-2 backdrop-blur-md">
      <Row
        label="Face"
        value={face}
        onChange={onFaceChange}
        options={[
          { id: "sans", label: "Sans" },
          { id: "serif", label: "Serif" },
        ] as const}
      />
      <Row
        label="Card"
        value={mode}
        onChange={onChange}
        options={[
          { id: "card", label: "Card" },
          { id: "bare", label: "Bare" },
        ] as const}
      />
    </div>
  );
}

export default ChromeToggle;
