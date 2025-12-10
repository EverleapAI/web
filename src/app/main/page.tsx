// src/app/main/page.tsx
"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  Sparkles,
  Brain,
  Rocket,
  Route,
  CheckCircle2,
  Medal,
} from "lucide-react";

import {
  mainCarouselCards,
  type SpotlightCard,
} from "@/app/main/mainCarouselData";
import {
  BottomNav,
  type BottomNavKey,
} from "@/components/navigation/BottomNav";
import { AiGuideOrb } from "@/components/main/AiGuideOrb";
import { AiGuideModal } from "@/components/main/AiGuideModal";

/* ========= Types & simple config ========= */

type RadialItem = {
  key: string;
  label: string;
  href: string;
  icon: ReactNode;
};

type HeroConfig = {
  title: string;
  body: string;
  secondary?: string;
  chip: string;
  ctaLabel: string;
  ctaHref: string;
  showProgressBar: boolean;
};

/**
 * TODO: wire this up to real user data.
 * For now this is a stub so you can see the state changes.
 */
const baseStoryCompletionPercent = 18; // 0–100

const userName = "Tom";

/* ========= Radial nav items ========= */

const RADIAL_ITEMS: RadialItem[] = [
  {
    key: "spotlight",
    label: "Spotlight",
    href: "/main",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    key: "story",
    label: "Story",
    href: "/main/questions",
    icon: <Brain className="w-5 h-5" />,
  },
  {
    key: "youmap",
    label: "YouMap",
    href: "/main/carousel",
    icon: <Route className="w-5 h-5" />,
  },
  {
    key: "goals",
    label: "Goals",
    href: "/main/goals",
    icon: <Rocket className="w-5 h-5" />,
  },
  {
    key: "actions",
    label: "Actions",
    href: "/main/actions",
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
  {
    key: "wins",
    label: "Wins",
    href: "/achievements",
    icon: <Medal className="w-5 h-5" />,
  },
];

/* ========= Quick paths, tiny tasks, deep explorations ========= */

const quickPaths = [
  {
    key: "story",
    chip: "3–8 min",
    title: "Story",
    href: "/main/questions",
  },
  {
    key: "youmap",
    chip: "See your patterns",
    title: "YouMap",
    href: "/main/carousel",
  },
  {
    key: "goals",
    chip: "Big picture",
    title: "Goals",
    href: "/main/goals",
  },
  {
    key: "actions",
    chip: "Next moves",
    title: "Actions",
    href: "/main/actions",
  },
];

const tinyTasks = [
  {
    title: "1-minute check-in",
    chip: "Now",
    href: "/tasks/check-in",
    icon: "⚡",
  },
  {
    title: "Answer 3 questions",
    chip: "Story",
    href: "/main/questions",
    icon: "🧩",
  },
  {
    title: "Pick today’s vibe",
    chip: "Mood",
    href: "/tasks/vibe",
    icon: "🎧",
  },
  {
    title: "Name one win",
    chip: "Today",
    href: "/tasks/tiny-win",
    icon: "🌱",
  },
];

const explorations = [
  {
    title: "Skills Explorer",
    href: "/explore/skills",
    gradient: "from-fuchsia-500 via-purple-500 to-indigo-500",
  },
  {
    title: "Future You",
    href: "/explore/future-you",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
  },
  {
    title: "People Patterns",
    href: "/explore/people",
    gradient: "from-cyan-400 via-sky-500 to-blue-600",
  },
];

/* ========= Hero config logic ========= */

function getHeroConfig(percent: number): HeroConfig {
  if (percent >= 100) {
    // Base story complete – focus on YouMap as the next move.
    return {
      title: "See how Everleap sees you",
      body:
        "I’ve got a pretty good read on you now. Let’s look at your patterns and see what actually fits you.",
      secondary: "You can still add more to your story anytime.",
      chip: "Base story complete",
      ctaLabel: "View my YouMap",
      ctaHref: "/main/carousel",
      showProgressBar: false,
    };
  }

  if (percent >= 20) {
    // Phase 2 – they’ve started their story, now we hint at YouMap.
    return {
      title: "Keep building your Story",
      body:
        "You’ve already given me a feel for who you are. A few more questions and I can show you clearer patterns.",
      secondary: "You’ve unlocked your first traits — we’ll surface them in your YouMap.",
      chip: `Story setup: ${percent}% complete`,
      ctaLabel: "Answer a few more questions",
      ctaHref: "/main/questions",
      showProgressBar: true,
    };
  }

  // Phase 1 – just getting started.
  return {
    title: "First step: your Story",
    body:
      "Answer a few quick questions so I’m not guessing who you are. You can stop anytime and come back later.",
    secondary: undefined,
    chip: "Setup: 0–20% complete · about 30 questions total",
    ctaLabel: "Start my Story",
    ctaHref: "/main/questions",
    showProgressBar: true,
  };
}

/* ========= Page ========= */

export default function SpotlightPage() {
  const [activeTab, setActiveTab] = useState<BottomNavKey>("you");
  const [guideOpen, setGuideOpen] = useState(false);

  const spotlightCard = mainCarouselCards.find(
    (c) => c.id === "spotlight"
  ) as SpotlightCard | undefined;

  if (!spotlightCard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-slate-50">
        <p className="text-sm text-slate-300">
          Spotlight data is not available yet.
        </p>
      </div>
    );
  }

  const hero = getHeroConfig(baseStoryCompletionPercent);

  const guideSubtitle =
    baseStoryCompletionPercent < 100
      ? `Hi ${userName}. Let’s keep building your story so I can guide you better.`
      : `Hi ${userName}. Let’s look at your patterns and decide what matters next.`;

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-50"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 55%), radial-gradient(circle at bottom right, rgba(251,113,133,0.16), transparent 55%)",
      }}
    >
      <main className="relative flex min-h-screen flex-col">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 opacity-50">
          <div className="absolute -top-24 -left-16 h-64 w-64 rounded-full bg-fuchsia-500 blur-3xl" />
          <div className="absolute top-40 -right-10 h-64 w-64 rounded-full bg-cyan-500 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 pb-24 pt-6 md:px-8 md:pt-8">
          {/* Header with AI Guide */}
          <header className="mb-4 flex items-center justify-between gap-3 md:mb-6">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Spotlight
              </span>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
                One tiny move at a time
              </h1>
            </div>

            <AiGuideOrb
              subline={
                spotlightCard.summary ??
                "Let’s pick one small thing to focus on right now."
              }
              onClick={() => setGuideOpen(true)}
            />
          </header>

          <main className="flex flex-1 flex-col">
            {/* Hero card */}
            <SpotlightHeroCard hero={hero} />

            {/* Quick Paths – Story / YouMap / Goals / Actions */}
            <SectionHeader title="Quick paths" />
            <HorizontalScroll>
              {quickPaths.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="flex-shrink-0 w-52 rounded-full bg-slate-900/80 border border-slate-700/70 px-4 py-2.5 flex items-center justify-between gap-3 shadow-md shadow-slate-950/60 backdrop-blur-md"
                >
                  <div className="flex flex-col">
                    <span className="text-[0.65rem] uppercase tracking-wide text-slate-300/80">
                      {item.chip}
                    </span>
                    <span className="text-sm font-semibold">{item.title}</span>
                  </div>
                  <span className="text-lg">➜</span>
                </Link>
              ))}
            </HorizontalScroll>

            {/* Tiny tasks */}
            <SectionHeader title="Tiny tasks" />
            <HorizontalScroll>
              {tinyTasks.map((task) => (
                <Link
                  key={task.title}
                  href={task.href}
                  className="flex-shrink-0 w-48 rounded-full bg-slate-900/80 border border-slate-700/60 px-4 py-2.5 flex items-center gap-3 shadow-md shadow-slate-950/40 backdrop-blur-md"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/80 text-lg">
                    {task.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.65rem] text-slate-300/80">
                      {task.chip}
                    </span>
                    <span className="text-sm font-semibold leading-tight">
                      {task.title}
                    </span>
                  </div>
                </Link>
              ))}
            </HorizontalScroll>

            {/* Deep explorations */}
            <SectionHeader title="Deep explorations" />
            <HorizontalScroll>
              {explorations.map((exp) => (
                <Link
                  key={exp.title}
                  href={exp.href}
                  className={`flex-shrink-0 w-64 h-40 rounded-3xl bg-gradient-to-br ${exp.gradient} p-[1px] shadow-xl shadow-slate-950/60 overflow-hidden`}
                >
                  <div className="h-full w-full rounded-3xl bg-slate-950/50 backdrop-blur-md flex flex-col justify-between p-4">
                    <div className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-100/80">
                      Explore
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold leading-snug">
                        {exp.title}
                      </h3>
                      <p className="text-xs text-slate-100/85">
                        Tap to play with ideas, not make permanent decisions.
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </HorizontalScroll>

            {/* Simple wins card at the bottom */}
            <AchievementsCard />
          </main>
        </div>

        {/* Radial navigation FAB */}
        <RadialNavFab />
      </main>

      {/* Shared bottom nav (kept for now) */}
      <BottomNav activeKey={activeTab} onChange={setActiveTab} />

      {/* AI guide modal */}
      {guideOpen && (
        <AiGuideModal
          onClose={() => setGuideOpen(false)}
          title="Spotlight"
          subtitle={guideSubtitle}
        />
      )}
    </div>
  );
}

/* ========= UI pieces ========= */

function SpotlightHeroCard({ hero }: { hero: HeroConfig }) {
  const showProgress = hero.showProgressBar && baseStoryCompletionPercent < 100;

  return (
    <div className="mb-6 w-full max-w-xl self-center">
      <Link href={hero.ctaHref}>
        <div className="relative block overflow-hidden rounded-3xl bg-gradient-to-br from-fuchsia-500 via-orange-400 to-amber-300 p-[1px] shadow-xl shadow-slate-950/70">
          <div className="relative rounded-3xl bg-slate-950/35 backdrop-blur-xl border border-white/20 px-4 py-4 sm:px-6 sm:py-5 flex flex-col gap-3 text-left">
            {/* Abstract blobs */}
            <div className="pointer-events-none absolute -top-8 -right-4 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 rounded-full bg-amber-300/30 blur-3xl" />

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950/60 border border-white/20 shadow-inner shadow-slate-900/70">
                  <Sparkles className="w-5 h-5 text-amber-200" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.65rem] uppercase tracking-[0.22em] text-amber-100/90">
                    Today’s spotlight
                  </span>
                  <span className="text-sm font-semibold sm:text-base">
                    {hero.title}
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-slate-950/60 px-3 py-1 text-[0.65rem] font-medium text-amber-100 border border-white/20">
                {hero.chip}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-50/90">{hero.body}</p>

            {hero.secondary && (
              <p className="text-[0.7rem] text-slate-100/80">
                {hero.secondary}
              </p>
            )}

            {showProgress && (
              <div className="mt-1">
                <div className="flex items-center justify-between text-[0.7rem] text-slate-100/85 mb-1">
                  <span>Story progress</span>
                  <span>{baseStoryCompletionPercent}%</span>
                </div>
                <div className="h-1 rounded-full bg-slate-900/70 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-300"
                    style={{
                      width: `${Math.min(
                        Math.max(baseStoryCompletionPercent, 4),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="mt-2 flex items-center justify-between text-[0.7rem] text-slate-100/85 pt-1">
              <span>“What should I focus on right now?”</span>
              <span className="inline-flex items-center gap-1">
                {hero.ctaLabel}
                <span className="text-base leading-none">➜</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between mt-1 mb-2">
      <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-300/80">
        {title}
      </h2>
    </div>
  );
}

function HorizontalScroll({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 -mx-4 pl-4">
      <div
        className="
          flex gap-3 overflow-x-auto pb-2 pr-6
          [-ms-overflow-style:none] [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {children}
      </div>
    </div>
  );
}

function AchievementsCard() {
  return (
    <div className="mt-1 mb-4 rounded-3xl bg-slate-900/85 border border-slate-700/70 px-4 py-3 shadow-lg shadow-slate-950/60 backdrop-blur-md flex items-center justify-between max-w-xl self-center">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-slate-300/80">Streak & progress</span>
        <div className="text-sm font-semibold">You’re building momentum</div>
        <p className="text-xs text-slate-400/90">
          Tiny moves add up. Even one small action today keeps your story
          moving.
        </p>
      </div>
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border border-slate-600/70" />
        <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-emerald-400 to-sky-400 opacity-80" />
        <div className="absolute inset-2 rounded-full bg-slate-950 flex items-center justify-center">
          <span className="text-xs font-semibold text-emerald-300">72%</span>
        </div>
      </div>
    </div>
  );
}

function RadialNavFab() {
  const [open, setOpen] = useState(false);

  const radius = 96; // px distance
  const startAngle = -Math.PI / 2; // -90deg
  const endAngle = (-3 * Math.PI) / 4; // -135deg
  const steps = RADIAL_ITEMS.length > 1 ? RADIAL_ITEMS.length - 1 : 1;
  const angleStep = (startAngle - endAngle) / steps;

  return (
    <div className="fixed bottom-6 right-5 z-40">
      {/* Radial items */}
      {RADIAL_ITEMS.map((item, index) => {
        const angle = startAngle - angleStep * index;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <Link
            key={item.key}
            href={item.href}
            className="absolute bottom-0 right-0"
            style={{
              transform: open
                ? `translate(${x}px, ${y}px)`
                : "translate(0px, 0px)",
              opacity: open ? 1 : 0,
              pointerEvents: open ? "auto" : "none",
              transition:
                "transform 0.22s ease-out, opacity 0.18s ease-out",
              transitionDelay: open
                ? `${index * 20}ms`
                : `${(RADIAL_ITEMS.length - index) * 15}ms`,
            }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/90 border border-slate-600/70 shadow-lg shadow-slate-950/70 backdrop-blur-lg hover:bg-slate-800/90 active:scale-95 transition">
              <span className="text-slate-100">{item.icon}</span>
            </div>
          </Link>
        );
      })}

      {/* Main FAB */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-fuchsia-500 via-orange-400 to-sky-400 shadow-xl shadow-slate-950/80 border border-white/30 backdrop-blur-xl active:scale-95 transition"
        aria-label="Open navigation"
      >
        <div className="absolute inset-1 rounded-full bg-slate-950/50" />
        <div className="relative flex items-center justify-center">
          <span
            className={`block h-0.5 w-5 rounded-full bg-white transition-transform duration-200 ${
              open ? "rotate-45 translate-y-[1px]" : "-translate-y-[3px]"
            }`}
          />
          <span
            className={`block h-0.5 w-5 rounded-full bg-white transition-transform duration-200 ${
              open ? "-rotate-45 -translate-y-[1px]" : "translate-y-[3px]"
            }`}
          />
        </div>
      </button>
    </div>
  );
}
