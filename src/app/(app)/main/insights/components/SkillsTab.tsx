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
  Layers,
  Repeat,
  ScanSearch,
  CheckCircle2,
} from "lucide-react";

import { NextStepsStack } from "@/app/(app)/main/components/nextSteps/NextStepsStack";

/* =============================================================================
   Local types (kept local to avoid page.tsx exports)
   ============================================================================= */

type RGB = { r: number; g: number; b: number };

type NextStepsStackProps = React.ComponentProps<typeof NextStepsStack>;
type NextStepsDefinition = NextStepsStackProps["definition"];

type QuickRating = "mostly" | "somewhat" | "not_really";

const QUICK_FEEDBACK_STORAGE_KEY = "everleap.insights.skills.quickFeedback.v1";
const SKILLS_SELFREPORT_KEY = "everleap.insights.skillsSelfReport.v1";

/* =============================================================================
   Skill signals (compatible with Strengths/Motivations patterns)
   ============================================================================= */

type SkillSignalId = "action" | "people" | "curiosity" | "clarity";

type SkillSignalLike = {
  id: SkillSignalId;
  strength: number; // 0..1
  why?: string;
  examples?: string[];
};

/* =============================================================================
   Local UI helpers (match your MotivationsTab / StrengthsTab style)
   ============================================================================= */

type CSSVars = React.CSSProperties & { [key: `--${string}`]: string | number };

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

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
   Skills intro (agentic / counselor voice)
   ============================================================================= */

function skillsIntro(top: SkillSignalLike | null | undefined, name: string) {
  const hasName = !!(name ?? "").trim();
  const n = (name ?? "").trim();
  const prefix = hasName ? `${n}` : "Hey";

  const id: SkillSignalId = (top?.id ?? "clarity") as SkillSignalId;

  if (id === "action") {
    return `${prefix} — your skills profile leans “learn-by-doing.”

You get good fast when you can run reps. Skills for you should feel like moves: start, test, adjust, repeat.

We’ll treat your skills like a training plan — small reps, quick feedback, and visible wins.`;
  }

  if (id === "people") {
    return `${prefix} — your skills profile leans “people-powered.”

You level up when there’s real connection: a coach, a teammate, a collaborator, or an audience.

We’ll build skills that make you stronger with people — not “be social,” but “use humans as signal.”`;
  }

  if (id === "curiosity") {
    return `${prefix} — your skills profile leans “curiosity + pattern.”

You get sharper when you can investigate, experiment, and connect dots. Questions aren’t a distraction — they’re how you build mastery.

We’ll pick skills that turn curiosity into results instead of endless research.`;
  }

  return `${prefix} — your skills profile leans “clarity-driven.”

You get dangerous (in a good way) when the goal is real and the path makes sense. You like skills that create structure: define the problem, choose the next step, finish clean.

We’ll focus on skills that reduce noise and increase control.`;
}

/* =============================================================================
   Skills taxonomy (teen-facing) + scoring
   ============================================================================= */

type SkillId =
  | "close_loops"
  | "start_small"
  | "ask_clean_questions"
  | "sensemake"
  | "focus_block"
  | "feedback_rep"
  | "collab_lead"
  | "calm_under_pressure"
  | "build_systems"
  | "communicate_clean"
  | "fair_play_boundaries"
  | "explore_then_choose";

type SkillDef = {
  id: SkillId;
  label: string;
  accent: RGB;

  hook: string; // what it is
  because: string; // why you might be this way
  watchOut: string; // gentle watch-out

  signals: SkillSignalId[];
  keywords: string[];
};

type ScoredSkill = {
  def: SkillDef;
  score: number; // 0..1
  receipt?: string;
};

const SKILLS_TAXONOMY: SkillDef[] = [
  {
    id: "start_small",
    label: "Start small (on purpose)",
    accent: { r: 255, g: 190, b: 110 },
    hook: "You can turn ‘I should’ into motion by making the first step tiny and real.",
    because: "Your brain gets clarity from movement — starting creates signal.",
    watchOut: "If the first step is vague, you’ll stall and call it ‘not motivated.’",
    signals: ["action"],
    keywords: ["start", "begin", "try", "now", "first step", "jump in"],
  },
  {
    id: "close_loops",
    label: "Close loops",
    accent: { r: 120, g: 255, b: 190 },
    hook: "You’re good at finishing — shipping, polishing, and making it done.",
    because: "Completion gives you relief and confidence. You like clean outcomes.",
    watchOut: "If you wait for perfect, you can delay the last 10%.",
    signals: ["clarity", "action"],
    keywords: ["finish", "done", "ship", "complete", "wrap up", "final"],
  },
  {
    id: "ask_clean_questions",
    label: "Ask clean questions",
    accent: { r: 110, g: 230, b: 255 },
    hook: "You get smarter fast when you can turn curiosity into one sharp question.",
    because: "You learn by exploring — questions are fuel for you.",
    watchOut: "Questions can become hiding. Ask one, test one.",
    signals: ["curiosity"],
    keywords: ["question", "why", "how", "learn", "research", "curious", "explore"],
  },
  {
    id: "sensemake",
    label: "Sense-make the mess",
    accent: { r: 190, g: 140, b: 255 },
    hook: "You can turn chaos into: what’s true, what matters, what’s next.",
    because: "You’re tuned to structure. You hate fuzzy rules and fake logic.",
    watchOut: "Overthinking can delay action waiting for perfect clarity.",
    signals: ["clarity"],
    keywords: ["clarity", "organize", "explain", "plan", "structure", "priority"],
  },
  {
    id: "feedback_rep",
    label: "Use feedback as reps",
    accent: { r: 120, g: 200, b: 255 },
    hook: "You can take critique without collapsing — and turn it into improvement.",
    because: "You can separate ‘me’ from ‘my current draft.’ That’s a rare skill.",
    watchOut: "If feedback is disrespectful, it can hit hard. Choose good mirrors.",
    signals: ["people", "curiosity"],
    keywords: ["feedback", "coach", "critique", "improve", "lesson"],
  },
  {
    id: "communicate_clean",
    label: "Communicate cleanly",
    accent: { r: 255, g: 150, b: 230 },
    hook: "You can make ideas land: clear, simple, and actually persuasive.",
    because: "You notice what matters — emotionally and logically.",
    watchOut: "If you over-explain, your best point gets buried.",
    signals: ["people", "clarity"],
    keywords: ["explain", "present", "write", "message", "communicate", "story"],
  },
  {
    id: "collab_lead",
    label: "Collaborate (without drama)",
    accent: { r: 120, g: 200, b: 255 },
    hook: "You can work with people in a way that keeps momentum — not chaos.",
    because: "You read dynamics and can keep a group aligned.",
    watchOut: "If roles are unclear, you’ll carry too much.",
    signals: ["people"],
    keywords: ["team", "together", "group", "collab", "mentor", "coach"],
  },
  {
    id: "focus_block",
    label: "Focus block",
    accent: { r: 120, g: 255, b: 190 },
    hook: "When the goal is real, you can lock in harder than most people.",
    because: "You can tune out noise when the task feels worth it.",
    watchOut: "If the goal feels pointless, focus disappears fast (normal for you).",
    signals: ["clarity"],
    keywords: ["focus", "lock in", "deep", "attention", "zone"],
  },
  {
    id: "calm_under_pressure",
    label: "Calm under pressure",
    accent: { r: 255, g: 180, b: 120 },
    hook: "You can keep going when it’s uncomfortable — you don’t quit just because it’s hard.",
    because: "You have a real effort-tolerance muscle.",
    watchOut: "If you push nonstop, you can forget recovery and then crash.",
    signals: ["action"],
    keywords: ["hard", "pressure", "tough", "persist", "grind", "stress"],
  },
  {
    id: "build_systems",
    label: "Build systems",
    accent: { r: 110, g: 230, b: 255 },
    hook: "You like making repeatable routines and structures that actually work.",
    because: "You trust actions you can repeat. You like results you can touch.",
    watchOut: "If you don’t pick a target, you’ll build in random directions.",
    signals: ["action", "clarity"],
    keywords: ["system", "routine", "process", "build", "workflow", "habit"],
  },
  {
    id: "fair_play_boundaries",
    label: "Fair-play boundaries",
    accent: { r: 120, g: 200, b: 255 },
    hook: "You notice fairness and respect — and you protect it with boundaries.",
    because: "You’re tuned to values. You don’t ignore what feels wrong.",
    watchOut: "Unfairness can hijack your attention. Boundaries keep you free.",
    signals: ["people", "clarity"],
    keywords: ["fair", "respect", "rules", "right", "wrong", "boundary"],
  },
  {
    id: "explore_then_choose",
    label: "Explore, then choose",
    accent: { r: 190, g: 140, b: 255 },
    hook: "You can explore options without getting stuck — then commit to one lane.",
    because: "Novelty gives you signal. Curiosity is fuel.",
    watchOut: "If you never choose, you can live in ‘research mode.’",
    signals: ["curiosity", "clarity"],
    keywords: ["explore", "new", "experiment", "option", "choose", "decide"],
  },
];

function normalizeTextPieces(parts: string[]) {
  return parts
    .map((x) => (x ?? "").toString().trim())
    .filter(Boolean)
    .join(" | ")
    .toLowerCase();
}

function scoreSkills(args: { signals: SkillSignalLike[]; receipts: string[] }) {
  const { signals, receipts } = args;

  const signalScore = new Map<SkillSignalId, number>();
  for (const s of signals ?? []) signalScore.set(s.id, clamp01(s.strength ?? 0));

  const blob = normalizeTextPieces([
    ...(receipts ?? []).slice(0, 12),
    ...(signals ?? []).map((s) => s.why ?? ""),
    ...(signals ?? []).flatMap((s) => s.examples ?? []),
    ...(signals ?? []).map((s) => s.id),
  ]);

  const scored: ScoredSkill[] = SKILLS_TAXONOMY
    .map((sk) => {
      // baseline ensures we ALWAYS show something
      let s = 0.12;

      for (const sid of sk.signals) {
        s += (signalScore.get(sid) ?? 0) * 0.55;
      }

      const hits = sk.keywords.reduce((acc, k) => {
        const key = (k ?? "").toLowerCase();
        if (!key) return acc;
        return blob.includes(key) ? acc + 1 : acc;
      }, 0);

      s += Math.min(0.22, hits * 0.055);

      const topSignal = [...(signals ?? [])].sort((a, b) => (b.strength ?? 0) - (a.strength ?? 0))[0]?.id ?? null;
      if (topSignal && sk.signals.includes(topSignal)) s += 0.08;

      return { def: sk, score: clamp01(s) };
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const cleanReceipts = (receipts ?? [])
    .map((r) => (r ?? "").toString().trim())
    .filter((r) => r.length >= 6 && r.length <= 220);

  const attachReceipt = (m: ScoredSkill) => {
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

  const seen = new Set<SkillId>();
  const top: ScoredSkill[] = [];
  for (const m of topRaw) {
    if (seen.has(m.def.id)) continue;
    seen.add(m.def.id);
    top.push(m);
    if (top.length >= 4) break; // 4 cards like Strengths
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

function computeSignalConfidence(signals: SkillSignalLike[]): number {
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
   Icons per skill
   ============================================================================= */

function SkillIcon({ id }: { id: SkillId }) {
  const Icon =
    id === "start_small" ? Zap
    : id === "close_loops" ? CheckCircle2
    : id === "ask_clean_questions" ? ScanSearch
    : id === "sensemake" ? Brain
    : id === "focus_block" ? Compass
    : id === "feedback_rep" ? MessageCircle
    : id === "collab_lead" ? Users
    : id === "calm_under_pressure" ? Flame
    : id === "build_systems" ? Layers
    : id === "communicate_clean" ? Lightbulb
    : id === "fair_play_boundaries" ? HeartHandshake
    : id === "explore_then_choose" ? Trophy
    : Repeat;

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
   Self-report (inline expand; no modal) — skills-specific
   ============================================================================= */

function readSelfReport(): { text: string; savedAt: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SKILLS_SELFREPORT_KEY);
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
    SKILLS_SELFREPORT_KEY,
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
                Totally normal. Two quick ways to sharpen your skills:
              </div>
            </div>

            {saved ? (
              <div className={["text-[12px] font-semibold", dark ? "text-white/55" : "text-slate-600"].join(" ")}>(Saved)</div>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="https://dev.everleap.ai/main/questions?cat=skills&returnTo=/main/insights"
              className={primaryLinkButton(dark)}
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Answer skill prompts
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
                  What skills do you rely on when things matter?
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
                    placeholder="Type your skills…"
                    className={[
                      "w-full resize-none rounded-[18px] px-4 py-3 text-[14px] leading-relaxed",
                      "bg-transparent outline-none ring-1 ring-inset",
                      dark
                        ? "text-white placeholder:text-white/32 ring-white/12 focus:ring-white/20"
                        : "text-slate-900 placeholder:text-slate-500 ring-black/10 focus:ring-black/15",
                      "focus-visible:ring-2 focus-visible:ring-orange-200/20",
                    ].join(" ")}
                  />
                  <div className={["mt-2 text-[12px]", mutedText(dark)].join(" ")}>We’ll use this to tune your skills next time.</div>
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
                  <span className={dark ? "text-white/40" : "text-slate-600"}>{SKILLS_SELFREPORT_KEY}</span>
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
   Skill card (same structure as StrengthCard)
   ============================================================================= */

function SkillCard({ dark, item, signal }: { dark: boolean; item: ScoredSkill; signal: number }) {
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
                  <SkillIcon id={def.id} />
                </span>
              </div>

              <div className={["text-[14px] font-semibold", dark ? "text-white" : "text-slate-900"].join(" ")}>
                {def.label}
              </div>
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
   Model extraction (skillsModel passed from page.tsx)
   ============================================================================= */

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object";
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asNumber(v: unknown, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function asSignalId(v: unknown): SkillSignalId | null {
  return v === "action" || v === "people" || v === "curiosity" || v === "clarity" ? v : null;
}

function normalizeSignals(raw: unknown): SkillSignalLike[] {
  if (!Array.isArray(raw)) return [];
  const out: SkillSignalLike[] = [];
  for (const it of raw as Array<Record<string, unknown>>) {
    if (!isRecord(it)) continue;
    const id = asSignalId(it.id);
    if (!id) continue;
    out.push({
      id,
      strength: clamp01(asNumber(it.strength, 0)),
      why: asString(it.why, ""),
      examples: asStringArray(it.examples).slice(0, 2),
    });
  }
  return out;
}

function extractReceiptsFromSignals(signals: SkillSignalLike[]) {
  const receipts: string[] = [];
  for (const s of signals) {
    for (const ex of s.examples ?? []) {
      const t = (ex ?? "").toString().trim();
      if (t && t.length >= 6 && t.length <= 220 && !receipts.includes(t)) receipts.push(t);
      if (receipts.length >= 4) break;
    }
    if (receipts.length >= 4) break;
  }
  return receipts;
}

function readSkillSignalsFromModel(model: unknown): SkillSignalLike[] {
  const m = model;

  let summary: Record<string, unknown> | null = null;
  if (isRecord(m) && isRecord(m.summary)) summary = m.summary as Record<string, unknown>;
  else if (isRecord(m) && isRecord(m.vm) && isRecord((m.vm as Record<string, unknown>).summary)) {
    summary = (m.vm as Record<string, unknown>).summary as Record<string, unknown>;
  } else if (isRecord(m) && isRecord(m.source) && isRecord((m.source as Record<string, unknown>).summary)) {
    summary = (m.source as Record<string, unknown>).summary as Record<string, unknown>;
  }

  const signalBarRaw = summary?.signalBar ?? (isRecord(m) ? (m as Record<string, unknown>).signalBar : undefined);
  return normalizeSignals(signalBarRaw);
}

/* =============================================================================
   Component
   ============================================================================= */

export default function SkillsTab(props: {
  dark: boolean;
  mounted: boolean;
  tab: string;
  nameFromHeadline: string;
  model: unknown; // matches page.tsx: model={skillsModel}
  nextStepsSkills: NextStepsDefinition | null;
}): React.JSX.Element {
  const { dark, mounted, tab, nameFromHeadline, model, nextStepsSkills } = props;

  const safeSignals = React.useMemo(() => readSkillSignalsFromModel(model), [model]);

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
    const list: string[] = [];
    if ((selfReport ?? "").trim().length >= 6) list.push(selfReport.trim());
    list.push(...extractReceiptsFromSignals(safeSignals));
    return list;
  }, [safeSignals, selfReport]);

  const scored = React.useMemo(() => scoreSkills({ signals: safeSignals, receipts }), [safeSignals, receipts]);

  return (
    <section className="mb-6">
      <div className={readingSurface(dark)}>
        <div className="relative">
          <div className={sectionKicker(dark)}>Skills</div>

          <div
            className={[
              "mt-2 text-[20px] md:text-[22px] font-semibold tracking-tight leading-snug",
              dark ? "text-white" : "text-slate-900",
            ].join(" ")}
          >
            What you can do — on purpose — when it matters.
          </div>

          <p className={["mt-3 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>
            {skillsIntro(topSignal, nameFromHeadline)}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className={pillBase(dark)}>
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  background:
                    signal >= 0.72
                      ? "rgba(120,255,190,0.95)"
                      : signal >= 0.45
                        ? "rgba(120,200,255,0.95)"
                        : "rgba(255,180,120,0.95)",
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
          <div className={sectionKicker(dark)}>Your top skills</div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {(scored.top ?? []).map((m) => (
              <SkillCard key={m.def.id} dark={dark} item={m} signal={signal} />
            ))}
          </div>

          <div className={["mt-3 text-[12.5px] leading-relaxed", dark ? "text-white/45" : "text-slate-600"].join(" ")}>
            This gets sharper as you answer more prompts.
          </div>
        </div>

        {/* ✅ Quick Check should come BEFORE Next Steps */}
        <QuickFeedbackInline dark={dark} contextTag={`insights:${tab}:skills`} />

        {/* Next Steps */}
        <div className="mt-6">
          <div className={sectionKicker(dark)}>Next Steps</div>

          {nextStepsSkills ? (
            <div className="mt-3">
              <NextStepsStack
                dark={dark}
                useLocal={mounted}
                definition={nextStepsSkills}
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