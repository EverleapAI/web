// src/app/main/domain/retort.ts

/* =============================================================================
   Retort assembly (pure, no storage, no React)
   - Uses motivation synthesis to avoid generic copy
   - Enforces deterministic Strengths justification when appropriate
   ============================================================================= */

import type {
  AgentState,
  RetortViewModel,
  SignalKey,
  SignalsProgress,
  OnboardingSnapshot,
  StoryAnswers,
  WeeklyFocusState,
  Reflection,
} from "./types";
import { synthesizeMotivationReflection } from "./motivationSynthesis";

/* ---------------------------------------------------------------------------
   Helpers
--------------------------------------------------------------------------- */

function normalizeSpace(s: string) {
  return (s ?? "").trim().replace(/\s+/g, " ");
}

function safeOneSentence(s: string) {
  const cleaned = normalizeSpace(s);
  if (!cleaned) return "";
  const m = cleaned.match(/^(.+?[.!?])(\s|$)/);
  return m?.[1] ? m[1].trim() : cleaned;
}

/**
 * Pull a simple “stage” line (high school / young adult / college thinking)
 * using only fields that exist in the current snapshot shape.
 *
 * IMPORTANT: we avoid parroting exact answers; this is a coarse inference line.
 */
function stageLine(snapshot: OnboardingSnapshot | null, rawTextLower: string) {
  const situation = typeof snapshot?.situation === "string" ? snapshot.situation : null;

  // Primary: explicit situation from onboarding
  if (situation === "high_school") return "You’re in high school.";
  if (situation === "young_adult") return "You’re navigating the early adult years.";

  // Secondary: keyword fallback (never surfaced verbatim)
  const hasAny = (ws: string[]) => ws.some((w) => rawTextLower.includes(w));

  if (
    hasAny([
      "high school",
      "hs",
      "freshman",
      "sophomore",
      "junior",
      "senior",
      "grade 9",
      "grade 10",
      "grade 11",
      "grade 12",
    ])
  ) {
    return "You’re in high school.";
  }

  if (hasAny(["community college", "two-year", "college", "university", "campus", "major"])) {
    return "You’re thinking about college options.";
  }

  return "";
}

function buildRawText(snapshot: OnboardingSnapshot | null, answers: StoryAnswers | null) {
  // NOTE: we only use this for coarse keyword checks (stageLine). We never surface it.
  const snap = snapshot ? JSON.stringify(snapshot) : "";
  const ans = answers ? JSON.stringify(answers) : "";
  return `${snap}\n${ans}`.toLowerCase();
}

/**
 * Only mention location when it adds meaning (too many options -> noise).
 * If homeState is just "California", we still make it matter by tying it to "doors/noise".
 */
function locationMeaningLine(homeState: string | null) {
  const place = normalizeSpace(homeState ?? "");
  if (!place) return "";
  return `If you’re in ${place}, you probably have a lot of doors nearby — which is a gift, but it can also make the noise louder.`;
}

/**
 * Coach line that sets the tone for “A+B”:
 * - acknowledges stage (when present)
 * - frames goal as direction, not “forever”
 */
function directionNotForeverLine(stage: string) {
  if (stage === "You’re in high school.") {
    return "You’re not trying to pick a “forever thing.” You’re trying to find a direction that feels real, not random.";
  }
  if (stage === "You’re navigating the early adult years.") {
    return "You’re not trying to reinvent your whole life overnight. You’re trying to find a direction that feels real, not random.";
  }
  if (stage === "You’re thinking about college options.") {
    return "You’re not trying to pick a “perfect” option. You’re trying to find a direction that feels real, not random.";
  }
  return "You’re not trying to force a label. You’re trying to find a direction that feels real, not random.";
}

/**
 * Light “example” framing that references the *kind* of signal, without quoting.
 * We only add this when we actually had an evidenceLine (i.e. motivations text existed).
 */
function evidenceToPracticalExample(evidenceLine: string | undefined) {
  if (!evidenceLine) return "";
  return "That reads less like “cool idea” and more like “could this become a real next step?”";
}

/* ---------------------------------------------------------------------------
   Agent state
--------------------------------------------------------------------------- */

export function deriveAgentState(args: {
  snapshot: OnboardingSnapshot | null;
  progress: SignalsProgress;
  hasAnySignal: boolean;
  hasAnyTiny: boolean;
}): AgentState {
  const { snapshot, progress, hasAnySignal, hasAnyTiny } = args;

  const onboardingDone = Boolean(snapshot?.name || snapshot?.zip || snapshot?.situation);

  if (!onboardingDone && !hasAnySignal) return "EMPTY";
  if (onboardingDone && !hasAnySignal) return "WELCOME";

  const allDone = progress.motivationsDone && progress.strengthsDone && progress.skillsDone;
  if (allDone) return hasAnyTiny ? "RETURNING" : "ACTIVE";

  return "FOUNDATION";
}

/* ---------------------------------------------------------------------------
   Canonical justification lines
--------------------------------------------------------------------------- */

function strengthsJustification() {
  return "Motivations tells me why you move. Strengths tells me how you move — day-to-day — so the options I suggest actually match how you operate.";
}

function motivationsStartLine() {
  return "If you want one smart place to begin, we’ll start with Motivations — it tells me what genuinely gives you energy (and what drains you), so the next steps feel like you.";
}

/* ---------------------------------------------------------------------------
   Public API: buildRetort (pure)
--------------------------------------------------------------------------- */

export function buildRetort(args: {
  agentState: AgentState;
  nextKey: SignalKey;
  progress: SignalsProgress;
  snapshot: OnboardingSnapshot | null;
  answers: StoryAnswers | null;
  homeState: string | null;
  weeklyFocus: WeeklyFocusState | null;
  sprintCount: number;
  sprintDoneThisSession: boolean;
}): RetortViewModel {
  const {
    agentState,
    nextKey,
    progress,
    snapshot,
    answers,
    homeState,
    weeklyFocus,
    sprintCount,
    sprintDoneThisSession,
  } = args;

  const rawLower = buildRawText(snapshot, answers);

  const totalAnswered =
    progress.motivationsAnswered + progress.strengthsAnswered + progress.skillsAnswered;

  const motivationsCaptured = progress.motivationsDone;
  const strengthsNext = nextKey === "strengths" && !progress.strengthsDone;

  /* -----------------------------------------------------------------------
     EMPTY
  ----------------------------------------------------------------------- */
  if (agentState === "EMPTY") {
    return {
      key: "empty",
      paragraphs: [
        "Welcome to Everleap.",
        "We’ll take this one step at a time. I’m not here to test you or push you into a path — I’m here to listen, notice patterns, and help you make sense of options without the noise.",
        "If you’re up for it, we’ll start with Motivations.",
      ],
    };
  }

  /* -----------------------------------------------------------------------
     WELCOME (A+B hybrid)
  ----------------------------------------------------------------------- */
  if (agentState === "WELCOME") {
    const reflection = synthesizeMotivationReflection({ snapshot, answers });
    const stage = stageLine(snapshot, rawLower);
    const locLine = locationMeaningLine(homeState);

    // A: stage + “direction not forever” + meaningful location (optional)
    const p1 = normalizeSpace(
      `${stage ? `${stage} ` : ""}${directionNotForeverLine(stage)}${locLine ? ` ${locLine}` : ""}`
    );

    // B: reflection pattern line (this is where answers show up, paraphrased)
    const p2 = reflection.patternLine;

    // Evidence + “practical example” + motivations start
    const ev = reflection.evidenceLine ? safeOneSentence(reflection.evidenceLine) : "";
    const ex = evidenceToPracticalExample(reflection.evidenceLine);
    const p3 = normalizeSpace(
      `${ev ? `${ev} ` : ""}${ex ? `${ex} ` : ""}${motivationsStartLine()}`
    );

    return {
      key: "welcome",
      paragraphs: [p1, p2, p3].filter(Boolean),
    };
  }

  /* -----------------------------------------------------------------------
     FOUNDATION → Strengths (A+B hybrid + deterministic justification)
  ----------------------------------------------------------------------- */
  if (strengthsNext && motivationsCaptured) {
    const reflection: Reflection = synthesizeMotivationReflection({ snapshot, answers });
    const stage = stageLine(snapshot, rawLower);
    const locLine = locationMeaningLine(homeState);

    const p1 = normalizeSpace(
      `${stage ? `${stage} ` : ""}${directionNotForeverLine(stage)}${locLine ? ` ${locLine}` : ""}`
    );

    const p2 = reflection.patternLine;

    const ev = reflection.evidenceLine ? safeOneSentence(reflection.evidenceLine) : "";
    const ex = evidenceToPracticalExample(reflection.evidenceLine);

    const p3 = normalizeSpace(
      `${ev ? `${ev} ` : ""}${ex ? `${ex} ` : ""}${strengthsJustification()}`
    );

    return {
      key: "foundation_strengths",
      paragraphs: [p1, p2, p3].filter(Boolean),
    };
  }

  /* -----------------------------------------------------------------------
     Default / Active / Returning (A+B hybrid)
  ----------------------------------------------------------------------- */
  const reflection = synthesizeMotivationReflection({ snapshot, answers });
  const stage = stageLine(snapshot, rawLower);
  const locLine = locationMeaningLine(homeState);

  // A: stage + direction framing + meaningful location (optional)
  const p1 = normalizeSpace(
    `${stage ? `${stage} ` : ""}${directionNotForeverLine(stage)}${locLine ? ` ${locLine}` : ""}`
  );

  // B: reflection pattern
  const p2 = reflection.patternLine;

  const ev = reflection.evidenceLine ? safeOneSentence(reflection.evidenceLine) : "";
  const ex = evidenceToPracticalExample(reflection.evidenceLine);

  let p3 =
    totalAnswered > 0
      ? "You’ve already given me enough to stop guessing — now we make it practical. One step at a time."
      : "We’ll keep this lightweight and useful. One step at a time.";

  if (sprintDoneThisSession && sprintCount > 0) {
    p3 = `${p3} (And nice — you already logged a sprint.)`;
  }

  const hasFocus = Boolean(weeklyFocus?.vibe && weeklyFocus?.target);
  if (hasFocus) {
    p3 = `${p3} I’m also tracking a Weekly Focus — we can build from that anytime.`;
  }

  const p3Full = normalizeSpace(`${ev ? `${ev} ` : ""}${ex ? `${ex} ` : ""}${p3}`);

  return {
    key: "default",
    paragraphs: [p1, p2, p3Full].filter(Boolean),
  };
}