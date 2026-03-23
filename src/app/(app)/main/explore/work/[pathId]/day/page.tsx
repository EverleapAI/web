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

function rgb(value: { r: number; g: number; b: number }, alpha = 1) {
  return `rgba(${value.r}, ${value.g}, ${value.b}, ${alpha})`;
}

function textMain(dark: boolean) {
  return dark ? "text-white/[0.96]" : "text-slate-950";
}

function textSoft(dark: boolean) {
  return dark ? "text-white/72" : "text-slate-700";
}

function textFaint(dark: boolean) {
  return dark ? "text-white/48" : "text-slate-500";
}

function sectionKicker(dark: boolean) {
  return `text-[11px] font-semibold uppercase tracking-[0.24em] ${textFaint(
    dark
  )}`;
}

function heroSurface(dark: boolean) {
  return dark
    ? "border border-white/10 bg-white/[0.06] backdrop-blur-2xl"
    : "border border-black/10 bg-white/80 backdrop-blur-2xl";
}

function linkSurface(dark: boolean) {
  return dark
    ? "border border-white/10 bg-white/[0.04] backdrop-blur-xl"
    : "border border-black/10 bg-white/80 backdrop-blur-xl";
}

function getMomentIcon(index: number) {
  const icons = [SunMedium, Orbit, Clock3, MoonStar];
  return icons[index % icons.length];
}

function getMomentGlow(
  index: number,
  theme: {
    accent: { r: number; g: number; b: number };
    accentStrong: { r: number; g: number; b: number };
    glow: { r: number; g: number; b: number };
  }
) {
  const glows = [
    {
      orb: rgb(theme.accent, 0.34),
      wash: `radial-gradient(circle at 18% 28%, ${rgb(
        theme.accent,
        0.18
      )} 0%, transparent 54%)`,
      line: rgb(theme.accent, 0.26),
    },
    {
      orb: rgb(theme.glow, 0.32),
      wash: `radial-gradient(circle at 82% 26%, ${rgb(
        theme.glow,
        0.18
      )} 0%, transparent 54%)`,
      line: rgb(theme.glow, 0.24),
    },
    {
      orb: rgb(theme.accentStrong, 0.3),
      wash: `radial-gradient(circle at 24% 78%, ${rgb(
        theme.accentStrong,
        0.16
      )} 0%, transparent 54%)`,
      line: rgb(theme.accentStrong, 0.22),
    },
    {
      orb: rgb(theme.glow, 0.28),
      wash: `radial-gradient(circle at 78% 76%, ${rgb(
        theme.glow,
        0.16
      )} 0%, transparent 54%)`,
      line: rgb(theme.glow, 0.2),
    },
  ];

  return glows[index % glows.length];
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
    "This is less about a rigid schedule and more about the pattern your attention lives inside.";
  const bridgeLine =
    opening.bridge ||
    "The real question is whether that rhythm feels like something you would want to grow into.";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 10% 12%, ${rgb(path.theme.accent, 0.22)} 0%, transparent 24%),
              radial-gradient(circle at 90% 14%, ${rgb(path.theme.glow, 0.22)} 0%, transparent 26%),
              radial-gradient(circle at 72% 72%, ${rgb(path.theme.accentStrong, 0.14)} 0%, transparent 28%),
              linear-gradient(180deg, rgba(4,10,18,0.95) 0%, rgba(7,17,31,0.98) 42%, rgba(4,9,18,1) 100%)
            `,
          }}
        />
        <div
          className="absolute left-[-8%] top-[12%] h-[18rem] w-[18rem] rounded-full blur-3xl md:h-[26rem] md:w-[26rem]"
          style={{
            background: rgb(path.theme.accent, 0.1),
            animation: "floatSlow 16s ease-in-out infinite",
          }}
        />
        <div
          className="absolute right-[-8%] top-[18%] h-[16rem] w-[16rem] rounded-full blur-3xl md:h-[22rem] md:w-[22rem]"
          style={{
            background: rgb(path.theme.glow, 0.11),
            animation: "floatSlow 20s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute bottom-[10%] left-[30%] h-[12rem] w-[12rem] rounded-full blur-3xl md:h-[16rem] md:w-[16rem]"
          style={{
            background: rgb(path.theme.accentStrong, 0.08),
            animation: "floatSlow 24s ease-in-out infinite",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes floatSlow {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, -12px, 0) scale(1.03);
          }
        }

        @keyframes pulseRing {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        @keyframes driftX {
          0%,
          100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(8px);
          }
        }
      `}</style>

      <div className="relative mx-auto w-full max-w-5xl px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <Link
          href={`/main/explore/work/${path.slug}`}
          className={[
            "inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition",
            linkSurface(dark),
            textSoft(dark),
            "hover:bg-white/[0.08] hover:text-white",
          ].join(" ")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to overview
        </Link>

        <section
          className={[
            "relative mt-6 overflow-hidden rounded-[32px] px-5 py-6 sm:px-6 sm:py-7 lg:px-7 lg:py-8",
            heroSurface(dark),
            "shadow-[0_30px_120px_rgba(0,0,0,0.35)]",
          ].join(" ")}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 12% 16%, ${rgb(path.theme.accent, 0.2)} 0%, transparent 28%),
                radial-gradient(circle at 88% 20%, ${rgb(path.theme.glow, 0.18)} 0%, transparent 28%),
                linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.00) 45%, rgba(255,255,255,0.04) 100%)
              `,
            }}
          />

          <div className="relative">
            <div className="max-w-2xl">
              <div className={sectionKicker(dark)}>Day in the life</div>

              <h1
                className={`mt-3 max-w-2xl text-[2.25rem] font-semibold leading-[0.98] tracking-tight sm:text-[3.4rem] ${textMain(
                  dark
                )}`}
              >
                {path.dayInLife.title}
              </h1>

              <p
                className={`mt-4 max-w-2xl text-[15px] leading-7 sm:text-[16px] ${textSoft(
                  dark
                )}`}
              >
                {path.dayInLife.summary}
              </p>

              <div className="mt-5 max-w-2xl space-y-3">
                <p className="text-[15px] leading-7 text-white/88 sm:text-[16px]">
                  {introLine}
                </p>
                <p className="text-[15px] leading-7 text-white/64 sm:text-[16px]">
                  {bridgeLine}
                </p>
              </div>
            </div>

            <div className="pointer-events-none absolute right-[-0.5rem] top-1/2 hidden -translate-y-1/2 sm:block">
              <div
                className="relative flex h-28 w-28 items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-xl"
                style={{ animation: "driftX 8s ease-in-out infinite" }}
              >
                <div
                  className="absolute inset-[12px] rounded-[22px] border border-white/10"
                  style={{ animation: "pulseRing 5s ease-in-out infinite" }}
                />
                <div
                  className="absolute inset-[24px] rounded-full blur-2xl"
                  style={{
                    background: `radial-gradient(circle, ${rgb(
                      path.theme.accentStrong,
                      0.45
                    )} 0%, transparent 72%)`,
                  }}
                />
                <Sparkles className="relative h-9 w-9 text-white/90" />
              </div>
            </div>
          </div>
        </section>

        <section className="relative mt-10">
          <div className="max-w-2xl">
            <div className={sectionKicker(dark)}>The pulse</div>
            <h2
              className={`mt-2 text-[1.8rem] font-semibold leading-tight tracking-tight sm:text-[2.4rem] ${textMain(
                dark
              )}`}
            >
              A real day tends to move in beats.
            </h2>
            <p className={`mt-3 text-[15px] leading-7 sm:text-[16px] ${textSoft(dark)}`}>
              Not perfect. Not glamorous. Just the repeated pattern of focus,
              decisions, people, pressure, and small wins that starts to feel
              normal when this kind of work becomes your actual week.
            </p>
          </div>
        </section>

        <section className="relative mt-8">
          <div className="space-y-8 sm:space-y-10">
            {path.dayInLife.moments.map((moment, index) => {
              const Icon = getMomentIcon(index);
              const glow = getMomentGlow(index, path.theme);

              return (
                <article
                  key={moment.id}
                  className="relative overflow-hidden rounded-[30px] px-4 py-5 sm:px-5 sm:py-6"
                >
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: glow.wash,
                    }}
                  />

                  <div className="pointer-events-none absolute inset-y-0 left-[1.15rem] w-px sm:left-[1.35rem]">
                    <div
                      className="h-full w-full"
                      style={{
                        background: `linear-gradient(180deg, transparent 0%, ${glow.line} 18%, ${glow.line} 82%, transparent 100%)`,
                      }}
                    />
                  </div>

                  <div className="relative flex items-start gap-4">
                    <div className="relative flex shrink-0 flex-col items-center">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-[#0d1828] sm:h-11 sm:w-11"
                        style={{
                          boxShadow: `0 0 0 1px ${rgb(path.theme.glow, 0.05)}, 0 0 30px ${glow.orb}`,
                        }}
                      >
                        <Icon className="h-4 w-4 text-white/82 sm:h-[18px] sm:w-[18px]" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <div
                          className={`rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${textFaint(
                            dark
                          )}`}
                        >
                          {moment.timeLabel}
                        </div>
                      </div>

                      <h3
                        className={`mt-3 text-[1.25rem] font-semibold leading-tight sm:text-[1.55rem] ${textMain(
                          dark
                        )}`}
                      >
                        {moment.title}
                      </h3>

                      <p
                        className={`mt-3 max-w-2xl text-[15px] leading-7 sm:text-[16px] ${textSoft(
                          dark
                        )}`}
                      >
                        {moment.body}
                      </p>
                    </div>

                    <div className="pointer-events-none absolute right-[-2.5rem] top-1/2 hidden -translate-y-1/2 sm:block">
                      <div
                        className="h-24 w-24 rounded-full blur-3xl"
                        style={{
                          background: glow.orb,
                          opacity: 0.8,
                        }}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="relative mt-10">
          <div
            className="absolute left-0 top-0 h-full w-1 rounded-full"
            style={{
              background: `linear-gradient(180deg, ${rgb(
                path.theme.accent,
                0
              )} 0%, ${rgb(path.theme.accent, 0.36)} 35%, ${rgb(
                path.theme.glow,
                0.16
              )} 100%)`,
            }}
          />
          <div className="pl-5">
            <div className={sectionKicker(dark)}>What to notice</div>
            <p className={`mt-3 max-w-2xl text-[15px] leading-7 sm:text-[16px] ${textSoft(dark)}`}>
              The best signal is not whether one moment sounds impressive. It is
              whether the overall rhythm feels like somewhere your mind would
              become stronger, steadier, and more alive over time.
            </p>
          </div>
        </section>

        <section className="mt-12 grid gap-4 lg:grid-cols-2">
          <Link
            href={`/main/explore/work/${path.slug}/forecast`}
            className={[
              "group relative overflow-hidden rounded-[28px] px-5 py-5 transition",
              linkSurface(dark),
              "hover:bg-white/[0.065]",
            ].join(" ")}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(circle at 16% 22%, ${rgb(
                  path.theme.accent,
                  0.13
                )} 0%, transparent 34%)`,
              }}
            />
            <div className="relative">
              <div className={sectionKicker(dark)}>Forecast</div>
              <div className={`mt-2 text-xl font-semibold ${textMain(dark)}`}>
                {path.forecast.title}
              </div>
              <p className={`mt-2 text-sm leading-6 ${textSoft(dark)}`}>
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
            className={[
              "group relative overflow-hidden rounded-[28px] px-5 py-5 transition",
              linkSurface(dark),
              "hover:bg-white/[0.065]",
            ].join(" ")}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(circle at 84% 18%, ${rgb(
                  path.theme.glow,
                  0.13
                )} 0%, transparent 34%)`,
              }}
            />
            <div className="relative">
              <div className={sectionKicker(dark)}>Next steps</div>
              <div className={`mt-2 text-xl font-semibold ${textMain(dark)}`}>
                {path.nextSteps.title}
              </div>
              <p className={`mt-2 text-sm leading-6 ${textSoft(dark)}`}>
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