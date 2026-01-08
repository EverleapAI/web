// src/app/main/explore/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

import { AppChrome } from "@/components/site/AppChrome";
import { BottomNav } from "@/components/navigation/BottomNav";

import {
  INSIGHTS_THEMES,
  GRADIENT_CONFIGS,
  getPageBackgroundImage,
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

type ExploreAreaId = "education" | "travel" | "local" | "aid";

type NextMove = { id: string; title: string; blurb: string };
type MiniCard = { id: string; icon: string; title: string; short: string };

type ExploreArea = {
  id: ExploreAreaId;
  label: string;
  chip: string;
  glowClass: string; // gradient classes like: "from-... via-... to-..."
  href: string;

  headline: string;
  summary: string;
  hint: string;

  signals: string[];
  nextMoves: NextMove[];
  cards: MiniCard[];
};

const AREAS: ExploreArea[] = [
  {
    id: "education",
    label: "Education and Training",
    chip: "Skill upgrades + pathways",
    glowClass: "from-violet-500 via-fuchsia-500 to-sky-400",
    href: "/main/explore/education",
    headline: "Level up without the overwhelm",
    summary:
      "You don’t need a perfect plan. You need a *next step* that makes you stronger in 30–90 days.",
    hint:
      "Pick one lane. Create one proof. Then decide if it’s worth going deeper.",
    signals: ["Short programs", "Real artifacts", "Mentors > lectures", "Momentum-friendly"],
    nextMoves: [
      {
        id: "pick-lane",
        title: "Pick 1 skill lane",
        blurb:
          "Choose something you can practice weekly: writing, coding, design, fitness, finance, communication.",
      },
      {
        id: "proof",
        title: "Make a proof (not notes)",
        blurb:
          "A mini project, portfolio piece, or certification beats “researching forever.”",
      },
      {
        id: "ask",
        title: "Ask one person what’s real",
        blurb:
          "Interview someone in the field: what’s worth learning and what’s a waste of time?",
      },
    ],
    cards: [
      { id: "cert", icon: "📜", title: "Certificates", short: "Fast credibility with a clear finish line." },
      { id: "cc", icon: "🏫", title: "Community College", short: "Affordable + practical + flexible scheduling." },
      { id: "apprentice", icon: "🧰", title: "Apprenticeships", short: "Learn by doing, often paid." },
      { id: "bootcamp", icon: "🚀", title: "Bootcamps", short: "High intensity—best if you love shipping work." },
    ],
  },
  {
    id: "travel",
    label: "Travel",
    chip: "Explore the world (smartly)",
    glowClass: "from-sky-400 via-cyan-400 to-indigo-500",
    href: "/main/explore/travel",
    headline: "Travel that actually changes you",
    summary:
      "Travel is a cheat code when it’s intentional: new people, new perspective, new confidence.",
    hint:
      "The goal isn’t luxury. It’s a *story* and a *skill* you come back with.",
    signals: ["Perspective", "Courage reps", "New networks", "Real stories"],
    nextMoves: [
      {
        id: "one-theme",
        title: "Pick a theme",
        blurb:
          "Food? Art? Nature? History? Sports? Choose one and build the trip around it.",
      },
      {
        id: "micro-trip",
        title: "Start with a micro-trip",
        blurb:
          "Even a 1–2 day local trip can reset your brain and build confidence fast.",
      },
      {
        id: "trade",
        title: "Trade comfort for meaning",
        blurb:
          "Spend less on hotels, more on experiences (classes, tours, meetups, volunteering).",
      },
    ],
    cards: [
      { id: "weekend", icon: "🗺️", title: "Weekend Missions", short: "Short trips that feel big." },
      { id: "budget", icon: "💸", title: "Budget Travel", short: "Cheap flights + simple stays = more freedom." },
      { id: "workshop", icon: "🎓", title: "Travel + Learn", short: "Language, cooking, surf, art—come back upgraded." },
      { id: "volunteer", icon: "🤝", title: "Volunteer Trips", short: "Meaning-first travel (with real impact)." },
    ],
  },
  {
    id: "local",
    label: "Local opportunities",
    chip: "Right near you",
    glowClass: "from-emerald-400 via-teal-400 to-sky-400",
    href: "/main/explore/local",
    headline: "Your city is full of hidden doors",
    summary:
      "Most people miss opportunities because they’re quiet: mentors, programs, clubs, internships, volunteer roles.",
    hint:
      "Local wins are powerful: low friction, fast feedback, real humans.",
    signals: ["Low friction", "Fast feedback", "Real humans", "Proof-building"],
    nextMoves: [
      {
        id: "list",
        title: "Make a “3 doors” list",
        blurb:
          "Pick 3 places: a club, a volunteer org, a local business, a school program, a community center.",
      },
      {
        id: "one-message",
        title: "Send 1 simple message",
        blurb:
          "“Hi — I’m curious. Do you have any beginner ways to help or learn?”",
      },
      {
        id: "show-up",
        title: "Show up once",
        blurb:
          "One in-person visit beats 20 tabs of online research.",
      },
    ],
    cards: [
      { id: "clubs", icon: "👥", title: "Clubs & Teams", short: "Instant community + momentum." },
      { id: "intern", icon: "🧑‍💻", title: "Internships", short: "Even small roles create huge leverage." },
      { id: "vol", icon: "🌱", title: "Volunteering", short: "Meaning + network + confidence." },
      { id: "events", icon: "📅", title: "Events & Meetups", short: "Find your people faster." },
    ],
  },
  {
    id: "aid",
    label: "Financial Assistance",
    chip: "Money support + options",
    glowClass: "from-amber-400 via-orange-400 to-rose-400",
    href: "/main/explore/assistance",
    headline: "Get support without shame",
    summary:
      "Financial help isn’t a weakness—it’s a tool. The smart move is knowing what exists and how to ask.",
    hint:
      "We’ll build a simple system: eligibility → application → deadlines → next steps.",
    signals: ["Scholarships", "Grants", "Fee waivers", "Deadlines"],
    nextMoves: [
      {
        id: "one-bucket",
        title: "Pick one bucket first",
        blurb:
          "School aid, program scholarships, local grants, or need-based help. Start where you qualify most.",
      },
      {
        id: "doc-pack",
        title: "Make a “doc pack”",
        blurb:
          "Basic checklist: ID, income info (if needed), transcript, short bio, 1–2 references.",
      },
      {
        id: "apply",
        title: "Apply to 1 thing this week",
        blurb:
          "A single completed application beats “planning to apply.”",
      },
    ],
    cards: [
      { id: "scholar", icon: "🏅", title: "Scholarships", short: "Merit, need, niche, local—lots are underclaimed." },
      { id: "waiver", icon: "🧾", title: "Fee Waivers", short: "Tests, applications, programs—many offer them." },
      { id: "grant", icon: "🎁", title: "Local Grants", short: "Community orgs often have small grants with simple apps." },
      { id: "budget", icon: "📊", title: "Budget Support", short: "Simple plan to reduce stress + avoid surprises." },
    ],
  },
];

export default function ExplorePage() {
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const [activeIndex, setActiveIndex] = React.useState(0);

  const theme = INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];
  const gradient = GRADIENT_CONFIGS.find((g) => g.level === gradientLevel) ?? GRADIENT_CONFIGS[3];

  const pageBgImage = gradientLevel === 0 ? undefined : getPageBackgroundImage(themeId);
  const pageBgStyle = pageBgImage ? ({ backgroundImage: pageBgImage } as React.CSSProperties) : {};
  const dark = isDarkTheme(themeId);

  const activeArea = AREAS[activeIndex] ?? AREAS[0];

  const cardShadow = dark
    ? "shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
    : "shadow-[0_20px_60px_rgba(0,0,0,0.18)]";

  const cardSurface = `${theme.cardBgClass} ${theme.cardBorderClass} ${cardShadow} backdrop-blur-xl`;

  const sectionLabelClass = dark
    ? "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-300/60"
    : "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-600/70";

  const muted = dark ? "text-slate-300/90" : "text-slate-600";

  const chipBase = dark
    ? "border-white/10 bg-slate-950/55 text-slate-200 hover:bg-slate-950/70"
    : "border-slate-200 bg-white/80 text-slate-800 hover:bg-white";

  const chipActive = dark
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

  function go(delta: number) {
    setActiveIndex((prev) => {
      const next = prev + delta;
      if (next < 0) return AREAS.length - 1;
      if (next >= AREAS.length) return 0;
      return next;
    });
  }

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="explore_orb"
      ambientCap={0.35}
    >
      <div className={`relative flex min-h-[100svh] flex-col ${theme.pageBgBaseClass}`} style={pageBgStyle}>
        {/* Ambient blobs */}
        {gradientLevel > 0 && (
          <div className="pointer-events-none absolute inset-0" style={{ opacity: gradient.ambientOpacity }}>
            <div className={`absolute -top-24 -left-16 h-64 w-64 rounded-full blur-3xl ${theme.ambientTopLeftClass}`} />
            <div className={`absolute top-40 right-[-32px] h-72 w-72 rounded-full blur-3xl ${theme.ambientRightClass}`} />
          </div>
        )}

        <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-24 pt-5 md:px-8 md:pt-7">
          {/* Header row + swipe hint */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className={sectionLabelClass}>Explore</div>
              <div className={`mt-1 text-sm ${muted}`}>
                Tap a card — or use arrows. <span className="opacity-80">Swipe/scroll left-right.</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition active:scale-95 ${
                  dark ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10" : "border-slate-200 bg-white/80 text-slate-800 hover:bg-white"
                }`}
                aria-label="Previous"
                title="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition active:scale-95 ${
                  dark ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10" : "border-slate-200 bg-white/80 text-slate-800 hover:bg-white"
                }`}
                aria-label="Next"
                title="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chips row (horizontal, “Insights-style”) */}
          <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-stretch gap-2 pr-2">
              {AREAS.map((a, idx) => {
                const active = idx === activeIndex;
                const dot = `bg-gradient-to-br ${a.glowClass}`;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`relative inline-flex shrink-0 flex-col items-start gap-0.5 rounded-2xl border px-4 py-2.5 text-left transition ${
                      active ? chipActive : chipBase
                    }`}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className={`absolute left-1 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b ${a.glowClass}`}
                      />
                    )}

                    <span className="flex items-center gap-2 text-sm font-semibold leading-tight">
                      <span className={`h-2.5 w-2.5 rounded-full ${dot} opacity-90`} />
                      {a.label}
                    </span>
                    <span className={`text-xs leading-tight ${dark ? "text-slate-400" : "text-slate-600/80"}`}>
                      {a.chip}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active card */}
          <section className="mt-4">
            <div className={`relative overflow-hidden rounded-[32px] border px-6 py-6 sm:px-7 sm:py-7 ${cardSurface}`}>
              {/* glow */}
              <div className="pointer-events-none absolute inset-0">
                <div className={`absolute -top-12 -left-12 h-64 w-64 rounded-full blur-3xl opacity-25 bg-gradient-to-br ${activeArea.glowClass}`} />
                <div className={`absolute -bottom-16 -right-14 h-72 w-72 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${activeArea.glowClass}`} />
              </div>

              <div className="relative">
                <div className={sectionLabelClass}>{activeArea.label}</div>

                <div className="mt-2 max-w-2xl">
                  <h1 className={`text-2xl font-semibold tracking-tight ${dark ? "text-slate-50" : "text-slate-900"}`}>
                    {activeArea.headline}
                  </h1>
                  <p className={`mt-2 text-sm ${muted}`}>{activeArea.summary}</p>
                  <p className={`mt-2 text-sm ${muted}`}>{activeArea.hint}</p>
                </div>

                {/* signals */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {activeArea.signals.map((s) => (
                    <span
                      key={s}
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs ${
                        dark ? "border-white/10 bg-white/5 text-slate-100" : "border-slate-200 bg-white/80 text-slate-800"
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* next moves */}
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {activeArea.nextMoves.map((m) => (
                    <div
                      key={m.id}
                      className={`rounded-3xl border px-4 py-4 ${
                        dark ? "border-white/10 bg-slate-950/35" : "border-slate-200 bg-white/70"
                      }`}
                    >
                      <div className={`text-sm font-semibold ${dark ? "text-slate-50" : "text-slate-900"}`}>
                        {m.title}
                      </div>
                      <div className={`mt-2 text-sm ${muted}`}>{m.blurb}</div>
                    </div>
                  ))}
                </div>

                {/* mini cards */}
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {activeArea.cards.map((c) => (
                    <div
                      key={c.id}
                      className={`rounded-3xl border px-4 py-4 ${
                        dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                            dark ? "bg-slate-950/45 text-slate-50" : "bg-slate-900/5 text-slate-900"
                          }`}
                          aria-hidden
                        >
                          <span className="text-lg">{c.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <div className={`text-sm font-semibold ${dark ? "text-slate-50" : "text-slate-900"}`}>
                            {c.title}
                          </div>
                          <div className={`mt-1 text-sm ${muted}`}>{c.short}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className={`text-xs ${dark ? "text-slate-300/60" : "text-slate-600/70"}`}>
                    Explore is placeholder content for now — we’ll later personalize using your Story + Insights.
                  </div>

                  <Link
                    href={activeArea.href}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-300/35 transition hover:bg-amber-200 active:scale-95"
                  >
                    Open {activeArea.label} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <BottomNav activeKey="explore" />
      </div>
    </AppChrome>
  );
}
