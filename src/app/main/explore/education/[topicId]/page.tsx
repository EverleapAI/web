// src/app/main/explore/education/[topicId]/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

import { AppChrome } from "@/components/site/AppChrome";
import { BottomNav } from "@/components/navigation/BottomNav";

import {
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

type Topic = {
  id: string;
  title: string;
  icon: string;
  spoken: string[]; // audio-ready paragraphs
  localIdeas: { title: string; note: string }[];
  onlineIdeas: { title: string; note: string }[];
};

const ZIP_DEFAULT = "92901";

// Prototype-only: hard-coded topics (Option B)
// IMPORTANT: keys MUST match education.ts card ids (topic slugs).
const TOPICS: Record<string, Topic> = {
  "learn-to-code": {
    id: "learn-to-code",
    title: "Learn to code",
    icon: "💻",
    spoken: [
      "Alright — if you’ve ever thought “I wish I could build my own thing”… coding is the unlock.",
      "This isn’t about being a genius. It’s about learning enough to make something real.",
      "We’ll keep it simple: one small project, one week, and you’ll feel the difference.",
    ],
    localIdeas: [
      {
        title: "Try a community college intro class",
        note: `Search “intro to programming” near ${ZIP_DEFAULT}. Look for beginner-friendly + project-based.`,
      },
      {
        title: "Find a teen-friendly coding group",
        note: "Search “Hack Club”, “coding club”, or “youth coding” nearby. You want friendly humans + momentum.",
      },
    ],
    onlineIdeas: [
      {
        title: "Pick one beginner track (and stick to it)",
        note: "One platform for 7 days. No hopping. Consistency beats “the perfect resource.”",
      },
      {
        title: "Build one tiny finished thing",
        note: "A personal homepage, a habit tracker, or a tiny game. One finished thing beats ten half-starts.",
      },
    ],
  },

  "science-deep-dive": {
    id: "science-deep-dive",
    title: "Science deep-dive",
    icon: "🧪",
    spoken: [
      "This is for the part of you that can’t stop asking “yeah but WHY?”",
      "The move is simple: pick one topic you actually care about… and go one layer deeper than everyone else.",
      "You’re not memorizing facts. You’re training your brain to think clearly.",
    ],
    localIdeas: [
      {
        title: "Museum / science center day",
        note: `Search for science museums near ${ZIP_DEFAULT}. Go in with one question you want answered.`,
      },
      {
        title: "Talk to a real scientist (yes, seriously)",
        note: "Email a university lab or local org. Ask what they’re working on and what surprises them most.",
      },
    ],
    onlineIdeas: [
      {
        title: "One topic channel, one playlist",
        note: "Follow one strong educator and binge one series — then write your own 8-sentence explanation.",
      },
      {
        title: "Do a mini experiment",
        note: "Track a claim, test it, write what happened. You’re building the habit of evidence.",
      },
    ],
  },

  "public-speaking": {
    id: "public-speaking",
    title: "Public speaking",
    icon: "🗣️",
    spoken: [
      "Public speaking isn’t a personality trait. It’s reps.",
      "You don’t need confidence first — confidence shows up AFTER you practice.",
      "We’ll make it low-stakes: tiny audiences, short runs, quick wins.",
    ],
    localIdeas: [
      {
        title: "Toastmasters (youth-friendly options exist)",
        note: `Search near ${ZIP_DEFAULT}. You want supportive, structured practice.`,
      },
      {
        title: "Volunteer to present once",
        note: "School club, community group, class — one small moment where you’re the voice.",
      },
    ],
    onlineIdeas: [
      {
        title: "Record 60 seconds daily",
        note: "One minute. One idea. Watch it back. Adjust one thing. Repeat.",
      },
      {
        title: "Steal a great structure",
        note: "Hook → point → example → takeaway. Most people ramble — structure makes you memorable.",
      },
    ],
  },
};

function safeParam(v: unknown): string {
  if (Array.isArray(v)) return String(v[0] ?? "");
  return String(v ?? "");
}

function titleForTopicId(topicId: string): string {
  return TOPICS[topicId]?.title ?? "Education deep dive";
}

export default function EducationDeepDivePage() {
  const params = useParams<{ topicId?: string | string[] }>();
  const topicId = safeParam(params?.topicId);
  const topic = TOPICS[topicId];

  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);
  const dark = isDarkTheme(themeId);

  const shell = dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white";
  const panel = dark
    ? "border-white/10 bg-slate-950/30"
    : "border-black/10 bg-slate-50";

  // Big inner lane shell (matches Careers vibe)
  const laneShell = dark
    ? "border-white/10 bg-white/5"
    : "border-black/10 bg-white";
  const laneGlow = dark
    ? "bg-gradient-to-br from-emerald-500/22 via-teal-400/12 to-cyan-500/10"
    : "bg-gradient-to-br from-emerald-400/25 via-teal-300/14 to-cyan-300/12";

  const showNotFound = !topic;

  return (
    <AppChrome
      themeId={themeId}
      gradientLevel={gradientLevel}
      onThemeChange={setThemeId}
      onGradientChange={setGradientLevel}
    >
      <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-3">
        {/* Header (Explore-style, tight) */}
        <div className="mb-2">
          <div className="flex items-center gap-3">
            <div
              className={`h-5 w-[3px] rounded-full ${
                dark
                  ? "bg-gradient-to-b from-emerald-400/70 via-teal-300/60 to-cyan-400/70"
                  : "bg-gradient-to-b from-emerald-600 via-teal-600 to-cyan-600"
              }`}
              aria-hidden
            />
            <div className="min-w-0">
              <div
                className={`text-[0.7rem] font-semibold uppercase tracking-[0.28em] ${
                  dark ? "text-white/70" : "text-slate-600"
                }`}
              >
                Explore
              </div>
              <div
                className={`mt-0.5 text-sm ${
                  dark ? "text-white/70" : "text-slate-600"
                }`}
              >
                Education • {titleForTopicId(topicId)}
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="mt-3">
          <Link
            href="/main/explore"
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition active:scale-95 ${
              dark
                ? "border-white/10 bg-white/5 text-white/85 hover:bg-white/10"
                : "border-black/10 bg-white text-slate-900 hover:bg-slate-50"
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Explore
          </Link>
        </div>

        {/* Big lane wrapper (Careers-style) */}
        <div
          className={`relative mt-4 overflow-hidden rounded-[32px] border px-5 py-4 shadow-sm backdrop-blur-xl sm:px-7 sm:py-5 ${laneShell}`}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className={`absolute -top-10 -left-12 h-56 w-56 rounded-full blur-3xl opacity-70 ${laneGlow}`} />
            <div className={`absolute -bottom-16 -right-10 h-64 w-64 rounded-full blur-3xl opacity-60 ${laneGlow}`} />
          </div>

          <div className="relative">
            {/* Main card */}
            <div className={`rounded-3xl border p-4 shadow-sm ${shell}`}>
              <div className="flex items-start gap-3">
                <div
                  className={`relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border ${
                    dark ? "border-white/10" : "border-black/10"
                  }`}
                  aria-hidden
                >
                  <div
                    className={`absolute inset-0 ${
                      dark
                        ? "bg-gradient-to-br from-emerald-500/25 via-teal-400/15 to-cyan-500/15"
                        : "bg-gradient-to-br from-emerald-400/30 via-teal-300/20 to-cyan-300/20"
                    }`}
                  />
                  <div className="relative text-lg">{topic?.icon ?? "🎓"}</div>
                </div>

                <div className="min-w-0 flex-1">
                  <h1
                    className={`text-lg font-semibold ${
                      dark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {topic?.title ?? "Topic not found"}
                  </h1>
                  <div
                    className={`mt-1 text-sm ${
                      dark ? "text-white/70" : "text-slate-600"
                    }`}
                  >
                    Prototype deep dive page (dynamic route). Local stuff will
                    later use the user’s zip code.
                  </div>

                  {/* ZIP pill (prototype signal) */}
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold ${
                        dark
                          ? "border-white/10 bg-white/5 text-white/80"
                          : "border-black/10 bg-white text-slate-800"
                      }`}
                    >
                      <Sparkles className="mr-1 h-3.5 w-3.5 opacity-80" />
                      Using ZIP {ZIP_DEFAULT} (prototype)
                    </span>
                  </div>
                </div>
              </div>

              {/* Not found state (designed, not broken) */}
              {showNotFound ? (
                <div className="mt-4 rounded-3xl border p-4">
                  <div
                    className={`flex items-center gap-2 text-sm font-semibold ${
                      dark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    <AlertTriangle className="h-4 w-4 opacity-70" />
                    This topic isn’t wired up yet.
                  </div>
                  <div
                    className={`mt-1 text-sm ${
                      dark ? "text-white/70" : "text-slate-600"
                    }`}
                  >
                    Totally normal for the prototype. Pick a topic from Education
                    and you’ll land on a real page.
                  </div>

                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <Link
                      href="/main/explore"
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition active:scale-95 sm:w-auto ${
                        dark
                          ? "border-white/10 bg-white/5 text-white/85 hover:bg-white/10"
                          : "border-black/10 bg-white text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      Back to Explore <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {/* Spoken coach copy */}
                  <div className="mt-4 space-y-2">
                    {topic.spoken.map((p, i) => (
                      <p
                        key={i}
                        className={`text-sm ${
                          dark ? "text-white/75" : "text-slate-700"
                        }`}
                      >
                        {p}
                      </p>
                    ))}
                  </div>

                  {/* Two columns: Local + Online */}
                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className={`rounded-3xl border p-4 ${panel}`}>
                      <div
                        className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                          dark ? "text-white/60" : "text-slate-500"
                        }`}
                      >
                        Local options
                      </div>

                      <div className="mt-3 space-y-3">
                        {topic.localIdeas.map((x) => (
                          <div
                            key={x.title}
                            className={`rounded-2xl border p-3 ${
                              dark
                                ? "border-white/10 bg-white/5"
                                : "border-black/10 bg-white"
                            }`}
                          >
                            <div
                              className={`flex items-center gap-2 text-sm font-semibold ${
                                dark ? "text-white" : "text-slate-900"
                              }`}
                            >
                              <MapPin className="h-4 w-4 opacity-70" />
                              {x.title}
                            </div>
                            <div
                              className={`mt-1 text-xs ${
                                dark ? "text-white/70" : "text-slate-600"
                              }`}
                            >
                              {x.note}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div
                        className={`mt-3 text-[0.72rem] ${
                          dark ? "text-white/55" : "text-slate-600"
                        }`}
                      >
                        Later: we’ll plug in real nearby places based on zip.
                      </div>
                    </div>

                    <div className={`rounded-3xl border p-4 ${panel}`}>
                      <div
                        className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                          dark ? "text-white/60" : "text-slate-500"
                        }`}
                      >
                        Online options
                      </div>

                      <div className="mt-3 space-y-3">
                        {topic.onlineIdeas.map((x) => (
                          <div
                            key={x.title}
                            className={`rounded-2xl border p-3 ${
                              dark
                                ? "border-white/10 bg-white/5"
                                : "border-black/10 bg-white"
                            }`}
                          >
                            <div
                              className={`flex items-center gap-2 text-sm font-semibold ${
                                dark ? "text-white" : "text-slate-900"
                              }`}
                            >
                              <Sparkles className="h-4 w-4 opacity-70" />
                              {x.title}
                            </div>
                            <div
                              className={`mt-1 text-xs ${
                                dark ? "text-white/70" : "text-slate-600"
                              }`}
                            >
                              {x.note}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3">
                        <button
                          type="button"
                          className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition active:scale-95 ${
                            dark
                              ? "bg-emerald-300 text-slate-950 hover:bg-emerald-200"
                              : "bg-emerald-600 text-white hover:bg-emerald-500"
                          }`}
                        >
                          Build my plan <ArrowRight className="h-4 w-4" />
                        </button>
                        <div
                          className={`mt-2 text-[0.72rem] ${
                            dark ? "text-white/55" : "text-slate-600"
                          }`}
                        >
                          Prototype only (button doesn’t do anything yet).
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </AppChrome>
  );
}
