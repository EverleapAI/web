"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Blocks,
  Bot,
  Coins,
  Compass,
  Gamepad2,
  HeartHandshake,
  Map,
  Radar,
  ScrollText,
  Shield,
  Smartphone,
  Sparkles,
  TestTube2,
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

function rgb(value: { r: number; g: number; b: number }, alpha = 1) {
  return `rgba(${value.r}, ${value.g}, ${value.b}, ${alpha})`;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function pageShell() {
  return "mx-auto w-full max-w-5xl px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10";
}

function shellSurface(dark: boolean) {
  return dark
    ? "border border-white/10 bg-white/[0.055] backdrop-blur-2xl"
    : "border border-black/10 bg-white/80 backdrop-blur-2xl";
}

function textMain(dark: boolean) {
  return dark ? "text-white/95" : "text-slate-950";
}

function textSoft(dark: boolean) {
  return dark ? "text-white/70" : "text-slate-700";
}

function textFaint(dark: boolean) {
  return dark ? "text-white/44" : "text-slate-500";
}

function sectionKicker(dark: boolean) {
  return `text-[10px] font-semibold uppercase tracking-[0.2em] ${textFaint(
    dark
  )}`;
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function toTitleCase(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function firstSentence(text: string) {
  const trimmed = text.trim();
  const match = trimmed.match(/^.*?[.!?](?:\s|$)/);
  return match ? match[0].trim() : trimmed;
}

function getParentLabel(_pathId: string) {
  return "Work";
}

function safePreviewTitle(preview: Record<string, unknown>) {
  return (
    asString(preview.title) ||
    asString(preview.name) ||
    toTitleCase(asString(preview.slug) || asString(preview.id)) ||
    "Specialty"
  );
}

function safePreviewSlug(preview: Record<string, unknown>) {
  return asString(preview.slug) || asString(preview.id);
}

function safePreviewSummary(preview: Record<string, unknown>) {
  return (
    asString(preview.oneLiner) ||
    asString(preview.summary) ||
    asString(preview.hook) ||
    asString(preview.description) ||
    "A distinct flavor inside this path with its own rhythm, strengths, and style of work."
  );
}

function safePreviewFitLine(preview: Record<string, unknown>, fallback: string) {
  const direct =
    asString(preview.whyItMayFit) ||
    asString(preview.fitHint) ||
    asString(preview.fitLine) ||
    asString(preview.whyThisCouldFit) ||
    asString(preview.whyItCouldFit);

  return direct ? firstSentence(direct) : fallback;
}

function safeEnergyLabel(preview: Record<string, unknown>) {
  const raw = asString(preview.energy) || asString(preview.energyLabel);
  if (!raw) return "";

  switch (raw) {
    case "high-energy":
      return "High energy";
    case "high-creative":
      return "High creative";
    case "people":
      return "People";
    case "builder":
      return "Builder";
    case "creative":
      return "Creative";
    case "systems":
      return "Systems";
    case "craft":
      return "Craft";
    case "structured":
      return "Structured";
    case "logic":
      return "Logic";
    default:
      return raw
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
  }
}

function isPreviewRecord(item: unknown): item is Record<string, unknown> {
  return !!item && typeof item === "object";
}

type SpecialtyStyle = {
  accent: { r: number; g: number; b: number };
  glow: { r: number; g: number; b: number };
  fitFallback: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

function specialtyStyleFor(
  preview: Record<string, unknown>,
  index: number
): SpecialtyStyle {
  const slug = safePreviewSlug(preview);

  const presets: SpecialtyStyle[] = [
    {
      accent: { r: 87, g: 196, b: 255 },
      glow: { r: 86, g: 116, b: 255 },
      fitFallback:
        "Strong if you like structure, logic, and how deeper mechanics work.",
      Icon: Blocks,
    },
    {
      accent: { r: 170, g: 124, b: 255 },
      glow: { r: 110, g: 77, b: 220 },
      fitFallback:
        "Strong if you care about style, invention, and how something feels.",
      Icon: Sparkles,
    },
    {
      accent: { r: 255, g: 176, b: 92 },
      glow: { r: 214, g: 126, b: 56 },
      fitFallback:
        "Strong if you like refinement, taste, and shaping quality.",
      Icon: ScrollText,
    },
    {
      accent: { r: 255, g: 112, b: 182 },
      glow: { r: 209, g: 78, b: 144 },
      fitFallback:
        "Strong if you notice human reactions quickly and care what lands.",
      Icon: HeartHandshake,
    },
    {
      accent: { r: 98, g: 228, b: 176 },
      glow: { r: 50, g: 168, b: 118 },
      fitFallback:
        "Strong if you like taking ideas into reality and building durable things.",
      Icon: Compass,
    },
    {
      accent: { r: 112, g: 161, b: 255 },
      glow: { r: 76, g: 118, b: 255 },
      fitFallback:
        "Strong if you like clarity, systems, and solving messy problems cleanly.",
      Icon: Coins,
    },
    {
      accent: { r: 127, g: 220, b: 255 },
      glow: { r: 51, g: 142, b: 255 },
      fitFallback:
        "Strong if you think in movement, pacing, and connected flow.",
      Icon: Map,
    },
    {
      accent: { r: 191, g: 136, b: 255 },
      glow: { r: 139, g: 89, b: 226 },
      fitFallback:
        "Strong if you care about meaning, emotion, and larger arc.",
      Icon: Gamepad2,
    },
  ];

  const exactMap: Record<string, SpecialtyStyle> = {
    "front-end-developer": {
      accent: { r: 244, g: 114, b: 182 },
      glow: { r: 217, g: 70, b: 239 },
      fitFallback:
        "Strong if you care how things look, feel, and respond in real time.",
      Icon: Sparkles,
    },
    "back-end-developer": {
      accent: { r: 96, g: 165, b: 250 },
      glow: { r: 59, g: 130, b: 246 },
      fitFallback:
        "Strong if you like deeper mechanics, data flow, and system behavior.",
      Icon: Blocks,
    },
    "product-engineer": {
      accent: { r: 251, g: 191, b: 36 },
      glow: { r: 245, g: 158, b: 11 },
      fitFallback:
        "Strong if you want code to stay close to real users and real needs.",
      Icon: HeartHandshake,
    },
    "full-stack-developer": {
      accent: { r: 168, g: 85, b: 247 },
      glow: { r: 139, g: 92, b: 246 },
      fitFallback:
        "Strong if you like connecting interface, logic, and data together.",
      Icon: Compass,
    },
    "mobile-developer": {
      accent: { r: 45, g: 212, b: 191 },
      glow: { r: 20, g: 184, b: 166 },
      fitFallback:
        "Strong if you care how experiences feel in the hand: quick and real.",
      Icon: Smartphone,
    },
    "game-developer": {
      accent: { r: 249, g: 115, b: 22 },
      glow: { r: 234, g: 88, b: 12 },
      fitFallback:
        "Strong if you like systems with energy, feedback, and experimentation.",
      Icon: Gamepad2,
    },
    "ai-ml-engineer": {
      accent: { r: 129, g: 140, b: 248 },
      glow: { r: 99, g: 102, b: 241 },
      fitFallback:
        "Strong if you are drawn to patterns, prediction, and learned behavior.",
      Icon: Bot,
    },
    "data-engineer": {
      accent: { r: 34, g: 197, b: 94 },
      glow: { r: 22, g: 163, b: 74 },
      fitFallback:
        "Strong if you like order, scale, and making messy information useful.",
      Icon: Map,
    },
    "devops-engineer": {
      accent: { r: 6, g: 182, b: 212 },
      glow: { r: 8, g: 145, b: 178 },
      fitFallback:
        "Strong if you like automation, stability, and real-world reliability.",
      Icon: Coins,
    },
    "security-engineer": {
      accent: { r: 239, g: 68, b: 68 },
      glow: { r: 220, g: 38, b: 38 },
      fitFallback:
        "Strong if you notice weak points fast and want to protect systems.",
      Icon: Shield,
    },
    "qa-automation-engineer": {
      accent: { r: 59, g: 130, b: 246 },
      glow: { r: 37, g: 99, b: 235 },
      fitFallback:
        "Strong if you like edge cases, repeatability, and product quality.",
      Icon: TestTube2,
    },
    "developer-tools-engineer": {
      accent: { r: 148, g: 163, b: 184 },
      glow: { r: 100, g: 116, b: 139 },
      fitFallback:
        "Strong if you enjoy improving the process and helping builders move faster.",
      Icon: Wrench,
    },
  };

  if (exactMap[slug]) return exactMap[slug];

  if (
    slug.includes("back-end") ||
    slug.includes("backend") ||
    slug.includes("systems")
  ) {
    return presets[0];
  }
  if (
    slug.includes("front-end") ||
    slug.includes("frontend") ||
    slug.includes("ui")
  ) {
    return presets[1];
  }
  if (slug.includes("product")) {
    return presets[2];
  }
  if (
    slug.includes("community") ||
    slug.includes("support") ||
    slug.includes("people")
  ) {
    return presets[3];
  }
  if (
    slug.includes("build") ||
    slug.includes("engineer") ||
    slug.includes("full-stack") ||
    slug.includes("fullstack")
  ) {
    return presets[4];
  }
  if (
    slug.includes("data") ||
    slug.includes("analysis") ||
    slug.includes("security") ||
    slug.includes("ai") ||
    slug.includes("ml")
  ) {
    return presets[5];
  }
  if (
    slug.includes("level") ||
    slug.includes("spatial") ||
    slug.includes("mobile")
  ) {
    return presets[6];
  }
  if (
    slug.includes("narrative") ||
    slug.includes("story") ||
    slug.includes("game")
  ) {
    return presets[7];
  }

  return presets[index % presets.length];
}

function clampVisibleCount(next: number, total: number) {
  return Math.max(0, Math.min(next, total));
}

/* =============================================================================
   Intro Card
============================================================================= */

function IntroCard({
  dark,
  pathTitle,
  pathId,
  opening,
  accent,
  accentStrong,
  glow,
}: {
  dark: boolean;
  pathTitle: string;
  pathId: string;
  opening: { intro: string; body: string };
  accent: { r: number; g: number; b: number };
  accentStrong: { r: number; g: number; b: number };
  glow: { r: number; g: number; b: number };
}) {
  return (
    <section
      className={cx(
        "relative overflow-hidden rounded-[30px] px-4 py-5 sm:px-5 sm:py-6 lg:px-6 lg:py-7",
        shellSurface(dark)
      )}
      style={{
        boxShadow: `0 24px 80px rgba(0,0,0,0.28), 0 0 28px ${rgb(glow, 0.08)}`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-px"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${rgb(
            accent,
            0.42
          )} 18%, ${rgb(glow, 0.16)} 76%, transparent 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -left-10 -top-10 h-36 w-40 rounded-full blur-3xl"
        style={{ background: rgb(accent, 0.12) }}
      />
      <div
        className="pointer-events-none absolute right-[12%] top-[-18px] h-28 w-36 rounded-full blur-3xl"
        style={{ background: rgb(glow, 0.1) }}
      />
      <div
        className="pointer-events-none absolute right-[18%] bottom-[-20px] h-24 w-36 rounded-full blur-3xl"
        style={{ background: rgb(accentStrong, 0.08) }}
      />

      <div className="relative max-w-4xl">
        <div className={sectionKicker(dark)}>
          {getParentLabel(pathId)} • {pathTitle} • Specialties
        </div>

        <h1
          className={`mt-3 max-w-4xl text-[2rem] font-semibold leading-[0.98] tracking-[-0.05em] sm:text-[2.7rem] ${textMain(
            dark
          )}`}
        >
          Different versions of this path
        </h1>

        <p
          className={`mt-3 max-w-3xl text-[15px] leading-6.5 sm:text-[16px] sm:leading-7 ${textSoft(
            dark
          )}`}
        >
          A path like {pathTitle} can branch in very different directions. Some
          specialties are more systems-heavy, some more people-facing, some more
          craft-driven, and some more about feel, structure, rhythm, or
          progression.
        </p>

        <p className="mt-3 max-w-3xl text-[14px] leading-6 text-white/80 sm:text-[15px]">
          {opening.intro} {opening.body}
        </p>
      </div>
    </section>
  );
}

/* =============================================================================
   Specialty Card
============================================================================= */

function SpecialtyCard({
  pathSlug,
  preview,
  index,
  dark,
}: {
  pathSlug: string;
  preview: Record<string, unknown>;
  index: number;
  dark: boolean;
}) {
  const slug = safePreviewSlug(preview);
  if (!slug) return null;

  const title = safePreviewTitle(preview);
  const summary = safePreviewSummary(preview);
  const energy = safeEnergyLabel(preview);
  const style = specialtyStyleFor(preview, index);
  const fitLine = safePreviewFitLine(preview, style.fitFallback);

  return (
    <Link
      href={`/main/explore/work/${pathSlug}/specialties/${slug}`}
      className={cx(
        "group relative block overflow-hidden rounded-[24px] border px-4 py-4 transition duration-200",
        shellSurface(dark),
        "hover:-translate-y-[1px] hover:bg-white/[0.07]"
      )}
      style={{
        boxShadow: `0 14px 36px rgba(0,0,0,0.18), 0 0 20px ${rgb(
          style.glow,
          0.05
        )}`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-px"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${rgb(
            style.accent,
            0.36
          )} 22%, ${rgb(style.glow, 0.14)} 78%, transparent 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -left-8 top-[-10px] h-24 w-24 rounded-full blur-3xl"
        style={{ background: rgb(style.accent, 0.11) }}
      />
      <div
        className="pointer-events-none absolute right-[-10px] top-[-12px] h-24 w-28 rounded-full blur-3xl"
        style={{ background: rgb(style.glow, 0.08) }}
      />

      <div className="relative flex items-start gap-3">
        <div
          className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border"
          style={{
            borderColor: rgb(style.accent, 0.24),
            background: `linear-gradient(180deg, ${rgb(
              style.accent,
              0.16
            )} 0%, ${rgb(style.accent, 0.05)} 100%)`,
            boxShadow: `0 0 16px ${rgb(style.glow, 0.1)}`,
          }}
        >
          <style.Icon
            className="h-[17px] w-[17px]"
            style={{ color: rgb(style.accent, 0.96) }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: rgb(style.accent, 0.92) }}
          >
            Specialty
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h2
              className={`text-[1.04rem] font-semibold leading-5 tracking-[-0.03em] ${textMain(
                dark
              )}`}
            >
              {title}
            </h2>

            {energy ? (
              <span
                className="rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/72"
                style={{
                  borderColor: rgb(style.accent, 0.16),
                  background: rgb(style.accent, 0.08),
                }}
              >
                {energy}
              </span>
            ) : null}
          </div>

          <p className="mt-2 text-[13px] leading-5 text-white/84">{summary}</p>

          <p className={`mt-2 text-[12px] leading-4.5 ${textSoft(dark)}`}>
            {fitLine}
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/86 transition group-hover:text-white">
            <span>Open specialty</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* =============================================================================
   Page
============================================================================= */

export default function WorkPathSpecialtiesPage() {
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
  const [visibleCount, setVisibleCount] = React.useState(8);

  React.useEffect(() => {
    setFirstName(readStoredFirstName());
  }, []);

  const previews = React.useMemo(
    () =>
      Array.isArray(path.specialtyPreviews)
        ? path.specialtyPreviews.filter(isPreviewRecord)
        : [],
    [path.specialtyPreviews]
  );

  React.useEffect(() => {
    setVisibleCount((current) =>
      clampVisibleCount(current || 8, previews.length)
    );
  }, [previews.length]);

  const opening = React.useMemo(
    () =>
      getWorkAgenticOpening({
        pageKind: "specialties",
        pathId: path.id,
        firstName,
      }),
    [path.id, firstName]
  );

  const visiblePreviews = previews.slice(0, visibleCount);
  const remaining = Math.max(0, previews.length - visibleCount);

  function handleShowMore() {
    setVisibleCount((current) =>
      clampVisibleCount(current + 4, previews.length)
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 22%, ${rgb(path.theme.accent, 0.08)} 0%, transparent 22%),
              radial-gradient(circle at 78% 18%, ${rgb(path.theme.glow, 0.08)} 0%, transparent 22%),
              radial-gradient(circle at 68% 76%, ${rgb(path.theme.accentStrong, 0.07)} 0%, transparent 24%),
              linear-gradient(180deg, rgba(4,10,18,0.98) 0%, rgba(6,14,26,0.99) 42%, rgba(4,9,18,1) 100%)
            `,
          }}
        />
      </div>

      <div className="relative pb-24 pt-2 sm:pt-3 lg:pt-5">
        <div className={pageShell()}>
          <div className="flex items-center">
            <Link
              href={`/main/explore/work/${path.slug}`}
              className={cx(
                "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition",
                shellSurface(dark),
                textSoft(dark),
                "hover:bg-white/[0.08]"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {path.card.title}
            </Link>
          </div>
        </div>

        <div className={cx(pageShell(), "mt-4 sm:mt-5 lg:mt-6")}>
          <IntroCard
            dark={dark}
            pathTitle={path.card.title}
            pathId={path.id}
            opening={opening}
            accent={path.theme.accent}
            accentStrong={path.theme.accentStrong}
            glow={path.theme.glow}
          />
        </div>

        <section className={cx(pageShell(), "mt-8 sm:mt-10")}>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <div className={sectionKicker(dark)}>Specialty chooser</div>
              <h2
                className={`mt-1 text-[1.05rem] font-semibold tracking-[-0.03em] ${textMain(
                  dark
                )} sm:text-[1.16rem]`}
              >
                Pick a version of the work to explore next
              </h2>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <div
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60"
                style={{
                  borderColor: "rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <Radar className="h-3.5 w-3.5" />
                <span>{previews.length} specialties</span>
              </div>
            </div>
          </div>

          <div className="grid auto-rows-min grid-cols-1 gap-3.5 md:grid-cols-2 md:gap-4">
            {visiblePreviews.map((preview, index) => {
              const key = safePreviewSlug(preview) || `${path.slug}-${index}`;
              return (
                <SpecialtyCard
                  key={key}
                  pathSlug={path.slug}
                  preview={preview}
                  index={index}
                  dark={dark}
                />
              );
            })}
          </div>

          {remaining > 0 ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleShowMore}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[13px] font-semibold text-white/84 transition hover:bg-white/[0.07] hover:text-white"
              >
                <span>
                  {remaining >= 4
                    ? "Show 4 more specialties"
                    : `Show ${remaining} more`}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}