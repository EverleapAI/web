// apps/web/src/app/(app)/main/explore/work/[pathId]/forecast/page.tsx

"use client";

import * as React from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bot,
  BriefcaseBusiness,
  CircleAlert,
  DollarSign,
  Sparkles,
} from "lucide-react";

import { requireWorkPath } from "../../_data/workPaths";
import type {
  RGB,
  WorkPathForecastMetric,
  WorkPathForecastMetricTone,
  WorkPathForecastV2,
} from "../../_data/workPathSchema";

/* =============================================================================
   Helpers
============================================================================= */

function normalizeParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function rgb(value: RGB, alpha = 1) {
  return `rgba(${value.r}, ${value.g}, ${value.b}, ${alpha})`;
}

function metricToneText(
  tone: WorkPathForecastMetricTone | undefined,
  accent: RGB
) {
  switch (tone) {
    case "positive":
      return "text-emerald-100";
    case "warning":
      return "text-amber-100";
    case "mixed":
      return "text-violet-100";
    case "neutral":
      return "text-white";
    default:
      return "text-white";
  }
}

function metricToneBorder(
  tone: WorkPathForecastMetricTone | undefined,
  accent: RGB
) {
  switch (tone) {
    case "positive":
      return "border-emerald-300/12 bg-emerald-300/[0.05]";
    case "warning":
      return "border-amber-300/12 bg-amber-300/[0.05]";
    case "mixed":
      return "border-violet-300/12 bg-violet-300/[0.05]";
    case "neutral":
      return "border-white/8 bg-white/[0.04]";
    default:
      return "border-white/8 bg-white/[0.04]";
  }
}

/* =============================================================================
   UI
============================================================================= */

function MetricInline({
  metric,
  accent,
}: {
  metric: WorkPathForecastMetric;
  accent: RGB;
}) {
  return (
    <div
      className={`rounded-[22px] border px-4 py-3 backdrop-blur-sm ${metricToneBorder(
        metric.tone,
        accent
      )}`}
    >
      <div className="text-[11px] uppercase tracking-[0.18em] text-white/50">
        {metric.label}
      </div>
      <div
        className={`mt-1 text-lg font-semibold tracking-[-0.02em] ${metricToneText(
          metric.tone,
          accent
        )}`}
      >
        {metric.value}
      </div>
      <div className="mt-1 text-xs leading-5 text-white/60">{metric.note}</div>
    </div>
  );
}

function SalaryBand({
  forecastV2,
  accent,
}: {
  forecastV2?: WorkPathForecastV2;
  accent: RGB;
}) {
  if (!forecastV2?.salaryRange) return null;

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/8 bg-white/[0.035] px-4 py-5 sm:px-5">
      <div
        className="pointer-events-none absolute"
        aria-hidden="true"
      />
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/56">
        <div
          className="rounded-full p-1.5"
          style={{ backgroundColor: rgb(accent, 0.14), color: rgb(accent, 0.95) }}
        >
          <DollarSign className="h-3.5 w-3.5" />
        </div>
        Salary range
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <div className="text-sm text-white/48">Low</div>
          <div className="mt-1 text-lg font-semibold text-white">
            {forecastV2.salaryRange.low}
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm text-white/48">Median</div>
          <div className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-white">
            {forecastV2.salaryRange.median}
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-white/48">High</div>
          <div className="mt-1 text-lg font-semibold text-white">
            {forecastV2.salaryRange.high}
          </div>
        </div>
      </div>

      {forecastV2.salaryRange.note ? (
        <p className="mt-4 text-sm leading-6 text-white/62">
          {forecastV2.salaryRange.note}
        </p>
      ) : null}
    </section>
  );
}

function SimpleList({
  title,
  items,
  tone,
  accent,
}: {
  title: string;
  items: string[];
  tone?: "grow" | "pressure" | "accent";
  accent: RGB;
}) {
  const eyebrowClass =
    tone === "grow"
      ? "text-emerald-200"
      : tone === "pressure"
      ? "text-amber-200"
      : "text-white";
  const dotClass =
    tone === "grow"
      ? "bg-emerald-300"
      : tone === "pressure"
      ? "bg-amber-300"
      : "";

  return (
    <div>
      <h3 className={`text-[11px] uppercase tracking-[0.18em] ${eyebrowClass}`}>
        {title}
      </h3>

      <div className="mt-3 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <div
              className={`mt-[9px] h-2 w-2 shrink-0 rounded-full ${dotClass}`}
              style={tone === "accent" ? { backgroundColor: rgb(accent, 0.95) } : undefined}
            />
            <div className="text-sm leading-6 text-white/76">{item}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =============================================================================
   Page
============================================================================= */

export default function WorkForecastPage() {
  const router = useRouter();
  const params = useParams();
  const pathId = normalizeParam(params?.pathId);

  if (!pathId) notFound();

  const workPath = requireWorkPath(pathId);
  const forecastV2 = workPath.forecastV2;
  const oldForecast = workPath.forecast;

  const accent = workPath.theme.accent;
  const accentStrong = workPath.theme.accentStrong;
  const glow = workPath.theme.glow;

  const metrics = forecastV2?.metrics ?? [];
  const growing = forecastV2?.whatIsGrowing ?? [];
  const pressure = forecastV2?.whatIsUnderPressure ?? [];
  const aiImpact = forecastV2?.aiImpact;
  const exciting = forecastV2?.whyThisCouldFeelExciting ?? [];
  const risky = forecastV2?.whyThisCouldFeelRisky ?? [];

  const title = `The future of ${workPath.card.title}`;
  const summary =
    forecastV2?.outlookSummary ||
    oldForecast?.summary ||
    "This field is changing over time. This page looks at what may grow, what may get squeezed, and what that could mean for someone entering it now.";
  const outlookLabel = forecastV2?.outlookLabel ?? "Mixed";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b1424_0%,#08111e_42%,#050b15_100%)]" />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 14% 16%, ${rgb(accent, 0.16)} 0%, transparent 24%),
            radial-gradient(circle at 82% 12%, ${rgb(accentStrong, 0.16)} 0%, transparent 26%),
            radial-gradient(circle at 54% 88%, ${rgb(glow, 0.12)} 0%, transparent 28%)
          `,
        }}
      />

      <div
        className="pointer-events-none absolute left-[-7rem] top-16 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: rgb(accent, 0.12) }}
      />
      <div
        className="pointer-events-none absolute right-[-6rem] top-10 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: rgb(accentStrong, 0.12) }}
      />
      <div
        className="pointer-events-none absolute bottom-[-4rem] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: rgb(glow, 0.1) }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white/72 transition hover:border-white/18 hover:bg-white/[0.08] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {forecastV2 ? (
          <>
            <section
              className="relative overflow-hidden rounded-[34px] border border-white/10 px-5 py-6 shadow-[0_24px_90px_rgba(0,0,0,0.32)] sm:px-7 sm:py-7"
              style={{
                background: `
                  linear-gradient(155deg, rgba(10,18,32,0.94) 0%, rgba(13,21,38,0.92) 40%, rgba(17,17,29,0.9) 100%)
                `,
              }}
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `
                    radial-gradient(circle at 78% 20%, ${rgb(accentStrong, 0.2)} 0%, transparent 26%),
                    radial-gradient(circle at 24% 78%, ${rgb(accent, 0.18)} 0%, transparent 28%),
                    radial-gradient(circle at 86% 74%, ${rgb(glow, 0.16)} 0%, transparent 24%)
                  `,
                }}
              />

              <div className="relative z-10">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <div
                      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]"
                      style={{
                        borderColor: rgb(accent, 0.2),
                        backgroundColor: rgb(accent, 0.1),
                        color: rgb(accent, 0.98),
                      }}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Industry outlook
                    </div>

                    <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-[3.1rem] sm:leading-[1.02]">
                      {title}
                    </h1>

                    <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/80">
                      {summary}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <div
                      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
                      style={{
                        borderColor: rgb(glow, 0.2),
                        backgroundColor: rgb(glow, 0.1),
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      <BriefcaseBusiness
                        className="h-4 w-4"
                        style={{ color: rgb(glow, 0.98) }}
                      />
                      {outlookLabel}
                    </div>
                  </div>
                </div>

                {metrics.length > 0 ? (
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric) => (
                      <MetricInline key={metric.id} metric={metric} accent={accent} />
                    ))}
                  </div>
                ) : null}
              </div>
            </section>

            <section className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.06fr)_minmax(280px,0.94fr)]">
              <div className="min-w-0 space-y-10">
                <section className="grid gap-8 md:grid-cols-2">
                  <SimpleList
                    title="What is growing"
                    items={growing}
                    tone="grow"
                    accent={accent}
                  />
                  <SimpleList
                    title="What is under pressure"
                    items={pressure}
                    tone="pressure"
                    accent={accent}
                  />
                </section>

                {aiImpact ? (
                  <section className="rounded-[30px] border border-white/8 bg-white/[0.035] px-5 py-5 sm:px-6">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/56">
                      <div
                        className="rounded-full p-1.5"
                        style={{
                          backgroundColor: rgb(accentStrong, 0.14),
                          color: rgb(accentStrong, 0.95),
                        }}
                      >
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                      AI impact
                    </div>

                    <h2 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-white">
                      AI is changing the work, not ending the field
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                      {aiImpact.summary}
                    </p>

                    <div className="mt-6 grid gap-8 md:grid-cols-3">
                      <SimpleList
                        title="AI helps with"
                        items={aiImpact.helpsWith}
                        tone="grow"
                        accent={accent}
                      />
                      <SimpleList
                        title="AI puts pressure on"
                        items={aiImpact.putsPressureOn}
                        tone="pressure"
                        accent={accent}
                      />
                      <SimpleList
                        title="Humans still own"
                        items={aiImpact.humansStillOwn}
                        tone="accent"
                        accent={accent}
                      />
                    </div>
                  </section>
                ) : null}
              </div>

              <aside className="min-w-0 space-y-8">
                <SalaryBand forecastV2={forecastV2} accent={accent} />

                <section className="rounded-[28px] border border-white/8 bg-white/[0.035] px-4 py-5 sm:px-5">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/52">
                    Source snapshot
                  </div>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-white">
                    Current labor market read
                  </h2>

                  <div className="mt-5 space-y-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.16em] text-white/40">
                        Source
                      </div>
                      <div className="mt-1 text-sm text-white/78">
                        {forecastV2.industry.sourceLabel}
                      </div>
                    </div>

                    {forecastV2.industry.growthPercent ? (
                      <div>
                        <div className="text-xs uppercase tracking-[0.16em] text-white/40">
                          Projected growth
                        </div>
                        <div className="mt-1 text-sm text-white/78">
                          {forecastV2.industry.growthPercent}
                        </div>
                      </div>
                    ) : null}

                    {forecastV2.industry.annualOpenings ? (
                      <div>
                        <div className="text-xs uppercase tracking-[0.16em] text-white/40">
                          Annual openings
                        </div>
                        <div className="mt-1 text-sm text-white/78">
                          {forecastV2.industry.annualOpenings}
                        </div>
                      </div>
                    ) : null}

                    {forecastV2.industry.educationTypical ? (
                      <div>
                        <div className="text-xs uppercase tracking-[0.16em] text-white/40">
                          Typical education
                        </div>
                        <div className="mt-1 text-sm text-white/78">
                          {forecastV2.industry.educationTypical}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <a
                    href={forecastV2.industry.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white/76 transition hover:border-white/18 hover:bg-white/[0.08] hover:text-white"
                  >
                    Open source
                  </a>
                </section>

                <section className="rounded-[28px] border border-white/8 bg-white/[0.035] px-4 py-5 sm:px-5">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/52">
                    <div
                      className="rounded-full p-1.5"
                      style={{ backgroundColor: rgb(glow, 0.12), color: rgb(glow, 0.95) }}
                    >
                      <CircleAlert className="h-3.5 w-3.5" />
                    </div>
                    What this means
                  </div>

                  <h2 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-white">
                    Reasons to feel excited or cautious
                  </h2>

                  <div className="mt-6 grid gap-8">
                    <SimpleList
                      title="Why this could feel exciting"
                      items={exciting}
                      tone="grow"
                      accent={accent}
                    />
                    <SimpleList
                      title="Why this could feel risky"
                      items={risky}
                      tone="pressure"
                      accent={accent}
                    />
                  </div>
                </section>
              </aside>
            </section>
          </>
        ) : (
          <section className="rounded-[30px] border border-white/8 bg-white/[0.04] px-5 py-6">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/52">
              Forecast
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-white">
              This path still needs real trend data
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/72">
              The new forecast screen is built for industry data like demand,
              salary, AI pressure, and what is growing versus shrinking. This path
              has not been migrated yet.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}