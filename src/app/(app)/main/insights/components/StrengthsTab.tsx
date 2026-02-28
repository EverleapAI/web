// apps/web/src/app/(app)/main/insights/components/StrengthsTab.tsx
"use client";

import * as React from "react";

import { NextStepsStack } from "@/app/(app)/main/components/nextSteps/NextStepsStack";

/* =============================================================================
   Local types (kept local to avoid page.tsx exports)
   ============================================================================= */

type RGB = { r: number; g: number; b: number };

type SignalId = "action" | "people" | "curiosity" | "clarity";

type SignalLike = {
  id: SignalId;
  strength: number; // 0..1
  why?: string;
  examples?: string[];
};

type WordCloudItemLike = {
  term: string;
  weight: number; // 0..1-ish
};

type NextStepsStackProps = React.ComponentProps<typeof NextStepsStack>;
type NextStepsDefinition = NextStepsStackProps["definition"];

/* =============================================================================
   Local UI helpers (duplicated to preserve behavior without exporting from page)
   ============================================================================= */

type CSSVars = React.CSSProperties & { [key: `--${string}`]: string | number };

function rgb(a: RGB) {
  return `${a.r}, ${a.g}, ${a.b}`;
}

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

function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickAccent(term: string, palette: RGB[]) {
  const h = hashString((term ?? "").toLowerCase().trim());
  return palette[h % palette.length] ?? palette[0]!;
}

/* =============================================================================
   Quick Feedback (inline expand; no overlay) — local copy
   ============================================================================= */

type QuickRating = "mostly" | "somewhat" | "not_really";
const QUICK_FEEDBACK_STORAGE_KEY = "everleap.insights.quickFeedback.v1";

function quickChip(dark: boolean, active: boolean) {
  return [
    "inline-flex items-center gap-2",
    "rounded-full border px-3.5 py-2",
    "text-[13px] font-semibold",
    "backdrop-blur-xl transition active:scale-95",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30",
    dark ? "border-white/10" : "border-black/10",
    active
      ? dark
        ? "bg-white/[0.10] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_18px_44px_rgba(0,0,0,0.40),0_0_42px_rgba(251,146,60,0.16)]"
        : "bg-white text-slate-900 shadow-[0_14px_40px_rgba(0,0,0,0.12)]"
      : dark
        ? "bg-white/[0.045] text-white/78 hover:bg-white/[0.07]"
        : "bg-white/80 text-slate-800 hover:bg-white",
  ].join(" ");
}

function softInputShell(dark: boolean) {
  return [
    "relative overflow-hidden rounded-[22px] border",
    "backdrop-blur-2xl",
    dark ? "border-white/10 bg-white/[0.035]" : "border-black/10 bg-white/80",
    "shadow-[0_18px_55px_rgba(0,0,0,0.18)]",
  ].join(" ");
}

function saveButton(dark: boolean, disabled: boolean) {
  return [
    "h-10 rounded-2xl px-4 text-[13px] font-semibold",
    "transition active:scale-[0.99]",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30",
    disabled
      ? dark
        ? "cursor-not-allowed bg-white/[0.07] text-white/40 border border-white/10"
        : "cursor-not-allowed bg-black/5 text-black/40 border border-black/10"
      : dark
        ? "bg-white text-black hover:bg-white/95"
        : "bg-slate-900 text-white hover:bg-slate-900/90",
  ].join(" ");
}

function readLocalQuickFeedback(): { rating: QuickRating; note: string; savedAt: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(QUICK_FEEDBACK_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const rec = parsed as { rating?: unknown; note?: unknown; savedAt?: unknown };
    const rating =
      rec.rating === "mostly" || rec.rating === "somewhat" || rec.rating === "not_really" ? rec.rating : null;
    const note = typeof rec.note === "string" ? rec.note : "";
    const savedAt = typeof rec.savedAt === "number" && Number.isFinite(rec.savedAt) ? rec.savedAt : 0;
    if (!rating) return null;
    return { rating, note, savedAt };
  } catch {
    return null;
  }
}

function writeLocalQuickFeedback(v: { rating: QuickRating; note: string }) {
  if (typeof window === "undefined") return;
  const payload = { ...v, savedAt: Date.now() };
  window.localStorage.setItem(QUICK_FEEDBACK_STORAGE_KEY, JSON.stringify(payload));
}

function QuickFeedbackInline({ dark, contextTag }: { dark: boolean; contextTag: string }): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState<QuickRating | null>(null);
  const [note, setNote] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    const existing = readLocalQuickFeedback();
    if (!existing) return;
    setRating(existing.rating);
    setNote(existing.note ?? "");
    setSaved(true);
  }, []);

  function onPick(next: QuickRating) {
    setRating(next);
    setSaved(false);
    setOpen(true);
  }

  function onClose() {
    setOpen(false);
  }

  function onSave() {
    if (!rating) return;
    writeLocalQuickFeedback({
      rating,
      note: (note ?? "").trim(),
    });
    setSaved(true);
    setOpen(false);
  }

  const canSave = !!rating;

  return (
    <div className="mt-5">
      <div className={sectionKicker(dark)}>Quick Check</div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={quickChip(dark, rating === "mostly")} onClick={() => onPick("mostly")}>
          <span aria-hidden>👍</span>
          <span>Mostly right</span>
        </button>

        <button type="button" className={quickChip(dark, rating === "somewhat")} onClick={() => onPick("somewhat")}>
          <span aria-hidden>🙂</span>
          <span>Somewhat</span>
        </button>

        <button type="button" className={quickChip(dark, rating === "not_really")} onClick={() => onPick("not_really")}>
          <span aria-hidden>👎</span>
          <span>Not really</span>
        </button>

        {saved ? (
          <div className={["ml-1 flex items-center text-[12px]", dark ? "text-white/45" : "text-slate-600"].join(" ")}>
            (Saved locally)
          </div>
        ) : null}
      </div>

      <div
        className={[
          "mt-3 overflow-hidden transition-[max-height,opacity] duration-200 ease-out",
          open ? "max-h-[340px] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
        aria-hidden={!open}
      >
        <div className={softInputShell(dark)}>
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(520px 220px at 12% 0%, rgba(255,170,110,0.14), transparent 62%)," +
                  "radial-gradient(520px 220px at 88% 0%, rgba(120,160,255,0.10), transparent 62%)," +
                  "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
                opacity: dark ? 1 : 0.7,
              }}
            />
          </div>

          <div className="relative p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div
                  className={[
                    "text-[12px] font-semibold uppercase tracking-[0.16em]",
                    dark ? "text-white/55" : "text-slate-600",
                  ].join(" ")}
                >
                  Quick feedback
                </div>
                <div className={["mt-1 text-[13px] leading-relaxed", mutedText(dark)].join(" ")}>
                  Add a note if something felt off (or especially accurate).
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className={[
                  "shrink-0 h-9 rounded-full px-3 text-[12px] font-semibold border backdrop-blur-xl transition",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30",
                  dark
                    ? "border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.07]"
                    : "border-black/10 bg-white/80 text-slate-800 hover:bg-white",
                ].join(" ")}
              >
                Close
              </button>
            </div>

            <div className="mt-3">
              <textarea
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  if (saved) setSaved(false);
                }}
                rows={3}
                placeholder="Tell us what felt off / missing / dead-on…"
                className={[
                  "w-full resize-none rounded-[18px] px-4 py-3 text-[14px] leading-relaxed",
                  "bg-transparent outline-none ring-1 ring-inset",
                  dark
                    ? "text-white placeholder:text-white/32 ring-white/12 focus:ring-white/20"
                    : "text-slate-900 placeholder:text-slate-500 ring-black/10 focus:ring-black/15",
                  "focus-visible:ring-2 focus-visible:ring-orange-200/20",
                ].join(" ")}
                style={{
                  boxShadow:
                    "inset 0 0 0 1px rgba(0,0,0,0.10), " +
                    "inset 0 14px 26px rgba(0,0,0,0.18), " +
                    "inset 0 1px 0 rgba(255,255,255,0.10)",
                }}
                aria-label={`Quick feedback note (${contextTag})`}
              />
              <div className={["mt-2 text-[12px]", mutedText(dark)].join(" ")}>Tip: one sentence is enough.</div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setNote("");
                  setSaved(false);
                  setOpen(false);
                }}
                className={[
                  "h-10 rounded-2xl px-4 text-[13px] font-semibold border backdrop-blur-xl transition active:scale-[0.99]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30",
                  dark
                    ? "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.06]"
                    : "border-black/10 bg-white/70 text-slate-800 hover:bg-white",
                ].join(" ")}
              >
                Skip note
              </button>

              <button type="button" onClick={onSave} disabled={!canSave} className={saveButton(dark, !canSave)}>
                Save
              </button>
            </div>

            <div className={["mt-3 text-[11px] leading-relaxed", dark ? "text-white/30" : "text-slate-500"].join(" ")}>
              Saved to localStorage:{" "}
              <span className={dark ? "text-white/40" : "text-slate-600"}>{QUICK_FEEDBACK_STORAGE_KEY}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   Strength model + derivation
   ============================================================================= */

type StrengthDef = {
  id: string;
  title: string;
  accent: RGB;
  paragraph: string;
  helps: string[];
  watchouts: string[];
};

const HELP_ACCENTS: RGB[] = [
  { r: 120, g: 200, b: 255 },
  { r: 120, g: 255, b: 190 },
  { r: 160, g: 255, b: 140 },
  { r: 190, g: 140, b: 255 },
];

const WATCH_ACCENTS: RGB[] = [
  { r: 255, g: 190, b: 110 },
  { r: 255, g: 150, b: 230 },
  { r: 190, g: 140, b: 255 },
];

function signalMap(signals: SignalLike[]) {
  const m = new Map<SignalId, number>();
  for (const s of signals ?? []) m.set(s.id, clamp01(s.strength ?? 0));
  return m;
}

function buildStrengths(args: {
  name: string;
  signals: SignalLike[];
  themes: WordCloudItemLike[];
  superBullets: string[];
  watchoutBullets: string[];
}): StrengthDef[] {
  const { name, signals, superBullets, watchoutBullets } = args;

  const who = name ? `${name}, ` : "";
  const s = signalMap(signals);

  const people = s.get("people") ?? 0;
  const action = s.get("action") ?? 0;
  const curiosity = s.get("curiosity") ?? 0;
  const clarity = s.get("clarity") ?? 0;

  const superTxt = (superBullets ?? []).join(" | ").toLowerCase();
  const watchTxt = (watchoutBullets ?? []).join(" | ").toLowerCase();

  const feelsPressureProof =
    /\b(pressure|stress|calm|resilien|steady|composed|centered)\b/i.test(superTxt) ||
    /\b(pressure|stress|calm|resilien|steady|overwhelm)\b/i.test(watchTxt);

  const feelsOptionParalysis = /\b(paralysis|overthink|optimiz|stuck|too many options)\b/i.test(watchTxt);

  const accentViolet: RGB = { r: 190, g: 140, b: 255 };
  const accentSky: RGB = { r: 120, g: 200, b: 255 };
  const accentEmber: RGB = { r: 255, g: 180, b: 120 };
  const accentMint: RGB = { r: 120, g: 255, b: 190 };
  const accentPink: RGB = { r: 255, g: 150, b: 230 };
  const accentLime: RGB = { r: 160, g: 255, b: 140 };

  const s1: StrengthDef = {
    id: "calm",
    title: "Calm Under Pressure",
    accent: accentEmber,
    paragraph: `${who}you have a steady kind of resilience. When things get noisy, you don’t spike the room — you lower the temperature. That’s not “emotionless,” it’s regulated. It helps you make better calls when other people are panicking. The watch-out is subtle: if you stay calm by going quiet, you can delay naming what you actually need — and then it piles up.`,
    helps: ["steady presence", "clean triage", "trust under stress", action >= 0.26 ? "decide + move" : "hold the line"],
    watchouts: ["staying too quiet", feelsOptionParalysis ? "overthinking the call" : "waiting for certainty", "carrying it alone"],
  };

  const s2: StrengthDef = {
    id: "strategy",
    title: "Quiet Strategist",
    accent: accentViolet,
    paragraph: `You naturally think a couple steps ahead. You’re not chasing chaos — you’re trying to build a situation you can trust. That kind of planning makes you reliable, and it’s why people hand you responsibility. The tripwire is when planning becomes protection: you can keep refining the map because committing to one route feels risky.`,
    helps: ["risk-sensing", "solid plans", "anticipate issues", "behind-the-scenes impact"],
    watchouts: [feelsOptionParalysis ? "option paralysis" : "delayed commitment", "over-planning", "missing the moment"],
  };

  const s3: StrengthDef = {
    id: "empathy",
    title: "Human Radar",
    accent: accentSky,
    paragraph: `You pick up on people — not in a performative way, more like you can feel the subtext. That makes you good in real human situations: coaching, care, teams, hard conversations. The upside is trust. The watch-out is load: if you’re the one who notices everything, you can start carrying everyone’s feelings like they’re your job.`,
    helps: ["build trust", "read the room", "de-escalate", people >= 0.28 ? "strong rapport" : "supportive leadership"],
    watchouts: ["emotional over-carry", "fixing the room", "forgetting your own needs"],
  };

  const s4: StrengthDef = {
    id: "structure",
    title: "Structured Builder",
    accent: accentMint,
    paragraph: `You do well when there are clear expectations and a clean system. You’re the person who makes things work — routines, checklists, repeatable processes. That’s a strength, not a personality quirk: it’s how you protect quality. The watch-out is when structure becomes a cage. If everything is pre-scripted, your energy drops — even if you’re capable of doing it.`,
    helps: ["consistency", "quality control", "systems thinking", "follow-through"],
    watchouts: ["getting rigid", "resisting change", "feeling boxed in"],
  };

  const s5: StrengthDef = {
    id: "depth",
    title: "Depth Curiosity",
    accent: accentPink,
    paragraph: `You’re not “random-curious.” You’re the kind of curious that wants the real answer. You like unusual topics, deeper conversations, and understanding how things actually work. That’s where your insight comes from. The watch-out is time: if you let curiosity run the whole show, action can get postponed until it’s urgent.`,
    helps: ["learn fast", "connect dots", "ask better questions", curiosity >= 0.28 ? "go deep" : "spot patterns"],
    watchouts: ["disappearing into research", "delaying action", "overloading your brain"],
  };

  const s6: StrengthDef = {
    id: "values",
    title: "Ethical Backbone",
    accent: accentLime,
    paragraph: `You care about doing things the right way — not for applause, but because it matters to you. That shows up as loyalty, standards, and a low tolerance for empty status games. It makes you trustworthy. The watch-out is frustration: if you’re surrounded by noise, politics, or half-truths, you can either withdraw or get quietly exhausted.`,
    helps: ["credibility", "good judgment", "long-game thinking", "people trust you"],
    watchouts: ["burnout from nonsense", "staying silent too long", "taking it personally"],
  };

  const topId: SignalId =
    people >= action && people >= curiosity && people >= clarity
      ? "people"
      : action >= curiosity && action >= clarity
        ? "action"
        : curiosity >= clarity
          ? "curiosity"
          : "clarity";

  if (topId === "people") return [s3, feelsPressureProof ? s1 : s2, s4, s5, s6, s2].slice(0, 6);
  if (topId === "action") return [s1, s4, s2, s3, s6, s5];
  if (topId === "curiosity") return [s5, s2, s1, s3, s4, s6];
  return [s2, s4, s1, s3, s6, s5].map((x) => x);
}

/* =============================================================================
   Chip styles
   ============================================================================= */

function chipShell(dark: boolean) {
  return [
    "inline-flex items-center",
    "rounded-full border px-3.5 py-1.5",
    "text-[13px] font-semibold",
    "backdrop-blur-xl",
    "transition-[transform,box-shadow,background-color,border-color] duration-200",
    "select-none",
    "active:scale-[0.99]",
    dark ? "text-white/92" : "text-slate-900",
  ].join(" ");
}

/* =============================================================================
   Component
   ============================================================================= */

export default function StrengthsTab(props: {
  dark: boolean;
  mounted: boolean;
  tab: string;
  nameFromHeadline: string;
  signals: SignalLike[];
  wordCloudDisplay: WordCloudItemLike[];
  superBullets?: string[];
  watchoutBullets?: string[];
  nextStepsStrengths: NextStepsDefinition | null;
}): React.JSX.Element {
  const {
    dark,
    mounted,
    tab,
    nameFromHeadline,
    signals,
    wordCloudDisplay,
    superBullets,
    watchoutBullets,
    nextStepsStrengths,
  } = props;

  const strengthsRaw = React.useMemo(
    () =>
      buildStrengths({
        name: nameFromHeadline,
        signals,
        themes: wordCloudDisplay,
        superBullets: superBullets ?? [],
        watchoutBullets: watchoutBullets ?? [],
      }),
    [nameFromHeadline, signals, wordCloudDisplay, superBullets, watchoutBullets]
  );

  const strengths = React.useMemo(() => {
    const seen = new Set<string>();
    const out: StrengthDef[] = [];
    for (const s of strengthsRaw) {
      if (seen.has(s.id)) continue;
      seen.add(s.id);
      out.push(s);
    }
    return out;
  }, [strengthsRaw]);

  const opener = React.useMemo(() => {
    const who = nameFromHeadline ? `${nameFromHeadline}, ` : "";
    return `${who}these are the strengths that keep showing up in how you operate — not “talents on paper,” but how you actually move when life gets real. I’ll tell you what each one is, why it’s yours, how it helps… and the version of it that can trip you up.`;
  }, [nameFromHeadline]);

  return (
    <section className="mb-6">
      <style jsx>{`
        .el-chip-help {
          background: linear-gradient(
            180deg,
            rgba(var(--c), ${dark ? "0.28" : "0.18"}),
            rgba(255, 255, 255, ${dark ? "0.03" : "0.86"})
          );
          border-color: rgba(var(--c), ${dark ? "0.54" : "0.34"});
          box-shadow: 0 0 0 1px rgba(var(--c), ${dark ? "0.16" : "0.10"}),
            0 14px 44px rgba(0, 0, 0, ${dark ? "0.40" : "0.10"}),
            0 0 34px rgba(var(--c), ${dark ? "0.30" : "0.18"});
        }
        .el-chip-help:hover {
          transform: translateY(-1px);
          background: linear-gradient(
            180deg,
            rgba(var(--c), ${dark ? "0.36" : "0.22"}),
            rgba(255, 255, 255, ${dark ? "0.05" : "0.92"})
          );
          border-color: rgba(var(--c), ${dark ? "0.64" : "0.42"});
          box-shadow: 0 0 0 1px rgba(var(--c), ${dark ? "0.22" : "0.12"}),
            0 18px 60px rgba(0, 0, 0, ${dark ? "0.46" : "0.12"}),
            0 0 48px rgba(var(--c), ${dark ? "0.44" : "0.24"});
        }
        .el-chip-watch {
          background: linear-gradient(
            180deg,
            rgba(var(--c), ${dark ? "0.18" : "0.12"}),
            rgba(0, 0, 0, ${dark ? "0.10" : "0.00"})
          );
          border-color: rgba(var(--c), ${dark ? "0.40" : "0.26"});
          box-shadow: 0 0 0 1px rgba(var(--c), ${dark ? "0.10" : "0.08"}),
            0 14px 44px rgba(0, 0, 0, ${dark ? "0.42" : "0.10"});
        }
      `}</style>

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
              dark ? "bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" : "bg-gradient-to-b from-black/[0.04] via-transparent to-transparent",
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
            How you show up when it matters.
          </div>

          <p className={["mt-3 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>{opener}</p>
        </div>

        <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

        <div className="relative">
          <div className={sectionKicker(dark)}>Your strengths</div>
          <div className={["mt-2 text-[13px] leading-relaxed", mutedText(dark)].join(" ")}>
            Read these like a mirror — not a report card.
          </div>

          <div className="mt-4 space-y-3">
            {strengths.map((st, idx) => {
              const a = rgb(st.accent);
              const helpsAccent = pickAccent(st.id + ":helps", HELP_ACCENTS);
              const watchAccent = pickAccent(st.id + ":watch", WATCH_ACCENTS);

              return (
                <div
                  key={`${st.id}_${idx}`}
                  className={[
                    "relative overflow-hidden rounded-[22px] border px-4 py-4 backdrop-blur-xl",
                    dark ? "border-white/10 bg-white/[0.045]" : "border-black/10 bg-white/85",
                  ].join(" ")}
                >
                  <div className="pointer-events-none absolute inset-0" aria-hidden>
                    <div
                      className="absolute inset-0"
                      style={{
                        background: dark
                          ? `radial-gradient(260px 180px at 18% 18%, rgba(${a}, 0.18), transparent 60%),
                             radial-gradient(260px 190px at 92% 74%, rgba(${a}, 0.10), transparent 66%)`
                          : `radial-gradient(260px 180px at 18% 18%, rgba(${a}, 0.12), transparent 60%),
                             radial-gradient(260px 190px at 92% 74%, rgba(${a}, 0.08), transparent 66%)`,
                      }}
                    />
                  </div>

                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className="h-2 w-2 rounded-full"
                        style={{
                          background: `rgba(${a}, ${dark ? 0.95 : 0.86})`,
                          boxShadow: `0 0 22px rgba(${a}, ${dark ? "0.55" : "0.22"})`,
                        }}
                      />
                      <div className={["text-[16px] font-semibold", sectionTitle(dark)].join(" ")}>{st.title}</div>
                    </div>

                    <p className={["mt-2 text-[14px] leading-relaxed", dark ? "text-white/82" : "text-slate-700"].join(" ")}>
                      {st.paragraph}
                    </p>

                    <div className="mt-3">
                      <div className={["text-[12px] font-semibold uppercase tracking-[0.14em]", mutedText(dark)].join(" ")}>
                        Helps you
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {st.helps.map((t) => {
                          const chipAccent = pickAccent(t, [helpsAccent, ...HELP_ACCENTS]);
                          return (
                            <span
                              key={`${st.id}_h_${t}`}
                              className={[chipShell(dark), "el-chip-help"].join(" ")}
                              style={{ "--c": rgb(chipAccent) } as CSSVars}
                            >
                              {t}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className={["text-[12px] font-semibold uppercase tracking-[0.14em]", mutedText(dark)].join(" ")}>
                        Watch-outs
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {st.watchouts.map((t) => {
                          const chipAccent = pickAccent(t, [watchAccent, ...WATCH_ACCENTS]);
                          return (
                            <span
                              key={`${st.id}_w_${t}`}
                              className={[chipShell(dark), "el-chip-watch"].join(" ")}
                              style={{ "--c": rgb(chipAccent) } as CSSVars}
                            >
                              {t}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

        <div className="relative">
          <QuickFeedbackInline dark={dark} contextTag={`insights:${tab}`} />
        </div>

        <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

        <div className="relative">
          <div className={sectionKicker(dark)}>One small move</div>
          <div className={["mt-2 text-[14px] leading-relaxed", mutedText(dark)].join(" ")}>
            Use a strength on purpose this week. Small is fine. Real is the point.
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
            <div className={["mt-4 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>Next steps are loading…</div>
          )}
        </div>
      </div>
    </section>
  );
}