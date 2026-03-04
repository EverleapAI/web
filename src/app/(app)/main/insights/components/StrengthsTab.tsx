// apps/web/src/app/(app)/main/insights/components/StrengthsTab.tsx
"use client";

import * as React from "react";
import { Sparkles, Shield } from "lucide-react";

import { NextStepsStack } from "@/app/(app)/main/components/nextSteps/NextStepsStack";

/* =============================================================================
   Local types (kept local to avoid page.tsx exports)
   ============================================================================= */

type SignalId = "action" | "people" | "curiosity" | "clarity";

type Signal = {
  id: SignalId;
  label: string;
  strength: number; // 0..1
  meaning: string;
  why: string;
  examples: string[];
};

type WordCloudItemLike = {
  term: string;
  weight: number; // 0..1-ish
};

type NextStepsStackProps = React.ComponentProps<typeof NextStepsStack>;
type NextStepsDefinition = NextStepsStackProps["definition"];

/* =============================================================================
   UI helpers (duplicated so StrengthsTab is self-contained)
   ============================================================================= */

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function subtleDivider(dark: boolean) {
  return dark ? "bg-white/10" : "bg-black/10";
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

function readingSurface(dark: boolean) {
  return [
    "relative overflow-hidden rounded-[28px] border",
    "px-4 py-5 md:px-6 md:py-6",
    "backdrop-blur-xl",
    dark ? "border-white/10 bg-slate-950/20" : "border-black/10 bg-white/80",
    "shadow-[0_18px_55px_rgba(0,0,0,0.22)]",
  ].join(" ");
}

function cleanOneLine(s: string) {
  return (s ?? "").replace(/\s+/g, " ").trim();
}

function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function wordSizePx(weight: number) {
  const w = clamp01(weight);
  return 14 + Math.round(w * 10); // 14..24
}

function wordOpacity(weight: number) {
  const w = clamp01(weight);
  return 0.74 + w * 0.22; // 0.74..0.96
}

function isScienceyTerm(term: string) {
  const t = (term ?? "").toLowerCase().trim();

  const rx =
    /\b(science|physics|chem|chemistry|bio|biology|genetic|genetics|neuro|neuroscience|quantum|lab|research|experiment|data|stats|statistics|math|algebra|geometry|calculus|engineering|robot|robotics|ai|ml|model|code|coding|program|programming|algorithm|systems?)\b/;

  const rx2 = /\b(stem|computer|computers|comp(?:sci)?|cs)\b/;

  return rx.test(t) || rx2.test(t);
}

function wordColorClasses(dark: boolean, term: string) {
  if (isScienceyTerm(term)) {
    return [
      dark ? "text-cyan-200/95" : "text-cyan-700/95",
      dark ? "drop-shadow-[0_1px_12px_rgba(0,0,0,0.38)]" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  const paletteDark = [
    "text-sky-200/90",
    "text-fuchsia-200/85",
    "text-amber-200/90",
    "text-emerald-200/85",
    "text-violet-200/85",
    "text-rose-200/85",
    "text-lime-200/85",
  ] as const;

  const paletteLight = [
    "text-sky-700/95",
    "text-fuchsia-700/90",
    "text-amber-700/95",
    "text-emerald-700/90",
    "text-violet-700/90",
    "text-rose-700/90",
    "text-lime-700/90",
  ] as const;

  const i = hashString(term.toLowerCase()) % paletteDark.length;
  return [dark ? paletteDark[i] : paletteLight[i], dark ? "drop-shadow-[0_1px_10px_rgba(0,0,0,0.34)]" : ""]
    .filter(Boolean)
    .join(" ");
}

function topTerms(items: WordCloudItemLike[]) {
  const sorted = [...items].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
  return new Set(sorted.slice(0, 3).map((x) => x.term.toLowerCase()));
}

function highlightWrap(dark: boolean) {
  return dark ? "bg-white/8 ring-1 ring-white/10" : "bg-black/5 ring-1 ring-black/10";
}

function labelForSignal(id: SignalId) {
  if (id === "action") return "Action";
  if (id === "people") return "People";
  if (id === "curiosity") return "Curiosity";
  return "Clarity";
}

function iconAccentForSignal(dark: boolean, id: SignalId) {
  if (id === "action") return dark ? "text-amber-200/85" : "text-amber-700/85";
  if (id === "people") return dark ? "text-sky-200/85" : "text-sky-700/85";
  if (id === "curiosity") return dark ? "text-violet-200/85" : "text-violet-700/85";
  return dark ? "text-emerald-200/85" : "text-emerald-700/85";
}

function barBg(dark: boolean) {
  return dark ? "bg-white/7" : "bg-black/5";
}

function barFillStyle(dark: boolean, id: SignalId, strength: number): React.CSSProperties {
  const s = clamp01(strength);
  const c =
    id === "action"
      ? "255, 191, 120"
      : id === "people"
        ? "120, 200, 255"
        : id === "curiosity"
          ? "190, 140, 255"
          : "120, 255, 190";

  return {
    width: `${Math.round(s * 100)}%`,
    background: dark
      ? `linear-gradient(90deg, rgba(${c}, 0.75), rgba(${c}, 0.22))`
      : `linear-gradient(90deg, rgba(${c}, 0.55), rgba(${c}, 0.18))`,
    boxShadow: dark ? `0 0 24px rgba(${c}, 0.30)` : `0 0 18px rgba(${c}, 0.16)`,
  };
}

/* =============================================================================
   Component
   ============================================================================= */

export default function StrengthsTab(props: {
  dark: boolean;
  signals: Signal[];
  wordCloudDisplay: WordCloudItemLike[];
  superBullets: string[];
  watchoutBullets: string[];
  nextStepsStrengths: NextStepsDefinition | null;
  mounted: boolean;
  tab: string;
  nameFromHeadline: string;
}): React.JSX.Element {
  const {
    dark,
    signals,
    wordCloudDisplay,
    superBullets,
    watchoutBullets,
    nextStepsStrengths,
    mounted,
    tab,
    nameFromHeadline,
  } = props;

  const normalizedSignals = React.useMemo<Signal[]>(() => {
    const safe = Array.isArray(signals) ? signals : [];
    return safe
      .map((s) => ({
        id: s.id,
        label: cleanOneLine(s.label || labelForSignal(s.id)),
        strength: clamp01(s.strength ?? 0),
        meaning: cleanOneLine(s.meaning ?? ""),
        why: cleanOneLine(s.why ?? ""),
        examples: Array.isArray(s.examples) ? s.examples.map(cleanOneLine).filter(Boolean).slice(0, 2) : [],
      }))
      .filter((s) => s.id === "action" || s.id === "people" || s.id === "curiosity" || s.id === "clarity");
  }, [signals]);

  const topWordSet = React.useMemo(() => topTerms(wordCloudDisplay ?? []), [wordCloudDisplay]);

  const headline = React.useMemo(() => {
    const who = nameFromHeadline ? `${nameFromHeadline}, ` : "";
    return `${who}here’s how you tend to show up when things get real.`;
  }, [nameFromHeadline]);

  const subline = React.useMemo(() => {
    const top = [...normalizedSignals].sort((a, b) => (b.strength ?? 0) - (a.strength ?? 0))[0];
    if (!top || (top.strength ?? 0) < 0.22) {
      return "Give me a couple more real examples and this will get sharper fast.";
    }
    return `Your strongest signal right now: ${labelForSignal(top.id)}.`;
  }, [normalizedSignals]);

  return (
    <section className="mb-6">
      <div className={readingSurface(dark)}>
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className={[
              "absolute -top-20 left-1/2 h-[240px] w-[640px] -translate-x-1/2 rounded-full blur-3xl",
              dark ? "bg-violet-300/10" : "bg-violet-400/10",
            ].join(" ")}
          />
          <div
            className={[
              "absolute -bottom-24 -left-24 h-[260px] w-[360px] rounded-full blur-3xl",
              dark ? "bg-sky-300/8" : "bg-sky-400/8",
            ].join(" ")}
          />
          <div
            className={[
              "absolute inset-0",
              dark
                ? "bg-gradient-to-b from-white/[0.05] via-transparent to-transparent"
                : "bg-gradient-to-b from-black/[0.04] via-transparent to-transparent",
            ].join(" ")}
          />
        </div>

        <div className="relative">
          <div className={sectionKicker(dark)}>Strengths</div>

          <div
            className={[
              "mt-2 text-[20px] md:text-[22px] font-semibold tracking-tight leading-snug",
              sectionTitle(dark),
            ].join(" ")}
          >
            {headline}
          </div>

          <div className={["mt-2 text-[14px] leading-relaxed", mutedText(dark)].join(" ")}>{subline}</div>
        </div>

        <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

        {/* Signals */}
        <div className="relative">
          <div className={sectionKicker(dark)}>Signals</div>
          <div className={["mt-2 text-[13px] leading-relaxed", mutedText(dark)].join(" ")}>
            This isn’t a label — it’s a snapshot of what seems to drive your strength right now.
          </div>

          <div className="mt-4 space-y-3">
            {normalizedSignals.map((s) => (
              <div
                key={`sig_${s.id}`}
                className={[
                  "relative overflow-hidden rounded-[22px] border px-4 py-4 backdrop-blur-xl",
                  dark ? "border-white/10 bg-white/[0.045]" : "border-black/10 bg-white/85",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={["text-[15px] font-semibold", sectionTitle(dark)].join(" ")}>
                        {cleanOneLine(s.label || labelForSignal(s.id))}
                      </span>
                      <span className={["text-[12px] font-semibold uppercase tracking-[0.14em]", mutedText(dark)].join(" ")}>
                        {labelForSignal(s.id)}
                      </span>
                    </div>

                    {s.meaning ? (
                      <div className={["mt-1 text-[13px] leading-relaxed", bodyText(dark)].join(" ")}>{s.meaning}</div>
                    ) : null}
                  </div>

                  <div className={["shrink-0 text-[12px] font-semibold", iconAccentForSignal(dark, s.id)].join(" ")}>
                    {Math.round(clamp01(s.strength) * 100)}%
                  </div>
                </div>

                <div className={["mt-3 h-2 w-full rounded-full", barBg(dark)].join(" ")}>
                  <div className="h-2 rounded-full" style={barFillStyle(dark, s.id, s.strength)} />
                </div>

                {s.why ? (
                  <div className={["mt-3 text-[13px] leading-relaxed", mutedText(dark)].join(" ")}>
                    <span className={dark ? "text-white/55" : "text-slate-600"}>Why it shows up: </span>
                    {s.why}
                  </div>
                ) : null}

                {s.examples?.length ? (
                  <ul className="mt-3 space-y-2">
                    {s.examples.map((ex, i) => (
                      <li key={`ex_${s.id}_${i}`} className="flex gap-2 text-[14px] leading-relaxed">
                        <span aria-hidden className={dark ? "text-white/35" : "text-slate-400"}>
                          •
                        </span>
                        <span className={dark ? "text-white/80" : "text-slate-700"}>{ex}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

        {/* Themes */}
        <div className="relative">
          <div className={sectionKicker(dark)}>Themes</div>
          <div className="mt-4">
            {wordCloudDisplay?.length ? (
              <div className="flex flex-wrap gap-x-3 gap-y-2 leading-none">
                {wordCloudDisplay.map((w) => {
                  const isTop = topWordSet.has((w.term ?? "").toLowerCase());
                  return (
                    <span
                      key={w.term}
                      className={[
                        "select-none",
                        wordColorClasses(dark, w.term),
                        isTop ? ["rounded-full px-2.5 py-1", highlightWrap(dark)].join(" ") : "",
                      ].join(" ")}
                      style={{
                        fontSize: `${wordSizePx(w.weight)}px`,
                        opacity: wordOpacity(w.weight),
                      }}
                    >
                      {w.term}
                    </span>
                  );
                })}
              </div>
            ) : (
              <div className={["text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>
                Nothing to map yet — give me 1–2 real examples and this will fill in.
              </div>
            )}
          </div>
        </div>

        <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

        {/* Superpowers */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <Sparkles className={["h-4 w-4", dark ? "text-lime-200/80" : "text-lime-700/80"].join(" ")} />
            <div className={sectionKicker(dark)}>Superpowers</div>
          </div>

          <div className={["mt-2 text-[14px] leading-relaxed", mutedText(dark)].join(" ")}>
            These are the moves you can trust when you’re under pressure.
          </div>

          {superBullets?.length ? (
            <ul className="mt-4 space-y-2">
              {superBullets.map((b, i) => (
                <li key={`sp_${i}`} className="flex gap-2 text-[15px] leading-relaxed">
                  <span aria-hidden className={dark ? "text-white/35" : "text-slate-400"}>
                    •
                  </span>
                  <span className={dark ? "text-white/80" : "text-slate-700"}>{b}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className={["mt-3 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>
              Add a couple more real examples and these will become specific.
            </div>
          )}
        </div>

        <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

        {/* Watchouts */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <Shield className={["h-4 w-4", dark ? "text-amber-200/80" : "text-amber-700/80"].join(" ")} />
            <div className={sectionKicker(dark)}>Watchouts</div>
          </div>

          <div className={["mt-2 text-[14px] leading-relaxed", mutedText(dark)].join(" ")}>
            Not flaws — just what a strength can look like when it’s overused.
          </div>

          {watchoutBullets?.length ? (
            <ul className="mt-4 space-y-2">
              {watchoutBullets.map((b, i) => (
                <li key={`wo_${i}`} className="flex gap-2 text-[15px] leading-relaxed">
                  <span aria-hidden className={dark ? "text-white/35" : "text-slate-400"}>
                    •
                  </span>
                  <span className={dark ? "text-white/80" : "text-slate-700"}>{b}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className={["mt-3 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>
              Watchouts are loading…
            </div>
          )}
        </div>

        <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

        {/* Next steps */}
        <div className="relative">
          <div className={sectionKicker(dark)}>One small move</div>
          <div className={["mt-2 text-[14px] leading-relaxed", mutedText(dark)].join(" ")}>
            Pick one strength and put it into a real rep this week. Small is fine. Real is the point.
          </div>

          {nextStepsStrengths ? (
            <div className="mt-4">
              <NextStepsStack
                dark={dark}
                useLocal={mounted}
                definition={nextStepsStrengths}
                variant="embedded"
                collapsible={false}
                defaultOpen
              />
            </div>
          ) : (
            <div className={["mt-4 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>
              Next steps are loading…
            </div>
          )}
        </div>

        {/* tiny debug hint (kept subtle) */}
        <div className={["mt-5 text-[11px] leading-relaxed", dark ? "text-white/25" : "text-slate-500"].join(" ")}>
          {mounted ? `Context: ${tab}` : ""}
        </div>
      </div>
    </section>
  );
}