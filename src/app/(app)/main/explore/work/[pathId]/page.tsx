// apps/web/src/app/(app)/main/explore/work/[pathId]/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  Briefcase,
  CalendarClock,
  Compass,
  Sparkles,
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
  return `rgba(${value.r},${value.g},${value.b},${alpha})`;
}

function scoreWidth(score: number) {
  return `${Math.max(0, Math.min(100, score))}%`;
}

function sectionKicker() {
  return "text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40";
}

function firstSentence(text: string) {
  const trimmed = text.trim();
  const match = trimmed.match(/^.*?[.!?](?:\s|$)/);
  return match ? match[0].trim() : trimmed;
}

/* =============================================================================
   Surface Card
============================================================================= */

function SurfaceCard({
  children,
  accent,
  glow,
  className = "",
}: {
  children: React.ReactNode;
  accent: { r: number; g: number; b: number };
  glow: { r: number; g: number; b: number };
  className?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl ${className}`}
      style={{
        boxShadow: `0 18px 48px rgba(0,0,0,0.24), 0 0 0 1px ${rgb(accent, 0.04)}`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-20"
        style={{
          background: `linear-gradient(180deg, ${rgb(
            accent,
            0.12
          )} 0%, transparent 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute right-[-20px] top-[-20px] h-24 w-24 rounded-full blur-2xl"
        style={{ background: rgb(glow, 0.12) }}
      />
      <div className="relative">{children}</div>
    </section>
  );
}

/* =============================================================================
   Section Header Icon
============================================================================= */

function SectionHeader({
  icon: Icon,
  kicker,
  title,
  accent,
  description,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  kicker: string;
  title?: string;
  accent: { r: number; g: number; b: number };
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3 sm:gap-4">
      <div
        className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border sm:h-11 sm:w-11"
        style={{
          borderColor: rgb(accent, 0.2),
          background: `linear-gradient(180deg, ${rgb(
            accent,
            0.12
          )} 0%, ${rgb(accent, 0.05)} 100%)`,
          boxShadow: `0 0 20px ${rgb(accent, 0.12)}`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle at 30% 25%, ${rgb(
              accent,
              0.2
            )} 0%, transparent 68%)`,
          }}
        />
        <Icon
          className="relative h-4 w-4 sm:h-[18px] sm:w-[18px]"
          style={{ color: rgb(accent, 0.94) }}
        />
      </div>

      <div className="min-w-0">
        <div className={sectionKicker()}>{kicker}</div>
        {title ? (
          <h2 className="mt-1 text-[1.15rem] font-semibold tracking-[-0.03em] text-white/94 sm:text-[1.3rem]">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="mt-1 text-[13px] leading-5.5 text-white/62 sm:text-[14px] sm:leading-6">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* =============================================================================
   Hero Emblem
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
    <div className="pointer-events-none absolute right-4 top-4 h-20 w-20">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${rgb(
            glow,
            0.18
          )} 0%, transparent 70%)`,
          filter: "blur(8px)",
        }}
      />

      <div
        className="absolute inset-[18%] rounded-full border"
        style={{ borderColor: rgb(accent, 0.2) }}
      />

      <div
        className="absolute left-[28%] top-[30%] h-[8px] w-[8px] rounded-full"
        style={{
          background: rgb(accent, 0.9),
          boxShadow: `0 0 10px ${rgb(accent, 0.4)}`,
        }}
      />

      <div
        className="absolute right-[22%] top-[34%] h-[7px] w-[7px] rounded-full"
        style={{
          background: "white",
          boxShadow: "0 0 8px rgba(255,255,255,0.5)",
        }}
      />

      <div
        className="absolute left-[36%] bottom-[24%] h-[8px] w-[8px] rounded-full"
        style={{
          background: rgb(accentStrong, 0.9),
          boxShadow: `0 0 10px ${rgb(accentStrong, 0.4)}`,
        }}
      />
    </div>
  );
}

/* =============================================================================
   Fit Signal Card
============================================================================= */

function FitSignalCard({
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
  accent: { r: number; g: number; b: number };
  accentStrong: { r: number; g: number; b: number };
  glow: { r: number; g: number; b: number };
}) {
  return (
    <div className="relative rounded-[20px] border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-center justify-between">
        <div className="text-[13px] font-semibold text-white/92">{label}</div>

        <div
          className="rounded-full border px-2 py-0.5 text-[11px]"
          style={{
            borderColor: rgb(accentStrong, 0.2),
            background: rgb(accentStrong, 0.08),
          }}
        >
          {score}
        </div>
      </div>

      <div className="mt-3 h-[5px] overflow-hidden rounded-full bg-white/8">
        <div
          className="h-full rounded-full"
          style={{
            width: scoreWidth(score),
            background: `linear-gradient(90deg, ${rgb(
              accent,
              0.9
            )}, ${rgb(accentStrong, 1)})`,
            boxShadow: `0 0 12px ${rgb(glow, 0.3)}`,
          }}
        />
      </div>

      <p className="mt-3 text-[13px] text-white/60">
        {firstSentence(explanation)}
      </p>
    </div>
  );
}

/* =============================================================================
   Explore Link Card
============================================================================= */

function ExploreLinkCard({
  href,
  title,
  description,
  icon: Icon,
  glow,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  glow: { r: number; g: number; b: number };
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.035] p-4 transition hover:bg-white/[0.05]"
    >
      <div
        className="absolute -right-4 -top-4 h-20 w-20 rounded-full blur-2xl"
        style={{ background: rgb(glow, 0.12) }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10">
            <Icon className="h-4 w-4 text-white/80" />
          </div>

          <div>
            <div className="text-[14px] font-semibold text-white/90">
              {title}
            </div>

            <div className="text-[13px] text-white/60">{description}</div>
          </div>
        </div>

        <ArrowRight className="h-4 w-4 text-white/50 group-hover:text-white" />
      </div>
    </Link>
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
      description: "See the different versions of this work.",
      icon: Briefcase,
      glow: path.theme.accent,
    },
    {
      href: `/main/explore/work/${path.slug}/day`,
      title: "A day in the life",
      description: "What the rhythm of the work feels like.",
      icon: CalendarClock,
      glow: path.theme.glow,
    },
    {
      href: `/main/explore/work/${path.slug}/forecast`,
      title: "The future of this career",
      description: "Demand, salary, and trends.",
      icon: TrendingUp,
      glow: path.theme.accentStrong,
    },
    {
      href: `/main/explore/work/${path.slug}/next-steps`,
      title: "Next steps",
      description: "Real ways to start exploring.",
      icon: Compass,
      glow: path.theme.accent,
    },
  ];

  return (
    <main className="relative text-white">
      <div className="flex w-full flex-col gap-5 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/main/explore/work"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Work
        </Link>

        <SurfaceCard
          accent={path.theme.accent}
          glow={path.theme.glow}
          className="px-5 py-5"
        >
          <WorkPathHeroEmblem
            accent={path.theme.accent}
            accentStrong={path.theme.accentStrong}
            glow={path.theme.glow}
          />

          <div className="max-w-[86%]">
            <div className={sectionKicker()}>{path.hero.eyebrow}</div>

            <h1 className="mt-2 text-[2.4rem] font-semibold tracking-[-0.04em]">
              {path.hero.title}
            </h1>

            <p className="mt-3 text-[1.1rem] text-white/70">
              {path.hero.hook}
            </p>

            <p className="mt-4 text-[14px] text-white/60">
              {path.hero.summary}
            </p>

            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Why this may feel close
              </div>

              <p className="mt-2 text-[15px] font-medium text-white/90">
                “{agenticOpening.intro}”
              </p>

              <p className="mt-2 text-[14px] text-white/60">
                {agenticOpening.body}
              </p>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard
          accent={path.theme.accentStrong}
          glow={path.theme.glow}
          className="px-5 py-5"
        >
          <SectionHeader
            icon={AudioLines}
            kicker="Signals I'm hearing"
            accent={path.theme.accentStrong}
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {path.traitChips.map((chip: { id: string; label: string }) => (
              <span
                key={chip.id}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12px]"
              >
                {chip.label}
              </span>
            ))}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {path.fitSignals.map(
              (signal: {
                id: string;
                label: string;
                score: number;
                explanation: string;
              }) => (
                <FitSignalCard
                  key={signal.id}
                  {...signal}
                  accent={path.theme.accent}
                  accentStrong={path.theme.accentStrong}
                  glow={path.theme.glow}
                />
              )
            )}
          </div>
        </SurfaceCard>

        <SurfaceCard
          accent={path.theme.glow}
          glow={path.theme.accentStrong}
          className="px-5 py-5"
        >
          <SectionHeader
            icon={Sparkles}
            kicker="Keep exploring"
            title="If this still feels interesting, here’s where to go next"
            accent={path.theme.glow}
          />

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {exploreLinks.map((item) => (
              <ExploreLinkCard key={item.href} {...item} />
            ))}
          </div>
        </SurfaceCard>
      </div>
    </main>
  );
}