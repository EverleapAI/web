// apps/web/src/app/(app)/main/explore/work/[pathId]/next-steps/page.tsx

"use client";

import * as React from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Compass,
  MapPin,
  Monitor,
  Sparkles,
} from "lucide-react";

import { requireWorkPath } from "../../_data/workPaths";

/* =============================================================================
   Types
============================================================================= */

type OpportunityItem = {
  id: string;
  href: string;
  title: string;
  note: string;
  badge?: string | null;
};

type OpportunitySection = {
  id: string;
  mode: "local" | "remote";
  eyebrow: string;
  title: string;
  description: string;
  items: OpportunityItem[];
};

/* =============================================================================
   Helpers
============================================================================= */

function normalizeParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function sectionIcon(mode: "local" | "remote") {
  return mode === "local" ? (
    <MapPin className="h-4 w-4" />
  ) : (
    <Monitor className="h-4 w-4" />
  );
}

/* =============================================================================
   UI
============================================================================= */

function OpportunitySectionBlock({ section }: { section: OpportunitySection }) {
  return (
    <section className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-2xl border border-white/10 bg-white/8 p-2 text-white/86">
          {sectionIcon(section.mode)}
        </div>

        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100/72">
            {section.eyebrow}
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-white">
            {section.title}
          </h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-7 text-white/72">
            {section.description}
          </p>
        </div>
      </div>

      <div className="divide-y divide-white/8 rounded-[28px] border border-white/10 bg-white/[0.04] px-4 sm:px-5">
        {section.items.map((item: OpportunityItem) => (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-4 py-4 transition first:pt-4 last:pb-4 hover:bg-white/[0.02]"
          >
            <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.55)]" />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[15px] font-semibold text-white transition group-hover:text-cyan-100">
                  {item.title}
                </h3>

                {item.badge ? (
                  <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/58">
                    {item.badge}
                  </span>
                ) : null}
              </div>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/72">
                {item.note}
              </p>
            </div>

            <div className="mt-1 shrink-0 text-white/42 transition group-hover:translate-x-0.5 group-hover:text-white">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* =============================================================================
   Page
============================================================================= */

export default function WorkNextStepsPage() {
  const router = useRouter();
  const params = useParams();
  const pathId = normalizeParam(params?.pathId);

  if (!pathId) notFound();

  const workPath = requireWorkPath(pathId);
  const nextStepsV2 = workPath.nextStepsV2;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(87,83,255,0.18),_transparent_30%),radial-gradient(circle_at_20%_32%,_rgba(56,189,248,0.12),_transparent_28%),radial-gradient(circle_at_80%_22%,_rgba(244,114,182,0.1),_transparent_24%),linear-gradient(180deg,_#0a1222_0%,_#07111f_42%,_#050b16_100%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-2 text-sm text-white/86"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <section className="rounded-[32px] border border-white/12 bg-white/[0.05] px-6 py-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs text-cyan-100/70">
                <Compass className="h-4 w-4" />
                Next steps
              </div>

              <h1 className="mt-4 text-3xl font-semibold text-white">
                {nextStepsV2?.heroTitle ||
                  `There are real ways into ${workPath.card.title} right now`}
              </h1>

              <p className="mt-4 text-white/80">
                {nextStepsV2?.heroSummary ||
                  "You don’t need to wait. You can start now."}
              </p>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-sm">
                <Sparkles className="h-4 w-4 text-cyan-200" />
                {nextStepsV2?.heroBadge || "Start now"}
              </div>
            </div>
          </div>
        </section>

        {nextStepsV2 ? (
          <div className="space-y-10">
            {nextStepsV2.sections.map((section: OpportunitySection) => (
              <OpportunitySectionBlock key={section.id} section={section} />
            ))}
          </div>
        ) : (
          <div className="text-white/60">
            This path doesn’t have live opportunities yet.
          </div>
        )}
      </div>
    </main>
  );
}