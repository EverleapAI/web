// apps/web/src/app/(app)/main/explore/learning/[pathId]/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Map,
  Radar,
  Sparkles,
  Wand2,
} from "lucide-react";

import { requireLearningPath } from "../_data/learningPaths";
import type {
  LearningFitSignal,
  LearningPathContent,
  LearningTraitChip,
} from "../_data/learningPathSchema";

/* =============================================================================
Helpers
============================================================================= */

function rgb(value: { r: number; g: number; b: number }, alpha = 1) {
  return `rgba(${value.r}, ${value.g}, ${value.b}, ${alpha})`;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function sectionKicker() {
  return "text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40";
}

function readStoredFirstName() {
  if (typeof window === "undefined") return "";

  const candidateKeys = [
    "everleapOnboarding_v4_convo_min",
    "everleap.story.answers.v3",
    "everleap.story.answers.v2",
    "everleap.story.answers",
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
        parsed?.answers?.firstName ??
        parsed?.answers?.name;

      if (typeof firstName === "string" && firstName.trim()) {
        return firstName.trim();
      }
    } catch {
      // ignore parse issues
    }
  }

  return "";
}

function getSignalWidth(score: number) {
  const safe = Math.max(0, Math.min(100, score));
  return `${safe}%`;
}

function getPathAgenticOpening(firstName: string, title: string) {
  if (firstName) {
    return `${firstName}, ${title} is not about locking yourself into one giant future decision. It is about noticing what kind of learning actually gives you energy, then following that signal into real action.`;
  }

  return `${title} is not about forcing a permanent decision. It is about noticing what kind of learning actually gives you energy, then following that signal into something real.`;
}

/* =============================================================================
Shared Surface Card
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
      className={cx(
        "relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl",
        className
      )}
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
Section Header
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

function LearningPathHeroEmblem({
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
      <div className="flex items-center justify-between gap-3">
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
            width: getSignalWidth(score),
            background: `linear-gradient(90deg, ${rgb(
              accent,
              0.9
            )}, ${rgb(accentStrong, 1)})`,
            boxShadow: `0 0 12px ${rgb(glow, 0.3)}`,
          }}
        />
      </div>

      <p className="mt-3 text-[13px] text-white/60">{explanation}</p>
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

export default function LearningPathPage() {
  const params = useParams<{ pathId: string }>();
  const pathId = typeof params?.pathId === "string" ? params.pathId : "";

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

  const opening = getPathAgenticOpening(firstName, path.card.title);
  const visibleSignals: LearningFitSignal[] = path.fitSignals.slice(0, 2);
  const visibleChips: LearningTraitChip[] = path.traitChips.slice(0, 3);

  const exploreLinks = [
    {
      href: `/main/explore/learning/${path.slug}/try-now`,
      title: "Try this path now",
      description:
        "Start with small experiments and starter projects you can feel right away.",
      icon: Wand2,
      glow: path.theme.accent,
    },
    {
      href: `/main/explore/learning/${path.slug}/branches`,
      title: "Branches inside this path",
      description:
        "See the different directions this learning path can take.",
      icon: Compass,
      glow: path.theme.glow ?? path.theme.accent,
    },
    {
      href: `/main/explore/learning/${path.slug}/next-steps`,
      title: "Real next steps",
      description:
        "Real educational opportunities, online options, and local ways forward.",
      icon: Map,
      glow: path.theme.accentStrong ?? path.theme.accent,
    },
  ];

  return (
    <main className="relative bg-[#050914] text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,9,20,1) 0%, rgba(6,11,22,1) 42%, rgba(5,9,20,1) 100%)",
        }}
      />

      <div className="relative flex w-full flex-col gap-5 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/main/explore/learning"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Learning
          </Link>

          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            {path.hero.eyebrow}
          </div>
        </div>

        <SurfaceCard
          accent={path.theme.accent}
          glow={path.theme.glow ?? path.theme.accent}
          className="px-5 py-5"
        >
          <LearningPathHeroEmblem
            accent={path.theme.accent}
            accentStrong={path.theme.accentStrong ?? path.theme.accent}
            glow={path.theme.glow ?? path.theme.accent}
          />

          <div className="max-w-[86%]">
            <div className={sectionKicker()}>
              {path.theme.surfaceLabel ?? "Learning path"}
            </div>

            <h1 className="mt-2 text-[2.4rem] font-semibold tracking-[-0.04em]">
              {path.hero.title}
            </h1>

            <p className="mt-3 text-[1.1rem] text-white/70">{path.hero.hook}</p>

            <p className="mt-4 text-[14px] text-white/60">{path.hero.summary}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {visibleChips.map((chip: LearningTraitChip) => (
                <span
                  key={chip.id}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12px]"
                >
                  {chip.label}
                </span>
              ))}
            </div>

            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Why this may fit
              </div>

              <p className="mt-2 text-[15px] font-medium text-white/90">
                {opening}
              </p>

              <div className="mt-3 space-y-2">
                {path.hero.whyItPullsYouIn
                  .slice(0, 2)
                  .map((item: string, index: number) => (
                    <div
                      key={`${item}-${index}`}
                      className="flex items-start gap-2.5 text-[13px] text-white/62"
                    >
                      <span
                        className="mt-[7px] h-1.5 w-1.5 rounded-full"
                        style={{ background: rgb(path.theme.accent, 0.95) }}
                      />
                      <span>{item}</span>
                    </div>
                  ))}
              </div>

              <p className="mt-3 text-[13px] text-white/56">
                The coming pages include real educational opportunities,
                practical online options, and local ways to keep moving.
              </p>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard
          accent={path.theme.accentStrong ?? path.theme.accent}
          glow={path.theme.glow ?? path.theme.accent}
          className="px-5 py-5"
        >
          <SectionHeader
            icon={Radar}
            kicker="Fit signals"
            title="Signs this path may feel right"
            accent={path.theme.accentStrong ?? path.theme.accent}
          />

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {visibleSignals.map((signal: LearningFitSignal) => (
              <FitSignalCard
                key={signal.id}
                label={signal.label}
                score={signal.score}
                explanation={signal.explanation}
                accent={path.theme.accent}
                accentStrong={path.theme.accentStrong ?? path.theme.accent}
                glow={path.theme.glow ?? path.theme.accent}
              />
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard
          accent={path.theme.glow ?? path.theme.accent}
          glow={path.theme.accentStrong ?? path.theme.accent}
          className="px-5 py-5"
        >
          <SectionHeader
            icon={Sparkles}
            kicker="Keep exploring"
            title="Move from understanding into action"
            accent={path.theme.glow ?? path.theme.accent}
            description="This page gives you the shape of the path. These next pages make it real, with experiments, deeper directions, and real educational opportunities."
          />

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {exploreLinks.map((item) => (
              <ExploreLinkCard key={item.href} {...item} />
            ))}
          </div>
        </SurfaceCard>
      </div>
    </main>
  );
}