// apps/web/src/app/(app)/main/explore/work/[pathId]/specialties/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { requireWorkPath } from "../../_data/workPaths";
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

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      {/* background */}
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
        {/* back */}
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

        {/* subnav */}
        <WorkPathSubnav pathSlug={path.slug} />

        {/* hero */}
        <section
          className={[
            "relative overflow-hidden rounded-[32px] px-6 py-8",
            shellSurface(dark),
            "shadow-[0_30px_120px_rgba(0,0,0,0.34)]",
          ].join(" ")}
        >
          <div className="max-w-3xl">
            <div className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${textFaint(dark)}`}>
              Specialties
            </div>

            <h1 className={`mt-3 text-4xl font-semibold tracking-tight sm:text-5xl ${textMain(dark)}`}>
              Different branches of this path
            </h1>

            <p className={`mt-4 text-lg leading-8 ${textSoft(dark)}`}>
              Game design is not one single job. People who enter this world
              often discover different directions depending on whether they
              love systems, environments, or story.
            </p>
          </div>
        </section>

        {/* specialties */}
        <section className="grid gap-4 lg:grid-cols-3">
          {path.specialties.map((specialty) => (
            <div
              key={specialty.id}
              className={[
                "rounded-[26px] px-5 py-5",
                shellSurface(dark),
                "transition hover:bg-white/[0.08]",
              ].join(" ")}
            >
              <div className={`text-xl font-semibold ${textMain(dark)}`}>
                {specialty.title}
              </div>

              <p className={`mt-2 text-sm leading-6 ${textSoft(dark)}`}>
                {specialty.summary}
              </p>

              <div className="mt-4 space-y-1">
                {specialty.skillsThatGrowHere.slice(0, 3).map((skill) => (
                  <div
                    key={skill}
                    className="inline-flex items-center rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-xs font-medium text-white/75 mr-2"
                  >
                    {skill}
                  </div>
                ))}
              </div>

              <Link
                href={`/main/explore/work/${path.slug}/specialties/${specialty.slug}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"
              >
                Explore specialty
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}