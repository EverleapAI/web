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
  motionEnabled: boolean;
  quote?: Quote;
  isTransitioning?: boolean;
  paragraphs: string[];
  primaryCtaLabel?: string;
  onPrimary?: () => void;
};

/* =============================================================================
   Component
   ============================================================================= */

export function TodayIntro(props: TodayIntroProps) {
  const {
    dark,
    motionEnabled,
    isTransitioning = false,
    paragraphs,
    primaryCtaLabel,
    onPrimary,
  } = props;

  const textMuted = dark ? "text-slate-300/85" : "text-slate-700";

  const convoBodyClass = `text-lg leading-relaxed md:text-xl ${textMuted}`;

  const ctaClass = [
    "group inline-flex items-center gap-2",
    "text-base md:text-lg",
    "font-semibold",
    "transition",
    dark
      ? "text-white/85 hover:text-white"
      : "text-slate-900/85 hover:text-slate-900",
    "focus-visible:outline-none",
    dark
      ? "focus-visible:ring-2 focus-visible:ring-white/20"
      : "focus-visible:ring-2 focus-visible:ring-slate-900/15",
  ].join(" ");

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

      {/* Counselor copy + CTA */}
      <div
        className={motionEnabled ? (isTransitioning ? "opacity-70" : "opacity-100") : ""}
      >
        <div className="space-y-4">
          {paragraphs.map((p, idx) => (
            <p key={`today_${idx}`} className={convoBodyClass}>
              {p}
            </p>
          ))}
        </div>

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