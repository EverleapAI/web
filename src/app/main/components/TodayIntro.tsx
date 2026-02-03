// src/app/main/components/TodayIntro.tsx
"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
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

  // Conversation typography (2× feel vs old small dashboard text)
  const convoBodyClass = `text-lg leading-relaxed md:text-xl ${textMuted}`;
  const convoCtaPrimaryClass = `text-lg font-semibold md:text-xl ${
    dark ? "text-white hover:underline" : "text-slate-900 hover:underline"
  }`;

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
        <div className="space-y-4">
          {paragraphs.map((p, idx) => (
            <p key={`today_${idx}`} className={convoBodyClass}>
              {p}
            </p>
          ))}
        </div>

        {primaryCtaLabel ? (
          <div className="mt-7">
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
                    className={convoCtaPrimaryClass}
                  >
                    {primaryCtaLabel}
                  </motion.button>
                ) : (
                  <button
                    key="today_primary_static"
                    type="button"
                    onClick={onPrimary}
                    className={convoCtaPrimaryClass}
                  >
                    {primaryCtaLabel}
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
