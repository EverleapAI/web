// apps/web/src/app/(app)/main/explore/work/[pathId]/day/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

import { requireWorkPath } from "../../_data/workPaths";
import { WorkPathSubnav } from "../../components/WorkPathSubnav";

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
  return dark ? "text-white/70" : "text-slate-700";
}

function textFaint(dark: boolean) {
  return dark ? "text-white/50" : "text-slate-500";
}

/* =============================================================================
   Page
============================================================================= */

export default function WorkPathDayPage() {
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

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      {/* background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 16% 20%, ${rgb(path.theme.accent, 0.18)} 0%, transparent 30%),
              radial-gradient(circle at 82% 16%, ${rgb(path.theme.glow, 0.18)} 0%, transparent 28%),
              radial-gradient(circle at 68% 78%, ${rgb(path.theme.accentStrong, 0.14)} 0%, transparent 30%),
              linear-gradient(180deg, rgba(4,10,18,0.96) 0%, rgba(7,17,31,0.98) 40%, rgba(4,9,18,1) 100%)
            `,
          }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        {/* back */}
        <Link
          href={`/main/explore/work/${path.slug}`}
          className={[
            "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition w-fit",
            shellSurface(dark),
            textSoft(dark),
            "hover:bg-white/[0.08]",
          ].join(" ")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to overview
        </Link>

        {/* subnav */}
        <WorkPathSubnav pathSlug={path.slug} />

        {/* hero */}
        <section
          className={[
            "relative overflow-hidden rounded-[32px] px-6 py-8",
            shellSurface(dark),
            "shadow-[0_30px_120px_rgba(0,0,0,0.34)]",
          ].join(" ")}
        >
          <div className="max-w-3xl">
            <div className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${textFaint(dark)}`}>
              Day in the life
            </div>

            <h1 className={`mt-3 text-4xl font-semibold tracking-tight sm:text-5xl ${textMain(dark)}`}>
              {path.dayInLife.title}
            </h1>

            <p className={`mt-4 text-lg leading-8 ${textSoft(dark)}`}>
              {path.dayInLife.summary}
            </p>
          </div>
        </section>

        {/* timeline */}
        <section className="grid gap-4">
          {path.dayInLife.moments.map((moment) => (
            <div
              key={moment.id}
              className={[
                "rounded-[26px] px-6 py-6",
                shellSurface(dark),
              ].join(" ")}
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center rounded-full border border-white/10 bg-white/[0.05] h-10 w-10 shrink-0">
                  <Clock className="h-4 w-4 text-white/70" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className={`text-sm font-semibold ${textMain(dark)}`}>
                      {moment.title}
                    </div>

                    <div className={`text-xs font-medium ${textFaint(dark)}`}>
                      {moment.timeLabel}
                    </div>
                  </div>

                  <p className={`mt-2 text-sm leading-6 ${textSoft(dark)}`}>
                    {moment.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* navigation forward */}
        <section className="grid gap-4 lg:grid-cols-2">
          <Link
            href={`/main/explore/work/${path.slug}/forecast`}
            className={[
              "group rounded-[26px] px-5 py-5 transition hover:bg-white/[0.08]",
              shellSurface(dark),
            ].join(" ")}
          >
            <div className={`text-[11px] uppercase tracking-[0.2em] ${textFaint(dark)}`}>
              Forecast
            </div>

            <div className={`mt-2 text-xl font-semibold ${textMain(dark)}`}>
              {path.forecast.title}
            </div>

            <p className={`mt-2 text-sm leading-6 ${textSoft(dark)}`}>
              {path.forecast.summary}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white">
              Continue
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
            <div className={`text-[11px] uppercase tracking-[0.2em] ${textFaint(dark)}`}>
              Next steps
            </div>

            <div className={`mt-2 text-xl font-semibold ${textMain(dark)}`}>
              {path.nextSteps.title}
            </div>

            <p className={`mt-2 text-sm leading-6 ${textSoft(dark)}`}>
              {path.nextSteps.summary}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white">
              Continue
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}