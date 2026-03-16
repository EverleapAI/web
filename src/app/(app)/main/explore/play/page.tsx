// apps/web/src/app/(app)/main/explore/play/page.tsx

"use client";

import Link from "next/link";
import * as React from "react";
import {
  ArrowRight,
  Dumbbell,
  Gamepad2,
  Heart,
  Mountain,
  Music4,
  Wrench,
} from "lucide-react";

type Rgb = {
  r: number;
  g: number;
  b: number;
};

type SignalNode = {
  x: number;
  y: number;
  size: number;
  alpha: number;
};

type QuickCheckChoice = "mostly-right" | "somewhat" | "not-really";

type PlayActivity = {
  id: string;
  slug: string;
  theme: {
    accent: Rgb;
    glow?: Rgb;
    surfaceLabel?: string;
  };
  card: {
    title: string;
    hook: string;
    description: string;
  };
  fitSignals: string[];
  insideActivityPreviews?: string[];
};

const LOCAL_PLACE_LABEL = "94901";
const MAX_VISIBLE_PLAY_ACTIVITIES = 4;

const CONSTELLATION_NODES: SignalNode[] = [
  { x: 18, y: 28, size: 8, alpha: 0.95 },
  { x: 68, y: 18, size: 6, alpha: 0.72 },
  { x: 108, y: 50, size: 7, alpha: 0.82 },
  { x: 54, y: 66, size: 5, alpha: 0.66 },
  { x: 26, y: 98, size: 7, alpha: 0.8 },
  { x: 94, y: 96, size: 6, alpha: 0.7 },
];

const CONSTELLATION_LINES = [
  { x1: 18, y1: 28, x2: 68, y2: 18, alpha: 0.34 },
  { x1: 68, y1: 18, x2: 108, y2: 50, alpha: 0.24 },
  { x1: 18, y1: 28, x2: 54, y2: 66, alpha: 0.28 },
  { x1: 54, y1: 66, x2: 108, y2: 50, alpha: 0.22 },
  { x1: 54, y1: 66, x2: 26, y2: 98, alpha: 0.24 },
  { x1: 54, y1: 66, x2: 94, y2: 96, alpha: 0.2 },
];

const EXPLORE_LANES = [
  {
    id: "work",
    label: "Work",
    href: "/main/explore/work",
    active: false,
    dotClass: "bg-cyan-300",
  },
  {
    id: "learning",
    label: "Learning",
    href: "/main/explore/learning",
    active: false,
    dotClass: "bg-violet-300",
  },
  {
    id: "world",
    label: "World",
    href: "/main/explore/world",
    active: false,
    dotClass: "bg-amber-300",
  },
  {
    id: "impact",
    label: "Impact",
    href: "/main/explore/impact",
    active: false,
    dotClass: "bg-emerald-300",
  },
  {
    id: "play",
    label: "Play",
    href: "/main/explore/play",
    active: true,
    dotClass: "bg-pink-300",
  },
] as const;

const QUICK_CHECK_OPTIONS: Array<{
  id: QuickCheckChoice;
  label: string;
  emoji: string;
}> = [
  { id: "mostly-right", label: "Mostly right", emoji: "👍" },
  { id: "somewhat", label: "Somewhat", emoji: "🙂" },
  { id: "not-really", label: "Not really", emoji: "👎" },
];

// IMPORTANT: order matters.
// The first 4 are the visible set, so keep the opening mix broad and inviting.
const PLAY_ACTIVITIES: PlayActivity[] = [
  {
    id: "sports-competition",
    slug: "sports-competition",
    theme: {
      accent: { r: 255, g: 96, b: 139 },
      glow: { r: 230, g: 61, b: 108 },
      surfaceLabel: "Movement + challenge",
    },
    card: {
      title: "Sports + Competition",
      hook: "Train, play, improve, and test yourself in something physical.",
      description:
        "This direction fits people who like movement, challenge, repetition, pressure, progression, team energy, or the feeling of getting sharper through practice.",
    },
    fitSignals: [
      "You may like goals you can train toward and feel in your body.",
      "You seem energized by challenge, progress, or real-time performance.",
      "You may enjoy the structure and momentum that sports create.",
    ],
    insideActivityPreviews: [
      "What this kind of play feels like",
      "Ways to try competition or training",
      `Local places to start near ${LOCAL_PLACE_LABEL}`,
      "How sports can become part of your identity",
    ],
  },
  {
    id: "creative-hobbies",
    slug: "creative-hobbies",
    theme: {
      accent: { r: 255, g: 139, b: 76 },
      glow: { r: 230, g: 101, b: 40 },
      surfaceLabel: "Expression + making for fun",
    },
    card: {
      title: "Creative Hobbies",
      hook: "Make things because it feels good to make them.",
      description:
        "This direction fits people who like drawing, music, photography, video editing, crafting, writing for fun, performance, or any creative outlet that helps them feel more alive.",
    },
    fitSignals: [
      "You may like turning mood, taste, or imagination into something real.",
      "You seem drawn to hobbies that let you express yourself without needing permission.",
      "You may enjoy skill-building that feels playful rather than pressured.",
    ],
    insideActivityPreviews: [
      "What creative play feels like",
      "Hobbies and mediums to explore",
      `Ways to start locally or near ${LOCAL_PLACE_LABEL}`,
      "How fun can turn into real skill",
    ],
  },
  {
    id: "games-strategy",
    slug: "games-strategy",
    theme: {
      accent: { r: 86, g: 191, b: 255 },
      glow: { r: 46, g: 157, b: 232 },
      surfaceLabel: "Systems + play",
    },
    card: {
      title: "Games + Strategy",
      hook: "Play things that reward focus, tactics, adaptation, and smart decisions.",
      description:
        "This direction fits people who like chess, esports, tabletop games, card games, tactical systems, and the kind of play where thinking is part of the fun.",
    },
    fitSignals: [
      "You may enjoy play that rewards timing, systems, and reading what is happening.",
      "You seem drawn to games with depth, not just distraction.",
      "You may like improving through pattern recognition and decision-making.",
    ],
    insideActivityPreviews: [
      "What strategic play feels like",
      "Games and formats to explore",
      `Ways to play locally or near ${LOCAL_PLACE_LABEL}`,
      "How strategy-based play can build real confidence",
    ],
  },
  {
    id: "calm-reset",
    slug: "calm-reset",
    theme: {
      accent: { r: 130, g: 112, b: 255 },
      glow: { r: 97, g: 80, b: 230 },
      surfaceLabel: "Recovery + inner steadiness",
    },
    card: {
      title: "Calm + Reset",
      hook: "Find forms of play that help your mind settle, focus, breathe, and come back to itself.",
      description:
        "This direction fits people who want practices like meditation, journaling, yoga, breathwork, nature walks, or quiet rituals that feel restorative rather than draining.",
    },
    fitSignals: [
      "You may need something that steadies you, not just stimulates you.",
      "You seem open to play that feels peaceful, grounding, or quietly rewarding.",
      "You may like practices that help you reset and feel more like yourself again.",
    ],
    insideActivityPreviews: [
      "What restorative play feels like",
      "Practices that help you reset",
      `Ways to begin locally or near ${LOCAL_PLACE_LABEL}`,
      "How calm can become part of your rhythm",
    ],
  },
  {
    id: "outdoor-adventure",
    slug: "outdoor-adventure",
    theme: {
      accent: { r: 89, g: 212, b: 128 },
      glow: { r: 51, g: 181, b: 92 },
      surfaceLabel: "Nature + motion",
    },
    card: {
      title: "Outdoor + Adventure",
      hook: "Get outside, move through real places, and let the world itself become part of the fun.",
      description:
        "This direction fits people who like hiking, climbing, cycling, surfing, trail time, camping, exploration, or any activity where fresh air and movement matter.",
    },
    fitSignals: [
      "You may feel better when fun includes movement and a change of environment.",
      "You seem drawn to challenge, freedom, and real-world experience.",
      "You may like activities that feel bigger, wilder, or less boxed in.",
    ],
    insideActivityPreviews: [
      "What outdoor play feels like",
      "Activities and skill paths to explore",
      `Outdoor starting points near ${LOCAL_PLACE_LABEL}`,
      "How adventure can become part of your life",
    ],
  },
  {
    id: "making-tinkering",
    slug: "making-tinkering",
    theme: {
      accent: { r: 233, g: 215, b: 84 },
      glow: { r: 205, g: 182, b: 38 },
      surfaceLabel: "Hands-on fun",
    },
    card: {
      title: "Making + Tinkering",
      hook: "Play by building, fixing, experimenting, or making something with your hands.",
      description:
        "This direction fits people who like cooking, robotics, sewing, DIY projects, models, maker builds, tools, experiments, or hobbies where the fun comes from doing.",
    },
    fitSignals: [
      "You may think best when your hands are involved.",
      "You seem drawn to hobbies that produce something visible, useful, or surprising.",
      "You may enjoy figuring things out by trying, adjusting, and making.",
    ],
    insideActivityPreviews: [
      "What hands-on play feels like",
      "Projects and hobbies to explore",
      `Ways to start locally or near ${LOCAL_PLACE_LABEL}`,
      "How making can turn into long-term skill",
    ],
  },
];

function pagePadding() {
  return "pb-24 pt-3";
}

function rgb(value: Rgb, alpha = 1) {
  return `rgba(${value.r}, ${value.g}, ${value.b}, ${alpha})`;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function readStoredFirstName(): string | null {
  if (typeof window === "undefined") return null;

  const candidateKeys = [
    "everleapOnboarding_v4_convo_min",
    "everleap.story.answers.v3",
    "everleap.story.answers.v2",
    "everleap.onboarding.answers",
    "everleap.user.profile",
  ];

  for (const key of candidateKeys) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw) as Record<string, unknown>;

      const candidates = [
        parsed.firstName,
        parsed.firstname,
        parsed.first_name,
        parsed.name,
        asRecord(parsed.profile)?.firstName,
        asRecord(parsed.profile)?.name,
        asRecord(parsed.answers)?.firstName,
        asRecord(parsed.answers)?.name,
      ];

      for (const value of candidates) {
        const found = asString(value);
        if (found) return found.split(" ")[0];
      }
    } catch {}
  }

  return null;
}

function getPlayAgenticOpening(firstName: string | null) {
  if (firstName) {
    return {
      title: `${firstName}, play matters more than people sometimes admit.`,
      bodyA:
        "This is not just about killing time. It is about noticing what kinds of fun make you feel energized, challenged, calm, connected, curious, creative, or more like yourself.",
      bodyB:
        "The goal here is to surface activities you could actually get into — whether that means sports, hobbies, strategy, outdoor adventure, hands-on making, or quieter ways to reset.",
    };
  }

  return {
    title: "Play matters more than people sometimes admit.",
    bodyA:
      "This is not just about killing time. It is about noticing what kinds of fun make you feel energized, challenged, calm, connected, curious, creative, or more like yourself.",
      bodyB:
        "The goal here is to surface activities you could actually get into — whether that means sports, hobbies, strategy, outdoor adventure, hands-on making, or quieter ways to reset.",
  };
}

function extractCardField(
  activity: PlayActivity,
  field: "title" | "hook" | "description"
): string {
  const card = asRecord(activity.card);
  return asString(card?.[field]) ?? "";
}

function pathAccent(activity: PlayActivity): Rgb {
  const theme = asRecord(activity.theme);
  const accent = asRecord(theme?.accent);

  if (
    typeof accent?.r === "number" &&
    typeof accent?.g === "number" &&
    typeof accent?.b === "number"
  ) {
    return { r: accent.r, g: accent.g, b: accent.b };
  }

  return { r: 255, g: 96, b: 139 };
}

function deriveFitSignals(activity: PlayActivity): string[] {
  return activity.fitSignals.slice(0, 3);
}

function deriveInsideActivityPreviews(activity: PlayActivity): string[] {
  if (activity.insideActivityPreviews?.length) {
    return activity.insideActivityPreviews.slice(0, 4);
  }

  return [
    "What this kind of play feels like",
    "Ways to start",
    `Local and online entry points near ${LOCAL_PLACE_LABEL}`,
    "Where this can lead",
  ];
}

function getQuickCheckPrompt(choice: QuickCheckChoice) {
  switch (choice) {
    case "mostly-right":
      return "What part feels fun or energizing?";
    case "somewhat":
      return "What part fits, and what part doesn't?";
    case "not-really":
      return "Give us reasons why — we’ll use that to bring in another activity.";
  }
}

function getQuickCheckSubmitLabel(choice: QuickCheckChoice) {
  switch (choice) {
    case "mostly-right":
      return "Submit";
    case "somewhat":
      return "Submit";
    case "not-really":
      return "Submit and show another";
  }
}

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.19em] text-white/42 sm:text-[12px]">
      {children}
    </p>
  );
}

function ExploreLaneTabs() {
  return (
    <div className="mt-4 flex flex-wrap gap-2.5">
      {EXPLORE_LANES.map((lane) => (
        <Link
          key={lane.id}
          href={lane.href}
          aria-current={lane.active ? "page" : undefined}
          className={[
            "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[14px] font-medium tracking-[-0.01em] transition",
            lane.active
              ? "border-pink-300/30 bg-pink-300/[0.12] text-pink-50 shadow-[0_0_0_1px_rgba(249,168,212,0.06)]"
              : "border-white/12 bg-white/[0.04] text-white/72 hover:bg-white/[0.07]",
          ].join(" ")}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${lane.dotClass}`} />
          <span>{lane.label}</span>
        </Link>
      ))}
    </div>
  );
}

function IntroOrbitArt() {
  return (
    <div className="pointer-events-none absolute right-3 top-3 hidden h-[112px] w-[112px] sm:block">
      <div className="absolute inset-0 rounded-full border border-pink-300/10" />
      <div className="absolute inset-[15px] rounded-full border border-pink-300/11" />
      <div className="absolute left-[16px] top-[20px] h-2.5 w-2.5 rounded-full bg-pink-200/60 shadow-[0_0_16px_rgba(251,207,232,0.5)]" />
      <div className="absolute left-[72px] top-[26px] h-2 w-2 rounded-full bg-white/24" />
      <div className="absolute left-[40px] top-[72px] h-2.5 w-2.5 rounded-full bg-pink-100/70 shadow-[0_0_14px_rgba(252,231,243,0.42)]" />
      <div className="absolute left-[28px] top-[32px] h-px w-[40px] bg-gradient-to-r from-pink-300/26 to-transparent" />
      <div className="absolute left-[48px] top-[43px] h-px w-[24px] rotate-[12deg] bg-gradient-to-r from-pink-300/20 to-transparent" />
      <div className="absolute left-[48px] top-[64px] h-px w-[26px] -rotate-[9deg] bg-gradient-to-r from-pink-300/16 to-transparent" />

      <div className="absolute bottom-[10px] right-[2px] flex h-10 w-10 items-center justify-center rounded-full border border-pink-300/14 bg-pink-300/[0.06] text-pink-100/72">
        <Gamepad2 className="h-4 w-4" />
      </div>
    </div>
  );
}

function PlayIntroPanel({ firstName }: { firstName: string | null }) {
  const opening = getPlayAgenticOpening(firstName);

  return (
    <section className="relative mt-6 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-7 sm:py-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(236,72,153,0.14),transparent_18%),radial-gradient(circle_at_20%_15%,rgba(249,168,212,0.10),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.00)_46%)]" />
      <IntroOrbitArt />

      <div className="relative max-w-4xl pr-0 sm:pr-24">
        <SectionKicker>Play</SectionKicker>

        <h2 className="mt-3 max-w-3xl text-[28px] font-semibold leading-[1.07] tracking-[-0.04em] text-white sm:text-[34px] lg:text-[36px]">
          {opening.title}
        </h2>

        <p className="mt-5 max-w-3xl text-[15px] leading-[1.75] text-white/74 sm:text-[16px]">
          {opening.bodyA}
        </p>

        <p className="mt-4 max-w-3xl text-[15px] leading-[1.75] text-white/78 sm:text-[16px]">
          {opening.bodyB}
        </p>
      </div>
    </section>
  );
}

function SignalConstellation({
  accent,
  mobile = false,
}: {
  accent: Rgb;
  mobile?: boolean;
}) {
  return (
    <div
      className={[
        "pointer-events-none absolute opacity-95",
        mobile
          ? "right-2 top-10 h-[88px] w-[92px] sm:hidden"
          : "right-3 top-8 hidden h-[110px] w-[116px] sm:block",
      ].join(" ")}
    >
      <div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${rgb(
            accent,
            0.18
          )} 0%, ${rgb(accent, 0.05)} 42%, transparent 74%)`,
        }}
      />

      <svg
        viewBox="0 0 128 120"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        {CONSTELLATION_LINES.map((line, index) => (
          <line
            key={`line-${mobile ? "m" : "d"}-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={rgb(accent, mobile ? line.alpha * 0.96 : line.alpha)}
            strokeWidth={mobile ? "1.35" : "1.2"}
            strokeLinecap="round"
          />
        ))}

        {CONSTELLATION_NODES.map((node, index) => (
          <g key={`node-${mobile ? "m" : "d"}-${index}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r={mobile ? node.size + 4 : node.size + 4.5}
              fill={rgb(accent, node.alpha * 0.11)}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={mobile ? node.size * 0.92 : node.size * 0.96}
              fill={rgb(accent, mobile ? node.alpha * 0.98 : node.alpha)}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={mobile ? node.size * 0.26 : node.size * 0.3}
              fill="white"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

function QuickCheckPill({
  choice,
  active,
  accent,
  onClick,
}: {
  choice: { id: QuickCheckChoice; label: string; emoji: string };
  active: boolean;
  accent: Rgb;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[14px] font-medium tracking-[-0.01em] text-white/84 transition hover:bg-white/[0.07]"
      style={{
        borderColor: active ? rgb(accent, 0.3) : "rgba(255,255,255,0.10)",
        backgroundColor: active ? rgb(accent, 0.12) : "rgba(255,255,255,0.035)",
        boxShadow: active ? `0 0 0 1px ${rgb(accent, 0.08)}` : "none",
      }}
    >
      <span className="text-[15px]" aria-hidden="true">
        {choice.emoji}
      </span>
      <span>{choice.label}</span>
    </button>
  );
}

function ActivityGlyph({
  title,
  accent,
}: {
  title: string;
  accent: Rgb;
}) {
  const iconClass = "h-[15px] w-[15px]";

  const sharedStyle = {
    borderColor: rgb(accent, 0.24),
    backgroundColor: rgb(accent, 0.1),
    color: rgb(accent, 0.94),
  };

  if (title.includes("Sports")) {
    return (
      <div
        className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={sharedStyle}
      >
        <Dumbbell className={`${iconClass} mr-1.5`} />
        Play activity
      </div>
    );
  }

  if (title.includes("Creative")) {
    return (
      <div
        className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={sharedStyle}
      >
        <Music4 className={`${iconClass} mr-1.5`} />
        Play activity
      </div>
    );
  }

  if (title.includes("Games")) {
    return (
      <div
        className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={sharedStyle}
      >
        <Gamepad2 className={`${iconClass} mr-1.5`} />
        Play activity
      </div>
    );
  }

  if (title.includes("Calm")) {
    return (
      <div
        className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={sharedStyle}
      >
        <Heart className={`${iconClass} mr-1.5`} />
        Play activity
      </div>
    );
  }

  if (title.includes("Outdoor")) {
    return (
      <div
        className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={sharedStyle}
      >
        <Mountain className={`${iconClass} mr-1.5`} />
        Play activity
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
      style={sharedStyle}
    >
      <Wrench className={`${iconClass} mr-1.5`} />
      Play activity
    </div>
  );
}

function PlayActivityCard({
  activity,
  onDismiss,
}: {
  activity: PlayActivity;
  onDismiss: (activityId: string) => void;
}) {
  const accent = pathAccent(activity);

  const title = extractCardField(activity, "title");
  const hook = extractCardField(activity, "hook");
  const description = extractCardField(activity, "description");

  const fitSignals = deriveFitSignals(activity);
  const insideActivityPreviews = deriveInsideActivityPreviews(activity);

  const [quickCheck, setQuickCheck] = React.useState<QuickCheckChoice | null>(
    null
  );
  const [comment, setComment] = React.useState("");

  function handleQuickCheck(choice: QuickCheckChoice) {
    setQuickCheck(choice);
  }

  function handleSubmitQuickCheck() {
    if (!quickCheck) return;

    if (quickCheck === "not-really") {
      setComment("");
      setQuickCheck(null);
      onDismiss(activity.id);
      return;
    }

    setComment("");
    setQuickCheck(null);
  }

  return (
    <article
      className="group relative overflow-hidden rounded-[30px] border bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-5"
      style={{
        borderColor: rgb(accent, 0.18),
        boxShadow: `0 24px 80px rgba(0,0,0,0.32), 0 0 0 1px ${rgb(accent, 0.065)}`,
      }}
    >
      <div
        className="pointer-events-none absolute -left-10 -top-12 h-36 w-36 rounded-full blur-3xl"
        style={{ backgroundColor: rgb(accent, 0.17) }}
      />
      <div
        className="pointer-events-none absolute right-[-32px] top-[-18px] h-28 w-28 rounded-full blur-3xl"
        style={{ backgroundColor: rgb(accent, 0.13) }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28"
        style={{
          background: `linear-gradient(180deg, ${rgb(
            accent,
            0.2
          )} 0%, ${rgb(accent, 0.08)} 44%, transparent 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-px"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${rgb(
            accent,
            0.44
          )} 24%, ${rgb(accent, 0.18)} 72%, transparent 100%)`,
        }}
      />

      <SignalConstellation accent={accent} mobile />
      <SignalConstellation accent={accent} />

      <div className="relative">
        <div className="min-w-0 pr-14 sm:pr-28">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <ActivityGlyph title={title} accent={accent} />

              <h2 className="mt-3 text-[23px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[25px]">
                {title}
              </h2>
            </div>

            <Link
              href={`/main/explore/play/${activity.slug}`}
              className="hidden shrink-0 items-center gap-2 rounded-full border border-white/12 bg-white/[0.085] px-3.5 py-2 text-[13px] font-medium text-white/90 transition hover:bg-white/[0.12] sm:inline-flex"
            >
              Explore this activity
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {hook ? (
            <p className="mt-4 text-[15px] font-medium leading-[1.65] text-white/86 sm:text-[16px]">
              {hook}
            </p>
          ) : null}

          {description ? (
            <p className="mt-3 max-w-[44rem] text-[14px] leading-[1.7] text-white/68 sm:text-[14px]">
              {description}
            </p>
          ) : null}
        </div>

        {fitSignals.length > 0 ? (
          <section className="mt-5 rounded-[22px] border border-white/10 bg-black/18 px-4 py-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p
                  className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
                  style={{
                    borderColor: rgb(accent, 0.2),
                    background: `linear-gradient(180deg, ${rgb(
                      accent,
                      0.12
                    )} 0%, ${rgb(accent, 0.045)} 100%)`,
                    color: rgb(accent, 0.92),
                    boxShadow: `inset 0 1px 0 ${rgb(accent, 0.09)}`,
                  }}
                >
                  Signals I&apos;m hearing
                </p>
              </div>
            </div>

            <ul className="mt-3 space-y-2.5">
              {fitSignals.map((signal, index) => (
                <li
                  key={`${signal}-${index}`}
                  className="flex gap-3 text-[14px] leading-[1.65] text-white/80"
                >
                  <span
                    className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: rgb(accent, 0.9) }}
                  />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {insideActivityPreviews.length > 0 ? (
          <section className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/44">
              Inside this activity
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {insideActivityPreviews.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="rounded-full border px-3 py-1.5 text-[12px] font-medium text-white/74"
                  style={{
                    borderColor: rgb(accent, 0.18),
                    backgroundColor: rgb(accent, 0.09),
                    boxShadow: `inset 0 1px 0 ${rgb(accent, 0.07)}`,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/44">
            Quick check
          </p>

          <div className="mt-3 flex flex-wrap gap-2.5">
            {QUICK_CHECK_OPTIONS.map((choice) => (
              <QuickCheckPill
                key={choice.id}
                choice={choice}
                active={quickCheck === choice.id}
                accent={accent}
                onClick={() => handleQuickCheck(choice.id)}
              />
            ))}
          </div>

          {quickCheck ? (
            <div className="mt-3 rounded-[20px] border border-white/10 bg-black/16 px-3.5 py-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[13px] font-medium leading-relaxed text-white/72">
                  {getQuickCheckPrompt(quickCheck)}
                </p>
                <span className="shrink-0 text-[12px] text-white/38">
                  Optional
                </span>
              </div>

              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={3}
                placeholder={
                  quickCheck === "not-really"
                    ? "Tell us what feels off so we can bring in a better activity..."
                    : "Add a quick note..."
                }
                className="mt-3 w-full resize-none rounded-[16px] border border-white/10 bg-white/[0.035] px-3.5 py-3 text-[14px] leading-relaxed text-white outline-none placeholder:text-white/28"
                style={{
                  boxShadow: `inset 0 1px 0 ${rgb(accent, 0.06)}`,
                }}
              />

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmitQuickCheck}
                  className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-[13px] font-medium text-white transition hover:translate-y-[-1px]"
                  style={{
                    borderColor: rgb(accent, 0.26),
                    background: `linear-gradient(180deg, ${rgb(
                      accent,
                      0.22
                    )} 0%, ${rgb(accent, 0.12)} 100%)`,
                    boxShadow: `0 10px 24px ${rgb(accent, 0.16)}`,
                  }}
                >
                  {getQuickCheckSubmitLabel(quickCheck)}
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <div className="mt-5">
          <Link
            href={`/main/explore/play/${activity.slug}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] border px-4 py-3 text-[14px] font-medium text-white transition hover:translate-y-[-1px]"
            style={{
              borderColor: rgb(accent, 0.26),
              background: `linear-gradient(180deg, ${rgb(
                accent,
                0.22
              )} 0%, ${rgb(accent, 0.12)} 100%)`,
              boxShadow: `0 10px 28px ${rgb(accent, 0.18)}`,
            }}
          >
            Explore this activity
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function PlayExplorePage() {
  const [firstName, setFirstName] = React.useState<string | null>(null);
  const [dismissedActivityIds, setDismissedActivityIds] = React.useState<
    string[]
  >([]);

  React.useEffect(() => {
    setFirstName(readStoredFirstName());
  }, []);

  const allActivities = React.useMemo(() => PLAY_ACTIVITIES, []);

  const visibleActivities = React.useMemo(() => {
    return allActivities
      .filter((activity) => !dismissedActivityIds.includes(activity.id))
      .slice(0, MAX_VISIBLE_PLAY_ACTIVITIES);
  }, [allActivities, dismissedActivityIds]);

  function handleDismissActivity(activityId: string) {
    setDismissedActivityIds((current) =>
      current.includes(activityId) ? current : [...current, activityId]
    );
  }

  return (
    <div className={pagePadding()}>
      <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:px-7 sm:py-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(236,72,153,0.12),transparent_18%),radial-gradient(circle_at_18%_12%,rgba(249,168,212,0.08),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.00)_50%)]" />

        <div className="relative">
          <h1 className="text-[36px] font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-[50px]">
            Explore
          </h1>
          <p className="mt-1 text-[15px] leading-[1.5] text-white/62 sm:text-[16px]">
            Things I could get into
          </p>

          <ExploreLaneTabs />
        </div>
      </section>

      <PlayIntroPanel firstName={firstName} />

      <section className="mt-6 grid grid-cols-1 gap-4 sm:gap-5">
        {visibleActivities.map((activity) => (
          <PlayActivityCard
            key={activity.id}
            activity={activity}
            onDismiss={handleDismissActivity}
          />
        ))}

        {allActivities.length === 0 ? (
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-[15px] leading-relaxed text-white/72">
            No play activities are registered yet.
          </div>
        ) : null}

        {allActivities.length > 0 && visibleActivities.length === 0 ? (
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-[15px] leading-relaxed text-white/72">
            You&apos;ve cleared the current set of play activities.
          </div>
        ) : null}
      </section>
    </div>
  );
}