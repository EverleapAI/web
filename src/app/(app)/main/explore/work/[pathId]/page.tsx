// apps/web/src/app/(app)/main/explore/work/[pathId]/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

import { requireWorkPath } from "../_data/workPaths";
import {
  getWorkAgenticOpening,
  readStoredFirstName,
} from "../_data/getWorkAgenticOpening";
import { WorkPathSubnav } from "../components/WorkPathSubnav";

/* =============================================================================
   Helpers
============================================================================= */

function rgb(value: { r: number; g: number; b: number }, alpha = 1) {
  return `rgba(${value.r}, ${value.g}, ${value.b}, ${alpha})`;
}

function shellSurface(dark: boolean) {
  return dark
    ? "border border-white/10 bg-white/[0.055] backdrop-blur-2xl"
    : "border border-black/10 bg-white/80 backdrop-blur-2xl";
}

function textMain(dark: boolean) {
  return dark ? "text-white/92" : "text-slate-950";
}

function textSoft(dark: boolean) {
  return dark ? "text-white/68" : "text-slate-700";
}

function textFaint(dark: boolean) {
  return dark ? "text-white/52" : "text-slate-500";
}

function scoreWidth(score: number) {
  return `${Math.max(0, Math.min(100, score))}%`;
}

/* =============================================================================
   Page
============================================================================= */

export default function WorkPathDetailPage() {
  const params = useParams<{ pathId: string }>();
  const pathId = typeof params?.pathId === "string" ? params.pathId : "";

  if (!pathId) notFound();

  let path;
  try {
    path = requireWorkPath(pathId);
  } catch {
    notFound();
  }

  const dark = true;
  const [firstName, setFirstName] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFirstName(readStoredFirstName());
  }, []);

  const agenticOpening = React.useMemo(
    () =>
      getWorkAgenticOpening({
        pageKind: "overview",
        pathId: path.id,
        firstName,
      }),
    [path.id, firstName]
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 14% 18%, ${rgb(path.theme.accent, 0.18)} 0%, transparent 30%),
              radial-gradient(circle at 82% 16%, ${rgb(path.theme.glow, 0.2)} 0%, transparent 26%),
              radial-gradient(circle at 68% 78%, ${rgb(path.theme.accentStrong, 0.14)} 0%, transparent 28%),
              linear-gradient(180deg, rgba(4,10,18,0.96) 0%, rgba(7,17,31,0.98) 38%, rgba(4,9,18,1) 100%)
            `,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.16]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/main/explore/work"
            className={[
              "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition",
              shellSurface(dark),
              textSoft(dark),
              "hover:bg-white/[0.08]",
            ].join(" ")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Work
          </Link>

          <div
            className={[
              "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.18em]",
              shellSurface(dark),
              "text-white/70",
            ].join(" ")}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {path.theme.surfaceLabel}
          </div>
        </div>

        <WorkPathSubnav pathSlug={path.slug} />

        <section
          className={[
            "relative overflow-hidden rounded-[32px] px-5 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10",
            shellSurface(dark),
            "shadow-[0_30px_120px_rgba(0,0,0,0.34)]",
          ].join(" ")}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{
              background: `
                radial-gradient(circle at 12% 18%, ${rgb(path.theme.accent, 0.2)} 0%, transparent 30%),
                radial-gradient(circle at 85% 15%, ${rgb(path.theme.glow, 0.18)} 0%, transparent 26%)
              `,
            }}
          />

          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="min-w-0">
              <div className="max-w-3xl rounded-[26px] border border-white/10 bg-white/[0.05] px-4 py-4 backdrop-blur-xl sm:px-5 sm:py-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/42">
                  Everleap read
                </div>
                <p className="mt-2 text-[15px] leading-7 text-white/90 sm:text-[16px]">
                  {agenticOpening.intro}
                </p>
                <p className="mt-2 text-sm leading-7 text-white/70 sm:text-[15px]">
                  {agenticOpening.body}
                </p>
                <p className="mt-3 text-sm leading-7 text-white/62 sm:text-[15px]">
                  {agenticOpening.bridge}
                </p>
              </div>

              <div
                className={`mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] ${textFaint(
                  dark
                )}`}
              >
                {path.hero.eyebrow}
              </div>

              <h1
                className={`mt-3 text-4xl font-semibold tracking-tight sm:text-5xl ${textMain(
                  dark
                )}`}
              >
                {path.hero.title}
              </h1>

              <p className={`mt-4 max-w-3xl text-lg leading-8 ${textSoft(dark)}`}>
                {path.hero.hook}
              </p>

              <p
                className={`mt-5 max-w-3xl text-sm leading-7 sm:text-[15px] ${textSoft(
                  dark
                )}`}
              >
                {path.hero.summary}
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {path.traitChips.map((chip) => (
                  <span
                    key={chip.id}
                    className="inline-flex items-center rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-xl"
                  >
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 self-start">
              {path.hero.whyItPullsYouIn.map((item, index) => (
                <div
                  key={`${path.id}_pull_${index}`}
                  className="rounded-[24px] border border-white/10 bg-white/[0.05] px-4 py-4 backdrop-blur-xl"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    What in you this may be answering
                  </div>
                  <div className="mt-2 text-sm leading-6 text-white/82">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div
            className={[
              "rounded-[28px] px-5 py-5 sm:px-6 sm:py-6",
              shellSurface(dark),
            ].join(" ")}
          >
            <div
              className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${textFaint(
                dark
              )}`}
            >
              Fit signals
            </div>

            <div className="mt-4 space-y-4">
              {path.fitSignals.map((signal) => (
                <div
                  key={signal.id}
                  className="rounded-[22px] border border-white/8 bg-white/[0.04] px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className={`text-sm font-semibold ${textMain(dark)}`}>
                      {signal.label}
                    </div>
                    <div className="text-xs font-semibold text-white/58">
                      {signal.score}
                    </div>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: scoreWidth(signal.score),
                        background: `linear-gradient(90deg, ${rgb(
                          path.theme.accent,
                          0.95
                        )} 0%, ${rgb(path.theme.accentStrong, 0.98)} 100%)`,
                        boxShadow: `0 0 24px ${rgb(path.theme.glow, 0.45)}`,
                      }}
                    />
                  </div>

                  <p className={`mt-3 text-sm leading-6 ${textSoft(dark)}`}>
                    {signal.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className={[
              "rounded-[28px] px-5 py-5 sm:px-6 sm:py-6",
              shellSurface(dark),
            ].join(" ")}
          >
            <div
              className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${textFaint(
                dark
              )}`}
            >
              Snapshot
            </div>

            <div className="mt-4 grid gap-3">
              {path.snapshotStats.map((stat) => (
                <div
                  key={stat.id}
                  className="rounded-[22px] border border-white/8 bg-white/[0.04] px-4 py-4"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/42">
                    {stat.label}
                  </div>
                  <div className={`mt-2 text-base font-semibold ${textMain(dark)}`}>
                    {stat.value}
                  </div>
                  {stat.note ? (
                    <div className={`mt-1 text-sm ${textSoft(dark)}`}>{stat.note}</div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className={[
            "rounded-[28px] px-5 py-5 sm:px-6 sm:py-6",
            shellSurface(dark),
          ].join(" ")}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div
                className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${textFaint(
                  dark
                )}`}
              >
                Specialties
              </div>
              <h2
                className={`mt-2 text-2xl font-semibold tracking-tight ${textMain(
                  dark
                )}`}
              >
                Where this path can branch
              </h2>
              <p className={`mt-2 max-w-2xl text-sm leading-6 ${textSoft(dark)}`}>
                Different versions of this work emphasize different strengths. Some
                people light up around systems, some around space and pacing, and
                some around story and player emotion.
              </p>
            </div>

            <Link
              href={`/main/explore/work/${path.slug}/specialties`}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/82 transition hover:bg-white/[0.1]"
            >
              All specialties
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {path.specialtyPreviews.map((specialty) => (
              <div
                key={specialty.id}
                className="rounded-[24px] border border-white/10 bg-white/[0.05] px-4 py-4 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className={`text-base font-semibold ${textMain(dark)}`}>
                    {specialty.title}
                  </div>

                  {specialty.energy ? (
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/56">
                      {specialty.energy.replace("-", " ")}
                    </span>
                  ) : null}
                </div>

                <div className={`mt-2 text-sm leading-6 ${textSoft(dark)}`}>
                  {specialty.oneLiner}
                </div>
                <div className={`mt-3 text-sm leading-6 ${textFaint(dark)}`}>
                  {specialty.whyItCouldFit}
                </div>

                <Link
                  href={`/main/explore/work/${path.slug}/specialties/${specialty.slug}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
                >
                  Open specialty
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Link
            href={`/main/explore/work/${path.slug}/day`}
            className={[
              "group rounded-[26px] px-5 py-5 transition hover:bg-white/[0.08]",
              shellSurface(dark),
            ].join(" ")}
          >
            <div
              className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${textFaint(
                dark
              )}`}
            >
              Day in the life
            </div>
            <div className={`mt-2 text-xl font-semibold ${textMain(dark)}`}>
              {path.dayInLife.title}
            </div>
            <div className={`mt-2 text-sm leading-6 ${textSoft(dark)}`}>
              {path.dayInLife.summary}
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/78 group-hover:text-white">
              Open page
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          <Link
            href={`/main/explore/work/${path.slug}/forecast`}
            className={[
              "group rounded-[26px] px-5 py-5 transition hover:bg-white/[0.08]",
              shellSurface(dark),
            ].join(" ")}
          >
            <div
              className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${textFaint(
                dark
              )}`}
            >
              Forecast
            </div>
            <div className={`mt-2 text-xl font-semibold ${textMain(dark)}`}>
              {path.forecast.title}
            </div>
            <div className={`mt-2 text-sm leading-6 ${textSoft(dark)}`}>
              {path.forecast.summary}
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/78 group-hover:text-white">
              Open page
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          <Link
            href={`/main/explore/work/${path.slug}/next-steps`}
            className={[
              "group rounded-[26px] px-5 py-5 transition hover:bg-white/[0.08]",
              shellSurface(dark),
            ].join(" ")}
          >
            <div
              className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${textFaint(
                dark
              )}`}
            >
              Next steps
            </div>
            <div className={`mt-2 text-xl font-semibold ${textMain(dark)}`}>
              {path.nextSteps.title}
            </div>
            <div className={`mt-2 text-sm leading-6 ${textSoft(dark)}`}>
              {path.nextSteps.summary}
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/78 group-hover:text-white">
              Open page
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}