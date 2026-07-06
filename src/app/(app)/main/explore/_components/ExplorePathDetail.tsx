// apps/web/src/app/(app)/main/explore/_components/ExplorePathDetail.tsx
//
// The ESSENTIALS screen for an Explore path (every lane). A short scroll: hero
// (with the personalized "why this fits you"), the open Why-it-fits card, then a
// menu of the deep sections. Each deep section is now its own drill-down screen
// (see ExplorePathSection + detailSections) instead of a stack of accordions —
// the founder's "deeper screens, not a mobile death-scroll".

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight, Loader2, Wand2 } from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import { ConstellationAnchor } from "../../components/ui/ConstellationAnchor";
import { laneAccent, type ExplorePath, type Rgb } from "../_data/exploreSchema";
import { LANE_NOUN, rgba } from "./exploreUi";
import { WhyFitsSection, getSectionMenu } from "./detailSections";
import { emitActionsChanged } from "@/lib/actionsBus";

function SectionMenu({ path, accent }: { path: ExplorePath; accent: Rgb }) {
  const items = getSectionMenu(path);
  if (!items.length) return null;
  return (
    <div className="space-y-2">
      {items.map((s) => (
        <Link
          key={s.key}
          href={`/main/explore/${path.lane}/${path.slug}/${s.key}`}
          className="group flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3.5 transition hover:bg-white/[0.04]"
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: rgba(accent, 0.9) }} />
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold tracking-[-0.01em] text-white">{s.title}</span>
            <span className="mt-0.5 block truncate text-[13px] leading-[1.5] text-white/55">{s.teaser}</span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-white/70" />
        </Link>
      ))}
    </div>
  );
}

export function ExplorePathDetail({
  path,
  whyYou = null,
}: {
  path: ExplorePath;
  // The user's personalized "why this fits you" from the Work match layer, if
  // any — overlaid on the hero. The rest of the page is shared catalog content.
  whyYou?: string | null;
}) {
  const accent = laneAccent(path);
  const ov = path.overview;
  const payMedian = path.trajectory?.salaryBand?.median;
  const laneLabel = path.lane[0].toUpperCase() + path.lane.slice(1);
  const hasWhyFits = Boolean(ov?.fitSignals?.length || ov?.whyItPullsYouIn?.length);
  const title = ov?.title ?? path.card.title;

  const router = useRouter();
  const [creating, setCreating] = React.useState(false);

  // Turn a path you're curious about straight into a runnable mission: create
  // (idempotent) an action for exploring it, then drop into its mission screen.
  const startMission = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const res = await fetch("/api/guidance/actions", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sourceType: "explore_path",
          sourceRef: `${path.lane}:${path.slug}`,
          lane: path.lane,
          title: `Explore ${title}`,
          description: `Get a first-hand feel for what ${title} is really like — from the inside.`,
        }),
      });
      const d = await res.json().catch(() => null);
      if (d?.ok && d.action?.id) {
        emitActionsChanged();
        router.push(`/main/actions/${d.action.id}`);
      } else {
        setCreating(false);
      }
    } catch {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-3 pb-24">
      <Link
        href={`/main/explore/${path.lane}`}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/55 transition hover:text-white/85"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to {laneLabel}</span>
      </Link>

      {/* Hero — compact: personalized why + who it fits + one concrete fact */}
      <SectionCard tone="hero" backdrop={<ConstellationAnchor seed={path.id} accent={accent} />}>
        <div className="max-w-2xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
            {ov?.eyebrow ?? LANE_NOUN[path.lane]}
          </div>
          <h1 className="mt-2 text-[27px] font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-[32px]">
            {ov?.title ?? path.card.title}
          </h1>
          {whyYou ? (
            <div
              className="mt-4 rounded-2xl border px-4 py-3"
              style={{ borderColor: rgba(accent, 0.28), backgroundColor: rgba(accent, 0.08) }}
            >
              <div
                className="text-[11px] font-semibold uppercase tracking-[0.16em]"
                style={{ color: rgba(accent, 0.92) }}
              >
                Why this fits you
              </div>
              <p className="mt-1 text-[15px] font-medium leading-[1.6] text-white/90">{whyYou}</p>
            </div>
          ) : null}
          {ov?.hook ? (
            <p className="mt-4 text-[15px] font-medium leading-[1.6] text-white/86">{ov.hook}</p>
          ) : null}
          {ov?.traitChips?.length || payMedian ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {(ov?.traitChips ?? []).slice(0, 4).map((c) => (
                <span
                  key={c.id}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[12.5px] text-white/78"
                >
                  {c.label}
                </span>
              ))}
              {payMedian ? (
                <span
                  className="rounded-full px-3 py-1 text-[12.5px] font-medium"
                  style={{ backgroundColor: rgba(accent, 0.14), color: rgba(accent, 0.95) }}
                >
                  Typically {payMedian}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </SectionCard>

      {/* Turn curiosity into doing — start a real mission to explore this path */}
      <button
        type="button"
        onClick={startMission}
        disabled={creating}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition hover:brightness-110 disabled:opacity-70"
        style={{ borderColor: rgba(accent, 0.35), backgroundColor: rgba(accent, 0.12) }}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: rgba(accent, 0.2), color: "#fff" }}
          >
            <Wand2 className="h-[18px] w-[18px]" />
          </span>
          <span className="min-w-0">
            <span className="block text-[15px] font-semibold text-white">Try this for real</span>
            <span className="mt-0.5 block text-[13px] leading-[1.45] text-white/72">
              Turn it into a mission — a few concrete steps to actually go explore it.
            </span>
          </span>
        </span>
        {creating ? (
          <Loader2 className="h-5 w-5 shrink-0 animate-spin text-white/85" />
        ) : (
          <ArrowRight className="h-5 w-5 shrink-0 text-white/85" />
        )}
      </button>

      {/* Why this could fit you — the essence, always open on essentials */}
      {hasWhyFits ? (
        <SectionCard tone="neutral">
          <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-white">Why this could fit you</h2>
          <div className="mt-3">
            <WhyFitsSection path={path} accent={accent} />
          </div>
        </SectionCard>
      ) : null}

      {/* Menu into the deep sections (each its own screen) */}
      <SectionMenu path={path} accent={accent} />
    </div>
  );
}

export default ExplorePathDetail;
