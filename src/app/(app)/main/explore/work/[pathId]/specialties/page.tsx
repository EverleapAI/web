// apps/web/src/app/(app)/main/explore/work/[pathId]/specialties/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Blocks,
  Coins,
  Gamepad2,
  Map,
  ScrollText,
  Sparkles,
} from "lucide-react";

import { requireWorkPath } from "../../_data/workPaths";
import {
  getWorkAgenticOpening,
  readStoredFirstName,
} from "../../_data/getWorkAgenticOpening";
import { WorkPathSubnav } from "../../components/WorkPathSubnav";

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

function sectionKicker(dark: boolean) {
  return `text-[11px] font-semibold uppercase tracking-[0.2em] ${textFaint(dark)}`;
}

type SpecialtyVisual = {
  hook: string;
  roleLabel?: string;
  fitLabel: string;
  accent: { r: number; g: number; b: number };
  glow: { r: number; g: number; b: number };
  Icon: React.ComponentType<{ className?: string }>;
};

function specialtyVisualForSlug(slug: string): SpecialtyVisual {
  switch (slug) {
    case "systems-designer":
      return {
        hook: "Shaping the invisible rules that make play click",
        roleLabel: "Often called",
        fitLabel: "May feel close if you like hidden structure, balance, and elegant logic.",
        accent: { r: 84, g: 208, b: 255 },
        glow: { r: 58, g: 129, b: 255 },
        Icon: Blocks,
      };

    case "level-designer":
      return {
        hook: "Designing the spaces players move through and remember",
        roleLabel: "Often called",
        fitLabel: "May feel close if you think spatially and care about rhythm, flow, and atmosphere.",
        accent: { r: 159, g: 120, b: 255 },
        glow: { r: 105, g: 71, b: 214 },
        Icon: Map,
      };

    case "narrative-designer":
      return {
        hook: "Building story, world, and emotional meaning into the experience",
        roleLabel: "Often called",
        fitLabel: "May feel close if you care about tone, characters, worldbuilding, and emotional arc.",
        accent: { r: 255, g: 180, b: 92 },
        glow: { r: 214, g: 118, b: 42 },
        Icon: ScrollText,
      };

    case "gameplay-designer":
      return {
        hook: "Crafting the moment-to-moment feel of what players actually do",
        roleLabel: "Often called",
        fitLabel: "May feel close if you love interaction, pacing, feel, and how action lands in the hands.",
        accent: { r: 255, g: 110, b: 209 },
        glow: { r: 209, g: 68, b: 162 },
        Icon: Gamepad2,
      };

    case "economy-designer":
      return {
        hook: "Designing reward loops, progression, and the value behind choices",
        roleLabel: "Often called",
        fitLabel: "May feel close if you notice incentives, systems behavior, and what keeps people engaged.",
        accent: { r: 96, g: 231, b: 176 },
        glow: { r: 42, g: 165, b: 123 },
        Icon: Coins,
      };

    default:
      return {
        hook: "A different expression of the same creative world",
        roleLabel: "Often called",
        fitLabel: "May feel close if this version of the work keeps pulling your attention.",
        accent: { r: 126, g: 167, b: 255 },
        glow: { r: 89, g: 112, b: 255 },
        Icon: Sparkles,
      };
  }
}

function getParentWorldLabel(pathId: string) {
  if (pathId === "game-designer") return "Creative Design";
  return "Work";
}

function getParentHref(pathId: string) {
  if (pathId === "game-designer") return "/main/explore/work";
  return "/main/explore/work";
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

  React.useEffect(() => {
    setFirstName(readStoredFirstName());
  }, []);

  const opening = React.useMemo(
    () =>
      getWorkAgenticOpening({
        pageKind: "specialties",
        pathId: path.id,
        firstName,
      }),
    [path.id, firstName]
  );

  const parentWorldLabel = getParentWorldLabel(path.id);
  const parentHref = getParentHref(path.id);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 16% 20%, ${rgb(path.theme.accent, 0.16)} 0%, transparent 30%),
              radial-gradient(circle at 80% 16%, ${rgb(path.theme.glow, 0.18)} 0%, transparent 26%),
              radial-gradient(circle at 70% 78%, ${rgb(path.theme.accentStrong, 0.14)} 0%, transparent 28%),
              linear-gradient(180deg, rgba(4,10,18,0.96) 0%, rgba(7,17,31,0.98) 38%, rgba(4,9,18,1) 100%)
            `,
          }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <div className="flex items-center justify-between">
          <Link
            href={parentHref}
            className={[
              "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition",
              shellSurface(dark),
              textSoft(dark),
              "hover:bg-white/[0.08]",
            ].join(" ")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {parentWorldLabel}
          </Link>
        </div>

        <WorkPathSubnav pathSlug={path.slug} />

        <section
          className={[
            "relative overflow-hidden rounded-[32px] px-5 py-7 sm:px-6 sm:py-8",
            shellSurface(dark),
            "shadow-[0_30px_120px_rgba(0,0,0,0.34)]",
          ].join(" ")}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{
              background: `
                radial-gradient(circle at 10% 18%, ${rgb(path.theme.accent, 0.18)} 0%, transparent 31%),
                radial-gradient(circle at 84% 14%, ${rgb(path.theme.glow, 0.14)} 0%, transparent 28%),
                linear-gradient(180deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0) 100%)
              `,
            }}
          />

          <div className="relative max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/48">
              <span>{parentWorldLabel}</span>
              <span className="text-white/26">•</span>
              <span>{path.card.title}</span>
              <span className="text-white/26">•</span>
              <span>Specialties</span>
            </div>

            <h1
              className={`mt-3 max-w-4xl text-[2.2rem] font-semibold tracking-tight sm:text-5xl ${textMain(
                dark
              )}`}
            >
              Different ways this world comes alive
            </h1>

            <p className={`mt-4 max-w-3xl text-[16px] leading-7 sm:text-lg sm:leading-8 ${textSoft(dark)}`}>
              A path like {path.card.title} is not only one thing. Inside the
              same creative world, different people come alive in different
              parts of the craft — systems, spaces, story, interaction, or the
              loops that keep everything moving.
            </p>

            <div className="mt-7 max-w-3xl rounded-[28px] border border-white/10 bg-white/[0.05] px-4 py-4 backdrop-blur-xl sm:px-5 sm:py-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/42">
                Agentic entry
              </div>
              <p className="mt-2 text-[15px] leading-7 text-white/90 sm:text-[16px]">
                {opening.intro}
              </p>
              <p className="mt-2 text-sm leading-7 text-white/70 sm:text-[15px]">
                {opening.body}
              </p>
              <p className="mt-3 text-sm leading-7 text-white/62 sm:text-[15px]">
                {opening.bridge}
              </p>
            </div>
          </div>
        </section>

        <section
          className={[
            "relative overflow-hidden rounded-[30px] px-4 py-5 sm:px-6 sm:py-6",
            shellSurface(dark),
          ].join(" ")}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background: `
                radial-gradient(circle at 15% 0%, ${rgb(path.theme.accent, 0.08)} 0%, transparent 28%),
                radial-gradient(circle at 85% 100%, ${rgb(path.theme.glow, 0.08)} 0%, transparent 28%)
              `,
            }}
          />

          <div className="relative max-w-3xl">
            <div className={sectionKicker(dark)}>Choose a direction to feel more closely</div>
            <h2
              className={`mt-2 text-[1.75rem] font-semibold tracking-tight sm:text-3xl ${textMain(
                dark
              )}`}
            >
              One craft. Up to five distinct expressions.
            </h2>
            <p className={`mt-3 text-sm leading-6 sm:text-[15px] sm:leading-7 ${textSoft(dark)}`}>
              You are not trying to lock in a decision here. You are noticing
              which version of {path.card.title.toLowerCase()} feels most
              magnetic — the one your attention keeps leaning toward.
            </p>
          </div>

          <div className="relative mt-6">
            {path.specialtyPreviews.slice(0, 5).map((preview, index) => {
              const detail = path.specialties.find((s) => s.slug === preview.slug);
              const visual = specialtyVisualForSlug(preview.slug);
              const Icon = visual.Icon;

              return (
                <Link
                  key={preview.id}
                  href={`/main/explore/work/${path.slug}/specialties/${preview.slug}`}
                  className={[
                    "group relative block overflow-hidden rounded-[26px] px-4 py-5 transition sm:px-5 sm:py-6",
                    "border border-transparent hover:border-white/10 hover:bg-white/[0.03]",
                    index > 0 ? "mt-3" : "",
                  ].join(" ")}
                  style={{
                    background: `
                      radial-gradient(circle at 0% 0%, ${rgb(visual.accent, 0.16)} 0%, transparent 28%),
                      radial-gradient(circle at 88% 16%, ${rgb(visual.glow, 0.14)} 0%, transparent 24%),
                      linear-gradient(180deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0.015) 100%)
                    `,
                    boxShadow:
                      "0 20px 60px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.03)",
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-y-4 left-0 w-[3px] rounded-full"
                    style={{
                      background: `linear-gradient(180deg, ${rgb(visual.accent, 0.95)} 0%, ${rgb(
                        visual.glow,
                        0.78
                      )} 100%)`,
                      boxShadow: `0 0 22px ${rgb(visual.accent, 0.45)}`,
                    }}
                  />

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-3.5 sm:gap-4">
                        <div
                          className="relative mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] sm:h-12 sm:w-12"
                          style={{
                            boxShadow: `0 0 28px ${rgb(visual.accent, 0.16)}`,
                          }}
                        >
                          <div
                            className="pointer-events-none absolute inset-0 rounded-2xl"
                            style={{
                              background: `radial-gradient(circle at 50% 35%, ${rgb(
                                visual.accent,
                                0.18
                              )} 0%, transparent 68%)`,
                            }}
                          />
                          <Icon
                            className="relative h-5 w-5 text-white/90 sm:h-[22px] sm:w-[22px]"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">
                            Different expression
                          </div>

                          <h3 className="mt-2 max-w-2xl text-[1.2rem] font-semibold leading-7 tracking-tight text-white/96 sm:text-[1.38rem] sm:leading-8">
                            {visual.hook}
                          </h3>

                          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">
                              {visual.roleLabel}
                            </span>
                            <span className="text-base font-semibold text-white/84">
                              {preview.title}
                            </span>
                            {preview.energy ? (
                              <span className="rounded-full border border-white/12 bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/56">
                                {preview.energy.replace("-", " ")}
                              </span>
                            ) : null}
                          </div>

                          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/72 sm:text-[15px] sm:leading-7">
                            {preview.oneLiner}
                          </p>

                          <div className="mt-4 max-w-2xl rounded-[20px] border border-white/8 bg-black/10 px-3.5 py-3">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                              Why this may feel close
                            </div>
                            <p className="mt-2 text-sm leading-6 text-white/82 sm:text-[15px] sm:leading-7">
                              {preview.whyItCouldFit || visual.fitLabel}
                            </p>
                          </div>

                          {detail?.skillsThatGrowHere?.length ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {detail.skillsThatGrowHere.slice(0, 3).map((skill) => (
                                <div
                                  key={skill}
                                  className="inline-flex items-center rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-xs font-medium text-white/75"
                                >
                                  {skill}
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-semibold text-white/78 transition group-hover:border-white/16 group-hover:bg-white/[0.07] group-hover:text-white">
                      <span className="hidden sm:inline">Explore this direction</span>
                      <span className="sm:hidden">Explore</span>
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
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
