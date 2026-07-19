// apps/web/src/app/(app)/main/explore/_components/DescentShell.tsx
//
// The one template every descent uses.
//
// The three descents were built one at a time and ended up three different
// screens: different max widths, different header spacing, and different scroll
// models — DayDescent nested a scrolling text area inside the page, so the
// content had its own scrollbar and the whole thing jumped between steps.
// Moving between stars felt like moving between apps.
//
// So the frame lives here and the descents only supply what's inside it:
//   - the same way out, in the same place, always ("Step back up")
//   - the same progress rail, so you can see where you are and how much is left
//   - ONE scroll container, so a long step scrolls the page like anything else
//   - the same measure, so the text doesn't change width between steps

"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { ArrowUp } from "lucide-react";

export function DescentShell({
  accent,
  step,
  total,
  onClose,
  children,
  media = null,
}: {
  /** "r, g, b" */
  accent: string;
  /** Zero-based index of the current step; -1 for a step outside the sequence. */
  step: number;
  total: number;
  onClose: () => void;
  children: React.ReactNode;
  /** Optional visual above the content — sized here, not by the caller. */
  media?: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    // Portalled to the body so it escapes MAIN's stacking context and covers the
    // app nav — a plain fixed overlay inside the page cannot.
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#05070f] text-white">
      {/* The way out is always the first thing, in the same place on every step
          of every descent. */}
      <div className="relative z-10 flex shrink-0 items-center gap-3 px-4 pt-4 sm:px-6">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-meta text-white/85 transition hover:bg-white/[0.12]"
        >
          <ArrowUp className="h-3.5 w-3.5" />
          Step back up
        </button>
        {total > 1 ? (
          <div className="flex flex-1 items-center gap-1.5" aria-hidden>
            {Array.from({ length: total }).map((_, k) => (
              <span
                key={k}
                className="h-1 flex-1 rounded-full transition-colors"
                style={{ background: k <= step ? `rgb(${accent})` : "rgba(255,255,255,0.14)" }}
              />
            ))}
          </div>
        ) : null}
      </div>

      {/* One scroll container for the whole descent. Media and text scroll
          together, so there's never a scrollbar inside a scrollbar — and both sit
          in the same column, so a step reads as one object rather than a
          full-bleed image with a narrow page underneath it. */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-lg px-6 pb-10 pt-4">
          {media}
          <div className={media ? "pt-5" : "pt-1"}>{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/**
 * The image or atmosphere above a step.
 *
 * Sized by aspect ratio with a hard ceiling rather than a share of the viewport.
 * It was 44vh, which on a tall window meant a gradient with a sun in it taking
 * most of the screen while the words it belonged to were pushed into a cramped
 * box below.
 */
export function DescentMedia({
  children,
  className = "",
  style,
}: {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative aspect-[16/10] max-h-[34vh] w-full shrink-0 overflow-hidden rounded-card ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
