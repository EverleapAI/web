// src/app/main/domain/motivationSynthesis.ts

/* =============================================================================
   Motivation synthesis (“stew” logic)
   - Reads across ALL motivation answers (and optionally onboarding snapshot text)
   - Produces one blended pattern line + (optional) one evidence clause
   - Never quotes verbatim; paraphrases lightly
   ============================================================================= */

import type { MotivationBlend, Reflection, StoryAnswers, OnboardingSnapshot } from "./types";

/* ---------------------------------------------------------------------------
   Text utilities
--------------------------------------------------------------------------- */

function normalizeSpace(s: string) {
  return (s ?? "").trim().replace(/\s+/g, " ");
}

function toLowerSafe(s: string) {
  return normalizeSpace(String(s ?? "")).toLowerCase();
}

function flattenSnapshotText(snapshot: OnboardingSnapshot | null) {
  if (!snapshot) return "";
  const s = snapshot as Record<string, unknown>;
  const parts: string[] = [];
  for (const key of Object.keys(s)) {
    const v = s[key];
    if (typeof v === "string" && v.trim()) parts.push(v.trim());
  }
  return parts.join(" \n");
}


/**
 * Pull just the motivations answers when available.
 * Falls back to full answers text if ids are unknown.
 */
function flattenMotivationsOnly(answers: StoryAnswers | null) {
  if (!answers) return "";
  const parts: string[] = [];
  const keys = Object.keys(answers);

  // Prefer explicit motivations_* ids (your Questions flow uses motivations_1..5)
  const motivationKeys = keys
    .filter((k) => k.startsWith("motivations_"))
    .sort((a, b) => a.localeCompare(b));

  const target = motivationKeys.length > 0 ? motivationKeys : keys;

  for (const k of target) {
    const v = answers[k];
    const a = (v?.answer ?? "").trim();
    if (a) parts.push(a);
  }

  return parts.join(" \n");
}

function sentenceish(s: string) {
  const cleaned = normalizeSpace(s);
  if (!cleaned) return "";
  // Ensure it ends cleanly
  return /[.!?]$/.test(cleaned) ? cleaned : `${cleaned}.`;
}

/* ---------------------------------------------------------------------------
   Scoring model (simple + robust)
--------------------------------------------------------------------------- */

type Scores = {
  curiosity: number;
  practicality: number;
  momentum: number;
  impact: number;
  autonomy: number;
  structure: number;
  uncertainty: number;
};

function emptyScores(): Scores {
  return {
    curiosity: 0,
    practicality: 0,
    momentum: 0,
    impact: 0,
    autonomy: 0,
    structure: 0,
    uncertainty: 0,
  };
}

function inc(scores: Scores, k: keyof Scores, by = 1) {
  scores[k] += by;
}

function hasAny(raw: string, ws: string[]) {
  return ws.some((w) => raw.includes(w));
}

/**
 * Extract “evidence candidates” as short paraphrasable themes.
 * We never quote the user; we pick a theme to reference as proof.
 */
type Evidence = { key: string; line: string; weight: number };

function buildEvidenceCandidates(raw: string): Evidence[] {
  const out: Evidence[] = [];

  // Momentum / urgency / “don’t waste time”
  if (
    hasAny(raw, [
      "waste time",
      "wasting time",
      "no time",
      "soon",
      "asap",
      "right now",
      "quick",
      "fast",
      "stuck",
      "direction",
      "clarity",
      "next step",
      "move forward",
    ])
  ) {
    out.push({
      key: "momentum",
      line: "the way you emphasized momentum (not wasting time) stood out",
      weight: 3,
    });
  }

  // Practicality / stability / money / security
  if (hasAny(raw, ["stable", "stability", "secure", "security", "money", "income", "salary", "practical"])) {
    out.push({
      key: "practicality",
      line: "you kept circling back to practicality and long-term sustainability",
      weight: 3,
    });
  }

  // Impact / meaning / helping
  if (
    hasAny(raw, ["help", "helping", "impact", "meaning", "purpose", "service", "volunteer", "community", "mentor"])
  ) {
    out.push({
      key: "impact",
      line: "you framed choices in terms of real-world usefulness and impact",
      weight: 3,
    });
  }

  // Curiosity / creativity / making / building
  if (
    hasAny(raw, [
      "curious",
      "curiosity",
      "explore",
      "exploring",
      "creative",
      "create",
      "art",
      "design",
      "music",
      "dance",
      "theater",
      "photography",
      "build",
      "making",
    ])
  ) {
    out.push({
      key: "curiosity",
      line: "your creative curiosity came through — you’re drawn to making and trying things",
      weight: 2,
    });
  }

  // Autonomy / independence
  if (hasAny(raw, ["independent", "independence", "own", "my own", "autonomy", "freedom", "self-directed"])) {
    out.push({
      key: "autonomy",
      line: "you seem to value autonomy — having room to steer, not just follow a script",
      weight: 2,
    });
  }

  // Structure / clear steps
  if (hasAny(raw, ["structure", "steps", "plan", "routine", "organized", "clear", "clarity", "checklist"])) {
    out.push({
      key: "structure",
      line: "you seem to do best when there’s a clear plan and a real next step",
      weight: 2,
    });
  }

  return out.sort((a, b) => b.weight - a.weight);
}

/* ---------------------------------------------------------------------------
   Public API
--------------------------------------------------------------------------- */

export function synthesizeMotivationReflection(args: {
  snapshot: OnboardingSnapshot | null;
  answers: StoryAnswers | null;
}): Reflection {
  const snapText = toLowerSafe(flattenSnapshotText(args.snapshot));
  const motivationsText = toLowerSafe(flattenMotivationsOnly(args.answers));

  // We intentionally weight motivations higher than onboarding
  const raw = normalizeSpace(`${motivationsText}\n${motivationsText}\n${snapText}`); // motivations x2

  const scores = emptyScores();

  // curiosity / creativity
  if (
    hasAny(raw, [
      "art",
      "design",
      "creative",
      "create",
      "music",
      "dance",
      "theater",
      "photography",
      "build",
      "making",
      "learn",
      "trying",
      "curious",
      "explore",
    ])
  ) {
    inc(scores, "curiosity", 3);
  }

  // practicality / stability
  if (hasAny(raw, ["stable", "stability", "secure", "security", "money", "income", "salary", "practical"])) {
    inc(scores, "practicality", 3);
  }

  // momentum / urgency
  if (
    hasAny(raw, [
      "waste time",
      "wasting time",
      "stuck",
      "direction",
      "clarity",
      "next step",
      "move forward",
      "quick",
      "fast",
      "soon",
      "right now",
    ])
  ) {
    inc(scores, "momentum", 3);
  }

  // impact / meaning
  if (hasAny(raw, ["impact", "meaning", "purpose", "help", "helping", "service", "volunteer", "community"])) {
    inc(scores, "impact", 3);
  }

  // autonomy
  if (hasAny(raw, ["autonomy", "freedom", "independent", "my own", "self-directed"])) {
    inc(scores, "autonomy", 2);
  }

  // structure
  if (hasAny(raw, ["structure", "steps", "plan", "routine", "organized", "clear", "clarity", "checklist"])) {
    inc(scores, "structure", 2);
  }

  // uncertainty / “I don’t know”
  if (hasAny(raw, ["not sure", "i don't know", "dont know", "confused", "unsure", "overwhelmed"])) {
    inc(scores, "uncertainty", 2);
  }

  // Determine blend (dominant mixture) — not a single trait
  const { curiosity, practicality, momentum, impact, autonomy, structure } = scores;

  let blend: MotivationBlend = "balanced_unclear";

  // Blend selection rules prioritize meaningful pairs:
  if (momentum >= 3 && practicality >= 3) blend = "momentum_plus_fit";
  else if (curiosity >= 3 && practicality >= 3) blend = "curiosity_plus_practicality";
  else if (impact >= 3 && practicality >= 2) blend = "impact_plus_realism";
  else if (autonomy >= 2 && structure >= 2) blend = "autonomy_plus_structure";
  else if (curiosity >= 3 && structure >= 2) blend = "exploration_with_constraints";
  else blend = "balanced_unclear";

  // Pattern lines (synthesis across answers)
  const patternByBlend: Record<MotivationBlend, string> = {
    momentum_plus_fit:
      "Across your Motivations, a consistent theme comes through: you care about momentum and fit — not just what sounds interesting, but what actually moves you forward in a real way.",
    curiosity_plus_practicality:
      "Across your Motivations, you come through as both curious and practical — drawn to exploring, but not willing to ignore what will actually work long-term.",
    impact_plus_realism:
      "Across your Motivations, you seem impact-oriented — you care about usefulness and meaning, but you’re also realistic about constraints and what’s sustainable.",
    autonomy_plus_structure:
      "Across your Motivations, you seem to want autonomy without drifting — room to steer, paired with enough structure to keep you moving.",
    exploration_with_constraints:
      "Across your Motivations, you’re exploratory — but you’re not trying to keep it vague. You want experimentation with constraints, so it leads somewhere.",
    balanced_unclear:
      "Across your Motivations, you’re giving a mix of signals — enough to be confident about direction, without forcing you into one label.",
  };

  const patternLine = sentenceish(patternByBlend[blend] ?? patternByBlend.balanced_unclear);

  // Evidence clause selection (max one)
  const evidenceCandidates = buildEvidenceCandidates(raw);

  // Choose an evidence candidate that supports the blend (when possible)
  const preferredKeyByBlend: Partial<Record<MotivationBlend, Evidence["key"]>> = {
    momentum_plus_fit: "momentum",
    curiosity_plus_practicality: "practicality",
    impact_plus_realism: "impact",
    autonomy_plus_structure: "structure",
    exploration_with_constraints: "momentum",
  };

  const preferred = preferredKeyByBlend[blend];
  const chosen =
    (preferred ? evidenceCandidates.find((e) => e.key === preferred) : undefined) ?? evidenceCandidates[0];

  // Only include evidence if we actually have motivations text (avoid fake “listening”)
  const hasMotivationsText = motivationsText.length > 0;

  const evidenceLine =
    hasMotivationsText && chosen?.line ? sentenceish(`Especially ${chosen.line}`) : undefined;

  return {
    blend,
    patternLine,
    evidenceLine,
  };
}