"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Clock3, Sparkles, ArrowRight } from "lucide-react";

import { useGeneratedInsights } from "../hooks/useGeneratedInsights";
import AgenticDetailModal from "@/components/ui/AgenticDetailModal";
import { CardTitle } from "@/lib/ui/card";
import { LINK_CLASS, LINK_SIZE, PROSE_CLASS, PROSE_SIZE, PROSE_STYLE, TEXT_SECONDARY } from "@/lib/ui/prose";
import { sectionCard } from "./sections/summaryShared";
import { SectionCard } from "../../components/ui/SectionCard";
import { AgenticHeader } from "../../components/ui/AgenticHeader";
import { ReadAtmosphere } from "../../components/ui/ReadAtmosphere";
import { AwardsMeter } from "@/app/(app)/main/components/achievements/AwardsMeter";
import { useBadgeStats } from "@/lib/achievements/useBadgeStats";
import InsightsBackLink from "./sections/InsightsBackLink";
import InsightsUnlockCTA from "./sections/InsightsUnlockCTA";
import InsightsTinyTaskCard from "./sections/InsightsTinyTaskCard";

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

// Any open Story question (Fun Facts draws from every category, so it isn't
// category-specific) — the Story page serves the next unanswered one.
const STORY_HREF =
  "/main/story?returnTo=" + encodeURIComponent("/main/insights?tab=funFacts");

// A real library portrait used as the callout's TEASER image (unnamed) when the
// user's own Time Twin isn't built yet — so the premium card always shows a face.
const SAMPLE_TWIN_SLUG = "ada-lovelace";

/* =============================================================================
   Helpers
   ============================================================================= */

function sectionKicker(dark: boolean) {
  return ["text-meta font-semibold uppercase tracking-eyebrow", dark ? "text-white/50" : "text-slate-600"].join(" ");
}

function cleanOneLine(s: string) {
  return (s ?? "").replace(/\s+/g, " ").trim();
}

function pickTopTerms(items: WordCloudItem[] | undefined, max = 3) {
  const list = Array.isArray(items) ? items : [];
  return [...list]
    .sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))
    .map((x) => cleanOneLine(x.term))
    .filter(Boolean)
    .slice(0, max);
}

// One voice, one paragraph — the opener and the read spoken as a single line.
function joinRead(a: string, b: string) {
  const h = a.trim();
  const l = b.trim();
  if (!h) return l;
  if (!l) return h;
  return `${h}${/[.!?…]$/.test(h) ? " " : ". "}${l}`;
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
                    color: `rgba(${accent}, 1)`,
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
  const { dark, nameFromHeadline, wordCloudDisplay } = props;
  const router = useRouter();
  const badges = useBadgeStats();

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

  // Are there any open Story questions left (in any category)? Drives the
  // "answer more" tentative card.
  const [storyOpen, setStoryOpen] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/story/next")
      .then((r) => r.json())
      .then((d: { ok?: boolean; done?: boolean }) => {
        if (!cancelled) setStoryOpen(d?.ok ? d.done === false : null);
      })
      .catch(() => {
        if (!cancelled) setStoryOpen(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const twinImageUrl = figureImageUrl(timeTwinPayload?.primary?.imageSlug);
  // Own portrait once the twin is built; otherwise a sample so the premium
  // callout always shows a real face.
  const portraitUrl = twinImageUrl || figureImageUrl(SAMPLE_TWIN_SLUG);
  const [portraitFailed, setPortraitFailed] = React.useState(false);
  React.useEffect(() => setPortraitFailed(false), [portraitUrl]);

  // Agentic entry (one paragraph), in Fun Facts' fuchsia voice.
  const who = cleanOneLine(nameFromHeadline ?? "");
  const openLine = who
    ? `A lighter mirror for ${who} — still grounded in how you move through the world.`
    : "A lighter mirror — still grounded in how you move through the world.";
  const topTerms = pickTopTerms(wordCloudDisplay, 3);
  const delightPara =
    topTerms.length >= 2
      ? `Small things I've noticed — like why ${topTerms[0]} keeps surfacing, or how it sits next to ${topTerms[1]}. Low stakes, just interesting.`
      : "Small things I've noticed about how you think — low stakes, just interesting.";

  return (
    <section className="mb-6 space-y-4">
      <InsightsBackLink />

      {/* Agentic entry — one flowing paragraph, matching the other tabs. */}
      <SectionCard
        tone="hero"
        voice
        className="!px-5 !py-4"
        backdrop={<ReadAtmosphere seed="fun-facts" accent={{ r: 232, g: 121, b: 249 }} />}
      >
        <div className="relative">
          <AgenticHeader
            glyph={
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-control bg-fuchsia-300/[0.08] text-fuchsia-200/75 ring-1 ring-fuchsia-300/[0.18]">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
            }
            eyebrow="Fun facts"
            accentRgb="232, 121, 249"
          />
          <p className={[PROSE_SIZE, PROSE_CLASS].join(" ")} style={PROSE_STYLE}>
            {joinRead(openLine, delightPara)}
          </p>
        </div>
      </SectionCard>

      {/* Trophies — the same AwardsMeter, a door to achievements. */}
      <AwardsMeter stats={badges} />

      {/* Tentative "answer more" card — Fun Facts sharpen as you answer more of
          any category; only shown while there are open Story questions. */}
      {storyOpen === true ? (
        <InsightsUnlockCTA variant="funfacts" dark={dark} href={STORY_HREF} />
      ) : null}

      {/* Time Twin — the premium feature, given a bigger, colourful callout: a
          framed REAL portrait (deliberately unnamed — the reveal is inside), with
          a violet accent border, halo and gradient, matching the updated card
          family. It should read as the standout on the page. */}
      <button
        type="button"
        onClick={() => router.push("/main/insights/fun-facts/time-twin")}
        className="group relative w-full overflow-hidden rounded-card border p-5 text-left transition hover:brightness-110 active:scale-[0.99]"
        style={{
          borderColor: "rgba(167,139,250,0.45)",
          background:
            "linear-gradient(180deg, rgba(167,139,250,0.14), rgba(255,255,255,0.02)), linear-gradient(180deg, rgb(14,18,31) 0%, rgb(8,12,26) 60%, rgb(4,8,20) 100%)",
          boxShadow: "inset 0 0 0 1px rgba(167,139,250,0.10), 0 18px 46px rgba(0,0,0,0.42)",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(240px 160px at 92% 0%, rgba(167,139,250,0.30), transparent 70%)" }}
        />
        <div className="relative flex items-center gap-4">
          {/* A real Time Twin portrait — shown, but not named. */}
          <span
            className="relative shrink-0 rounded-2xl p-1.5"
            style={{
              border: "1.5px solid rgba(167,139,250,0.5)",
              background: "rgba(167,139,250,0.08)",
              boxShadow: "0 0 30px rgba(167,139,250,0.25)",
            }}
          >
            {portraitUrl && !portraitFailed ? (
              <img
                src={portraitUrl}
                alt="A Time Twin portrait"
                onError={() => setPortraitFailed(true)}
                className="h-20 w-20 rounded-xl object-cover"
              />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/5">
                <Clock3 className="h-7 w-7 text-violet-200/85" />
              </span>
            )}
          </span>

          <div className="min-w-0">
            <div
              className="mb-1 text-micro font-semibold uppercase tracking-eyebrow"
              style={{ color: "rgba(167,139,250,0.95)" }}
            >
              Featured · Time Twin
            </div>
            <CardTitle as="h3">A mind from history that rhymes with yours.</CardTitle>
            <p className="mt-1 text-meta leading-body text-white/60">
              A real historical figure whose way of seeing overlaps with yours — meet them.
            </p>
            <span
              className="mt-2.5 inline-flex items-center gap-1.5 text-label font-semibold"
              style={{ color: "rgba(167,139,250,0.98)" }}
            >
              Meet your Time Twin
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
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

      {/* What I was wondering — the same Tiny Task card the other tabs carry. */}
      <InsightsTinyTaskCard
        dark={dark}
        tasks={wonderTasks}
        hasStrongSignal={wonderTasks.length > 0}
      />
    </section>
  );
}
