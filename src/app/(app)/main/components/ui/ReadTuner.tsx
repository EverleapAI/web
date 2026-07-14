"use client";

// Dev-only reading tuner. Renders nothing in production.
//
// It exists because the read "reads hard on mobile" and there are FOUR candidate
// causes, which cannot be untangled by argument on a laptop:
//
//   1. WEIGHT — 400 may simply be too light. Until now the app shipped no font at
//      all, so Segoe UI (no 500) rounded everything between 401 and 599 to
//      thin-or-semibold, while SF Pro on iOS rendered a true 500. The two devices
//      literally disagreed. Inter is variable, so 450/500 are now real on both.
//   2. SMOOTHING — `-webkit-font-smoothing: antialiased` swaps subpixel rendering
//      for grayscale AA, which makes glyphs render visibly THINNER. It is a WebKit
//      behaviour, so it hits iPhone hard and barely touches Windows. This is the
//      prime suspect for a problem that is *specifically* mobile.
//   3. TRACKING — light text bleeds outward on a dark ground (halation), so
//      dark-mode prose genuinely wants a little more letter-spacing than
//      light-mode. Zero was probably an over-correction.
//   4. HEADING — if these pages are a conversation, the agent's first sentence
//      should not be bolder than its second.
//
// Drive it on the actual phone (the dev server is on the LAN) and settle it in one
// pass, rather than through production deploys. Delete this file once the numbers
// are chosen and written into globals.css.

import * as React from "react";

type Row<T extends string | number> = {
  label: string;
  value: T;
  options: readonly T[];
  onPick: (v: T) => void;
  fmt?: (v: T) => string;
};

function Dial<T extends string | number>({ label, value, options, onPick, fmt }: Row<T>) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-14 shrink-0 text-[9px] font-bold uppercase tracking-[0.12em] text-white/40">
        {label}
      </span>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={String(o)}
            type="button"
            onClick={() => onPick(o)}
            aria-pressed={value === o}
            className={[
              "rounded-full px-2 py-[3px] text-[11px] font-semibold tabular-nums transition",
              value === o ? "bg-white text-black" : "text-white/55 hover:text-white/90",
            ].join(" ")}
          >
            {fmt ? fmt(o) : String(o)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ReadTuner() {
  const [weight, setWeight] = React.useState(400);
  const [heading, setHeading] = React.useState(600);
  const [track, setTrack] = React.useState(0);
  const [smooth, setSmooth] = React.useState<"antialiased" | "auto">("antialiased");
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--read-weight", String(weight));
    root.style.setProperty("--heading-weight", String(heading));
    root.style.setProperty("--read-tracking", `${track}em`);
    root.setAttribute("data-smoothing", smooth);
  }, [weight, heading, track, smooth]);

  if (process.env.NODE_ENV === "production") return null;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 left-3 z-50 rounded-full border border-white/15 bg-black/80 px-3 py-1.5 text-[11px] font-semibold text-white/70 backdrop-blur-md"
      >
        Aa
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 left-3 z-50 flex flex-col gap-2 rounded-2xl border border-white/12 bg-black/85 p-2.5 backdrop-blur-md">
      <Dial
        label="Read"
        value={weight}
        options={[400, 450, 500, 550, 600] as const}
        onPick={setWeight}
      />
      <Dial
        label="Opening"
        value={heading}
        options={[400, 450, 500, 600] as const}
        onPick={setHeading}
      />
      <Dial
        label="Track"
        value={track}
        options={[0, 0.005, 0.01, 0.015, 0.02] as const}
        onPick={setTrack}
        fmt={(v) => (v === 0 ? "0" : `.${String(v).split(".")[1]}`)}
      />
      <Dial
        label="Smooth"
        value={smooth}
        options={["antialiased", "auto"] as const}
        onPick={setSmooth}
        fmt={(v) => (v === "antialiased" ? "thin" : "full")}
      />

      <div className="mt-0.5 flex items-center justify-between gap-3 border-t border-white/10 pt-1.5">
        <code className="text-[9.5px] leading-tight text-white/45">
          {weight}/{heading} · {track}em · {smooth === "auto" ? "full" : "thin"}
        </code>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[10px] font-semibold text-white/45 hover:text-white/80"
        >
          hide
        </button>
      </div>
    </div>
  );
}

export default ReadTuner;
