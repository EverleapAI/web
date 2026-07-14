// apps/web/src/app/(app)/main/explore/_components/ExploreSummaryCard.tsx
//
// The agentic "whole-life read" card at the top of the Explore Summary tab.
// POSTs the person's signals + strongest picks to guidance/explore-summary and
// renders the generated narrative (cached server-side; regenerated on change).

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import { ConstellationAnchor } from "../../components/ui/ConstellationAnchor";
import PromptLabTrigger from "@/components/promptLab/PromptLabTrigger";
import type { PromptLabAppliedPreview } from "@/components/promptLab/PromptLabModal";
import AgenticDetailModal from "@/components/ui/AgenticDetailModal";
import { LINK_CLASS, LINK_SIZE, PROSE_CLASS, PROSE_STYLE, TEXT_SECONDARY, leadRead } from "@/lib/ui/prose";

export type SummaryRequest = {
  firstName?: string | null;
  motivations?: string[];
  strengths?: string[];
  skills?: string[];
  freeText?: string;
  topPicks?: { lane: string; title: string; hook?: string; score?: number }[];
};

type Payload = { headline: string; body: string; threads: string[]; why?: string; more?: string };

const SUMMARY_ACCENT = "92,180,255";

export function ExploreSummaryCard({
  request,
  hasSignal,
  firstName,
}: {
  request: SummaryRequest;
  hasSignal: boolean;
  firstName: string | null;
}) {
  const [payload, setPayload] = React.useState<Payload | null>(null);
  const [loading, setLoading] = React.useState(hasSignal);
  const [failed, setFailed] = React.useState(false);
  const [preview, setPreview] = React.useState<PromptLabAppliedPreview | null>(null);
  const [moreOpen, setMoreOpen] = React.useState(false);
  const [whyOpen, setWhyOpen] = React.useState(false);

  // Prompt Lab preview (founder-only) overrides the generated narrative live.
  const resolvedHeadline = (preview?.result.headline as string | undefined) ?? payload?.headline;
  const resolvedBody = (preview?.result.body as string | undefined) ?? payload?.body;
  const resolvedThreads =
    (preview?.result.threads as string[] | undefined) ?? payload?.threads ?? [];
  const resolvedWhy = (preview?.result.why as string | undefined) ?? payload?.why;
  // The whole picture behind the trimmed read: an explicit `more`, else the full body.
  const resolvedMore = (preview?.result.more as string | undefined) ?? payload?.more ?? resolvedBody;
  const leadBody = leadRead(resolvedBody);
  const hasMore = Boolean((resolvedMore ?? "").trim() && (resolvedMore ?? "").trim() !== leadBody);

  // stable key so we only refetch when the meaningful inputs change
  const key = React.useMemo(
    () =>
      JSON.stringify({
        m: request.motivations,
        s: request.strengths,
        k: request.skills,
        t: (request.topPicks ?? []).map((p) => `${p.lane}:${p.title}`),
      }),
    [request]
  );

  React.useEffect(() => {
    if (!hasSignal) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setFailed(false);
    fetch("/api/guidance/explore-summary", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(request),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { ok?: boolean; payload?: Payload };
        if (data?.ok && data.payload) setPayload(data.payload);
        else throw new Error("no payload");
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [key, hasSignal]);

  return (
    <SectionCard
      tone="hero"
      backdrop={<ConstellationAnchor seed={firstName ?? "explore-summary"} accent={{ r: 92, g: 180, b: 255 }} />}
    >
      {hasSignal ? (
        <PromptLabTrigger
          dark
          pageKey="explore_summary"
          targetField="main"
          currentText={resolvedBody ?? ""}
          onApplied={setPreview}
          hasActivePreview={!!preview}
          onReset={() => setPreview(null)}
        />
      ) : null}
      <div className="relative max-w-2xl">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-4 w-4 items-center justify-center rounded-chip bg-cyan-300/12 text-cyan-200/75">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="text-micro font-semibold uppercase tracking-eyebrow text-white/44">
            Explore
          </span>
        </div>

        {!hasSignal ? (
          <>
            <h1 className="text-title font-semibold leading-display tracking-title text-ink-strong sm:text-title">
              {firstName ? `${firstName}, let's find your directions.` : "Let's find your directions."}
            </h1>
            <p className="mt-3 text-label leading-read text-white/74 sm:text-label">
              Explore turns your signal into real paths across five directions of a life — work,
              learning, world, impact, and play. Answer a few quick questions and this whole-life
              read sharpens.
            </p>
            <Link
              href="/main/questions?returnTo=/main/explore"
              className="group mt-4 inline-flex items-center gap-1.5 text-label font-medium text-white/82 transition hover:text-white"
            >
              <span>Start with a few quick questions</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </>
        ) : loading ? (
          <div className="animate-pulse">
            <div className="h-7 w-3/4 rounded-lg bg-white/10" />
            <div className="mt-4 space-y-2.5">
              <div className="h-3.5 w-full rounded bg-white/[0.07]" />
              <div className="h-3.5 w-[92%] rounded bg-white/[0.07]" />
              <div className="h-3.5 w-[85%] rounded bg-white/[0.07]" />
            </div>
            <p className="mt-4 text-meta text-white/40">Reading your signals…</p>
          </div>
        ) : payload || preview ? (
          <>
            <h1 className="text-title font-semibold leading-display tracking-title text-ink-strong sm:text-title">
              {resolvedHeadline}
            </h1>
            {/* The read, trimmed to Today's length — the whole picture is one tap away. */}
            <p className={`mt-3 text-read ${PROSE_CLASS}`} style={PROSE_STYLE}>
              {leadBody}
            </p>
            {(hasMore || resolvedWhy) ? (
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                {hasMore ? (
                  <button
                    type="button"
                    onClick={() => setMoreOpen(true)}
                    className={`${LINK_CLASS} ${LINK_SIZE}`}
                    style={{ color: TEXT_SECONDARY }}
                  >
                    See more
                    <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ) : null}
                {resolvedWhy ? (
                  <button
                    type="button"
                    onClick={() => setWhyOpen(true)}
                    className={`${LINK_CLASS} ${LINK_SIZE}`}
                    style={{ color: TEXT_SECONDARY }}
                  >
                    Why this
                  </button>
                ) : null}
              </div>
            ) : null}
            {resolvedThreads.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {resolvedThreads.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-micro font-medium text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <>
            <h1 className="text-title font-semibold leading-display tracking-title text-ink-strong sm:text-title">
              {firstName ? `${firstName}, here's your whole-life view.` : "Your whole-life view."}
            </h1>
            <p className="mt-3 text-label leading-read text-white/74 sm:text-label">
              {failed
                ? "Here are the directions worth a look right now — your personalized read will appear here shortly."
                : "Five directions a good life can grow in. Here's what's worth a look right now."}
            </p>
          </>
        )}
      </div>

      <AgenticDetailModal
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        eyebrow="The whole picture"
        body={resolvedMore ?? ""}
      />
      <AgenticDetailModal
        open={whyOpen}
        onClose={() => setWhyOpen(false)}
        eyebrow="Why this"
        body={resolvedWhy ?? ""}
        accentRgb={SUMMARY_ACCENT}
      />
    </SectionCard>
  );
}
