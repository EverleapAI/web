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
  return "inline-flex items-center gap-2.5";
}

function eyebrowLeadDotClass(dark: boolean, strong = false) {
  return [
    "rounded-full",
    strong ? "h-1.5 w-1.5" : "h-[5px] w-[5px]",
    dark
      ? strong
        ? "bg-sky-200/72 shadow-[0_0_10px_rgba(125,211,252,0.18)]"
        : "bg-white/36"
      : strong
        ? "bg-sky-600/72"
        : "bg-slate-400",
  ].join(" ");
}

function eyebrowLineClass(dark: boolean) {
  return [
    "h-px w-6 rounded-full",
    dark
      ? "bg-gradient-to-r from-white/24 to-white/0"
      : "bg-gradient-to-r from-slate-400/40 to-slate-400/0",
  ].join(" ");
}

function eyebrowClass(dark: boolean) {
  return [
    "text-[12px] font-semibold uppercase tracking-[0.34em]",
    dark ? "text-white/54" : "text-slate-500",
  ].join(" ");
}

function heroTitleClass(dark: boolean) {
  return [
    "mt-3 text-[1.58rem] font-semibold leading-tight tracking-[-0.022em]",
    "sm:text-[1.82rem]",
    dark ? "text-white/88" : "text-slate-950",
  ].join(" ");
}

function heroBodyClass(dark: boolean) {
  return [
    "mt-3 max-w-[48rem] text-[15px] leading-7",
    "sm:text-[15.5px]",
    "whitespace-normal break-words",
    dark ? "text-white/60" : "text-slate-800",
  ].join(" ");
}

function ctaClass(dark: boolean) {
  return [
    "group inline-flex items-center gap-2",
    "text-[15px] font-medium transition",
    "focus-visible:outline-none",
    dark
      ? "text-sky-300/90 hover:text-sky-200"
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
      <SignalWord>{body.slice(start, end).toLowerCase()}</SignalWord>
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
        <div className="mt-5">
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
              <ChevronRight className="h-4 w-4 opacity-80 transition group-hover:translate-x-[3px]" />
            </motion.button>
          ) : (
            <button
              type="button"
              onClick={onPrimary}
              className={ctaClass(dark)}
            >
              <span>{primaryCtaLabel}</span>
              <ChevronRight className="h-4 w-4 opacity-80 transition group-hover:translate-x-[3px]" />
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}