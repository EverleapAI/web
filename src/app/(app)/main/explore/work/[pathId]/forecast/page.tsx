// apps/web/src/app/(app)/main/explore/work/[pathId]/forecast/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, TrendingUp } from "lucide-react";

import { requireWorkPath } from "../../_data/workPaths";
import {
  getWorkAgenticOpening,
  readStoredFirstName,
} from "../../_data/getWorkAgenticOpening";
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

function sectionKicker(dark: boolean) {
  return `text-[11px] font-semibold uppercase tracking-[0.2em] ${textFaint(dark)}`;
}

/* =============================================================================
   Page
============================================================================= */

export default function WorkPathForecastPage() {
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

  const opening = React.useMemo(
    () =>
      getWorkAgenticOpening({
        pageKind: "forecast",
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
              radial-gradient(circle at 16% 20%, ${rgb(path.theme.accent, 0.18)} 0%, transparent 30%),
              radial-gradient(circle at 82% 16%, ${rgb(path.theme.glow, 0.18)} 0%, transparent 28%),
              radial-gradient(circle at 68% 78%, ${rgb(path.theme.accentStrong, 0.14)} 0%, transparent 30%),
              linear-gradient(180deg, rgba(4,10,18,0.96) 0%, rgba(7,17,31,0.98) 40%, rgba(4,9,18,1) 100%)
            `,
          }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <Link
          href={`/main/explore/work/${path.slug}`}
          className={[
            "inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition",
            shellSurface(dark),
            textSoft(dark),
            "hover:bg-white/[0.08]",
          ].join(" ")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to overview
        </Link>

        <WorkPathSubnav pathSlug={path.slug} />

        <section
          className={[
            "relative overflow-hidden rounded-[32px] px-6 py-8",
            shellSurface(dark),
            "shadow-[0_30px_120px_rgba(0,0,0,0.34)]",
          ].join(" ")}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{
              background: `
                radial-gradient(circle at 14% 18%, ${rgb(path.theme.accent, 0.16)} 0%, transparent 30%),
                radial-gradient(circle at 84% 18%, ${rgb(path.theme.glow, 0.14)} 0%, transparent 28%)
              `,
            }}
          />

          <div className="relative max-w-4xl">
            <div className={sectionKicker(dark)}>Forecast</div>

            <h1
              className={`mt-3 text-4xl font-semibold tracking-tight sm:text-5xl ${textMain(
                dark
              )}`}
            >
              {path.forecast.title}
            </h1>

            <p className={`mt-4 max-w-3xl text-lg leading-8 ${textSoft(dark)}`}>
              {path.forecast.summary}
            </p>

            <div className="mt-7 max-w-3xl rounded-[26px] border border-white/10 bg-white/[0.05] px-4 py-4 backdrop-blur-xl sm:px-5 sm:py-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/42">
                What this arc may tell you
              </div>
              <p className="mt-2 text-[15px] leading-7 text-white/90 sm:text-[16px]">
                {opening.intro}
              </p>
              <p className="mt-2 text-sm leading-7 text-white/70 sm:text-[15px]">
                {opening.body}
              </p>
              <p className="mt-3 text-sm leading-7 text-white/62 sm:text-[15px]">
                {opening.bridge}
              </p>
            </div>
          </div>
        </section>

        <section
          className={[
            "rounded-[28px] px-5 py-5 sm:px-6 sm:py-6",
            shellSurface(dark),
          ].join(" ")}
        >
          <div className="max-w-3xl">
            <div className={sectionKicker(dark)}>How momentum usually builds</div>
            <h2
              className={`mt-2 text-2xl font-semibold tracking-tight ${textMain(
                dark
              )}`}
            >
              How a path starts feeling more real over time
            </h2>
            <p className={`mt-2 text-sm leading-6 ${textSoft(dark)}`}>
              These stages are not rigid checkpoints. They are a way of seeing how
              interest often becomes traction: first through signals, then through
              repeated contact, and eventually through a clearer sense of identity
              inside the work.
            </p>
          </div>
        </section>

        <section
          className={[
            "rounded-[28px] px-5 py-5 sm:px-6 sm:py-6",
            shellSurface(dark),
          ].join(" ")}
        >
          <div className="divide-y divide-white/8">
            {path.forecast.stages.map((stage, index) => (
              <div
                key={stage.id}
                className={index === 0 ? "pb-6" : "pt-6"}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
                    <TrendingUp className="h-4 w-4 text-white/70" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className={`text-lg font-semibold ${textMain(dark)}`}>
                        {stage.label}
                      </div>

                      <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/60">
                        {stage.timeframe}
                      </div>

                      <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/60">
                        Stage {index + 1}
                      </div>
                    </div>

                    <p className={`mt-3 max-w-3xl text-sm leading-7 ${textSoft(dark)}`}>
                      {stage.summary}
                    </p>

                    <div className="mt-4">
                      <div className={sectionKicker(dark)}>Signals of progress</div>

                      <div className="mt-3 divide-y divide-white/8">
                        {stage.signalsOfProgress.map((signal, signalIndex) => (
                          <div
                            key={signal}
                            className={signalIndex === 0 ? "pb-3" : "pt-3"}
                          >
                            <div className={`text-sm leading-7 ${textSoft(dark)}`}>
                              {signal}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          className={[
            "rounded-[28px] px-5 py-5 sm:px-6 sm:py-6",
            shellSurface(dark),
          ].join(" ")}
        >
          <p className={`max-w-3xl text-sm leading-7 ${textSoft(dark)}`}>
            The point is not to rush toward a finished identity. It is to notice
            whether your evidence is getting stronger — whether the work keeps
            becoming more recognizable, more absorbing, and more worth moving
            toward as you get closer.
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Link
            href={`/main/explore/work/${path.slug}/day`}
            className={[
              "group rounded-[26px] px-5 py-5 transition hover:bg-white/[0.08]",
              shellSurface(dark),
            ].join(" ")}
          >
            <div className={sectionKicker(dark)}>Day in the life</div>

            <div className={`mt-2 text-xl font-semibold ${textMain(dark)}`}>
              {path.dayInLife.title}
            </div>

            <p className={`mt-2 text-sm leading-6 ${textSoft(dark)}`}>
              {path.dayInLife.summary}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white">
              See the rhythm
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
            <div className={sectionKicker(dark)}>Next steps</div>

            <div className={`mt-2 text-xl font-semibold ${textMain(dark)}`}>
              {path.nextSteps.title}
            </div>

            <p className={`mt-2 text-sm leading-6 ${textSoft(dark)}`}>
              {path.nextSteps.summary}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white">
              See the next moves
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}