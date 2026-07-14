"use client";

import * as React from "react";

type Props = {
  children?: React.ReactNode;
  className?: string;
  subtle?: boolean;
};

export function SignalWord({
  children = "signals",
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

  const textClass = subtle
    ? "text-white/74 focus-visible:ring-2 focus-visible:ring-white/12"
    : "text-white/70 focus-visible:ring-2 focus-visible:ring-white/16";

  const dashClass = subtle
    ? "bg-[linear-gradient(90deg,rgba(94,234,212,0.28)_0%,rgba(125,211,252,0.24)_38%,rgba(167,139,250,0.30)_72%,rgba(244,114,182,0.22)_100%)] opacity-72"
    : "bg-[linear-gradient(90deg,rgba(94,234,212,0.44)_0%,rgba(125,211,252,0.38)_38%,rgba(167,139,250,0.46)_72%,rgba(244,114,182,0.34)_100%)] opacity-82";

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
          textClass,
        ].join(" ")}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Show Signals definition"
      >
        <span className="relative inline-block">
          {children}

          <span
            aria-hidden
            className="pointer-events-none absolute bottom-[-0.22em] left-0 right-0 h-[6px]"
          >
            <span className="absolute inset-0 flex items-center gap-[4px]">
              {Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={i}
                  className={[
                    "h-[2px] flex-1 rounded-full shadow-none",
                    dashClass,
                  ].join(" ")}
                />
              ))}
            </span>
          </span>
        </span>
      </button>

      {open ? (
        <span
          className="
            absolute left-1/2 top-[calc(100%+0.6rem)] z-50 w-[248px] -translate-x-1/2
            rounded-2xl border border-white/10 bg-[#0b1020]/94 px-3 py-2.5
            text-left text-micro leading-5 text-white/68 shadow-[0_18px_50px_rgba(0,0,0,0.38)]
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