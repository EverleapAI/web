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

type SignalBarItem = {
  id: string;
  label: string;
  strength: number; // 0..1
};

type UnlockItem = { id: string; label: string; href?: string };

type Unlock = { title?: string; items: UnlockItem[] };

type Suggest = { id: string; text: string };

type TripUp = { id: string; title: string; text: string };

type Experiment = { title: string; text: string };

export type InsightsViewModel = {
  tab: InsightsTab;
  summary: {
    headline: string;
    receipts: Receipt[];
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

  const actionHits =
    (joined.match(/\b(build|make|ship|try|practice|train|create|prototype|start)\b/gi) ?? [])
      .length;
  const peopleHits =
    (joined.match(/\b(feedback|coach|mentor|team|friends?|critique|review|someone)\b/gi) ?? [])
      .length;
  const curiousHits =
    (joined.match(/\b(curious|curiosity|learn|explore|why|figure out|understand)\b/gi) ?? [])
      .length;
  const clarityHits =
    (joined.match(/\b(clear|clarity|specific|plan|next step|decide|direction)\b/gi) ?? [])
      .length;

  const base = clamp01(answeredTotal / 15);

  const action = clamp01(base * 0.55 + Math.min(1, actionHits / 6) * 0.45);
  const people = clamp01(base * 0.55 + Math.min(1, peopleHits / 5) * 0.45);
  const curiosity = clamp01(base * 0.55 + Math.min(1, curiousHits / 6) * 0.45);
  const clarity = clamp01(base * 0.55 + Math.min(1, clarityHits / 4) * 0.45);

  return [
    { id: "action", label: "Action", strength: action },
    { id: "people", label: "People + feedback", strength: people },
    { id: "curiosity", label: "Curiosity", strength: curiosity },
    { id: "clarity", label: "Clarity", strength: clarity },
  ] as SignalBarItem[];
}

function pickRepresentativeAnswer(saved: Record<string, Saved>) {
  const ids: string[] = [];
  for (let i = 1; i <= 5; i += 1) ids.push(`motivations_${i}`);
  for (let i = 1; i <= 5; i += 1) ids.push(`strengths_${i}`);
  for (let i = 1; i <= 5; i += 1) ids.push(`skills_${i}`);

  let best: string | null = null;

  for (const id of ids) {
    const a = cleanOneLine(saved[id]?.answer ?? "");
    if (a && a.length >= 6) {
      best = a;
      break;
    }
  }

  return best;
}

function humanList(items: string[]) {
  const clean = items.filter(Boolean);
  if (clean.length <= 1) return clean[0] ?? "";
  if (clean.length === 2) return `${clean[0]} and ${clean[1]}`;
  return `${clean.slice(0, -1).join(", ")}, and ${clean[clean.length - 1]}`;
}

function topSignals(signalBar: SignalBarItem[]) {
  const sorted = [...signalBar].sort((a, b) => (b.strength ?? 0) - (a.strength ?? 0));
  return sorted.slice(0, 2);
}

function signalClause(id: string) {
  // Short clause fragments used inside a sentence.
  if (id === "people") return "around people and with feedback";
  if (id === "action") return "when there’s something concrete to work on";
  if (id === "curiosity") return "when you get to explore and figure things out";
  if (id === "clarity") return "when the next step feels specific and intentional";
  return "";
}

function representativeFraming(answer: string) {
  const a = cleanOneLine(answer);
  if (!a) return null;

  const lower = a.toLowerCase();

  // A few gentle framings that feel human (no “AI analysis” vibes).
  if (/\bcoffee\b|\bfriends?\b|\bhang\b|\bchill\b|\brelax\b|\bwalk\b/.test(lower)) {
    return "It points to the kind of environment where you feel most yourself — relaxed, grounded — which is often where people do their best work.";
  }
  if (/\bteam\b|\bcoach\b|\bmentor\b|\bfeedback\b|\bcritique\b/.test(lower)) {
    return "It points to you doing your best work when you’re not in your head alone — you get sharper with real feedback and real people around you.";
  }
  if (/\bbuild\b|\bmake\b|\bcreate\b|\bship\b|\bproject\b|\bprototype\b/.test(lower)) {
    return "It points to you being at your best when you’re making something real — progress you can see, touch, and improve.";
  }
  if (/\blearn\b|\bcurious\b|\bexplore\b|\bwhy\b|\bunderstand\b|\bfigure\b/.test(lower)) {
    return "It points to you being driven by curiosity — you get energy when you’re learning and following questions that actually interest you.";
  }

  // Default: grounded but not overconfident.
  return "It’s a clue about what feels natural to you day-to-day — the kinds of moments where your energy is actually steady.";
}

function buildIntroNarrative(args: {
  name: string;
  answeredTotal: number;
  mot: number;
  str: number;
  skl: number;
  representative?: string | null;
  signalBar: SignalBarItem[];
}) {
  const { name, answeredTotal, mot, str, skl, representative, signalBar } = args;

  const who = name ? name : "Hey";

  if (answeredTotal === 0) {
    return [
      "Insights is where Everleap stops sounding generic and starts sounding like it actually knows you.",
      "But I’m not going to guess. I need a few real examples from your life first.",
      "Answer a couple questions in any category, and this page turns into a real read: what motivates you, what you’re good at, what environments fit you, and what to try next.",
      "Below is the structure — it’ll fill in with substance as you answer.",
    ];
  }

  const lines: string[] = [];

  // Doorway / section intro
  lines.push(`${who} — here’s what I’m seeing so far.`);

  // Where you've been
  lines.push(
    "You’ve done the hardest part already: you’re sharing real examples from your life. That’s what makes this guidance actually fit you, instead of sounding like generic advice.",
  );

  // Representative detail
  if (representative) {
    const quoted = representative.length > 160 ? `${representative.slice(0, 157)}…` : representative;
    const framing = representativeFraming(quoted);
    lines.push(`That detail about “${quoted}” matters. ${framing ?? ""}`.trim());
  } else {
    lines.push(
      "Even with shorter answers, I can still see what you keep coming back to — and that starts to tell me what actually fits you.",
    );
  }

  // Pattern line driven by top signals
  const top = topSignals(signalBar);
  const clauses = top.map((t) => signalClause(t.id)).filter(Boolean);

  if (clauses.length) {
    // Make it sound like the user's phrasing you approved.
    lines.push(
      `The pattern coming through: you move forward ${humanList(clauses)}. You build momentum by doing, not just thinking about options.`,
    );
  } else {
    lines.push(
      "The pattern coming through: you build momentum by doing something real — not by trying to think your way into certainty.",
    );
  }

  // What’s missing / what’s unclear
  const missingStrengths = str < 2;
  const missingSkills = skl < 2;

  if (missingStrengths || missingSkills) {
    lines.push(
      "What’s still unclear isn’t your potential — it’s your direction. That’s normal. You want your next step to feel intentional, not random, and we just need a bit more signal to sharpen the picture.",
    );
  } else {
    lines.push(
      "At this point, it’s less about “who you could be” and more about narrowing the environment and projects that actually fit how you operate.",
    );
  }

  // Orientation to the page
  const progressBits: string[] = [];
  if (mot) progressBits.push(`Motivations ${mot}/5`);
  if (str) progressBits.push(`Strengths ${str}/5`);
  if (skl) progressBits.push(`Skills ${skl}/5`);

  if (progressBits.length) {
    lines.push(
      `Below, I’ll show you the signals I’m picking up, what they suggest, the watch-outs, and one small experiment. (So far I’m working with: ${progressBits.join(" • ")}.)`,
    );
  } else {
    lines.push(
      "Below, I’ll show you the signals I’m picking up, what they suggest, the watch-outs, and one small experiment.",
    );
  }

  // Call to action that matches your drafted copy
  if (str < 2 || skl < 2) {
    lines.push(
      "If you want this to get sharply tailored to you, the fastest move is simple: answer two Strengths and two Skills questions. Then we can move from broad patterns to real recommendations and tactical next steps that actually fit your life.",
    );
  } else {
    lines.push(
      "If you want this to get sharper, run the small experiment below — then come back and we’ll tighten your directions based on what you notice.",
    );
  }

  // Keep it a “section intro” but not a novel.
  return lines.slice(0, 8);
}

function buildSummaryVM(opts: UseLocalOpts) {
  const fallback: InsightsViewModel["summary"] = {
    headline: "Start here — and I’ll make this page about you.",
    receipts: [{ id: "starter", label: "No answers yet", tone: "neutral" }],
    signalBar: [
      { id: "action", label: "Action", strength: 0.1 },
      { id: "people", label: "People + feedback", strength: 0.1 },
      { id: "curiosity", label: "Curiosity", strength: 0.1 },
      { id: "clarity", label: "Clarity", strength: 0.1 },
    ],
    unlock: {
      title: "To unlock real insights",
      items: [
        {
          id: "finish_any",
          label: "Answer a few questions",
          href: "/main/questions?returnTo=/main/insights",
        },
      ],
    },
    storySoFar: [
      "Insights is where Everleap stops sounding generic and starts sounding like it actually knows you.",
      "But I’m not going to guess. I need a few real examples from your life first.",
      "Answer a couple questions in any category, and this page turns into a real read: what motivates you, what you’re good at, what environments fit you, and what to try next.",
      "Below is the structure — it’ll fill in with substance as you answer.",
    ],
    suggests: [{ id: "s0", text: "Answering a few questions will unlock personalized insights." }],
    tripUps: [
      {
        id: "t0",
        title: "Not enough signal yet",
        text: "With no real examples, everything stays vague. A few specific answers fixes that fast.",
      },
    ],
    experiment: {
      title: "Answer three questions",
      text:
        "Pick any category (Motivations, Strengths, or Skills).\n" +
        "Answer three questions honestly.\n" +
        "Then come back — this page will change to reflect you.",
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

  // Headline: short hero line; narrative below does the heavy lift.
  const headline =
    answeredTotal === 0
      ? `${name ? `${name} — ` : ""}I’m ready when you are. Give me a few answers and I’ll make this page about you.`
      : `${name ? `${name} — ` : ""}your Insights are starting to take shape.`;

  // Receipts: grounding + progress
  const receipts: Receipt[] = [];
  if (answeredTotal > 0) {
    receipts.push({
      id: "answers_total",
      label: "Answers so far",
      detail: `${answeredTotal}/15`,
      tone: answeredTotal >= 10 ? "good" : "neutral",
    });
  }
  if (mot) {
    receipts.push({
      id: "mot_done",
      label: "Motivations",
      detail: `${mot}/5`,
      tone: mot === 5 ? "good" : "neutral",
    });
  }
  if (str) {
    receipts.push({
      id: "str_done",
      label: "Strengths",
      detail: `${str}/5`,
      tone: str === 5 ? "good" : "neutral",
    });
  }
  if (skl) {
    receipts.push({
      id: "skl_done",
      label: "Skills",
      detail: `${skl}/5`,
      tone: skl === 5 ? "good" : "neutral",
    });
  }

  const storySoFar = buildIntroNarrative({
    name,
    answeredTotal,
    mot,
    str,
    skl,
    representative,
    signalBar,
  });

  const suggests: Suggest[] =
    answeredTotal > 0
      ? [
          {
            id: "s1",
            text: "You’ll get the best outcomes by choosing environments that fit how you actually work (energy + feedback + pace), not by chasing the “best” label.",
          },
          {
            id: "s2",
            text: "Clarity for you is likely something you earn through trying small real things — not something you wait for before you start.",
          },
          {
            id: "s3",
            text: "If we keep the next steps small and concrete, you’ll learn faster and second-guess less.",
          },
        ]
      : [{ id: "s0", text: "Answer a few questions and this will become a real, personalized read." }];

  const tripUps: TripUp[] =
    answeredTotal > 0
      ? [
          {
            id: "t1",
            title: "Treating this like one big decision",
            text: "This is not “pick your life.” It’s “run a small test.” One week of action beats ten hours of guessing.",
          },
          {
            id: "t2",
            title: "Over-optimizing before you have data",
            text: "If you try to perfect the plan first, you’ll stall. Get one real experience, then adjust.",
          },
          ...((str < 2 || skl < 2)
            ? [
                {
                  id: "t3",
                  title: "Too little detail to be specific",
                  text: "Short answers keep the output broad. A couple concrete examples (what you did, what you liked, what you avoided) makes this sharp.",
                } satisfies TripUp,
              ]
            : []),
        ]
      : [
          {
            id: "t0",
            title: "No real data yet",
            text: "Without examples from your life, this can’t be specific — and I won’t fake it.",
          },
        ];

  const unlockItems: UnlockItem[] = [];
  if (mot < 5)
    unlockItems.push({
      id: "u_mot",
      label: `Finish Motivations (${mot}/5)`,
      href: "/main/questions?cat=motivations&returnTo=/main/insights",
    });
  if (str < 5)
    unlockItems.push({
      id: "u_str",
      label: `Finish Strengths (${str}/5)`,
      href: "/main/questions?cat=strengths&returnTo=/main/insights",
    });
  if (skl < 5)
    unlockItems.push({
      id: "u_skl",
      label: `Finish Skills (${skl}/5)`,
      href: "/main/questions?cat=skills&returnTo=/main/insights",
    });

  const unlock: Unlock | undefined = unlockItems.length
    ? {
        title: "What you can fill in next",
        items: unlockItems,
      }
    : undefined;

  const experiment: Experiment =
    answeredTotal === 0
      ? {
          title: "Give me a little to work with",
          text:
            "Answer three questions in any category.\n" +
            "Then come back and see how this page changes.",
        }
      : {
          title: "Run one small experiment (30 minutes)",
          text:
            "Pick one direction you’re curious about.\n" +
            "Do something real for 30 minutes (watch + take notes, try a mini build, sketch, write, research, talk to someone).\n" +
            "Afterward, write two lines:\n" +
            "• “This felt energizing because ___.”\n" +
            "• “This felt draining because ___.”",
        };

  return {
    headline,
    receipts: receipts.slice(0, 8),
    signalBar,
    unlock,
    storySoFar, // intentionally longer; this is the section intro
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

  // Keep other tabs scaffolded for now (page.tsx already shows scaffold UI)
  return { tab, summary };
}
