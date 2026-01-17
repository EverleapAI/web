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

import education from "@/app/main/explore/content/education";
import type { ExploreOpportunity, ExploreOpportunityGroup } from "../../content/types";

type Topic = {
  id: string;
  title: string;
  icon: string;
  spoken: string[]; // audio-ready paragraphs

  // NEW: buckets (local / national / online)
  opportunities?: ExploreOpportunityGroup;

  // Optional: “Tiny plan” ideas (kept prototype-simple)
  nextMoves?: { title: string; note: string }[];
};

const ZIP_DEFAULT = "94901";

// Build topic map from the canonical lane content (education.ts)
const TOPICS: Record<string, Topic> = Object.fromEntries(
  (education.cards ?? []).map((c) => {
    const spoken = String(c.short ?? "")
      .replace(/\r\n/g, "\n")
      .trim()
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    const nextMoves =
      (education.nextMoves ?? []).slice(0, 3).map((m) => ({
        title: m.title,
        note: m.blurb,
      })) ?? [];

    return [
      c.id,
      {
        id: c.id,
        title: c.title,
        icon: c.icon ?? "🎓",
        spoken,
        opportunities: c.opportunities,
        nextMoves,
      } satisfies Topic,
    ];
  })
);

function safeParam(v: unknown): string {
  if (Array.isArray(v)) return String(v[0] ?? "");
  return String(v ?? "");
}

function titleForTopicId(topicId: string): string {
  return TOPICS[topicId]?.title ?? "Education deep dive";
}

function OppCard({
  item,
  dark,
  icon,
}: {
  item: ExploreOpportunity;
  dark: boolean;
  icon: React.ReactNode;
}) {
  const titleC = dark ? "text-white" : "text-slate-900";
  const muted = dark ? "text-white/70" : "text-slate-600";
  const sub = [item.provider, item.location].filter(Boolean).join(" • ");

  const body = (
    <>
      <div className={`flex items-center gap-2 text-sm font-semibold ${titleC}`}>
        {icon}
        <span className="truncate">{item.name}</span>
      </div>

      {sub ? <div className={`mt-1 text-xs ${muted}`}>{sub}</div> : null}

      {item.note ? (
        <div className={`mt-1 text-sm ${dark ? "text-white/75" : "text-slate-700"}`}>
          {item.note}
        </div>
      ) : null}

      {item.meta ? <div className={`mt-2 text-[0.72rem] ${muted}`}>{item.meta}</div> : null}
    </>
  );

  if (item.url && item.url.trim().length) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className={`block rounded-2xl border p-3 transition active:scale-[0.99] ${
          dark
            ? "border-white/10 bg-white/5 hover:bg-white/10"
            : "border-black/10 bg-white hover:bg-slate-50"
        }`}
      >
        {body}
      </a>
    );
  }

  return (
    <div
      className={`rounded-2xl border p-3 ${
        dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white"
      }`}
    >
      {body}
    </div>
  );
}

function Bucket({
  title,
  subtitle,
  icon,
  items,
  dark,
  panel,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  items: ExploreOpportunity[];
  dark: boolean;
  panel: string;
}) {
  if (!items.length) return null;

  return (
    <div className={`rounded-3xl border p-4 ${panel}`}>
      <div
        className={`text-xs font-semibold uppercase tracking-[0.2em] ${
          dark ? "text-white/60" : "text-slate-500"
        }`}
      >
        {title}
      </div>

      {subtitle ? (
        <div className={`mt-1 text-xs ${dark ? "text-white/55" : "text-slate-600"}`}>
          {subtitle}
        </div>
      ) : null}

      <div className="mt-3 space-y-3">
        {items.slice(0, 8).map((x, idx) => (
          <OppCard key={`${title}-${idx}-${x.name}`} item={x} dark={dark} icon={icon} />
        ))}
      </div>

      {items.length > 8 ? (
        <div className={`mt-3 text-[0.72rem] ${dark ? "text-white/55" : "text-slate-600"}`}>
          + {items.length - 8} more (we can show these later as “More options”)
        </div>
      ) : null}
    </div>
  );
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
  const laneShell = dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white";
  const laneGlow = dark
    ? "bg-gradient-to-br from-emerald-500/22 via-teal-400/12 to-cyan-500/10"
    : "bg-gradient-to-br from-emerald-400/25 via-teal-300/14 to-cyan-300/12";

  const showNotFound = !topic;

  const opp = topic?.opportunities;
  const hasOpp =
    Boolean((opp?.local?.length ?? 0) + (opp?.national?.length ?? 0) + (opp?.online?.length ?? 0));

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
              <div className={`mt-0.5 text-sm ${dark ? "text-white/70" : "text-slate-600"}`}>
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
                  <h1 className={`text-lg font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                    {topic?.title ?? "Topic not found"}
                  </h1>
                  <div className={`mt-1 text-sm ${dark ? "text-white/70" : "text-slate-600"}`}>
                    This page turns your interest into real options: local doors, bigger programs, and online paths.
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
                  <div className={`mt-1 text-sm ${dark ? "text-white/70" : "text-slate-600"}`}>
                    Totally normal for the prototype. Pick a topic from Education and you’ll land on a real page.
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
                      <p key={i} className={`text-sm ${dark ? "text-white/75" : "text-slate-700"}`}>
                        {p}
                      </p>
                    ))}
                  </div>

                  {/* Buckets: Local + National + Online */}
                  {hasOpp ? (
                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Bucket
                        title="Near you"
                        subtitle={`Based on ZIP ${ZIP_DEFAULT} (prototype).`}
                        icon={<MapPin className="h-4 w-4 opacity-70" />}
                        items={opp?.local ?? []}
                        dark={dark}
                        panel={panel}
                      />

                      <Bucket
                        title="Bigger programs"
                        subtitle="Recognizable programs you can apply to or join."
                        icon={<Sparkles className="h-4 w-4 opacity-70" />}
                        items={opp?.national ?? []}
                        dark={dark}
                        panel={panel}
                      />

                      <div className="sm:col-span-2">
                        <Bucket
                          title="Online anytime"
                          subtitle="Start today. Finish something small. Then decide."
                          icon={<Sparkles className="h-4 w-4 opacity-70" />}
                          items={opp?.online ?? []}
                          dark={dark}
                          panel={panel}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className={`mt-5 rounded-3xl border p-4 ${panel}`}>
                      <div
                        className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                          dark ? "text-white/60" : "text-slate-500"
                        }`}
                      >
                        Options coming soon
                      </div>
                      <div className={`mt-1 text-sm ${dark ? "text-white/70" : "text-slate-600"}`}>
                        This topic doesn’t have opportunity lists yet. Add them in{" "}
                        <span className="font-mono text-[0.9em]">education.ts</span> under{" "}
                        <span className="font-mono text-[0.9em]">cards[].opportunities</span>.
                      </div>
                    </div>
                  )}

                  {/* Mini plan (optional, uses lane nextMoves) */}
                  {topic.nextMoves?.length ? (
                    <div className="mt-5">
                      <div
                        className={`text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${
                          dark ? "text-white/60" : "text-slate-500"
                        }`}
                      >
                        A tiny plan (7 days)
                      </div>

                      <div className="mt-3 space-y-3">
                        {topic.nextMoves.slice(0, 3).map((m) => (
                          <div
                            key={m.title}
                            className={`rounded-2xl border p-3 ${
                              dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white"
                            }`}
                          >
                            <div className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                              {m.title}
                            </div>
                            <div className={`mt-1 text-sm ${dark ? "text-white/70" : "text-slate-600"}`}>
                              {m.note}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4">
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
                        <div className={`mt-2 text-[0.72rem] ${dark ? "text-white/55" : "text-slate-600"}`}>
                          Prototype only (button doesn’t do anything yet).
                        </div>
                      </div>
                    </div>
                  ) : null}
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
