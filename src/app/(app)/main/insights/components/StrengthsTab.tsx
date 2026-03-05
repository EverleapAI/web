// apps/web/src/app/(app)/main/insights/components/StrengthsTab.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Shield,
  Lightbulb,
  Users,
  MessageCircle,
  Target,
  Compass,
  Wrench,
  Brain,
  HeartHandshake,
  Trophy,
  Flame,
} from "lucide-react";

import { NextStepsStack } from "@/app/(app)/main/components/nextSteps/NextStepsStack";

/* =============================================================================
   Local types (kept local to avoid page.tsx exports)
   ============================================================================= */

type RGB = { r: number; g: number; b: number };

type NextStepsStackProps = React.ComponentProps<typeof NextStepsStack>;
type NextStepsDefinition = NextStepsStackProps["definition"];

type QuickRating = "mostly" | "somewhat" | "not_really";

const QUICK_FEEDBACK_STORAGE_KEY = "everleap.insights.quickFeedback.v1";
const STRENGTHS_SELFREPORT_KEY = "everleap.insights.strengthsSelfReport.v1";

/* =============================================================================
   Strength signals (compatible with prior StrengthsTab patterns)
   ============================================================================= */

type StrengthSignalId = "action" | "people" | "curiosity" | "clarity";

type StrengthSignalLike = {
  id: StrengthSignalId;
  strength: number; // 0..1
  why?: string;
  examples?: string[];
};

type StrengthsTopLike = {
  top?: StrengthSignalLike | null;
  top2?: StrengthSignalLike[];
  top3?: StrengthSignalLike[];
  signals?: StrengthSignalLike[];
};

/* =============================================================================
   Strength cards taxonomy (teen-facing)
   ============================================================================= */

type StrengthId =
  | "starter"
  | "finisher"
  | "connector"
  | "coachability"
  | "problem_solver"
  | "builder"
  | "sensemaker"
  | "steady_pressure"
  | "storyteller"
  | "calm_focus"
  | "fair_play"
  | "explorer";

type StrengthDef = {
  id: StrengthId;
  label: string;
  accent: RGB;

  // teen-facing copy
  hook: string; // what it is
  because: string; // why you might be this way
  watchOut: string; // gentle watch-out

  signals: StrengthSignalId[];
  keywords: string[];
};

type ScoredStrength = {
  def: StrengthDef;
  score: number; // 0..1
  receipt?: string;
};

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

/* =============================================================================
   Local UI helpers (match your MotivationsTab style)
   ============================================================================= */

type CSSVars = React.CSSProperties & { [key: `--${string}`]: string | number };

function rgb(a: RGB) {
  return `${a.r}, ${a.g}, ${a.b}`;
}

function sectionKicker(dark: boolean) {
  return ["text-[12px] font-semibold uppercase tracking-[0.16em]", dark ? "text-white/50" : "text-slate-600"].join(
    " "
  );
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

function softCard(dark: boolean) {
  return [
    "relative overflow-hidden rounded-[22px] border",
    "px-4 py-4",
    "backdrop-blur-xl",
    "shadow-[0_16px_48px_rgba(0,0,0,0.14)]",
    dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white/85",
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

function pillBase(dark: boolean) {
  return [
    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
    "text-[12px] font-semibold",
    "backdrop-blur-xl",
    dark ? "border-white/10 bg-white/[0.04] text-white/80" : "border-black/10 bg-white/80 text-slate-800",
  ].join(" ");
}

function glowBg(dark: boolean, accent: RGB, strength = 0.16): React.CSSProperties {
  const c = rgb(accent);
  return {
    background: dark
      ? `radial-gradient(420px 220px at 10% 0%, rgba(${c}, ${strength}), transparent 62%),
         radial-gradient(380px 220px at 92% 82%, rgba(${c}, ${strength * 0.6}), transparent 64%)`
      : `radial-gradient(420px 220px at 10% 0%, rgba(${c}, ${strength * 0.85}), transparent 62%),
         radial-gradient(380px 220px at 92% 82%, rgba(${c}, ${strength * 0.55}), transparent 64%)`,
  };
}

function chipButton(dark: boolean) {
  return [
    "inline-flex items-center gap-2",
    "rounded-full border px-3.5 py-2",
    "text-[13px] font-semibold",
    "backdrop-blur-xl transition active:scale-95",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30",
    dark
      ? "border-white/10 bg-white/[0.04] text-white/78 hover:bg-white/[0.07]"
      : "border-black/10 bg-white/80 text-slate-800 hover:bg-white",
  ].join(" ");
}

function primaryLinkButton(dark: boolean) {
  return [
    "inline-flex items-center justify-center gap-2",
    "h-10 rounded-full px-4 text-[13px] font-semibold",
    "transition active:scale-[0.99]",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30",
    dark ? "bg-white text-black hover:bg-white/95" : "bg-slate-900 text-white hover:bg-slate-900/90",
  ].join(" ");
}

function subtleLinkButton(dark: boolean) {
  return [
    "inline-flex items-center justify-center gap-2",
    "h-10 rounded-full border px-4 text-[13px] font-semibold",
    "backdrop-blur-xl transition active:scale-[0.99]",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30",
    dark
      ? "border-white/10 bg-white/[0.04] text-white/78 hover:bg-white/[0.07]"
      : "border-black/10 bg-white/80 text-slate-800 hover:bg-white",
  ].join(" ");
}

/* =============================================================================
   Strengths intro (agentic / counselor voice)
   ============================================================================= */

function strengthsIntro(top: StrengthSignalLike | null | undefined, name: string) {
  const hasName = !!(name ?? "").trim();
  const n = (name ?? "").trim();
  const prefix = hasName ? `${n}` : "Hey";

  const id: StrengthSignalId = (top?.id ?? "clarity") as StrengthSignalId;

  if (id === "action") {
    return `${prefix} — your strength signal looks “action-forward.”

That usually means you learn by doing. You don’t need perfect conditions to start. Once you move, you get clearer, faster.

We’ll treat this like a real advantage: small starts, quick reps, and visible wins — so momentum becomes your superpower instead of pressure.`;
  }

  if (id === "people") {
    return `${prefix} — your strength signal leans “people-smart.”

You tend to read the room, notice dynamics, and do better when there’s real connection: a teammate, a mentor, a shared mission.

We’ll use that by building the right kind of support around you — not “more social,” just the right people at the right moments.`;
  }

  if (id === "curiosity") {
    return `${prefix} — your strength signal is “curiosity + pattern.”

You get sharp when you’re learning, testing, and connecting dots. Questions don’t distract you — they power you.

We’ll use that by turning goals into something you can explore and master, instead of something that feels like forced homework.`;
  }

  // clarity
  return `${prefix} — your strength signal looks “clarity-driven.”

You do best when things make sense: the goal is real, the plan is clean, and the rules don’t feel random. When that’s true, you can focus hard and stay steady.

We’ll use this by simplifying what matters, cutting noise, and giving you a plan that actually feels fair and doable.`;
}

/* =============================================================================
   Strength taxonomy + scoring (always returns top cards)
   ============================================================================= */

const STRENGTHS_TAXONOMY: StrengthDef[] = [
  {
    id: "starter",
    label: "Quick starter",
    accent: { r: 255, g: 190, b: 110 },
    hook: "When something matters, you can start fast — you don’t need perfect conditions.",
    because: "Your brain gets clarity from motion. Starting creates signal.",
    watchOut: "If you start too many things at once, finishing can get messy.",
    signals: ["action"],
    keywords: ["start", "begin", "jump in", "now", "do it", "try"],
  },
  {
    id: "finisher",
    label: "Finisher",
    accent: { r: 120, g: 255, b: 190 },
    hook: "You’re good at closing loops — finishing, polishing, and making it real.",
    because: "Completion gives you relief and confidence. You like clean outcomes.",
    watchOut: "If you wait for “perfect,” you can delay the final 10%.",
    signals: ["clarity", "action"],
    keywords: ["finish", "done", "ship", "complete", "wrap up"],
  },
  {
    id: "connector",
    label: "Connector",
    accent: { r: 120, g: 200, b: 255 },
    hook: "You build better when there’s a real person involved — teammate, mentor, or audience.",
    because: "People give you feedback and energy. It makes the work feel real.",
    watchOut: "If you’re isolated too long, motivation can fade.",
    signals: ["people"],
    keywords: ["team", "together", "friends", "coach", "mentor", "group"],
  },
  {
    id: "coachability",
    label: "Coachable",
    accent: { r: 190, g: 140, b: 255 },
    hook: "You can take feedback without collapsing — and you use it to get better.",
    because: "You’re able to separate ‘me’ from ‘my current draft.’ That’s rare.",
    watchOut: "If feedback is disrespectful, it can hit hard. You need good mirrors.",
    signals: ["people", "curiosity"],
    keywords: ["feedback", "coach", "critique", "lesson", "improve"],
  },
  {
    id: "problem_solver",
    label: "Problem solver",
    accent: { r: 255, g: 150, b: 230 },
    hook: "You’re good at fixing what’s broken — you can find the lever that changes things.",
    because: "Your brain likes puzzles and cause/effect. You don’t panic when it’s messy.",
    watchOut: "You can get stuck ‘fixing’ instead of choosing what matters most.",
    signals: ["curiosity", "clarity"],
    keywords: ["solve", "fix", "figure out", "strategy", "plan"],
  },
  {
    id: "builder",
    label: "Builder",
    accent: { r: 110, g: 230, b: 255 },
    hook: "You like making real things — a system, a project, a routine that works.",
    because: "You trust actions you can repeat. You like results you can touch.",
    watchOut: "If you don’t pick a target, you can build a lot… in random directions.",
    signals: ["action", "clarity"],
    keywords: ["build", "make", "system", "routine", "project"],
  },
  {
    id: "sensemaker",
    label: "Sense-maker",
    accent: { r: 190, g: 140, b: 255 },
    hook: "You’re good at turning chaos into a clean explanation: what’s true, what matters, what’s next.",
    because: "You’re tuned to structure. You hate fuzzy rules and fake logic.",
    watchOut: "If you overthink, you can delay action waiting for perfect clarity.",
    signals: ["clarity"],
    keywords: ["clarity", "organize", "explain", "plan", "structure"],
  },
  {
    id: "steady_pressure",
    label: "Steady under pressure",
    accent: { r: 255, g: 180, b: 120 },
    hook: "You can keep going when it’s uncomfortable — you don’t quit just because it’s hard.",
    because: "You can tolerate effort. You have a real ‘stick with it’ muscle.",
    watchOut: "If you push nonstop, you can forget to recover and then crash.",
    signals: ["action"],
    keywords: ["hard", "pressure", "tough", "persist", "grind"],
  },
  {
    id: "storyteller",
    label: "Story + voice",
    accent: { r: 255, g: 150, b: 230 },
    hook: "You can explain things in a way that makes people care.",
    because: "You notice what matters emotionally, not just logically.",
    watchOut: "If you feel judged, you might hide your voice even when it’s strong.",
    signals: ["people", "clarity"],
    keywords: ["story", "explain", "present", "write", "communicate"],
  },
  {
    id: "calm_focus",
    label: "Calm focus",
    accent: { r: 120, g: 255, b: 190 },
    hook: "When you lock in, you can focus longer than most people.",
    because: "You’re able to tune out noise when the goal feels real.",
    watchOut: "If the goal feels pointless, focus disappears fast (that’s normal for you).",
    signals: ["clarity"],
    keywords: ["focus", "lock in", "deep", "attention", "zone"],
  },
  {
    id: "fair_play",
    label: "Fair-play instinct",
    accent: { r: 120, g: 200, b: 255 },
    hook: "You notice fairness and respect — and you care when people aren’t treated right.",
    because: "You’re tuned to values and standards. You don’t ignore what feels wrong.",
    watchOut: "Unfairness can hijack your attention. You may need boundaries around it.",
    signals: ["people", "clarity"],
    keywords: ["fair", "respect", "rules", "right", "wrong"],
  },
  {
    id: "explorer",
    label: "Explorer",
    accent: { r: 110, g: 230, b: 255 },
    hook: "You’re energized by new terrain — learning, experimenting, trying new angles.",
    because: "Novelty gives you signal. Curiosity is fuel for you.",
    watchOut: "If you never choose a lane, you can stay in ‘research mode’ too long.",
    signals: ["curiosity"],
    keywords: ["explore", "new", "learn", "try", "experiment"],
  },
];

function normalizeTextPieces(parts: string[]) {
  return parts
    .map((x) => (x ?? "").toString().trim())
    .filter(Boolean)
    .join(" | ")
    .toLowerCase();
}

function scoreStrengths(args: {
  signals: StrengthSignalLike[];
  receipts: string[];
}): { top: ScoredStrength[] } {
  const { signals, receipts } = args;

  const signalScore = new Map<StrengthSignalId, number>();
  for (const s of signals ?? []) signalScore.set(s.id, clamp01(s.strength ?? 0));

  const blob = normalizeTextPieces([
    ...(receipts ?? []).slice(0, 12),
    ...(signals ?? []).map((s) => s.why ?? ""),
    ...(signals ?? []).flatMap((s) => s.examples ?? []),
    ...(signals ?? []).map((s) => s.id),
  ]);

  const scored: ScoredStrength[] = STRENGTHS_TAXONOMY
    .map((st) => {
      // baseline ensures we ALWAYS show something even when signal is weak
      let s = 0.12;

      for (const sid of st.signals) {
        s += (signalScore.get(sid) ?? 0) * 0.55;
      }

      const hits = st.keywords.reduce((acc, k) => {
        const key = (k ?? "").toLowerCase();
        if (!key) return acc;
        return blob.includes(key) ? acc + 1 : acc;
      }, 0);

      s += Math.min(0.22, hits * 0.055);

      // small bump if the strongest signal matches
      const topSignal = [...(signals ?? [])].sort((a, b) => (b.strength ?? 0) - (a.strength ?? 0))[0]?.id ?? null;
      if (topSignal && st.signals.includes(topSignal)) s += 0.08;

      return { def: st, score: clamp01(s) };
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const cleanReceipts = (receipts ?? [])
    .map((r) => (r ?? "").toString().trim())
    .filter((r) => r.length >= 6 && r.length <= 220);

  const attachReceipt = (m: ScoredStrength) => {
    const safeKeywords = m.def.keywords
      .map((k) => (k ?? "").trim())
      .filter(Boolean)
      .slice(0, 12)
      .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

    if (!safeKeywords.length) return m;

    const rx = new RegExp(`\\b(${safeKeywords.join("|")})\\b`, "i");
    const found = cleanReceipts.find((r) => rx.test(r));
    return found ? { ...m, receipt: found } : m;
  };

  const topRaw = scored.slice(0, 6).map(attachReceipt);

  const seen = new Set<StrengthId>();
  const top: ScoredStrength[] = [];
  for (const m of topRaw) {
    if (seen.has(m.def.id)) continue;
    seen.add(m.def.id);
    top.push(m);
    if (top.length >= 4) break; // keep it simple: 4 cards
  }

  if (top.length < 4) {
    for (const m of scored.slice(6)) {
      if (top.length >= 4) break;
      if (seen.has(m.def.id)) continue;
      seen.add(m.def.id);
      top.push(attachReceipt(m));
    }
  }

  return { top };
}

/* =============================================================================
   Low-signal helpers
   ============================================================================= */

function computeSignalConfidence(signals: StrengthSignalLike[]): number {
  if (!Array.isArray(signals) || signals.length === 0) return 0.18;
  const xs = signals.map((s) => clamp01(s.strength ?? 0)).filter((n) => Number.isFinite(n));
  if (!xs.length) return 0.18;
  const avg = xs.reduce((a, b) => a + b, 0) / xs.length;
  return clamp01(0.15 + avg * 0.75);
}

function signalLabel(sig: number) {
  if (sig >= 0.72) return "High";
  if (sig >= 0.45) return "Medium";
  return "Low";
}

/* =============================================================================
   Icons per strength
   ============================================================================= */

function StrengthIcon({ id }: { id: StrengthId }) {
  const Icon =
    id === "starter" ? Zap
    : id === "finisher" ? Shield
    : id === "connector" ? Users
    : id === "coachability" ? MessageCircle
    : id === "problem_solver" ? Wrench
    : id === "builder" ? Target
    : id === "sensemaker" ? Brain
    : id === "steady_pressure" ? Flame
    : id === "storyteller" ? Lightbulb
    : id === "calm_focus" ? Compass
    : id === "fair_play" ? HeartHandshake
    : id === "explorer" ? Trophy
    : Sparkles;

  return <Icon className="h-4.5 w-4.5" aria-hidden />;
}

/* =============================================================================
   Quick Feedback (shared behavior)
   ============================================================================= */

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
    const rating = rec.rating === "mostly" || rec.rating === "somewhat" || rec.rating === "not_really" ? rec.rating : null;
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

  function onSave() {
    if (!rating) return;
    writeLocalQuickFeedback({ rating, note: (note ?? "").trim() });
    setSaved(true);
    setOpen(false);
  }

  const canSave = !!rating;

  return (
    <div className="mt-6">
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
                <div className={["text-[12px] font-semibold uppercase tracking-[0.16em]", dark ? "text-white/55" : "text-slate-600"].join(" ")}>
                  Quick feedback
                </div>
                <div className={["mt-1 text-[13px] leading-relaxed", mutedText(dark)].join(" ")}>
                  Add a note if something felt off (or especially accurate).
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
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
                  dark ? "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.06]" : "border-black/10 bg-white/70 text-slate-800 hover:bg-white",
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
   Self-report (inline expand; no modal)
   ============================================================================= */

function readSelfReport(): { text: string; savedAt: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STRENGTHS_SELFREPORT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const rec = parsed as { text?: unknown; savedAt?: unknown };
    const text = typeof rec.text === "string" ? rec.text : "";
    const savedAt = typeof rec.savedAt === "number" && Number.isFinite(rec.savedAt) ? rec.savedAt : 0;
    if (!text.trim()) return null;
    return { text, savedAt };
  } catch {
    return null;
  }
}

function writeSelfReport(text: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STRENGTHS_SELFREPORT_KEY,
    JSON.stringify({
      text: (text ?? "").trim(),
      savedAt: Date.now(),
    })
  );
}

function LowSignalAssist({
  dark,
  isLow,
  selfReportValue,
  onSelfReportSaved,
}: {
  dark: boolean;
  isLow: boolean;
  selfReportValue: string;
  onSelfReportSaved: (v: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState(selfReportValue ?? "");
  const [saved, setSaved] = React.useState(!!selfReportValue);

  React.useEffect(() => {
    setText(selfReportValue ?? "");
    setSaved(!!selfReportValue);
  }, [selfReportValue]);

  if (!isLow) return null;

  const canSave = (text ?? "").trim().length >= 6;

  return (
    <div className="mt-4">
      <div className={softCard(dark)}>
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              opacity: dark ? 1 : 0.8,
              background:
                "radial-gradient(520px 240px at 12% 0%, rgba(255,170,110,0.12), transparent 62%)," +
                "radial-gradient(520px 240px at 90% 80%, rgba(120,200,255,0.10), transparent 64%)",
            }}
          />
        </div>

        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className={sectionKicker(dark)}>Signal is low</div>
              <div className={["mt-1 text-[13px] leading-relaxed", mutedText(dark)].join(" ")}>
                Totally normal. Two quick ways to sharpen your strengths:
              </div>
            </div>

            {saved ? (
              <div className={["text-[12px] font-semibold", dark ? "text-white/55" : "text-slate-600"].join(" ")}>
                (Saved)
              </div>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="https://dev.everleap.ai/main/questions?cat=strengths&returnTo=/main/insights"
              className={primaryLinkButton(dark)}
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Answer strength prompts
            </Link>

            <button type="button" className={subtleLinkButton(dark)} onClick={() => setOpen((v) => !v)}>
              <MessageCircle className="h-4 w-4" aria-hidden />
              Tell us in your words
            </button>
          </div>

          <div
            className={[
              "mt-3 overflow-hidden transition-[max-height,opacity] duration-200 ease-out",
              open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0",
            ].join(" ")}
            aria-hidden={!open}
          >
            <div className={softInputShell(dark)}>
              <div className="relative p-4">
                <div className={["text-[13px] font-semibold", dark ? "text-white" : "text-slate-900"].join(" ")}>
                  What are you good at when you’re at your best?
                </div>
                <div className={["mt-1 text-[13px] leading-relaxed", mutedText(dark)].join(" ")}>
                  One or two sentences is perfect. Example: “I’m good at ___” or “People come to me for ___”.
                </div>

                <div className="mt-3">
                  <textarea
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      if (saved) setSaved(false);
                    }}
                    rows={3}
                    placeholder="Type your strengths…"
                    className={[
                      "w-full resize-none rounded-[18px] px-4 py-3 text-[14px] leading-relaxed",
                      "bg-transparent outline-none ring-1 ring-inset",
                      dark
                        ? "text-white placeholder:text-white/32 ring-white/12 focus:ring-white/20"
                        : "text-slate-900 placeholder:text-slate-500 ring-black/10 focus:ring-black/15",
                      "focus-visible:ring-2 focus-visible:ring-orange-200/20",
                    ].join(" ")}
                  />
                  <div className={["mt-2 text-[12px]", mutedText(dark)].join(" ")}>We’ll use this to tune your strengths next time.</div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button type="button" onClick={() => setOpen(false)} className={chipButton(dark)}>
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!canSave) return;
                      const cleaned = (text ?? "").trim();
                      writeSelfReport(cleaned);
                      onSelfReportSaved(cleaned);
                      setSaved(true);
                      setOpen(false);
                    }}
                    disabled={!canSave}
                    className={saveButton(dark, !canSave)}
                  >
                    Save
                  </button>
                </div>

                <div className={["mt-3 text-[11px] leading-relaxed", dark ? "text-white/30" : "text-slate-500"].join(" ")}>
                  Saved to localStorage:{" "}
                  <span className={dark ? "text-white/40" : "text-slate-600"}>{STRENGTHS_SELFREPORT_KEY}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={["mt-3 text-[12px] leading-relaxed", dark ? "text-white/45" : "text-slate-600"].join(" ")}>
            Tip: more answers = less generic.
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   Strength card
   ============================================================================= */

function StrengthCard({ dark, item, signal }: { dark: boolean; item: ScoredStrength; signal: number }) {
  const { def, score, receipt } = item;

  const conf = clamp01(0.35 * clamp01(score) + 0.65 * clamp01(signal));
  const pct = Math.round(conf * 100);

  const badgeStyle: CSSVars = {
    ...glowBg(dark, def.accent, 0.14),
    ["--accent" as const]: rgb(def.accent),
  };

  return (
    <div className={softCard(dark)} style={badgeStyle}>
      <div className="pointer-events-none absolute inset-0" aria-hidden style={glowBg(dark, def.accent, 0.14)} />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div
                className={[
                  "inline-flex h-8 w-8 items-center justify-center rounded-full border",
                  "backdrop-blur-xl",
                  dark ? "border-white/10 bg-white/[0.05]" : "border-black/10 bg-white/80",
                ].join(" ")}
                style={{ boxShadow: `0 0 30px rgba(${rgb(def.accent)}, ${dark ? 0.22 : 0.14})` }}
                aria-hidden
              >
                <span className={dark ? "text-white/85" : "text-slate-800"}>
                  <StrengthIcon id={def.id} />
                </span>
              </div>

              <div className={["text-[14px] font-semibold", dark ? "text-white" : "text-slate-900"].join(" ")}>{def.label}</div>
            </div>
          </div>

          <div className={pillBase(dark)}>
            <span className={dark ? "text-white/70" : "text-slate-700"}>Confidence</span>
            <span className={dark ? "text-white" : "text-slate-900"}>{pct}%</span>
          </div>
        </div>

        <div className={["mt-3 text-[13.5px] leading-relaxed", mutedText(dark)].join(" ")}>{def.hook}</div>

        <div className={["mt-2 text-[13.5px] leading-relaxed", mutedText(dark)].join(" ")}>
          <span className={dark ? "text-white/70" : "text-slate-700"}>Why this might fit: </span>
          {def.because}
        </div>

        {receipt ? (
          <div
            className={[
              "mt-3 rounded-[16px] border px-3 py-2 text-[12.5px] leading-relaxed",
              dark ? "border-white/10 bg-white/[0.03] text-white/70" : "border-black/10 bg-white/70 text-slate-700",
            ].join(" ")}
          >
            <span className={dark ? "text-white/55" : "text-slate-600"}>From your answers: </span>
            {receipt}
          </div>
        ) : null}

        <div className={["mt-3 text-[12.5px] leading-relaxed", dark ? "text-white/55" : "text-slate-600"].join(" ")}>
          <span className={dark ? "text-white/55" : "text-slate-600"}>Watch-out: </span>
          {def.watchOut}
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   Component
   ============================================================================= */

export function StrengthsTab(props: {
  dark: boolean;

  // Accept whatever page.tsx currently passes (don’t break builds)
  strengthsTop?: StrengthsTopLike | null;
  strengthsSignals?: StrengthSignalLike[] | null;
  strengthsReceipts?: string[] | null;

  // page.tsx may pass model={vm}; accept it (unused)
  model?: unknown;

  nextStepsStrengths: NextStepsDefinition | null;
  mounted: boolean;
  tab: string;
  nameFromHeadline: string;
}): React.JSX.Element {
  const {
    dark,
    strengthsTop,
    strengthsSignals,
    strengthsReceipts,
    nextStepsStrengths,
    mounted,
    tab,
    nameFromHeadline,
  } = props;

  const safeSignals = React.useMemo(() => {
    if (Array.isArray(strengthsSignals) && strengthsSignals.length) return strengthsSignals.filter(Boolean);
    const fromTop = (strengthsTop?.signals ?? strengthsTop?.top3 ?? strengthsTop?.top2 ?? []) as StrengthSignalLike[];
    return Array.isArray(fromTop) ? fromTop.filter(Boolean) : [];
  }, [strengthsSignals, strengthsTop]);

  const topSignal = React.useMemo(() => {
    const s = [...safeSignals].sort((a, b) => (b.strength ?? 0) - (a.strength ?? 0))[0] ?? null;
    return s;
  }, [safeSignals]);

  const signal = React.useMemo(() => computeSignalConfidence(safeSignals), [safeSignals]);
  const isLowSignal = signal < 0.45;

  const [selfReport, setSelfReport] = React.useState<string>("");

  React.useEffect(() => {
    const existing = readSelfReport();
    if (existing?.text) setSelfReport(existing.text);
  }, []);

  const receipts = React.useMemo(() => {
    const list = Array.isArray(strengthsReceipts) ? [...strengthsReceipts] : [];
    if ((selfReport ?? "").trim().length >= 6) list.unshift(selfReport.trim());
    return list;
  }, [strengthsReceipts, selfReport]);

  const scored = React.useMemo(() => scoreStrengths({ signals: safeSignals, receipts }), [safeSignals, receipts]);

  return (
    <section className="mb-6">
      <div className={readingSurface(dark)}>
        <div className="relative">
          <div className={sectionKicker(dark)}>Strengths</div>

          <div
            className={[
              "mt-2 text-[20px] md:text-[22px] font-semibold tracking-tight leading-snug",
              dark ? "text-white" : "text-slate-900",
            ].join(" ")}
          >
            What you’re good at when you’re at your best.
          </div>

          <p className={["mt-3 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>
            {strengthsIntro(topSignal, nameFromHeadline)}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className={pillBase(dark)}>
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  background:
                    signal >= 0.72 ? "rgba(120,255,190,0.95)" : signal >= 0.45 ? "rgba(120,200,255,0.95)" : "rgba(255,180,120,0.95)",
                  boxShadow:
                    signal >= 0.72
                      ? "0 0 18px rgba(120,255,190,0.30)"
                      : signal >= 0.45
                        ? "0 0 18px rgba(120,200,255,0.26)"
                        : "0 0 18px rgba(255,180,120,0.22)",
                }}
                aria-hidden
              />
              <span>Signal</span>
              <span className={dark ? "text-white" : "text-slate-900"}>{Math.round(signal * 100)}%</span>
              <span className={dark ? "text-white/55" : "text-slate-600"}>({signalLabel(signal)})</span>
            </div>

            {isLowSignal ? (
              <div className={["text-[12px]", dark ? "text-white/45" : "text-slate-600"].join(" ")}>
                Low signal right now — we’ll show best-guess defaults.
              </div>
            ) : null}
          </div>

          <LowSignalAssist
            dark={dark}
            isLow={isLowSignal}
            selfReportValue={selfReport}
            onSelfReportSaved={(v) => setSelfReport(v)}
          />
        </div>

        <div className="mt-6">
          <div className={sectionKicker(dark)}>Your top strengths</div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {(scored.top ?? []).map((m) => (
              <StrengthCard key={m.def.id} dark={dark} item={m} signal={signal} />
            ))}
          </div>

          <div className={["mt-3 text-[12.5px] leading-relaxed", dark ? "text-white/45" : "text-slate-600"].join(" ")}>
            This gets sharper as you answer more prompts.
          </div>
        </div>

        {/* ✅ Quick Check should come BEFORE One Small Move */}
        <QuickFeedbackInline dark={dark} contextTag={`insights:${tab}`} />

        {/* One Small Move */}
        <div className="mt-6">
          <div className={sectionKicker(dark)}>One small move</div>

          {nextStepsStrengths ? (
            <div className="mt-3">
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
            <div className={["mt-3 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>Next steps are loading…</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default StrengthsTab;