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
  Radar,
} from "lucide-react";

import { requireWorldPath } from "../_data/worldPaths";

/* =============================================================================
   Helpers
============================================================================= */

type Rgb = {
  r: number;
  g: number;
  b: number;
};

type ExploreEntry = {
  id: string;
  title: string;
  body: string;
};

type FeaturedOpportunity = {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  meta: string[];
};

type OpportunityItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  meta: string[];
};

type OpportunityGroup = {
  id: string;
  title: string;
  description: string;
  items: OpportunityItem[];
};

type TraitChip = {
  id: string;
  label: string;
};

type FitSignal = {
  id: string;
  label: string;
  score: number;
  explanation: string;
};

function rgb(value: Rgb, alpha = 1) {
  return `rgba(${value.r}, ${value.g}, ${value.b}, ${alpha})`;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

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
      const profile = asRecord(parsed.profile);
      const answers = asRecord(parsed.answers);

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

function scoreWidth(score: number) {
  return `${Math.max(0, Math.min(100, score))}%`;
}

function getOverallSignalScore(fitSignals: Array<{ score: number }> | undefined) {
  if (!fitSignals?.length) return 74;

  const total = fitSignals.reduce((sum, signal) => {
    const next = typeof signal.score === "number" ? signal.score : 0;
    return sum + Math.max(0, Math.min(100, next));
  }, 0);

  return Math.round(total / fitSignals.length);
}

function getSignalLabel(score: number) {
  if (score >= 84) return "Very strong";
  if (score >= 74) return "Strong";
  if (score >= 64) return "Worth exploring";
  return "Possible fit";
}

/* =============================================================================
   Normalizers
============================================================================= */

function normalizeWhatYouExplore(value: unknown): ExploreEntry[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item, index) => {
        if (typeof item === "string") {
          return {
            id: `explore-${index}`,
            title: `Explore ${index + 1}`,
            body: item,
          };
        }

        const record = asRecord(item);
        if (!record) return null;

        const title =
          asOptionalString(record.title) ??
          asOptionalString(record.label) ??
          asOptionalString(record.headline) ??
          `Explore ${index + 1}`;

        const body =
          asOptionalString(record.body) ??
          asOptionalString(record.description) ??
          asOptionalString(record.summary) ??
          asOptionalString(record.note) ??
          "";

        if (!title && !body) return null;

        return {
          id: asOptionalString(record.id) ?? `explore-${index}`,
          title,
          body,
        };
      })
      .filter((item): item is ExploreEntry => Boolean(item))
      .filter((item) => item.title || item.body);
  }

  const record = asRecord(value);
  if (!record) return [];

  return Object.entries(record)
    .map(([key, raw], index) => {
      if (typeof raw === "string") {
        return {
          id: key || `explore-${index}`,
          title: key
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase()),
          body: raw,
        };
      }

      const child = asRecord(raw);
      if (!child) return null;

      return {
        id: asOptionalString(child.id) ?? key ?? `explore-${index}`,
        title:
          asOptionalString(child.title) ??
          asOptionalString(child.label) ??
          key.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
        body:
          asOptionalString(child.body) ??
          asOptionalString(child.description) ??
          asOptionalString(child.summary) ??
          "",
      };
    })
    .filter((item): item is ExploreEntry => Boolean(item))
    .filter((item) => item.title || item.body);
}

function normalizeFeaturedOpportunity(value: unknown): FeaturedOpportunity | null {
  const record = asRecord(value);
  if (!record) return null;

  const title =
    asOptionalString(record.title) ??
    asOptionalString(record.name) ??
    asOptionalString(record.label);

  const description =
    asOptionalString(record.description) ??
    asOptionalString(record.summary) ??
    asOptionalString(record.note) ??
    "";

  const href =
    asOptionalString(record.href) ??
    asOptionalString(record.url) ??
    asOptionalString(record.link);

  if (!title || !href) return null;

  const ctaLabel =
    asOptionalString(record.ctaLabel) ??
    asOptionalString(record.cta) ??
    "Open opportunity";

  const meta = [
    asOptionalString(record.mode),
    asOptionalString(record.locationLabel),
    asOptionalString(record.formatLabel),
    asOptionalString(record.badge),
  ].filter((item): item is string => Boolean(item));

  return {
    title,
    description,
    href,
    ctaLabel,
    meta,
  };
}

function normalizeOpportunityGroups(value: unknown): OpportunityGroup[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((group, groupIndex) => {
      const record = asRecord(group);
      if (!record) return null;

      const rawItems = Array.isArray(record.items) ? record.items : [];
      const items = rawItems
        .map((item, itemIndex) => {
          const child = asRecord(item);
          if (!child) return null;

          const title =
            asOptionalString(child.title) ??
            asOptionalString(child.name) ??
            asOptionalString(child.label);

          const href =
            asOptionalString(child.href) ??
            asOptionalString(child.url) ??
            asOptionalString(child.link);

          if (!title || !href) return null;

          const description =
            asOptionalString(child.description) ??
            asOptionalString(child.summary) ??
            asOptionalString(child.note) ??
            "";

          const meta = [
            asOptionalString(child.mode),
            asOptionalString(child.locationLabel),
            asOptionalString(child.formatLabel),
            asOptionalString(child.badge),
            asOptionalString(child.provider),
          ].filter((entry): entry is string => Boolean(entry));

          return {
            id: asOptionalString(child.id) ?? `item-${groupIndex}-${itemIndex}`,
            title,
            description,
            href,
            meta,
          };
        })
        .filter((item): item is OpportunityItem => Boolean(item));

      if (!items.length) return null;

      return {
        id: asOptionalString(record.id) ?? `group-${groupIndex}`,
        title:
          asOptionalString(record.title) ??
          asOptionalString(record.label) ??
          "Opportunities",
        description:
          asOptionalString(record.description) ??
          asOptionalString(record.summary) ??
          "",
        items,
      };
    })
    .filter((group): group is OpportunityGroup => Boolean(group));
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
  accent: Rgb;
  glow: Rgb;
  className?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[28px] border border-white/10 bg-[#08111d]/88 backdrop-blur-2xl ${className}`}
      style={{
        boxShadow: `0 22px 64px rgba(0,0,0,0.28), 0 0 30px ${rgb(glow, 0.08)}`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-px"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${rgb(
            accent,
            0.42
          )} 18%, ${rgb(glow, 0.16)} 78%, transparent 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute right-[-24px] top-[-18px] h-28 w-28 rounded-full blur-3xl"
        style={{ background: rgb(glow, 0.08) }}
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
  accent: Rgb;
  accentStrong: Rgb;
  glow: Rgb;
}) {
  return (
    <div className="pointer-events-none absolute right-4 top-4 h-20 w-20 sm:h-24 sm:w-24">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${rgb(glow, 0.22)} 0%, transparent 70%)`,
          filter: "blur(8px)",
        }}
      />
      <div
        className="absolute inset-[18%] rounded-full border"
        style={{ borderColor: rgb(accent, 0.22) }}
      />
      <div
        className="absolute left-[28%] top-[30%] h-[8px] w-[8px] rounded-full"
        style={{
          background: rgb(accent, 0.96),
          boxShadow: `0 0 12px ${rgb(accent, 0.45)}`,
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
          background: rgb(accentStrong, 0.95),
          boxShadow: `0 0 12px ${rgb(accentStrong, 0.42)}`,
        }}
      />
      <div
        className="absolute left-[36%] top-[36%] h-px w-[18px] rotate-[22deg]"
        style={{
          background: `linear-gradient(90deg, ${rgb(accent, 0.34)} 0%, transparent 100%)`,
        }}
      />
      <div
        className="absolute left-[40%] top-[56%] h-px w-[20px] -rotate-[18deg]"
        style={{
          background: `linear-gradient(90deg, ${rgb(
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
  accent: Rgb;
  glow: Rgb;
}) {
  const activeBars = Math.max(1, Math.min(5, Math.round(score / 20)));

  return (
    <div
      className="relative inline-flex h-10 shrink-0 items-center gap-2.5 rounded-full border px-3 py-1"
      style={{
        borderColor: rgb(accent, 0.18),
        background:
          "linear-gradient(180deg, rgba(6,16,28,0.88) 0%, rgba(7,14,24,0.68) 100%)",
        boxShadow: `0 8px 20px rgba(0,0,0,0.18), 0 0 18px ${rgb(glow, 0.1)}`,
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
                  ? `linear-gradient(180deg, ${rgb(accent, 1)} 0%, ${rgb(
                      glow,
                      0.82
                    )} 100%)`
                  : "rgba(255,255,255,0.12)",
                boxShadow: isActive ? `0 0 10px ${rgb(glow, 0.18)}` : "none",
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
  signal,
  accent,
  accentStrong,
  glow,
}: {
  signal: FitSignal;
  accent: Rgb;
  accentStrong: Rgb;
  glow: Rgb;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="border-t border-white/8 pt-2 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <div className="truncate text-[13px] font-semibold text-white/92">
              {signal.label}
            </div>

            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              aria-expanded={open}
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold text-white/76 transition hover:text-white"
              style={{
                borderColor: open
                  ? rgb(accent, 0.22)
                  : "rgba(255,255,255,0.12)",
                background: open ? rgb(accent, 0.1) : "rgba(255,255,255,0.03)",
                boxShadow: open ? `0 0 12px ${rgb(glow, 0.12)}` : "none",
              }}
            >
              ?
            </button>
          </div>
        </div>

        <div
          className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold text-white/86"
          style={{
            borderColor: rgb(accentStrong, 0.16),
            background: rgb(accentStrong, 0.07),
          }}
        >
          {signal.score}
        </div>
      </div>

      <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-white/7">
        <div
          className="h-full rounded-full"
          style={{
            width: scoreWidth(signal.score),
            background: `linear-gradient(90deg, ${rgb(
              accent,
              0.92
            )}, ${rgb(accentStrong, 1)})`,
            boxShadow: `0 0 10px ${rgb(glow, 0.18)}`,
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
          {firstSentence(signal.explanation)}
        </p>
      </div>
    </div>
  );
}

function ExploreCard({
  item,
  accent,
  glow,
}: {
  item: ExploreEntry;
  accent: Rgb;
  glow: Rgb;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.03] p-4"
      style={{
        boxShadow: `0 12px 30px rgba(0,0,0,0.18), 0 0 16px ${rgb(glow, 0.06)}`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 86% 14%, ${rgb(
            accent,
            0.12
          )} 0%, transparent 26%)`,
        }}
      />
      <div className="relative">
        <div className={sectionKicker()}>{item.title}</div>
        <p className="mt-2 text-[14px] leading-6 text-white/72">{item.body}</p>
      </div>
    </div>
  );
}

function FeaturedOpportunityCard({
  opportunity,
  accent,
  glow,
}: {
  opportunity: FeaturedOpportunity | null;
  accent: Rgb;
  glow: Rgb;
}) {
  if (!opportunity) {
    return (
      <SurfaceCard accent={accent} glow={glow} className="px-5 py-5 sm:px-6 sm:py-6">
        <div className={sectionKicker()}>Best first move</div>
        <h2 className="mt-2 text-[1.08rem] font-semibold tracking-[-0.03em] text-white/95 sm:text-[1.18rem]">
          Start with one real-world step
        </h2>
        <p className="mt-2 text-[14px] leading-6 text-white/62">
          This path is ready for a first move, but the live opportunity is not
          wired in yet.
        </p>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard accent={accent} glow={glow} className="px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className={sectionKicker()}>Best first move</div>
          <h2 className="mt-2 text-[1.08rem] font-semibold tracking-[-0.03em] text-white/95 sm:text-[1.18rem]">
            {opportunity.title}
          </h2>
          {opportunity.description ? (
            <p className="mt-2 text-[14px] leading-6 text-white/68">
              {opportunity.description}
            </p>
          ) : null}

          {opportunity.meta.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {opportunity.meta.map((entry) => (
                <span
                  key={entry}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/72"
                >
                  {entry}
                </span>
              ))}
            </div>
          ) : null}

          <a
            href={opportunity.href}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-semibold text-white transition hover:translate-y-[-1px]"
            style={{
              borderColor: rgb(accent, 0.22),
              background: `linear-gradient(180deg, ${rgb(accent, 0.18)} 0%, ${rgb(
                accent,
                0.08
              )} 100%)`,
              boxShadow: `0 12px 28px ${rgb(glow, 0.12)}`,
            }}
          >
            {opportunity.ctaLabel}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border sm:flex"
          style={{
            borderColor: rgb(accent, 0.16),
            background: rgb(accent, 0.08),
          }}
        >
          <Compass className="h-5 w-5 text-white/86" />
        </div>
      </div>
    </SurfaceCard>
  );
}

function OpportunityGroupCard({
  group,
  accent,
  glow,
}: {
  group: OpportunityGroup;
  accent: Rgb;
  glow: Rgb;
}) {
  return (
    <SurfaceCard accent={accent} glow={glow} className="px-5 py-5 sm:px-6 sm:py-6">
      <div className={sectionKicker()}>{group.title}</div>
      {group.description ? (
        <p className="mt-2 text-[14px] leading-6 text-white/62">
          {group.description}
        </p>
      ) : null}

      <div className="mt-4 space-y-4">
        {group.items.map((item, index) => (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noreferrer noopener"
            className="group relative block"
          >
            {index > 0 ? <div className="mb-4 h-px w-full bg-white/8" /> : null}

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-[17px] font-semibold leading-[1.2] text-white/94 transition group-hover:text-white">
                  {item.title}
                </h3>

                {item.description ? (
                  <p className="mt-1.5 max-w-[42rem] text-[13px] leading-5.5 text-white/62 transition group-hover:text-white/72">
                    {item.description}
                  </p>
                ) : null}

                {item.meta.length ? (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {item.meta.map((entry) => (
                      <span
                        key={entry}
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
                  borderColor: rgb(accent, 0.18),
                  background: rgb(accent, 0.08),
                  boxShadow: `0 0 18px ${rgb(glow, 0.08)}`,
                }}
              >
                <ArrowRight className="h-4 w-4 text-white/84 transition group-hover:translate-x-0.5" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </SurfaceCard>
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

  const accent = React.useMemo(() => {
    const theme = asRecord(path.theme);
    const accentValue = asRecord(theme?.accent);
    const accentStrongValue = asRecord(theme?.accentStrong);
    const glowValue = asRecord(theme?.glow);

    if (
      typeof accentValue?.r === "number" &&
      typeof accentValue?.g === "number" &&
      typeof accentValue?.b === "number"
    ) {
      const safeAccent: Rgb = {
        r: accentValue.r,
        g: accentValue.g,
        b: accentValue.b,
      };

      const safeAccentStrong: Rgb =
        accentStrongValue &&
        typeof accentStrongValue.r === "number" &&
        typeof accentStrongValue.g === "number" &&
        typeof accentStrongValue.b === "number"
          ? {
              r: accentStrongValue.r,
              g: accentStrongValue.g,
              b: accentStrongValue.b,
            }
          : safeAccent;

      const safeGlow: Rgb =
        glowValue &&
        typeof glowValue.r === "number" &&
        typeof glowValue.g === "number" &&
        typeof glowValue.b === "number"
          ? {
              r: glowValue.r,
              g: glowValue.g,
              b: glowValue.b,
            }
          : safeAccent;

      return {
        accent: safeAccent,
        accentStrong: safeAccentStrong,
        glow: safeGlow,
      };
    }

    return {
      accent: { r: 251, g: 191, b: 36 },
      accentStrong: { r: 245, g: 158, b: 11 },
      glow: { r: 252, g: 211, b: 77 },
    };
  }, [path.theme]);

  const overallSignalScore = React.useMemo(
    () => getOverallSignalScore(path.fitSignals),
    [path.fitSignals]
  );

  const signalLabel = React.useMemo(
    () => getSignalLabel(overallSignalScore),
    [overallSignalScore]
  );

  const whatYouExplore = React.useMemo(
    () => normalizeWhatYouExplore((path as Record<string, unknown>).whatYouExplore),
    [path]
  );

  const featuredOpportunity = React.useMemo(
    () =>
      normalizeFeaturedOpportunity(
        (path as Record<string, unknown>).featuredOpportunity
      ),
    [path]
  );

  const opportunityGroups = React.useMemo(
    () =>
      normalizeOpportunityGroups(
        (path as Record<string, unknown>).opportunityGroups
      ),
    [path]
  );

  const hero = asRecord(path.hero);
  const card = asRecord(path.card);

  const traitChips: TraitChip[] = Array.isArray(path.traitChips)
    ? (path.traitChips as TraitChip[])
    : [];

  const fitSignals: FitSignal[] = Array.isArray(path.fitSignals)
    ? (path.fitSignals as FitSignal[])
    : [];

  const openingLead = firstName
    ? `${firstName}, this is not about picking a forever answer. It is about noticing signal.`
    : "This is not about picking a forever answer. It is about noticing signal.";

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

        <SurfaceCard
          accent={accent.accent}
          glow={accent.glow}
          className="px-5 py-5 sm:px-6 sm:py-6"
        >
          <div
            className="pointer-events-none absolute -left-10 -top-10 h-36 w-40 rounded-full blur-3xl"
            style={{ background: rgb(accent.accent, 0.12) }}
          />
          <div
            className="pointer-events-none absolute right-[18%] top-[-24px] h-28 w-40 rounded-full blur-3xl"
            style={{ background: rgb(accent.accentStrong, 0.08) }}
          />
          <div
            className="pointer-events-none absolute right-10 top-0 h-24 w-32 rounded-full blur-3xl"
            style={{ background: rgb(accent.glow, 0.08) }}
          />

          <WorldHeroOrb
            accent={accent.accent}
            accentStrong={accent.accentStrong}
            glow={accent.glow}
          />

          <div className="pr-14 sm:pr-20">
            <div className={sectionKicker()}>
              {asString(hero?.eyebrow) || "World Path"}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
              <h1 className="max-w-[12ch] text-[2rem] font-semibold leading-[0.98] tracking-[-0.05em] text-white/97 sm:max-w-none sm:text-[2.35rem]">
                {asString(hero?.title) || asString(card?.title) || "World Path"}
              </h1>

              <HeroInlineSignal
                score={overallSignalScore}
                accent={accent.accent}
                glow={accent.glow}
              />
            </div>

            <div className="mt-1.5 text-[12px] uppercase tracking-[0.16em] text-white/42">
              {signalLabel}
            </div>

            {asString(hero?.hook) ? (
              <p className="mt-3 text-[1rem] leading-6.5 text-white/80 sm:text-[1.06rem]">
                {asString(hero?.hook)}
              </p>
            ) : null}

            <div className="mt-3 space-y-3 text-[14px] leading-6 text-white/62 sm:text-[15px]">
              <p>{openingLead}</p>
              {asString(hero?.summary) ? <p>{asString(hero?.summary)}</p> : null}
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard
          accent={accent.accentStrong}
          glow={accent.glow}
          className="px-5 py-5 sm:px-6 sm:py-6"
        >
          <div
            className="pointer-events-none absolute -left-8 top-0 h-28 w-28 rounded-full blur-3xl"
            style={{ background: rgb(accent.accentStrong, 0.11) }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 h-28 w-36 rounded-full blur-3xl"
            style={{ background: rgb(accent.glow, 0.08) }}
          />

          <div className="flex items-start gap-3">
            <div
              className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border sm:h-10 sm:w-10"
              style={{
                borderColor: rgb(accent.accentStrong, 0.24),
                background: `linear-gradient(180deg, ${rgb(
                  accent.accentStrong,
                  0.16
                )} 0%, ${rgb(accent.accentStrong, 0.05)} 100%)`,
                boxShadow: `0 0 20px ${rgb(accent.accentStrong, 0.14)}`,
              }}
            >
              <Radar
                className="relative h-4 w-4 sm:h-[17px] sm:w-[17px]"
                style={{ color: rgb(accent.accentStrong, 0.96) }}
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

          {traitChips.length ? (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {traitChips.map((chip) => (
                <span
                  key={chip.id}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/74"
                >
                  {chip.label}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-2.5 space-y-2.5">
            {fitSignals.map((signal) => (
              <SignalRow
                key={signal.id}
                signal={signal}
                accent={accent.accent}
                accentStrong={accent.accentStrong}
                glow={accent.glow}
              />
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard
          accent={accent.glow}
          glow={accent.accentStrong}
          className="px-5 py-5 sm:px-6 sm:py-6"
        >
          <div className="flex items-start gap-3">
            <div
              className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border sm:h-10 sm:w-10"
              style={{
                borderColor: rgb(accent.glow, 0.24),
                background: `linear-gradient(180deg, ${rgb(
                  accent.glow,
                  0.16
                )} 0%, ${rgb(accent.glow, 0.05)} 100%)`,
                boxShadow: `0 0 20px ${rgb(accent.glow, 0.14)}`,
              }}
            >
              <Globe2
                className="relative h-4 w-4 sm:h-[17px] sm:w-[17px]"
                style={{ color: rgb(accent.glow, 0.96) }}
              />
            </div>

            <div className="min-w-0">
              <div className={sectionKicker()}>What you&apos;ll actually explore</div>
              <h2 className="mt-0.5 text-[1.04rem] font-semibold tracking-[-0.03em] text-white/95 sm:text-[1.14rem]">
                The parts of this world you would really step into
              </h2>
            </div>
          </div>

          {whatYouExplore.length ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {whatYouExplore.map((item) => (
                <ExploreCard
                  key={item.id}
                  item={item}
                  accent={accent.glow}
                  glow={accent.accentStrong}
                />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-[14px] leading-6 text-white/62">
              Add `whatYouExplore` content in the world path data and it will
              render here automatically.
            </p>
          )}
        </SurfaceCard>

        <FeaturedOpportunityCard
          opportunity={featuredOpportunity}
          accent={accent.accent}
          glow={accent.glow}
        />

        {opportunityGroups.map((group) => (
          <OpportunityGroupCard
            key={group.id}
            group={group}
            accent={accent.accentStrong}
            glow={accent.glow}
          />
        ))}

        {!opportunityGroups.length ? (
          <SurfaceCard
            accent={accent.accentStrong}
            glow={accent.glow}
            className="px-5 py-5 sm:px-6 sm:py-6"
          >
            <div className={sectionKicker()}>Ways to step in</div>
            <h2 className="mt-2 text-[1.08rem] font-semibold tracking-[-0.03em] text-white/95 sm:text-[1.18rem]">
              Opportunity groups will show here
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-white/62">
              Add `opportunityGroups` to this world path and the full set of
              local and online options will render inline here.
            </p>
          </SurfaceCard>
        ) : null}

        <div className="pb-2" />
      </div>
    </main>
  );
}