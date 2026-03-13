// apps/web/src/app/(app)/main/explore/work/[pathId]/next-steps/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Monitor,
  Rocket,
  Sparkles,
  Puzzle,
  CalendarDays,
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
  return dark ? "text-white/70" : "text-slate-700";
}

function textFaint(dark: boolean) {
  return dark ? "text-white/50" : "text-slate-500";
}

function orbBase() {
  return "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-xl";
}

function metaChip() {
  return "inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/60";
}

function sectionKicker(dark: boolean) {
  return `text-[11px] font-semibold uppercase tracking-[0.2em] ${textFaint(dark)}`;
}

function actionIcon(index: number) {
  if (index === 0) return Sparkles;
  if (index === 1) return Puzzle;
  return Rocket;
}

function opportunityIcon(mode: string, index: number) {
  if (mode === "local") {
    return index % 2 === 0 ? MapPin : CalendarDays;
  }
  return index % 2 === 0 ? Monitor : Rocket;
}

function sectionIntroTone(groupId: string) {
  if (groupId === "self-starters") {
    return "Small moves create the fastest signal. The point is not to commit your whole identity — it is to see whether the work gets more alive when you touch it directly.";
  }
  if (groupId === "near-you") {
    return "Real places change the feeling of a path. Once you can see people building, gathering, or learning in the same world, the idea becomes much less abstract.";
  }
  return "Online doors are useful when you want momentum now. These work best when they pull you toward making, showing, or joining — not just reading forever.";
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

  const selfStarters = path.nextSteps.actions.slice(0, 2);

  const localGroup =
    path.nextSteps.opportunityGroups?.find((group) => group.id === "near-you") ??
    path.nextSteps.opportunityGroups?.find((group) =>
      group.items.some((item) => item.mode === "local")
    );

  const onlineGroup =
    path.nextSteps.opportunityGroups?.find((group) => group.id === "online-now") ??
    path.nextSteps.opportunityGroups?.find((group) =>
      group.items.some((item) => item.mode === "virtual")
    );

  const localItems = localGroup?.items.slice(0, 4) ?? [];
  const onlineItems = onlineGroup?.items.slice(0, 4) ?? [];

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

          <div className="relative max-w-4xl">
            <div className={sectionKicker(dark)}>Next steps</div>

            <h1
              className={`mt-3 text-4xl font-semibold tracking-tight sm:text-5xl ${textMain(
                dark
              )}`}
            >
              {path.nextSteps.title}
            </h1>

            <p className={`mt-4 max-w-3xl text-lg leading-8 ${textSoft(dark)}`}>
              {path.nextSteps.summary}
            </p>

            <div className="mt-7 max-w-3xl rounded-[26px] border border-white/10 bg-white/[0.05] px-4 py-4 backdrop-blur-xl sm:px-5 sm:py-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/42">
                Why these first moves matter
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

        {selfStarters.length ? (
          <section
            className={[
              "rounded-[28px] px-5 py-5 sm:px-6 sm:py-6",
              shellSurface(dark),
            ].join(" ")}
          >
            <div className={sectionKicker(dark)}>Start on your own</div>

            <h2 className={`mt-2 text-[24px] font-semibold tracking-tight ${textMain(dark)}`}>
              Begin where the path feels closest
            </h2>

            <p className={`mt-3 max-w-3xl text-sm leading-6 ${textSoft(dark)}`}>
              {sectionIntroTone("self-starters")}
            </p>

            <div className="mt-6 divide-y divide-white/8">
              {selfStarters.map((action, index) => {
                const Icon = actionIcon(index);

                return (
                  <div key={action.id} className={index === 0 ? "pb-6" : "pt-6"}>
                    <div className="flex items-start gap-4">
                      <div className={orbBase()}>
                        <Icon className="h-4 w-4 text-white/75" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <div className={`text-base font-semibold ${textMain(dark)}`}>
                            {action.title}
                          </div>

                          {index === 0 ? (
                            <span className={metaChip()}>First move</span>
                          ) : null}

                          {action.timeEstimate ? (
                            <span className={metaChip()}>{action.timeEstimate}</span>
                          ) : null}

                          {action.effort ? (
                            <span className={metaChip()}>{action.effort}</span>
                          ) : null}
                        </div>

                        <p className={`mt-3 text-sm leading-6 ${textSoft(dark)}`}>
                          {action.whyThisMatters}
                        </p>

                        <div className="mt-4">
                          <div className={sectionKicker(dark)}>One way to test it</div>
                          <div className="mt-2 space-y-2">
                            {action.instructions.map((instruction) => (
                              <div
                                key={instruction}
                                className={`text-sm leading-6 ${textSoft(dark)}`}
                              >
                                {instruction}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {localGroup ? (
          <section
            className={[
              "rounded-[28px] px-5 py-5 sm:px-6 sm:py-6",
              shellSurface(dark),
            ].join(" ")}
          >
            <div className={sectionKicker(dark)}>Near you</div>

            <h2 className={`mt-2 text-[24px] font-semibold tracking-tight ${textMain(dark)}`}>
              Let the world get more concrete
            </h2>

            <p className={`mt-3 max-w-3xl text-sm leading-6 ${textSoft(dark)}`}>
              {sectionIntroTone("near-you")}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className={metaChip()}>{localItems.length} local options</span>
              <span className={metaChip()}>In-person energy</span>
            </div>

            <div className="mt-6 divide-y divide-white/8">
              {localItems.map((item, index) => {
                const Icon = opportunityIcon(item.mode, index);

                const content = (
                  <div
                    className={[
                      index === 0 ? "pb-6" : "pt-6",
                      item.href
                        ? "transition duration-200 hover:translate-x-[2px]"
                        : "",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-4">
                      <div className={orbBase()}>
                        <Icon className="h-4 w-4 text-white/75" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <div className={`text-base font-semibold ${textMain(dark)}`}>
                            {item.title}
                          </div>

                          <span className={metaChip()}>Local</span>

                          {item.locationLabel ? (
                            <span className={metaChip()}>{item.locationLabel}</span>
                          ) : null}

                          {item.distanceLabel ? (
                            <span className={metaChip()}>{item.distanceLabel}</span>
                          ) : null}
                        </div>

                        {item.provider ? (
                          <div className={`mt-2 text-sm ${textFaint(dark)}`}>{item.provider}</div>
                        ) : null}

                        <p className={`mt-3 text-sm leading-6 ${textSoft(dark)}`}>
                          {item.summary}
                        </p>

                        <p className={`mt-3 text-sm leading-6 ${textSoft(dark)}`}>
                          <span className="font-semibold text-white/84">Why it helps:</span>{" "}
                          {item.whyItHelps}
                        </p>

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
          </section>
        ) : null}

        {onlineGroup ? (
          <section
            className={[
              "rounded-[28px] px-5 py-5 sm:px-6 sm:py-6",
              shellSurface(dark),
            ].join(" ")}
          >
            <div className={sectionKicker(dark)}>Online</div>

            <h2 className={`mt-2 text-[24px] font-semibold tracking-tight ${textMain(dark)}`}>
              Open a door today
            </h2>

            <p className={`mt-3 max-w-3xl text-sm leading-6 ${textSoft(dark)}`}>
              {sectionIntroTone("online-now")}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className={metaChip()}>{onlineItems.length} online options</span>
              <span className={metaChip()}>Start right away</span>
            </div>

            <div className="mt-6 divide-y divide-white/8">
              {onlineItems.map((item, index) => {
                const Icon = opportunityIcon(item.mode, index);

                const content = (
                  <div
                    className={[
                      index === 0 ? "pb-6" : "pt-6",
                      item.href
                        ? "transition duration-200 hover:translate-x-[2px]"
                        : "",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-4">
                      <div className={orbBase()}>
                        <Icon className="h-4 w-4 text-white/75" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <div className={`text-base font-semibold ${textMain(dark)}`}>
                            {item.title}
                          </div>

                          <span className={metaChip()}>Online</span>

                          {item.formatLabel ? (
                            <span className={metaChip()}>{item.formatLabel}</span>
                          ) : null}
                        </div>

                        {item.provider ? (
                          <div className={`mt-2 text-sm ${textFaint(dark)}`}>{item.provider}</div>
                        ) : null}

                        <p className={`mt-3 text-sm leading-6 ${textSoft(dark)}`}>
                          {item.summary}
                        </p>

                        <p className={`mt-3 text-sm leading-6 ${textSoft(dark)}`}>
                          <span className="font-semibold text-white/84">Why it helps:</span>{" "}
                          {item.whyItHelps}
                        </p>

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
          </section>
        ) : null}

        <section
          className={[
            "rounded-[28px] px-5 py-5 sm:px-6 sm:py-6",
            shellSurface(dark),
          ].join(" ")}
        >
          <p className={`max-w-3xl text-sm leading-7 ${textSoft(dark)}`}>
            The point is not to do all of this. Pick one move that feels interesting,
            believable, and close enough to try — then notice whether the path becomes
            more magnetic once you are a little nearer to the work itself.
          </p>
        </section>

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
              See the rhythm
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
              See the arc
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