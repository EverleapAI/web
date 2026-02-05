// src/app/main/insights/app/buildInsightsViewModel.ts
"use client";

export type InsightsTab =
  | "summary"
  | "superpowers"
  | "patterns"
  | "edges"
  | "directions"
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

type TrackProgress = {
  id: "motivations" | "strengths" | "skills";
  title: string;
  subtitle: string;
  answered: number;
  total: number;
  state: "not_started" | "in_progress" | "done";
  href: string;
  hint?: string;
};

export type InsightsViewModel = {
  tab: InsightsTab;
  summary: {
    headline: string;
    receipts: Receipt[];
    progress: TrackProgress[];
    signalBar: SignalBarItem[];
    unlock?: Unlock;
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
    window.localStorage.getItem(ONBOARDING_STORAGE_KEY),
  );
  return parsed ?? {};
}

function loadStorySaved(): Record<string, Saved> {
  if (typeof window === "undefined") return {};
  const parsed = safeJsonParse<Record<string, Saved>>(
    window.localStorage.getItem(STORY_STORAGE_KEY_V3),
  );
  return parsed ?? {};
}

function countAnswered(
  prefix: "motivations" | "strengths" | "skills",
  saved: Record<string, Saved>,
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

  const actionRx = /\b(build|make|ship|try|practice|train|create|prototype|start|finish)\b/gi;
  const peopleRx =
    /\b(feedback|coach|mentor|team|friends?|critique|review|someone|together|group)\b/gi;
  const curiousRx =
    /\b(curious|curiosity|learn|explore|why|figure out|understand|research|discover)\b/gi;
  const clarityRx = /\b(clear|clarity|specific|plan|next step|decide|direction|focus)\b/gi;

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
      meaning: "Making / shipping energy",
      why: "How often your answers point to doing, building, practicing, finishing.",
      examples: actionExamples,
    },
    {
      id: "people",
      label: "Feedback",
      strength: people,
      meaning: "People + feedback energy",
      why: "How much your clarity comes from others: teams, coaches, critique, collaboration.",
      examples: peopleExamples,
    },
    {
      id: "curiosity",
      label: "Exploring",
      strength: curiosity,
      meaning: "Exploring energy",
      why: "How strongly your answers lean toward learning, trying, and figuring things out.",
      examples: curiosityExamples,
    },
    {
      id: "clarity",
      label: "Direction",
      strength: clarity,
      meaning: "Clarity-seeking energy",
      why: "How much you’re asking for a next step, a plan, or a sharper direction.",
      examples: clarityExamples,
    },
  ];

  return items;
}

function pickRepresentativeAnswer(saved: Record<string, Saved>) {
  const ids: string[] = [];
  for (let i = 1; i <= 5; i += 1) ids.push(`motivations_${i}`);
  for (let i = 1; i <= 5; i += 1) ids.push(`strengths_${i}`);
  for (let i = 1; i <= 5; i += 1) ids.push(`skills_${i}`);

  const prefer = /\b(friends?|coffee|team|coach|school|class|club|practice|project|building|making)\b/i;

  let firstLong: string | null = null;
  let bestPrefer: string | null = null;

  for (const id of ids) {
    const a = cleanOneLine(saved[id]?.answer ?? "");
    if (!a) continue;

    if (!firstLong && a.length > 14) firstLong = a;
    if (!bestPrefer && a.length > 10 && prefer.test(a)) bestPrefer = a;

    if (bestPrefer) break;
  }

  return bestPrefer ?? firstLong ?? null;
}

function buildProgressCards(mot: number, str: number, skl: number): TrackProgress[] {
  const total = 5;

  const mkState = (n: number): TrackProgress["state"] =>
    n <= 0 ? "not_started" : n >= total ? "done" : "in_progress";

  const hintFor = (id: TrackProgress["id"], n: number) => {
    if (n >= total) return "Locked in enough signal to use this.";
    if (n === 0) {
      if (id === "motivations") return "Start here — it makes everything else sharper.";
      if (id === "strengths") return "This tells me how you operate day-to-day.";
      return "This tells me what you can build on next.";
    }
    if (n < 3) return "Two more answers makes this click.";
    return "Almost there — one or two more.";
  };

  return [
    {
      id: "motivations",
      title: "Motivations",
      subtitle: "What pulls you forward (and what drains you).",
      answered: mot,
      total,
      state: mkState(mot),
      href: "/main/questions?cat=motivations&returnTo=/main/insights",
      hint: hintFor("motivations", mot),
    },
    {
      id: "strengths",
      title: "Strengths",
      subtitle: "How you operate when you’re at your best.",
      answered: str,
      total,
      state: mkState(str),
      href: "/main/questions?cat=strengths&returnTo=/main/insights",
      hint: hintFor("strengths", str),
    },
    {
      id: "skills",
      title: "Skills",
      subtitle: "What you can build or practice next.",
      answered: skl,
      total,
      state: mkState(skl),
      href: "/main/questions?cat=skills&returnTo=/main/insights",
      hint: hintFor("skills", skl),
    },
  ];
}

function buildSummaryVM(opts: UseLocalOpts) {
  const fallback: InsightsViewModel["summary"] = {
    headline:
      "I’m ready when you are — give me a few answers and I’ll start sounding like I actually know you.",
    receipts: [
      { id: "starter", label: "Insights", detail: "waiting on your answers", tone: "neutral" },
    ],
    progress: buildProgressCards(0, 0, 0),
    signalBar: [
      {
        id: "action",
        label: "Making",
        strength: 0.1,
        meaning: "Making / shipping energy",
        why: "How often your answers point to doing, building, practicing, finishing.",
        examples: [],
      },
      {
        id: "people",
        label: "Feedback",
        strength: 0.1,
        meaning: "People + feedback energy",
        why: "How much your clarity comes from others: teams, coaches, critique, collaboration.",
        examples: [],
      },
      {
        id: "curiosity",
        label: "Exploring",
        strength: 0.1,
        meaning: "Exploring energy",
        why: "How strongly your answers lean toward learning, trying, and figuring things out.",
        examples: [],
      },
      {
        id: "clarity",
        label: "Direction",
        strength: 0.1,
        meaning: "Clarity-seeking energy",
        why: "How much you’re asking for a next step, a plan, or a sharper direction.",
        examples: [],
      },
    ],
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
    storySoFar: [
      "I don’t want to guess about you.",
      "Give me a few real answers, and I’ll reflect back patterns you can actually use — plus one next move you can try this week.",
    ],
    suggests: [
      { id: "s0", text: "A few answers is enough for this page to become personal and useful." },
    ],
    tripUps: [
      {
        id: "t0",
        title: "Not enough signal yet",
        text: "With no examples from your life, everything has to stay generic.",
      },
    ],
    experiment: {
      title: "Run one tiny test",
      text:
        "Pick any direction you’re curious about.\n" +
        "Set a 20–30 minute timer.\n" +
        "Make one tiny artifact (a draft, a sketch, a list, a mini build).\n" +
        "Then come back and log what happened.",
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
  const representative = pickRepresentativeAnswer(saved);

  const who = name ? `${name}` : "You";

  const headline =
    answeredTotal === 0
      ? `${name ? `${name}, ` : ""}give me a few answers — and I’ll make this page sound like it’s about you.`
      : `${who} — here’s what I’m seeing so far.`;

  // Receipts should be “facts / highlights”, not duplicate progress objects.
  const receipts: Receipt[] = [];
  if (answeredTotal > 0) {
    receipts.push({
      id: "answers_total",
      label: "Answers saved",
      detail: String(answeredTotal),
      tone: answeredTotal >= 10 ? "good" : "neutral",
    });
  }
  if (representative) {
    receipts.push({
      id: "rep_detail",
      label: "You mentioned",
      detail: `“${representative}”`,
      tone: "neutral",
    });
  }

  const storySoFar: string[] = [];

  if (answeredTotal === 0) {
    storySoFar.push("I’m not going to do the fortune-cookie thing.");
    storySoFar.push("Answer a few questions and I’ll reflect *your* patterns back — with a next move you can actually try.");
  } else {
    storySoFar.push("This already has signal — because you used real examples, not vibes.");
    if (representative) {
      storySoFar.push(`That line about “${representative}” is a clue. It points to what actually pulls you in.`);
    }

    if (str < 2 || skl < 2) {
      storySoFar.push(
        "Right now I can see direction… but not enough detail to be *specific* about fit.",
      );
      storySoFar.push(
        "Fastest upgrade: add 2 Strengths answers + 2 Skills answers. Then I can turn this into clearer options and a better next step.",
      );
    } else {
      storySoFar.push(
        "You’ve got enough here to stop debating in your head and run a small test on purpose.",
      );
      storySoFar.push(
        "That test result is what will make this page feel scary-accurate instead of generic.",
      );
    }
  }

  const suggests: Suggest[] = answeredTotal
    ? [
        { id: "s1", text: "You’ll get clearer by running small tests — not by overthinking." },
        { id: "s2", text: "You’ll do best where progress is visible (projects, feedback, outcomes)." },
        { id: "s3", text: "Pick a week-sized next move. Don’t try to pick a forever label." },
      ]
    : [{ id: "s0", text: "Answering a few questions will unlock real insights here." }];

  const tripUps: TripUp[] = answeredTotal
    ? [
        {
          id: "t1",
          title: "Trying to solve your whole future at once",
          text: "You don’t need the perfect answer. One small test teaches you more than hours of thinking.",
        },
        {
          id: "t2",
          title: "Waiting to feel ready first",
          text: "Feeling ready usually shows up after you start — not before.",
        },
        ...(answeredTotal > 0 && (mot < 2 || str < 2 || skl < 2)
          ? [
              {
                id: "t3",
                title: "Too little detail to be specific",
                text: "If answers stay super short, I’ll stay vague. A couple real examples makes everything sharper.",
              },
            ]
          : []),
      ]
    : [
        {
          id: "t0",
          title: "No real data yet",
          text: "Without examples from your life, everything here stays generic.",
        },
      ];

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
        title: answeredTotal === 0 ? "Fastest way to unlock real Insights" : "Want this sharper?",
        items: unlockItems.slice(0, 3),
      }
    : {
        title: "Next",
        items: [{ id: "u_explore", label: "Explore directions", href: "/main/explore" }],
      };

  const experiment: Experiment = answeredTotal
    ? {
        title: "Run one small test (20–30 minutes)",
        text:
          "Pick one direction you’re curious about.\n" +
          "Set a 20–30 minute timer.\n" +
          "Make one tiny artifact (a draft, a sketch, a list, a mini build).\n" +
          "Then log the result here so we can sharpen your next move.",
      }
    : {
        title: "Give me a little to work with",
        text:
          "Answer three questions in any category.\n" +
          "Then come back and see how this page changes.",
      };

  return {
    headline,
    receipts: receipts.slice(0, 8),
    progress: buildProgressCards(mot, str, skl),
    signalBar,
    unlock,
    storySoFar: storySoFar.slice(0, 6),
    suggests: suggests.slice(0, 5),
    tripUps: tripUps.slice(0, 4),
    experiment,
  };
}

export function buildInsightsViewModel(
  tab: InsightsTab,
  opts: UseLocalOpts,
): InsightsViewModel {
  const summary = buildSummaryVM(opts);
  return { tab, summary };
}
