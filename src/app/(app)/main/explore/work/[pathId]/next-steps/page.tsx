// apps/web/src/app/(app)/main/explore/work/[pathId]/next-steps/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, Monitor, Rocket } from "lucide-react";

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
  return dark ? "text-white/70" : "text-slate-700";
}

function textFaint(dark: boolean) {
  return dark ? "text-white/50" : "text-slate-500";
}

/* =============================================================================
   Page
============================================================================= */

export default function WorkPathNextStepsPage() {
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
        pageKind: "nextSteps",
        pathId: path.id,
        firstName,
      }),
    [path.id, firstName]
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 16% 20%, ${rgb(path.theme.accent, 0.18)} 0%, transparent 30%),
              radial-gradient(circle at 82% 16%, ${rgb(path.theme.glow, 0.18)} 0%, transparent 28%),
              radial-gradient(circle at 68% 78%, ${rgb(path.theme.accentStrong, 0.14)} 0%, transparent 30%),
              linear-gradient(180deg, rgba(4,10,18,0.96) 0%, rgba(7,17,31,0.98) 40%, rgba(4,9,18,1) 100%)
            `,
          }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <Link
          href={`/main/explore/work/${path.slug}`}
          className={[
            "inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition",
            shellSurface(dark),
            textSoft(dark),
            "hover:bg-white/[0.08]",
          ].join(" ")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to overview
        </Link>

        <WorkPathSubnav pathSlug={path.slug} />

        <section
          className={[
            "relative overflow-hidden rounded-[32px] px-6 py-8",
            shellSurface(dark),
            "shadow-[0_30px_120px_rgba(0,0,0,0.34)]",
          ].join(" ")}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{
              background: `
                radial-gradient(circle at 14% 18%, ${rgb(path.theme.accent, 0.16)} 0%, transparent 30%),
                radial-gradient(circle at 84% 18%, ${rgb(path.theme.glow, 0.14)} 0%, transparent 28%)
              `,
            }}
          />

          <div className="relative max-w-3xl">
            <div className="rounded-[26px] border border-white/10 bg-white/[0.05] px-4 py-4 backdrop-blur-xl sm:px-5 sm:py-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/42">
                Everleap guide
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

            <div
              className={`mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] ${textFaint(
                dark
              )}`}
            >
              Next steps
            </div>

            <h1
              className={`mt-3 text-4xl font-semibold tracking-tight sm:text-5xl ${textMain(
                dark
              )}`}
            >
              {path.nextSteps.title}
            </h1>

            <p className={`mt-4 text-lg leading-8 ${textSoft(dark)}`}>
              {path.nextSteps.summary}
            </p>
          </div>
        </section>

        <section
          className={[
            "rounded-[28px] px-5 py-5 sm:px-6 sm:py-6",
            shellSurface(dark),
          ].join(" ")}
        >
          <div
            className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${textFaint(
              dark
            )}`}
          >
            Start small
          </div>
          <p className={`mt-2 max-w-3xl text-sm leading-6 ${textSoft(dark)}`}>
            Pick one action that feels real and doable right now. You are not trying
            to impress anyone yet. You are looking for proof that this world becomes
            more interesting when you move one step closer to it.
          </p>
        </section>

        <section className="grid gap-4">
          {path.nextSteps.actions.map((action) => (
            <div
              key={action.id}
              className={[
                "rounded-[28px] px-6 py-6",
                shellSurface(dark),
              ].join(" ")}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
                  <Rocket className="h-4 w-4 text-white/70" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className={`text-lg font-semibold ${textMain(dark)}`}>
                      {action.title}
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/60">
                      {action.type.replace("-", " ")}
                    </div>

                    {action.timeEstimate ? (
                      <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/60">
                        {action.timeEstimate}
                      </div>
                    ) : null}

                    {action.effort ? (
                      <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/60">
                        {action.effort}
                      </div>
                    ) : null}
                  </div>

                  <p className={`mt-3 text-sm leading-6 ${textSoft(dark)}`}>
                    {action.whyThisMatters}
                  </p>

                  <div className="mt-4">
                    <div
                      className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${textFaint(
                        dark
                      )}`}
                    >
                      One way in
                    </div>

                    <div className="mt-3 space-y-2">
                      {action.instructions.map((instruction) => (
                        <div
                          key={instruction}
                          className="rounded-[18px] border border-white/8 bg-white/[0.035] px-4 py-3"
                        >
                          <div className={`text-sm leading-6 ${textSoft(dark)}`}>
                            {instruction}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {path.nextSteps.opportunityGroups?.length ? (
          <>
            <section
              className={[
                "rounded-[28px] px-5 py-5 sm:px-6 sm:py-6",
                shellSurface(dark),
              ].join(" ")}
            >
              <div
                className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${textFaint(
                  dark
                )}`}
              >
                Step into the world
              </div>
              <p className={`mt-2 max-w-3xl text-sm leading-6 ${textSoft(dark)}`}>
                Once something feels interesting, getting closer to real people,
                tools, events, or communities can make the path feel much more vivid.
                These are places you can begin around you or from anywhere.
              </p>
            </section>

            <section className="grid gap-4">
              {path.nextSteps.opportunityGroups.map((group) => (
                <div
                  key={group.id}
                  className={[
                    "rounded-[28px] px-6 py-6",
                    shellSurface(dark),
                  ].join(" ")}
                >
                  <div
                    className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${textFaint(
                      dark
                    )}`}
                  >
                    {group.title}
                  </div>

                  {group.description ? (
                    <p className={`mt-2 text-sm leading-6 ${textSoft(dark)}`}>
                      {group.description}
                    </p>
                  ) : null}

                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    {group.items.map((item) => {
                      const isLocal = item.mode === "local";
                      const Icon = isLocal ? MapPin : Monitor;

                      const content = (
                        <div
                          className={[
                            "rounded-[22px] border border-white/8 bg-white/[0.035] px-5 py-5 transition",
                            item.href ? "hover:bg-white/[0.06]" : "",
                          ].join(" ")}
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
                              <Icon className="h-4 w-4 text-white/70" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className={`text-base font-semibold ${textMain(dark)}`}>
                                  {item.title}
                                </div>

                                <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/60">
                                  {item.mode}
                                </div>

                                {item.locationLabel ? (
                                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/60">
                                    {item.locationLabel}
                                  </div>
                                ) : null}

                                {item.formatLabel ? (
                                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/60">
                                    {item.formatLabel}
                                  </div>
                                ) : null}
                              </div>

                              {item.provider || item.distanceLabel ? (
                                <div className={`mt-2 text-sm ${textFaint(dark)}`}>
                                  {[item.provider, item.distanceLabel]
                                    .filter(Boolean)
                                    .join(" • ")}
                                </div>
                              ) : null}

                              <p className={`mt-3 text-sm leading-6 ${textSoft(dark)}`}>
                                {item.summary}
                              </p>

                              <div className="mt-4 rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
                                <div
                                  className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${textFaint(
                                    dark
                                  )}`}
                                >
                                  Why it helps
                                </div>
                                <p className={`mt-2 text-sm leading-6 ${textSoft(dark)}`}>
                                  {item.whyItHelps}
                                </p>
                              </div>

                              {item.href ? (
                                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/82">
                                  Open resource
                                  <ArrowUpRightMini />
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      );

                      return item.href ? (
                        <a
                          key={item.id}
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="block"
                        >
                          {content}
                        </a>
                      ) : (
                        <div key={item.id}>{content}</div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>
          </>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-2">
          <Link
            href={`/main/explore/work/${path.slug}/day`}
            className={[
              "group rounded-[26px] px-5 py-5 transition hover:bg-white/[0.08]",
              shellSurface(dark),
            ].join(" ")}
          >
            <div
              className={`text-[11px] uppercase tracking-[0.2em] ${textFaint(dark)}`}
            >
              Day in the life
            </div>

            <div className={`mt-2 text-xl font-semibold ${textMain(dark)}`}>
              {path.dayInLife.title}
            </div>

            <p className={`mt-2 text-sm leading-6 ${textSoft(dark)}`}>
              {path.dayInLife.summary}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white">
              Explore
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          <Link
            href={`/main/explore/work/${path.slug}/forecast`}
            className={[
              "group rounded-[26px] px-5 py-5 transition hover:bg-white/[0.08]",
              shellSurface(dark),
            ].join(" ")}
          >
            <div
              className={`text-[11px] uppercase tracking-[0.2em] ${textFaint(dark)}`}
            >
              Forecast
            </div>

            <div className={`mt-2 text-xl font-semibold ${textMain(dark)}`}>
              {path.forecast.title}
            </div>

            <p className={`mt-2 text-sm leading-6 ${textSoft(dark)}`}>
              {path.forecast.summary}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white">
              Explore
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}

function ArrowUpRightMini() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M6 14L14 6M8 6H14V12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}