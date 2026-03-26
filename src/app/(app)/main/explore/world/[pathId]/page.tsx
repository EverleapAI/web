// web/src/app/(app)/main/explore/world/[pathId]/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  ExternalLink,
  Globe2,
  Quote,
  Radar,
} from "lucide-react";

import { requireWorldPath } from "../_data/worldPaths";

/* =============================================================================
   Helpers
============================================================================= */

function asOptionalString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function firstSentence(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return "";
  const match = trimmed.match(/^.*?[.!?](?:\s|$)/);
  return match ? match[0].trim() : trimmed;
}

function sectionKicker() {
  return "text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40";
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, score));
}

function scoreWidth(score: number) {
  return `${clampScore(score)}%`;
}

function getOverallSignalScore(
  fitSignals: Array<{ score: number }> | undefined
) {
  if (!fitSignals?.length) return 74;

  const total = fitSignals.reduce((sum, signal) => {
    const next = typeof signal.score === "number" ? signal.score : 0;
    return sum + clampScore(next);
  }, 0);

  return Math.round(total / fitSignals.length);
}

function getSignalLabel(score: number) {
  if (score >= 84) return "Very strong";
  if (score >= 74) return "Strong";
  if (score >= 64) return "Worth exploring";
  return "Possible fit";
}

function readStoredFirstName(): string | null {
  if (typeof window === "undefined") return null;

  const candidateKeys = [
    "everleapOnboarding_v4_convo_min",
    "everleap.story.answers.v3",
    "everleap.story.answers.v2",
    "everleap.onboarding.answers",
    "everleap.user.profile",
  ];

  for (const key of candidateKeys) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const profile =
        parsed.profile && typeof parsed.profile === "object"
          ? (parsed.profile as Record<string, unknown>)
          : null;
      const answers =
        parsed.answers && typeof parsed.answers === "object"
          ? (parsed.answers as Record<string, unknown>)
          : null;

      const candidates = [
        parsed.firstName,
        parsed.firstname,
        parsed.first_name,
        parsed.name,
        profile?.firstName,
        profile?.name,
        answers?.firstName,
        answers?.name,
      ];

      for (const candidate of candidates) {
        const found = asOptionalString(candidate);
        if (found) return found.split(" ")[0];
      }
    } catch {
      // ignore malformed local data
    }
  }

  return null;
}

function colorWithAlpha(color: string | undefined, alpha: number) {
  const fallback = `rgba(245, 158, 11, ${alpha})`;
  if (!color) return fallback;

  const value = color.trim();

  if (/^#([0-9a-f]{3})$/i.test(value)) {
    const hex = value.slice(1);
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  if (/^#([0-9a-f]{6})$/i.test(value)) {
    const hex = value.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  if (alpha >= 0.999) return value;

  return fallback;
}

function modeLabel(mode: string) {
  switch (mode) {
    case "virtual":
      return "Online";
    case "travel":
      return "Travel";
    case "hybrid":
      return "Hybrid";
    case "local":
      return "Near you";
    default:
      return mode;
  }
}

function typeLabel(type: string) {
  if (!type) return "";
  return type
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/* =============================================================================
   UI Pieces
============================================================================= */

function SurfaceCard({
  children,
  accent,
  glow,
  className = "",
}: {
  children: React.ReactNode;
  accent: string;
  glow: string;
  className?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[30px] border border-white/10 bg-[#08111d]/88 backdrop-blur-2xl ${className}`}
      style={{
        boxShadow: `0 22px 64px rgba(0,0,0,0.28), 0 0 30px ${colorWithAlpha(
          glow,
          0.08
        )}`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-px"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${colorWithAlpha(
            accent,
            0.42
          )} 18%, ${colorWithAlpha(glow, 0.16)} 78%, transparent 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute right-[-24px] top-[-18px] h-28 w-28 rounded-full blur-3xl"
        style={{ background: colorWithAlpha(glow, 0.08) }}
      />
      <div className="relative">{children}</div>
    </section>
  );
}

function WorldHeroOrb({
  accent,
  accentStrong,
  glow,
}: {
  accent: string;
  accentStrong: string;
  glow: string;
}) {
  return (
    <div className="pointer-events-none absolute right-4 top-4 h-20 w-20 sm:h-24 sm:w-24">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colorWithAlpha(
            glow,
            0.22
          )} 0%, transparent 70%)`,
          filter: "blur(8px)",
        }}
      />
      <div
        className="absolute inset-[18%] rounded-full border"
        style={{ borderColor: colorWithAlpha(accent, 0.22) }}
      />
      <div
        className="absolute left-[28%] top-[30%] h-[8px] w-[8px] rounded-full"
        style={{
          background: colorWithAlpha(accent, 0.96),
          boxShadow: `0 0 12px ${colorWithAlpha(accent, 0.45)}`,
        }}
      />
      <div
        className="absolute right-[22%] top-[34%] h-[7px] w-[7px] rounded-full"
        style={{
          background: "white",
          boxShadow: "0 0 8px rgba(255,255,255,0.55)",
        }}
      />
      <div
        className="absolute left-[36%] bottom-[24%] h-[8px] w-[8px] rounded-full"
        style={{
          background: colorWithAlpha(accentStrong, 0.95),
          boxShadow: `0 0 12px ${colorWithAlpha(accentStrong, 0.42)}`,
        }}
      />
      <div
        className="absolute left-[36%] top-[36%] h-px w-[18px] rotate-[22deg]"
        style={{
          background: `linear-gradient(90deg, ${colorWithAlpha(
            accent,
            0.34
          )} 0%, transparent 100%)`,
        }}
      />
      <div
        className="absolute left-[40%] top-[56%] h-px w-[20px] -rotate-[18deg]"
        style={{
          background: `linear-gradient(90deg, ${colorWithAlpha(
            accentStrong,
            0.28
          )} 0%, transparent 100%)`,
        }}
      />
    </div>
  );
}

function HeroInlineSignal({
  score,
  accent,
  glow,
}: {
  score: number;
  accent: string;
  glow: string;
}) {
  const activeBars = Math.max(1, Math.min(5, Math.round(score / 20)));

  return (
    <div
      className="relative inline-flex h-10 shrink-0 items-center gap-2.5 rounded-full border px-3 py-1"
      style={{
        borderColor: colorWithAlpha(accent, 0.18),
        background:
          "linear-gradient(180deg, rgba(6,16,28,0.88) 0%, rgba(7,14,24,0.68) 100%)",
        boxShadow: `0 8px 20px rgba(0,0,0,0.18), 0 0 18px ${colorWithAlpha(
          glow,
          0.1
        )}`,
      }}
    >
      <div className="flex items-end gap-[4px]">
        {[0, 1, 2, 3, 4].map((i) => {
          const isActive = i < activeBars;
          return (
            <span
              key={i}
              className="block w-[5px] rounded-full"
              style={{
                height: `${9 + i * 3}px`,
                background: isActive
                  ? `linear-gradient(180deg, ${colorWithAlpha(
                      accent,
                      1
                    )} 0%, ${colorWithAlpha(glow, 0.82)} 100%)`
                  : "rgba(255,255,255,0.12)",
                boxShadow: isActive
                  ? `0 0 10px ${colorWithAlpha(glow, 0.18)}`
                  : "none",
              }}
            />
          );
        })}
      </div>

      <div className="text-[13px] font-semibold text-white/96">{score}</div>

      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/44">
        Signal
      </div>
    </div>
  );
}

function SignalRow({
  label,
  score,
  explanation,
  accent,
  accentStrong,
  glow,
}: {
  label: string;
  score: number;
  explanation: string;
  accent: string;
  accentStrong: string;
  glow: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="border-t border-white/8 pt-2 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <div className="truncate text-[13px] font-semibold text-white/92">
              {label}
            </div>

            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              aria-expanded={open}
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold text-white/76 transition hover:text-white"
              style={{
                borderColor: open
                  ? colorWithAlpha(accent, 0.22)
                  : "rgba(255,255,255,0.12)",
                background: open
                  ? colorWithAlpha(accent, 0.1)
                  : "rgba(255,255,255,0.03)",
                boxShadow: open
                  ? `0 0 12px ${colorWithAlpha(glow, 0.12)}`
                  : "none",
              }}
            >
              ?
            </button>
          </div>
        </div>

        <div
          className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold text-white/86"
          style={{
            borderColor: colorWithAlpha(accentStrong, 0.16),
            background: colorWithAlpha(accentStrong, 0.07),
          }}
        >
          {score}
        </div>
      </div>

      <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-white/7">
        <div
          className="h-full rounded-full"
          style={{
            width: scoreWidth(score),
            background: `linear-gradient(90deg, ${colorWithAlpha(
              accent,
              0.92
            )}, ${colorWithAlpha(accentStrong, 1)})`,
            boxShadow: `0 0 10px ${colorWithAlpha(glow, 0.18)}`,
          }}
        />
      </div>

      <div
        className={[
          "overflow-hidden transition-[max-height,opacity,margin] duration-200 ease-out",
          open ? "mt-1.5 max-h-20 opacity-100" : "mt-0 max-h-0 opacity-0",
        ].join(" ")}
      >
        <p className="text-[12px] leading-4.5 text-white/58">
          {firstSentence(explanation)}
        </p>
      </div>
    </div>
  );
}

function OpportunityRow({
  title,
  description,
  href,
  meta,
  accent,
  glow,
  isFirst,
}: {
  title: string;
  description: string;
  href: string;
  meta: string[];
  accent: string;
  glow: string;
  isFirst: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="group relative block px-1 py-4"
    >
      {!isFirst ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${colorWithAlpha(
              accent,
              0.18
            )} 18%, ${colorWithAlpha(accent, 0.08)} 82%, transparent 100%)`,
          }}
        />
      ) : null}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 92% 18%, ${colorWithAlpha(
            glow,
            0.09
          )} 0%, transparent 24%)`,
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-[18px] font-semibold leading-[1.16] tracking-[-0.025em] text-white/94 transition group-hover:text-white sm:text-[20px]">
            {title}
          </h3>

          {description ? (
            <p className="mt-2 max-w-[42rem] text-[13px] leading-5.5 text-white/66 transition group-hover:text-white/74 sm:text-[14px] sm:leading-6">
              {description}
            </p>
          ) : null}

          {meta.length ? (
            <div className="mt-2.5 flex flex-wrap gap-2">
              {meta.map((entry, index) => (
                <span
                  key={`${title}-meta-${index}-${entry}`}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/72"
                >
                  {entry}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div
          className="mt-1 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border sm:flex"
          style={{
            borderColor: colorWithAlpha(accent, 0.18),
            background: colorWithAlpha(accent, 0.08),
            boxShadow: `0 0 18px ${colorWithAlpha(glow, 0.08)}`,
          }}
        >
          <ArrowRight className="h-4 w-4 text-white/84 transition group-hover:translate-x-0.5" />
        </div>
      </div>
    </a>
  );
}

/* =============================================================================
   Page
============================================================================= */

export default function WorldPathDetailPage() {
  const params = useParams<{ pathId: string }>();
  const pathId = typeof params?.pathId === "string" ? params.pathId : "";

  if (!pathId) notFound();

  const path = React.useMemo(() => {
    try {
      return requireWorldPath(pathId);
    } catch {
      notFound();
    }
  }, [pathId]);

  const [firstName, setFirstName] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFirstName(readStoredFirstName());
  }, []);

  const accent = path.theme.accent || "#fbbf24";
  const accentStrong = path.theme.accentStrong || accent;
  const glow = path.theme.glow || accent;

  const overallSignalScore = React.useMemo(
    () => getOverallSignalScore(path.fitSignals),
    [path.fitSignals]
  );

  const signalLabel = React.useMemo(
    () => getSignalLabel(overallSignalScore),
    [overallSignalScore]
  );

  const openingLead = firstName
    ? `${firstName}, this is not about picking a forever answer. It is about noticing signal.`
    : "This is not about picking a forever answer. It is about noticing signal.";

  const featuredMeta = [
    modeLabel(path.featuredOpportunity.mode),
    typeLabel(path.featuredOpportunity.type),
  ].filter(Boolean);

  return (
    <main className="relative text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-14 pt-5 sm:px-6">
        <Link
          href="/main/explore/world"
          className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to World
        </Link>

        <SurfaceCard accent={accent} glow={glow} className="px-5 py-5 sm:px-6 sm:py-6">
          <div
            className="pointer-events-none absolute -left-10 -top-10 h-36 w-40 rounded-full blur-3xl"
            style={{ background: colorWithAlpha(accent, 0.12) }}
          />
          <div
            className="pointer-events-none absolute right-[18%] top-[-24px] h-28 w-40 rounded-full blur-3xl"
            style={{ background: colorWithAlpha(accentStrong, 0.08) }}
          />
          <div
            className="pointer-events-none absolute right-10 top-0 h-24 w-32 rounded-full blur-3xl"
            style={{ background: colorWithAlpha(glow, 0.08) }}
          />

          <WorldHeroOrb accent={accent} accentStrong={accentStrong} glow={glow} />

          <div className="pr-14 sm:pr-24">
            <div className={sectionKicker()}>{path.hero.eyebrow}</div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
              <h1 className="max-w-[12ch] text-[2rem] font-semibold leading-[0.98] tracking-[-0.05em] text-white/97 sm:max-w-none sm:text-[2.35rem]">
                {path.hero.title}
              </h1>

              <HeroInlineSignal
                score={overallSignalScore}
                accent={accent}
                glow={glow}
              />
            </div>

            <div className="mt-1.5 text-[12px] uppercase tracking-[0.16em] text-white/42">
              {signalLabel}
            </div>

            <p className="mt-3 text-[1rem] leading-6.5 text-white/84 sm:text-[1.06rem]">
              {path.hero.subtitle}
            </p>

            <div className="mt-3 space-y-3 text-[14px] leading-6 text-white/66 sm:text-[15px]">
              <p>{openingLead}</p>
              <p>{path.hero.body}</p>
            </div>

            {path.hero.pullQuote ? (
              <div
                className="relative mt-5 max-w-[42rem] rounded-[22px] border px-4 py-4"
                style={{
                  borderColor: colorWithAlpha(accent, 0.14),
                  background: `linear-gradient(180deg, ${colorWithAlpha(
                    accent,
                    0.09
                  )} 0%, rgba(255,255,255,0.02) 100%)`,
                  boxShadow: `0 12px 28px ${colorWithAlpha(glow, 0.08)}`,
                }}
              >
                <Quote
                  className="mb-2 h-4 w-4"
                  style={{ color: colorWithAlpha(accentStrong, 0.86) }}
                />
                <p className="text-[14px] leading-6 text-white/80 sm:text-[15px]">
                  {path.hero.pullQuote}
                </p>
              </div>
            ) : null}
          </div>
        </SurfaceCard>

        <SurfaceCard
          accent={accentStrong}
          glow={glow}
          className="px-5 py-5 sm:px-6 sm:py-6"
        >
          <div
            className="pointer-events-none absolute -left-8 top-0 h-28 w-28 rounded-full blur-3xl"
            style={{ background: colorWithAlpha(accentStrong, 0.11) }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 h-28 w-36 rounded-full blur-3xl"
            style={{ background: colorWithAlpha(glow, 0.08) }}
          />

          <div className="flex items-start gap-3">
            <div
              className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border sm:h-10 sm:w-10"
              style={{
                borderColor: colorWithAlpha(accentStrong, 0.24),
                background: `linear-gradient(180deg, ${colorWithAlpha(
                  accentStrong,
                  0.16
                )} 0%, ${colorWithAlpha(accentStrong, 0.05)} 100%)`,
                boxShadow: `0 0 20px ${colorWithAlpha(accentStrong, 0.14)}`,
              }}
            >
              <Radar
                className="relative h-4 w-4 sm:h-[17px] sm:w-[17px]"
                style={{ color: colorWithAlpha(accentStrong, 0.96) }}
              />
            </div>

            <div className="min-w-0">
              <div className={sectionKicker()}>Why this could fit</div>
              <h2 className="mt-0.5 text-[1.04rem] font-semibold tracking-[-0.03em] text-white/95 sm:text-[1.14rem]">
                A quick read on the match
              </h2>
              <p className="mt-0.5 text-[12px] leading-4.5 text-white/56 sm:text-[13px] sm:leading-5">
                These are the strongest signals this world path is picking up.
              </p>
            </div>
          </div>

          {path.traitChips.length ? (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {path.traitChips.map((chip, index) => (
                <span
                  key={`${chip.label}-${index}`}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/74"
                >
                  {chip.label}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-2.5 space-y-2.5">
            {path.fitSignals.map((signal) => (
              <SignalRow
                key={signal.id}
                label={signal.label}
                score={signal.score}
                explanation={signal.explanation}
                accent={accent}
                accentStrong={accentStrong}
                glow={glow}
              />
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard accent={glow} glow={accentStrong} className="px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex items-start gap-3">
            <div
              className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border sm:h-10 sm:w-10"
              style={{
                borderColor: colorWithAlpha(glow, 0.24),
                background: `linear-gradient(180deg, ${colorWithAlpha(
                  glow,
                  0.16
                )} 0%, ${colorWithAlpha(glow, 0.05)} 100%)`,
                boxShadow: `0 0 20px ${colorWithAlpha(glow, 0.14)}`,
              }}
            >
              <Globe2
                className="relative h-4 w-4 sm:h-[17px] sm:w-[17px]"
                style={{ color: colorWithAlpha(glow, 0.96) }}
              />
            </div>

            <div className="min-w-0">
              <div className={sectionKicker()}>{path.whatYouExplore.label}</div>
              <h2 className="mt-0.5 text-[1.04rem] font-semibold tracking-[-0.03em] text-white/95 sm:text-[1.14rem]">
                {path.whatYouExplore.title}
              </h2>
            </div>
          </div>

          <div className="mt-4 max-w-[44rem] text-[14px] leading-6 text-white/70 sm:text-[15px]">
            {path.whatYouExplore.intro}
          </div>

          <div className="mt-5 space-y-4">
            {path.whatYouExplore.items.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="relative pl-5"
              >
                {index > 0 ? (
                  <div
                    className="pointer-events-none absolute -top-2 left-0 right-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent 0%, ${colorWithAlpha(
                        glow,
                        0.14
                      )} 20%, transparent 100%)`,
                    }}
                  />
                ) : null}

                <div
                  className="pointer-events-none absolute left-0 top-[9px] h-2.5 w-2.5 rounded-full"
                  style={{
                    background: colorWithAlpha(glow, 0.9),
                    boxShadow: `0 0 12px ${colorWithAlpha(accentStrong, 0.24)}`,
                  }}
                />

                <h3 className="text-[17px] font-semibold leading-[1.2] text-white/94">
                  {item.title}
                </h3>
                <p className="mt-1.5 max-w-[42rem] text-[13px] leading-5.5 text-white/64 sm:text-[14px] sm:leading-6">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard accent={accent} glow={glow} className="px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className={sectionKicker()}>{path.featuredOpportunity.label}</div>
              <h2 className="mt-2 text-[1.08rem] font-semibold tracking-[-0.03em] text-white/95 sm:text-[1.18rem]">
                {path.featuredOpportunity.title}
              </h2>

              <p className="mt-2 text-[14px] leading-6 text-white/68">
                {path.featuredOpportunity.description}
              </p>

              {featuredMeta.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {featuredMeta.map((entry, index) => (
                    <span
                      key={`featured-meta-${index}-${entry}`}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/72"
                    >
                      {entry}
                    </span>
                  ))}
                </div>
              ) : null}

              <a
                href={path.featuredOpportunity.href}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-semibold text-white transition hover:translate-y-[-1px]"
                style={{
                  borderColor: colorWithAlpha(accent, 0.22),
                  background: `linear-gradient(180deg, ${colorWithAlpha(
                    accent,
                    0.18
                  )} 0%, ${colorWithAlpha(accent, 0.08)} 100%)`,
                  boxShadow: `0 12px 28px ${colorWithAlpha(glow, 0.12)}`,
                }}
              >
                {path.featuredOpportunity.ctaLabel}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border sm:flex"
              style={{
                borderColor: colorWithAlpha(accent, 0.16),
                background: colorWithAlpha(accent, 0.08),
              }}
            >
              <Compass className="h-5 w-5 text-white/86" />
            </div>
          </div>
        </SurfaceCard>

        {path.opportunityGroups.map((group) => (
          <SurfaceCard
            key={group.id}
            accent={accentStrong}
            glow={glow}
            className="px-5 py-5 sm:px-6 sm:py-6"
          >
            <div className={sectionKicker()}>{group.label}</div>

            <h2 className="mt-2 text-[1.08rem] font-semibold tracking-[-0.03em] text-white/95 sm:text-[1.18rem]">
              {group.title}
            </h2>

            <p className="mt-2 text-[14px] leading-6 text-white/62">
              {group.description}
            </p>

            <div className="mt-4">
              {group.opportunities.map((item, index) => {
                const meta = [
                  modeLabel(item.mode),
                  typeLabel(item.type),
                  item.locationLabel,
                  item.ageNote,
                ].filter((entry): entry is string => Boolean(entry));

                return (
                  <OpportunityRow
                    key={`${group.id}-${item.title}-${index}`}
                    title={item.title}
                    description={item.description}
                    href={item.href}
                    meta={meta}
                    accent={accentStrong}
                    glow={glow}
                    isFirst={index === 0}
                  />
                );
              })}
            </div>
          </SurfaceCard>
        ))}

        <div className="pb-2" />
      </div>
    </main>
  );
}