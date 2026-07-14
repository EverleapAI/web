"use client";

// Dev-only switch for the card-chrome A/B. Renders nothing in production, so it
// cannot leak to users even if this branch ships. Delete along with
// lib/ui/chrome.ts once the call is made.

import * as React from "react";
import type { ChromeMode } from "@/lib/ui/chrome";

export function ChromeToggle({
  mode,
  onChange,
}: {
  mode: ChromeMode;
  onChange: (m: ChromeMode) => void;
}) {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-24 left-3 z-50 flex items-center gap-1 rounded-full border border-white/10 bg-black/70 p-1 backdrop-blur-md">
      {(["card", "bare"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          aria-pressed={mode === m}
          className={[
            "rounded-full px-3 py-1 text-[11px] font-semibold transition",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400",
            mode === m
              ? "bg-white text-black"
              : "text-white/55 hover:text-white/85",
          ].join(" ")}
        >
          {m === "card" ? "Card" : "Bare"}
        </button>
      ))}
    </div>
  );
}

export default ChromeToggle;
