// src/app/main/career/[lane]/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Star, ArrowRight } from "lucide-react";

import { AppChrome } from "@/components/site/AppChrome";
import { BottomNav } from "@/components/navigation/BottomNav";
import {
  type SpotlightThemeId,
  type GradientLevel,
  isDarkTheme,
  INSIGHTS_THEMES,
} from "@/theme/everleapVisuals";

type LaneId = "product" | "health" | "social" | "builder";

type LaneContent = {
  title: string;
  subtitle: string;
  headline: string;
  whyThisFits: string[];
  bestEnvironments: string[];
  redFlags: string[];
  starterExperiments: { title: string; steps: string[] }[];
  starterPaths: string[];
  prompt: string; // ends with a question
};

const CONTENT: Record<LaneId, LaneContent> = {
  product: {
    title: "Product / UX",
    subtitle: "Building things people actually use",
    headline:
      "You’re wired for clarity + momentum. Product/UX rewards people who can turn messy human needs into something real.",
    whyThisFits: [
      "You like impact you can see. Product work gives fast feedback.",
      "You get bored by performative work. Product forces outcomes.",
      "Your strength is sense-making: what matters, what doesn’t, what to ship next.",
    ],
    bestEnvironments: [
      "Small-to-mid teams where you can own a slice end-to-end",
      "Teams that test with real users (not just opinions)",
      "Fast iteration cycles (weekly shipping beats quarterly planning)",
    ],
    redFlags: [
      "Endless meetings with no shipping",
      "Approval ladders where nobody owns decisions",
      "“Strategy theater” with no user contact",
    ],
    starterExperiments: [
      {
        title: "Redesign something you use",
        steps: [
          "Pick one screen in an app you use every week.",
          "Write the one job that screen is supposed to do.",
          "Sketch 2 alternative layouts (paper is fine).",
          "Show it to 2 people: “Which would you pick and why?”",
        ],
      },
      {
        title: "Mini user interview sprint",
        steps: [
          "Ask 3 people one question: “What’s annoying about ____?”",
          "Summarize in 5 bullets.",
          "Propose 1 change that would fix 2+ bullets.",
        ],
      },
    ],
    starterPaths: [
      "UX design / product design",
      "Product management (associate/junior)",
      "Customer research / UX research",
      "Front-end prototyping",
    ],
    prompt:
      "Does this lane feel energizing or annoying—and what part of it is the real reaction?",
  },

  health: {
    title: "Health + Human Support",
    subtitle: "Helping roles with real meaning (coaching, wellness, patient support)",
    headline:
      "If you want meaning automatically built-in, this lane gives it. The work is real because the people are real.",
    whyThisFits: [
      "Purpose is baked in: you can feel the impact.",
      "You may do best in roles with clear stakes and human connection.",
      "If you’re sensitive to vibes, you’ll often be a stabilizer (when it’s healthy).",
    ],
    bestEnvironments: [
      "Places with strong mentorship and boundaries (to prevent burnout)",
      "Teams that value communication and empathy without drama",
      "Roles with visible outcomes and real trust",
    ],
    redFlags: [
      "Chaotic environments with no support",
      "Roles that reward self-sacrifice instead of sustainability",
      "Constant emotional labor with zero recovery",
    ],
    starterExperiments: [
      {
        title: "Shadow the work (lightweight)",
        steps: [
          "Interview someone in a helping role.",
          "Ask: “What’s the hardest part? What’s the best part?”",
          "Ask: “What kind of person thrives here?”",
        ],
      },
      {
        title: "Test your energy response",
        steps: [
          "Volunteer once (one shift).",
          "Rate your energy before/after.",
          "Write 3 moments that felt meaningful vs draining.",
        ],
      },
    ],
    starterPaths: [
      "Health coaching / wellness support",
      "Patient advocate / care coordinator",
      "Psych / counseling-adjacent roles (depending on path)",
      "Fitness / performance coaching",
    ],
    prompt:
      "When you imagine doing this work weekly, do you feel pulled toward it—or pressured by it?",
  },

  social: {
    title: "Education / Community / Programs",
    subtitle: "Impact work where you build people and systems",
    headline:
      "This lane fits if you want to build momentum in others—programs, learning, community change, real outcomes.",
    whyThisFits: [
      "You may be great at translating complexity into something people can use.",
      "You’ll get energy from visible growth (yours and others’).",
      "If you hate fake work, this lane stays real when outcomes matter.",
    ],
    bestEnvironments: [
      "Teams with clear programs + measurable outcomes",
      "Communities where trust matters more than image",
      "Places that ship initiatives, not just meetings",
    ],
    redFlags: [
      "Mission language with no execution",
      "Politics-heavy organizations with unclear ownership",
      "“Feel good” work that doesn’t actually change anything",
    ],
    starterExperiments: [
      {
        title: "Design a tiny program",
        steps: [
          "Pick a problem students/people face (focus, confidence, planning).",
          "Design a 20-minute workshop outline.",
          "Run it with 3 people and ask what landed.",
        ],
      },
      {
        title: "Mentor test",
        steps: [
          "Help one person with one thing (resume, plan, decision).",
          "Notice: did that feel energizing or exhausting?",
          "Write what you’d do differently next time.",
        ],
      },
    ],
    starterPaths: [
      "Program coordinator / program manager",
      "Education / training design",
      "Community operations",
      "Youth development / advising",
    ],
    prompt:
      "Do you feel more alive building systems for people—or would you rather build products and stay out of the emotional lane?",
  },

  builder: {
    title: "Independent Builder",
    subtitle: "Creator / startup / entrepreneurship / shipping your own things",
    headline:
      "If you need autonomy + momentum, this lane is pure oxygen—but it only works if you can create structure.",
    whyThisFits: [
      "You like shipping and seeing progress fast.",
      "You don’t want permission to build—this lane removes permission entirely.",
      "Your motivation spikes when the work is real and owned by you.",
    ],
    bestEnvironments: [
      "Clear constraints (deadlines, public shipping, accountability)",
      "Small teams with high trust and speed",
      "Markets where user feedback is immediate",
    ],
    redFlags: [
      "Endless ideation with no shipping",
      "No schedule / no boundaries (burnout trap)",
      "Building in isolation with zero feedback loops",
    ],
    starterExperiments: [
      {
        title: "Ship a weekend artifact",
        steps: [
          "Pick one tiny problem you can solve in 48 hours.",
          "Ship a page/tool/guide/video.",
          "Show it to 5 people and ask: “Would you use this?”",
        ],
      },
      {
        title: "Proof-of-demand test",
        steps: [
          "Write one offer: “I help X do Y.”",
          "Send it to 10 people.",
          "Track who replies and why.",
        ],
      },
    ],
    starterPaths: [
      "Solo creator / micro-business",
      "Startup operator (early-stage)",
      "Productized service",
      "Content + community builder",
    ],
    prompt:
      "Do you want the freedom badly enough to build the structure that freedom requires?",
  },
};

function normalizeLane(raw: string | string[] | undefined): LaneId {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === "product" || v === "health" || v === "social" || v === "builder") return v;
  return "product";
}

export default function CareerDeepDivePage() {
  const params = useParams<{ lane?: string }>();
  const lane = normalizeLane(params?.lane);

  // Shared visual state (AppChrome, same pattern as Spotlight)
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const dark = isDarkTheme(themeId);
  const theme = INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];

  const cardShadow = dark
    ? "shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
    : "shadow-[0_16px_45px_rgba(0,0,0,0.18)]";

  const surface = `${theme.cardBgClass} ${theme.cardBorderClass} ${cardShadow} backdrop-blur-xl`;

  const c = CONTENT[lane];

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="career_deep_orb"
      ambientCap={0.35}
    >
      <div className="relative flex min-h-[100svh] flex-col">
        <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-24 pt-5 md:px-8 md:pt-7">
          {/* Top row */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <Link
              href="/main/carousel"
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                dark
                  ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                  : "border-slate-200 bg-white/80 text-slate-800 hover:bg-white"
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Insights
            </Link>

            <div
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                dark
                  ? "border-white/10 bg-white/5 text-slate-100"
                  : "border-slate-200 bg-white/80 text-slate-800"
              }`}
              title="Placeholder deep dive page"
            >
              Career Deep Dive
            </div>
          </div>

          {/* Hero */}
          <section className={`relative overflow-hidden rounded-[32px] border px-5 py-5 sm:px-7 sm:py-6 ${surface}`}>
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-gradient-to-br from-sky-400 via-indigo-500 to-slate-400 opacity-20 blur-3xl" />
              <div className="absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 opacity-15 blur-3xl" />
            </div>

            <div className="relative">
              <div className={`${dark ? "text-slate-300/70" : "text-slate-600"} text-xs font-semibold uppercase tracking-[0.22em]`}>
                {c.subtitle}
              </div>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                {c.title}
              </h1>

              <p className={`mt-3 max-w-2xl text-sm leading-relaxed ${dark ? "text-slate-200/90" : "text-slate-700"}`}>
                {c.headline}
              </p>

              {/* quick nav pills */}
              <div className="mt-5 flex flex-wrap gap-2">
                {(["product", "health", "social", "builder"] as LaneId[]).map((id) => (
                  <Link
                    key={id}
                    href={`/main/career/${id}`}
                    className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      id === lane
                        ? dark
                          ? "border-sky-400/60 bg-slate-950/80 text-slate-50 shadow-sm shadow-sky-400/20"
                          : "border-sky-300 bg-white text-slate-900 shadow-sm"
                        : dark
                        ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                        : "border-slate-200 bg-white/80 text-slate-800 hover:bg-white"
                    }`}
                  >
                    {CONTENT[id].title}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Body sections */}
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <section className={`rounded-3xl border px-5 py-5 ${surface}`}>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Star className="h-4 w-4" /> Why I think this fits
              </div>
              <ul className={`mt-3 list-disc space-y-2 pl-5 text-sm ${dark ? "text-slate-200/85" : "text-slate-700"}`}>
                {c.whyThisFits.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </section>

            <section className={`rounded-3xl border px-5 py-5 ${surface}`}>
              <div className="text-sm font-semibold">Best environments for you</div>
              <ul className={`mt-3 list-disc space-y-2 pl-5 text-sm ${dark ? "text-slate-200/85" : "text-slate-700"}`}>
                {c.bestEnvironments.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </section>

            <section className={`rounded-3xl border px-5 py-5 ${surface}`}>
              <div className="text-sm font-semibold">Red flags (you’ll hate this)</div>
              <ul className={`mt-3 list-disc space-y-2 pl-5 text-sm ${dark ? "text-slate-200/85" : "text-slate-700"}`}>
                {c.redFlags.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </section>

            <section className={`rounded-3xl border px-5 py-5 ${surface}`}>
              <div className="text-sm font-semibold">Starter paths to explore</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.starterPaths.map((x) => (
                  <span
                    key={x}
                    className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      dark
                        ? "border-white/10 bg-white/5 text-slate-100"
                        : "border-slate-200 bg-white/80 text-slate-800"
                    }`}
                  >
                    {x}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Experiments */}
          <section className={`mt-3 rounded-3xl border px-5 py-5 ${surface}`}>
            <div className="text-sm font-semibold">Starter experiments (do this to test fit)</div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {c.starterExperiments.map((ex) => (
                <div
                  key={ex.title}
                  className={`rounded-2xl border px-4 py-4 ${
                    dark ? "border-white/10 bg-slate-950/40" : "border-slate-200 bg-white/80"
                  }`}
                >
                  <div className="text-sm font-semibold">{ex.title}</div>
                  <ol className={`mt-2 list-decimal space-y-1 pl-5 text-sm ${dark ? "text-slate-200/85" : "text-slate-700"}`}>
                    {ex.steps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </section>

          {/* Feedback (placeholder) */}
          <section className={`mt-3 rounded-3xl border px-5 py-5 ${surface}`}>
            <div className="text-sm font-semibold">Calibration</div>
            <p className={`mt-2 text-sm ${dark ? "text-slate-200/85" : "text-slate-700"}`}>
              {c.prompt}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                  dark
                    ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                    : "border-slate-200 bg-white/80 text-slate-800 hover:bg-white"
                }`}
                // Placeholder — later open Guide modal or route to /main/questions with context
                onClick={() => {}}
              >
                👍 Mostly fits
              </button>
              <button
                type="button"
                className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                  dark
                    ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                    : "border-slate-200 bg-white/80 text-slate-800 hover:bg-white"
                }`}
                onClick={() => {}}
              >
                😐 Somewhat
              </button>
              <button
                type="button"
                className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                  dark
                    ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                    : "border-slate-200 bg-white/80 text-slate-800 hover:bg-white"
                }`}
                onClick={() => {}}
              >
                👎 Not really
              </button>

              <button
                type="button"
                className="ml-auto inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-300/40 transition hover:bg-amber-200 active:scale-95"
                onClick={() => {}}
                title="Placeholder: open Guide conversation"
              >
                Tell Everleap more
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className={`mt-2 text-xs ${dark ? "text-slate-300/45" : "text-slate-500"}`}>
              Placeholder screen only — wire these buttons to your Guide modal next.
            </div>
          </section>

          {/* Optional: a simple input box (placeholder) */}
          <section className={`mt-3 rounded-3xl border px-5 py-5 ${surface}`}>
            <div className="text-sm font-semibold">Your reaction (optional)</div>
            <p className={`mt-2 text-sm ${dark ? "text-slate-200/85" : "text-slate-700"}`}>
              If you had to correct this recommendation in one sentence, what would you say?
            </p>

            <div className="mt-3 flex items-end gap-3">
              <textarea
                rows={2}
                placeholder="Type your correction here…"
                className={`min-h-[52px] flex-1 resize-none rounded-2xl border px-4 py-3 text-sm outline-none ${
                  dark
                    ? "border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-400/70"
                    : "border-slate-200 bg-white/80 text-slate-800 placeholder:text-slate-500/70"
                }`}
              />
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-sky-300 text-slate-950 shadow-[0_10px_30px_rgba(56,189,248,0.35)] transition hover:bg-sky-200 active:scale-95"
                aria-label="Send"
                title="Send (placeholder)"
                onClick={() => {}}
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        </main>

        <BottomNav />
      </div>
    </AppChrome>
  );
}
