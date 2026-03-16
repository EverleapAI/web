// apps/web/src/app/(app)/main/explore/world/[pathId]/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Globe,
  Map,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { requireWorldPath } from "../_data/worldPaths";
import type {
  Rgb,
  WorldAction,
  WorldBranchPreview,
  WorldFitSignal,
  WorldPathContent,
} from "../_data/worldPathSchema";

/* =============================================================================
   Helpers
============================================================================= */

function rgb(value: Rgb, alpha = 1) {
  return `rgba(${value.r}, ${value.g}, ${value.b}, ${alpha})`;
}

function shellSurface(dark: boolean) {
  return dark
    ? "border border-white/10 bg-white/[0.055] backdrop-blur-2xl"
    : "border border-black/8 bg-white/80 backdrop-blur-2xl";
}

function panelSurface(dark: boolean) {
  return dark
    ? "border border-white/10 bg-black/20 backdrop-blur-xl"
    : "border border-black/10 bg-black/[0.03] backdrop-blur-xl";
}

function textPrimary(dark: boolean) {
  return dark ? "text-white" : "text-[#111827]";
}

function textSecondary(dark: boolean) {
  return dark ? "text-white/72" : "text-black/65";
}

function textMuted(dark: boolean) {
  return dark ? "text-white/52" : "text-black/50";
}

function pageWrap(dark: boolean) {
  return dark
    ? "min-h-screen bg-[#07111A]"
    : "min-h-screen bg-[#F6F7FB]";
}

function getEnergyLabel(energy: WorldBranchPreview["energy"]) {
  switch (energy) {
    case "adventure":
      return "Adventure";
    case "high-energy":
      return "High energy";
    case "grounded":
      return "Grounded";
    case "reflective":
      return "Reflective";
    case "builder":
      return "Builder";
    case "people":
      return "People";
    case "creative":
      return "Creative";
    default:
      return "Path";
  }
}

function getBranchEnergyClasses(
  energy: WorldBranchPreview["energy"],
  accent: Rgb
) {
  switch (energy) {
    case "adventure":
      return {
        border: `1px solid ${rgb(accent, 0.24)}`,
        bg: `linear-gradient(180deg, ${rgb(accent, 0.16)} 0%, ${rgb(
          accent,
          0.08
        )} 100%)`,
      };
    case "high-energy":
      return {
        border: `1px solid ${rgb(accent, 0.22)}`,
        bg: `linear-gradient(180deg, ${rgb(accent, 0.15)} 0%, ${rgb(
          accent,
          0.07
        )} 100%)`,
      };
    case "grounded":
      return {
        border: `1px solid ${rgb(accent, 0.18)}`,
        bg: `linear-gradient(180deg, ${rgb(accent, 0.1)} 0%, ${rgb(
          accent,
          0.04
        )} 100%)`,
      };
    case "reflective":
      return {
        border: `1px solid ${rgb(accent, 0.16)}`,
        bg: `linear-gradient(180deg, ${rgb(accent, 0.09)} 0%, ${rgb(
          accent,
          0.035
        )} 100%)`,
      };
    case "builder":
      return {
        border: `1px solid ${rgb(accent, 0.2)}`,
        bg: `linear-gradient(180deg, ${rgb(accent, 0.12)} 0%, ${rgb(
          accent,
          0.05
        )} 100%)`,
      };
    case "people":
      return {
        border: `1px solid ${rgb(accent, 0.2)}`,
        bg: `linear-gradient(180deg, ${rgb(accent, 0.12)} 0%, ${rgb(
          accent,
          0.05
        )} 100%)`,
      };
    case "creative":
      return {
        border: `1px solid ${rgb(accent, 0.2)}`,
        bg: `linear-gradient(180deg, ${rgb(accent, 0.13)} 0%, ${rgb(
          accent,
          0.055
        )} 100%)`,
      };
    default:
      return {
        border: `1px solid ${rgb(accent, 0.18)}`,
        bg: `linear-gradient(180deg, ${rgb(accent, 0.1)} 0%, ${rgb(
          accent,
          0.04
        )} 100%)`,
      };
  }
}

/* =============================================================================
   Agentic opening
============================================================================= */

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
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

      const candidates = [
        parsed.firstName,
        parsed.firstname,
        parsed.first_name,
        parsed.name,
        asRecord(parsed.profile)?.firstName,
        asRecord(parsed.profile)?.name,
        asRecord(parsed.answers)?.firstName,
        asRecord(parsed.answers)?.name,
      ];

      for (const value of candidates) {
        const found = asString(value);
        if (found) return found.split(" ")[0];
      }
    } catch {}
  }

  return null;
}

function getWorldAgenticOpening(
  firstName: string | null,
  path: WorldPathContent
) {
  const titleBase = path.hero.title;
  const hookBase = path.hero.hook;

  if (firstName) {
    return {
      title: `${firstName}, this world path opens up through curiosity, not pressure.`,
      bodyA:
        hookBase,
      bodyB:
        `The point is not to have your whole future figured out. It is to notice whether ${titleBase.toLowerCase()} gives your mind that feeling of pull — where questions get bigger, places feel more alive, and the world starts connecting in new ways.`,
    };
  }

  return {
    title: "This world path opens up through curiosity, not pressure.",
    bodyA: hookBase,
    bodyB:
      `The point is not to have your whole future figured out. It is to notice whether ${titleBase.toLowerCase()} gives your mind that feeling of pull — where questions get bigger, places feel more alive, and the world starts connecting in new ways.`,
  };
}

/* =============================================================================
   Shell components
============================================================================= */

function SurfaceCard({
  children,
  accent,
  dark = true,
  className = "",
}: {
  children: React.ReactNode;
  accent: Rgb;
  dark?: boolean;
  className?: string;
}) {
  return (
    <section
      className={[
        "relative overflow-hidden rounded-[30px] px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:px-6 sm:py-6",
        shellSurface(dark),
        className,
      ].join(" ")}
      style={{
        boxShadow: `0 24px 80px rgba(0,0,0,0.28), 0 0 0 1px ${rgb(
          accent,
          0.06
        )}`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 88% 16%, ${rgb(
            accent,
            0.16
          )} 0%, transparent 18%), radial-gradient(circle at 12% 12%, ${rgb(
            accent,
            0.09
          )} 0%, transparent 20%), linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 52%)`,
        }}
      />
      <div className="relative">{children}</div>
    </section>
  );
}

function SectionHeader({
  icon,
  kicker,
  title,
  body,
  accent,
  dark = true,
}: {
  icon: React.ReactNode;
  kicker: string;
  title: string;
  body?: string;
  accent: Rgb;
  dark?: boolean;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl border"
          style={{
            borderColor: rgb(accent, 0.2),
            background: `linear-gradient(180deg, ${rgb(accent, 0.16)} 0%, ${rgb(
              accent,
              0.08
            )} 100%)`,
            color: rgb(accent, 0.96),
          }}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p
            className={[
              "text-[11px] font-semibold uppercase tracking-[0.18em]",
              textMuted(dark),
            ].join(" ")}
          >
            {kicker}
          </p>
          <h2
            className={[
              "mt-1 text-[24px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[28px]",
              textPrimary(dark),
            ].join(" ")}
          >
            {title}
          </h2>
        </div>
      </div>

      {body ? (
        <p
          className={[
            "mt-4 max-w-[58rem] text-[15px] leading-[1.72] sm:text-[15.5px]",
            textSecondary(dark),
          ].join(" ")}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

function WorldPathHeroEmblem({
  accent,
  glow,
}: {
  accent: Rgb;
  glow: Rgb;
}) {
  return (
    <div className="pointer-events-none absolute right-4 top-4 hidden h-[120px] w-[120px] sm:block">
      <div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${rgb(
            glow,
            0.24
          )} 0%, ${rgb(accent, 0.08)} 42%, transparent 72%)`,
        }}
      />
      <div
        className="absolute inset-[8px] rounded-full border"
        style={{ borderColor: rgb(accent, 0.13) }}
      />
      <div
        className="absolute inset-[28px] rounded-full border"
        style={{ borderColor: rgb(accent, 0.16) }}
      />
      <div
        className="absolute left-[18px] top-[24px] h-3 w-3 rounded-full"
        style={{
          backgroundColor: rgb(accent, 0.9),
          boxShadow: `0 0 20px ${rgb(glow, 0.4)}`,
        }}
      />
      <div
        className="absolute left-[72px] top-[28px] h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: rgb(accent, 0.55) }}
      />
      <div
        className="absolute left-[42px] top-[78px] h-3 w-3 rounded-full"
        style={{
          backgroundColor: rgb(accent, 0.82),
          boxShadow: `0 0 18px ${rgb(glow, 0.3)}`,
        }}
      />
      <div
        className="absolute left-[28px] top-[38px] h-px w-[44px]"
        style={{
          background: `linear-gradient(90deg, ${rgb(accent, 0.3)} 0%, transparent 100%)`,
        }}
      />
      <div
        className="absolute left-[50px] top-[48px] h-px w-[26px] rotate-[14deg]"
        style={{
          background: `linear-gradient(90deg, ${rgb(accent, 0.22)} 0%, transparent 100%)`,
        }}
      />
      <div
        className="absolute bottom-[8px] right-[4px] flex h-10 w-10 items-center justify-center rounded-full border"
        style={{
          borderColor: rgb(accent, 0.16),
          backgroundColor: rgb(accent, 0.08),
          color: rgb(accent, 0.92),
        }}
      >
        <Globe className="h-4 w-4" />
      </div>
    </div>
  );
}

function FitSignalCard({
  signal,
  accent,
}: {
  signal: WorldFitSignal;
  accent: Rgb;
}) {
  return (
    <div
      className="rounded-[24px] border px-4 py-4"
      style={{
        borderColor: rgb(accent, 0.16),
        background: `linear-gradient(180deg, ${rgb(accent, 0.1)} 0%, rgba(255,255,255,0.02) 100%)`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold leading-[1.35] text-white">
            {signal.label}
          </h3>
          <p className="mt-2 text-[14px] leading-[1.7] text-white/68">
            {signal.explanation}
          </p>
        </div>

        <div
          className="shrink-0 rounded-full border px-3 py-1 text-[12px] font-semibold tracking-[0.02em] text-white/90"
          style={{
            borderColor: rgb(accent, 0.22),
            backgroundColor: rgb(accent, 0.16),
          }}
        >
          {signal.score}
        </div>
      </div>
    </div>
  );
}

function ExploreLinkCard({
  href,
  label,
  title,
  body,
  accent,
}: {
  href: string;
  label: string;
  title: string;
  body: string;
  accent: Rgb;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-[24px] border px-4 py-4 transition hover:translate-y-[-1px] hover:bg-white/[0.06]"
      style={{
        borderColor: rgb(accent, 0.16),
        background: `linear-gradient(180deg, ${rgb(accent, 0.08)} 0%, rgba(255,255,255,0.02) 100%)`,
      }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/46">
        {label}
      </p>
      <div className="mt-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-white">
            {title}
          </h3>
          <p className="mt-2 text-[14px] leading-[1.7] text-white/68">
            {body}
          </p>
        </div>
        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-white/54 transition group-hover:translate-x-0.5 group-hover:text-white/84" />
      </div>
    </Link>
  );
}

function ActionCard({
  action,
  accent,
}: {
  action: WorldAction;
  accent: Rgb;
}) {
  return (
    <div
      className="rounded-[24px] border px-4 py-4"
      style={{
        borderColor: rgb(accent, 0.14),
        background: `linear-gradient(180deg, ${rgb(accent, 0.08)} 0%, rgba(255,255,255,0.02) 100%)`,
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/84"
          style={{
            borderColor: rgb(accent, 0.2),
            backgroundColor: rgb(accent, 0.14),
          }}
        >
          {action.type}
        </span>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-medium text-white/60">
          {action.effort}
        </span>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-medium text-white/60">
          {action.timeEstimate}
        </span>
      </div>

      <h3 className="mt-3 text-[16px] font-semibold tracking-[-0.02em] text-white">
        {action.title}
      </h3>

      <p className="mt-2 text-[14px] leading-[1.72] text-white/72">
        {action.whyThisMatters}
      </p>

      <ul className="mt-3 space-y-2">
        {action.instructions.map((step, index) => (
          <li
            key={`${action.id}-${index}`}
            className="flex gap-3 text-[14px] leading-[1.65] text-white/72"
          >
            <span
              className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: rgb(accent, 0.9) }}
            />
            <span>{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BranchPreviewCard({
  branch,
  accent,
}: {
  branch: WorldBranchPreview;
  accent: Rgb;
}) {
  const energyStyle = getBranchEnergyClasses(branch.energy, accent);

  return (
    <div
      className="rounded-[24px] px-4 py-4"
      style={{
        border: energyStyle.border,
        background: energyStyle.bg,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-white">
          {branch.title}
        </h3>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-medium text-white/65">
          {getEnergyLabel(branch.energy)}
        </span>
      </div>

      <p className="mt-2 text-[14px] font-medium leading-[1.6] text-white/84">
        {branch.oneLiner}
      </p>

      <p className="mt-2 text-[14px] leading-[1.7] text-white/68">
        {branch.whyItCouldFit}
      </p>
    </div>
  );
}

/* =============================================================================
   Page
============================================================================= */

export default function WorldPathDetailPage() {
  const params = useParams<{ pathId: string }>();
  const [firstName, setFirstName] = React.useState<string | null>(null);
  const dark = true;

  const pathId = typeof params?.pathId === "string" ? params.pathId : "";
  if (!pathId) notFound();

  let path: WorldPathContent;
  try {
    path = requireWorldPath(pathId);
  } catch {
    notFound();
  }

  React.useEffect(() => {
    setFirstName(readStoredFirstName());
  }, []);

  const opening = getWorldAgenticOpening(firstName, path);
  const accent = path.theme.accent;
  const glow = path.theme.glow;

  return (
    <main className={pageWrap(dark)}>
      <div className="relative mx-auto flex w-full max-w-none flex-col gap-5 px-4 pb-24 pt-4 sm:px-5 lg:px-6">
        <div className="flex items-center">
          <Link
            href="/main/explore/world"
            className={[
              "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium transition hover:bg-white/[0.06]",
              panelSurface(dark),
              textSecondary(dark),
            ].join(" ")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to World
          </Link>
        </div>

        <SurfaceCard accent={accent} dark={dark}>
          <WorldPathHeroEmblem accent={accent} glow={glow} />

          <div className="max-w-[72rem] pr-0 sm:pr-28">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/44">
              {path.hero.eyebrow}
            </p>

            <h1 className="mt-3 text-[31px] font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-[40px] lg:text-[46px]">
              {path.hero.title}
            </h1>

            <p className="mt-4 max-w-[58rem] text-[15px] font-medium leading-[1.72] text-white/86 sm:text-[16px]">
              {opening.title}
            </p>

            <p className="mt-4 max-w-[58rem] text-[15px] leading-[1.72] text-white/72 sm:text-[15.5px]">
              {opening.bodyA}
            </p>

            <p className="mt-4 max-w-[58rem] text-[15px] leading-[1.72] text-white/72 sm:text-[15.5px]">
              {opening.bodyB}
            </p>

            <p className="mt-5 max-w-[58rem] text-[15px] leading-[1.78] text-white/76 sm:text-[15.5px]">
              {path.hero.summary}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {path.traitChips.map((chip) => (
                <span
                  key={chip.id}
                  className="rounded-full border px-3 py-1.5 text-[12px] font-medium text-white/74"
                  style={{
                    borderColor: rgb(accent, 0.18),
                    backgroundColor: rgb(accent, 0.1),
                  }}
                >
                  {chip.label}
                </span>
              ))}
            </div>

            <ul className="mt-5 space-y-2.5">
              {path.hero.whyItPullsYouIn.map((item, index) => (
                <li
                  key={`${path.id}-pull-${index}`}
                  className="flex gap-3 text-[14px] leading-[1.7] text-white/72 sm:text-[14.5px]"
                >
                  <span
                    className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: rgb(accent, 0.92) }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </SurfaceCard>

        <SurfaceCard accent={accent} dark={dark}>
          <SectionHeader
            icon={<Sparkles className="h-4 w-4" />}
            kicker="Fit signals"
            title="Why this may be pulling at you"
            body="These are not test results. They are signs the path may already match how your curiosity naturally moves."
            accent={accent}
            dark={dark}
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {path.fitSignals.map((signal) => (
              <FitSignalCard
                key={signal.id}
                signal={signal}
                accent={accent}
              />
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard accent={accent} dark={dark}>
          <SectionHeader
            icon={<Compass className="h-4 w-4" />}
            kicker="Keep exploring"
            title="Three ways to go deeper"
            body="You do not need to read everything at once. Pick the door that feels most alive right now."
            accent={accent}
            dark={dark}
          />

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <ExploreLinkCard
              href={`/main/explore/world/${path.slug}/try-now`}
              label="Try now"
              title="Do something small right away"
              body="Immediate, low-friction ways to test this path in the real world."
              accent={accent}
            />
            <ExploreLinkCard
              href={`/main/explore/world/${path.slug}/branches`}
              label="Branches"
              title="See where this path can branch"
              body="Different directions inside this world path, depending on what kind of questions pull you most."
              accent={accent}
            />
            <ExploreLinkCard
              href={`/main/explore/world/${path.slug}/next-steps`}
              label="Next steps"
              title="Find real ways to go deeper"
              body="Educational, online, and real-world opportunities to build momentum from curiosity into action."
              accent={accent}
            />
          </div>
        </SurfaceCard>

        <SurfaceCard accent={accent} dark={dark}>
          <SectionHeader
            icon={<Map className="h-4 w-4" />}
            kicker="Inside this path"
            title="Where this world path starts branching"
            body="These are not final categories. They are different flavors of the same curiosity."
            accent={accent}
            dark={dark}
          />

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {path.branchPreviews.map((branch) => (
              <BranchPreviewCard
                key={branch.id}
                branch={branch}
                accent={accent}
              />
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard accent={accent} dark={dark}>
          <SectionHeader
            icon={<Globe className="h-4 w-4" />}
            kicker="Try now"
            title={path.tryNow.title}
            body={path.tryNow.summary}
            accent={accent}
            dark={dark}
          />

          <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
            {path.tryNow.actions.map((action) => (
              <ActionCard key={action.id} action={action} accent={accent} />
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard accent={accent} dark={dark}>
          <SectionHeader
            icon={<TrendingUp className="h-4 w-4" />}
            kicker="What it can feel like"
            title={path.howItFeels.title}
            body={path.howItFeels.summary}
            accent={accent}
            dark={dark}
          />

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {path.howItFeels.moments.map((moment) => (
              <div
                key={moment.id}
                className="rounded-[24px] border px-4 py-4"
                style={{
                  borderColor: rgb(accent, 0.14),
                  background: `linear-gradient(180deg, ${rgb(
                    accent,
                    0.08
                  )} 0%, rgba(255,255,255,0.02) 100%)`,
                }}
              >
                <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-white">
                  {moment.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.72] text-white/68">
                  {moment.body}
                </p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </main>
  );
}