// apps/web/src/app/(app)/main/explore/impact/[pathId]/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  HeartHandshake,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { requireImpactPath } from "../_data/impactPaths";
import type { Rgb as SchemaRgb } from "../_data/impactPathSchema";

type Rgb = SchemaRgb;

function rgb(value: Rgb, alpha = 1) {
  return `rgba(${value.r}, ${value.g}, ${value.b}, ${alpha})`;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function shellSurface() {
  return "border border-white/10 bg-white/[0.055] backdrop-blur-2xl";
}

function pillSurface() {
  return "border border-white/10 bg-white/[0.07] text-white/84";
}

function DetailKicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.19em] text-white/42 sm:text-[12px]">
      {children}
    </p>
  );
}

function DetailOrbArt({
  accent,
  glow,
}: {
  accent: Rgb;
  glow: Rgb;
}) {
  return (
    <div className="pointer-events-none absolute right-3 top-3 hidden h-[112px] w-[112px] sm:block">
      <div
        className="absolute inset-0 rounded-full border"
        style={{ borderColor: rgb(accent, 0.12) }}
      />
      <div
        className="absolute inset-[15px] rounded-full border"
        style={{ borderColor: rgb(glow, 0.12) }}
      />
      <div
        className="absolute left-[16px] top-[20px] h-2.5 w-2.5 rounded-full shadow-[0_0_16px_rgba(255,255,255,0.18)]"
        style={{ backgroundColor: rgb(accent, 0.72) }}
      />
      <div className="absolute left-[72px] top-[26px] h-2 w-2 rounded-full bg-white/24" />
      <div
        className="absolute left-[40px] top-[72px] h-2.5 w-2.5 rounded-full shadow-[0_0_14px_rgba(255,255,255,0.15)]"
        style={{ backgroundColor: rgb(glow, 0.72) }}
      />
      <div
        className="absolute left-[28px] top-[32px] h-px w-[40px] bg-gradient-to-r to-transparent"
        style={{ backgroundColor: rgb(accent, 0.22) }}
      />
      <div
        className="absolute left-[48px] top-[43px] h-px w-[24px] rotate-[12deg] bg-gradient-to-r to-transparent"
        style={{ backgroundColor: rgb(glow, 0.18) }}
      />
      <div
        className="absolute left-[48px] top-[64px] h-px w-[26px] -rotate-[9deg] bg-gradient-to-r to-transparent"
        style={{ backgroundColor: rgb(accent, 0.16) }}
      />

      <div
        className="absolute bottom-[10px] right-[2px] flex h-10 w-10 items-center justify-center rounded-full border text-white/80"
        style={{
          borderColor: rgb(accent, 0.14),
          backgroundColor: rgb(accent, 0.06),
        }}
      >
        <HeartHandshake className="h-4 w-4" />
      </div>
    </div>
  );
}

export default function ImpactPathDetailPage() {
  const params = useParams<{ pathId: string }>();
  const pathId = Array.isArray(params?.pathId) ? params.pathId[0] : params?.pathId;

  if (!pathId) notFound();

  let path;
  try {
    path = requireImpactPath(pathId);
  } catch {
    notFound();
  }

  const theme = path.theme;

  return (
    <div className="pb-24 pt-3">
      <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:px-7 sm:py-6">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 82% 18%, ${rgb(theme.glow, 0.12)}, transparent 18%),
              radial-gradient(circle at 18% 12%, ${rgb(theme.accentStrong, 0.08)}, transparent 22%),
              linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.00) 50%)
            `,
          }}
        />

        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[36px] font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-[50px]">
              Explore
            </h1>
            <p className="mt-1 text-[15px] leading-[1.5] text-white/62 sm:text-[16px]">
              Inside this impact path
            </p>
          </div>

          <Link
            href="/main/explore/impact"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2.5 text-[14px] font-medium text-white/84 transition hover:bg-white/[0.08]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Impact
          </Link>
        </div>
      </section>

      <section className="relative mt-6 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-7 sm:py-7">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 78% 22%, ${rgb(theme.glow, 0.14)}, transparent 18%),
              radial-gradient(circle at 20% 15%, ${rgb(theme.accentStrong, 0.1)}, transparent 22%),
              linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.00) 46%)
            `,
          }}
        />
        <DetailOrbArt accent={theme.accent} glow={theme.glow} />

        <div className="relative max-w-5xl pr-0 sm:pr-24">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/84">
              <Sparkles className="h-3.5 w-3.5" />
              {path.hero.eyebrow}
            </div>

            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[12px] font-medium text-white/78">
              {theme.surfaceLabel}
            </div>
          </div>

          <DetailKicker>
            Impact path
          </DetailKicker>

          <h2 className="mt-3 max-w-4xl text-[28px] font-semibold leading-[1.07] tracking-[-0.04em] text-white sm:text-[34px] lg:text-[36px]">
            {path.hero.title}
          </h2>

          <p
            className="mt-4 max-w-3xl text-[15px] font-medium leading-[1.7] sm:text-[16px]"
            style={{ color: rgb(theme.accent, 0.96) }}
          >
            {path.hero.hook}
          </p>

          <p className="mt-4 max-w-4xl text-[15px] leading-[1.75] text-white/76 sm:text-[16px]">
            {path.hero.summary}
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            {path.traitChips.map((chip) => (
              <div
                key={chip.id}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[13px] font-medium text-white/82"
              >
                {chip.label}
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3">
            {path.hero.whyItPullsYouIn.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-black/18 px-4 py-3.5"
              >
                <div
                  className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: rgb(theme.accentStrong, 0.94) }}
                />
                <p className="text-[14px] leading-[1.7] text-white/82 sm:text-[15px]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-5">
        <section className={cx("rounded-[30px] px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)]", shellSurface())}>
          <div className="mb-4 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{ background: rgb(theme.accent, 0.14) }}
            >
              <HeartHandshake className="h-5 w-5" style={{ color: rgb(theme.accentStrong, 0.96) }} />
            </div>
            <div>
              <h2 className="text-[1.2rem] font-semibold tracking-[-0.02em] text-white sm:text-[1.35rem]">
                Fit Signals
              </h2>
              <p className="mt-1 text-[13px] text-white/60 sm:text-[14px]">
                Why this kind of impact might feel natural for you
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {path.fitSignals.map((signal) => (
              <div
                key={signal.id}
                className="rounded-[22px] border border-white/10 bg-black/18 px-4 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[15px] font-semibold text-white sm:text-[16px]">
                      {signal.label}
                    </h3>
                    <p className="mt-2 text-[14px] leading-6 text-white/74">
                      {signal.explanation}
                    </p>
                  </div>

                  <div className={cx("shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold", pillSurface())}>
                    {signal.score}/5
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={cx("rounded-[30px] px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)]", shellSurface())}>
          <div className="mb-4 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{ background: rgb(theme.accentStrong, 0.14) }}
            >
              <Compass className="h-5 w-5" style={{ color: rgb(theme.accent, 0.96) }} />
            </div>
            <div>
              <h2 className="text-[1.2rem] font-semibold tracking-[-0.02em] text-white sm:text-[1.35rem]">
                Branches Inside This Path
              </h2>
              <p className="mt-1 text-[13px] text-white/60 sm:text-[14px]">
                Different ways this kind of contribution can show up
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {path.branchPreviews.map((branch) => (
              <div
                key={branch.id}
                className="rounded-[22px] border border-white/10 bg-black/18 px-4 py-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[15px] font-semibold text-white sm:text-[16px]">
                    {branch.title}
                  </h3>
                  <div className={cx("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]", pillSurface())}>
                    {branch.energy}
                  </div>
                </div>

                <p
                  className="mt-2 text-[14px] font-medium"
                  style={{ color: rgb(theme.accent, 0.96) }}
                >
                  {branch.oneLiner}
                </p>

                <p className="mt-2 text-[14px] leading-6 text-white/72">
                  {branch.whyItCouldFit}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3">
            {path.branches.map((branch) => (
              <div
                key={branch.id}
                className="rounded-[24px] border border-white/10 bg-white/[0.045] px-4 py-4 sm:px-5 sm:py-5"
              >
                <h3 className="text-[16px] font-semibold text-white sm:text-[18px]">
                  {branch.title}
                </h3>
                <p className="mt-2 text-[14px] leading-6 text-white/76 sm:text-[15px]">
                  {branch.summary}
                </p>

                <div className="mt-4 grid gap-4">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/46">
                      What you actually do
                    </div>
                    <div className="mt-2 grid gap-2">
                      {branch.whatYouActuallyDo.map((item, index) => (
                        <div key={`${branch.id}-do-${index}`} className="flex gap-3">
                          <div
                            className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: rgb(theme.accentStrong, 0.96) }}
                          />
                          <p className="text-[14px] leading-6 text-white/78">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/46">
                      Skills that grow here
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {branch.skillsThatGrowHere.map((skill, index) => (
                        <div
                          key={`${branch.id}-skill-${index}`}
                          className={cx("rounded-full px-3 py-1.5 text-[12px] font-medium", pillSurface())}
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/46">
                      Starter projects
                    </div>
                    <div className="mt-2 grid gap-2">
                      {branch.starterProjects.map((item, index) => (
                        <div key={`${branch.id}-project-${index}`} className="flex gap-3">
                          <div
                            className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: rgb(theme.accent, 0.96) }}
                          />
                          <p className="text-[14px] leading-6 text-white/78">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[13px] italic leading-6 text-white/60">
                    {branch.atmosphere}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={cx("rounded-[30px] px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)]", shellSurface())}>
          <div className="mb-4 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{ background: rgb(theme.glow, 0.14) }}
            >
              <ArrowRight className="h-5 w-5" style={{ color: rgb(theme.accentStrong, 0.96) }} />
            </div>
            <div>
              <h2 className="text-[1.2rem] font-semibold tracking-[-0.02em] text-white sm:text-[1.35rem]">
                {path.tryNow.title}
              </h2>
              <p className="mt-1 text-[13px] text-white/60 sm:text-[14px]">
                {path.tryNow.summary}
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {path.tryNow.actions.map((action) => (
              <div
                key={action.id}
                className="rounded-[24px] border border-white/10 bg-white/[0.045] px-4 py-4 sm:px-5 sm:py-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[16px] font-semibold text-white sm:text-[18px]">
                    {action.title}
                  </h3>
                  <div className={cx("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]", pillSurface())}>
                    {action.type}
                  </div>
                  <div className={cx("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]", pillSurface())}>
                    {action.effort}
                  </div>
                  <div className={cx("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]", pillSurface())}>
                    {action.timeEstimate}
                  </div>
                </div>

                <p className="mt-3 text-[14px] leading-6 text-white/76 sm:text-[15px]">
                  {action.whyThisMatters}
                </p>

                <div className="mt-4 grid gap-2">
                  {action.instructions.map((step, index) => (
                    <div key={`${action.id}-step-${index}`} className="flex gap-3">
                      <div
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
                        style={{
                          background: rgb(theme.accent, 0.14),
                          color: rgb(theme.accentStrong, 0.96),
                        }}
                      >
                        {index + 1}
                      </div>
                      <p className="pt-[2px] text-[14px] leading-6 text-white/80">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={cx("rounded-[30px] px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)]", shellSurface())}>
          <div className="mb-4 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{ background: rgb(theme.accentStrong, 0.14) }}
            >
              <Sparkles className="h-5 w-5" style={{ color: rgb(theme.accent, 0.96) }} />
            </div>
            <div>
              <h2 className="text-[1.2rem] font-semibold tracking-[-0.02em] text-white sm:text-[1.35rem]">
                {path.howItFeels.title}
              </h2>
              <p className="mt-1 text-[13px] text-white/60 sm:text-[14px]">
                {path.howItFeels.summary}
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {path.howItFeels.moments.map((moment) => (
              <div
                key={moment.id}
                className="rounded-[22px] border border-white/10 bg-black/18 px-4 py-4"
              >
                <h3 className="text-[15px] font-semibold text-white sm:text-[16px]">
                  {moment.title}
                </h3>
                <p className="mt-2 text-[14px] leading-6 text-white/74">
                  {moment.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className={cx("rounded-[30px] px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)]", shellSurface())}>
          <div className="mb-4 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{ background: rgb(theme.accent, 0.14) }}
            >
              <TrendingUp className="h-5 w-5" style={{ color: rgb(theme.accentStrong, 0.96) }} />
            </div>
            <div>
              <h2 className="text-[1.2rem] font-semibold tracking-[-0.02em] text-white sm:text-[1.35rem]">
                {path.growthPath.title}
              </h2>
              <p className="mt-1 text-[13px] text-white/60 sm:text-[14px]">
                {path.growthPath.summary}
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {path.growthPath.stages.map((stage) => (
              <div
                key={stage.id}
                className="rounded-[24px] border border-white/10 bg-white/[0.045] px-4 py-4 sm:px-5 sm:py-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[16px] font-semibold text-white sm:text-[18px]">
                    {stage.label}
                  </h3>
                  <div className={cx("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]", pillSurface())}>
                    {stage.timeframe}
                  </div>
                </div>

                <p className="mt-3 text-[14px] leading-6 text-white/76 sm:text-[15px]">
                  {stage.summary}
                </p>

                <div className="mt-4 grid gap-2">
                  {stage.signalsOfProgress.map((signal, index) => (
                    <div key={`${stage.id}-signal-${index}`} className="flex gap-3">
                      <div
                        className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: rgb(theme.accentStrong, 0.96) }}
                      />
                      <p className="text-[14px] leading-6 text-white/80">{signal}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={cx("rounded-[30px] px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)]", shellSurface())}>
          <div className="mb-4 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{ background: rgb(theme.glow, 0.14) }}
            >
              <ArrowRight className="h-5 w-5" style={{ color: rgb(theme.accent, 0.96) }} />
            </div>
            <div>
              <h2 className="text-[1.2rem] font-semibold tracking-[-0.02em] text-white sm:text-[1.35rem]">
                {path.nextSteps.title}
              </h2>
              <p className="mt-1 text-[13px] text-white/60 sm:text-[14px]">
                {path.nextSteps.summary}
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {path.nextSteps.actions.map((action) => (
              <div
                key={action.id}
                className="rounded-[24px] border border-white/10 bg-white/[0.045] px-4 py-4 sm:px-5 sm:py-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[16px] font-semibold text-white sm:text-[18px]">
                    {action.title}
                  </h3>
                  <div className={cx("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]", pillSurface())}>
                    {action.type}
                  </div>
                  <div className={cx("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]", pillSurface())}>
                    {action.effort}
                  </div>
                  <div className={cx("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]", pillSurface())}>
                    {action.timeEstimate}
                  </div>
                </div>

                <p className="mt-3 text-[14px] leading-6 text-white/76 sm:text-[15px]">
                  {action.whyThisMatters}
                </p>

                <div className="mt-4 grid gap-2">
                  {action.instructions.map((step, index) => (
                    <div key={`${action.id}-step-${index}`} className="flex gap-3">
                      <div
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
                        style={{
                          background: rgb(theme.accentStrong, 0.14),
                          color: rgb(theme.accent, 0.96),
                        }}
                      >
                        {index + 1}
                      </div>
                      <p className="pt-[2px] text-[14px] leading-6 text-white/80">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {path.nextSteps.opportunityGroups.length > 0 ? (
            <div className="mt-5 grid gap-4">
              {path.nextSteps.opportunityGroups.map((group) => (
                <div
                  key={group.id}
                  className="rounded-[24px] border border-white/10 bg-white/[0.045] px-4 py-4 sm:px-5 sm:py-5"
                >
                  <h3 className="text-[16px] font-semibold text-white sm:text-[18px]">
                    {group.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-6 text-white/74 sm:text-[15px]">
                    {group.description}
                  </p>

                  <div className="mt-4 grid gap-3">
                    {group.items.map((item) => (
                      <a
                        key={item.id}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-[22px] border border-white/10 bg-black/18 px-4 py-4 transition hover:bg-white/[0.06]"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-[15px] font-semibold text-white sm:text-[16px]">
                            {item.title}
                          </h4>
                          <div className={cx("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]", pillSurface())}>
                            {item.mode}
                          </div>
                          <div className={cx("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]", pillSurface())}>
                            {item.formatLabel}
                          </div>
                        </div>

                        <p
                          className="mt-2 text-[14px] font-medium"
                          style={{ color: rgb(theme.accent, 0.96) }}
                        >
                          {item.provider}
                        </p>

                        <p className="mt-2 text-[14px] leading-6 text-white/74">
                          {item.summary}
                        </p>

                        <p className="mt-2 text-[13px] leading-6 text-white/60">
                          {item.whyItHelps}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}