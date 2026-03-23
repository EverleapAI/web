// apps/web/src/app/(app)/main/explore/work/[pathId]/day/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Coffee,
  MoonStar,
  Sparkles,
  SunMedium,
  Users,
  Wrench,
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

type StoryTone = "morning" | "midday" | "afternoon" | "evening";

type StoryBeat = {
  id: string;
  label: string;
  title: string;
  body: string;
  tone: StoryTone;
  icon: React.ComponentType<{ className?: string }>;
};

function toneStyles(
  tone: StoryTone,
  theme: {
    accent: { r: number; g: number; b: number };
    accentStrong: { r: number; g: number; b: number };
    glow: { r: number; g: number; b: number };
  }
) {
  switch (tone) {
    case "morning":
      return {
        dot: rgb(theme.accent, 0.72),
        halo: rgb(theme.accent, 0.28),
        label: "text-cyan-200/70",
      };
    case "midday":
      return {
        dot: rgb(theme.glow, 0.72),
        halo: rgb(theme.glow, 0.26),
        label: "text-violet-200/70",
      };
    case "afternoon":
      return {
        dot: rgb(theme.accentStrong, 0.7),
        halo: rgb(theme.accentStrong, 0.26),
        label: "text-sky-200/70",
      };
    case "evening":
    default:
      return {
        dot: rgb(theme.glow, 0.64),
        halo: rgb(theme.glow, 0.22),
        label: "text-fuchsia-200/65",
      };
  }
}

function buildStoryBeats(
  path: ReturnType<typeof requireWorkPath>
): StoryBeat[] {
  const moments = path.dayInLife.moments;

  const beats: StoryBeat[] = [
    {
      id: "morning-start",
      label: moments[0]?.timeLabel ?? "9:15 am",
      title: moments[0]?.title ?? "Settle in and find the first real problem",
      body:
        moments[0]?.body ??
        "You arrive, scan what matters, and get your head back into the shape of the work. The morning is usually less about drama and more about orienting your attention toward something worth moving.",
      tone: "morning",
      icon: SunMedium,
    },
    {
      id: "build-mode",
      label: moments[1]?.timeLabel ?? "11:00 am",
      title: moments[1]?.title ?? "Build, test, and work through friction",
      body:
        moments[1]?.body ??
        "This is where the path becomes real: making, trying, fixing, checking, and adjusting. Some of the work is satisfying, some of it is stubborn, and a lot of it is just staying with the problem long enough to improve it.",
      tone: "midday",
      icon: Wrench,
    },
    {
      id: "lunch-reset",
      label: "12:45 pm",
      title: "Lunch, reset, and the side conversations",
      body:
        "You step out of the tunnel for a minute. Food, a walk, a quick joke, a casual check-in, a hallway thought that unexpectedly unlocks something. A believable day has air in it, not just output.",
      tone: "midday",
      icon: Coffee,
    },
    {
      id: "team-decisions",
      label: moments[2]?.timeLabel ?? "2:00 pm",
      title:
        moments[2]?.title ?? "Talk through decisions with other people in the room",
      body:
        moments[2]?.body ??
        "Some part of the day usually becomes collaborative: clarifying tradeoffs, checking assumptions, deciding what matters now versus later, or translating your thinking so other people can build with you.",
      tone: "afternoon",
      icon: Users,
    },
    {
      id: "late-polish",
      label: moments[3]?.timeLabel ?? "4:30 pm",
      title: moments[3]?.title ?? "Polish, review, and make tomorrow easier",
      body:
        moments[3]?.body ??
        "Late in the day, progress often looks quieter. Tightening something. Cleaning something up. Writing the note your future self will be grateful for. Turning rough work into something cleaner and more solid.",
      tone: "afternoon",
      icon: Sparkles,
    },
    {
      id: "after-work",
      label: "6:15 pm",
      title: "After work, the energy tells the truth",
      body:
        "Sometimes the day ends with a quick team chat, a social moment, a ride home still thinking, or the satisfying feeling that your brain got used well. That is the signal to notice: what kind of tired this work creates.",
      tone: "evening",
      icon: MoonStar,
    },
  ];

  return beats;
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

  const storyBeats = React.useMemo(() => buildStoryBeats(path), [path]);

  const introLine =
    opening.intro ||
    "A good day here is usually not one giant cinematic moment. It is a rhythm of attention, problem-solving, collaboration, and small wins that gradually starts to feel natural.";
  const pulseLine =
    "The question is not whether every minute sounds exciting. It is whether the overall rhythm feels like something your mind would grow stronger inside.";

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050d18] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 10% 16%, ${rgb(
                path.theme.accent,
                0.16
              )} 0%, transparent 26%),
              radial-gradient(circle at 90% 18%, ${rgb(
                path.theme.glow,
                0.18
              )} 0%, transparent 30%),
              linear-gradient(180deg, #050c17 0%, #071224 52%, #040913 100%)
            `,
          }}
        />
        <div
          className="absolute left-[-12%] top-[8%] h-[24rem] w-[24rem] rounded-full blur-3xl"
          style={{
            background: rgb(path.theme.accent, 0.08),
            animation: "floatA 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute right-[-10%] top-[10%] h-[26rem] w-[26rem] rounded-full blur-3xl"
          style={{
            background: rgb(path.theme.glow, 0.1),
            animation: "floatB 22s ease-in-out infinite",
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
            transform: translate3d(0, -14px, 0) scale(1.03);
          }
        }

        @keyframes floatB {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, 16px, 0) scale(1.03);
          }
        }

        @keyframes heroGlow {
          0%,
          100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.04);
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

        <section className="relative mt-6">
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.055] px-5 py-6 shadow-[0_30px_120px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:px-6 sm:py-7 lg:px-8 lg:py-8">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `
                  radial-gradient(circle at 12% 18%, ${rgb(
                    path.theme.accent,
                    0.22
                  )} 0%, transparent 28%),
                  radial-gradient(circle at 82% 18%, ${rgb(
                    path.theme.glow,
                    0.2
                  )} 0%, transparent 30%),
                  linear-gradient(135deg, ${rgb(
                    path.theme.accent,
                    0.12
                  )} 0%, rgba(255,255,255,0.02) 38%, ${rgb(
                  path.theme.glow,
                  0.12
                )} 100%)
                `,
              }}
            />
            <div
              className="pointer-events-none absolute right-[-2rem] top-[-2rem] h-40 w-40 rounded-full blur-3xl"
              style={{
                background: rgb(path.theme.glow, 0.22),
                animation: "heroGlow 6s ease-in-out infinite",
              }}
            />
            <div
              className="pointer-events-none absolute left-[-2rem] bottom-[-3rem] h-40 w-40 rounded-full blur-3xl"
              style={{
                background: rgb(path.theme.accent, 0.18),
                animation: "heroGlow 7s ease-in-out infinite",
              }}
            />

            <div className="relative grid gap-6 sm:grid-cols-[minmax(0,1fr)_118px] sm:items-start">
              <div className="max-w-3xl">
                <div className="text-[11px] uppercase tracking-[0.25em] text-white/42">
                  Day in the life
                </div>

                <h1 className="mt-3 text-[2.3rem] font-semibold leading-[0.98] tracking-tight sm:text-[3.2rem]">
                  {path.dayInLife.title}
                </h1>

                <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/78 sm:text-[16px]">
                  {path.dayInLife.summary}
                </p>

                <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/90 sm:text-[16px]">
                  {introLine}
                </p>

                <div className="mt-6 max-w-2xl border-l border-white/12 pl-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-white/42">
                    The pulse
                  </div>
                  <p className="mt-2 text-[15px] leading-7 text-white/70 sm:text-[16px]">
                    {pulseLine}
                  </p>
                </div>
              </div>

              <div className="relative hidden sm:flex sm:justify-end">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-[26px] border border-white/12 bg-white/[0.08] backdrop-blur-xl">
                  <div
                    className="absolute inset-[10px] rounded-[20px] border border-white/12"
                    style={{
                      boxShadow: `0 0 0 1px ${rgb(path.theme.glow, 0.05)}`,
                    }}
                  />
                  <div
                    className="absolute inset-[16px] rounded-full blur-2xl"
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

        <section className="relative mt-12">
          <div className="absolute bottom-0 left-[18px] top-0 w-px bg-gradient-to-b from-white/0 via-white/10 to-white/0 sm:left-[20px]" />

          <div className="space-y-9 sm:space-y-10">
            {storyBeats.map((beat, index) => {
              const Icon = beat.icon;
              const tone = toneStyles(beat.tone, path.theme);
              const divider =
                index === storyBeats.length - 1
                  ? ""
                  : "after:absolute after:left-[20px] after:top-[calc(100%+14px)] after:h-5 after:w-px after:bg-white/8";

              return (
                <article key={beat.id} className={`relative pl-12 sm:pl-14 ${divider}`}>
                  <div className="absolute left-[6px] top-0 sm:left-[8px]">
                    <div
                      className="absolute inset-0 rounded-full blur-xl"
                      style={{ background: tone.halo }}
                    />
                    <div className="relative flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#0b1422] sm:h-8 sm:w-8">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: tone.dot }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-white/45" />
                    <div
                      className={`text-[10px] uppercase tracking-[0.24em] ${tone.label}`}
                    >
                      {beat.label}
                    </div>
                  </div>

                  <h3 className="mt-2 text-[1.28rem] font-semibold leading-tight text-white sm:text-[1.58rem]">
                    {beat.title}
                  </h3>

                  <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/70 sm:text-[16px]">
                    {beat.body}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-16 grid gap-8 sm:grid-cols-2">
          <Link
            href={`/main/explore/work/${path.slug}/forecast`}
            className="group relative"
          >
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
          </Link>

          <Link
            href={`/main/explore/work/${path.slug}/next-steps`}
            className="group relative"
          >
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
          </Link>
        </section>
      </div>
    </main>
  );
}