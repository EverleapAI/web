// src/components/onboarding/CoachShell.tsx
"use client";

import * as React from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";

type CoachShellTone = "calm" | "bright";

type CoachShellProps = {
  /** Small label above the message (e.g., "Everleap · Consent") */
  pill?: string;

  /** Optional tiny label row (e.g., "Before we start") */
  eyebrow?: string;

  /** Main coach message (keep it short; this is the “spoken” part) */
  title: string;

  /** Supporting sentence or two */
  subtitle?: string;

  /** Back button */
  onBack?: () => void;
  backLabel?: string;

  /** Progress (optional) */
  progressCurrent?: number; // 1-based
  progressTotal?: number;

  /** Main interactive content (toggle/choices/input/CTA) */
  children: React.ReactNode;

  /** Optional “details / legal” area (collapsed by default) */
  detailsLabel?: string;
  details?: React.ReactNode;

  /** Optional footer note under CTAs */
  footnote?: React.ReactNode;

  /** Layout controls */
  maxWidthClassName?: string; // e.g., "max-w-2xl"
  tone?: CoachShellTone;
};

function ProgressDashes({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const safeTotal = Math.max(1, Math.min(total, 16));
  const safeCurrent = Math.max(1, Math.min(current, safeTotal));

  return (
    <div className="flex items-center justify-center gap-2" aria-hidden="true">
      {Array.from({ length: safeTotal }).map((_, i) => {
        const active = i + 1 <= safeCurrent;
        return (
          <span
            key={i}
            className={`h-1.5 w-6 rounded-full transition ${
              active ? "bg-sky-300/90" : "bg-white/10"
            }`}
          />
        );
      })}
    </div>
  );
}

/**
 * CoachShell
 * - Keeps brand feel (glass + gradient edge) without shouting.
 * - “Message first, one interaction second, details last.”
 */
export function CoachShell({
  pill,
  eyebrow,
  title,
  subtitle,
  onBack,
  backLabel = "Back",
  progressCurrent,
  progressTotal,
  children,
  detailsLabel = "Details",
  details,
  footnote,
  maxWidthClassName = "max-w-3xl",
  tone = "calm",
}: CoachShellProps) {
  const isBright = tone === "bright";

  const shellBorder =
    "rounded-[32px] border border-white/10 bg-slate-950/40 shadow-[0_28px_90px_rgba(0,0,0,0.78)] backdrop-blur-xl";

  // quieter gradient rail (less “neon yelling”)
  const rail =
    "bg-gradient-to-r from-sky-400/45 via-fuchsia-500/35 to-amber-300/35";

  const titleClass = isBright
    ? "text-3xl md:text-4xl"
    : "text-2xl md:text-3xl";

  const subtitleClass = isBright
    ? "text-slate-200/85"
    : "text-slate-200/75";

  return (
    <div className="w-full">
      <div className={`mx-auto w-full ${maxWidthClassName}`}>
        <div className="relative">
          {/* subtle gradient edge (so it feels Everleap, but calmer) */}
          <div className={`rounded-[34px] p-[1px] ${rail}`}>
            <section className={`${shellBorder} overflow-hidden`}>
              {/* Top row */}
              <div className="flex items-center justify-between px-5 pt-5 md:px-7 md:pt-6">
                <div className="flex items-center gap-2">
                  {onBack ? (
                    <button
                      type="button"
                      onClick={onBack}
                      className="
                        inline-flex items-center gap-2 rounded-full
                        border border-white/10 bg-white/5 px-3 py-1.5
                        text-xs font-semibold text-white/75
                        transition hover:bg-white/10 active:scale-95
                      "
                      aria-label={backLabel}
                      title={backLabel}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {backLabel}
                    </button>
                  ) : (
                    <div className="h-8" />
                  )}
                </div>

                <div className="flex flex-col items-center gap-2">
                  {typeof progressCurrent === "number" &&
                  typeof progressTotal === "number" ? (
                    <ProgressDashes
                      current={progressCurrent}
                      total={progressTotal}
                    />
                  ) : null}

                  {eyebrow ? (
                    <div className="text-[0.72rem] font-semibold tracking-[0.18em] text-white/35">
                      {eyebrow.toUpperCase()}
                    </div>
                  ) : null}
                </div>

                <div className="w-[84px]" />
              </div>

              {/* Message area (the “coach speaking” part) */}
              <div className="px-6 pb-4 pt-6 md:px-10 md:pb-6 md:pt-8">
                {pill ? (
                  <div className="mb-4 flex justify-center">
                    <span
                      className="
                        inline-flex items-center rounded-full
                        border border-white/10 bg-white/5
                        px-3 py-1 text-[0.7rem] font-semibold
                        uppercase tracking-[0.22em] text-white/55
                      "
                    >
                      {pill}
                    </span>
                  </div>
                ) : null}

                <div className="mx-auto max-w-2xl text-center">
                  <h1
                    className={`${titleClass} font-semibold tracking-tight text-slate-50`}
                  >
                    {title}
                  </h1>

                  {subtitle ? (
                    <p className={`mt-3 text-sm md:text-[0.95rem] ${subtitleClass}`}>
                      {subtitle}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Interaction area (ONE main thing) */}
              <div className="px-4 pb-6 md:px-8 md:pb-8">
                <div
                  className="
                    mx-auto max-w-3xl
                    rounded-2xl border border-white/10 bg-slate-950/25
                    px-4 py-4 md:px-6 md:py-6
                  "
                >
                  {children}
                </div>

                {/* Details / legal (kept off the main channel) */}
                {details ? (
                  <div className="mx-auto mt-4 max-w-3xl">
                    <details
                      className="
                        group rounded-2xl border border-white/10 bg-white/5
                        px-4 py-3
                      "
                    >
                      <summary
                        className="
                          flex cursor-pointer list-none items-center justify-between
                          text-sm font-semibold text-white/70
                          transition hover:text-white/85
                        "
                      >
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-sky-300/70" />
                          {detailsLabel}
                        </span>
                        <ChevronDown className="h-4 w-4 text-white/55 transition group-open:rotate-180" />
                      </summary>

                      <div className="mt-3 space-y-3 text-sm text-white/65">
                        {details}
                      </div>
                    </details>
                  </div>
                ) : null}

                {footnote ? (
                  <div className="mx-auto mt-4 max-w-3xl text-center text-xs text-white/45">
                    {footnote}
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Optional helper: a calm “coach bubble” block you can use inside children/details.
 */
export function CoachBubble({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        rounded-2xl border border-white/10 bg-white/5
        px-4 py-3 md:px-5 md:py-4
      "
    >
      {title ? (
        <div className="mb-1 text-sm font-semibold text-white/80">{title}</div>
      ) : null}
      <div className="text-sm text-white/65">{children}</div>
    </div>
  );
}

/**
 * Optional helper: a calmer primary button style (less “shout”).
 */
export function CoachPrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex w-full items-center justify-center gap-2
        rounded-full px-6 py-3 text-sm font-semibold
        transition active:scale-[0.99]
        ${
          disabled
            ? "bg-white/8 text-white/35 cursor-not-allowed"
            : "bg-sky-400/85 text-slate-950 hover:bg-sky-300"
        }
      `}
    >
      {children}
    </button>
  );
}

/**
 * Optional helper: secondary button.
 */
export function CoachSecondaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex w-full items-center justify-center
        rounded-full px-6 py-3 text-sm font-semibold
        transition active:scale-[0.99]
        ${
          disabled
            ? "bg-white/5 text-white/30 cursor-not-allowed"
            : "bg-white/6 text-white/70 hover:bg-white/10"
        }
      `}
    >
      {children}
    </button>
  );
}
