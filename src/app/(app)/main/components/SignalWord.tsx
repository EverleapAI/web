"use client";

import * as React from "react";

type Props = {
  children?: React.ReactNode;
  className?: string;
  subtle?: boolean;
};

export function SignalWord({
  children = "signal",
  className = "",
  subtle = false,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (rootRef.current && target && !rootRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <span
      ref={rootRef}
      data-signal-word-root
      className={["relative inline-flex items-center align-baseline", className].join(" ")}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "relative inline-flex items-center align-baseline font-semibold tracking-tight",
          "focus-visible:outline-none",
          subtle
            ? "text-white/88 focus-visible:ring-2 focus-visible:ring-white/15"
            : "text-white focus-visible:ring-2 focus-visible:ring-white/20",
        ].join(" ")}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Show Signals definition"
      >
        <span className="relative inline-block">
          {children}
          <span
            aria-hidden
            className={[
              "pointer-events-none absolute left-0 right-0 bottom-[-0.16em] h-[2px] rounded-full",
              subtle
                ? "bg-[linear-gradient(90deg,rgba(125,211,252,0.32)_0%,rgba(167,139,250,0.42)_50%,rgba(196,181,253,0.32)_100%)]"
                : "bg-[linear-gradient(90deg,rgba(125,211,252,0.62)_0%,rgba(167,139,250,0.78)_50%,rgba(196,181,253,0.62)_100%)]",
            ].join(" ")}
          />
        </span>
      </button>

      {open ? (
        <span
          className="
            absolute left-1/2 top-[calc(100%+0.55rem)] z-50 w-[240px] -translate-x-1/2
            rounded-2xl border border-white/10 bg-[#0b1020]/94 px-3 py-2.5
            text-left text-[11px] leading-5 text-white/78 shadow-[0_18px_50px_rgba(0,0,0,0.38)]
            backdrop-blur-md
          "
          role="dialog"
          aria-label="Signals definition"
        >
          Signals are the patterns Everleap builds from what you answer, explore,
          choose, and do. They sharpen over time.
        </span>
      ) : null}
    </span>
  );
}