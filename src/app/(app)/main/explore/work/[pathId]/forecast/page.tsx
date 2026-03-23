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
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { requireWorkPath } from "../../_data/workPaths";
import type {
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

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function parseMoney(value?: string) {
  if (!value) return null;
  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/\$?(\d+(?:\.\d+)?)(K|\+)?/i);
  if (!match) return null;

  const amount = Number(match[1]);
  if (Number.isNaN(amount)) return null;

  const suffix = match[2]?.toUpperCase();
  if (suffix === "K") return amount * 1000;
  return amount;
}

function metricToneClasses(tone?: WorkPathForecastMetricTone) {
  switch (tone) {
    case "positive":
      return {
        border: "border-emerald-300/18",
        bg: "bg-emerald-300/10",
        text: "text-emerald-50",
        label: "text-emerald-100/72",
      };
    case "warning":
      return {
        border: "border-amber-300/18",
        bg: "bg-amber-300/10",
        text: "text-amber-50",
        label: "text-amber-100/72",
      };
    case "mixed":
      return {
        border: "border-violet-300/18",
        bg: "bg-violet-300/10",
        text: "text-violet-50",
        label: "text-violet-100/72",
      };
    default:
      return {
        border: "border-white/10",
        bg: "bg-white/[0.06]",
        text: "text-white",
        label: "text-white/64",
      };
  }
}

function metricStrength(metric: WorkPathForecastMetric) {
  const value = metric.value.toLowerCase();

  if (value.includes("high")) return 84;
  if (value.includes("medium")) return 62;
  if (value.includes("low")) return 32;
  if (value.includes("strong")) return 80;
  if (value.includes("mixed")) return 56;
  if (value.includes("rising")) return 78;
  if (value.includes("stable")) return 60;

  const pctMatch = metric.value.match(/-?\d+(?:\.\d+)?/);
  if (pctMatch) {
    const num = Number(pctMatch[0]);
    if (!Number.isNaN(num)) {
      if (metric.label.toLowerCase().includes("demand")) {
        return clamp(45 + num * 2.2, 10, 95);
      }
      return clamp(num, 10, 95);
    }
  }

  const money = parseMoney(metric.value);
  if (money) {
    return clamp((money / 200000) * 100, 18, 96);
  }

  return 58;
}

function salaryBarData(forecastV2?: WorkPathForecastV2) {
  const low = parseMoney(forecastV2?.salaryRange?.low);
  const median = parseMoney(forecastV2?.salaryRange?.median);
  const high = parseMoney(forecastV2?.salaryRange?.high);

  if (!low || !median || !high || high <= low) {
    return null;
  }

  const span = high - low;
  const medianPct = ((median - low) / span) * 100;

  return {
    medianPct: clamp(medianPct, 0, 100),
  };
}

/* =============================================================================
   Small UI
============================================================================= */

function MetricCard({ metric }: { metric: WorkPathForecastMetric }) {
  const tone = metricToneClasses(metric.tone);
  const strength = metricStrength(metric);

  return (
    <div
      className={`rounded-[24px] border ${tone.border} ${tone.bg} px-4 py-4 backdrop-blur-sm`}
    >
      <div className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${tone.label}`}>
        {metric.label}
      </div>

      <div className={`mt-2 text-2xl font-semibold tracking-[-0.02em] ${tone.text}`}>
        {metric.value}
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,rgba(103,232,249,0.95),rgba(168,85,247,0.92))]"
          style={{ width: `${strength}%` }}
        />
      </div>

      <p className="mt-3 text-sm leading-6 text-white/70">{metric.note}</p>
    </div>
  );
}

function SalaryBand({ forecastV2 }: { forecastV2?: WorkPathForecastV2 }) {
  const salary = salaryBarData(forecastV2);

  if (!forecastV2?.salaryRange || !salary) {
    return null;
  }

  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.045] px-4 py-5 sm:px-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-2xl border border-emerald-300/16 bg-emerald-300/10 p-2 text-emerald-100">
          <DollarSign className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100/72">
            Salary range
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-white">
            Pay can scale a lot
          </h2>
          {forecastV2.salaryRange.note ? (
            <p className="mt-2 text-sm leading-6 text-white/72">
              {forecastV2.salaryRange.note}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5">
        <div className="relative h-3 rounded-full bg-white/10">
          <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-[linear-gradient(90deg,rgba(34,197,94,0.3),rgba(56,189,248,0.35),rgba(168,85,247,0.35))]" />
          <div
            className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-white bg-[#081220] shadow-[0_0_20px_rgba(255,255,255,0.16)]"
            style={{ left: `calc(${salary.medianPct}% - 10px)` }}
          />
        </div>

        <div className="mt-4 flex items-start justify-between gap-3 text-sm">
          <div>
            <div className="text-white/52">Low</div>
            <div className="mt-1 font-medium text-white">
              {forecastV2.salaryRange.low}
            </div>
          </div>

          <div className="text-center">
            <div className="text-white/52">Median</div>
            <div className="mt-1 font-medium text-white">
              {forecastV2.salaryRange.median}
            </div>
          </div>

          <div className="text-right">
            <div className="text-white/52">High</div>
            <div className="mt-1 font-medium text-white">
              {forecastV2.salaryRange.high}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EditorialList({
  title,
  eyebrow,
  icon,
  items,
  tone,
}: {
  title: string;
  eyebrow: string;
  icon: React.ReactNode;
  items: string[];
  tone: "grow" | "pressure";
}) {
  const toneClasses =
    tone === "grow"
      ? {
          section: "border-emerald-300/16 bg-emerald-300/[0.06]",
          eyebrow: "text-emerald-100/72",
          icon: "border-emerald-300/16 bg-emerald-300/10 text-emerald-100",
          dot: "bg-emerald-300",
          divider: "border-white/8",
        }
      : {
          section: "border-amber-300/16 bg-amber-300/[0.06]",
          eyebrow: "text-amber-100/72",
          icon: "border-amber-300/16 bg-amber-300/10 text-amber-100",
          dot: "bg-amber-300",
          divider: "border-white/8",
        };

  return (
    <section className={`rounded-[28px] border ${toneClasses.section} px-4 py-5 sm:px-5`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 rounded-2xl border p-2 ${toneClasses.icon}`}>
          {icon}
        </div>

        <div className="min-w-0">
          <div className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${toneClasses.eyebrow}`}>
            {eyebrow}
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-white">
            {title}
          </h2>
        </div>
      </div>

      <div className="mt-5 divide-y divide-white/8">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <div className={`mt-2 h-2 w-2 shrink-0 rounded-full ${toneClasses.dot}`} />
            <p className="text-sm leading-6 text-white/78">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PlainColumnList({
  title,
  eyebrow,
  items,
  accent,
}: {
  title: string;
  eyebrow: string;
  items: string[];
  accent: "emerald" | "amber" | "cyan";
}) {
  const classes =
    accent === "emerald"
      ? {
          eyebrow: "text-emerald-100/72",
          dot: "bg-emerald-300",
          border: "border-white/8",
        }
      : accent === "amber"
      ? {
          eyebrow: "text-amber-100/72",
          dot: "bg-amber-300",
          border: "border-white/8",
        }
      : {
          eyebrow: "text-cyan-100/72",
          dot: "bg-cyan-300",
          border: "border-white/8",
        };

  return (
    <div>
      <div className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${classes.eyebrow}`}>
        {eyebrow}
      </div>
      <h3 className="mt-2 text-base font-semibold text-white">{title}</h3>

      <div className={`mt-4 divide-y ${classes.border}`}>
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <div className={`mt-2 h-2 w-2 shrink-0 rounded-full ${classes.dot}`} />
            <p className="text-sm leading-6 text-white/78">{item}</p>
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

  const metrics = forecastV2?.metrics ?? [];
  const growing = forecastV2?.whatIsGrowing ?? [];
  const pressure = forecastV2?.whatIsUnderPressure ?? [];
  const aiImpact = forecastV2?.aiImpact;
  const exciting = forecastV2?.whyThisCouldFeelExciting ?? [];
  const risky = forecastV2?.whyThisCouldFeelRisky ?? [];

  const title = forecastV2
    ? `The future of ${workPath.card.title}`
    : oldForecast?.title || `The future of ${workPath.card.title}`;

  const summary = forecastV2?.outlookSummary
    ? forecastV2.outlookSummary
    : oldForecast?.summary ||
      "This field is changing over time. This page looks at what may grow, what may get squeezed, and what that could mean for someone entering it now.";

  const outlookLabel = forecastV2?.outlookLabel ?? "Mixed";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(87,83,255,0.18),_transparent_30%),radial-gradient(circle_at_20%_32%,_rgba(56,189,248,0.12),_transparent_28%),radial-gradient(circle_at_80%_22%,_rgba(244,114,182,0.1),_transparent_24%),linear-gradient(180deg,_#0a1222_0%,_#07111f_42%,_#050b16_100%)]" />
      <div className="absolute inset-x-0 top-0 h-56 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent)]" />
      <div className="absolute left-[-8rem] top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute right-[-6rem] top-16 h-72 w-72 rounded-full bg-violet-500/12 blur-3xl" />
      <div className="absolute bottom-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-500/8 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-2 text-sm font-medium text-white/86 transition hover:border-white/22 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <section className="relative overflow-hidden rounded-[32px] border border-white/12 bg-[linear-gradient(160deg,rgba(16,24,40,0.9)_0%,rgba(18,32,57,0.88)_36%,rgba(25,22,49,0.82)_100%)] px-5 py-6 shadow-[0_20px_90px_rgba(0,0,0,0.34)] sm:px-7 sm:py-7">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-y-0 right-0 w-[50%] bg-[radial-gradient(circle_at_28%_26%,rgba(56,189,248,0.26),transparent_32%),radial-gradient(circle_at_64%_48%,rgba(168,85,247,0.22),transparent_34%),radial-gradient(circle_at_72%_78%,rgba(244,114,182,0.16),transparent_24%)]" />
            <div className="absolute left-0 top-0 h-20 w-full bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent)]" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100/90">
                  <BriefcaseBusiness className="h-3.5 w-3.5" />
                  Industry outlook
                </div>

                <h1 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-[3.2rem]">
                  {title}
                </h1>

                <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/82">
                  {summary}
                </p>
              </div>

              <div className="shrink-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white/88">
                  <Sparkles className="h-4 w-4 text-cyan-200" />
                  {outlookLabel}
                </div>
              </div>
            </div>

            {metrics.length ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                  <MetricCard key={metric.id} metric={metric} />
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {forecastV2 ? (
          <section className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)] lg:gap-12">
            <div className="min-w-0 space-y-8">
              <div className="grid gap-4 md:grid-cols-2">
                <EditorialList
                  title="What is gaining momentum"
                  eyebrow="Growing"
                  icon={<TrendingUp className="h-4 w-4" />}
                  items={growing}
                  tone="grow"
                />

                <EditorialList
                  title="What is getting squeezed"
                  eyebrow="Under pressure"
                  icon={<TrendingDown className="h-4 w-4" />}
                  items={pressure}
                  tone="pressure"
                />
              </div>

              {aiImpact ? (
                <section className="rounded-[30px] border border-white/10 bg-white/[0.045] px-4 py-5 sm:px-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-2xl border border-violet-300/16 bg-violet-300/10 p-2 text-violet-100">
                      <Bot className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-100/72">
                        AI impact
                      </div>
                      <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-white">
                        AI is changing the work, not ending the field
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72">
                        {aiImpact.summary}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-8 lg:grid-cols-3">
                    <PlainColumnList
                      title="Where it helps"
                      eyebrow="AI helps with"
                      items={aiImpact.helpsWith}
                      accent="emerald"
                    />

                    <PlainColumnList
                      title="Where it puts pressure"
                      eyebrow="AI puts pressure on"
                      items={aiImpact.putsPressureOn}
                      accent="amber"
                    />

                    <PlainColumnList
                      title="What humans still own"
                      eyebrow="Humans still own"
                      items={aiImpact.humansStillOwn}
                      accent="cyan"
                    />
                  </div>
                </section>
              ) : null}
            </div>

            <aside className="min-w-0 space-y-8">
              <SalaryBand forecastV2={forecastV2} />

              <section className="rounded-[28px] border border-white/10 bg-white/[0.045] px-4 py-5 sm:px-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/62">
                  Source snapshot
                </div>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-white">
                  Current labor market read
                </h2>

                <div className="mt-5 divide-y divide-white/8">
                  <div className="py-3 first:pt-0">
                    <div className="text-xs uppercase tracking-[0.16em] text-white/44">
                      Source
                    </div>
                    <div className="mt-1 text-sm text-white/82">
                      {forecastV2.industry.sourceLabel}
                    </div>
                  </div>

                  {forecastV2.industry.growthPercent ? (
                    <div className="py-3">
                      <div className="text-xs uppercase tracking-[0.16em] text-white/44">
                        Projected growth
                      </div>
                      <div className="mt-1 text-sm text-white/82">
                        {forecastV2.industry.growthPercent}
                      </div>
                    </div>
                  ) : null}

                  {forecastV2.industry.annualOpenings ? (
                    <div className="py-3">
                      <div className="text-xs uppercase tracking-[0.16em] text-white/44">
                        Annual openings
                      </div>
                      <div className="mt-1 text-sm text-white/82">
                        {forecastV2.industry.annualOpenings}
                      </div>
                    </div>
                  ) : null}

                  {forecastV2.industry.educationTypical ? (
                    <div className="py-3">
                      <div className="text-xs uppercase tracking-[0.16em] text-white/44">
                        Typical education
                      </div>
                      <div className="mt-1 text-sm text-white/82">
                        {forecastV2.industry.educationTypical}
                      </div>
                    </div>
                  ) : null}
                </div>

                <a
                  href={forecastV2.industry.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/78 transition hover:border-white/18 hover:bg-white/10 hover:text-white"
                >
                  Open source
                </a>
              </section>

              <section className="rounded-[28px] border border-white/10 bg-white/[0.045] px-4 py-5 sm:px-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-2xl border border-white/10 bg-white/8 p-2 text-white/86">
                    <CircleAlert className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/62">
                      What this means
                    </div>
                    <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-white">
                      Reasons to feel excited or cautious
                    </h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-8">
                  <PlainColumnList
                    title="This could feel exciting if..."
                    eyebrow="Upside"
                    items={exciting}
                    accent="emerald"
                  />

                  <PlainColumnList
                    title="This could feel risky if..."
                    eyebrow="Caution"
                    items={risky}
                    accent="amber"
                  />
                </div>
              </section>
            </aside>
          </section>
        ) : (
          <section className="rounded-[30px] border border-white/10 bg-white/[0.045] px-5 py-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/62">
              Forecast
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-white">
              This path still needs real trend data
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/74">
              The new forecast screen is built for industry data like demand, salary,
              AI pressure, and what is growing versus shrinking. This path has not
              been migrated yet.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}