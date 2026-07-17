"use client";

// The shared "More" / "Why" overlay for every agentic surface (Today, Insights,
// Explore). Matches Today's focused modal look — cosmic gradient surface, the
// same low-glare 21px prose — so the treatment reads identically everywhere.
//
// Two variants, chosen by whether an accent is passed:
//   • More  → neutral close button, eyebrow "The whole picture" (or custom)
//   • Why   → accent-tinted close button + eyebrow, pass accentRgb like "182,160,255"

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

import { EYEBROW_CLASS, PROSE_CLASS, PROSE_SIZE, PROSE_STYLE, TEXT_SECONDARY } from "@/lib/ui/prose";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Small uppercase label above the body, e.g. "The whole picture" / "Why this". */
  eyebrow: string;
  /** Body prose. Rendered as ONE paragraph — any line breaks are collapsed. */
  body: string;
  /** When set (e.g. "182,160,255"), renders the accent-tinted "Why" styling. */
  accentRgb?: string;
  /** Close-button label. Defaults to "Got it" for Why, "Close" for More. */
  closeLabel?: string;
};

// Every agentic response reads as a single flowing paragraph — no separate lines.
// Legacy content generated with paragraph breaks is collapsed here so it renders
// the new way immediately, before its cache is regenerated.
function toOneParagraph(text: string): string {
  return (text ?? "").replace(/\s*\n\s*/g, " ").replace(/\s+/g, " ").trim();
}

export default function AgenticDetailModal({ open, onClose, eyebrow, body, accentRgb, closeLabel }: Props) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const oneParagraph = React.useMemo(() => toOneParagraph(body), [body]);
  if (!mounted) return null;

  const isWhy = Boolean(accentRgb);
  const label = closeLabel ?? (isWhy ? "Got it" : "Close");

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={eyebrow}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 p-4 pt-[max(1.25rem,env(safe-area-inset-top))] backdrop-blur-sm sm:items-center sm:pt-4"
        >
          <motion.div
            initial={{ y: 22, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 14, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className={`max-h-[85vh] w-full max-w-[440px] overflow-y-auto rounded-3xl border bg-[linear-gradient(180deg,#0c1428,#070d1c)] p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] ${
              isWhy ? "border-white/10" : "border-white/[0.06]"
            }`}
          >
            <div
              className={`mb-3 ${EYEBROW_CLASS}`}
              style={{ color: isWhy ? `rgb(${accentRgb})` : TEXT_SECONDARY }}
            >
              {eyebrow}
            </div>

            <p className={`${PROSE_SIZE} ${PROSE_CLASS}`} style={PROSE_STYLE}>
              {oneParagraph}
            </p>

            <button
              type="button"
              onClick={onClose}
              className={
                isWhy
                  ? "mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-meta font-semibold transition hover:brightness-110"
                  : "mt-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-4 py-2 text-meta font-semibold text-ink-quiet transition hover:border-white/[0.16]"
              }
              style={
                isWhy
                  ? { color: `rgb(${accentRgb})`, background: `rgba(${accentRgb},0.12)`, border: `1px solid rgba(${accentRgb},0.42)` }
                  : undefined
              }
            >
              {label}
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
