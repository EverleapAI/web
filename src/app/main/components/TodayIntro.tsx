// src/app/main/components/TodayIntro.tsx
"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* =============================================================================
   Types
   ============================================================================= */

export type TodayPhase = "arrival" | "direction" | "unlocked";

export type ArrivalReference =
  | "onboarding_only"
  | "motivations_done"
  | "strengths_done"
  | "skills_done"
  | "tiny_task_done"
  | "returning_no_action";

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

const phaseFade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

/* =============================================================================
   Props
   ============================================================================= */

export type TodayIntroProps = {
  dark: boolean;
  phase: TodayPhase;

  /** Already resolved at page level */
  motionEnabled: boolean;

  /** Quote is rendered outside the centered canvas; pass only after mount */
  quote?: Quote;

  /** Page-level fade control (used on clicks) */
  isTransitioning?: boolean;

  /* ---------- Arrival (Phase A) ---------- */
  arrival: {
    reference: ArrivalReference;
    paragraphs: string[];
    showContinue: boolean;
  };

  /* ---------- Direction (Phase B) ---------- */
  direction: {
    recommendedNext: RecommendedNext;
    headline: string;
    body: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    showPrimaryCta: boolean;
    showSecondaryCta: boolean;
  };

  /* ---------- Unlocked (Phase C) ---------- */
  unlocked: {
    recap: string;
    why: string;

    primaryCtaLabel?: string;
    secondaryCtaLabel?: string;

    showPrimaryCta?: boolean;
    showSecondaryCta?: boolean;
  };

  /* ---------- Callbacks ---------- */
  onArrivalContinue: () => void;
  onDirectionAccept: () => void;
  onDirectionSkip: () => void;

  onUnlockedPrimary?: () => void;
  onUnlockedSecondary?: () => void;
};

/* =============================================================================
   Component
   ============================================================================= */

export function TodayIntro(props: TodayIntroProps) {
  const {
    dark,
    phase,
    motionEnabled,
    quote,
    isTransitioning = false,
    arrival,
    direction,
    unlocked,
    onArrivalContinue,
    onDirectionAccept,
    onDirectionSkip,
    onUnlockedPrimary,
    onUnlockedSecondary,
  } = props;

  const textMuted = dark ? "text-slate-300/85" : "text-slate-700";
  const textFaint = dark ? "text-slate-400" : "text-slate-500";

  const isCentered = phase === "arrival" || phase === "direction";
  const centeredPad = "py-6";

  // 2× larger typography for conversation phases
  const bodyClass = `text-lg leading-relaxed md:text-xl ${textMuted}`;
  const headlineClass = "text-xl font-semibold md:text-2xl";

  const ctaPrimaryClass = `text-lg font-semibold md:text-xl ${
    dark ? "text-white hover:underline" : "text-slate-900 hover:underline"
  }`;
  const ctaSecondaryClass = `text-sm md:text-base ${
    dark ? "text-white/55 hover:text-white/70" : "text-slate-500 hover:text-slate-600"
  }`;

  // Compact typography for unlocked header (dashboard feel)
  const unlockedRecapClass = `text-base md:text-lg font-semibold ${
    dark ? "text-white/90" : "text-slate-900"
  }`;
  const unlockedWhyClass = `text-sm md:text-base leading-relaxed ${textMuted}`;

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

      {/* Centered canvas for A/B only */}
      <div
        className={[
          isCentered ? "min-h-[55svh] md:min-h-[60svh] flex flex-col justify-center" : "",
          isCentered ? centeredPad : "",
        ].join(" ")}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`phase_${phase}`}
            initial={motionEnabled ? phaseFade.initial : { opacity: 1, y: 0 }}
            animate={motionEnabled ? phaseFade.animate : { opacity: 1, y: 0 }}
            exit={motionEnabled ? phaseFade.exit : { opacity: 0, y: 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className={motionEnabled ? (isTransitioning ? "opacity-70" : "opacity-100") : ""}
          >
            {/* =========================
                Phase A — Arrival
               ========================= */}
            {phase === "arrival" ? (
              <div>
                <div className="space-y-4">
                  {arrival.paragraphs.map((p, idx) => (
                    <p key={`arrival_${arrival.reference}_${idx}`} className={bodyClass}>
                      {p}
                    </p>
                  ))}
                </div>

                <div className="mt-7">
                  {/* Reserve space so centering doesn’t jump */}
                  <div className="h-7 md:h-8">
                    <AnimatePresence mode="wait" initial={false}>
                      {arrival.showContinue ? (
                        motionEnabled ? (
                          <motion.button
                            key="arrival_continue"
                            type="button"
                            onClick={onArrivalContinue}
                            initial={fadeIn.initial}
                            animate={fadeIn.animate}
                            exit={fadeIn.exit}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className={`text-lg font-semibold md:text-xl ${
                              dark
                                ? "text-white/85 hover:text-white"
                                : "text-slate-900 hover:text-slate-950"
                            }`}
                          >
                            Continue
                          </motion.button>
                        ) : (
                          <button
                            key="arrival_continue_static"
                            type="button"
                            onClick={onArrivalContinue}
                            className={`text-lg font-semibold md:text-xl ${
                              dark
                                ? "text-white/85 hover:text-white"
                                : "text-slate-900 hover:text-slate-950"
                            }`}
                          >
                            Continue
                          </button>
                        )
                      ) : (
                        <span key="arrival_spacer" aria-hidden />
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <SectionDivider dark={dark} />
              </div>
            ) : null}

            {/* =========================
                Phase B — Direction
               ========================= */}
            {phase === "direction" ? (
              <div>
                <div className="space-y-4">
                  <div className={headlineClass}>{direction.headline}</div>
                  <p className={bodyClass}>{direction.body}</p>

                  <div className="mt-6 space-y-3">
                    <div className="h-8 md:h-9">
                      <AnimatePresence mode="wait" initial={false}>
                        {direction.showPrimaryCta ? (
                          motionEnabled ? (
                            <motion.button
                              key="dir_primary"
                              type="button"
                              onClick={onDirectionAccept}
                              initial={fadeIn.initial}
                              animate={fadeIn.animate}
                              exit={fadeIn.exit}
                              transition={{ duration: 0.35, ease: "easeOut" }}
                              className={ctaPrimaryClass}
                            >
                              {direction.primaryCtaLabel}
                            </motion.button>
                          ) : (
                            <button
                              key="dir_primary_static"
                              type="button"
                              onClick={onDirectionAccept}
                              className={ctaPrimaryClass}
                            >
                              {direction.primaryCtaLabel}
                            </button>
                          )
                        ) : (
                          <span key="dir_primary_spacer" aria-hidden />
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="h-5 md:h-6">
                      <AnimatePresence mode="wait" initial={false}>
                        {direction.showSecondaryCta ? (
                          motionEnabled ? (
                            <motion.button
                              key="dir_secondary"
                              type="button"
                              onClick={onDirectionSkip}
                              initial={fadeIn.initial}
                              animate={fadeIn.animate}
                              exit={fadeIn.exit}
                              transition={{ duration: 0.35, ease: "easeOut", delay: 0.02 }}
                              className={ctaSecondaryClass}
                            >
                              {direction.secondaryCtaLabel}
                            </motion.button>
                          ) : (
                            <button
                              key="dir_secondary_static"
                              type="button"
                              onClick={onDirectionSkip}
                              className={ctaSecondaryClass}
                            >
                              {direction.secondaryCtaLabel}
                            </button>
                          )
                        ) : (
                          <span key="dir_secondary_spacer" aria-hidden />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <SectionDivider dark={dark} />
              </div>
            ) : null}

            {/* =========================
                Phase C — Unlocked
               ========================= */}
            {phase === "unlocked" ? (
              <div className="pb-2">
                <div className="space-y-2">
                  <div className={unlockedRecapClass}>{unlocked.recap}</div>
                  <div className={unlockedWhyClass}>{unlocked.why}</div>

                  {/* Optional unlocked CTAs */}
                  {(unlocked.primaryCtaLabel || unlocked.secondaryCtaLabel) ? (
                    <div className="mt-4 space-y-3">
                      <div className="h-8 md:h-9">
                        <AnimatePresence mode="wait" initial={false}>
                          {unlocked.primaryCtaLabel && unlocked.showPrimaryCta ? (
                            motionEnabled ? (
                              <motion.button
                                key="unlocked_primary"
                                type="button"
                                onClick={onUnlockedPrimary}
                                initial={fadeIn.initial}
                                animate={fadeIn.animate}
                                exit={fadeIn.exit}
                                transition={{ duration: 0.32, ease: "easeOut" }}
                                className={ctaPrimaryClass}
                              >
                                {unlocked.primaryCtaLabel}
                              </motion.button>
                            ) : (
                              <button
                                key="unlocked_primary_static"
                                type="button"
                                onClick={onUnlockedPrimary}
                                className={ctaPrimaryClass}
                              >
                                {unlocked.primaryCtaLabel}
                              </button>
                            )
                          ) : (
                            <span key="unlocked_primary_spacer" aria-hidden />
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="h-5 md:h-6">
                        <AnimatePresence mode="wait" initial={false}>
                          {unlocked.secondaryCtaLabel && unlocked.showSecondaryCta ? (
                            motionEnabled ? (
                              <motion.button
                                key="unlocked_secondary"
                                type="button"
                                onClick={onUnlockedSecondary}
                                initial={fadeIn.initial}
                                animate={fadeIn.animate}
                                exit={fadeIn.exit}
                                transition={{ duration: 0.32, ease: "easeOut" }}
                                className={ctaSecondaryClass}
                              >
                                {unlocked.secondaryCtaLabel}
                              </motion.button>
                            ) : (
                              <button
                                key="unlocked_secondary_static"
                                type="button"
                                onClick={onUnlockedSecondary}
                                className={ctaSecondaryClass}
                              >
                                {unlocked.secondaryCtaLabel}
                              </button>
                            )
                          ) : (
                            <span key="unlocked_secondary_spacer" aria-hidden />
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  ) : null}
                </div>

                <SectionDivider dark={dark} />
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
