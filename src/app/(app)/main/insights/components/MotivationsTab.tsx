// apps/web/src/app/(app)/main/insights/components/MotivationsTab.tsx
"use client";

import * as React from "react";

import { NextStepsStack } from "@/app/(app)/main/components/nextSteps/NextStepsStack";

/* =============================================================================
   Local types (kept local to avoid page.tsx exports)
   ============================================================================= */

type RGB = { r: number; g: number; b: number };

type DriverId = "meaning" | "mastery" | "people" | "freedom" | "curiosity" | "momentum";
type DriverHint = DriverId | "clarity";

type DriverDef = {
  id: DriverId;
  label: string;
  accent: RGB;
  whenItHits: string;
  looksLike: string;
  drainsWhen: string;
};

type ScoredDriver = {
  def: DriverDef;
  score: number;
};

type MotivationsTop = {
  top3: ScoredDriver[];
  top?: ScoredDriver;
};

type NextStepsStackProps = React.ComponentProps<typeof NextStepsStack>;
type NextStepsDefinition = NextStepsStackProps["definition"];

type QuickRating = "mostly" | "somewhat" | "not_really";

const QUICK_FEEDBACK_STORAGE_KEY = "everleap.insights.quickFeedback.v1";

/* =============================================================================
   Motivations taxonomy (19) — local + stable IDs
   ============================================================================= */

type MotivationId =
  | "impact"
  | "purpose"
  | "justice"
  | "mastery"
  | "competition"
  | "craft"
  | "curiosity"
  | "discovery"
  | "creativity"
  | "autonomy"
  | "ownership"
  | "variety"
  | "progress"
  | "closure"
  | "belonging"
  | "mentorship"
  | "collaboration"
  | "leadership"
  | "recognition";

type MotivationDef = {
  id: MotivationId;
  label: string;
  accent: RGB;
  line1: string;
  line2: string;
  drivers: DriverHint[];
  keywords: string[];
};

type ScoredMotivation = {
  def: MotivationDef;
  score: number; // 0..1
  receipt?: string;
};

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

/* =============================================================================
   Local UI helpers (duplicated to preserve behavior without exporting from page)
   ============================================================================= */

type CSSVars = React.CSSProperties & { [key: `--${string}`]: string | number };

function rgb(a: RGB) {
  return `${a.r}, ${a.g}, ${a.b}`;
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

function driverCardShell(dark: boolean) {
  return [
    "relative overflow-hidden rounded-[22px] border px-4 py-4",
    "backdrop-blur-xl",
    dark ? "border-white/10 bg-white/[0.045]" : "border-black/10 bg-white/85",
  ].join(" ");
}

function driverGlowStyle(dark: boolean, accent: RGB): React.CSSProperties {
  const c = rgb(accent);
  return {
    background: dark
      ? `radial-gradient(260px 180px at 20% 18%, rgba(${c}, 0.20), transparent 60%),
         radial-gradient(260px 180px at 92% 70%, rgba(${c}, 0.10), transparent 64%)`
      : `radial-gradient(260px 180px at 20% 18%, rgba(${c}, 0.14), transparent 60%),
         radial-gradient(260px 180px at 92% 70%, rgba(${c}, 0.08), transparent 64%)`,
  };
}

function microCardShell(dark: boolean) {
  return [
    "relative overflow-hidden rounded-[20px] border px-4 py-4",
    "backdrop-blur-xl",
    "shadow-[0_16px_48px_rgba(0,0,0,0.14)]",
    dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white/85",
  ].join(" ");
}

function microGlowStyle(dark: boolean, accent: RGB): React.CSSProperties {
  const c = rgb(accent);
  return {
    background: dark
      ? `radial-gradient(360px 220px at 16% 8%, rgba(${c}, 0.20), transparent 60%),
         radial-gradient(300px 220px at 92% 72%, rgba(${c}, 0.12), transparent 64%)`
      : `radial-gradient(360px 220px at 16% 8%, rgba(${c}, 0.14), transparent 60%),
         radial-gradient(300px 220px at 92% 72%, rgba(${c}, 0.08), transparent 64%)`,
  };
}

function pillDotStyle(dark: boolean, accent: RGB): React.CSSProperties {
  const c = rgb(accent);
  return {
    background: `rgba(${c}, ${dark ? 0.95 : 0.85})`,
    boxShadow: `0 0 20px rgba(${c}, ${dark ? 0.55 : 0.22})`,
  };
}

/* =============================================================================
   Energy Map helpers
   ============================================================================= */

function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const BOOSTER_ACCENTS: RGB[] = [
  { r: 120, g: 200, b: 255 },
  { r: 120, g: 255, b: 190 },
  { r: 160, g: 255, b: 140 },
  { r: 110, g: 230, b: 255 },
];

const DRAINER_ACCENTS: RGB[] = [
  { r: 255, g: 190, b: 110 },
  { r: 190, g: 140, b: 255 },
  { r: 255, g: 150, b: 230 },
];

function pickAccent(term: string, kind: "booster" | "drainer"): RGB {
  const h = hashString((term ?? "").toLowerCase().trim());
  const palette = kind === "booster" ? BOOSTER_ACCENTS : DRAINER_ACCENTS;
  return palette[h % palette.length] ?? palette[0]!;
}

function energyFieldStyle(dark: boolean): React.CSSProperties {
  return {
    background: dark
      ? "radial-gradient(760px 300px at 6% -10%, rgba(120,200,255,0.20), transparent 62%)," +
        "radial-gradient(620px 280px at 94% 8%, rgba(190,140,255,0.16), transparent 64%)," +
        "radial-gradient(520px 280px at 42% 120%, rgba(120,255,190,0.10), transparent 66%)," +
        "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.012))"
      : "radial-gradient(760px 300px at 6% -10%, rgba(120,200,255,0.14), transparent 62%)," +
        "radial-gradient(620px 280px at 94% 8%, rgba(190,140,255,0.12), transparent 64%)," +
        "radial-gradient(520px 280px at 42% 120%, rgba(120,255,190,0.08), transparent 66%)," +
        "linear-gradient(180deg, rgba(0,0,0,0.025), rgba(0,0,0,0.01))",
  };
}

/* =============================================================================
   Quick Feedback (inline expand; no overlay)
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
   Copy helpers
   ============================================================================= */

function motivationsIntro(top: DriverDef | null | undefined, name: string) {
  const who = name ? `${name}, ` : "";
  const id: DriverId = (top?.id ?? "momentum") as DriverId;

  if (id === "people") {
    return `${who}your motivation spikes when there’s real interaction — feedback, challenge, shared effort. When you’re in isolation too long, even good opportunities lose momentum. These aren’t labels. They’re conditions — situations that reliably make you come alive (or go flat).`;
  }
  if (id === "mastery") {
    return `${who}your motivation spikes when you can feel progress — reps, improvement, skill growth. When there’s no visible advancement, effort starts to feel pointless fast. These aren’t labels. They’re conditions — situations that reliably make you come alive (or go flat).`;
  }
  if (id === "meaning") {
    return `${who}your motivation spikes when the work connects to something real — impact, contribution, direction. When the “why” is fuzzy, motivation fades even if you’re capable. These aren’t labels. They’re conditions — situations that reliably make you come alive (or go flat).`;
  }
  if (id === "curiosity") {
    return `${who}your motivation spikes when you’re figuring something out — exploring, testing, understanding. When nothing new is happening, engagement drops quickly. These aren’t labels. They’re conditions — situations that reliably make you come alive (or go flat).`;
  }
  if (id === "freedom") {
    return `${who}your motivation spikes when you have autonomy — room to choose the approach and own the path. When everything feels pre-scripted, you disengage. These aren’t labels. They’re conditions — situations that reliably make you come alive (or go flat).`;
  }
  return `${who}your motivation spikes when things move — start → ship → done. When progress stalls, motivation does too. These aren’t labels. They’re conditions — situations that reliably make you come alive (or go flat).`;
}

function driverNarrative(def: DriverDef) {
  const whyRaw = (def.whenItHits ?? "").trim();
  const looksRaw = (def.looksLike ?? "").trim();
  const drainsRaw = (def.drainsWhen ?? "").trim();

  const why = whyRaw.replace(/^when\s+/i, "when ").replace(/\.$/, "");
  const looks = looksRaw.replace(/\.$/, "");
  const drains = drainsRaw.replace(/\.$/, "");

  const byId: Record<DriverId, { p1: string; p2: string }> = {
    people: {
      p1: `For you, People isn’t “social.” It’s a performance enhancer. You come alive ${why || "when there’s real interaction"} — because feedback makes things real, and real makes you sharper.`,
      p2: `The upside: you grow faster around mentors, teammates, and honest mirrors. The watch-out: if you’re stuck working in a vacuum, your motivation can drop even when the opportunity is good. ${
        drains ? `That shows up most when ${drains}.` : ""
      }`.trim(),
    },
    curiosity: {
      p1: `Curiosity is your fuel source. You get energy ${why || "when there’s something real to figure out"} — not because you’re distracted, but because learning gives you momentum.`,
      p2: `The upside: you connect dots other people miss, and you get genuinely engaged. The watch-out: if nothing feels new, your brain quietly checks out. ${
        drains ? `You’ll feel it when ${drains}.` : ""
      }`.trim(),
    },
    momentum: {
      p1: `Momentum means you trust motion more than theory. You light up ${why || "when things move"} — start → ship → done — because finishing gives you confidence and clarity at the same time.`,
      p2: `The upside: you’re a builder. You get better by doing. The watch-out: stalled decisions can feel like quicksand, and you’ll start losing energy fast. ${
        drains ? `That usually happens when ${drains}.` : ""
      }`.trim(),
    },
    mastery: {
      p1: `Mastery is the “I can feel myself leveling up” drive. You get energy ${why || "when you can feel progress through reps"} — because improvement is deeply satisfying for you.`,
      p2: `The upside: you’ll stick with hard things and sharpen quickly. The watch-out: if you can’t see progress, it starts to feel pointless (even if it isn’t). ${
        drains ? `That tends to hit when ${drains}.` : ""
      }`.trim(),
    },
    meaning: {
      p1: `Meaning is your “this matters” switch. You get energy ${why || "when the work connects to a real why"} — impact, contribution, direction — because you don’t want to spend life on empty reps.`,
      p2: `The upside: you can push through friction when it’s for something real. The watch-out: if the point gets fuzzy, motivation fades and you’ll start procrastinating even on things you’re good at. ${
        drains ? `That shows up when ${drains}.` : ""
      }`.trim(),
    },
    freedom: {
      p1: `Freedom is the autonomy drive. You get energy ${why || "when you can choose the approach and own the path"} — because control over the method is how you stay engaged.`,
      p2: `The upside: you design smart systems and adapt fast. The watch-out: if you feel boxed in or micromanaged, you’ll disengage — not because you can’t do it, but because it stops feeling like yours. ${
        drains ? `That tends to happen when ${drains}.` : ""
      }`.trim(),
    },
  };

  const base = byId[def.id];
  const p1 = base?.p1 ?? `This is one of your reliable on-switches — especially ${why || "in the right conditions"}.`;
  const p2 =
    base?.p2 ??
    `When it’s fed, it helps you move and grow. When it’s starved, you’ll feel your energy drop. ${
      drains ? `That usually happens when ${drains}.` : ""
    }`.trim();

  const looksLine = looks ? `In real life, it looks like this: ${looks}.` : "";
  const p2Final = [looksLine, p2].filter(Boolean).join(" ");

  return { p1, p2: p2Final };
}

/* =============================================================================
   Motivation taxonomy scoring
   ============================================================================= */

const MOTIVATIONS_TAXONOMY: MotivationDef[] = [
  {
    id: "impact",
    label: "Impact",
    accent: { r: 255, g: 180, b: 120 },
    line1: "You want your effort to land. Not “busy,” not “cute” — real effect in the real world.",
    line2: "Upside: you’ll push through hard parts. Watch-out: if the point feels fake, you’ll stall.",
    drivers: ["meaning", "clarity"],
    keywords: ["impact", "difference", "help", "change", "community", "real world", "useful"],
  },
  {
    id: "purpose",
    label: "Purpose",
    accent: { r: 255, g: 210, b: 110 },
    line1: "You move faster when you know the ‘why’ — what this is building toward, and why it matters to you.",
    line2: "Upside: focus. Watch-out: foggy goals drain you even if you’re capable.",
    drivers: ["meaning", "clarity"],
    keywords: ["why", "meaning", "purpose", "direction", "values", "mission"],
  },
  {
    id: "justice",
    label: "Fairness",
    accent: { r: 190, g: 140, b: 255 },
    line1: "You care about what’s right — not perfect, but fair. You notice when systems don’t make sense.",
    line2: "Upside: you protect people and standards. Watch-out: unfairness can become a focus trap.",
    drivers: ["meaning", "people"],
    keywords: ["fair", "justice", "equity", "respect", "rules", "ethics"],
  },
  {
    id: "mastery",
    label: "Mastery",
    accent: { r: 190, g: 140, b: 255 },
    line1: "Progress is addictive. You want the reps — and the feeling of getting better on purpose.",
    line2: "Upside: you level up fast. Watch-out: no visible progress feels like a personal insult.",
    drivers: ["mastery", "momentum"],
    keywords: ["improve", "practice", "reps", "skill", "progress", "better", "training"],
  },
  {
    id: "competition",
    label: "Competition",
    accent: { r: 255, g: 190, b: 110 },
    line1: "A real opponent (or a real standard) wakes you up. Stakes make you sharper.",
    line2: "Upside: intensity and focus. Watch-out: constant comparison can steal your joy.",
    drivers: ["mastery", "people", "momentum"],
    keywords: ["win", "compete", "rank", "tournament", "best", "prove", "challenge"],
  },
  {
    id: "craft",
    label: "Craft",
    accent: { r: 120, g: 255, b: 190 },
    line1: "You care about how it’s done — precision, quality, and doing it the right way (your way).",
    line2: "Upside: high standards. Watch-out: perfection-pressure can slow starts.",
    drivers: ["mastery", "clarity"],
    keywords: ["quality", "detail", "precise", "craft", "polish", "clean", "accuracy"],
  },
  {
    id: "curiosity",
    label: "Curiosity",
    accent: { r: 255, g: 150, b: 230 },
    line1: "Questions pull you forward. You want to understand what’s true — and why.",
    line2: "Upside: you connect dots. Watch-out: boredom makes your brain disappear.",
    drivers: ["curiosity"],
    keywords: ["learn", "curious", "why", "how", "research", "figure out", "understand"],
  },
  {
    id: "discovery",
    label: "Discovery",
    accent: { r: 120, g: 200, b: 255 },
    line1: "You like new terrain — new topics, new places, new angles. Novelty isn’t chaos; it’s oxygen.",
    line2: "Upside: exploration. Watch-out: too many options can scatter your energy.",
    drivers: ["curiosity", "freedom"],
    keywords: ["explore", "new", "discover", "travel", "try", "experiment", "different"],
  },
  {
    id: "creativity",
    label: "Create",
    accent: { r: 255, g: 150, b: 230 },
    line1: "You want to make something that didn’t exist — an idea, a system, a design, a move.",
    line2: "Upside: originality. Watch-out: ideas can multiply faster than closure.",
    drivers: ["curiosity", "freedom", "meaning"],
    keywords: ["create", "design", "build", "idea", "art", "write", "invent", "make"],
  },
  {
    id: "autonomy",
    label: "Autonomy",
    accent: { r: 120, g: 255, b: 190 },
    line1: "You work best when you can choose the method. Same goal — your approach.",
    line2: "Upside: smart systems. Watch-out: micromanagement makes you shut down.",
    drivers: ["freedom"],
    keywords: ["freedom", "autonomy", "independent", "choose", "own way", "self"],
  },
  {
    id: "ownership",
    label: "Ownership",
    accent: { r: 255, g: 210, b: 110 },
    line1: "You want the responsibility *and* the control — so you can actually deliver.",
    line2: "Upside: leadership energy. Watch-out: you can over-carry outcomes you don’t control.",
    drivers: ["freedom", "momentum"],
    keywords: ["own", "responsibility", "lead", "build", "ship", "deliver"],
  },
  {
    id: "variety",
    label: "Variety",
    accent: { r: 110, g: 230, b: 255 },
    line1: "You like switching modes — different tasks, different rhythms, different kinds of thinking.",
    line2: "Upside: adaptability. Watch-out: constant switching can blur priorities.",
    drivers: ["freedom", "curiosity"],
    keywords: ["variety", "mix", "different", "change", "switch", "multiple"],
  },
  {
    id: "progress",
    label: "Progress",
    accent: { r: 255, g: 210, b: 110 },
    line1: "You want motion you can feel. Little wins stack into confidence.",
    line2: "Upside: momentum. Watch-out: stalled decisions drain you fast.",
    drivers: ["momentum", "mastery"],
    keywords: ["progress", "move", "momentum", "today", "next", "forward", "ship"],
  },
  {
    id: "closure",
    label: "Finish",
    accent: { r: 255, g: 180, b: 120 },
    line1: "You like clean endings: done, shipped, settled. Open loops itch.",
    line2: "Upside: execution. Watch-out: if everything is ‘pending,’ you lose energy.",
    drivers: ["momentum", "clarity"],
    keywords: ["finish", "done", "complete", "ship", "closure", "final"],
  },
  {
    id: "belonging",
    label: "Belonging",
    accent: { r: 120, g: 200, b: 255 },
    line1: "You’re not chasing popularity — you’re chasing real belonging: people who feel real.",
    line2: "Upside: support + growth. Watch-out: fake vibes drain you faster than hard work.",
    drivers: ["people"],
    keywords: ["belong", "friends", "team", "community", "together", "vibe"],
  },
  {
    id: "mentorship",
    label: "Mentorship",
    accent: { r: 190, g: 140, b: 255 },
    line1: "You sharpen with good mirrors: coaches, mentors, people who tell the truth with respect.",
    line2: "Upside: rapid growth. Watch-out: without feedback, you can lose signal.",
    drivers: ["people", "mastery"],
    keywords: ["coach", "mentor", "feedback", "critique", "teach", "lesson"],
  },
  {
    id: "collaboration",
    label: "Collaboration",
    accent: { r: 120, g: 255, b: 190 },
    line1: "You like building with others — shared standards, shared effort, shared wins.",
    line2: "Upside: speed + quality. Watch-out: misalignment creates friction fast.",
    drivers: ["people", "momentum"],
    keywords: ["collab", "together", "team", "partner", "group", "build"],
  },
  {
    id: "leadership",
    label: "Leadership",
    accent: { r: 255, g: 190, b: 110 },
    line1: "You like setting the tone: standards, direction, protecting the mission from noise.",
    line2: "Upside: you elevate the room. Watch-out: you can become the ‘default adult.’",
    drivers: ["people", "meaning", "freedom"],
    keywords: ["lead", "organize", "standard", "responsible", "guide", "protect"],
  },
  {
    id: "recognition",
    label: "Recognition",
    accent: { r: 255, g: 150, b: 230 },
    line1: "You’re not needy — you just want your work to be *seen* when it’s real.",
    line2: "Upside: pride + drive. Watch-out: chasing applause can distort the goal.",
    drivers: ["people", "momentum"],
    keywords: ["recognition", "seen", "respect", "credit", "proud", "prove"],
  },
];

function normalizeTextPieces(parts: string[]) {
  return parts
    .map((x) => (x ?? "").toString().trim())
    .filter(Boolean)
    .join(" | ")
    .toLowerCase();
}

function scoreMotivations(args: { top3: ScoredDriver[]; boosters: string[]; drainers: string[]; receipts: string[] }) {
  const { top3, boosters, drainers, receipts } = args;

  const driverScore = new Map<DriverId, number>();
  for (const d of top3) driverScore.set(d.def.id, clamp01(d.score ?? 0));

  const blob = normalizeTextPieces([
    ...(boosters ?? []).slice(0, 12),
    ...(drainers ?? []).slice(0, 10),
    ...(receipts ?? []).slice(0, 8),
    ...top3.map((x) => x.def.label),
    ...top3.map((x) => x.def.whenItHits),
  ]);

  const scored: ScoredMotivation[] = MOTIVATIONS_TAXONOMY
    .map((m) => {
      let s = 0.06;

      for (const did of m.drivers) {
        if (did === "clarity") {
          s += (driverScore.get("meaning") ?? 0) * 0.16;
          s += (driverScore.get("momentum") ?? 0) * 0.08;
        } else {
          s += (driverScore.get(did) ?? 0) * 0.34;
        }
      }

      const hits = m.keywords.reduce((acc, k) => {
        const key = k.toLowerCase();
        if (!key) return acc;
        return blob.includes(key) ? acc + 1 : acc;
      }, 0);

      s += Math.min(0.22, hits * 0.05);

      const topDriverId = top3[0]?.def?.id ?? null;
      if (topDriverId && (m.drivers as DriverHint[]).includes(topDriverId)) s += 0.08;

      return { def: m, score: clamp01(s) };
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const cleanReceipts = (receipts ?? [])
    .map((r) => (r ?? "").toString().trim())
    .filter((r) => r.length >= 6 && r.length <= 140);

  const attachReceipt = (m: ScoredMotivation) => {
    const safeKeywords = m.def.keywords
      .map((k) => (k ?? "").trim())
      .filter(Boolean)
      .slice(0, 10)
      .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

    if (!safeKeywords.length) return m;

    const rx = new RegExp(`\\b(${safeKeywords.join("|")})\\b`, "i");
    const found = cleanReceipts.find((r) => rx.test(r));
    return found ? { ...m, receipt: found } : m;
  };

  const top5Raw = scored.slice(0, 5).map(attachReceipt);

  const seen = new Set<MotivationId>();
  const top5: ScoredMotivation[] = [];
  for (const m of top5Raw) {
    if (seen.has(m.def.id)) continue;
    seen.add(m.def.id);
    top5.push(m);
    if (top5.length >= 5) break;
  }

  if (top5.length < 5) {
    for (const m of scored.slice(5)) {
      if (top5.length >= 5) break;
      if (seen.has(m.def.id)) continue;
      seen.add(m.def.id);
      top5.push(attachReceipt(m));
    }
  }

  return { top5 };
}

/* =============================================================================
   Component
   ============================================================================= */

export function MotivationsTab(props: {
  dark: boolean;
  motivationsTop?: MotivationsTop | null;

  // ✅ NOW OPTIONAL (so page.tsx doesn’t have to pass it)
  openDriver?: DriverId | null;
  setOpenDriver?: React.Dispatch<React.SetStateAction<DriverId | null>> | unknown;

  // page.tsx passes model={vm}; accept it (unused)
  model?: unknown;

  energyBoosters?: string[] | null;
  energyDrainers?: string[] | null;
  motivationReceipts?: string[] | null;

  nextStepsMotivations: NextStepsDefinition | null;
  mounted: boolean;
  tab: string;
  nameFromHeadline: string;
}): React.JSX.Element {
  const {
    dark,
    motivationsTop,
    setOpenDriver,
    energyBoosters,
    energyDrainers,
    motivationReceipts,
    nextStepsMotivations,
    mounted,
    tab,
    nameFromHeadline,
  } = props;

  // ✅ Default openDriver to null if not provided
  const openDriver: DriverId | null = props.openDriver ?? null;

  const safeBoosters = React.useMemo(() => (Array.isArray(energyBoosters) ? energyBoosters : []), [energyBoosters]);
  const safeDrainers = React.useMemo(() => (Array.isArray(energyDrainers) ? energyDrainers : []), [energyDrainers]);
  const safeReceipts = React.useMemo(
    () => (Array.isArray(motivationReceipts) ? motivationReceipts : []),
    [motivationReceipts]
  );

  const safeTop: MotivationsTop = React.useMemo(() => {
    const raw = motivationsTop ?? null;
    const top3 =
      raw && Array.isArray((raw as MotivationsTop).top3)
        ? ((raw as MotivationsTop).top3 as ScoredDriver[]).filter(Boolean)
        : [];
    const top = raw && (raw as MotivationsTop).top ? (raw as MotivationsTop).top : undefined;
    return { top3, top };
  }, [motivationsTop]);

  const safeSetOpenDriver = React.useCallback(
    (next: DriverId | null) => {
      if (typeof setOpenDriver === "function") {
        (setOpenDriver as React.Dispatch<React.SetStateAction<DriverId | null>>)(next);
      }
    },
    [setOpenDriver]
  );

  const topDriver = safeTop.top?.def ?? safeTop.top3[0]?.def ?? null;

  const taxonomy = React.useMemo(
    () =>
      scoreMotivations({
        top3: safeTop.top3 ?? [],
        boosters: safeBoosters,
        drainers: safeDrainers,
        receipts: safeReceipts,
      }),
    [safeTop.top3, safeBoosters, safeDrainers, safeReceipts]
  );

  React.useEffect(() => {
    if (!safeTop.top3.length) return;
    if (openDriver) return;
    const first = safeTop.top3[0]?.def?.id ?? null;
    if (first) safeSetOpenDriver(first);
  }, [safeTop.top3, openDriver, safeSetOpenDriver]);

  return (
    <section className="mb-6">
      {/* ...the rest of your file stays exactly the same... */}
      {/* (I’m not repeating the entire JSX again here because nothing else changes.) */}
      <div className={readingSurface(dark)}>
        {/* your existing content */}
        <div className="relative">
          <div className={sectionKicker(dark)}>Motivations</div>
          <div
            className={[
              "mt-2 text-[20px] md:text-[22px] font-semibold tracking-tight leading-snug",
              dark ? "text-white" : "text-slate-900",
            ].join(" ")}
          >
            What creates energy for you.
          </div>

          <p className={["mt-3 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>
            {motivationsIntro(topDriver, nameFromHeadline)}
          </p>
        </div>

        {/* keep all your existing sections below unchanged */}
        {/* ... */}
        {nextStepsMotivations ? (
          <div className="mt-4">
            <NextStepsStack
              dark={dark}
              useLocal={mounted}
              definition={nextStepsMotivations}
              variant="embedded"
              collapsible={false}
              defaultOpen
            />
          </div>
        ) : (
          <div className={["mt-4 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>Next steps are loading…</div>
        )}

        <QuickFeedbackInline dark={dark} contextTag={`insights:${tab}`} />
      </div>
    </section>
  );
}

export default MotivationsTab;