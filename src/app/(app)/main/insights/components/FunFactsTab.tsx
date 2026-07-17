"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Clock3, Sparkles } from "lucide-react";

import { useGeneratedInsights } from "../hooks/useGeneratedInsights";
import AgenticDetailModal from "@/components/ui/AgenticDetailModal";
import { CardTitle, RowMeta } from "@/lib/ui/card";
import { LINK_CLASS, LINK_SIZE, TEXT_SECONDARY } from "@/lib/ui/prose";
import { sectionCard } from "./sections/summaryShared";
import InsightsBackLink from "./sections/InsightsBackLink";
import InsightsTinyTaskCard from "./sections/InsightsTinyTaskCard";
import InsightsQuickCheckCard from "./sections/InsightsQuickCheckCard";

/* =============================================================================
   Types
   ============================================================================= */

type WordCloudItem = { term: string; weight: number };

type FunFactsTabProps = {
  dark: boolean;
  mounted: boolean;
  tab: string;
  nameFromHeadline?: string;
  wordCloudDisplay?: WordCloudItem[];
};

type TimeTwinTeaserPayload = {
  primary?: { name?: string; tagline?: string; imageSlug?: string };
};

function figureImageUrl(slug?: string): string {
  return slug ? `/api/guidance/time-twin-figure-image?slug=${encodeURIComponent(slug)}` : "";
}

type FunFactPayload = {
  observation: string;
  why: string;
  domains: string[];
  emoji?: string;
  more?: string;
};

// A small rotating palette so the feed reads like a set of colorful notes
// rather than a stack of identical grey cards.
const FACT_ACCENTS = [
  "245, 176, 90", // amber
  "64, 210, 190", // teal
  "160, 130, 255", // violet
  "236, 120, 165", // rose
  "96, 176, 255", // sky
] as const;

type FunFactsFeedPayload = {
  facts?: FunFactPayload[];
};

/* =============================================================================
   Style helpers
   ============================================================================= */

function sectionKicker(dark: boolean) {
  return ["text-meta font-semibold uppercase tracking-eyebrow", dark ? "text-white/50" : "text-slate-600"].join(" ");
}

/* =============================================================================
   Fun fact card
   ============================================================================= */

function FunFactCard({
  fact,
  dark,
  index,
}: {
  fact: FunFactPayload;
  dark: boolean;
  index: number;
}) {
  const accent = FACT_ACCENTS[index % FACT_ACCENTS.length];
  const emoji = fact.emoji || "✨";
  const [moreOpen, setMoreOpen] = React.useState(false);
  const [whyOpen, setWhyOpen] = React.useState(false);

  return (
    <div className={[sectionCard(dark), "px-4 py-4 md:px-5 md:py-5"].join(" ")}>
      {/* Corner accent halo — same treatment as the motivator cards, so the
          deeper cards read as one colorful family. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(150px 104px at 90% 0%, rgba(${accent}, 0.16), transparent 70%)` }}
      />
      <div className="relative flex items-start gap-3">
        <div
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-read leading-none"
          style={{
            background: `rgba(${accent}, ${dark ? 0.16 : 0.18})`,
            boxShadow: `inset 0 0 0 1px rgba(${accent}, 0.3)`,
          }}
          aria-hidden
        >
          {emoji}
        </div>

        <div className="min-w-0 flex-1">
          {fact.domains.length > 0 ? (
            <div className="mb-1.5 flex flex-wrap gap-1.5">
              {fact.domains.map((domain, i) => (
                <span
                  key={i}
                  className="rounded-full px-2 py-0.5 text-micro font-semibold uppercase tracking-eyebrow"
                  style={{
                    background: `rgba(${accent}, ${dark ? 0.16 : 0.14})`,
                    color: dark ? `rgba(${accent}, 1)` : `rgba(${accent}, 1)`,
                  }}
                >
                  {domain}
                </span>
              ))}
            </div>
          ) : null}

          <CardTitle>{fact.observation}</CardTitle>
        </div>
      </div>

      {/* Read (observation) above; the why + whole picture are one tap away,
          matching the Today pattern. */}
      <div className="relative mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        {fact.more ? (
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={`${LINK_CLASS} ${LINK_SIZE}`}
            style={{ color: TEXT_SECONDARY }}
          >
            See more
          </button>
        ) : null}
        {fact.why ? (
          <button
            type="button"
            onClick={() => setWhyOpen(true)}
            className={`${LINK_CLASS} ${LINK_SIZE}`}
            style={{ color: TEXT_SECONDARY }}
          >
            Why
          </button>
        ) : null}
      </div>

      <AgenticDetailModal
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        eyebrow="The whole picture"
        body={fact.more ?? ""}
      />
      <AgenticDetailModal
        open={whyOpen}
        onClose={() => setWhyOpen(false)}
        eyebrow="Why this"
        body={fact.why ?? ""}
        accentRgb={accent}
      />
    </div>
  );
}

/* =============================================================================
   Component
   ============================================================================= */

export default function FunFactsTab(props: FunFactsTabProps) {
  const { dark } = props;
  const router = useRouter();

  const { payload: timeTwinPayload } = useGeneratedInsights<TimeTwinTeaserPayload>(
    "/api/guidance/insights-time-twin"
  );
  const {
    payload: funFactsPayload,
    tinyTasks,
    fetchDone: funFactsDone,
  } = useGeneratedInsights<FunFactsFeedPayload>("/api/guidance/insights-fun-facts");

  const facts = React.useMemo(() => funFactsPayload?.facts ?? [], [funFactsPayload]);
  const wonderTasks = tinyTasks ?? [];

  const twinImageUrl = figureImageUrl(timeTwinPayload?.primary?.imageSlug);

  const timeTwinTeaser =
    timeTwinPayload?.primary?.name && timeTwinPayload?.primary?.tagline
      ? `Right now: ${timeTwinPayload.primary.name} — ${timeTwinPayload.primary.tagline}`
      : "A biography-style mirror — a mind from another era that rhymes with yours.";

  return (
    <section className="mb-6 space-y-4">
      <InsightsBackLink />

      {/* Time Twin — hero card, on Today's card surface (accent lives only in the
          portrait ring + the "Featured" pill, never on the shell). */}
      <button
        type="button"
        onClick={() => router.push("/main/insights/fun-facts/time-twin")}
        className={[
          sectionCard(dark),
          "w-full text-left px-4 py-4 md:px-5 md:py-5",
          "transition hover:brightness-110 active:scale-[0.99]",
        ].join(" ")}
      >
        <div className="relative flex items-start gap-3">
          {twinImageUrl ? (
            <img
              src={twinImageUrl}
              alt={timeTwinPayload?.primary?.name ? `Portrait of ${timeTwinPayload.primary.name}` : "Time Twin portrait"}
              className={[
                "mt-0.5 h-11 w-11 flex-shrink-0 rounded-full border object-cover",
                dark ? "border-white/12" : "border-black/10",
              ].join(" ")}
            />
          ) : (
            <div
              className={[
                "mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full border",
                dark ? "border-white/10 bg-white/6" : "border-black/10 bg-white",
              ].join(" ")}
              aria-hidden
            >
              <Clock3 className={["h-5 w-5", dark ? "text-violet-200/85" : "text-violet-700/80"].join(" ")} />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle as="span">Time Twin</CardTitle>
              <span
                className={[
                  "rounded-full px-2 py-0.5 text-micro font-semibold uppercase tracking-eyebrow",
                  dark ? "bg-violet-300/12 text-violet-100/80" : "bg-violet-500/10 text-violet-700",
                ].join(" ")}
              >
                Featured
              </span>
            </div>

            <RowMeta as="div" className="mt-1">
              {timeTwinTeaser}
            </RowMeta>

            <div
              className={[
                "mt-2 inline-flex items-center gap-2 text-label font-semibold",
                dark ? "text-white/70" : "text-slate-700",
              ].join(" ")}
            >
              Open story <span aria-hidden className="opacity-80">↗</span>
            </div>
          </div>
        </div>
      </button>

      {/* Fun things to know */}
      {facts.length > 0 ? (
        <div className="space-y-3">
          <div className={[sectionKicker(dark), "flex items-center gap-2 px-1"].join(" ")}>
            <Sparkles className="h-3.5 w-3.5" />
            Fun things to know about yourself
          </div>
          {facts.map((fact, index) => (
            <FunFactCard key={index} fact={fact} dark={dark} index={index} />
          ))}
        </div>
      ) : (
        <div
          className={[
            sectionCard(dark),
            "px-4 py-4 text-meta leading-relaxed",
            dark ? "text-white/55" : "text-slate-600",
          ].join(" ")}
        >
          {funFactsDone
            ? "I'm still noticing — a few more Story answers and small observations will start showing up here."
            : "Looking for interesting patterns…"}
        </div>
      )}

      {/* What I was wondering — the same Tiny Task card the other tabs carry.
          Populates once Fun Facts starts generating its own tiny tasks; until
          then it shows the shared teaser, like every other tab with thin signal. */}
      <InsightsTinyTaskCard
        dark={dark}
        tasks={wonderTasks}
        hasStrongSignal={wonderTasks.length > 0}
      />

      {/* Quick check */}
      <InsightsQuickCheckCard dark={dark} contextTag="insights:funFacts" pageKey="insights_fun_facts" />
    </section>
  );
}
