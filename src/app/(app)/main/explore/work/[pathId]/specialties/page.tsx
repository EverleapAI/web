// apps/web/src/app/(app)/main/explore/work/[pathId]/specialties/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
            href={`/main/explore/work/${path.slug}`}
            className={[
              "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition",
              shellSurface(dark),
              textSoft(dark),
              "hover:bg-white/[0.08]",
            ].join(" ")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {path.card.title}
          </Link>
        </div>

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
                radial-gradient(circle at 12% 18%, ${rgb(path.theme.accent, 0.16)} 0%, transparent 30%),
                radial-gradient(circle at 85% 15%, ${rgb(path.theme.glow, 0.14)} 0%, transparent 26%)
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
              Specialties
            </div>

            <h1
              className={`mt-3 text-4xl font-semibold tracking-tight sm:text-5xl ${textMain(
                dark
              )}`}
            >
              Different versions of this path
            </h1>

            <p className={`mt-4 text-lg leading-8 ${textSoft(dark)}`}>
              Broad paths usually become more useful once you can feel their internal
              branches. The question here is not just what this career is called —
              it is which version of it seems to fit your energy best.
            </p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {path.specialtyPreviews.map((preview) => {
            const detail = path.specialties.find((s) => s.slug === preview.slug);

            return (
              <div
                key={preview.id}
                className={[
                  "rounded-[26px] px-5 py-5",
                  shellSurface(dark),
                  "transition hover:bg-white/[0.08]",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className={`text-xl font-semibold ${textMain(dark)}`}>
                    {preview.title}
                  </div>

                  {preview.energy ? (
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/56">
                      {preview.energy.replace("-", " ")}
                    </span>
                  ) : null}
                </div>

                <p className={`mt-3 text-sm leading-6 ${textSoft(dark)}`}>
                  {preview.oneLiner}
                </p>

                <div className="mt-4 rounded-[18px] border border-white/8 bg-white/[0.035] px-4 py-4">
                  <div
                    className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${textFaint(
                      dark
                    )}`}
                  >
                    Why this version might fit
                  </div>
                  <p className={`mt-2 text-sm leading-6 ${textSoft(dark)}`}>
                    {preview.whyItCouldFit}
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

                <Link
                  href={`/main/explore/work/${path.slug}/specialties/${preview.slug}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"
                >
                  Explore specialty
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}