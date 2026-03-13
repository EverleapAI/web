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
   Hero constellation
============================================================================= */

type Point = {
  x: number;
  y: number;
  size: number;
  glow: number;
  color: "accent" | "strong" | "glow" | "white";
};

const HERO_POINTS: Point[] = [
  { x: 70, y: 16, size: 3.2, glow: 18, color: "accent" },
  { x: 82, y: 24, size: 2.8, glow: 16, color: "glow" },
  { x: 74, y: 36, size: 3.4, glow: 20, color: "strong" },
  { x: 88, y: 42, size: 2.4, glow: 14, color: "white" },
  { x: 67, y: 52, size: 2.8, glow: 16, color: "glow" },
  { x: 80, y: 60, size: 3.8, glow: 22, color: "accent" },
  { x: 90, y: 66, size: 2.6, glow: 14, color: "strong" },
  { x: 73, y: 74, size: 2.4, glow: 14, color: "white" },
];

type Segment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: "accent" | "strong" | "glow" | "white";
};

const HERO_SEGMENTS: Segment[] = [
  { x1: 70, y1: 16, x2: 82, y2: 24, color: "accent" },
  { x1: 82, y1: 24, x2: 74, y2: 36, color: "glow" },
  { x1: 74, y1: 36, x2: 88, y2: 42, color: "strong" },
  { x1: 74, y1: 36, x2: 67, y2: 52, color: "accent" },
  { x1: 67, y1: 52, x2: 80, y2: 60, color: "glow" },
  { x1: 80, y1: 60, x2: 90, y2: 66, color: "strong" },
  { x1: 80, y1: 60, x2: 73, y2: 74, color: "accent" },
];

function heroColor(
  path: {
    theme: {
      accent: { r: number; g: number; b: number };
      accentStrong: { r: number; g: number; b: number };
      glow: { r: number; g: number; b: number };
    };
  },
  key: Point["color"] | Segment["color"],
  alpha: number
) {
  if (key === "accent") return rgb(path.theme.accent, alpha);
  if (key === "strong") return rgb(path.theme.accentStrong, alpha);
  if (key === "glow") return rgb(path.theme.glow, alpha);
  return `rgba(255,255,255,${alpha})`;
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
              radial-gradient(circle at 14% 18%, ${rgb(path.theme.accent, 0.18)} 0%, transparent 30%),
              radial-gradient(circle at 82% 16%, ${rgb(path.theme.glow, 0.2)} 0%, transparent 26%),
              radial-gradient(circle at 68% 78%, ${rgb(path.theme.accentStrong, 0.14)} 0%, transparent 28%),
              linear-gradient(180deg, rgba(4,10,18,0.96) 0%, rgba(7,17,31,0.98) 38%, rgba(4,9,18,1) 100%)
            `,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.16]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
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

          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -right-[20%] top-[6%] h-[42%] w-[52%] rounded-full blur-3xl sm:-right-[6%] sm:top-[6%] sm:h-[52%] sm:w-[44%] lg:right-[4%] lg:top-[8%] lg:h-[78%] lg:w-[38%]"
              style={{
                background: `
                  radial-gradient(circle at 45% 35%, ${rgb(path.theme.accent, 0.12)} 0%, transparent 42%),
                  radial-gradient(circle at 72% 62%, ${rgb(path.theme.glow, 0.1)} 0%, transparent 38%)
                `,
                opacity: 0.72,
              }}
            />

            {HERO_SEGMENTS.map((segment, index) => {
              const isMobile = segment.x1 < 72;
              const mobileLeft = `${segment.x1 + 17}%`;
              const mobileTop = `${segment.y1 - 6}%`;
              const dx = segment.x2 - segment.x1;
              const dy = segment.y2 - segment.y1;
              const mobileLength = Math.sqrt(dx * dx + dy * dy) * 0.56;
              const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

              return (
                <div
                  key={`hero_segment_${index}`}
                  className="absolute origin-left rounded-full opacity-30 sm:opacity-45 lg:opacity-90"
                  style={{
                    left: mobileLeft,
                    top: mobileTop,
                    width: `${mobileLength}%`,
                    height: "1.5px",
                    transform: `rotate(${angle}deg)`,
                    background: `linear-gradient(90deg, ${heroColor(
                      path,
                      segment.color,
                      0.08
                    )} 0%, ${heroColor(path, segment.color, 0.2)} 50%, ${heroColor(
                      path,
                      segment.color,
                      0.08
                    )} 100%)`,
                    boxShadow: `0 0 12px ${heroColor(path, segment.color, 0.08)}`,
                  }}
                  data-mobile-shift={isMobile ? "true" : "false"}
                />
              );
            })}

            {HERO_POINTS.map((point, index) => (
              <div
                key={`hero_point_${index}`}
                className="absolute rounded-full opacity-35 sm:opacity-55 lg:opacity-100"
                style={{
                  left: `${point.x + 15}%`,
                  top: `${point.y - 6}%`,
                  width: `${point.size * 1.7}px`,
                  height: `${point.size * 1.7}px`,
                  transform: "translate(-50%, -50%)",
                  background: heroColor(
                    path,
                    point.color,
                    point.color === "white" ? 0.58 : 0.78
                  ),
                  boxShadow: `
                    0 0 ${point.glow * 0.65}px ${heroColor(path, point.color, 0.12)},
                    0 0 ${point.glow}px ${heroColor(path, point.color, 0.04)}
                  `,
                }}
              />
            ))}

            <div
              className="absolute right-[6%] top-[24%] h-10 w-10 rounded-full border opacity-18 sm:right-[10%] sm:h-12 sm:w-12 sm:opacity-3० lg:right-[11%] lg:top-[26%] lg:h-16 lg:w-16 lg:opacity-60"
              style={{
                borderColor: rgb(path.theme.accentStrong, 0.1),
                boxShadow: `0 0 18px ${rgb(path.theme.accentStrong, 0.05)}`,
              }}
            />
            <div
              className="absolute right-[12%] top-[48%] h-12 w-12 rounded-full border opacity-16 sm:right-[16%] sm:h-14 sm:w-14 sm:opacity-24 lg:right-[19%] lg:top-[50%] lg:h-20 lg:w-20 lg:opacity-55"
              style={{
                borderColor: rgb(path.theme.glow, 0.08),
                boxShadow: `0 0 18px ${rgb(path.theme.glow, 0.05)}`,
              }}
            />
          </div>

          <div className="relative max-w-[100%] sm:max-w-[84%] lg:max-w-[72%]">
            <div className={sectionKicker(dark)}>{path.hero.eyebrow}</div>

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

            <div className="mt-6 flex max-w-3xl flex-wrap gap-x-4 gap-y-3">
              {path.traitChips.map((chip, index) => (
                <span
                  key={chip.id}
                  className="relative inline-flex items-center text-[13px] font-semibold tracking-[0.01em] sm:text-[13.5px]"
                  style={{
                    color:
                      index % 4 === 0
                        ? rgb(path.theme.accent, 0.98)
                        : index % 4 === 1
                          ? rgb(path.theme.accentStrong, 0.96)
                          : index % 4 === 2
                            ? "rgba(255,255,255,0.82)"
                            : rgb(path.theme.glow, 0.96),
                    textShadow: `0 0 18px ${rgb(
                      index % 2 === 0 ? path.theme.accent : path.theme.glow,
                      0.28
                    )}`,
                  }}
                >
                  {chip.label}
                </span>
              ))}
            </div>

            <div
              className="mt-7 max-w-3xl rounded-[28px] px-4 py-4 sm:px-5 sm:py-5"
              style={{
                background: `linear-gradient(180deg, ${rgb(
                  path.theme.accent,
                  0.1
                )} 0%, rgba(255,255,255,0.045) 100%)`,
                border: `1px solid ${rgb(path.theme.accent, 0.2)}`,
                boxShadow: `0 14px 40px ${rgb(path.theme.glow, 0.14)}`,
              }}
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/42">
                Why this may feel close
              </div>
              <p className="mt-3 text-[16px] font-medium leading-7 text-white/95 sm:text-[17px]">
                “{agenticOpening.intro}”
              </p>
              <p className="mt-3 text-sm leading-7 text-white/68 sm:text-[15px]">
                {agenticOpening.body}
              </p>
            </div>
          </div>
        </section>

        <section
          className={[
            "rounded-[28px] px-5 py-4 sm:px-6 sm:py-5",
            shellSurface(dark),
          ].join(" ")}
        >
          <div className="space-y-3">
            {path.fitSignals.map((signal) => (
              <div
                key={signal.id}
                className="rounded-[22px] border border-white/8 bg-white/[0.04] px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className={`text-sm font-semibold ${textMain(dark)}`}>
                    {signal.label}
                  </div>
                  <div className="text-xs font-semibold text-white/58">
                    {signal.score}
                  </div>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8">
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

                <p className="mt-2 text-sm leading-6 text-white/66">
                  {firstSentence(signal.explanation)}
                </p>
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
          <div className="max-w-3xl">
            <div className={sectionKicker(dark)}>Keep exploring</div>
            <h2
              className={`mt-2 text-2xl font-semibold tracking-tight ${textMain(
                dark
              )}`}
            >
              If this still feels interesting, here&apos;s where to go next
            </h2>
          </div>

          <div className="mt-5 divide-y divide-white/8">
            {exploreLinks.map((item, index) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "group block transition hover:bg-white/[0.03]",
                    index === 0
                      ? "pt-0 pb-4"
                      : index === exploreLinks.length - 1
                        ? "pt-4 pb-0"
                        : "py-4",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-3.5">
                      <div
                        className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border"
                        style={{
                          borderColor: rgb(item.glow, 0.18),
                          background: `linear-gradient(180deg, ${rgb(
                            item.glow,
                            0.14
                          )} 0%, ${rgb(item.tint, 0.08)} 100%)`,
                          boxShadow: `0 0 24px ${rgb(item.glow, 0.14)}`,
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
                          className="relative h-[18px] w-[18px]"
                          style={{ color: rgb(item.glow, 0.94) }}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="text-base font-semibold text-white/90">
                          {item.title}
                        </div>
                        <div className={`mt-2 text-sm leading-6 ${textSoft(dark)}`}>
                          {item.description}
                        </div>
                      </div>
                    </div>

                    <div className="inline-flex shrink-0 items-center pt-1 text-white/72 transition group-hover:text-white">
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