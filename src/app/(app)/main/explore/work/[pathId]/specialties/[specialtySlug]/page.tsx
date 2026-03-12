// apps/web/src/app/(app)/main/explore/work/[pathId]/specialties/[specialtySlug]/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  requireWorkPath,
  requireWorkSpecialty,
} from "../../../_data/workPaths";
import {
  getWorkAgenticOpening,
  readStoredFirstName,
} from "../../../_data/getWorkAgenticOpening";
import { WorkPathSubnav } from "../../../components/WorkPathSubnav";

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

  const dark = true;
  const [firstName, setFirstName] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFirstName(readStoredFirstName());
  }, []);

  const opening = React.useMemo(
    () =>
      getWorkAgenticOpening({
        pageKind: "specialtyDetail",
        pathId: path.id,
        specialtySlug: specialty.slug,
        firstName,
      }),
    [path.id, specialty.slug, firstName]
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 14% 18%, ${rgb(path.theme.accent, 0.18)} 0%, transparent 30%),
              radial-gradient(circle at 82% 14%, ${rgb(path.theme.glow, 0.18)} 0%, transparent 26%),
              radial-gradient(circle at 70% 78%, ${rgb(path.theme.accentStrong, 0.14)} 0%, transparent 28%),
              linear-gradient(180deg, rgba(4,10,18,0.96) 0%, rgba(7,17,31,0.98) 38%, rgba(4,9,18,1) 100%)
            `,
          }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <Link
          href={`/main/explore/work/${path.slug}/specialties`}
          className={[
            "inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition",
            shellSurface(dark),
            textSoft(dark),
            "hover:bg-white/[0.08]",
          ].join(" ")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to specialties
        </Link>

        <WorkPathSubnav pathSlug={path.slug} />

        <section
          className={[
            "rounded-[32px] px-6 py-8",
            shellSurface(dark),
            "shadow-[0_30px_120px_rgba(0,0,0,0.34)]",
          ].join(" ")}
        >
          <div className="max-w-3xl">
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
              Specialty
            </div>

            <h1
              className={`mt-3 text-4xl font-semibold tracking-tight sm:text-5xl ${textMain(
                dark
              )}`}
            >
              {specialty.title}
            </h1>

            <p className={`mt-4 text-lg leading-8 ${textSoft(dark)}`}>
              {specialty.summary}
            </p>
          </div>
        </section>

        {specialty.atmosphere ? (
          <section
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
              What this version feels like
            </div>

            <p className={`mt-3 text-sm leading-7 ${textSoft(dark)}`}>
              {specialty.atmosphere}
            </p>
          </section>
        ) : null}

        <section
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
            What you actually do
          </div>

          <div className="mt-4 space-y-3">
            {specialty.whatYouActuallyDo.map((item) => (
              <div
                key={item}
                className="rounded-[18px] border border-white/8 bg-white/[0.035] px-4 py-3"
              >
                <div className={`text-sm leading-6 ${textSoft(dark)}`}>{item}</div>
              </div>
            ))}
          </div>
        </section>

        <section
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
            What tends to grow in you here
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {specialty.skillsThatGrowHere.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-xs font-medium text-white/80"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section
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
            Small things to make or test
          </div>

          <p className={`mt-2 max-w-3xl text-sm leading-6 ${textSoft(dark)}`}>
            You do not have to build something huge to see whether this version of
            the path fits. Small proofs are enough.
          </p>

          <div className="mt-4 space-y-3">
            {specialty.starterProjects.map((project) => (
              <div
                key={project}
                className="rounded-[18px] border border-white/8 bg-white/[0.035] px-4 py-3"
              >
                <div className={`text-sm leading-6 ${textSoft(dark)}`}>{project}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}