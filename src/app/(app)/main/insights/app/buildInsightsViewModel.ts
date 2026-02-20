"use client";

export type InsightsTab =
  | "summary"
  | "superpowers"
  | "motivations"
  | "strengths"
  | "skills"
  | "doppelganger";

type UseLocalOpts = { useLocal: boolean };

type Tone = "neutral" | "good" | "watch";

type Receipt = {
  id: string;
  label: string;
  detail?: string;
  tone?: Tone;
};

export type SignalId = "action" | "people" | "curiosity" | "clarity";

type SignalBarItem = {
  id: SignalId;
  label: string;
  strength: number; // 0..1
  meaning: string;
  why: string;
  examples: string[];
};

type UnlockItem = { id: string; label: string; href?: string };
type Unlock = { title?: string; items: UnlockItem[] };

type Suggest = { id: string; text: string };
type TripUp = { id: string; title: string; text: string };
type Experiment = { title: string; text: string };

export type WordCloudItem = {
  term: string;
  weight: number; // 0..1
};

export type InsightsViewModel = {
  tab: InsightsTab;
  summary: {
    headline: string;
    receipts: Receipt[];
    signalBar: SignalBarItem[];
    wordCloud: WordCloudItem[];
    unlock?: Unlock;
    primaryUnlock?: Unlock;
    storySoFar: string[];
    suggests: Suggest[];
    tripUps: TripUp[];
    experiment: Experiment;
  };
};

type Saved = { answer?: string; skipped?: boolean };

type OnboardingV4 = {
  name?: string;
  situation?: "high_school" | "young_adult" | null;
  certainty?: "strong" | "kinda" | "no_clue" | null;
  zip?: string;
  postPlans?: string[];
  activities?: string[];
  activitiesOther?: string;
  funChoice?: string | null;
  stepIndex?: number;
};

const ONBOARDING_STORAGE_KEY = "everleapOnboarding_v4_convo_min";
const STORY_STORAGE_KEY_V3 = "everleap.story.answers.v3";

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function cleanOneLine(s: string) {
  return (s ?? "").replace(/\s+/g, " ").trim();
}

function firstName(raw: string) {
  const cleaned = (raw ?? "").trim().replace(/\s+/g, " ");
  if (!cleaned) return "";
  const first = cleaned.split(" ")[0] ?? "";
  return first.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
}

function niceName(raw: string) {
  const n = firstName(raw);
  if (!n) return "";
  return n.length === 1 ? n.toUpperCase() : `${n[0]!.toUpperCase()}${n.slice(1)}`;
}

function readOnboardingV4(): OnboardingV4 {
  if (typeof window === "undefined") return {};
  const parsed = safeJsonParse<OnboardingV4>(
    window.localStorage.getItem(ONBOARDING_STORAGE_KEY)
  );
  return parsed ?? {};
}

function loadStorySaved(): Record<string, Saved> {
  if (typeof window === "undefined") return {};
  const parsed = safeJsonParse<Record<string, Saved>>(
    window.localStorage.getItem(STORY_STORAGE_KEY_V3)
  );
  return parsed ?? {};
}

function countAnswered(
  prefix: "motivations" | "strengths" | "skills",
  saved: Record<string, Saved>
) {
  let n = 0;
  for (let i = 1; i <= 5; i += 1) {
    const id = `${prefix}_${i}`;
    const a = cleanOneLine(saved[id]?.answer ?? "");
    if (a) n += 1;
  }
  return n;
}

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function uniqLower(a: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of a) {
    const k = (s ?? "").toLowerCase().trim();
    if (!k) continue;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(s);
  }
  return out;
}

function collectMatches(joined: string, rx: RegExp) {
  const matches = joined.match(rx) ?? [];
  return uniqLower(matches.map((m) => cleanOneLine(m))).slice(0, 3);
}

function buildSignalBar(saved: Record<string, Saved>) {
  const allAnswers: string[] = [];
  Object.values(saved).forEach((v) => {
    const a = cleanOneLine(v?.answer ?? "");
    if (a) allAnswers.push(a);
  });

  const joined = allAnswers.join("  ");

  const answeredTotal =
    countAnswered("motivations", saved) +
    countAnswered("strengths", saved) +
    countAnswered("skills", saved);

  const actionRx =
    /\b(build|make|ship|try|practice|train|create|prototype|start|finish)\b/gi;
  const peopleRx =
    /\b(feedback|coach|mentor|team|friends?|critique|review|someone|together|group)\b/gi;
  const curiousRx =
    /\b(curious|curiosity|learn|explore|why|figure out|understand|research|discover)\b/gi;
  const clarityRx =
    /\b(clear|clarity|specific|plan|next step|decide|direction|focus)\b/gi;

  const actionHits = (joined.match(actionRx) ?? []).length;
  const peopleHits = (joined.match(peopleRx) ?? []).length;
  const curiousHits = (joined.match(curiousRx) ?? []).length;
  const clarityHits = (joined.match(clarityRx) ?? []).length;

  const base = clamp01(answeredTotal / 15);

  const action = clamp01(base * 0.55 + Math.min(1, actionHits / 6) * 0.45);
  const people = clamp01(base * 0.55 + Math.min(1, peopleHits / 5) * 0.45);
  const curiosity = clamp01(base * 0.55 + Math.min(1, curiousHits / 6) * 0.45);
  const clarity = clamp01(base * 0.55 + Math.min(1, clarityHits / 4) * 0.45);

  const actionExamples = collectMatches(joined, actionRx);
  const peopleExamples = collectMatches(joined, peopleRx);
  const curiosityExamples = collectMatches(joined, curiousRx);
  const clarityExamples = collectMatches(joined, clarityRx);

  const items: SignalBarItem[] = [
    {
      id: "action",
      label: "Making",
      strength: action,
      meaning: "Hands-on / making energy",
      why: "You keep pointing at doing: building, practicing, finishing.",
      examples: actionExamples,
    },
    {
      id: "people",
      label: "Feedback",
      strength: people,
      meaning: "People + feedback loop",
      why: "You get sharper around others: coaches, teams, critique.",
      examples: peopleExamples,
    },
    {
      id: "curiosity",
      label: "Exploring",
      strength: curiosity,
      meaning: "Curiosity / learning pull",
      why: "You lean toward learning, trying, and figuring things out.",
      examples: curiosityExamples,
    },
    {
      id: "clarity",
      label: "Direction",
      strength: clarity,
      meaning: "Clarity-seeking",
      why: "You keep asking for the next step: a plan, a direction, a decision.",
      examples: clarityExamples,
    },
  ];

  return items;
}

function pickRepresentativeAnswers(saved: Record<string, Saved>, max: number) {
  const ids: string[] = [];
  for (let i = 1; i <= 5; i += 1) ids.push(`motivations_${i}`);
  for (let i = 1; i <= 5; i += 1) ids.push(`strengths_${i}`);
  for (let i = 1; i <= 5; i += 1) ids.push(`skills_${i}`);

  const prefer =
    /\b(friends?|coffee|team|coach|school|class|club|practice|project|building|making|sunshine|outside|music|art|happy)\b/i;

  const picks: string[] = [];
  let firstLong: string | null = null;

  for (const id of ids) {
    const a = cleanOneLine(saved[id]?.answer ?? "");
    if (!a) continue;

    if (!firstLong && a.length > 14) firstLong = a;

    if (prefer.test(a) && a.length >= 3) {
      if (!picks.includes(a)) picks.push(a);
      if (picks.length >= max) break;
    }
  }

  if (picks.length < max && firstLong && !picks.includes(firstLong)) {
    picks.push(firstLong);
  }

  return picks.slice(0, max);
}

/* =========================
   Word cloud (local, simple)
   ========================= */

const STOPWORDS = new Set(
  [
    "a",
    "an",
    "the",
    "and",
    "or",
    "but",
    "so",
    "if",
    "then",
    "than",
    "that",
    "this",
    "those",
    "these",
    "i",
    "me",
    "my",
    "mine",
    "you",
    "your",
    "yours",
    "we",
    "us",
    "our",
    "ours",
    "they",
    "them",
    "their",
    "to",
    "of",
    "in",
    "on",
    "at",
    "for",
    "from",
    "with",
    "without",
    "about",
    "into",
    "over",
    "under",
    "is",
    "are",
    "was",
    "were",
    "be",
    "being",
    "been",
    "do",
    "does",
    "did",
    "doing",
    "have",
    "has",
    "had",
    "it",
    "its",
    "as",
    "just",
    "really",
    "very",
    "maybe",
    "like",
    "kind",
    "kinda",
    "sort",
    "stuff",
    "get",
    "got",
    "getting",
    "make",
    "made",
    "making",
    "build",
    "building",
    "want",
    "wanted",
    "need",
    "needed",
    "feel",
    "feels",
    "feeling",
    "time",
    "times",
    "day",
    "days",
    "most",
    // NOTE: leaving "some" OUT so “Coffee and some friends” still yields coffee/friends
  ].sort()
);

function tokenize(text: string): string[] {
  const raw = (text ?? "").toLowerCase();
  const parts = raw
    .split(/[^a-z0-9']+/g)
    .map((p) => p.trim())
    .filter(Boolean);

  const out: string[] = [];
  for (const p of parts) {
    if (p.length < 3) continue;
    if (STOPWORDS.has(p)) continue;

    const cleaned = p.replace(/^'+|'+$/g, "");
    if (cleaned.length < 3) continue;
    if (STOPWORDS.has(cleaned)) continue;

    out.push(cleaned);
  }
  return out;
}

function buildWordCloud(saved: Record<string, Saved>): WordCloudItem[] {
  const counts = new Map<string, number>();

  for (const v of Object.values(saved)) {
    const a = cleanOneLine(v?.answer ?? "");
    if (!a) continue;
    for (const t of tokenize(a)) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }

  const entries = Array.from(counts.entries())
    .filter(([term, c]) => term.length >= 3 && c >= 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 22);

  const max = Math.max(1, ...entries.map((e) => e[1]));
  return entries.map(([term, c]) => ({
    term,
    weight: clamp01(c / max),
  }));
}

/* =========================
   Summary copy helpers
   ========================= */

function capSentence(s: string) {
  const t = cleanOneLine(s);
  if (!t) return "";
  const c = t[0]!.toUpperCase() + t.slice(1);
  const endsLikeSentence = /[.!?](["'”’)\]]?)$/.test(c);
  return endsLikeSentence ? c : `${c}.`;
}

function quoteSnippet(raw: string) {
  const s = cleanOneLine(raw);
  if (!s) return "";
  if (s.length <= 64) return s;
  return `${s.slice(0, 61)}…`;
}

function progressPhrase(label: string, n: number) {
  if (n >= 5) return `${label}: done`;
  if (n <= 0) return `${label}: not started`;
  return `${label}: ${n}/5`;
}

function pickTopSignals(items: SignalBarItem[]) {
  const sorted = [...items].sort((a, b) => (b.strength ?? 0) - (a.strength ?? 0));
  const top = sorted[0];
  const second = sorted[1];
  return { top, second };
}

/* =========================
   SHORT RETORT SHAPING
   ========================= */

function shortLine(raw: string, max = 92) {
  const s = cleanOneLine(raw);
  if (!s) return "";
  if (s.length <= max) return s;
  return `${s.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

function shortBullets(lines: string[], maxLines: number, maxLen = 92) {
  return (lines ?? [])
    .map((s) => shortLine(s, maxLen))
    .filter(Boolean)
    .slice(0, maxLines);
}

function funReadFromSignals(top?: SignalBarItem, second?: SignalBarItem) {
  const id = top?.id;

  if (id === "people") return "You level up around people. Feedback sharpens you.";
  if (id === "action") return "You get clearer by doing. Motion beats overthinking.";
  if (id === "curiosity") return "Questions pull you forward. You learn by exploring.";
  if (id === "clarity") return "You hate fog. You want a next step you can trust.";

  if (second?.id) return funReadFromSignals(second, undefined);

  return "A pattern is forming. One more section will sharpen it.";
}

function buildSummaryVM(opts: UseLocalOpts): InsightsViewModel["summary"] {
  const fallback: InsightsViewModel["summary"] = {
    headline: "Welcome to Insights.",
    receipts: [],
    signalBar: [
      {
        id: "action",
        label: "Making",
        strength: 0.1,
        meaning: "Hands-on / making energy",
        why: "Shows up when you talk about doing and building.",
        examples: [],
      },
      {
        id: "people",
        label: "Feedback",
        strength: 0.1,
        meaning: "People + feedback loop",
        why: "Shows up when you mention teams, coaches, critique.",
        examples: [],
      },
      {
        id: "curiosity",
        label: "Exploring",
        strength: 0.1,
        meaning: "Curiosity / learning pull",
        why: "Shows up when you talk about learning and exploring.",
        examples: [],
      },
      {
        id: "clarity",
        label: "Direction",
        strength: 0.1,
        meaning: "Clarity-seeking",
        why: "Shows up when you ask for a next step or direction.",
        examples: [],
      },
    ],
    wordCloud: [],
    unlock: {
      title: "Fastest way to unlock real Insights",
      items: [
        {
          id: "finish_any",
          label: "Answer a few questions",
          href: "/main/questions?returnTo=/main/insights",
        },
      ],
    },
    primaryUnlock: {
      title: "Want this to get sharper?",
      items: [
        {
          id: "u_str",
          label: "Answer Strengths",
          href: "/main/questions?cat=strengths&returnTo=/main/insights",
        },
        {
          id: "u_skl",
          label: "Answer Skills",
          href: "/main/questions?cat=skills&returnTo=/main/insights",
        },
      ],
    },
    storySoFar: shortBullets(
      [
        "Insights reflects patterns Everleap is learning from your answers.",
        "Answer a few questions and this becomes personal fast.",
      ],
      2
    ),
    suggests: [{ id: "s0", text: "Answer 3 questions and this becomes personal fast." }],
    tripUps: [
      {
        id: "t0",
        title: "Not enough signal yet",
        text: "Add a few real examples so this stops being generic.",
      },
    ],
    experiment: {
      title: "One tiny test (20 min)",
      text: "Pick 1 idea. Timer 20 min. Make 1 tiny artifact. Log 3 bullets.",
    },
  };

  if (!opts.useLocal || typeof window === "undefined") return fallback;

  const onboarding = readOnboardingV4();
  const saved = loadStorySaved();

  const name = niceName(onboarding.name ?? "");

  const mot = countAnswered("motivations", saved);
  const str = countAnswered("strengths", saved);
  const skl = countAnswered("skills", saved);
  const answeredTotal = mot + str + skl;

  const signalBar = buildSignalBar(saved);
  const cloud = buildWordCloud(saved);
  const { top, second } = pickTopSignals(signalBar);
  const funRead = funReadFromSignals(top, second);

  const headline = name ? `Welcome to Insights, ${name}.` : "Welcome to Insights.";

  const missingStrengths = str < 1;
  const missingSkills = skl < 1;

  const primaryItems: UnlockItem[] = [];
  if (answeredTotal > 0 && (missingStrengths || missingSkills)) {
    if (missingStrengths) {
      primaryItems.push({
        id: "pu_str",
        label: "Answer Strengths",
        href: "/main/questions?cat=strengths&returnTo=/main/insights",
      });
    }
    if (missingSkills) {
      primaryItems.push({
        id: "pu_skl",
        label: "Answer Skills",
        href: "/main/questions?cat=skills&returnTo=/main/insights",
      });
    }
  }

  const primaryUnlock: Unlock | undefined =
    primaryItems.length && answeredTotal > 0
      ? {
          title: "Want this to get more specific?",
          items: primaryItems.slice(0, 2),
        }
      : undefined;

  const unlockItems: UnlockItem[] = [];
  if (mot < 5)
    unlockItems.push({
      id: "u_mot",
      label: mot === 0 ? "Answer Motivations" : "Add a couple more Motivations answers",
      href: "/main/questions?cat=motivations&returnTo=/main/insights",
    });
  if (str < 5)
    unlockItems.push({
      id: "u_str",
      label: str === 0 ? "Answer Strengths" : "Add a couple more Strengths answers",
      href: "/main/questions?cat=strengths&returnTo=/main/insights",
    });
  if (skl < 5)
    unlockItems.push({
      id: "u_skl",
      label: skl === 0 ? "Answer Skills" : "Add a couple more Skills answers",
      href: "/main/questions?cat=skills&returnTo=/main/insights",
    });

  const unlock: Unlock | undefined = unlockItems.length
    ? {
        title: answeredTotal === 0 ? "Fastest way to unlock real Insights" : "If you want more specific",
        items: unlockItems.slice(0, 3),
      }
    : undefined;

  // SHORT story (max 3 lines)
  const storySoFarRaw: string[] = [];

  if (answeredTotal === 0) {
    storySoFarRaw.push("I don’t have enough signal yet.");
    storySoFarRaw.push("Answer 3 questions and come back.");
  } else {
    storySoFarRaw.push(
      capSentence(
        `So far: ${progressPhrase("Motivations", mot)} · ${progressPhrase(
          "Strengths",
          str
        )} · ${progressPhrase("Skills", skl)}`
      )
    );

    storySoFarRaw.push(capSentence(`Top read: ${funRead}`));

    const clues = pickRepresentativeAnswers(saved, 1);
    if (clues[0]) storySoFarRaw.push(`Your clue: “${quoteSnippet(clues[0])}.”`);
  }

  const suggests: Suggest[] = answeredTotal
    ? [
        { id: "s1", text: "Run small tests to get clarity fast." },
        { id: "s2", text: "Pick week-sized next steps. Labels later." },
      ]
    : [{ id: "s0", text: "Answer 3 questions and this becomes personal fast." }];

  const tripUps: TripUp[] = answeredTotal
    ? [
        { id: "t1", title: "Solving everything at once", text: "Do one small test instead." },
        { id: "t2", title: "Waiting to feel ready", text: "Ready shows up after you start." },
      ]
    : [{ id: "t0", title: "No signal yet", text: "Add a few real examples." }];

  const experiment: Experiment = answeredTotal
    ? { title: "One small test (20 min)", text: "Pick 1 idea. Timer 20 min. Make 1 tiny artifact. Log 3 bullets." }
    : { title: "Give me signal", text: "Answer 3 questions. Return here." };

  return {
    headline,
    receipts: [],
    signalBar,
    wordCloud: cloud, // ✅ critical: this must be the computed cloud
    unlock,
    primaryUnlock,
    storySoFar: shortBullets(storySoFarRaw, 3),
    suggests: suggests.slice(0, 3),
    tripUps: tripUps.slice(0, 3),
    experiment,
  };
}

export function buildInsightsViewModel(tab: InsightsTab, opts: UseLocalOpts): InsightsViewModel {
  const summary = buildSummaryVM(opts);
  return { tab, summary };
}
