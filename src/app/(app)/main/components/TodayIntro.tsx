"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import { SignalWord } from "./SignalWord";

/* =============================================================================
   Types
   ============================================================================= */

export type RecommendedNext = "motivations" | "strengths" | "skills";

/* =============================================================================
   Motion
   ============================================================================= */

const fadeIn = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
};

/* =============================================================================
   Props
   ============================================================================= */

export type TodayIntroProps = {
  title?: string;
  dark: boolean;
  motionEnabled: boolean;
  isTransitioning?: boolean;
  body?: string;
  primaryCtaLabel?: string;
  onPrimary?: () => void;
};

/* =============================================================================
   Header treatment
   ============================================================================= */

function eyebrowWrapClass() {
  return "inline-flex items-center gap-2";
}

function eyebrowLeadDotClass(dark: boolean, strong = false) {
  return [
    "rounded-full",
    strong ? "h-1.5 w-1.5" : "h-[5px] w-[5px]",
    dark
      ? strong
        ? "bg-sky-200/54"
        : "bg-white/24"
      : strong
        ? "bg-sky-600/72"
        : "bg-slate-400",
  ].join(" ");
}

function eyebrowLineClass(dark: boolean) {
  return [
    "h-px w-5 rounded-full",
    dark
      ? "bg-gradient-to-r from-white/16 to-white/0"
      : "bg-gradient-to-r from-slate-400/40 to-slate-400/0",
  ].join(" ");
}

function eyebrowClass(dark: boolean) {
  return [
    "text-[11px] font-semibold uppercase tracking-[0.32em]",
    dark ? "text-white/36" : "text-slate-500",
  ].join(" ");
}

function heroTitleClass(dark: boolean) {
  return [
    "mt-2 text-[1.56rem] font-semibold leading-[1.08] tracking-[-0.024em]",
    "sm:text-[1.8rem]",
    dark ? "text-white/72" : "text-slate-950",
  ].join(" ");
}

function heroBodyClass(dark: boolean) {
  return [
    "mt-2.5 max-w-[46rem] text-[15px] leading-[1.72]",
    "sm:text-[15.5px]",
    "whitespace-normal break-words",
    dark ? "text-white/42" : "text-slate-800",
  ].join(" ");
}

function ctaClass(dark: boolean) {
  return [
    "group inline-flex items-center gap-2",
    "text-[14.5px] font-medium transition",
    "focus-visible:outline-none",
    dark
      ? "text-sky-300/60 hover:text-sky-200/68"
      : "text-sky-700 hover:text-sky-900",
  ].join(" ");
}

function defaultBody() {
  return "You’ve already helped Everleap understand your motivations, strengths, and skills, so Insights is where those signals can start turning into a clearer picture of who you are and what may fit.";
}

function renderBodyWithSignalWord(body: string) {
  const match = /\bsignals\b/i.exec(body);
  if (!match || match.index === undefined) return body;

  const start = match.index;
  const end = start + match[0].length;

  return (
    <>
      {body.slice(0, start)}
      <span className="text-white/50">
        <SignalWord>{body.slice(start, end).toLowerCase()}</SignalWord>
      </span>
      {body.slice(end)}
    </>
  );
}

/* =============================================================================
   Component
   ============================================================================= */

export function TodayIntro(props: TodayIntroProps) {
  const {
    title: introTitle,
    dark,
    motionEnabled,
    body,
    primaryCtaLabel,
    onPrimary,
  } = props;

  const resolvedBody = body?.trim() || defaultBody();
  const shouldShowCta = Boolean(primaryCtaLabel && onPrimary);

  return (
    <div className="relative">
      <div className={eyebrowWrapClass()}>
        <span className={eyebrowLeadDotClass(dark, true)} />
        <span className={eyebrowLeadDotClass(dark)} />
        <span className={eyebrowLineClass(dark)} />
        <div className={eyebrowClass(dark)}>Today</div>
      </div>

      <h1 className={heroTitleClass(dark)}>
        {introTitle ?? "Your direction is starting to take shape"}
      </h1>

      <p className={heroBodyClass(dark)}>
        {renderBodyWithSignalWord(resolvedBody)}
      </p>

      {shouldShowCta ? (
        <div className="mt-4.5">
          {motionEnabled ? (
            <motion.button
              type="button"
              onClick={onPrimary}
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ duration: 0.32, ease: "easeOut" }}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.995 }}
              className={ctaClass(dark)}
            >
              <span>{primaryCtaLabel}</span>
              <ChevronRight className="h-4 w-4 opacity-55 transition group-hover:translate-x-[3px]" />
            </motion.button>
          ) : (
            <button
              type="button"
              onClick={onPrimary}
              className={ctaClass(dark)}
            >
              <span>{primaryCtaLabel}</span>
              <ChevronRight className="h-4 w-4 opacity-55 transition group-hover:translate-x-[3px]" />
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}