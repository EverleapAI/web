// Shapes for the "beating heart" Today card, mirroring the API's
// getTodayGuidance payload (dispatch / coverage / rhythm / welcome).

export type CoverageKey =
  | "motivations"
  | "strengths"
  | "skills"
  | "story"
  | "direction"
  | "experience";

export type CoverageArea = {
  key: CoverageKey;
  label: string;
  filled: boolean;
};

export type Coverage = {
  areas: CoverageArea[];
  filledCount: number;
  total: number;
  nextGapKey: CoverageKey | null;
  nextGapLabel: string | null;
};

export type RhythmDay = {
  date: string;
  count: number;
};

export type Rhythm = {
  days: RhythmDay[];
  total7d: number;
  firstBeat: boolean;
};

export type DispatchType = "learn" | "look" | "do" | "close";

export type DispatchDestination = {
  label: string;
  route: string;
};

export type DispatchAlternate = {
  label: string;
  route: string;
};

// Extra content carried only by the "do" beat.
export type DoMeta = { when: string; duration: string; outcome: string };
export type DispatchSave = { label: string; actionTitle: string };

export type TodayDispatch = {
  type: DispatchType;
  glyph: DispatchType;
  orient: string;
  move: string;
  why: string;
  firstStep: string;
  return: string;
  destination: DispatchDestination;
  alternates: DispatchAlternate[];
  seedQuestion?: string;
  gapKey?: CoverageKey | null;
  meta?: DoMeta | null;
  steps?: string[];
  save?: DispatchSave | null;
};

export type Welcome = {
  firstName: string | null;
  isNewUser: boolean;
};

export type OnboardingSynthesis = {
  headline: string;
  body: string;
  signals: string[];
  bridge: string;
};

// A short, rationed "we heard you" echo — one line of what we've read about the
// user, shown occasionally (not every visit) to reinforce that Today knows them.
export type Reinforcement = {
  eyebrow: string;
  line: string;
};

// A finished-but-unreflected action, surfaced as a quiet secondary nudge rather
// than the whole hero.
export type LooseThread = {
  title: string;
  route: string;
  // "reflect" = finished but not reflected on; "due" = started a while ago and
  // gone quiet ("how's it going?").
  kind?: "reflect" | "due";
};

export type TodayHeartData = {
  dispatch: TodayDispatch;
  coverage: Coverage;
  rhythm: Rhythm;
  welcome: Welcome;
  synthesis?: OnboardingSynthesis | null;
  reinforcement?: Reinforcement | null;
  // Pool of grounded, standalone reads to rotate the establishing lead across
  // visits, so a new/early user doesn't see the same paragraph every day.
  reads?: string[] | null;
  // The woven briefing read (who you are → what you've done here → what's next),
  // generated per state. Preferred hero read when present; refreshes on drift.
  lead?: string | null;
  // Progressive-disclosure hero (retort → see more → why). When present these are
  // preferred over `lead`: `retort` is the ≤50-word punchy read shown by default,
  // `body` is the ~200-word "See more" expansion (a panel below, not a modal),
  // and `why` is the reasoning shown in the "Why" modal. All fall back gracefully.
  retort?: string | null;
  body?: string | null;
  why?: string | null;
  looseThread?: LooseThread | null;
};

// Per-type accent (rgb string for inline rgba) + label + glyph mark.
export const DISPATCH_ACCENT: Record<
  DispatchType,
  { rgb: string; label: string; glyph: string }
> = {
  learn: { rgb: "182,160,255", label: "Learn you", glyph: "◐" },
  look: { rgb: "92,180,255", label: "Look", glyph: "→" },
  do: { rgb: "246,178,60", label: "Do · in the world", glyph: "◆" },
  close: { rgb: "55,211,160", label: "Close the loop", glyph: "✓" },
};
