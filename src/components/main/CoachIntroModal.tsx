// src/components/main/CoachIntroModal.tsx
"use client";

import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";

export type CoachIntroModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  enableTyping?: boolean;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

export function CoachIntroModal({
  open,
  onClose,
  title,
  subtitle,
  enableTyping = false,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: CoachIntroModalProps) {
  const [typedSubtitle, setTypedSubtitle] = useState<string>(subtitle ?? "");

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Typewriter effect for subtitle
  useEffect(() => {
    if (!open) {
      setTypedSubtitle(subtitle ?? "");
      return;
    }

    if (!enableTyping || !subtitle) {
      setTypedSubtitle(subtitle ?? "");
      return;
    }

    setTypedSubtitle("");
    let index = 0;

    const intervalId = window.setInterval(() => {
      index += 1;
      setTypedSubtitle(subtitle.slice(0, index));

      if (index >= subtitle.length) {
        window.clearInterval(intervalId);
      }
    }, 24); // ~40 chars/sec

    return () => {
      window.clearInterval(intervalId);
    };
  }, [open, enableTyping, subtitle]);

  if (!open) return null;

  const handlePrimary = () => {
    if (onPrimary) onPrimary();
    else onClose();
  };

  const handleSecondary = () => {
    if (onSecondary) onSecondary();
    else onClose();
  };

  const showActions = !!primaryLabel || !!secondaryLabel;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/30 backdrop-blur-[2px]">
      {/* Click outside to close */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-slate-700/60 bg-slate-950/92 px-6 py-6 shadow-[0_26px_80px_rgba(0,0,0,0.85)] sm:px-7 sm:py-7">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/90 text-slate-400 hover:text-slate-100"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Orb only */}
        <div className="mb-3 flex items-center">
          <div className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-fuchsia-400 to-amber-300 shadow-lg shadow-sky-400/40">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-slate-50">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Optional title */}
        {title && (
          <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">
            {title}
          </h2>
        )}

        {/* Main copy (typed) */}
        {subtitle && (
          <p className="mt-3 min-h-[3rem] text-sm text-slate-200/90">
            {typedSubtitle}
          </p>
        )}

        {/* Optional actions – only if labels are provided (not used on Spotlight) */}
        {showActions && (
          <div className="mt-6 flex flex-wrap gap-3">
            {primaryLabel && (
              <button
                type="button"
                onClick={handlePrimary}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-400/40 transition hover:bg-sky-300 sm:flex-none sm:px-6"
              >
                {primaryLabel}
              </button>
            )}

            {secondaryLabel && (
              <button
                type="button"
                onClick={handleSecondary}
                className="text-sm text-slate-300 underline-offset-4 hover:underline"
              >
                {secondaryLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
