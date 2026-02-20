// src/app/main/components/TodayIntro.tsx
"use client";

import * as React from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* =============================================================================
   Types
   ============================================================================= */

export type RecommendedNext = "motivations" | "strengths" | "skills";

type Quote = { text: string; author: string };

/* =============================================================================
   Small UI helpers
   ============================================================================= */

function SectionDivider({ dark }: { dark: boolean }) {
  const line = dark ? "bg-white/10" : "bg-black/10";
  const dot = dark ? "bg-white/25" : "bg-black/20";
  return (
    <div className="py-4" aria-hidden>
      <div className="flex items-center gap-3">
        <div className={`h-px flex-1 ${line}`} />
        <div className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        <div className={`h-px flex-1 ${line}`} />
      </div>
    </div>
  );
}

const fadeIn = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 2 },
};

/* =============================================================================
   Props
   ============================================================================= */

export type TodayIntroProps = {
  dark: boolean;

  /** Reduced-motion aware */
  motionEnabled: boolean;

  /** Quote rendered above copy (pass only after mount) */
  quote?: Quote;

  /** Page-level fade control (used on clicks) */
  isTransitioning?: boolean;

  /** Counselor copy (agentic, on-page) */
  paragraphs: string[];

  /** Primary action (single CTA only) */
  primaryCtaLabel?: string;

  /** Callback for primary CTA */
  onPrimary?: () => void;
};

/* =============================================================================
   Component
   ============================================================================= */

export function TodayIntro(props: TodayIntroProps) {
  const {
    dark,
    motionEnabled,
    quote,
    isTransitioning = false,
    paragraphs,
    primaryCtaLabel,
    onPrimary,
  } = props;

  const textMuted = dark ? "text-slate-300/85" : "text-slate-700";
  const textFaint = dark ? "text-slate-400" : "text-slate-500";

  // Conversation typography
  const convoBodyClass = `text-lg leading-relaxed md:text-xl ${textMuted}`;

  // CTA: subtle “coach action”, not a headline link
  const ctaClass = [
    "group inline-flex items-center gap-2",
    "text-base md:text-lg",
    "font-semibold",
    "transition",
    dark ? "text-white/85 hover:text-white" : "text-slate-900/85 hover:text-slate-900",
    // no underline; rely on motion + icon + tone
    "focus-visible:outline-none",
    dark ? "focus-visible:ring-2 focus-visible:ring-white/20" : "focus-visible:ring-2 focus-visible:ring-slate-900/15",
  ].join(" ");

  // Collapse/expand (news-feed style, but without explicit “read more” text)
  const [expanded, setExpanded] = React.useState(false);

  // Fixed height in collapsed mode (mobile-first)
  const collapsedMaxH = "max-h-[10.5rem] md:max-h-[12.5rem]";

  // Only collapse if there’s enough content to justify it
  const canCollapse = (paragraphs?.length ?? 0) >= 4;

  // Cinematic fade without adding a dark overlay “box”:
  // Use a mask-image fade so the page background shows through naturally.
  const cinematicMask = [
    "[mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_72%,rgba(0,0,0,0)_100%)]",
    "[-webkit-mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_72%,rgba(0,0,0,0)_100%)]",
  ].join(" ");

  const narrativeFocus = dark
    ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/15"
    : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/12";

  const clickHint = expanded ? "Click to collapse" : "Click to expand";

  return (
    <div className="relative">
      {/* TODAY marker */}
      <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] opacity-85">
        <span
          className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[0.7rem] ${
            dark ? "bg-amber-200/90 text-slate-950" : "bg-amber-400 text-slate-900"
          }`}
        >
          <Sparkles className="h-3 w-3" />
        </span>
        <span>Today</span>
      </div>

      {/* Quote */}
      {quote?.text ? (
        <div className={`mb-6 text-sm ${textFaint}`}>
          <span className="opacity-80">“</span>
          <span className="italic">{quote.text}</span>
          <span className="opacity-80">”</span>
          <span className="ml-2 opacity-70">— {quote.author}</span>
        </div>
      ) : null}

      {/* Counselor copy + single CTA */}
      <div className={motionEnabled ? (isTransitioning ? "opacity-70" : "opacity-100") : ""}>
        {/* Narrative (click anywhere to expand/collapse; cinematic, no background) */}
        <div className="relative">
          {canCollapse ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className={[
                "group relative block w-full text-left",
                // no rounded “card” look; keep only focus ring
                "px-0 py-0",
                "transition",
                narrativeFocus,
              ].join(" ")}
              aria-expanded={expanded}
              aria-label={`${clickHint}. Coach narrative`}
              title={clickHint}
            >
              <div
                className={[
                  "relative",
                  !expanded ? `overflow-hidden ${collapsedMaxH} ${cinematicMask}` : "",
                ].join(" ")}
              >
                <div className="space-y-4">
                  {paragraphs.map((p, idx) => (
                    <p key={`today_${idx}`} className={convoBodyClass}>
                      {p}
                    </p>
                  ))}
                </div>

                {/* Tiny non-text cue: a faint pill at the bottom edge (no words) */}
                {!expanded ? (
                  <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
                    <div className={`h-1 w-10 rounded-full ${dark ? "bg-white/10" : "bg-black/10"}`} />
                  </div>
                ) : null}
              </div>
            </button>
          ) : (
            <div className="space-y-4">
              {paragraphs.map((p, idx) => (
                <p key={`today_${idx}`} className={convoBodyClass}>
                  {p}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Primary CTA (subtle, coach-like) */}
        {primaryCtaLabel ? (
          <div className="mt-6">
            <div className="h-8 md:h-9">
              <AnimatePresence mode="wait" initial={false}>
                {motionEnabled ? (
                  <motion.button
                    key="today_primary"
                    type="button"
                    onClick={onPrimary}
                    initial={fadeIn.initial}
                    animate={fadeIn.animate}
                    exit={fadeIn.exit}
                    transition={{ duration: 0.32, ease: "easeOut" }}
                    className={ctaClass}
                  >
                    <span>{primaryCtaLabel}</span>
                    <ChevronRight
                      className={[
                        "h-4 w-4 transition",
                        "opacity-70 group-hover:opacity-95",
                        "translate-x-0 group-hover:translate-x-[2px]",
                      ].join(" ")}
                      aria-hidden
                    />
                  </motion.button>
                ) : (
                  <button
                    key="today_primary_static"
                    type="button"
                    onClick={onPrimary}
                    className={ctaClass}
                  >
                    <span>{primaryCtaLabel}</span>
                    <ChevronRight
                      className={[
                        "h-4 w-4 transition",
                        "opacity-70 group-hover:opacity-95",
                        "translate-x-0 group-hover:translate-x-[2px]",
                      ].join(" ")}
                      aria-hidden
                    />
                  </button>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : null}

        <SectionDivider dark={dark} />
      </div>
    </div>
  );
}
