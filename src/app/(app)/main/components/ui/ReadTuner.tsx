"use client";

// The reading tuner. OPT-IN, not dev-only: `?tune=1` arms it (sticky), `?tune=0`
// disarms it. It has to survive a production build, because the whole point is to
// judge this on a real phone against the real app — but nobody else should ever
// see it, hence the flag rather than shipping it to all nine internal users.
//
// It exists because the read "reads hard on mobile" and there are FIVE candidate
// causes, which cannot be untangled by argument on a laptop:
//
//   0. SIZE — and this one was missing from the first version of the tuner, which
//      was a real hole: the complaint was "too small AND not strong", and the tool
//      could only move "strong". The type ladder is eight fixed pixel values with
//      no media query and no clamp, so a phone at arm's length gets the identical
//      scale to a 27" laptop. The Size dial multiplies the whole ladder.
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
    <div>
      <div className="mb-1 text-micro font-bold uppercase tracking-eyebrow text-amber-300/70">
        {label}
      </div>
      <div className="flex gap-1">
        {options.map((o) => (
          <button
            key={String(o)}
            type="button"
            onClick={() => onPick(o)}
            aria-pressed={value === o}
            // min-h-9 so it is a real thumb target on a phone — the point of this
            // tool is to be driven on the device, not clicked with a mouse.
            className={[
              "min-h-9 flex-1 rounded-control px-1.5 text-micro font-bold tabular-nums transition active:scale-95",
              value === o
                ? "bg-amber-400 text-black"
                : "bg-white/[0.07] text-white/60 hover:bg-white/[0.14] hover:text-white",
            ].join(" ")}
          >
            {fmt ? fmt(o) : String(o)}
          </button>
        ))}
      </div>
    </div>
  );
}

const TUNE_KEY = "el:tune";

export function ReadTuner() {
  const [size, setSize] = React.useState(1);
  const [weight, setWeight] = React.useState(400);
  const [heading, setHeading] = React.useState(600);
  const [track, setTrack] = React.useState(0);
  const [smooth, setSmooth] = React.useState<"antialiased" | "auto">("antialiased");
  const [open, setOpen] = React.useState(false);

  // OPT-IN, not dev-only. The whole point is to judge this on a real phone against
  // the real app, which means it has to survive a production build — but it must
  // not appear for the other internal users. So: `?tune=1` turns it on (sticky),
  // `?tune=0` turns it off. Everyone else never sees it.
  const [armed, setArmed] = React.useState(false);
  React.useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("tune");
      if (q === "1") window.localStorage.setItem(TUNE_KEY, "1");
      if (q === "0") window.localStorage.removeItem(TUNE_KEY);
      setArmed(window.localStorage.getItem(TUNE_KEY) === "1");
    } catch {
      /* no storage — stay off */
    }
  }, []);

  React.useEffect(() => {
    if (!armed) return;
    const root = document.documentElement;
    root.style.setProperty("--type-scale", String(size));
    root.style.setProperty("--read-weight", String(weight));
    root.style.setProperty("--heading-weight", String(heading));
    root.style.setProperty("--read-tracking", `${track}em`);
    root.setAttribute("data-smoothing", smooth);
  }, [armed, size, weight, heading, track, smooth]);

  if (!armed) return null;

  // Top-right, bright, and large enough to hit with a thumb. The first version was
  // a small dark pill on a dark page, tucked behind the bottom nav — effectively
  // invisible, which is a poor showing for a tool whose whole job is to be looked
  // at.
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open reading tuner"
        className="fixed right-3 top-3 z-[100] flex h-11 w-11 items-center justify-center rounded-full bg-amber-400 text-body font-bold text-black shadow-[0_6px_24px_rgba(251,191,36,0.5)] ring-2 ring-amber-200/60 transition active:scale-95"
      >
        Aa
      </button>
    );
  }

  return (
    <div className="fixed right-3 top-3 z-[100] flex w-[min(19rem,calc(100vw-1.5rem))] flex-col gap-2.5 rounded-2xl border border-amber-300/30 bg-black/92 p-3 shadow-[0_16px_48px_rgba(0,0,0,0.7)] backdrop-blur-md">
      {/* SIZE IS FIRST because it is the loudest half of the complaint, and until
          now the tuner could not move it at all — the ladder was eight fixed px
          values with no responsive step, so the phone got the desktop scale. This
          dial multiplies every step at once, which keeps the scale's internal
          relationships intact (a lede stays a notch under the read) and reduces
          "how much bigger?" to one number. The label shows the resulting size of
          THE read (21px × scale), because that is the number worth feeling. */}
      <Dial
        label="Size"
        value={size}
        options={[1, 1.06, 1.12, 1.18, 1.25] as const}
        onPick={setSize}
        fmt={(v) => `${Math.round(21 * v)}px`}
      />
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

      {/* The read-out is the deliverable: these four numbers are what get written
          into globals.css once they are settled on a real phone. */}
      <div className="flex items-center justify-between gap-3 border-t border-white/12 pt-2">
        <code className="text-micro font-bold leading-tight text-amber-300">
          ×{size} · {weight}/{heading} · {track}em · {smooth === "auto" ? "full" : "thin"}
        </code>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="min-h-8 rounded-control bg-white/10 px-3 text-micro font-bold text-white/70 active:scale-95"
        >
          Hide
        </button>
      </div>
    </div>
  );
}

export default ReadTuner;
