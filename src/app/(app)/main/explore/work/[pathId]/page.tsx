// apps/web/src/app/(app)/main/explore/work/[pathId]/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CalendarClock,
  Compass,
  TrendingUp,
} from "lucide-react";

import { requireWorkPath } from "../_data/workPaths";
import {
  getWorkAgenticOpening,
  readStoredFirstName,
} from "../_data/getWorkAgenticOpening";

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

function sectionKicker(dark: boolean) {
  return `text-[11px] font-semibold uppercase tracking-[0.2em] ${textFaint(dark)}`;
}

function firstSentence(text: string) {
  const trimmed = text.trim();
  const match = trimmed.match(/^.*?[.!?](?:\s|$)/);
  return match ? match[0].trim() : trimmed;
}

/* =============================================================================
   Hero emblem
============================================================================= */

function WorkPathHeroEmblem({
  accent,
  accentStrong,
  glow,
}: {
  accent: { r: number; g: number; b: number };
  accentStrong: { r: number; g: number; b: number };
  glow: { r: number; g: number; b: number };
}) {
  return (
    <div className="pointer-events-none absolute right-4 top-4 h-20 w-20 sm:right-5 sm:top-5 sm:h-24 sm:w-24 lg:right-6 lg:top-6 lg:h-28 lg:w-28">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${rgb(
            glow,
            0.18
          )} 0%, transparent 68%)`,
          filter: "blur(8px)",
        }}
      />

      <div
        className="absolute inset-[10%] rounded-full border"
        style={{
          borderColor: rgb(accent, 0.14),
          boxShadow: `0 0 18px ${rgb(accent, 0.08)}`,
        }}
      />

      <div
        className="absolute inset-[24%] rounded-full border"
        style={{
          borderColor: rgb(glow, 0.12),
          boxShadow: `0 0 14px ${rgb(glow, 0.06)}`,
        }}
      />

      <div
        className="absolute left-[28%] top-[28%] h-[10px] w-[10px] rounded-full sm:h-[11px] sm:w-[11px]"
        style={{
          background: rgb(accent, 0.92),
          boxShadow: `0 0 12px ${rgb(accent, 0.34)}`,
        }}
      />

      <div
        className="absolute right-[20%] top-[30%] h-[8px] w-[8px] rounded-full sm:h-[9px] sm:w-[9px]"
        style={{
          background: "rgba(255,255,255,0.62)",
          boxShadow: `0 0 10px rgba(255,255,255,0.14)`,
        }}
      />

      <div
        className="absolute left-[32%] bottom-[20%] h-[9px] w-[9px] rounded-full sm:h-[10px] sm:w-[10px]"
        style={{
          background: rgb(accentStrong, 0.84),
          boxShadow: `0 0 10px ${rgb(accentStrong, 0.24)}`,
        }}
      />

      <div
        className="absolute left-[40%] top-[34%] h-px origin-left"
        style={{
          width: "34%",
          transform: "rotate(8deg)",
          background: `linear-gradient(90deg, ${rgb(accent, 0.34)} 0%, ${rgb(
            glow,
            0.12
          )} 100%)`,
        }}
      />

      <div
        className="absolute left-[36%] top-[38%] h-px origin-left"
        style={{
          width: "16%",
          transform: "rotate(96deg)",
          background: `linear-gradient(90deg, ${rgb(glow, 0.26)} 0%, ${rgb(
            accentStrong,
            0.12
          )} 100%)`,
        }}
      />

      <div
        className="absolute bottom-[18%] right-[10%] flex h-7 w-7 items-center justify-center rounded-full border sm:h-8 sm:w-8"
        style={{
          borderColor: rgb(accent, 0.2),
          background: `linear-gradient(180deg, ${rgb(accent, 0.1)} 0%, ${rgb(
            glow,
            0.06
          )} 100%)`,
          boxShadow: `0 0 14px ${rgb(glow, 0.08)}`,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 sm:h-4 sm:w-4"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M7 9.5c0-1.7 1.3-3 3-3h4c1.7 0 3 1.3 3 3v5c0 1.7-1.3 3-3 3h-4c-1.7 0-3-1.3-3-3v-5Z"
            stroke={rgb(glow, 0.88)}
            strokeWidth="1.5"
          />
          <path
            d="M9.4 12h.01M14.6 12h.01M10.2 14.2c.6.45 1.15.67 1.8.67.65 0 1.2-.22 1.8-.67"
            stroke={rgb(glow, 0.88)}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
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

  const exploreLinks = [
    {
      href: `/main/explore/work/${path.slug}/specialties`,
      title: "Roles within this world",
      description:
        "See the different versions of this work and what each one focuses on.",
      icon: Briefcase,
      glow: path.theme.accent,
      tint: path.theme.glow,
    },
    {
      href: `/main/explore/work/${path.slug}/day`,
      title: "A day in the life",
      description: "See what the rhythm of the work actually feels like.",
      icon: CalendarClock,
      glow: path.theme.glow,
      tint: path.theme.accentStrong,
    },
    {
      href: `/main/explore/work/${path.slug}/forecast`,
      title: "The future of this career",
      description:
        "Demand, salary ranges, AI pressure, and where the field is heading.",
      icon: TrendingUp,
      glow: path.theme.accentStrong,
      tint: path.theme.accent,
    },
    {
      href: `/main/explore/work/${path.slug}/next-steps`,
      title: "Next steps",
      description: "Real ways to start exploring this direction.",
      icon: Compass,
      glow: path.theme.accent,
      tint: path.theme.accentStrong,
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 12% 18%, ${rgb(path.theme.accent, 0.18)} 0%, transparent 30%),
              radial-gradient(circle at 82% 14%, ${rgb(path.theme.glow, 0.2)} 0%, transparent 26%),
              radial-gradient(circle at 72% 82%, ${rgb(path.theme.accentStrong, 0.14)} 0%, transparent 30%),
              linear-gradient(180deg, rgba(4,10,18,0.96) 0%, rgba(7,17,31,0.98) 38%, rgba(4,9,18,1) 100%)
            `,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.12]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 pb-12 pt-5 sm:px-6 lg:px-8 lg:pt-6">
        <div className="flex items-center justify-start">
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
        </div>

        <section
          className={[
            "relative overflow-hidden rounded-[30px] px-5 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-6",
            shellSurface(dark),
            "shadow-[0_24px_96px_rgba(0,0,0,0.32)]",
          ].join(" ")}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{
              background: `
                radial-gradient(circle at 12% 18%, ${rgb(path.theme.accent, 0.2)} 0%, transparent 30%),
                radial-gradient(circle at 84% 14%, ${rgb(path.theme.glow, 0.18)} 0%, transparent 28%)
              `,
            }}
          />

          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute right-[-8%] top-[-6%] h-[170px] w-[170px] rounded-full blur-3xl sm:h-[220px] sm:w-[220px] lg:right-[-6%] lg:top-[-4%] lg:h-[260px] lg:w-[260px]"
              style={{
                background: `
                  radial-gradient(circle at 45% 35%, ${rgb(path.theme.accent, 0.16)} 0%, transparent 42%),
                  radial-gradient(circle at 72% 62%, ${rgb(path.theme.glow, 0.12)} 0%, transparent 38%)
                `,
                opacity: 0.72,
              }}
            />
          </div>

          <WorkPathHeroEmblem
            accent={path.theme.accent}
            accentStrong={path.theme.accentStrong}
            glow={path.theme.glow}
          />

          <div className="relative max-w-[100%] pr-0 sm:pr-24 lg:max-w-[84%] lg:pr-20">
            <div className={sectionKicker(dark)}>{path.hero.eyebrow}</div>

            <h1
              className={`mt-2 text-[2.35rem] font-semibold tracking-tight sm:text-[3.4rem] ${textMain(
                dark
              )}`}
            >
              {path.hero.title}
            </h1>

            <p
              className={`mt-3 max-w-4xl text-[1.55rem] leading-[1.55] sm:text-[1.8rem] sm:leading-[1.52] ${textSoft(
                dark
              )}`}
            >
              {path.hero.hook}
            </p>

            <p
              className={`mt-4 max-w-4xl text-[15px] leading-7 sm:text-[15.5px] ${textSoft(
                dark
              )}`}
            >
              {path.hero.summary}
            </p>

            <div className="mt-4 rounded-[24px] border border-white/10 bg-white/[0.03] px-4 py-3.5 sm:px-5 sm:py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                Signals I&apos;m picking up
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4">
                {path.traitChips.map((chip, index) => (
                  <React.Fragment key={chip.id}>
                    <span
                      className="relative inline-flex items-center text-[13px] font-semibold tracking-[0.01em]"
                      style={{
                        color:
                          index % 4 === 0
                            ? rgb(path.theme.accent, 0.98)
                            : index % 4 === 1
                              ? rgb(path.theme.accentStrong, 0.96)
                              : index % 4 === 2
                                ? "rgba(255,255,255,0.82)"
                                : rgb(path.theme.glow, 0.96),
                        textShadow: `0 0 14px ${rgb(
                          index % 2 === 0 ? path.theme.accent : path.theme.glow,
                          0.22
                        )}`,
                      }}
                    >
                      {chip.label}
                    </span>
                    {index < path.traitChips.length - 1 ? (
                      <span className="text-[12px] text-white/26">•</span>
                    ) : null}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="mt-4 max-w-4xl">
              <div className="h-px w-full bg-gradient-to-r from-white/14 via-white/7 to-transparent" />
              <div className="mt-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/38">
                  Why this may feel close
                </div>

                <p className="mt-2 text-[16px] font-medium leading-7 text-white/94 sm:text-[17px]">
                  “{agenticOpening.intro}”
                </p>

                <p className="mt-2 text-[14px] leading-6 text-white/66 sm:text-[15px] sm:leading-7">
                  {agenticOpening.body}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className={[
            "rounded-[26px] px-4 py-4 sm:px-5 sm:py-4",
            shellSurface(dark),
          ].join(" ")}
        >
          <div className="max-w-4xl">
            <div className={sectionKicker(dark)}>What this path tends to reward</div>
          </div>

          <div className="mt-3 grid gap-x-6 gap-y-4 md:grid-cols-3">
            {path.fitSignals.map((signal, index) => (
              <div
                key={signal.id}
                className={[
                  "min-w-0",
                  index > 0 ? "md:border-l md:border-white/8 md:pl-6" : "",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className={`text-[13px] font-semibold ${textMain(dark)}`}>
                    {signal.label}
                  </div>
                  <div className="text-[11px] font-semibold text-white/56">
                    {signal.score}
                  </div>
                </div>

                <div className="mt-2 h-[6px] overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: scoreWidth(signal.score),
                      background: `linear-gradient(90deg, ${rgb(
                        path.theme.accent,
                        0.95
                      )} 0%, ${rgb(path.theme.accentStrong, 0.98)} 100%)`,
                      boxShadow: `0 0 18px ${rgb(path.theme.glow, 0.34)}`,
                    }}
                  />
                </div>

                <p className="mt-2 text-[13px] leading-6 text-white/62 sm:text-sm sm:leading-6">
                  {firstSentence(signal.explanation)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          className={[
            "rounded-[26px] px-4 py-4 sm:px-5 sm:py-4.5",
            shellSurface(dark),
          ].join(" ")}
        >
          <div className="max-w-4xl">
            <div className={sectionKicker(dark)}>Keep exploring</div>
            <h2
              className={`mt-1 text-[1.35rem] font-semibold tracking-tight sm:text-[1.8rem] ${textMain(
                dark
              )}`}
            >
              If this still feels interesting, here&apos;s where to go next
            </h2>
          </div>

          <div className="mt-3.5 divide-y divide-white/8">
            {exploreLinks.map((item, index) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "group block transition hover:bg-white/[0.03]",
                    index === 0
                      ? "pt-0 pb-3"
                      : index === exploreLinks.length - 1
                        ? "pt-3 pb-0"
                        : "py-3",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <div
                        className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border"
                        style={{
                          borderColor: rgb(item.glow, 0.18),
                          background: `linear-gradient(180deg, ${rgb(
                            item.glow,
                            0.14
                          )} 0%, ${rgb(item.tint, 0.08)} 100%)`,
                          boxShadow: `0 0 20px ${rgb(item.glow, 0.12)}`,
                        }}
                      >
                        <div
                          className="pointer-events-none absolute inset-0 rounded-2xl"
                          style={{
                            background: `radial-gradient(circle at 30% 25%, ${rgb(
                              item.tint,
                              0.18
                            )} 0%, transparent 65%)`,
                          }}
                        />
                        <Icon
                          className="relative h-[16px] w-[16px]"
                          style={{ color: rgb(item.glow, 0.94) }}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="text-[15px] font-semibold text-white/90">
                          {item.title}
                        </div>
                        <div
                          className={`mt-1 text-[13px] leading-5.5 sm:text-sm sm:leading-6 ${textSoft(
                            dark
                          )}`}
                        >
                          {item.description}
                        </div>
                      </div>
                    </div>

                    <div className="inline-flex shrink-0 items-center pt-1 text-white/68 transition group-hover:text-white">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
