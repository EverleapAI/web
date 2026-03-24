// apps/web/src/app/(app)/main/explore/learning/[pathId]/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, ExternalLink, Sparkles } from "lucide-react";

import { requireLearningPath } from "../_data/learningPaths";
import type { LearningPathContent } from "../_data/learningPathSchema";

/* =============================================================================
   Helpers
============================================================================= */

function readStoredFirstName() {
  if (typeof window === "undefined") return "";

  const candidateKeys = [
    "everleapOnboarding_v4_convo_min",
    "everleap.story.answers.v3",
    "everleap.story.answers.v2",
    "everleap.story.answers",
    "everleap.onboarding.answers",
    "everleap.user.profile",
  ];

  for (const key of candidateKeys) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw);
      const firstName =
        parsed?.firstName ??
        parsed?.first_name ??
        parsed?.name?.first ??
        parsed?.profile?.firstName ??
        parsed?.profile?.name ??
        parsed?.answers?.firstName ??
        parsed?.answers?.name;

      if (typeof firstName === "string" && firstName.trim()) {
        return firstName.trim().split(" ")[0];
      }
    } catch {
      // ignore parse issues
    }
  }

  return "";
}

function rgb(value: { r: number; g: number; b: number }, alpha = 1) {
  return `rgba(${value.r}, ${value.g}, ${value.b}, ${alpha})`;
}

function cleanSignalLabel(value: string) {
  return value
    .replace(/^How to /i, "")
    .replace(/^How /i, "")
    .replace(/^What affects /i, "")
    .replace(/^What /i, "")
    .replace(/^Why /i, "")
    .replace(/^The /i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildHeroNarrative(args: {
  firstName: string;
  hook?: string;
  summary?: string;
}) {
  const intro =
    typeof args.hook === "string" && args.hook.trim()
      ? args.hook.trim()
      : args.summary?.trim() ?? "";

  const fitLine = args.firstName
    ? `${args.firstName}, this tends to fit people who like following real questions instead of just memorizing answers.`
    : `This tends to fit people who like following real questions instead of just memorizing answers.`;

  const storyLine =
    "It usually pulls you toward patterns in living systems — how the body adapts, what changes performance, what supports recovery, and why small choices can change outcomes in real life.";

  return [intro, fitLine, storyLine].filter(Boolean).join(" ");
}

function getRadarValues(scores: number[]) {
  const defaults = [82, 76, 88, 72, 84];
  if (!scores.length) return defaults;
  return defaults.map((fallback, index) => {
    const value = scores[index % scores.length];
    return typeof value === "number"
      ? Math.max(42, Math.min(96, value))
      : fallback;
  });
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number
) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

function makePolygonPoints(
  values: number[],
  cx: number,
  cy: number,
  maxRadius: number
) {
  const count = values.length;
  return values
    .map((value, index) => {
      const angle = (360 / count) * index;
      const radius = (value / 100) * maxRadius;
      const point = polarToCartesian(cx, cy, radius, angle);
      return `${point.x},${point.y}`;
    })
    .join(" ");
}

function makeRingPoints(
  count: number,
  cx: number,
  cy: number,
  radius: number
) {
  return Array.from({ length: count })
    .map((_, index) => {
      const angle = (360 / count) * index;
      const point = polarToCartesian(cx, cy, radius, angle);
      return `${point.x},${point.y}`;
    })
    .join(" ");
}

function HeroRadar({
  labels,
  values,
  accent,
  accentStrong,
  glow,
}: {
  labels: string[];
  values: number[];
  accent: { r: number; g: number; b: number };
  accentStrong: { r: number; g: number; b: number };
  glow: { r: number; g: number; b: number };
}) {
  const cx = 120;
  const cy = 120;
  const rings = [28, 52, 76, 100];
  const polygonPoints = makePolygonPoints(values, cx, cy, 88);

  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      <div
        className="pointer-events-none absolute inset-0 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${rgb(
            glow,
            0.24
          )} 0%, transparent 68%)`,
        }}
      />

      <svg viewBox="0 0 240 240" className="relative z-10 h-auto w-full">
        <defs>
          <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={rgb(accent, 1)} />
            <stop offset="100%" stopColor={rgb(accentStrong, 1)} />
          </linearGradient>

          <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={rgb(accent, 0.3)} />
            <stop offset="100%" stopColor={rgb(accentStrong, 0.12)} />
          </linearGradient>
        </defs>

        {rings.map((radius) => (
          <polygon
            key={radius}
            points={makeRingPoints(labels.length, cx, cy, radius)}
            fill="none"
            stroke={rgb(accent, radius === 100 ? 0.16 : 0.1)}
            strokeWidth="1"
          />
        ))}

        {labels.map((_, index) => {
          const angle = (360 / labels.length) * index;
          const end = polarToCartesian(cx, cy, 100, angle);
          return (
            <line
              key={index}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke={rgb(accentStrong, 0.1)}
              strokeWidth="1"
            />
          );
        })}

        <polygon
          points={polygonPoints}
          fill="url(#radarFill)"
          stroke="url(#radarStroke)"
          strokeWidth="2.5"
        />

        {values.map((value, index) => {
          const angle = (360 / values.length) * index;
          const point = polarToCartesian(cx, cy, (value / 100) * 88, angle);
          return (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={rgb(accentStrong, 1)}
              stroke={rgb(glow, 0.9)}
              strokeWidth="2"
            />
          );
        })}

        <circle
          cx={cx}
          cy={cy}
          r="5"
          fill={rgb(glow, 1)}
          style={{ filter: `drop-shadow(0 0 10px ${rgb(glow, 0.6)})` }}
        />
      </svg>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] text-white/54">
        {labels.map((label) => (
          <div key={label} className="truncate">
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function OpportunityGroup({
  title,
  intro,
  items,
  accent,
  accentStrong,
  glow,
  tone,
}: {
  title: string;
  intro: string;
  items: Array<{
    id: string;
    title: string;
    provider?: string;
    summary: string;
    whyItFits?: string;
    href?: string;
  }>;
  accent: { r: number; g: number; b: number };
  accentStrong: { r: number; g: number; b: number };
  glow: { r: number; g: number; b: number };
  tone: "local" | "online";
}) {
  const anchorGradient =
    tone === "local"
      ? `radial-gradient(circle at 16% 18%, ${rgb(accent, 0.18)} 0%, transparent 34%),
         radial-gradient(circle at 84% 78%, ${rgb(glow, 0.12)} 0%, transparent 26%)`
      : `radial-gradient(circle at 84% 18%, ${rgb(accentStrong, 0.18)} 0%, transparent 32%),
         radial-gradient(circle at 18% 78%, ${rgb(glow, 0.1)} 0%, transparent 24%)`;

  return (
    <section className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[#08111b]/72 px-4 py-4 shadow-[0_18px_56px_rgba(0,0,0,0.22)] sm:px-5 sm:py-5">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{ background: anchorGradient }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${rgb(
            accentStrong,
            0.28
          )} 24%, ${rgb(accent, 0.18)} 76%, transparent 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute right-[-36px] top-[-26px] h-28 w-28 rounded-full blur-3xl"
        style={{ background: rgb(glow, 0.1) }}
      />

      <div className="relative">
        <div className="text-[11px] uppercase tracking-[0.22em] text-white/40">
          {title}
        </div>

        <p className="mt-2 max-w-[44rem] text-[13px] leading-5.5 text-white/60 sm:text-[14px]">
          {intro}
        </p>

        <div className="mt-4 divide-y divide-white/10">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group block py-4 transition hover:translate-x-[2px]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <div className="text-[16px] font-semibold tracking-[-0.02em] text-white/94">
                      {item.title}
                    </div>
                    {item.provider ? (
                      <span className="text-[11px] uppercase tracking-[0.14em] text-white/34">
                        {item.provider}
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1 text-[13px] leading-5.5 text-white/66 sm:text-[14px] sm:leading-6">
                    {item.summary}
                  </p>

                  {item.whyItFits ? (
                    <p className="mt-1 text-[12px] leading-5 text-white/44 sm:text-[13px]">
                      {item.whyItFits}
                    </p>
                  ) : null}
                </div>

                <div
                  className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition group-hover:border-white/20 group-hover:bg-white/[0.07]"
                  style={{
                    boxShadow: `0 0 18px ${rgb(glow, 0.08)}`,
                  }}
                >
                  <ExternalLink className="h-4 w-4 text-white/42 transition group-hover:text-white/76" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============================================================================
   Page
============================================================================= */

export default function LearningPathPage() {
  const params = useParams<{ pathId: string }>();
  const pathId = params?.pathId;

  if (!pathId) notFound();

  let path: LearningPathContent;
  try {
    path = requireLearningPath(pathId);
  } catch {
    notFound();
  }

  const [firstName, setFirstName] = React.useState("");

  React.useEffect(() => {
    setFirstName(readStoredFirstName());
  }, []);

  const allItems = path.opportunityGroups.flatMap((group) => group.items);

  const local = allItems.filter(
    (item) => (item.mode === "local" || item.mode === "hybrid") && !!item.href
  );

  const online = allItems.filter(
    (item) => item.mode === "virtual" && !!item.href
  );

  const signalLabels = React.useMemo(() => {
    const fromLearning = path.whatYouLearn
      .slice(0, 5)
      .map((item) => cleanSignalLabel(item.title))
      .filter(Boolean);

    if (fromLearning.length >= 4) return fromLearning;

    return [
      "body systems",
      "recovery",
      "performance",
      "health patterns",
      "real-world biology",
    ];
  }, [path.whatYouLearn]);

  const radarValues = React.useMemo(
    () => getRadarValues(path.fitSignals.map((signal) => signal.score)),
    [path.fitSignals]
  );

  const heroNarrative = React.useMemo(
    () =>
      buildHeroNarrative({
        firstName,
        hook: path.hero.hook,
        summary: path.hero.summary,
      }),
    [firstName, path.hero.hook, path.hero.summary]
  );

  return (
    <main className="relative text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-16 pt-5 sm:px-6">
        <Link
          href="/main/explore/learning"
          className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Learning
        </Link>

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#07131f]/92 px-6 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:px-7 sm:py-7">
          <div
            className="pointer-events-none absolute -left-16 top-[-88px] h-56 w-56 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${rgb(
                path.theme.accent,
                0.22
              )} 0%, transparent 70%)`,
            }}
          />
          <div
            className="pointer-events-none absolute right-[-24px] top-[-18px] h-44 w-44 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${rgb(
                path.theme.accentStrong ?? path.theme.accent,
                0.18
              )} 0%, transparent 70%)`,
            }}
          />
          <div
            className="pointer-events-none absolute bottom-[-56px] right-[16%] h-40 w-40 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${rgb(
                path.theme.glow ?? path.theme.accent,
                0.16
              )} 0%, transparent 70%)`,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background: `
                linear-gradient(135deg, ${rgb(path.theme.accent, 0.06)} 0%, transparent 32%),
                radial-gradient(circle at 70% 24%, ${rgb(
                  path.theme.accentStrong ?? path.theme.accent,
                  0.1
                )} 0%, transparent 22%)
              `,
            }}
          />

          <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_300px] lg:items-center">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.24em] text-white/42">
                {path.hero.eyebrow}
              </div>

              <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.05em] text-white/96 sm:text-[2.45rem]">
                {path.hero.title}
              </h1>

              <p className="mt-4 max-w-[44rem] text-[1rem] leading-7 text-white/80 sm:text-[1.04rem]">
                {heroNarrative}
              </p>

              <p className="mt-4 text-[13px] text-white/52 sm:text-[14px]">
                Signals here: curiosity, pattern recognition, real-world thinking.
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {signalLabels.slice(0, 5).map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/70 backdrop-blur-sm"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative lg:justify-self-end">
              <HeroRadar
                labels={signalLabels.slice(0, 5)}
                values={radarValues}
                accent={path.theme.accent}
                accentStrong={path.theme.accentStrong ?? path.theme.accent}
                glow={path.theme.glow ?? path.theme.accent}
              />
            </div>
          </div>
        </section>

        {/* QUICK CHECK */}
        <section className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[#07111b]/82 px-5 py-5 shadow-[0_18px_48px_rgba(0,0,0,0.24)]">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(circle at 82% 20%, ${rgb(
                path.theme.accentStrong ?? path.theme.accent,
                0.08
              )} 0%, transparent 24%)`,
            }}
          />

          <div className="relative">
            <div className="text-[1rem] font-semibold text-white/94">
              Does this feel like it could fit you?
            </div>

            <div className="mt-3 flex flex-wrap gap-2.5">
              {["Yes", "Maybe", "Not really"].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[13px] text-white/76 transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* OPPORTUNITIES */}
        <section className="relative pt-1">
          <div
            className="pointer-events-none absolute left-0 top-10 h-36 w-36 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${rgb(
                path.theme.glow ?? path.theme.accent,
                0.1
              )} 0%, transparent 72%)`,
            }}
          />

          <div className="relative">
            <div className="flex items-center gap-2 text-white/92">
              <Sparkles className="h-4 w-4 text-white/60" />
              <div className="text-[1rem] font-semibold">Try this for real</div>
            </div>

            <p className="mt-1 max-w-[44rem] text-[14px] leading-6 text-white/60">
              These are real ways to move from interest into experience. Start
              with one that feels easy to enter, then notice what pulls you back.
            </p>

            <div className="mt-6 space-y-5">
              {local.length > 0 ? (
                <OpportunityGroup
                  title="Near you"
                  intro="Places where this learning becomes physical and immediate — real bodies, real environments, real systems in motion."
                  items={local}
                  accent={path.theme.accent}
                  accentStrong={path.theme.accentStrong ?? path.theme.accent}
                  glow={path.theme.glow ?? path.theme.accent}
                  tone="local"
                />
              ) : null}

              {online.length > 0 ? (
                <OpportunityGroup
                  title="Online"
                  intro="Good for building understanding fast, testing your interest, and getting close to the ideas before you commit more time."
                  items={online}
                  accent={path.theme.accent}
                  accentStrong={path.theme.accentStrong ?? path.theme.accent}
                  glow={path.theme.glow ?? path.theme.accent}
                  tone="online"
                />
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}