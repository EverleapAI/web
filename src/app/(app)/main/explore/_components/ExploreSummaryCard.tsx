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

export type SummaryRequest = {
  firstName?: string | null;
  motivations?: string[];
  strengths?: string[];
  skills?: string[];
  freeText?: string;
  topPicks?: { lane: string; title: string; hook?: string; score?: number }[];
};

type Payload = { headline: string; body: string; threads: string[] };

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

  // Prompt Lab preview (founder-only) overrides the generated narrative live.
  const resolvedHeadline = (preview?.result.headline as string | undefined) ?? payload?.headline;
  const resolvedBody = (preview?.result.body as string | undefined) ?? payload?.body;
  const resolvedThreads =
    (preview?.result.threads as string[] | undefined) ?? payload?.threads ?? [];

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
    <SectionCard tone="hero">
      <ConstellationAnchor seed={firstName ?? "explore-summary"} accent={{ r: 92, g: 180, b: 255 }} />
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
          <span className="flex h-4 w-4 items-center justify-center rounded-[5px] bg-cyan-300/12 text-cyan-200/75">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/44">
            Explore
          </span>
        </div>

        {!hasSignal ? (
          <>
            <h1 className="text-[24px] font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-[28px]">
              {firstName ? `${firstName}, let's find your directions.` : "Let's find your directions."}
            </h1>
            <p className="mt-3 text-[14px] leading-[1.66] text-white/74 sm:text-[15px]">
              Explore turns your signal into real paths across five directions of a life — work,
              learning, world, impact, and play. Answer a few quick questions and this whole-life
              read sharpens.
            </p>
            <Link
              href="/main/questions?returnTo=/main/explore"
              className="group mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-white/82 transition hover:text-white"
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
            <p className="mt-4 text-[12.5px] text-white/40">Reading your signals…</p>
          </div>
        ) : payload || preview ? (
          <>
            <h1 className="text-[23px] font-semibold leading-[1.12] tracking-[-0.03em] text-white sm:text-[27px]">
              {resolvedHeadline}
            </h1>
            <div className="mt-3 space-y-3">
              {(resolvedBody ?? "").split(/\n\s*\n/).map((para, i) => (
                <p key={i} className="text-[14px] leading-[1.7] text-white/76 sm:text-[15px]">
                  {para}
                </p>
              ))}
            </div>
            {resolvedThreads.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {resolvedThreads.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11.5px] font-medium text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <>
            <h1 className="text-[23px] font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-[27px]">
              {firstName ? `${firstName}, here's your whole-life view.` : "Your whole-life view."}
            </h1>
            <p className="mt-3 text-[14px] leading-[1.66] text-white/74 sm:text-[15px]">
              {failed
                ? "Here are the directions worth a look right now — your personalized read will appear here shortly."
                : "Five directions a good life can grow in. Here's what's worth a look right now."}
            </p>
          </>
        )}
      </div>
    </SectionCard>
  );
}
