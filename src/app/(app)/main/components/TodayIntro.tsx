"use client";

import * as React from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* =============================================================================
   Types
   ============================================================================= */

export type RecommendedNext = "motivations" | "strengths" | "skills";

type Quote = { text: string; author: string };

/* =============================================================================
   Motion
   ============================================================================= */

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
  paragraphs: React.ReactNode[];
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

  const eyebrowRow = "inline-flex items-center gap-2";

  const eyebrowIcon = dark
    ? "text-amber-200/80"
    : "text-amber-700";

  const eyebrow = [
    "text-[10px] font-semibold uppercase tracking-[0.24em]",
    dark ? "text-white/50" : "text-slate-500",
  ].join(" ");

  const title = [
    "mt-3 text-[1.6rem] font-semibold tracking-[-0.02em] leading-tight sm:text-[1.9rem]",
    dark ? "text-white" : "text-slate-950",
  ].join(" ");

  const body = [
    "mt-4 max-w-[52rem] text-[15px] leading-7 sm:text-[16px] sm:leading-8",
    dark ? "text-white/82" : "text-slate-800",
  ].join(" ");

  const cta = [
    "group inline-flex items-center gap-2",
    "text-base md:text-lg font-semibold transition",
    dark ? "text-sky-300 hover:text-sky-200" : "text-sky-700 hover:text-sky-900",
    "focus-visible:outline-none",
    dark
      ? "focus-visible:ring-2 focus-visible:ring-white/20"
      : "focus-visible:ring-2 focus-visible:ring-slate-900/15",
  ].join(" ");

  return (
    <div className="relative">
      <div className={eyebrowRow}>
        <Sparkles className={`h-3.5 w-3.5 ${eyebrowIcon}`} aria-hidden />
        <div className={eyebrow}>Today</div>
      </div>

      <h1 className={title}>Where things stand right now</h1>

      <div className={motionEnabled ? (isTransitioning ? "opacity-70" : "opacity-100") : ""}>
        {paragraphs?.length ? (
          <div className={body}>
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : null}

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
                    className={cta}
                  >
                    <span>{primaryCtaLabel}</span>
                    <ChevronRight
                      className="h-4 w-4 translate-x-0 opacity-70 transition group-hover:translate-x-[2px] group-hover:opacity-95"
                      aria-hidden
                    />
                  </motion.button>
                ) : (
                  <button
                    key="today_primary_static"
                    type="button"
                    onClick={onPrimary}
                    className={cta}
                  >
                    <span>{primaryCtaLabel}</span>
                    <ChevronRight
                      className="h-4 w-4 translate-x-0 opacity-70 transition group-hover:translate-x-[2px] group-hover:opacity-95"
                      aria-hidden
                    />
                  </button>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}