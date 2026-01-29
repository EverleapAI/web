// src/app/main/components/HowEverleapWorks.tsx
"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function HowEverleapWorks(props: {
  dark: boolean;
  textMutedClass: string; // e.g. dark ? "text-slate-300/85" : "text-slate-700"
}) {
  const { dark, textMutedClass } = props;

  const [open, setOpen] = React.useState(false);

  const rowHover = dark ? "hover:bg-white/5" : "hover:bg-black/4";
  const pillBorder = dark ? "border-white/12" : "border-black/12";
  const pillText = dark ? "text-white/60" : "text-slate-600";

  return (
    <div className="pt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "group w-full rounded-2xl px-2 py-3 text-left transition",
          rowHover,
          "focus:outline-none focus:ring-2",
          dark ? "focus:ring-white/20" : "focus:ring-black/15",
        ].join(" ")}
        aria-expanded={open}
      >
        {/* Header row */}
        <div className="flex items-center gap-3">
          <span
            className={[
              "text-sm font-semibold leading-relaxed",
              dark ? "text-white/85" : "text-slate-900",
              "group-hover:underline",
            ].join(" ")}
          >
            How does Everleap work?
          </span>

          <span
            className={[
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1",
              "text-[11px] font-semibold uppercase tracking-[0.18em]",
              pillBorder,
              pillText,
            ].join(" ")}
          >
            {open ? "less" : "learn more"}
            {open ? (
              <ChevronUp className="h-4 w-4 opacity-70 group-hover:opacity-90" />
            ) : (
              <ChevronDown className="h-4 w-4 opacity-70 group-hover:opacity-90" />
            )}
          </span>
        </div>
      </button>

      {open ? (
        <div className={`mt-3 space-y-3 text-sm leading-relaxed ${textMutedClass}`}>
          <p>
            Everleap learns from what you answer, what you explore, and what you actually do — then
            uses that to choose better next steps.
          </p>
          <p>
            <span className="font-semibold">Signals</span> are your starter baseline (Motivations →
            Strengths → Skills). Over time, that baseline expands as you use the app, so your “next
            up” shifts based on what you’ve done recently.
          </p>
        </div>
      ) : null}
    </div>
  );
}