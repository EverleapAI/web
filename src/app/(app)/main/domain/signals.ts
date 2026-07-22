// src/app/main/domain/signals.ts

/* =============================================================================
   Signals domain logic (pure functions)
   - No React
   - No storage
   - No UI
   ============================================================================= */

import type { StoryAnswers, SignalsProgress, SignalKey } from "./types";

/* ---------------------------------------------------------------------------
   Helpers
--------------------------------------------------------------------------- */

type AnswerLike = { answer?: string; skipped?: boolean };

function isAnswered(v: AnswerLike | undefined) {
  const ans = (v?.answer ?? "").trim();
  const skipped = Boolean(v?.skipped);
  return skipped || ans.length > 0;
}

function countAnsweredForPrefix(
  answers: StoryAnswers | null,
  prefix: SignalKey,
  totalPer: number
) {
  if (!answers) return 0;
  let n = 0;
  for (let i = 1; i <= totalPer; i += 1) {
    const id = `${prefix}_${i}`;
    if (isAnswered(answers[id] as AnswerLike | undefined)) n += 1;
  }
  return n;
}

/* ---------------------------------------------------------------------------
   Public API
--------------------------------------------------------------------------- */

export const SIGNALS_TOTAL_PER = 5;

export function deriveSignalsProgress(answers: StoryAnswers | null): SignalsProgress {
  const totalPer = SIGNALS_TOTAL_PER;

  const motivationsAnswered = countAnsweredForPrefix(answers, "motivations", totalPer);
  const strengthsAnswered = countAnsweredForPrefix(answers, "strengths", totalPer);
  const skillsAnswered = countAnsweredForPrefix(answers, "skills", totalPer);

  return {
    motivationsDone: motivationsAnswered >= totalPer,
    strengthsDone: strengthsAnswered >= totalPer,
    skillsDone: skillsAnswered >= totalPer,
    motivationsAnswered,
    strengthsAnswered,
    skillsAnswered,
    totalPer,
  };
}

export function totalSignalsAnswered(progress: SignalsProgress) {
  return progress.motivationsAnswered + progress.strengthsAnswered + progress.skillsAnswered;
}

export function nextSignal(progress: SignalsProgress): SignalKey {
  if (!progress.motivationsDone) return "motivations";
  if (!progress.strengthsDone) return "strengths";
  if (!progress.skillsDone) return "skills";
  return "motivations";
}

export function signalLabel(k: SignalKey) {
  if (k === "motivations") return "Motivations";
  if (k === "strengths") return "Strengths";
  return "Skills";
}

/**
 * Signals are ALWAYS reviewable.
 * Completed ≠ locked.
 */
export function hrefForSignal(k: SignalKey, returnTo: string = "/main") {
  return `/main/story?family=${k}&returnTo=${encodeURIComponent(returnTo)}`;
}

export function continueButtonText(k: SignalKey) {
  return `Continue with ${signalLabel(k)}`;
}

export function continueSubcopy(k: SignalKey, progress: SignalsProgress) {
  if (k === "motivations") return "2 minutes. Sets your baseline.";

  if (k === "strengths") {
    const n = progress.strengthsAnswered;
    return n > 0
      ? "2 minutes. Sharpens how you operate."
      : "2 minutes. Finds how you do your best work.";
  }

  return "2 minutes. Turns insight into momentum.";
}