// src/app/main/carousel/page.tsx
"use client";

import * as React from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, X, Send } from "lucide-react";

import { BottomNav } from "@/components/navigation/BottomNav";
import { AppChrome } from "@/components/site/AppChrome";

import {
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
  INSIGHTS_THEMES,
} from "@/theme/everleapVisuals";

/* ========= Data types ========= */

type TraitCard = {
  id: string;
  title: string;
  short: string;
  long?: string;
  icon?: string;
};

type NextMove = { id: string; title: string; blurb: string };

type DeepDiveSection = { h: string; p: string };

type DeepDive = {
  title: string;
  sections: DeepDiveSection[];
};

type CareerSuggestion = {
  id:
    | "productUx"
    | "healthHumanSupport"
    | "educationCommunityPrograms"
    | "independentBuilder"; // ✅ must match StepperLaneId
  title: string;
  why: string;
  starterExperiment: string;
  bestFor: string;
};

type YouMapArea = {
  id: string;
  label: string;
  chip: string;
  icon: ReactNode;
  glowClass: string;

  summary: string;
  hint: string;
  coachRead: string;
  signals: string[];
  about: string;
  nextMoves: NextMove[];
  deepDive: DeepDive;
  careerSuggestions?: CareerSuggestion[];
  cards: TraitCard[];
};

/* ============================================================
   Opinionated placeholder content (intentionally “spiky”)
   ============================================================ */

const areas: YouMapArea[] = [
  {
    id: "career",
    label: "Recommendations",
    chip: "What to try next",
    icon: <span aria-hidden>🧭</span>,
    glowClass: "from-sky-400 via-indigo-500 to-slate-400",
    summary:
      "You’ll get bored in ‘prestige + paperwork’ careers. You want impact you can feel and progress you can see.",
    hint: "This isn’t a forever decision. These are test lanes.",
    coachRead:
      "My strongest opinion: you’re not built for slow, approval-heavy ladders. You’ll tolerate them for a while… then rebel. You’ll do best where you can build, help, or ship something real—and get feedback fast. If you can’t feel impact, you’ll drift.",
    signals: [
      "Impact-first",
      "Needs autonomy",
      "Hates performative work",
      "Likes fast feedback loops",
      "Wants real-world relevance",
    ],
    about:
      "Career is treated as experiments: we recommend directions, you react, we calibrate. Your reaction is the data.",
    careerSuggestions: [
      {
        id: "productUx",
        title: "Product / UX (building things people use)",
        why: "Visible progress + real users + fast feedback. This keeps you energized.",
        bestFor: "If you like building + improving real things.",
        starterExperiment:
          "Redesign one screen of an app you use. Show it to 2 people and ask what they’d change.",
      },
      {
        id: "healthHumanSupport",
        title: "Health + Human Support (coaching, wellness, patient support)",
        why: "Meaning is automatic. You can see impact in real humans.",
        bestFor: "If helping people directly gives you energy.",
        starterExperiment:
          "Interview someone in a helping role. Ask: what do you love and what do you hate?",
      },
      {
        id: "educationCommunityPrograms",
        title: "Education / Community / Programs (impact work)",
        why: "Purpose + people + momentum. Not theory—real outcomes.",
        bestFor: "If you like people + momentum + organizing outcomes.",
        starterExperiment:
          "Volunteer once. Track energy before/after and what felt meaningful vs draining.",
      },
      {
        id: "independentBuilder",
        title: "Independent Builder (creator, startup, entrepreneurship)",
        why: "Autonomy + momentum + output. Your wiring likes shipping.",
        bestFor: "If you crave freedom + making things from scratch.",
        starterExperiment:
          "Make one tiny thing in a weekend (guide, video, mini-tool). Ship it.",
      },
    ],
    nextMoves: [
      {
        id: "pick-one",
        title: "Pick 1 direction to test",
        blurb: "Not decide. Test. Your reaction is the data.",
      },
      {
        id: "one-call",
        title: "Do 1 real conversation",
        blurb: "Talk to someone doing it. Ask what’s brutal and what’s great.",
      },
      {
        id: "micro-build",
        title: "Build 1 micro-proof",
        blurb: "A tiny artifact beats a big decision.",
      },
    ],
    deepDive: {
      title: "My read so far • Recommendations",
      sections: [
        {
          h: "The claim",
          p: "You’ll do best in careers where the work feels real and the feedback is frequent. You’re not built for slow, status-based ladders.",
        },
        {
          h: "What I think you’d love",
          p:
            "• real users / real people\n" +
            "• visible progress\n" +
            "• autonomy + trust\n" +
            "• teams that care about outcomes",
        },
        {
          h: "What I think you’d hate",
          p:
            "• performative meetings\n" +
            "• unclear ownership\n" +
            "• slow feedback\n" +
            "• careers that reward “looking busy”",
        },
        {
          h: "4 directions to test first",
          p:
            "1) Product / UX\n" +
            "2) Health + Human Support\n" +
            "3) Education / Community / Programs\n" +
            "4) Independent Builder\n\n" +
            "These are not “forever choices.” They are test lanes.",
        },
        {
          h: "How to refine (what I need from you)",
          p:
            "Answer these and the recommendations get sharper:\n" +
            "• Do you prefer people-problems or system-problems?\n" +
            "• Do you want to lead, support, or build?\n" +
            "• Fast pace or deep focus?\n" +
            "• What’s non-negotiable (schedule, autonomy, meaning)?",
        },
        {
          h: "One experiment (do this week)",
          p:
            "Pick ONE lane above and run ONE test.\n" +
            "Then tell Everleap: what felt energizing, what felt gross, what felt confusing?",
        },
      ],
    },
    cards: [
      {
        id: "anti-prestige",
        title: "Not prestige-driven",
        short: "You won’t stay in a career just because it looks good.",
        long: "If something is impressive but empty, you’ll eventually reject it. You need real impact to stay engaged.",
        icon: "🏆",
      },
      {
        id: "feedback-loop-career",
        title: "Feedback loop career",
        short: "You need a career with fast signal.",
        long: "If you can’t see progress and impact, you’ll drift. Pick paths with real outcomes and real feedback.",
        icon: "📡",
      },
    ],
  },

  // --- rest unchanged ---
  {
    id: "motivations",
    label: "Motivations",
    chip: "What drives you",
    icon: <span aria-hidden>🔥</span>,
    glowClass: "from-amber-400 via-orange-500 to-rose-500",
    summary:
      "You’re not lazy — you’re allergic to pointless work. If the ‘why’ is missing, you shut down fast.",
    hint: "When the purpose is real, you’re intense. When it’s fake, you disappear.",
    coachRead:
      "Here’s my blunt read: you don’t get motivated by “should.” You get motivated by meaning and momentum. The second something becomes checkbox theater, your brain checks out — and you start doing anything else that feels more real. You’ll work insanely hard for the right reason… and do the bare minimum for the wrong one.",
    signals: [
      "Purpose > praise",
      "Boredom is your enemy",
      "Momentum addict (in a good way)",
      "Busywork triggers avoidance",
      "You need a clear win-condition",
    ],
    about:
      "Based on what you’ve shared so far (and how people like you typically describe energy), Everleap is forming hypotheses about what energizes you vs drains you. This is meant to be challenged.",
    nextMoves: [
      { id: "cut-busywork", title: "Delete one fake task", blurb: "Pick one thing you’re doing for appearances and drop it." },
      { id: "make-real", title: "Make a task real", blurb: "Attach one person, one outcome, or one deadline to it." },
      { id: "tiny-win", title: "Create a visible win", blurb: "Define what “done” looks like in one sentence." },
    ],
    deepDive: {
      title: "My read so far • Motivations",
      sections: [
        { h: "The claim", p: "You are meaning-and-momentum wired. Your motivation doesn’t respond to generic pressure—it responds to purpose + progress." },
        { h: "What you do when it’s working", p: "When something matters, you get locked in. You move fast. You’ll even tolerate discomfort because the effort feels connected to something real.\n\nYou become the person who “suddenly has energy” once the goal makes sense." },
        { h: "What you do when it’s not working", p: "When something feels pointless, you don’t just get bored—you get slippery.\nYou procrastinate, you drift, you switch tasks, you scroll. It looks like laziness, but it’s actually rejection: your brain refuses low-signal effort." },
        { h: "The trap", p: "The trap is thinking you need more discipline. You don’t.\nYou need better signal: clearer stakes, clearer purpose, clearer checkpoints." },
        { h: "One experiment", p: "Take one task you’re avoiding. Add a win-condition + a 20-minute start.\nIf your motivation returns, you didn’t have a discipline problem—you had a meaning problem." },
      ],
    },
    cards: [
      { id: "meaning-vs-status", title: "Meaning beats status", short: "You’ll pick “real” over “impressive.”", long: "If something looks good on paper but feels empty, you won’t stay engaged. You’d rather do work that matters than work that impresses strangers.", icon: "🎯" },
      { id: "momentum-fuel", title: "Momentum is fuel", short: "Progress is your dopamine.", long: "You don’t need massive rewards. You need movement—evidence the effort is going somewhere.", icon: "📈" },
    ],
  },

  {
    id: "strengths",
    label: "Strengths",
    chip: "How you naturally show up",
    icon: <span aria-hidden>✨</span>,
    glowClass: "from-violet-500 via-fuchsia-500 to-sky-400",
    summary:
      "You’re a pattern reader. You notice what’s happening under the surface—and it makes you hard to fool.",
    hint: "You see the real game faster than most people.",
    coachRead:
      "My opinionated read: your best strength isn’t raw talent—it’s insight. You pick up patterns fast, and you can usually tell what matters and what doesn’t. The downside is you can get impatient with slow thinkers, vague plans, or performative confidence.",
    signals: [
      "Pattern detector",
      "Fast learner when interested",
      "Low tolerance for vague plans",
      "Can be quietly intense",
      "You read people well",
    ],
    about:
      "These are early hypotheses based on your tone, your choices, and typical answer patterns. If this doesn’t fit, tell Everleap what’s truer.",
    nextMoves: [
      { id: "name-strength", title: "Name your unfair advantage", blurb: "What do you see that others miss?" },
      { id: "pressure-move", title: "Spot your pressure move", blurb: "Under stress: do you organize, act, calm, or withdraw?" },
      { id: "make-visible", title: "Make it visible", blurb: "Turn one strength into an artifact others can see." },
    ],
    deepDive: {
      title: "My read so far • Strengths",
      sections: [
        { h: "The claim", p: "Your strength is sense-making: you spot patterns, signal, and “what matters” faster than most people." },
        { h: "How it shows up", p: "You can walk into a messy situation and feel the real problem.\nYou’ll often know the answer before you can explain how you know it." },
        { h: "When it backfires", p: "You may get impatient with slow, vague, or performative environments.\nYou might also underestimate yourself because what you do feels obvious to you." },
        { h: "What you need", p: "You need environments that reward clarity and honesty.\nIf you’re forced into fake consensus or constant ambiguity, you’ll get drained." },
        { h: "One experiment", p: "Ask 2 people: “What do I make look easy?”\nThe overlap is your real strength—especially if you didn’t think it counted." },
      ],
    },
    cards: [
      { id: "sensemaking", title: "Sense-making", short: "You’re good at separating signal from noise.", long: "This is the kind of strength that makes you valuable in leadership, product thinking, strategy, and any role where the problem isn’t obvious.", icon: "🧠" },
      { id: "impatience", title: "The impatience edge", short: "You get annoyed when things are fake or slow.", long: "That annoyance is data: it tells you what environments don’t fit your wiring. Use it as a compass, not a personality flaw.", icon: "⚡" },
    ],
  },

  {
    id: "skills",
    label: "Skills",
    chip: "What you can already do",
    icon: <span aria-hidden>🛠️</span>,
    glowClass: "from-cyan-400 via-sky-500 to-indigo-500",
    summary:
      "You learn by building. Studying forever makes you feel smart—but making something makes you dangerous.",
    hint: "Your confidence grows when you ship something real.",
    coachRead:
      "Blunt read: you’re not a ‘perfect prep’ person. You’re a ‘messy prototype’ person. If you’re stuck, it’s usually because you’re consuming instead of producing. Once you start building—even small—your skill curve climbs fast.",
    signals: [
      "Learns by doing",
      "Gets better with feedback",
      "Research can become avoidance",
      "Fast skill compounding",
      "Needs real stakes to focus",
    ],
    about:
      "This is a hypothesis. If you’re actually a deep-planner who hates prototyping, tell Everleap and we’ll recalibrate.",
    nextMoves: [
      { id: "ship-30", title: "Ship a 30-minute proof", blurb: "One tiny artifact beats a week of notes." },
      { id: "feedback-1", title: "Get one piece of feedback", blurb: "Show it to one human. Ask: “What’s one upgrade?”" },
      { id: "stack-2", title: "Stack 2 skills", blurb: "Pair what you know with one new tool and build." },
    ],
    deepDive: {
      title: "My read so far • Skills",
      sections: [
        { h: "The claim", p: "Your fastest path is build → show → refine. You don’t need more information—you need more artifacts." },
        { h: "Where you win", p: "You’re likely good at picking up tools when there’s a purpose.\nYou learn the fastest when the output is visible and the feedback is real." },
        { h: "Where you get stuck", p: "Your trap is “infinite prep”: researching until you feel ready.\nThat feels productive but it doesn’t create confidence." },
        { h: "What to do instead", p: "Make tiny proofs.\nProofs create clarity. Clarity creates motivation. Motivation creates skill." },
        { h: "One experiment", p: "Pick one skill. Build something small in 30 minutes.\nIf you feel more confident after, you’re a builder-learner (not a study-learner)." },
      ],
    },
    cards: [
      { id: "artifact-mindset", title: "Artifact mindset", short: "Your best learning looks like output, not input.", long: "Notes don’t change your life. Artifacts do: drafts, prototypes, demos, projects, posts, small wins you can point to.", icon: "📦" },
      { id: "feedback-loop", title: "Feedback loop", short: "You improve fast when someone reacts to your work.", long: "If you want rapid growth, pick environments with coaching, critique, or real users.", icon: "🗣️" },
    ],
  },

  {
    id: "friends",
    label: "Friends",
    chip: "Your people patterns",
    icon: <span aria-hidden>🧑‍🤝‍👩</span>,
    glowClass: "from-emerald-400 via-teal-400 to-sky-400",
    summary:
      "You’re selective. Shallow social stuff drains you more than being alone.",
    hint: "You don’t want more friends. You want better energy.",
    coachRead:
      "My read: you’re not antisocial—you’re allergic to fake connection. You can do groups, but only if there’s honesty and a real vibe. If it’s performative, you’ll either go quiet or mentally leave. You’re at your best with people who let you be direct without making it dramatic.",
    signals: [
      "Selective connection",
      "Sensitive to group dynamics",
      "Honesty > popularity",
      "You spot fake vibes fast",
      "You recharge with a few real people",
    ],
    about:
      "This is based on common patterns in people who value depth and signal. If you actually love big groups and constant stimulation, tell us.",
    nextMoves: [
      { id: "energy-people", title: "Name 2 ‘energy people’", blurb: "Who leaves you feeling clearer after you talk?" },
      { id: "drain", title: "Name 1 drain dynamic", blurb: "What kind of interaction makes you shrink?" },
      { id: "real-text", title: "Send one real text", blurb: "One honest message beats 10 memes." },
    ],
    deepDive: {
      title: "My read so far • Friends",
      sections: [
        { h: "The claim", p: "You thrive on real connection, not constant connection." },
        { h: "How it shows up", p: "You’re probably the person who notices the mood of a room.\nYou can feel when something is off—even if nobody says it." },
        { h: "Your best people", p: "People who are:\n• honest\n• calm\n• supportive without being clingy\n• not performative" },
        { h: "Your worst people", p: "People who are:\n• status-obsessed\n• dramatic\n• constantly testing loyalty\n• fake-nice" },
        { h: "One experiment", p: "After you hang out with someone, rate your energy 1–10.\nDo this 5 times. Your pattern will show up fast." },
      ],
    },
    cards: [
      { id: "depth-over-noise", title: "Depth over noise", short: "You don’t need a crowd. You need real.", long: "Your confidence rises when you’re around people who are authentic. Noise drains you faster than solitude.", icon: "🌊" },
      { id: "vibe-sensor", title: "Vibe sensor", short: "You’re a social signal detector.", long: "That sensitivity is a superpower if you use it to choose environments instead of just enduring them.", icon: "📡" },
    ],
  },

  {
    id: "family",
    label: "Family",
    chip: "Where you’re coming from",
    icon: <span aria-hidden>🏠</span>,
    glowClass: "from-rose-400 via-amber-400 to-fuchsia-500",
    summary:
      "You carry invisible rules from home — and some of them are running your life on autopilot.",
    hint: "Not blame. Pattern. Then choice.",
    coachRead:
      "Here’s my read: you’ve probably learned a few ‘default settings’ about responsibility, success, and what emotions are allowed. Some of those settings made you strong. Some quietly stress you out. You might be harder on yourself than you’d ever be on a friend.",
    signals: [
      "Carries responsibility",
      "Feels pressure early",
      "High internal standards",
      "Emotion radar",
      "Self-criticism > self-compassion",
    ],
    about:
      "Family patterns show up in how you interpret pressure, safety, and success. This is a hypothesis to challenge.",
    nextMoves: [
      { id: "rule", title: "Name one invisible rule", blurb: "What did ‘being good’ mean in your house?" },
      { id: "rewrite", title: "Rewrite it", blurb: "What rule do you want instead—one that fits you now?" },
      { id: "ease", title: "Practice ease once", blurb: "Do one thing without earning it first." },
    ],
    deepDive: {
      title: "My read so far • Family",
      sections: [
        { h: "The claim", p: "You inherited rules. Now you get to edit them." },
        { h: "What I’m noticing", p: "You may feel responsible even when nobody asked you to.\nYou may chase approval quietly—or reject it loudly.\n\nEither way, the pattern is: pressure shows up fast in your nervous system." },
        { h: "The edge", p: "Your edge is maturity: you can handle real things.\nThe downside is you can treat rest like something you must earn." },
        { h: "One experiment", p: "Write two sentences:\n1) “In my family, success meant ____.”\n2) “For me, success means ____.”\n\nIf those differ, you’ve found a pressure source." },
      ],
    },
    cards: [
      { id: "earned-rest", title: "Earned rest", short: "You might treat rest like a reward, not a need.", long: "If that’s true, you’ll burn out in high-pressure environments unless you build recovery into your identity.", icon: "🛟" },
      { id: "default-pressure", title: "Default pressure", short: "Pressure may show up before logic does.", long: "This isn’t weakness. It’s learned wiring. Once you can name it, you can change it.", icon: "🧩" },
    ],
  },
];

/* ============================================================
   Local “Guide” feedback modal (placeholder, no AI API yet)
   ============================================================ */

type FeedbackRating = "mostly" | "somewhat" | "nope";

type GuideMsg = { role: "guide" | "user"; text: string };

function labelForRating(r: FeedbackRating) {
  if (r === "mostly") return "Mostly right";
  if (r === "somewhat") return "Somewhat";
  return "Not really";
}

/* ========= Component ========= */

export default function YouMapPage() {
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [whyOpen, setWhyOpen] = React.useState(false);

  const [recContextOpen, setRecContextOpen] = React.useState(false);

  const [deepOpen, setDeepOpen] = React.useState(false);
  const deepCloseBtnRef = React.useRef<HTMLButtonElement | null>(null);

  const [guideOpen, setGuideOpen] = React.useState(false);
  const [guideDraft, setGuideDraft] = React.useState("");
  const [guideMsgs, setGuideMsgs] = React.useState<GuideMsg[]>([]);
  const [guideCtx, setGuideCtx] = React.useState<{
    areaId: string;
    areaLabel: string;
    rating: FeedbackRating;
    source: "page" | "deep" | "recommendation_pick";
  } | null>(null);

  const guideInputRef = React.useRef<HTMLTextAreaElement | null>(null);

  const dark = isDarkTheme(themeId);
  const theme =
    INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];

  const activeArea = areas[activeIndex];

  const sectionLabelClass = dark
    ? "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-300/60"
    : "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500";

  const pageTextMutedClass = dark ? "text-slate-300/90" : "text-slate-600";

  const cardShadow = dark
    ? "shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
    : "shadow-[0_16px_45px_rgba(0,0,0,0.18)]";

  const surface = `${theme.cardBgClass} ${theme.cardBorderClass} ${cardShadow} backdrop-blur-xl`;

  const microText = dark ? "text-slate-400" : "text-slate-500";

  const areaChipBase = dark
    ? "border-slate-800/80 bg-slate-950/60 text-slate-200 hover:bg-slate-950/75"
    : "border-slate-200 bg-white/80 text-slate-800 hover:bg-white";

  const areaChipActive = dark
    ? `
    border-white/18 text-slate-50
    bg-gradient-to-r from-white/10 via-white/6 to-white/5
    shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_10px_28px_rgba(56,189,248,0.18)]
  `
    : `
    border-sky-300 text-slate-900
    bg-gradient-to-r from-sky-50 via-white to-white
    shadow-[0_0_0_1px_rgba(56,189,248,0.22),0_10px_24px_rgba(56,189,248,0.16)]
  `;

  const accentGlow = `bg-gradient-to-br ${activeArea.glowClass}`;
  const chipAccentBar = `bg-gradient-to-b ${activeArea.glowClass}`;

  const topSignals = activeArea.signals.slice(0, 3);
  const extraSignals = Math.max(activeArea.signals.length - topSignals.length, 0);

  function goToArea(nextIndex: number) {
    setWhyOpen(false);
    setRecContextOpen(false);
    setActiveIndex(nextIndex);
  }

  function openDeepDive() {
    setDeepOpen(true);
  }
  function closeDeepDive() {
    setDeepOpen(false);
  }

  function openGuide(rating: FeedbackRating, source: "page" | "deep") {
    const ctx = {
      areaId: activeArea.id,
      areaLabel: activeArea.label,
      rating,
      source,
    } as const;

    setGuideCtx(ctx);

    const seed: GuideMsg[] = [
      {
        role: "guide",
        text:
          `Calibration for **${activeArea.label}**: you said “${labelForRating(rating)}.”\n\n` +
          `What part felt most true — and what part is wrong?`,
      },
      {
        role: "guide",
        text:
          "If you rewrote this insight in your own words, what would it say (one or two sentences)?",
      },
    ];

    setGuideMsgs(seed);
    setGuideDraft("");
    setGuideOpen(true);

    window.setTimeout(() => guideInputRef.current?.focus(), 50);
  }

  function openRecommendationGuide(c: CareerSuggestion) {
    const ctx = {
      areaId: activeArea.id,
      areaLabel: activeArea.label,
      rating: "somewhat" as FeedbackRating,
      source: "recommendation_pick" as const,
    };

    setGuideCtx(ctx);

    const seed: GuideMsg[] = [
      {
        role: "guide",
        text:
          `Ok cool.\n\nYou picked **${c.title}**.\n\n` +
          `Quick 3-day test:\n${c.starterExperiment}\n\n` +
          `When could you do the *first step* — today or tomorrow?`,
      },
    ];

    setGuideMsgs(seed);
    setGuideDraft("");
    setGuideOpen(true);

    window.setTimeout(() => guideInputRef.current?.focus(), 50);
  }

  function closeGuide() {
    setGuideOpen(false);
  }

  function submitGuide() {
    const text = guideDraft.trim();
    if (!text) return;

    setGuideMsgs((prev) => [...prev, { role: "user", text }]);
    setGuideDraft("");

    const followUp =
      guideCtx?.source === "recommendation_pick"
        ? "Nice. What would make this test feel *easy*—time, place, or who you do it with?"
        : guideCtx?.rating === "nope"
        ? "Got it. What’s the *truer* pattern for you (and when does it show up most)?"
        : guideCtx?.rating === "somewhat"
        ? "Helpful. Which part should I tone down or flip, and what’s the better version?"
        : "Nice. What’s one specific example from your life that proves this is true?";

    setGuideMsgs((prev) => [...prev, { role: "guide", text: followUp }]);
  }

  React.useEffect(() => {
    if (!deepOpen) return;

    window.setTimeout(() => deepCloseBtnRef.current?.focus(), 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDeepDive();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deepOpen]);

  React.useEffect(() => {
    if (!guideOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGuide();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [guideOpen]);

  const feedbackButtonBase =
    "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95";
  const feedbackButtonDark =
    "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10";
  const feedbackButtonLight =
    "border-slate-200 bg-white/85 text-slate-800 hover:bg-white";

  const careerDeepHref = (id: CareerSuggestion["id"]) => `/main/career/${id}`;
  const isRecommendations = activeArea.id === "career";

  // ✅ per-recommendation “pop” accents (not just same gray card)
  const recAccents = [
    {
      rail: "from-sky-300 via-cyan-300 to-indigo-300",
      chip: "bg-sky-300/15 text-sky-100 border-sky-200/20",
      cta: "bg-sky-300 text-slate-950 hover:bg-sky-200 shadow-sky-300/25",
      halo: "from-sky-500/18 via-cyan-400/10 to-indigo-500/10",
    },
    {
      rail: "from-emerald-300 via-teal-300 to-sky-300",
      chip: "bg-emerald-300/15 text-emerald-100 border-emerald-200/20",
      cta: "bg-emerald-300 text-slate-950 hover:bg-emerald-200 shadow-emerald-300/25",
      halo: "from-emerald-500/16 via-teal-400/10 to-sky-500/10",
    },
    {
      rail: "from-amber-300 via-orange-300 to-rose-300",
      chip: "bg-amber-300/15 text-amber-100 border-amber-200/20",
      cta: "bg-amber-300 text-slate-950 hover:bg-amber-200 shadow-amber-300/25",
      halo: "from-amber-500/16 via-orange-400/10 to-rose-500/10",
    },
    {
      rail: "from-violet-300 via-fuchsia-300 to-sky-300",
      chip: "bg-violet-300/15 text-violet-100 border-violet-200/20",
      cta: "bg-violet-300 text-slate-950 hover:bg-violet-200 shadow-violet-300/25",
      halo: "from-violet-500/16 via-fuchsia-400/10 to-sky-500/10",
    },
  ] as const;

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="youmap_orb"
      ambientCap={0.35}
    >
      <div className="relative flex min-h-[100svh] flex-col">
        <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-24 pt-5 md:px-8 md:pt-7">
          {/* calm top row (micro-pop) */}
          <div className="relative mb-5 flex flex-col gap-3">
            <div
              aria-hidden
              className={`pointer-events-none absolute left-0 top-1 h-10 w-[3px] rounded-full ${chipAccentBar} opacity-60`}
            />

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={sectionLabelClass}>Insights</span>
                <span
                  className={`h-1 w-1 rounded-full ${dark ? "bg-white/20" : "bg-slate-300"}`}
                />
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                    dark
                      ? "border-white/10 bg-white/5 text-slate-100"
                      : "border-slate-200 bg-white/80 text-slate-800"
                  }`}
                >
                  <span className={`mr-2 h-2 w-2 rounded-full ${chipAccentBar}`} />
                  {activeArea.label}
                </span>
              </div>
            </div>

            {/* area chips (add per-chip dot color so row isn’t “all same”) */}
            <div className="mt-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-stretch gap-2 pr-2">
                {areas.map((area, idx) => {
                  const active = idx === activeIndex;
                  const dot = `bg-gradient-to-br ${area.glowClass}`;
                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => goToArea(idx)}
                      className={`relative inline-flex shrink-0 flex-col items-start gap-0.5 rounded-2xl border px-4 py-2.5 text-left transition ${
                        active ? areaChipActive : areaChipBase
                      }`}
                    >
                      {active && (
                        <span
                          aria-hidden
                          className={`absolute left-1 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b ${area.glowClass}`}
                        />
                      )}

                      <span className="flex items-center gap-2 text-sm font-semibold leading-tight">
                        <span className={`h-2.5 w-2.5 rounded-full ${dot} opacity-90`} />
                        {area.label}
                      </span>
                      <span className={`text-xs leading-tight ${microText}`}>
                        {area.chip}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =========================
             RECOMMENDATIONS LANE
             ========================= */}
          {isRecommendations ? (
            <section className="mb-5">
              <div
                className={`relative overflow-hidden rounded-[32px] border px-5 py-5 sm:px-7 sm:py-6 ${surface}`}
              >
                <div className="pointer-events-none absolute inset-0">
                  <div className={`absolute -top-10 -left-10 h-56 w-56 rounded-full blur-3xl opacity-25 ${accentGlow}`} />
                  <div className={`absolute -bottom-16 -right-10 h-64 w-64 rounded-full blur-3xl opacity-20 ${accentGlow}`} />
                </div>

                <div className="relative">
                  <div className={sectionLabelClass}>Recommendations</div>
                  <div className="mt-2 max-w-2xl">
                    <div className={`text-lg font-semibold ${dark ? "text-slate-50" : "text-slate-900"}`}>
                      4 Everleap recommendations for you
                    </div>
                    <div className={`mt-1 text-sm ${pageTextMutedClass}`}>
                      Not a forever decision. Pick one lane, run a tiny test, then adjust.
                    </div>
                  </div>

                  {activeArea.careerSuggestions?.length ? (
                    <div className="mt-5 space-y-3">
                      {activeArea.careerSuggestions.slice(0, 4).map((c, idx) => {
                        const a = recAccents[idx] ?? recAccents[0];
                        return (
                          <div
                            key={c.id}
                            className={`
                              relative overflow-hidden rounded-3xl border p-[1px]
                              ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"}
                            `}
                          >
                            {/* inner halo for color pop */}
                            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${a.halo}`} />

                            {/* rail */}
                            <div
                              aria-hidden
                              className={`pointer-events-none absolute left-0 top-4 h-[70%] w-[3px] rounded-full bg-gradient-to-b ${a.rail} opacity-90`}
                            />

                            <div
                              className={`relative rounded-3xl px-5 py-4 ${
                                dark ? "bg-slate-950/35" : "bg-white/70"
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold ${
                                      dark
                                        ? `border-white/10 ${a.chip}`
                                        : "border-slate-200 bg-white text-slate-800"
                                    }`}
                                  >
                                    #{idx + 1}
                                  </span>
                                  <div className={`text-base font-semibold ${dark ? "text-slate-50" : "text-slate-900"}`}>
                                    {c.title}
                                  </div>
                                </div>

                                <div className={`mt-2 text-sm ${pageTextMutedClass}`}>
                                  {c.why}
                                </div>

                                <div className={`mt-2 text-xs ${dark ? "text-slate-300/70" : "text-slate-600/80"}`}>
                                  <span className="font-semibold">Best if:</span> {c.bestFor}
                                </div>

                                <div className={`mt-3 text-xs ${dark ? "text-slate-200/80" : "text-slate-700"}`}>
                                  <span className="font-semibold">3-day test:</span> {c.starterExperiment}
                                </div>
                              </div>

                              {/* CTAs: Details is PRIMARY now */}
                              <div className="mt-4 flex flex-wrap items-center gap-2">
                                <Link
                                  href={careerDeepHref(c.id)}
                                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-lg transition active:scale-95 ${
                                    dark
                                      ? `${a.cta} shadow-[0_12px_34px_rgba(0,0,0,0.35)]`
                                      : "bg-sky-600 text-white hover:bg-sky-500"
                                  }`}
                                >
                                  Dive deeper <ArrowRight className="h-4 w-4" />
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => openRecommendationGuide(c)}
                                  className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                                    dark
                                      ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                                      : "border-slate-200 bg-white/85 text-slate-800 hover:bg-white"
                                  }`}
                                >
                                  Try this
                                </button>

                                <button
                                  type="button"
                                  onClick={() => openGuide("somewhat", "page")}
                                  className={`ml-auto text-xs font-semibold ${
                                    dark ? "text-slate-200/70 hover:text-slate-50" : "text-slate-700/70 hover:text-slate-900"
                                  }`}
                                  title="Tell Everleap what to change about these picks"
                                >
                                  React to these
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}

                  <div className="mt-6">
                    <div className={`mb-2 text-xs font-semibold uppercase tracking-[0.18em] ${microText}`}>
                      Quick check
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openGuide("mostly", "page")}
                        className={`${feedbackButtonBase} ${dark ? feedbackButtonDark : feedbackButtonLight}`}
                      >
                        👍 These fit
                      </button>
                      <button
                        type="button"
                        onClick={() => openGuide("somewhat", "page")}
                        className={`${feedbackButtonBase} ${dark ? feedbackButtonDark : feedbackButtonLight}`}
                      >
                        😐 Kinda
                      </button>
                      <button
                        type="button"
                        onClick={() => openGuide("nope", "page")}
                        className={`${feedbackButtonBase} ${dark ? feedbackButtonDark : feedbackButtonLight}`}
                      >
                        👎 Nope
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={() => setRecContextOpen((o) => !o)}
                      className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                        dark
                          ? "border-slate-800/80 bg-slate-950/40 text-slate-200 hover:bg-slate-950/70"
                          : "border-slate-200 bg-white/80 text-slate-700 hover:bg-white"
                      }`}
                      aria-expanded={recContextOpen}
                    >
                      More context
                      <ChevronDown className={`h-4 w-4 transition-transform ${recContextOpen ? "rotate-180" : ""}`} />
                    </button>

                    <button
                      type="button"
                      onClick={openDeepDive}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-300/35 transition hover:bg-amber-200 active:scale-95"
                    >
                      Go deeper <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  {recContextOpen ? (
                    <div className="mt-4 space-y-4">
                      <div
                        className={`rounded-2xl border px-4 py-3 text-sm ${
                          dark ? "border-slate-800/80 bg-slate-950/60 text-slate-200/90" : "border-slate-200 bg-white/80 text-slate-700"
                        }`}
                      >
                        <div className="font-semibold">What I’m noticing</div>
                        <div className={`mt-2 ${pageTextMutedClass}`}>
                          <span className={dark ? "text-slate-100" : "text-slate-900"}>{activeArea.summary}</span>
                        </div>
                        <div className={`mt-2 ${pageTextMutedClass}`}>{activeArea.hint}</div>
                        <div className={`mt-3 whitespace-pre-wrap ${pageTextMutedClass}`}>{activeArea.coachRead}</div>
                      </div>

                      <div>
                        <div className={`mb-2 text-xs font-semibold uppercase tracking-[0.18em] ${microText}`}>
                          Signals I’m picking up
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {topSignals.map((sig) => (
                            <span
                              key={sig}
                              className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs ${
                                dark ? "border-white/10 bg-white/5 text-slate-100" : "border-slate-200 bg-white/80 text-slate-800"
                              }`}
                            >
                              {sig}
                            </span>
                          ))}
                          {extraSignals > 0 ? (
                            <span
                              className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs opacity-85 ${
                                dark ? "border-white/10 bg-white/5 text-slate-100" : "border-slate-200 bg-white/80 text-slate-800"
                              }`}
                            >
                              +{extraSignals} more
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => setWhyOpen((o) => !o)}
                          className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                            dark
                              ? "border-slate-800/80 bg-slate-950/40 text-slate-200 hover:bg-slate-950/70"
                              : "border-slate-200 bg-white/80 text-slate-700 hover:bg-white"
                          }`}
                          aria-expanded={whyOpen}
                        >
                          What I’m basing this on
                          <ChevronDown className={`h-4 w-4 transition-transform ${whyOpen ? "rotate-180" : ""}`} />
                        </button>

                        {whyOpen ? (
                          <div
                            className={`relative mt-3 rounded-2xl border px-4 py-3 text-sm ${
                              dark
                                ? "border-slate-800/80 bg-slate-950/60 text-slate-200/90"
                                : "border-slate-200 bg-white/80 text-slate-700"
                            }`}
                          >
                            {activeArea.about}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          ) : (
            // Other lanes unchanged (kept as-is)
            <></>
          )}
        </main>

        <BottomNav />

        {/* =========================
            GO DEEPER MODAL / SHEET
           ========================= */}
        {deepOpen ? (
          <div className="fixed inset-0 z-[60]">
            <button
              type="button"
              onClick={closeDeepDive}
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
              aria-label="Close"
            />

            <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl md:inset-0 md:flex md:items-center md:justify-center">
              <div
                className="
                  relative w-full
                  rounded-t-[28px] border border-white/10 bg-slate-950/80
                  shadow-[0_45px_140px_rgba(0,0,0,0.65)] backdrop-blur-2xl
                  md:rounded-[28px] md:max-h-[82vh]
                "
                role="dialog"
                aria-modal="true"
                aria-label={activeArea.deepDive.title}
              >
                <div className="sticky top-0 z-10 rounded-t-[28px] border-b border-white/10 bg-slate-950/75 px-5 py-4 backdrop-blur-2xl md:rounded-t-[28px]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/70">
                        Go deeper
                      </div>
                      <div className="mt-1 text-lg font-semibold text-slate-50">
                        {activeArea.deepDive.title}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-300/70">Accurate?</span>
                        <button
                          type="button"
                          onClick={() => openGuide("mostly", "deep")}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100 hover:bg-white/10"
                        >
                          👍 Mostly
                        </button>
                        <button
                          type="button"
                          onClick={() => openGuide("somewhat", "deep")}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100 hover:bg-white/10"
                        >
                          😐 Somewhat
                        </button>
                        <button
                          type="button"
                          onClick={() => openGuide("nope", "deep")}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100 hover:bg-white/10"
                        >
                          👎 Not really
                        </button>
                      </div>

                      {activeArea.id === "career" && activeArea.careerSuggestions?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {activeArea.careerSuggestions.slice(0, 4).map((c) => (
                            <Link
                              key={c.id}
                              href={careerDeepHref(c.id)}
                              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100 hover:bg-white/10"
                            >
                              {c.id.toUpperCase()} <ArrowRight className="h-3 w-3" />
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <button
                      ref={deepCloseBtnRef}
                      type="button"
                      onClick={closeDeepDive}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 active:scale-95"
                      aria-label="Close modal"
                      title="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-[72vh] overflow-y-auto px-5 pb-6 pt-4 md:max-h-[72vh]">
                  <div className="space-y-6">
                    {activeArea.deepDive.sections.map((s) => (
                      <section key={s.h} className="space-y-2">
                        <div className="text-sm font-semibold text-slate-50">{s.h}</div>
                        <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200/85">
                          {s.p}
                        </div>
                      </section>
                    ))}

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={closeDeepDive}
                        className="inline-flex w-full items-center justify-center rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-300/40 hover:bg-amber-200 active:scale-[0.99]"
                      >
                        Got it
                      </button>
                    </div>
                  </div>
                </div>

                <div className="h-3 md:hidden" />
              </div>
            </div>
          </div>
        ) : null}

        {/* =========================
            GUIDE FEEDBACK MODAL
           ========================= */}
        {guideOpen ? (
          <div className="fixed inset-0 z-[70]">
            <button
              type="button"
              onClick={closeGuide}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              aria-label="Close"
            />

            <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl md:inset-0 md:flex md:items-center md:justify-center">
              <div
                className="
                  relative w-full
                  rounded-t-[28px] border border-white/10 bg-slate-950/85
                  shadow-[0_45px_140px_rgba(0,0,0,0.72)] backdrop-blur-2xl
                  md:rounded-[28px] md:max-h-[82vh]
                "
                role="dialog"
                aria-modal="true"
                aria-label="Everleap Guide"
              >
                <div className="sticky top-0 z-10 rounded-t-[28px] border-b border-white/10 bg-slate-950/80 px-5 py-4 backdrop-blur-2xl md:rounded-t-[28px]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/70">
                        Guide
                      </div>
                      <div className="mt-1 text-lg font-semibold text-slate-50">
                        Calibration
                      </div>
                      {guideCtx ? (
                        <div className="mt-1 text-sm text-slate-300/85">
                          {guideCtx.areaLabel}
                          {guideCtx.source === "recommendation_pick"
                            ? " • picked a lane"
                            : ` • ${labelForRating(guideCtx.rating)}`}
                        </div>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={closeGuide}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 active:scale-95"
                      aria-label="Close"
                      title="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-[58vh] overflow-y-auto px-5 pb-4 pt-4 md:max-h-[58vh]">
                  <div className="space-y-3">
                    {guideMsgs.map((m, i) => {
                      const isGuide = m.role === "guide";
                      return (
                        <div key={i} className={`flex ${isGuide ? "justify-start" : "justify-end"}`}>
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                              isGuide
                                ? "border border-white/10 bg-white/5 text-slate-100"
                                : "bg-sky-300 text-slate-950"
                            }`}
                          >
                            {m.text.split(/\*\*(.*?)\*\*/g).map((chunk, idx) =>
                              idx % 2 === 1 ? (
                                <strong key={idx}>{chunk}</strong>
                              ) : (
                                <span key={idx}>{chunk}</span>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-white/10 bg-slate-950/70 px-5 py-4">
                  <div className="flex items-end gap-3">
                    <textarea
                      ref={guideInputRef}
                      value={guideDraft}
                      onChange={(e) => setGuideDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          submitGuide();
                        }
                      }}
                      rows={2}
                      placeholder="Tell me what you’re thinking…"
                      className="min-h-[52px] flex-1 resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-400/70"
                    />

                    <button
                      type="button"
                      onClick={submitGuide}
                      disabled={!guideDraft.trim()}
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition active:scale-95 ${
                        guideDraft.trim()
                          ? "bg-sky-300 text-slate-950 shadow-[0_10px_30px_rgba(56,189,248,0.35)] hover:bg-sky-200"
                          : "bg-white/10 text-slate-200/50"
                      }`}
                      aria-label="Send"
                      title="Send"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-2 text-xs text-slate-300/50">
                    Placeholder guide flow for now (no AI API yet). Your responses can be stored later for learning.
                  </div>
                </div>

                <div className="h-3 md:hidden" />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AppChrome>
  );
}
