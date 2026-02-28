"use client";

import * as React from "react";

import { NextStepsStack } from "@/app/(app)/main/components/nextSteps/NextStepsStack";

/* =============================================================================
   Local types (kept local to avoid page.tsx exports)
   ============================================================================= */

type RGB = { r: number; g: number; b: number };

type DriverId = "meaning" | "mastery" | "people" | "freedom" | "curiosity" | "momentum";

type DriverDef = {
  id: DriverId;
  label: string;
  accent: RGB;
  whenItHits: string;
  looksLike: string;
  drainsWhen: string;
  // tryThis removed — actions live in Tiny Tasks / NextStepsStack
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

/* =============================================================================
   Energy Map helpers (stronger color pills + hover)
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
  { r: 120, g: 200, b: 255 }, // sky
  { r: 120, g: 255, b: 190 }, // mint
  { r: 160, g: 255, b: 140 }, // lime
  { r: 110, g: 230, b: 255 }, // cyan
];

const DRAINER_ACCENTS: RGB[] = [
  { r: 255, g: 190, b: 110 }, // amber
  { r: 190, g: 140, b: 255 }, // violet
  { r: 255, g: 150, b: 230 }, // pink
];

function pickAccent(term: string, kind: "booster" | "drainer"): RGB {
  const h = hashString((term ?? "").toLowerCase().trim());
  const palette = kind === "booster" ? BOOSTER_ACCENTS : DRAINER_ACCENTS;
  return palette[h % palette.length] ?? palette[0]!;
}

function energyFieldStyle(dark: boolean): React.CSSProperties {
  // IMPORTANT: no negative insets -> avoids left bleed.
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
   Quick Feedback (inline expand; no overlay) — duplicated verbatim
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
   Copy helpers
   ============================================================================= */

function motivationsIntro(top: DriverDef, name: string) {
  const who = name ? `${name}, ` : "";
  if (top.id === "people") {
    return `${who}your motivation spikes when there’s real interaction — feedback, challenge, shared effort. When you’re in isolation too long, even good opportunities lose momentum. These three drivers are the conditions that most reliably create energy for you.`;
  }
  if (top.id === "mastery") {
    return `${who}your motivation spikes when you can feel progress — reps, improvement, skill growth. When there’s no visible advancement, effort starts to feel pointless fast. These three drivers are the conditions that most reliably create energy for you.`;
  }
  if (top.id === "meaning") {
    return `${who}your motivation spikes when the work connects to something real — impact, contribution, direction. When the “why” is fuzzy, motivation fades even if you’re capable. These three drivers are the conditions that most reliably create energy for you.`;
  }
  if (top.id === "curiosity") {
    return `${who}your motivation spikes when you’re figuring something out — exploring, testing, understanding. When nothing new is happening, engagement drops quickly. These three drivers are the conditions that most reliably create energy for you.`;
  }
  if (top.id === "freedom") {
    return `${who}your motivation spikes when you have autonomy — room to choose the approach and own the path. When everything feels pre-scripted, you disengage. These three drivers are the conditions that most reliably create energy for you.`;
  }
  return `${who}your motivation spikes when things move — start → ship → done. When progress stalls, motivation does too. These three drivers are the conditions that most reliably create energy for you.`;
}

function driverNarrative(def: DriverDef) {
  // speak like a person, not a UI:
  // - why it’s there
  // - what it means
  // - how it helps / how it can trip you up
  const whyRaw = (def.whenItHits ?? "").trim();
  const looksRaw = (def.looksLike ?? "").trim();
  const drainsRaw = (def.drainsWhen ?? "").trim();

  const why = whyRaw.replace(/^when\s+/i, "when ").replace(/\.$/, "");
  const looks = looksRaw.replace(/\.$/, "");
  const drains = drainsRaw.replace(/\.$/, "");

  const byId: Record<DriverId, { p1: string; p2: string }> = {
    people: {
      p1: `For you, People isn’t “social.” It’s a performance enhancer. You come alive ${why || "when there’s real interaction"} — because feedback makes things real, and real makes you sharper.`,
      p2: `The upside: you grow faster around mentors, teammates, and honest mirrors. The watch-out: if you’re stuck working in a vacuum, your motivation can drop even when the opportunity is good. ${drains ? `That shows up most when ${drains}.` : ""}`.trim(),
    },
    curiosity: {
      p1: `Curiosity is your fuel source. You get energy ${why || "when there’s something real to figure out"} — not because you’re distracted, but because learning gives you momentum.`,
      p2: `The upside: you connect dots other people miss, and you get genuinely engaged. The watch-out: if nothing feels new, your brain quietly checks out. ${drains ? `You’ll feel it when ${drains}.` : ""}`.trim(),
    },
    momentum: {
      p1: `Momentum means you trust motion more than theory. You light up ${why || "when things move"} — start → ship → done — because finishing gives you confidence and clarity at the same time.`,
      p2: `The upside: you’re a builder. You get better by doing. The watch-out: stalled decisions can feel like quicksand, and you’ll start losing energy fast. ${drains ? `That usually happens when ${drains}.` : ""}`.trim(),
    },
    mastery: {
      p1: `Mastery is the “I can feel myself leveling up” drive. You get energy ${why || "when you can feel progress through reps"} — because improvement is deeply satisfying for you.`,
      p2: `The upside: you’ll stick with hard things and sharpen quickly. The watch-out: if you can’t see progress, it starts to feel pointless (even if it isn’t). ${drains ? `That tends to hit when ${drains}.` : ""}`.trim(),
    },
    meaning: {
      p1: `Meaning is your “this matters” switch. You get energy ${why || "when the work connects to a real why"} — impact, contribution, direction — because you don’t want to spend life on empty reps.`,
      p2: `The upside: you can push through friction when it’s for something real. The watch-out: if the point gets fuzzy, motivation fades and you’ll start procrastinating even on things you’re good at. ${drains ? `That shows up when ${drains}.` : ""}`.trim(),
    },
    freedom: {
      p1: `Freedom is the autonomy drive. You get energy ${why || "when you can choose the approach and own the path"} — because control over the method is how you stay engaged.`,
      p2: `The upside: you design smart systems and adapt fast. The watch-out: if you feel boxed in or micromanaged, you’ll disengage — not because you can’t do it, but because it stops feeling like yours. ${drains ? `That tends to happen when ${drains}.` : ""}`.trim(),
    },
  };

  const base = byId[def.id];
  const p1 = base?.p1 ?? `This is one of your reliable on-switches — especially ${why || "in the right conditions"}.`;
  const p2 =
    base?.p2 ??
    `When it’s fed, it helps you move and grow. When it’s starved, you’ll feel your energy drop. ${drains ? `That usually happens when ${drains}.` : ""}`.trim();

  // Optional: weave the existing “looks like” as a natural sentence (not a label)
  const looksLine = looks ? `In real life, it looks like this: ${looks}.` : "";
  const p2Final = [looksLine, p2].filter(Boolean).join(" ");

  return { p1, p2: p2Final };
}

/* =============================================================================
   Component
   ============================================================================= */

export function MotivationsTab(props: {
  dark: boolean;
  motivationsTop: MotivationsTop;
  openDriver: DriverId | null; // intentionally unused (kept for API compatibility with page.tsx)
  setOpenDriver: React.Dispatch<React.SetStateAction<DriverId | null>>; // intentionally unused
  energyBoosters: string[];
  energyDrainers: string[];
  motivationReceipts: string[]; // intentionally unused (receipts removed)
  nextStepsMotivations: NextStepsDefinition | null;
  mounted: boolean;
  tab: string;
  nameFromHeadline: string;
}): React.JSX.Element {
  const { dark, motivationsTop, energyBoosters, energyDrainers, nextStepsMotivations, mounted, tab, nameFromHeadline } =
    props;

  return (
    <section className="mb-6">
      {/* stronger pill color + booster hover */}
      <style jsx>{`
        .el-chip {
          background: linear-gradient(
            180deg,
            rgba(var(--c), ${dark ? "0.28" : "0.18"}),
            rgba(255, 255, 255, ${dark ? "0.03" : "0.82"})
          );
          border-color: rgba(var(--c), ${dark ? "0.52" : "0.34"});
          box-shadow: 0 0 0 1px rgba(var(--c), ${dark ? "0.18" : "0.12"}),
            0 14px 44px rgba(0, 0, 0, ${dark ? "0.38" : "0.10"}),
            0 0 34px rgba(var(--c), ${dark ? "0.30" : "0.18"});
        }

        .el-boost:hover {
          transform: translateY(-1px);
          background: linear-gradient(
            180deg,
            rgba(var(--c), ${dark ? "0.36" : "0.22"}),
            rgba(255, 255, 255, ${dark ? "0.05" : "0.90"})
          );
          border-color: rgba(var(--c), ${dark ? "0.62" : "0.42"});
          box-shadow: 0 0 0 1px rgba(var(--c), ${dark ? "0.24" : "0.14"}),
            0 18px 60px rgba(0, 0, 0, ${dark ? "0.46" : "0.12"}),
            0 0 48px rgba(var(--c), ${dark ? "0.44" : "0.24"});
        }

        .el-drain {
          background: linear-gradient(
            180deg,
            rgba(var(--c), ${dark ? "0.20" : "0.12"}),
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
              dark ? "bg-sky-300/10" : "bg-sky-400/10",
            ].join(" ")}
          />
          <div
            className={[
              "absolute -bottom-24 -left-24 h-[260px] w-[360px] rounded-full blur-3xl",
              dark ? "bg-violet-300/8" : "bg-violet-400/8",
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
            {motivationsIntro(motivationsTop.top?.def ?? motivationsTop.top3[0]?.def, nameFromHeadline)}
          </p>
        </div>

        <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

        {/* DRIVERS: always readable (no open/close), and actually conversational */}
        <div className="relative">
          <div className={sectionKicker(dark)}>Your top drivers</div>
          <div className={["mt-2 text-[13px] leading-relaxed", mutedText(dark)].join(" ")}>
            Here are your three most reliable “on switches.” I’m going to say what I mean, like a person would.
          </div>

          <div className="mt-4 space-y-3">
            {motivationsTop.top3.map(({ def }) => {
              const n = driverNarrative(def);
              return (
                <div key={def.id} className={driverCardShell(dark)}>
                  <div className="pointer-events-none absolute inset-0" aria-hidden style={driverGlowStyle(dark, def.accent)} />

                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className="h-2 w-2 rounded-full"
                        style={{
                          background: `rgba(${rgb(def.accent)}, ${dark ? 0.95 : 0.85})`,
                          boxShadow: `0 0 22px rgba(${rgb(def.accent)}, ${dark ? 0.55 : 0.22})`,
                        }}
                      />
                      <div className={["text-[16px] font-semibold", sectionTitle(dark)].join(" ")}>{def.label}</div>
                    </div>

                    <div className="mt-2 space-y-2">
                      <p className={["text-[14px] leading-relaxed", dark ? "text-white/82" : "text-slate-700"].join(" ")}>
                        {n.p1}
                      </p>
                      <p className={["text-[14px] leading-relaxed", dark ? "text-white/78" : "text-slate-700"].join(" ")}>
                        {n.p2}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

        {/* ENERGY MAP: add padding so “ENERGY MAP” never clips/bleeds */}
        <div className="relative overflow-hidden rounded-[20px] px-4 py-4 md:px-5 md:py-5">
          <div className="pointer-events-none absolute inset-0" aria-hidden style={energyFieldStyle(dark)} />

          <div className="relative">
            <div className={sectionKicker(dark)}>Energy map</div>
            <div className={["mt-2 text-[14px] leading-relaxed", mutedText(dark)].join(" ")}>
              Quick read: what tends to boost you vs what quietly drains you.
            </div>

            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div>
                <div className={["text-[13px] font-semibold", dark ? "text-white/86" : "text-slate-900"].join(" ")}>
                  Boosters
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(energyBoosters.length ? energyBoosters : ["progress", "feedback", "real stakes"]).map((t) => {
                    const a = pickAccent(t, "booster");
                    return (
                      <span
                        key={`boost_${t}`}
                        className={[
                          "el-chip el-boost",
                          "inline-flex items-center rounded-full border px-3.5 py-1.5",
                          "text-[13px] font-semibold",
                          "backdrop-blur-xl",
                          "transition-[transform,box-shadow,background-color,border-color] duration-200",
                          "select-none",
                          dark ? "text-white/92" : "text-slate-900",
                        ].join(" ")}
                        style={{ "--c": rgb(a) } as CSSVars}
                      >
                        {t}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className={["text-[13px] font-semibold", dark ? "text-white/86" : "text-slate-900"].join(" ")}>
                  Drainers
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(energyDrainers.length ? energyDrainers : ["busywork", "no feedback loop", "stalled progress"]).map((t) => {
                    const a = pickAccent(t, "drainer");
                    return (
                      <span
                        key={`drain_${t}`}
                        className={[
                          "el-chip el-drain",
                          "inline-flex items-center rounded-full border px-3.5 py-1.5",
                          "text-[13px] font-semibold",
                          "backdrop-blur-xl",
                          "transition-[transform,box-shadow,background-color,border-color] duration-200",
                          "select-none",
                          dark ? "text-white/85" : "text-slate-900",
                        ].join(" ")}
                        style={{ "--c": rgb(a) } as CSSVars}
                      >
                        {t}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

        <div className="relative">
          <div className={sectionKicker(dark)}>One small move</div>
          <div className={["mt-2 text-[14px] leading-relaxed", mutedText(dark)].join(" ")}>
            Feed one driver on purpose. Small is fine. Real is the point.
          </div>

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
            <div className={["mt-4 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>
              Next steps are loading…
            </div>
          )}

          <QuickFeedbackInline dark={dark} contextTag={`insights:${tab}`} />
        </div>
      </div>
    </section>
  );
}

export default MotivationsTab;