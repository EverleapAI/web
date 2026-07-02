"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Clock3 } from "lucide-react";

import { useGeneratedInsights } from "../hooks/useGeneratedInsights";

/* =============================================================================
   Types
   ============================================================================= */

type WordCloudItem = { term: string; weight: number };

type FunFactsTabProps = {
  dark: boolean;
  mounted: boolean;
  tab: string; // kept for parity with other tabs; useful for analytics later
  nameFromHeadline?: string;
  // Optional: pass themes so we can generate playful-but-grounded copy.
  // This keeps the component robust even if you don't provide anything.
  wordCloudDisplay?: WordCloudItem[];
};

/* =============================================================================
   Local UI helpers (mirrors page.tsx styling, but self-contained)
   ============================================================================= */

function cleanOneLine(s: string) {
  return (s ?? "").replace(/\s+/g, " ").trim();
}

function subtleDivider(dark: boolean) {
  return dark ? "bg-white/10" : "bg-black/10";
}

function readingSurface(dark: boolean) {
  return [
    "relative overflow-hidden rounded-[28px] border",
    "px-4 py-5 md:px-6 md:py-6",
    "backdrop-blur-xl",
    dark ? "border-white/10 bg-slate-950/20" : "border-black/10 bg-white/80",
    "shadow-[0_18px_55px_rgba(0,0,0,0.22)]",
  ].join(" ");
}

function sectionKicker(dark: boolean) {
  return ["text-[12px] font-semibold uppercase tracking-[0.16em]", dark ? "text-white/50" : "text-slate-600"].join(
    " "
  );
}

function sectionTitle(dark: boolean) {
  return dark ? "text-white" : "text-slate-900";
}

function bodyText(dark: boolean) {
  return dark ? "text-slate-200/90" : "text-slate-700";
}

function mutedText(dark: boolean) {
  return dark ? "text-white/65" : "text-slate-600";
}

/* =============================================================================
   Lightweight "delight" copy (safe fallbacks)
   ============================================================================= */

function pickTopTerms(items: WordCloudItem[] | undefined, max = 3) {
  const list = Array.isArray(items) ? items : [];
  const sorted = [...list].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
  return sorted
    .map((x) => cleanOneLine(x.term))
    .filter(Boolean)
    .slice(0, max);
}

function buildOpenLine(nameFromHeadline?: string) {
  const who = cleanOneLine(nameFromHeadline ?? "");
  if (!who) return "A lighter mirror — still grounded in how you move through the world.";
  return `A lighter mirror for ${who} — still grounded in how you move through the world.`;
}

function buildDelightPara(topTerms: string[]) {
  if (topTerms.length >= 2) {
    return `This is the “delight” layer — small reflections that help you see yourself from a new angle. Like: why ${topTerms[0]} keeps showing up, or why ${topTerms[1]} feels like a magnet for your attention.`;
  }
  if (topTerms.length === 1) {
    return `This is the “delight” layer — small reflections that help you see yourself from a new angle. If I had to guess, "${topTerms[0]}" is one of your recurring threads.`;
  }
  return "This is the “delight” layer — the stuff that helps you see yourself from a new angle without turning life into a quiz.";
}

/* =============================================================================
   Component
   ============================================================================= */

type TimeTwinTeaserPayload = {
  primary?: { name?: string; tagline?: string };
};

export default function FunFactsTab(props: FunFactsTabProps) {
  const { dark, wordCloudDisplay, nameFromHeadline } = props;
  const router = useRouter();

  const topTerms = React.useMemo(() => pickTopTerms(wordCloudDisplay, 3), [wordCloudDisplay]);

  const { payload: timeTwinPayload } = useGeneratedInsights<TimeTwinTeaserPayload>(
    "/api/guidance/insights-time-twin"
  );

  const timeTwinTeaser =
    timeTwinPayload?.primary?.name && timeTwinPayload?.primary?.tagline
      ? `Right now: ${timeTwinPayload.primary.name} — ${timeTwinPayload.primary.tagline}`
      : "A biography-style mirror — creative + technical + real-world impact.";

  return (
    <section className="mb-6">
      <div className={readingSurface(dark)}>
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className={[
              "absolute -top-24 left-1/2 h-[260px] w-[680px] -translate-x-1/2 rounded-full blur-3xl",
              dark ? "bg-fuchsia-300/10" : "bg-fuchsia-400/10",
            ].join(" ")}
          />
          <div
            className={[
              "absolute top-12 -left-24 h-[220px] w-[360px] rounded-full blur-3xl",
              dark ? "bg-violet-300/10" : "bg-violet-400/10",
            ].join(" ")}
          />
          <div
            className={[
              "absolute inset-0",
              dark
                ? "bg-gradient-to-b from-white/[0.06] via-transparent to-transparent"
                : "bg-gradient-to-b from-black/[0.04] via-transparent to-transparent",
            ].join(" ")}
          />
        </div>

        <div className="relative">
          <div className={sectionKicker(dark)}>Fun Facts</div>

          <div className={["mt-2 text-[18px] font-semibold tracking-tight", sectionTitle(dark)].join(" ")}>
            {buildOpenLine(nameFromHeadline)}
          </div>

          <div className={["mt-2 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>
            {buildDelightPara(topTerms)}
          </div>

          <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

          <button
            type="button"
            onClick={() => router.push("/main/insights/fun-facts/time-twin")}
            className={[
              "w-full text-left",
              "relative overflow-hidden rounded-[22px] border px-4 py-4",
              "backdrop-blur-xl transition active:scale-[0.99]",
              dark ? "border-white/10 bg-white/5 hover:bg-white/8" : "border-black/10 bg-white/85 hover:bg-white",
            ].join(" ")}
          >
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div
                className={[
                  "absolute -top-12 -right-16 h-56 w-56 rounded-full blur-3xl",
                  dark ? "bg-violet-300/10" : "bg-violet-400/10",
                ].join(" ")}
              />
              <div
                className={[
                  "absolute -bottom-16 -left-16 h-64 w-64 rounded-full blur-3xl",
                  dark ? "bg-fuchsia-300/8" : "bg-fuchsia-400/8",
                ].join(" ")}
              />
            </div>

            <div className="relative flex items-start gap-3">
              <div
                className={[
                  "mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full border",
                  dark ? "border-white/10 bg-white/6" : "border-black/10 bg-white",
                ].join(" ")}
                aria-hidden
              >
                <Clock3 className={["h-5 w-5", dark ? "text-violet-200/85" : "text-violet-700/80"].join(" ")} />
              </div>

              <div className="min-w-0">
                <div className={["text-[15px] font-semibold", sectionTitle(dark)].join(" ")}>Time Twin</div>

                <div className={["mt-1 text-[13px] leading-relaxed", mutedText(dark)].join(" ")}>
                  {timeTwinTeaser}
                </div>

                <div
                  className={[
                    "mt-2 inline-flex items-center gap-2 text-sm font-semibold",
                    dark ? "text-white/70" : "text-slate-700",
                  ].join(" ")}
                >
                  Open story <span aria-hidden className="opacity-80">↗</span>
                </div>
              </div>
            </div>
          </button>

          <div className={["mt-5 text-[12px] leading-relaxed", mutedText(dark)].join(" ")}>
            More Fun Facts will live here over time.
          </div>
        </div>
      </div>
    </section>
  );
}