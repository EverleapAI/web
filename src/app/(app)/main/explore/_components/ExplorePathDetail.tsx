// apps/web/src/app/(app)/main/explore/_components/ExplorePathDetail.tsx
//
// The SMALL career page (every lane's path landing). Deliberately compact and
// readable — it answers one question, "is this me?", and then points DOWN. Three
// things only: an agentic entry (why THIS path, for YOU), the achievements strip,
// and the "why it's good for you" read. Then two doors: try it for real (a real-
// world mission — the whole point) and "go deeper" into the path's constellation
// of sections. The old wall (O*NET data dump, every section expanded) is gone —
// that content now lives one level down, where the user has opted in.

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight, Compass, Loader2, Sparkles, Wand2 } from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import { ConstellationAnchor } from "../../components/ui/ConstellationAnchor";
import { AgenticHeader } from "../../components/ui/AgenticHeader";
import { AwardsMeter } from "@/app/(app)/main/components/achievements/AwardsMeter";
import { useBadgeStats } from "@/lib/achievements/useBadgeStats";
import { laneAccent, type ExplorePath, type Rgb } from "../_data/exploreSchema";
import { LANE_NOUN, rgba } from "./exploreUi";
import { WhyFitsSection, getSectionMenu } from "./detailSections";
import { ExploreAttribution } from "./ExploreAttribution";
import type { OnetDetail } from "./OnetFacts";
import { emitActionsChanged } from "@/lib/actionsBus";
import { CardTitle, RowMeta, RowTitle } from "@/lib/ui/card";

function GoDeeper({ path, accent }: { path: ExplorePath; accent: Rgb }) {
  const items = getSectionMenu(path);
  if (!items.length) return null;
  const accentStr = `${accent.r}, ${accent.g}, ${accent.b}`;
  return (
    <SectionCard tone="neutral">
      <div className="mb-3 flex items-center gap-2">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-control"
          style={{ background: rgba(accent, 0.14), color: rgba(accent, 0.98) }}
        >
          <Compass className="h-4 w-4" />
        </span>
        <CardTitle as="h2">Go deeper</CardTitle>
      </div>
      <p className="mb-3 text-meta leading-read text-white/55">
        The real day, where it leads, and ways to actually try it — each its own place to explore.
      </p>
      <div className="space-y-2">
        {items.map((s) => (
          <Link
            key={s.key}
            href={`/main/explore/${path.lane}/${path.slug}/${s.key}`}
            className="group flex items-center gap-3 rounded-2xl border px-4 py-3.5 transition hover:brightness-110"
            style={{ borderColor: `rgba(${accentStr},0.2)`, background: `rgba(${accentStr},0.06)` }}
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: rgba(accent, 0.9) }} />
            <span className="min-w-0 flex-1">
              <RowTitle className="block">{s.title}</RowTitle>
              <RowMeta className="mt-0.5 block truncate">{s.teaser}</RowMeta>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-white/70" />
          </Link>
        ))}
      </div>
    </SectionCard>
  );
}

export function ExplorePathDetail({
  path,
  whyYou = null,
  onet = null,
}: {
  path: ExplorePath;
  // The user's personalized "why this fits you" from the Work match layer, if
  // any — the heart of this page's read. Catalog content fills the rest.
  whyYou?: string | null;
  // O*NET facts now render one level down (the "Where it leads" section), not on
  // this landing — kept in the signature for the loader's call shape.
  onet?: OnetDetail | null;
}) {
  void onet;
  const accent = laneAccent(path);
  const accentStr = `${accent.r}, ${accent.g}, ${accent.b}`;
  const ov = path.overview;
  const payMedian = path.trajectory?.salaryBand?.median;
  const laneLabel = path.lane[0].toUpperCase() + path.lane.slice(1);
  const hasWhyFits = Boolean(ov?.fitSignals?.length || ov?.whyItPullsYouIn?.length);
  const title = ov?.title ?? path.card.title;
  const badges = useBadgeStats();

  const router = useRouter();
  const [creating, setCreating] = React.useState(false);

  // Turn a path you're curious about straight into a runnable mission — the
  // real-world action this whole page exists to drive.
  const startMission = async () => {
    if (creating) return;
    setCreating(true);
    const returnTo =
      typeof window !== "undefined" ? window.location.pathname + window.location.search : "";
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
        router.push(
          `/main/actions/${d.action.id}${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`
        );
      } else {
        setCreating(false);
      }
    } catch {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      <Link
        href={`/main/explore/${path.lane}`}
        className="inline-flex items-center gap-1.5 text-meta font-medium text-white/55 transition hover:text-white/85"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to {laneLabel}</span>
      </Link>

      {/* Agentic entry — why THIS path, for YOU, in one read. */}
      <SectionCard tone="hero" voice backdrop={<ConstellationAnchor seed={path.id} accent={accent} />}>
        <div className="relative max-w-2xl">
          <AgenticHeader
            glyph={
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-control"
                style={{ background: `rgba(${accentStr},0.12)`, color: `rgba(${accentStr},0.9)` }}
              >
                <Sparkles className="h-3.5 w-3.5" />
              </span>
            }
            eyebrow={`${laneLabel} · ${ov?.eyebrow ?? LANE_NOUN[path.lane]}`}
            accentRgb={accentStr}
          />
          <h1 className="mt-1 text-title font-semibold leading-display tracking-title text-ink-strong sm:text-display">
            {title}
          </h1>
          {whyYou ? (
            <p className="mt-3 text-read leading-read text-white/82">{whyYou}</p>
          ) : ov?.hook ? (
            <p className="mt-3 text-read leading-read text-white/82">{ov.hook}</p>
          ) : null}

          {ov?.traitChips?.length || payMedian ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {(ov?.traitChips ?? []).slice(0, 4).map((c) => (
                <span
                  key={c.id}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-meta text-white/78"
                >
                  {c.label}
                </span>
              ))}
              {payMedian ? (
                <span
                  className="rounded-full px-3 py-1 text-meta font-medium"
                  style={{ backgroundColor: `rgba(${accentStr},0.14)`, color: `rgba(${accentStr},0.95)` }}
                >
                  Typically {payMedian}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </SectionCard>

      {/* Achievements — the trophies strip into Awards. */}
      <AwardsMeter stats={badges} />

      {/* Why it's good for you — the fit read (signals + what pulls people in). */}
      {hasWhyFits ? (
        <SectionCard tone="neutral">
          <CardTitle as="h2">Why it&rsquo;s good for you</CardTitle>
          <div className="mt-3">
            <WhyFitsSection path={path} accent={accent} />
          </div>
        </SectionCard>
      ) : null}

      {/* The real-world door — turn it into a mission you actually go do. */}
      <button
        type="button"
        onClick={startMission}
        disabled={creating}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition hover:brightness-110 disabled:opacity-70"
        style={{ borderColor: `rgba(${accentStr},0.5)`, background: `linear-gradient(180deg, rgba(${accentStr},0.20), rgba(${accentStr},0.10))` }}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `rgba(${accentStr},0.24)`, color: "#fff" }}
          >
            <Wand2 className="h-[18px] w-[18px]" />
          </span>
          <span className="min-w-0">
            <RowTitle className="block">Try this for real</RowTitle>
            <RowMeta className="mt-0.5 block">
              Turn it into a mission — a few concrete steps to actually go explore it.
            </RowMeta>
          </span>
        </span>
        {creating ? (
          <Loader2 className="h-5 w-5 shrink-0 animate-spin text-white/85" />
        ) : (
          <ArrowRight className="h-5 w-5 shrink-0 text-white/85" />
        )}
      </button>

      {/* The door down — into the path's deeper sections (the constellation). */}
      <GoDeeper path={path} accent={accent} />

      {/* Source citations + required O*NET/DOL attribution */}
      <ExploreAttribution path={path} />
    </div>
  );
}

export default ExplorePathDetail;
