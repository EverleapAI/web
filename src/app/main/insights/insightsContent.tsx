// src/app/main/insights/insightsContent.tsx
import type { ReactNode } from "react";

/* ============================================================
   Insights content (DATA ONLY)
   NOTE: Recommendations / career area removed from Insights
   ============================================================ */

/* ========= Data types ========= */

export type InsightLayout =
  | "narrative" // story-first (coachRead leads)
  | "split" // editorial split: story left, tiles right
  | "steps" // nextMoves lead as a mini plan
  | "signalsHero" // signals lead, then interpretation
  | "grid"; // tiles lead, story becomes secondary

export type InsightTone =
  | "warm"
  | "direct"
  | "analytical"
  | "reflective"
  | "playful";

export type TraitCardVariant =
  | "micro" // short, punchy
  | "quote" // quote-led
  | "contrast" // love/hate or do/don’t
  | "checklist" // bullets
  | "story" // tiny narrative
  | "warning" // watchout
  | "exercise"; // prompt/action

export type TraitCard = {
  id: string;
  title: string;

  /** Small headline / subcopy */
  short: string;

  /** Longer explanation (optional) */
  long?: string;

  /** Emoji string (kept compatible with existing UI) */
  icon?: string;

  /** optional rendering hints */
  variant?: TraitCardVariant;
  bullets?: string[];
  quote?: string;
  prompt?: string;
  contrast?: { do: string; avoid: string };
};

export type NextMove = {
  id: string;
  title: string;
  blurb: string;

  /** helps the “steps” layout feel more different */
  timebox?: string;
  difficulty?: "easy" | "medium" | "spicy";
};

export type DeepDiveSection = { h: string; p: string };

export type DeepDive = {
  title: string;
  sections: DeepDiveSection[];
};

export type YouMapAreaId =
  | "motivations"
  | "strengths"
  | "skills"
  | "doppelganger"
  | "friends"
  | "family";

export type YouMapArea = {
  id: YouMapAreaId;
  label: string;
  chip: string;
  icon: ReactNode;
  glowClass: string;

  layout?: InsightLayout;
  tone?: InsightTone;

  summary: string;
  hint: string;
  coachRead: string;
  signals: string[];
  about: string;

  nextMoves: NextMove[];
  deepDive: DeepDive;

  /** “Tiles” for each lane */
  cards: TraitCard[];
};

/* ============================================================
   Content (ORDER LOCKED)
   - Motivations
   - Strengths
   - Skills
   - Historical Doppelgänger
   - Friends
   - Family
   ============================================================ */

export const INSIGHTS_AREAS: YouMapArea[] = [
  /* =========================
     Motivations
     ========================= */
  {
    id: "motivations",
    label: "Motivations",
    chip: "What drives you",
    icon: <span aria-hidden>🔥</span>,
    glowClass: "from-amber-400 via-orange-500 to-rose-500",
    layout: "narrative",
    tone: "direct",
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
      {
        id: "cut-busywork",
        title: "Delete one fake task",
        blurb: "Pick one thing you’re doing for appearances and drop it.",
        timebox: "10 min",
        difficulty: "easy",
      },
      {
        id: "make-real",
        title: "Make a task real",
        blurb: "Attach one person, one outcome, or one deadline to it.",
        timebox: "15 min",
        difficulty: "easy",
      },
      {
        id: "tiny-win",
        title: "Create a visible win",
        blurb: "Define what “done” looks like in one sentence.",
        timebox: "8 min",
        difficulty: "easy",
      },
    ],
    deepDive: {
      title: "My read so far • Motivations",
      sections: [
        {
          h: "The claim",
          p: "You are meaning-and-momentum wired. Your motivation doesn’t respond to generic pressure—it responds to purpose + progress.",
        },
        {
          h: "What you do when it’s working",
          p:
            "When something matters, you get locked in. You move fast. You’ll even tolerate discomfort because the effort feels connected to something real.\n\n" +
            "You become the person who “suddenly has energy” once the goal makes sense.",
        },
        {
          h: "What you do when it’s not working",
          p:
            "When something feels pointless, you don’t just get bored—you get slippery.\n" +
            "You procrastinate, you drift, you switch tasks, you scroll. It looks like laziness, but it’s actually rejection: your brain refuses low-signal effort.",
        },
        {
          h: "The trap",
          p:
            "The trap is thinking you need more discipline. You don’t.\n" +
            "You need better signal: clearer stakes, clearer purpose, clearer checkpoints.",
        },
        {
          h: "One experiment",
          p:
            "Take one task you’re avoiding. Add a win-condition + a 20-minute start.\n" +
            "If your motivation returns, you didn’t have a discipline problem—you had a meaning problem.",
        },
      ],
    },
    cards: [
      {
        id: "meaning-vs-status",
        title: "Meaning beats status",
        short: "You’ll pick “real” over “impressive.”",
        long: "If something looks good on paper but feels empty, you won’t stay engaged. You’d rather do work that matters than work that impresses strangers.",
        icon: "🎯",
        variant: "quote",
        quote: "If it’s not real, I can’t make myself care.",
      },
      {
        id: "momentum-fuel",
        title: "Momentum is fuel",
        short: "Progress is your dopamine.",
        long: "You don’t need massive rewards. You need movement—evidence the effort is going somewhere.",
        icon: "📈",
        variant: "micro",
      },
      {
        id: "busywork-allergy",
        title: "Busywork allergy",
        short: "Optics-heavy tasks trigger avoidance fast.",
        long: "Your brain treats performative work like a threat: it drains energy and produces resentment. The fix is to attach a real outcome.",
        icon: "🧯",
        variant: "warning",
      },
      {
        id: "motivation-switch",
        title: "The switch",
        short: "Purpose + a clear next step flips you on.",
        icon: "🔌",
        variant: "exercise",
        prompt:
          "Rewrite the task you’re avoiding as: “This matters because ___, and the next step is ___.”",
      },
    ],
  },

  /* =========================
     Strengths
     ========================= */
  {
    id: "strengths",
    label: "Strengths",
    chip: "How you naturally show up",
    icon: <span aria-hidden>✨</span>,
    glowClass: "from-violet-500 via-fuchsia-500 to-sky-400",
    layout: "split",
    tone: "analytical",
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
      {
        id: "name-strength",
        title: "Name your unfair advantage",
        blurb: "What do you see that others miss?",
        timebox: "5 min",
        difficulty: "easy",
      },
      {
        id: "pressure-move",
        title: "Spot your pressure move",
        blurb: "Under stress: do you organize, act, calm, or withdraw?",
        timebox: "7 min",
        difficulty: "easy",
      },
      {
        id: "make-visible",
        title: "Make it visible",
        blurb: "Turn one strength into an artifact others can see.",
        timebox: "20 min",
        difficulty: "medium",
      },
    ],
    deepDive: {
      title: "My read so far • Strengths",
      sections: [
        {
          h: "The claim",
          p: "Your strength is sense-making: you spot patterns, signal, and “what matters” faster than most people.",
        },
        {
          h: "How it shows up",
          p:
            "You can walk into a messy situation and feel the real problem.\n" +
            "You’ll often know the answer before you can explain how you know it.",
        },
        {
          h: "When it backfires",
          p:
            "You may get impatient with slow, vague, or performative environments.\n" +
            "You might also underestimate yourself because what you do feels obvious to you.",
        },
        {
          h: "What you need",
          p:
            "You need environments that reward clarity and honesty.\n" +
            "If you’re forced into fake consensus or constant ambiguity, you’ll get drained.",
        },
        {
          h: "One experiment",
          p:
            "Ask 2 people: “What do I make look easy?”\n" +
            "The overlap is your real strength—especially if you didn’t think it counted.",
        },
      ],
    },
    cards: [
      {
        id: "sensemaking",
        title: "Sense-making",
        short: "You separate signal from noise quickly.",
        long: "This is the kind of strength that makes you valuable in leadership, product thinking, strategy, and any role where the problem isn’t obvious.",
        icon: "🧠",
        variant: "checklist",
        bullets: [
          "Spot the real constraint",
          "Name the decision",
          "Propose the smallest next step",
        ],
      },
      {
        id: "people-reading",
        title: "People-reading",
        short: "You feel subtext faster than most.",
        long: "You notice what isn’t being said: incentives, status games, discomfort. That lets you steer situations away from nonsense.",
        icon: "🕵️",
        variant: "story",
      },
      {
        id: "impatience",
        title: "The impatience edge",
        short: "You get annoyed when things are fake or slow.",
        long: "That annoyance is data: it tells you what environments don’t fit your wiring. Use it as a compass, not a personality flaw.",
        icon: "⚡",
        variant: "warning",
      },
      {
        id: "strength-translation",
        title: "Explain it simply",
        short: "Your strength becomes power when others can use it.",
        icon: "🧾",
        variant: "exercise",
        prompt:
          "Take one insight you have. Write it as a 1-line decision + 1-line next step.",
      },
    ],
  },

  /* =========================
     Skills
     ========================= */
  {
    id: "skills",
    label: "Skills",
    chip: "What you can already do",
    icon: <span aria-hidden>🛠️</span>,
    glowClass: "from-cyan-400 via-sky-500 to-indigo-500",
    layout: "steps",
    tone: "direct",
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
      {
        id: "ship-30",
        title: "Ship a 30-minute proof",
        blurb: "One tiny artifact beats a week of notes.",
        timebox: "30 min",
        difficulty: "easy",
      },
      {
        id: "feedback-1",
        title: "Get one piece of feedback",
        blurb: "Show it to one human. Ask: “What’s one upgrade?”",
        timebox: "10 min",
        difficulty: "easy",
      },
      {
        id: "stack-2",
        title: "Stack 2 skills",
        blurb: "Pair what you know with one new tool and build.",
        timebox: "45 min",
        difficulty: "medium",
      },
    ],
    deepDive: {
      title: "My read so far • Skills",
      sections: [
        {
          h: "The claim",
          p: "Your fastest path is build → show → refine. You don’t need more information—you need more artifacts.",
        },
        {
          h: "Where you win",
          p:
            "You’re likely good at picking up tools when there’s a purpose.\n" +
            "You learn the fastest when the output is visible and the feedback is real.",
        },
        {
          h: "Where you get stuck",
          p:
            "Your trap is “infinite prep”: researching until you feel ready.\n" +
            "That feels productive but it doesn’t create confidence.",
        },
        {
          h: "What to do instead",
          p:
            "Make tiny proofs.\n" +
            "Proofs create clarity. Clarity creates motivation. Motivation creates skill.",
        },
        {
          h: "One experiment",
          p:
            "Pick one skill. Build something small in 30 minutes.\n" +
            "If you feel more confident after, you’re a builder-learner (not a study-learner).",
        },
      ],
    },
    cards: [
      {
        id: "artifact-mindset",
        title: "Artifact mindset",
        short: "Your best learning looks like output, not input.",
        long: "Notes don’t change your life. Artifacts do: drafts, prototypes, demos, projects, posts, small wins you can point to.",
        icon: "📦",
        variant: "contrast",
        contrast: {
          do: "Build a tiny thing today.",
          avoid: "Consume more info as a substitute for action.",
        },
      },
      {
        id: "feedback-loop",
        title: "Feedback loop",
        short: "You improve fast when someone reacts to your work.",
        long: "If you want rapid growth, pick environments with coaching, critique, or real users.",
        icon: "🗣️",
        variant: "quote",
        quote: "Show it to a human. Then you’ll know what to do next.",
      },
      {
        id: "research-trap",
        title: "Research trap",
        short: "Research can quietly become avoidance.",
        icon: "🕳️",
        variant: "warning",
      },
      {
        id: "skill-stack",
        title: "Skill stacking",
        short: "Two medium skills combined can beat one ‘genius’ skill.",
        icon: "🧱",
        variant: "checklist",
        bullets: ["Pick a domain", "Pick a tool", "Ship one artifact", "Repeat weekly"],
      },
    ],
  },

  /* =========================
     Historical Doppelgänger (FUN / NARRATIVE / POP)
     ========================= */
  {
    id: "doppelganger",
    label: "Historical Doppelgänger",
    chip: "Your vibe twin (weirdly accurate)",
    icon: <span aria-hidden>🕰️</span>,
    glowClass: "from-fuchsia-500 via-amber-400 to-cyan-400",
    layout: "narrative",
    tone: "playful",
    summary:
      "Surprise: your “builder brain + systems energy” maps onto an iconic inventor vibe.",
    hint: "Not destiny. Just a fun (and slightly aggressive) pattern match.",
    coachRead:
      "Ok—this one is meant to be fun. But it’s also a real signal.\n\n" +
      "Some people love planning forever. Your pattern is different: you want output you can touch, progress you can see, and systems that actually work.\n\n" +
      "That’s why Everleap’s current historical alignment for you is **Rudolf Diesel**: industrial-era builder energy, technical thinking, and the kind of stubborn “make it real” drive that doesn’t care about looking impressive—only *being effective*.",
    signals: [
      "Builder energy",
      "Systems thinker",
      "Project momentum",
      "Technical + practical",
      "Impact > optics",
    ],
    about:
      "This is a playful synthesis card. It’s not claiming you *are* this person—only that certain patterns match: how you approach work, pressure, and progress.",
    nextMoves: [
      {
        id: "explore",
        title: "Explore the story",
        blurb:
          "Read 3 minutes about Diesel’s work—then notice what you admire (or dislike).",
        timebox: "3 min",
        difficulty: "easy",
      },
      {
        id: "artifact",
        title: "Make one tiny artifact",
        blurb: "Sketch a system/tool that removes one annoying friction in your week.",
        timebox: "10 min",
        difficulty: "easy",
      },
      {
        id: "translate",
        title: "Translate it to you",
        blurb: "Write 1 sentence: “My life’s work feels complete when ___ exists.”",
        timebox: "5 min",
        difficulty: "easy",
      },
    ],
    deepDive: {
      title: "Historical Figure Alignment • Rudolf Diesel",
      sections: [
        {
          h: "The reveal",
          p:
            "Your current Everleap alignment is **Rudolf Diesel** — born in Paris in 1858, later moving to Germany during a time of rapid industrial innovation.\n\n" +
            "This era rewarded people who could turn messy constraints into working systems.",
        },
        {
          h: "What you have in common (the pattern match)",
          p:
            "Like you, Diesel was known for strong organizational skills and managing complex technical work.\n" +
            "He was skilled in technical + analytical areas, and adaptable in changing environments.\n\n" +
            "Translation: not just “smart”—*effective.*",
        },
        {
          h: "The quote (because it’s absurdly on-brand)",
          p:
            "“The automobile engine will come, and then I will consider my life’s work complete.”\n\n" +
            "Translation: *I’ll relax when the thing actually exists.*",
        },
        {
          h: "Your mini-challenge (fun + useful)",
          p:
            "If you lived in 1898, what would you build to save people time or effort?\n\n" +
            "Now bring it to 2026:\n" +
            "Pick ONE friction in your week and design a tiny system to reduce it by 20%.",
        },
        {
          h: "Explore more",
          p:
            "Search “Rudolf Diesel invention” and skim for 3 minutes.\n" +
            "Then answer:\n" +
            "• What do you admire?\n" +
            "• What feels like your style?\n" +
            "• What would you never do that way?",
        },
      ],
    },
    cards: [
      {
        id: "hero-reveal",
        title: "Historical Figure Alignment: Rudolf Diesel",
        short: "Inventor. Systems thinker. Builder energy.",
        long:
          "Born in Paris (1858) → later Germany. Peak industrial innovation. Everything is loud, mechanical, and changing fast.",
        icon: "⚙️",
        variant: "story",
      },
      {
        id: "overlap",
        title: "Why this match is weirdly accurate",
        short: "Your pattern: organize chaos → build a working system.",
        icon: "🧠",
        variant: "checklist",
        bullets: [
          "Strong organizational skill (projects, moving parts)",
          "Technical + analytical thinking",
          "Adaptable under shifting constraints",
          "Build > talk",
          "Impact you can measure",
        ],
      },
      {
        id: "diesel-quote",
        title: "Famous quote",
        short: "The most “builder brain” sentence ever written.",
        icon: "🕰️",
        variant: "quote",
        quote:
          "“The automobile engine will come, and then I will consider my life’s work complete.”",
      },
      {
        id: "playful-prompt",
        title: "If you lived then…",
        short: "What would you build in the industrial era?",
        icon: "🎭",
        variant: "exercise",
        prompt:
          "10-minute challenge: sketch a tool/process/system that removes 1 annoying friction in your week.",
      },
    ],
  },

  /* =========================
     Friends
     ========================= */
  {
    id: "friends",
    label: "Friends",
    chip: "Your people patterns",
    icon: <span aria-hidden>🧑‍🤝‍👩</span>,
    glowClass: "from-emerald-400 via-teal-400 to-sky-400",
    layout: "signalsHero",
    tone: "reflective",
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
      {
        id: "energy-people",
        title: "Name 2 ‘energy people’",
        blurb: "Who leaves you feeling clearer after you talk?",
        timebox: "5 min",
        difficulty: "easy",
      },
      {
        id: "drain",
        title: "Name 1 drain dynamic",
        blurb: "What kind of interaction makes you shrink?",
        timebox: "6 min",
        difficulty: "easy",
      },
      {
        id: "real-text",
        title: "Send one real text",
        blurb: "One honest message beats 10 memes.",
        timebox: "2 min",
        difficulty: "easy",
      },
    ],
    deepDive: {
      title: "My read so far • Friends",
      sections: [
        {
          h: "The claim",
          p: "You thrive on real connection, not constant connection.",
        },
        {
          h: "How it shows up",
          p:
            "You’re probably the person who notices the mood of a room.\n" +
            "You can feel when something is off—even if nobody says it.",
        },
        {
          h: "Your best people",
          p:
            "People who are:\n" +
            "• honest\n" +
            "• calm\n" +
            "• supportive without being clingy\n" +
            "• not performative",
        },
        {
          h: "Your worst people",
          p:
            "People who are:\n" +
            "• status-obsessed\n" +
            "• dramatic\n" +
            "• constantly testing loyalty\n" +
            "• fake-nice",
        },
        {
          h: "One experiment",
          p:
            "After you hang out with someone, rate your energy 1–10.\n" +
            "Do this 5 times. Your pattern will show up fast.",
        },
      ],
    },
    cards: [
      {
        id: "depth-over-noise",
        title: "Depth over noise",
        short: "You don’t need a crowd. You need real.",
        long: "Your confidence rises when you’re around people who are authentic. Noise drains you faster than solitude.",
        icon: "🌊",
        variant: "quote",
        quote: "One real friend beats ten acquaintances.",
      },
      {
        id: "vibe-sensor",
        title: "Vibe sensor",
        short: "You’re a social signal detector.",
        long: "That sensitivity is a superpower if you use it to choose environments instead of just enduring them.",
        icon: "📡",
        variant: "micro",
      },
      {
        id: "group-fit",
        title: "Group fit matters",
        short: "Your energy depends on the room’s honesty level.",
        icon: "🏛️",
        variant: "contrast",
        contrast: {
          do: "Choose rooms with directness + kindness.",
          avoid: "Rooms that reward performance + politics.",
        },
      },
      {
        id: "friend-filter",
        title: "Your friend filter",
        short: "Calm + honest + not needy = your sweet spot.",
        icon: "🧪",
        variant: "checklist",
        bullets: ["Direct without drama", "Warm without pressure", "Real interests", "Mutual respect"],
      },
    ],
  },

  /* =========================
     Family (keep lighter / less busy)
     ========================= */
  {
    id: "family",
    label: "Family",
    chip: "Where you’re coming from",
    icon: <span aria-hidden>🏠</span>,
    glowClass: "from-rose-400 via-amber-400 to-fuchsia-500",
    layout: "grid",
    tone: "warm",
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
      {
        id: "rule",
        title: "Name one invisible rule",
        blurb: "What did ‘being good’ mean in your house?",
        timebox: "7 min",
        difficulty: "easy",
      },
      {
        id: "rewrite",
        title: "Rewrite it",
        blurb: "What rule do you want instead—one that fits you now?",
        timebox: "10 min",
        difficulty: "easy",
      },
      {
        id: "ease",
        title: "Practice ease once",
        blurb: "Do one thing without earning it first.",
        timebox: "15 min",
        difficulty: "medium",
      },
    ],
    deepDive: {
      title: "My read so far • Family",
      sections: [
        { h: "The claim", p: "You inherited rules. Now you get to edit them." },
        {
          h: "What I’m noticing",
          p:
            "You may feel responsible even when nobody asked you to.\n" +
            "You may chase approval quietly—or reject it loudly.\n\n" +
            "Either way, the pattern is: pressure shows up fast in your nervous system.",
        },
        {
          h: "The edge",
          p:
            "Your edge is maturity: you can handle real things.\n" +
            "The downside is you can treat rest like something you must earn.",
        },
        {
          h: "One experiment",
          p:
            "Write two sentences:\n" +
            "1) “In my family, success meant ____.”\n" +
            "2) “For me, success means ____.”\n\n" +
            "If those differ, you’ve found a pressure source.",
        },
      ],
    },
    cards: [
      {
        id: "earned-rest",
        title: "Earned rest",
        short: "You might treat rest like a reward, not a need.",
        long: "If that’s true, you’ll burn out in high-pressure environments unless you build recovery into your identity.",
        icon: "🛟",
        variant: "warning",
      },
      {
        id: "invisible-rules",
        title: "Invisible rules",
        short: "Old rules can keep running even when they don’t fit.",
        icon: "📜",
        variant: "exercise",
        prompt:
          "Complete: “In my family, being ‘good’ meant ___.” Then rewrite it for current-you.",
      },
      {
        id: "self-compassion",
        title: "Talk to yourself kindly",
        short: "Your inner voice sets the baseline of your nervous system.",
        icon: "💛",
        variant: "quote",
        quote: "Talk to yourself like you would to someone you love.",
      },
    ],
  },
];

/* ============================================================
   Cards list for the Insights “index” view
   (kept simple; page.tsx uses these to render vertical cards)
   ============================================================ */

export type InsightCard = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: ReactNode;
  href: string;
  ctaLabel: string;
  bullets?: string[];
};

export const INSIGHTS_CARDS: InsightCard[] = [
  {
    id: "motivations",
    title: "Motivations",
    subtitle: "What drives you",
    description: "Meaning + momentum is the switch. Pointless work shuts you down fast.",
    icon: <span aria-hidden>🔥</span>,
    href: "/main/insights?area=motivations",
    ctaLabel: "Explore motivations",
  },
  {
    id: "strengths",
    title: "Strengths",
    subtitle: "How you naturally show up",
    description: "Sense-making and pattern detection—especially when the stakes are real.",
    icon: <span aria-hidden>✨</span>,
    href: "/main/insights?area=strengths",
    ctaLabel: "See strengths",
  },
  {
    id: "skills",
    title: "Skills",
    subtitle: "What you can already do",
    description: "You learn by building. Output creates confidence.",
    icon: <span aria-hidden>🛠️</span>,
    href: "/main/insights?area=skills",
    ctaLabel: "Explore skills",
  },
  {
    id: "friends",
    title: "Friends",
    subtitle: "Your people patterns",
    description: "You thrive on real connection, not constant connection.",
    icon: <span aria-hidden>🧑‍🤝‍👩</span>,
    href: "/main/insights?area=friends",
    ctaLabel: "Explore friends",
  },
  {
    id: "family",
    title: "Family",
    subtitle: "Where you’re coming from",
    description: "Invisible rules shape your pressure patterns—and you can rewrite them.",
    icon: <span aria-hidden>🏠</span>,
    href: "/main/insights?area=family",
    ctaLabel: "Explore family",
  },
  {
    id: "doppelganger",
    title: "Historical Doppelgänger",
    subtitle: "Your vibe twin (fun)",
    description: "A playful alignment card: builder energy + systems thinking, in historical form.",
    icon: <span aria-hidden>🕰️</span>,
    href: "/main/insights?area=doppelganger",
    ctaLabel: "Meet your match",
    bullets: ["Narrative reveal", "Overlap chips", "Quote + mini challenge"],
  },
];
