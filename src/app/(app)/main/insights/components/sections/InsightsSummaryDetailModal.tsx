"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { bodyText, headerLabel } from "./summaryShared";

type Props = {
  open: boolean;
  onClose: () => void;
  dark: boolean;
  headline?: string;
  detail?: string;
};

function splitParagraphs(text?: string): string[] {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function InsightsSummaryDetailModal({
  open,
  onClose,
  dark,
  headline,
  detail,
}: Props) {
  const paragraphs = React.useMemo(() => splitParagraphs(detail), [detail]);

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

  const overlay = dark ? "bg-black/55" : "bg-black/35";
  const surface = dark
    ? "border-white/14 bg-slate-950"
    : "border-slate-900/10 bg-white";

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center px-4 pb-4 pt-4 sm:items-center sm:py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          <div
            className={`absolute inset-0 ${overlay}`}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ y: 22, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 14, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={[
              "relative w-full max-w-xl overflow-hidden rounded-card border",
              surface,
              "backdrop-blur-xl shadow-[0_18px_90px_rgba(0,0,0,0.4)]",
              "max-h-[80vh] flex flex-col",
            ].join(" ")}
          >
            <div className="relative flex items-center justify-between px-5 py-4">
              <div className={headerLabel(dark)}>How I got here</div>

              <button
                type="button"
                onClick={onClose}
                className={[
                  "inline-flex h-9 w-9 items-center justify-center rounded-full border transition",
                  dark
                    ? "border-white/14 bg-white/10 text-white/78 hover:bg-white/14 hover:text-white/95"
                    : "border-slate-900/10 bg-black/5 text-slate-700 hover:bg-black/10 hover:text-slate-950",
                ].join(" ")}
                aria-label="Close"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative overflow-y-auto px-5 pb-6">
              {headline ? (
                <h3
                  className={[
                    dark ? "text-white/92" : "text-slate-950",
                    "text-[1.15rem] font-semibold leading-title tracking-title",
                  ].join(" ")}
                >
                  {headline}
                </h3>
              ) : null}

              {paragraphs.map((p, index) => (
                <p
                  key={index}
                  className={[
                    index === 0 && headline ? "mt-3" : "mt-2.5",
                    bodyText(dark),
                    "text-label leading-read",
                  ].join(" ")}
                >
                  {p}
                </p>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
