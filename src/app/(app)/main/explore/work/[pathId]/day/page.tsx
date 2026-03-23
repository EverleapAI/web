// apps/web/src/app/(app)/main/explore/work/[pathId]/day/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  MoonStar,
  Orbit,
  Sparkles,
  SunMedium,
} from "lucide-react";

import { requireWorkPath } from "../../_data/workPaths";
import {
  getWorkAgenticOpening,
  readStoredFirstName,
} from "../../_data/getWorkAgenticOpening";

/* =============================================================================
   Helpers
============================================================================= */

function rgb(v: { r: number; g: number; b: number }, a = 1) {
  return `rgba(${v.r},${v.g},${v.b},${a})`;
}

function getIcon(i: number) {
  const icons = [SunMedium, Orbit, Clock3, MoonStar];
  return icons[i % icons.length];
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

  const [firstName, setFirstName] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFirstName(readStoredFirstName());
  }, []);

  const opening = React.useMemo(
    () =>
      getWorkAgenticOpening({
        pageKind: "day",
        pathId: path.id,
        firstName,
      }),
    [path.id, firstName]
  );

  const introLine =
    opening.intro ||
    "This is less about a rigid schedule and more about the rhythm your attention lives inside.";

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050d18] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 10% 18%, ${rgb(
                path.theme.accent,
                0.26
              )} 0%, transparent 24%),
              radial-gradient(circle at 88% 18%, ${rgb(
                path.theme.glow,
                0.22
              )} 0%, transparent 28%),
              radial-gradient(circle at 70% 76%, ${rgb(
                path.theme.accentStrong,
                0.14
              )} 0%, transparent 28%),
              linear-gradient(180deg, #040b15 0%, #071326 48%, #040a14 100%)
            `,
          }}
        />

        <div
          className="absolute left-[-14%] top-[8%] h-[28rem] w-[28rem] rounded-full blur-3xl"
          style={{
            background: rgb(path.theme.accent, 0.12),
            animation: "floatA 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute right-[-12%] top-[12%] h-[26rem] w-[26rem] rounded-full blur-3xl"
          style={{
            background: rgb(path.theme.glow, 0.12),
            animation: "floatB 22s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[8%] left-[34%] h-[18rem] w-[18rem] rounded-full blur-3xl"
          style={{
            background: rgb(path.theme.accentStrong, 0.08),
            animation: "floatA 24s ease-in-out infinite",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes floatA {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, -18px, 0) scale(1.04);
          }
        }

        @keyframes floatB {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, 20px, 0) scale(1.03);
          }
        }

        @keyframes pulseGlow {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.78;
          }
          50% {
            transform: scale(1.06);
            opacity: 1;
          }
        }
      `}</style>

      <div className="relative mx-auto w-full max-w-5xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <Link
          href={`/main/explore/work/${path.slug}`}
          className="inline-flex items-center gap-2 text-sm text-white/62 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        {/* Only card on the page */}
        <section className="relative mt-6">
          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.055] px-5 py-6 shadow-[0_30px_120px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:px-6 sm:py-7 lg:px-7 lg:py-8">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `
                  radial-gradient(circle at 12% 16%, ${rgb(
                    path.theme.accent,
                    0.2
                  )} 0%, transparent 28%),
                  radial-gradient(circle at 86% 22%, ${rgb(
                    path.theme.glow,
                    0.2
                  )} 0%, transparent 30%),
                  linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 50%, rgba(255,255,255,0.04) 100%)
                `,
              }}
            />

            <div className="relative grid gap-6 sm:grid-cols-[minmax(0,1fr)_112px] sm:items-center">
              <div className="max-w-2xl">
                <div className="text-[11px] uppercase tracking-[0.25em] text-white/42">
                  Day in the life
                </div>

                <h1 className="mt-3 text-[2.3rem] font-semibold leading-[0.98] tracking-tight sm:text-[3.15rem]">
                  {path.dayInLife.title}
                </h1>

                <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/72 sm:text-[16px]">
                  {path.dayInLife.summary}
                </p>

                <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/88 sm:text-[16px]">
                  {introLine}
                </p>
              </div>

              <div className="relative hidden sm:flex sm:justify-end">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-[26px] border border-white/10 bg-white/[0.06] backdrop-blur-xl">
                  <div
                    className="absolute inset-[10px] rounded-[20px] border border-white/10"
                    style={{
                      animation: "pulseGlow 5s ease-in-out infinite",
                    }}
                  />
                  <div
                    className="absolute inset-[18px] rounded-full blur-2xl"
                    style={{
                      background: `radial-gradient(circle, ${rgb(
                        path.theme.accentStrong,
                        0.42
                      )} 0%, transparent 72%)`,
                    }}
                  />
                  <Sparkles className="relative h-8 w-8 text-white/92" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story flow - no cards */}
        <section className="relative mt-12">
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.24em] text-white/38">
              The pulse
            </div>
            <h2 className="mt-2 text-[1.8rem] font-semibold leading-tight tracking-tight text-white sm:text-[2.35rem]">
              A real day tends to move in beats.
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-white/68 sm:text-[16px]">
              Not perfect. Not glamorous. Just the repeated pattern of focus,
              decisions, people, pressure, and small wins that starts to feel
              normal when this kind of work becomes your actual week.
            </p>
          </div>
        </section>

        <section className="relative mt-8 space-y-9 sm:space-y-10">
          {path.dayInLife.moments.map((m, i) => {
            const Icon = getIcon(i);

            const wash =
              i % 2 === 0
                ? `radial-gradient(circle at 14% 50%, ${rgb(
                    path.theme.accent,
                    0.18
                  )} 0%, transparent 42%)`
                : `radial-gradient(circle at 86% 50%, ${rgb(
                    path.theme.glow,
                    0.18
                  )} 0%, transparent 42%)`;

            const lineGlow =
              i % 2 === 0
                ? `linear-gradient(90deg, ${rgb(
                    path.theme.accent,
                    0.18
                  )} 0%, rgba(255,255,255,0.015) 52%, transparent 100%)`
                : `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.015) 48%, ${rgb(
                    path.theme.glow,
                    0.18
                  )} 100%)`;

            return (
              <article key={m.id} className="relative">
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: wash }}
                />
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-full"
                  style={{
                    background: lineGlow,
                    filter: "blur(22px)",
                  }}
                />

                <div className="relative flex items-start gap-4 sm:gap-5">
                  <div className="relative mt-1 shrink-0">
                    <div
                      className="absolute inset-0 rounded-full blur-xl"
                      style={{
                        background:
                          i % 2 === 0
                            ? rgb(path.theme.accent, 0.24)
                            : rgb(path.theme.glow, 0.24),
                      }}
                    />
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-lg">
                      <Icon className="h-4 w-4 text-white/82" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-white/38">
                      {m.timeLabel}
                    </div>

                    <h3 className="mt-2 text-[1.28rem] font-semibold leading-tight text-white sm:text-[1.55rem]">
                      {m.title}
                    </h3>

                    <p className="mt-2 max-w-2xl text-[15px] leading-7 text-white/70 sm:text-[16px]">
                      {m.body}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Links - not cards */}
        <section className="mt-14 grid gap-8 sm:grid-cols-2">
          <Link
            href={`/main/explore/work/${path.slug}/forecast`}
            className="group relative"
          >
            <div
              className="pointer-events-none absolute -inset-x-3 -inset-y-3 opacity-0 blur-2xl transition duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at 18% 40%, ${rgb(
                  path.theme.accent,
                  0.18
                )} 0%, transparent 48%)`,
              }}
            />
            <div className="relative">
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">
                Forecast
              </div>
              <div className="mt-2 text-[1.1rem] font-semibold text-white sm:text-[1.2rem]">
                {path.forecast.title}
              </div>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/62">
                {path.forecast.summary}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/78 transition group-hover:text-white">
                See the arc
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          <Link
            href={`/main/explore/work/${path.slug}/next-steps`}
            className="group relative"
          >
            <div
              className="pointer-events-none absolute -inset-x-3 -inset-y-3 opacity-0 blur-2xl transition duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at 82% 40%, ${rgb(
                  path.theme.glow,
                  0.18
                )} 0%, transparent 48%)`,
              }}
            />
            <div className="relative">
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">
                Next steps
              </div>
              <div className="mt-2 text-[1.1rem] font-semibold text-white sm:text-[1.2rem]">
                {path.nextSteps.title}
              </div>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/62">
                {path.nextSteps.summary}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/78 transition group-hover:text-white">
                See the next moves
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}