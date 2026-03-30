"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Blocks,
  Bot,
  ChevronRight,
  Compass,
  Gamepad2,
  HeartHandshake,
  Map,
  Shield,
  Smartphone,
  Sparkles,
  TestTube2,
  Wrench,
} from "lucide-react";

import {
  getSpecialtyHook,
  requireWorkPath,
  requireWorkSpecialty,
} from "../../../_data/workPaths";
import { readStoredFirstName } from "../../../_data/getWorkAgenticOpening";

/* =============================================================================
   Helpers
============================================================================= */

function rgb(value: { r: number; g: number; b: number }, alpha = 1) {
  return `rgba(${value.r}, ${value.g}, ${value.b}, ${alpha})`;
}

function pageShell() {
  return "relative mx-auto w-full max-w-5xl px-2 pb-24 pt-2 sm:px-4 sm:pt-3 md:px-6 lg:px-8 lg:pt-5 xl:px-10";
}

function sectionKicker() {
  return "text-[11px] font-semibold uppercase tracking-[0.2em] text-white/44";
}

function getSignalMeta(slug: string): { label: string; score: number } {
  switch (slug) {
    case "front-end-developer":
      return { label: "Creative", score: 79 };
    case "back-end-developer":
      return { label: "Systems", score: 81 };
    case "product-engineer":
      return { label: "Product", score: 77 };
    case "full-stack-developer":
      return { label: "Builder", score: 80 };
    case "mobile-developer":
      return { label: "Tactile", score: 76 };
    case "game-developer":
      return { label: "Play", score: 82 };
    case "ai-ml-engineer":
      return { label: "Pattern", score: 84 };
    case "data-engineer":
      return { label: "Flow", score: 78 };
    case "devops-engineer":
      return { label: "Infra", score: 80 };
    case "security-engineer":
      return { label: "Defense", score: 83 };
    case "qa-automation-engineer":
      return { label: "Precision", score: 75 };
    case "developer-tools-engineer":
      return { label: "Tooling", score: 77 };
    default:
      return { label: "Signal", score: 76 };
  }
}

function getSpecialtyVisual(slug: string): {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accent: { r: number; g: number; b: number };
  glow: { r: number; g: number; b: number };
  pattern: "grid" | "beam" | "pulse" | "nodes" | "orb";
} {
  switch (slug) {
    case "front-end-developer":
      return {
        Icon: Sparkles,
        accent: { r: 244, g: 114, b: 182 },
        glow: { r: 217, g: 70, b: 239 },
        pattern: "beam",
      };
    case "back-end-developer":
      return {
        Icon: Blocks,
        accent: { r: 96, g: 165, b: 250 },
        glow: { r: 59, g: 130, b: 246 },
        pattern: "grid",
      };
    case "product-engineer":
      return {
        Icon: HeartHandshake,
        accent: { r: 251, g: 191, b: 36 },
        glow: { r: 245, g: 158, b: 11 },
        pattern: "orb",
      };
    case "full-stack-developer":
      return {
        Icon: Compass,
        accent: { r: 168, g: 85, b: 247 },
        glow: { r: 139, g: 92, b: 246 },
        pattern: "nodes",
      };
    case "mobile-developer":
      return {
        Icon: Smartphone,
        accent: { r: 45, g: 212, b: 191 },
        glow: { r: 20, g: 184, b: 166 },
        pattern: "beam",
      };
    case "game-developer":
      return {
        Icon: Gamepad2,
        accent: { r: 249, g: 115, b: 22 },
        glow: { r: 234, g: 88, b: 12 },
        pattern: "pulse",
      };
    case "ai-ml-engineer":
      return {
        Icon: Bot,
        accent: { r: 129, g: 140, b: 248 },
        glow: { r: 99, g: 102, b: 241 },
        pattern: "orb",
      };
    case "data-engineer":
      return {
        Icon: Map,
        accent: { r: 34, g: 197, b: 94 },
        glow: { r: 22, g: 163, b: 74 },
        pattern: "nodes",
      };
    case "security-engineer":
      return {
        Icon: Shield,
        accent: { r: 239, g: 68, b: 68 },
        glow: { r: 220, g: 38, b: 38 },
        pattern: "pulse",
      };
    case "qa-automation-engineer":
      return {
        Icon: TestTube2,
        accent: { r: 59, g: 130, b: 246 },
        glow: { r: 37, g: 99, b: 235 },
        pattern: "grid",
      };
    case "developer-tools-engineer":
      return {
        Icon: Wrench,
        accent: { r: 148, g: 163, b: 184 },
        glow: { r: 100, g: 116, b: 139 },
        pattern: "nodes",
      };
    default:
      return {
        Icon: Sparkles,
        accent: { r: 99, g: 102, b: 241 },
        glow: { r: 59, g: 130, b: 246 },
        pattern: "orb",
      };
  }
}

function getLinkVisual(kind: "day" | "forecast" | "next"): {
  accent: { r: number; g: number; b: number };
  glow: { r: number; g: number; b: number };
} {
  switch (kind) {
    case "day":
      return {
        accent: { r: 96, g: 165, b: 250 },
        glow: { r: 59, g: 130, b: 246 },
      };
    case "forecast":
      return {
        accent: { r: 45, g: 212, b: 191 },
        glow: { r: 20, g: 184, b: 166 },
      };
    case "next":
      return {
        accent: { r: 74, g: 222, b: 128 },
        glow: { r: 34, g: 197, b: 94 },
      };
  }
}

/* =============================================================================
   Visual Layers
============================================================================= */

function SignalPill({
  accent,
  glow,
  label,
  score,
}: {
  accent: { r: number; g: number; b: number };
  glow: { r: number; g: number; b: number };
  label: string;
  score: number;
}) {
  const bars = [0, 1, 2, 3, 4];
  const filledBars = Math.max(3, Math.min(5, Math.round(score / 20)));

  return (
    <div
      className="inline-flex items-center gap-3 rounded-full border py-1.5 pl-3 pr-1.5"
      style={{
        borderColor: rgb(accent, 0.16),
        background: `linear-gradient(180deg, ${rgb(accent, 0.12)} 0%, rgba(9,18,32,0.72) 100%)`,
        boxShadow: `0 18px 40px rgba(0,0,0,0.22), 0 0 22px ${rgb(glow, 0.08)}`,
      }}
    >
      <div className="flex items-end gap-[4px]">
        {bars.map((i) => (
          <span
            key={i}
            className="block w-[5px] rounded-full"
            style={{
              height: `${8 + i * 2}px`,
              background:
                i < filledBars
                  ? `linear-gradient(180deg, ${rgb(accent, 1)} 0%, ${rgb(
                      glow,
                      0.96
                    )} 100%)`
                  : "rgba(255,255,255,0.14)",
              boxShadow:
                i < filledBars ? `0 0 12px ${rgb(glow, 0.18)}` : "none",
            }}
          />
        ))}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-[1.05rem] font-semibold tracking-[-0.02em] text-white/92">
          {score}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/56">
          {label}
        </span>
      </div>

      <div
        className="flex h-7 w-7 items-center justify-center rounded-full border"
        style={{
          borderColor: rgb(accent, 0.16),
          background: "rgba(255,255,255,0.04)",
        }}
      >
        <ChevronRight className="h-3.5 w-3.5 text-white/46" />
      </div>
    </div>
  );
}

function HeroPattern({
  pattern,
  accent,
}: {
  pattern: "grid" | "beam" | "pulse" | "nodes" | "orb";
  accent: { r: number; g: number; b: number };
}) {
  if (pattern === "grid") {
    return (
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${rgb(accent, 0.12)} 1px, transparent 1px),
            linear-gradient(to bottom, ${rgb(accent, 0.1)} 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.28) 60%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.28) 60%, transparent 100%)",
        }}
      />
    );
  }

  if (pattern === "beam") {
    return (
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          background: `
            linear-gradient(128deg, transparent 0%, ${rgb(
              accent,
              0.16
            )} 24%, transparent 54%),
            linear-gradient(142deg, transparent 28%, ${rgb(
              accent,
              0.1
            )} 42%, transparent 64%)
          `,
        }}
      />
    );
  }

  if (pattern === "pulse") {
    return (
      <>
        <div
          className="absolute right-[-26px] top-[-14px] h-44 w-44 rounded-full border opacity-[0.18]"
          style={{ borderColor: rgb(accent, 0.18) }}
        />
        <div
          className="absolute right-[18px] top-[14px] h-32 w-32 rounded-full border opacity-[0.16]"
          style={{ borderColor: rgb(accent, 0.16) }}
        />
      </>
    );
  }

  if (pattern === "nodes") {
    const dots = [
      { left: "72%", top: "20%" },
      { left: "84%", top: "28%" },
      { left: "78%", top: "40%" },
      { left: "90%", top: "48%" },
      { left: "80%", top: "58%" },
    ];

    return (
      <>
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.18]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M72 20 L84 28 L78 40 L90 48 L80 58"
            stroke={rgb(accent, 0.18)}
            strokeWidth="0.8"
            fill="none"
          />
        </svg>
        {dots.map((dot, i) => (
          <div
            key={i}
            className="absolute h-2.5 w-2.5 rounded-full"
            style={{
              left: dot.left,
              top: dot.top,
              background: rgb(accent, 0.3),
              boxShadow: `0 0 12px ${rgb(accent, 0.16)}`,
            }}
          />
        ))}
      </>
    );
  }

  return (
    <>
      <div
        className="absolute right-[12%] top-[10%] h-36 w-36 rounded-full blur-3xl opacity-[0.16]"
        style={{ background: rgb(accent, 0.28) }}
      />
      <div
        className="absolute right-[24%] top-[24%] h-16 w-16 rounded-full border opacity-[0.14]"
        style={{ borderColor: rgb(accent, 0.18) }}
      />
    </>
  );
}

function FlowLink({
  href,
  kicker,
  title,
  accent,
  glow,
}: {
  href: string;
  kicker: string;
  title: string;
  accent: { r: number; g: number; b: number };
  glow: { r: number; g: number; b: number };
}) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden border-t border-white/10 pt-4 sm:pt-5"
    >
      <div
        className="pointer-events-none absolute left-0 top-4 h-10 w-10 rounded-full blur-2xl opacity-0 transition duration-200 group-hover:opacity-100"
        style={{ background: rgb(accent, 0.18) }}
      />
      <div
        className="pointer-events-none absolute right-10 top-6 h-5 w-16 rounded-full opacity-[0.12]"
        style={{
          background: `linear-gradient(90deg, ${rgb(
            accent,
            0.22
          )} 0%, transparent 100%)`,
        }}
      />
      <div className="pointer-events-none absolute left-0 top-5 h-px w-20">
        <div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${rgb(
              glow,
              0.55
            )} 0%, transparent 100%)`,
          }}
        />
      </div>

      <div className="relative flex items-center justify-between gap-4">
        <div>
          <div className={sectionKicker()}>{kicker}</div>
          <div className="mt-1 text-xl font-semibold text-white/92">{title}</div>
        </div>

        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition duration-200 group-hover:translate-x-1"
          style={{
            borderColor: rgb(accent, 0.16),
            background: `linear-gradient(180deg, ${rgb(
              accent,
              0.1
            )} 0%, rgba(255,255,255,0.03) 100%)`,
            boxShadow: `0 0 16px ${rgb(glow, 0.06)}`,
          }}
        >
          <ArrowRight className="h-4 w-4 text-white/72 group-hover:text-white" />
        </div>
      </div>
    </Link>
  );
}

/* =============================================================================
   Page
============================================================================= */

export default function WorkPathSpecialtyDetailPage() {
  const params = useParams<{ pathId: string; specialtySlug: string }>();

  const pathId = typeof params?.pathId === "string" ? params.pathId : "";
  const specialtySlug =
    typeof params?.specialtySlug === "string" ? params.specialtySlug : "";

  if (!pathId || !specialtySlug) notFound();

  let path;
  let specialty;

  try {
    path = requireWorkPath(pathId);
    specialty = requireWorkSpecialty(pathId, specialtySlug);
  } catch {
    notFound();
  }

  const [firstName, setFirstName] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFirstName(readStoredFirstName());
  }, []);

  const hook = React.useMemo(
    () => getSpecialtyHook(specialty.slug),
    [specialty.slug]
  );

  const signal = React.useMemo(
    () => getSignalMeta(specialty.slug),
    [specialty.slug]
  );

  const visual = React.useMemo(
    () => getSpecialtyVisual(specialty.slug),
    [specialty.slug]
  );

  const dayLink = getLinkVisual("day");
  const forecastLink = getLinkVisual("forecast");
  const nextLink = getLinkVisual("next");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 12% 16%, ${rgb(path.theme.accent, 0.16)} 0%, transparent 28%),
              radial-gradient(circle at 82% 16%, ${rgb(path.theme.glow, 0.18)} 0%, transparent 28%),
              radial-gradient(circle at 74% 82%, ${rgb(path.theme.accentStrong, 0.14)} 0%, transparent 30%),
              linear-gradient(180deg, rgba(4,10,18,0.98) 0%, rgba(6,14,26,0.99) 42%, rgba(4,9,18,1) 100%)
            `,
          }}
        />
      </div>

      <div className={pageShell()}>
        <Link
          href={`/main/explore/work/${path.slug}/specialties`}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-2 text-sm text-white/70 transition hover:bg-white/[0.08]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to specialties
        </Link>

        <section
          className="relative mt-4 overflow-hidden rounded-[32px] border border-white/10 px-4 py-5 sm:mt-5 sm:px-5 sm:py-6 lg:mt-6 lg:px-7 lg:py-8"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.035) 100%)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 30px 120px rgba(0,0,0,0.28)",
          }}
        >
          <div
            className="pointer-events-none absolute -left-12 -top-12 h-44 w-44 rounded-full blur-3xl"
            style={{ background: rgb(path.theme.accent, 0.18) }}
          />
          <div
            className="pointer-events-none absolute right-[10%] top-[-28px] h-40 w-48 rounded-full blur-3xl"
            style={{ background: rgb(path.theme.glow, 0.18) }}
          />
          <div
            className="pointer-events-none absolute right-[14%] bottom-[-24px] h-36 w-48 rounded-full blur-3xl"
            style={{ background: rgb(path.theme.accentStrong, 0.14) }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-px"
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${rgb(
                path.theme.accent,
                0.38
              )} 22%, ${rgb(path.theme.glow, 0.14)} 78%, transparent 100%)`,
            }}
          />

          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]">
            <HeroPattern pattern={visual.pattern} accent={visual.accent} />
          </div>

          <div className="relative">
            <div className={sectionKicker()}>Specialty</div>

            <div className="mt-3 flex flex-col gap-4 sm:gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] border"
                    style={{
                      borderColor: rgb(visual.accent, 0.24),
                      background: `linear-gradient(180deg, ${rgb(
                        visual.accent,
                        0.16
                      )} 0%, ${rgb(visual.accent, 0.05)} 100%)`,
                      boxShadow: `0 0 20px ${rgb(visual.glow, 0.12)}`,
                    }}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 rounded-[18px]"
                      style={{
                        background: `radial-gradient(circle at 30% 25%, ${rgb(
                          visual.accent,
                          0.22
                        )} 0%, transparent 70%)`,
                      }}
                    />
                    <visual.Icon
                      className="relative h-6 w-6"
                      style={{ color: rgb(visual.accent, 0.96) }}
                    />
                  </div>

                  <div
                    className="h-px w-16 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${rgb(
                        visual.accent,
                        0.65
                      )} 0%, transparent 100%)`,
                    }}
                  />
                </div>

                <h1 className="text-[2.15rem] font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl">
                  {specialty.title}
                </h1>

                <p className="mt-4 max-w-2xl text-[16px] leading-7 text-white/82 sm:text-[17px] sm:leading-8">
                  {specialty.summary}
                </p>
              </div>

              <div className="shrink-0">
                <SignalPill
                  accent={visual.accent}
                  glow={visual.glow}
                  label={signal.label}
                  score={signal.score}
                />
              </div>
            </div>

            <div className="mt-6 max-w-2xl sm:mt-7">
              <p className="text-[15px] leading-7 text-white/92">
                {firstName ? `${firstName}, ` : ""}
                this version is mostly about <strong>{hook.trait}</strong>.
              </p>

              <p className="mt-2 text-[14px] leading-7 text-white/75">
                You’ll spend a lot of time <strong>{hook.action}</strong>.
              </p>

              <p className="mt-3 text-[14px] leading-7 text-white/60">
                If that sounds interesting — not just impressive — this is worth
                exploring.
              </p>

              <p className="mt-3 text-[14px] leading-7 text-white/50">
                If that sounds boring, that is useful too. It probably means try
                a different branch.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 space-y-3 sm:mt-10 sm:space-y-4">
          <FlowLink
            href={`/main/explore/work/${path.slug}/day`}
            kicker="Day in the life"
            title={path.dayInLife.title}
            accent={dayLink.accent}
            glow={dayLink.glow}
          />

          <FlowLink
            href={`/main/explore/work/${path.slug}/forecast`}
            kicker="Forecast"
            title={path.forecast.title}
            accent={forecastLink.accent}
            glow={forecastLink.glow}
          />

          <FlowLink
            href={`/main/explore/work/${path.slug}/next-steps`}
            kicker="Next steps"
            title={path.nextSteps.title}
            accent={nextLink.accent}
            glow={nextLink.glow}
          />
        </section>
      </div>
    </main>
  );
}