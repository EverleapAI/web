// apps/web/src/app/(app)/main/insights/page.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Shield, Clock3 } from "lucide-react";

import { isDarkTheme, type SpotlightThemeId, type GradientLevel } from "@/theme/everleapVisuals";

import { buildInsightsViewModel, type InsightsTab, type WordCloudItem } from "./app/buildInsightsViewModel";

import { NextStepsStack } from "@/app/(app)/main/components/nextSteps/NextStepsStack";
import { getNextStepsDefinition } from "@/app/(app)/main/content/nextSteps";
import { getInsightLens } from "@/app/(app)/main/content/insightLenses";

import MotivationsTab from "./components/MotivationsTab";
import StrengthsTab from "./components/StrengthsTab";
import SkillsTab from "./components/SkillsTab";

/* =============================================================================
   Tabs
   ============================================================================= */

type LocalTab = InsightsTab | "funFacts";
type RGB = { r: number; g: number; b: number };

type TabDef = {
  id: LocalTab;
  label: string;
  blurb?: string;
  accent: RGB;
};

const TABS: TabDef[] = [
  { id: "summary", label: "Summary", blurb: "What it all means", accent: { r: 255, g: 180, b: 120 } }, // ember
  { id: "motivations", label: "Motivations", blurb: "What drives you", accent: { r: 120, g: 200, b: 255 } }, // sky
  { id: "strengths", label: "Strengths", blurb: "How you show up", accent: { r: 190, g: 140, b: 255 } }, // violet
  { id: "skills", label: "Skills", blurb: "Tools you reach for", accent: { r: 120, g: 255, b: 190 } }, // mint
  { id: "funFacts", label: "Fun Facts", blurb: "Lighter + playful", accent: { r: 255, g: 150, b: 230 } }, // pink
];

/* =============================================================================
   URL helpers
   ============================================================================= */

function coerceTab(raw: string | null | undefined): LocalTab {
  const v = (raw ?? "").toLowerCase();

  if (v === "summary") return "summary";
  if (v === "motivations") return "motivations";
  if (v === "strengths") return "strengths";
  if (v === "skills") return "skills";
  if (v === "funfacts" || v === "fun-facts" || v === "fun") return "funFacts";

  // back-compat
  if (v === "superpowers") return "summary";
  if (v === "doppelganger") return "summary";
  if (v.includes("doppel")) return "summary";
  if (v.includes("time") && v.includes("twin")) return "summary";

  return "summary";
}

/* =============================================================================
   UI helpers
   ============================================================================= */

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function rgb(a: RGB) {
  return `${a.r}, ${a.g}, ${a.b}`;
}

function tabPillBaseClass() {
  return [
    "relative inline-flex items-center gap-2",
    "rounded-full border",
    "px-4 py-2.5",
    "text-sm font-semibold tracking-[-0.01em]",
    "backdrop-blur-xl",
    "transition-[transform,box-shadow,background-color,border-color,color] duration-200",
    "active:scale-95",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200/30 focus-visible:ring-offset-0",
    "select-none",
    "whitespace-nowrap",
  ].join(" ");
}

function tabPillStyle(args: { dark: boolean; selected: boolean; accent: RGB }): React.CSSProperties {
  const { dark, selected, accent } = args;
  const c = rgb(accent);

  const inactiveBg = dark ? `rgba(${c}, 0.10)` : `rgba(${c}, 0.14)`;
  const inactiveBorder = dark ? `rgba(${c}, 0.26)` : `rgba(${c}, 0.30)`;

  const activeBg = dark
    ? `linear-gradient(180deg, rgba(${c}, 0.34), rgba(255,255,255,0.06))`
    : `linear-gradient(180deg, rgba(${c}, 0.22), rgba(255,255,255,0.85))`;

  const glow = dark
    ? `0 0 0 1px rgba(${c}, 0.30), 0 22px 70px rgba(0,0,0,0.60), 0 0 54px rgba(${c}, 0.28)`
    : `0 0 0 1px rgba(${c}, 0.22), 0 14px 40px rgba(0,0,0,0.16), 0 0 44px rgba(${c}, 0.18)`;

  const idleShadow = dark
    ? `inset 0 1px 0 rgba(255,255,255,0.07), 0 8px 22px rgba(0,0,0,0.34)`
    : `inset 0 1px 0 rgba(255,255,255,0.60), 0 8px 18px rgba(0,0,0,0.09)`;

  return selected
    ? {
        background: activeBg,
        borderColor: dark ? `rgba(${c}, 0.40)` : `rgba(${c}, 0.35)`,
        color: dark ? "rgba(255,255,255,0.96)" : "rgba(15,23,42,0.96)",
        boxShadow: glow,
      }
    : {
        background: inactiveBg,
        borderColor: inactiveBorder,
        color: dark ? "rgba(255,255,255,0.82)" : "rgba(15,23,42,0.82)",
        boxShadow: idleShadow,
      };
}

function tabDotStyle(args: { dark: boolean; selected: boolean; accent: RGB }): React.CSSProperties {
  const { dark, selected, accent } = args;
  const c = rgb(accent);

  return {
    background: selected ? `rgba(${c}, 0.95)` : `rgba(${c}, ${dark ? 0.45 : 0.55})`,
    boxShadow: selected ? `0 0 18px rgba(${c}, 0.65)` : `0 0 10px rgba(${c}, 0.35)`,
  };
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

function counselorHeadline(dark: boolean) {
  return dark
    ? [
        "text-[26px] md:text-[30px] font-semibold tracking-tight leading-snug",
        "text-transparent bg-clip-text",
        "bg-gradient-to-b from-white/95 via-white/86 to-white/70",
        "drop-shadow-[0_10px_22px_rgba(0,0,0,0.45)]",
      ].join(" ")
    : ["text-[26px] md:text-[30px] font-semibold tracking-tight leading-snug", "text-slate-900"].join(" ");
}

function counselorPara(dark: boolean) {
  return dark
    ? ["text-[15px] leading-relaxed", "text-white/82", "drop-shadow-[0_1px_10px_rgba(0,0,0,0.35)]"].join(" ")
    : "text-[15px] leading-relaxed text-slate-700";
}

/* --- Quick Feedback (inline expand; no overlay) ----------------------------- */

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

        <button
          type="button"
          className={quickChip(dark, rating === "not_really")}
          onClick={() => onPick("not_really")}
        >
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
   Word cloud helpers
   ============================================================================= */

type CSSVars = React.CSSProperties & { [key: `--${string}`]: string | number };

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

function wordChaosVars(term: string, weight: number): CSSVars {
  const h = hashString((term ?? "").toLowerCase());
  const w = clamp01(weight);
  const allow = w < 0.92 && (h % 10) < 3;

  const rot = allow ? ((h % 5) - 2) * 0.35 : 0;
  const ty = allow ? ((h % 7) - 3) * 0.25 : 0;
  const ls = w > 0.78 ? 0.15 : 0;

  return {
    "--el-rot": `${rot}deg`,
    "--el-ty": `${ty}px`,
    "--el-ls": `${ls}px`,
  };
}

function topTerms(items: WordCloudItem[]) {
  const sorted = [...items].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
  return new Set(sorted.slice(0, 3).map((x) => x.term.toLowerCase()));
}

function highlightWrap(dark: boolean) {
  return dark ? "bg-white/8 ring-1 ring-white/10" : "bg-black/5 ring-1 ring-black/10";
}

/* =============================================================================
   Summary extraction (safe)
   ============================================================================= */

type SignalId = "action" | "people" | "curiosity" | "clarity";

type SignalBarItemLike = {
  id?: unknown;
  label?: unknown;
  strength?: unknown;
  meaning?: unknown;
  why?: unknown;
  examples?: unknown;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object";
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function asSignalId(v: unknown): SignalId | null {
  return v === "action" || v === "people" || v === "curiosity" || v === "clarity" ? v : null;
}

function asNumber(v: unknown, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function normalizeSignals(raw: unknown): Array<{
  id: SignalId;
  label: string;
  strength: number;
  meaning: string;
  why: string;
  examples: string[];
}> {
  if (!Array.isArray(raw)) return [];
  const out: Array<{
    id: SignalId;
    label: string;
    strength: number;
    meaning: string;
    why: string;
    examples: string[];
  }> = [];

  for (const it of raw as SignalBarItemLike[]) {
    if (!isRecord(it)) continue;
    const id = asSignalId(it.id);
    if (!id) continue;

    out.push({
      id,
      label: asString(it.label, ""),
      strength: clamp01(asNumber(it.strength, 0)),
      meaning: asString(it.meaning, ""),
      why: asString(it.why, ""),
      examples: asStringArray(it.examples).slice(0, 2),
    });
  }

  return out;
}

function topTwoSignals<T extends { strength: number }>(items: T[]) {
  const sorted = [...items].sort((a, b) => (b.strength ?? 0) - (a.strength ?? 0));
  return { top: sorted[0], second: sorted[1] };
}

function cleanOneLine(s: string) {
  return (s ?? "").replace(/\s+/g, " ").trim();
}

function extractNameFromHeadline(headline: string) {
  const h = cleanOneLine(headline);
  const m = h.match(/,\s*([A-Za-z0-9]+)\.?$/) ?? h.match(/\b([A-Za-z0-9]+)\s+—/);
  const candidate = (m?.[1] ?? "").trim();
  if (!candidate) return "";
  if (candidate.length > 16) return "";
  if (/^(here|alright|hey|lets|let’s|im|i’m|i)$/i.test(candidate)) return "";
  return candidate;
}

function pickQuote(signals: Array<{ examples: string[] }>) {
  for (const s of signals) {
    const ex = (s.examples ?? []).map((x) => cleanOneLine(x)).filter(Boolean)[0];
    if (ex && ex.length >= 3) return ex;
  }
  return "";
}

function pickWatchoutSentence(watchouts: { bullets: string[] }) {
  const first = cleanOneLine((watchouts?.bullets ?? [])[0] ?? "");
  return first;
}

function openerForTopSignal(id: SignalId, name: string) {
  const who = name ? `${name},` : "";
  if (id === "people") {
    return `${who} what stands out is how much you sharpen around other people — not for approval, but because real feedback helps you level up.`;
  }
  if (id === "action") {
    return `${who} your answers read like someone who gets clarity through doing. You don’t just think about things — you want to build, try, and finish.`;
  }
  if (id === "curiosity") {
    return `${who} the pattern I’m seeing is a real pull toward learning and figuring things out. Questions aren’t a distraction for you — they’re fuel.`;
  }
  return `${who} you seem to crave a clean next step you can trust. When things feel foggy, you push toward clarity.`;
}

function motivationLineFromTop(id: SignalId) {
  if (id === "people") return "A lot of your motivation comes alive in connection — teams, mentors, coaches, someone to trade reality with.";
  if (id === "action") return "Your motivation spikes when you can make something real — a project, a practice loop, a visible result.";
  if (id === "curiosity") return "Your motivation shows up as curiosity — the pull to explore, understand, and go deeper.";
  return "Your motivation is direction-driven — energy rises when the next step feels clear and meaningful.";
}

function strengthLineFromSecond(id?: SignalId) {
  if (!id) return "You tend to be thoughtful about what you take on, and you learn fast when you care.";
  if (id === "clarity") return "You have a strong sense for what matters — you naturally organize toward a next step.";
  if (id === "curiosity") return "You’re a pattern-noticer — you learn by exploring, not waiting.";
  if (id === "action") return "You’re an iterator — you get better through reps and real attempts.";
  return "You read people well, and you’re responsive to feedback when it’s real.";
}

function skillsLineFromTop(id: SignalId) {
  if (id === "action") return "Skill-wise, you build momentum through reps — starting, refining, finishing. That compounds.";
  if (id === "people") return "Skill-wise, you improve through feedback loops — you can take input and sharpen without collapsing.";
  if (id === "curiosity") return "Skill-wise, you learn by investigation — asking better questions, finding what’s true, connecting dots.";
  return "Skill-wise, you’re building clarity muscles — turning fog into a plan, and a plan into a first step.";
}

function buildCounselorNarrative(args: {
  headline: string;
  signals: Array<{ id: SignalId; strength: number; why: string; examples: string[] }>;
  watchoutLine: string;
  variant: "mobile" | "desktop";
}) {
  const { headline, signals, watchoutLine, variant } = args;

  const { top, second } = topTwoSignals(signals);
  const name = extractNameFromHeadline(headline);

  const topStrength = top?.strength ?? 0;
  const hasSignal = topStrength >= 0.22;

  if (!hasSignal) {
    const p1 = name
      ? `Hey ${name} — I don’t have enough signal yet to be specific, but I can already see the outline forming.`
      : "I don’t have enough signal yet to be specific, but I can already see the outline forming.";
    const p2 =
      "Give me a few real examples across Motivations, Strengths, and Skills, and I’ll reflect patterns back that actually feel like you — not generic advice.";
    return variant === "mobile"
      ? { paragraphs: [p1, p2] }
      : {
          paragraphs: [
            p1,
            `${p2} The goal isn’t to label you — it’s to help you notice what pulls you forward, how you operate when things get real, and what skills you’re building through action.`,
          ],
        };
  }

  const topId = top?.id ?? "clarity";
  const secondId = second?.id;

  const quote = pickQuote([top, second].filter(Boolean) as Array<{ examples: string[] }>);
  const quoteLine = quote ? `One clue you gave me: “${quote}.”` : "";

  const watchLine = cleanOneLine(watchoutLine)
    ? `One thing to watch for: ${cleanOneLine(watchoutLine).replace(/\.$/, "")}.`
    : "One thing to watch for: when you care deeply about getting it right, it’s easy to overthink the first step.";

  const p1 = [openerForTopSignal(topId, name), motivationLineFromTop(topId), quoteLine].filter(Boolean).join(" ");

  if (variant === "mobile") {
    const p2 = [strengthLineFromSecond(secondId), skillsLineFromTop(topId), watchLine].filter(Boolean).join(" ");
    return { paragraphs: [p1, p2] };
  }

  const p2 = [
    strengthLineFromSecond(secondId),
    skillsLineFromTop(topId),
    watchLine,
    "You don’t need the whole path figured out — just keep moving toward what feels genuinely alive to you.",
  ]
    .filter(Boolean)
    .join(" ");

  return { paragraphs: [p1, p2] };
}

/* =============================================================================
   Watchouts (self-contained)
   ============================================================================= */

function guessWatchoutsFromSuperpowers(superBullets: string[] | undefined | null) {
  const bullets = (superBullets ?? []).map((s) => (s ?? "").trim()).filter(Boolean);

  const patterns = [
    {
      rx: /\b(detail|precise|accuracy|quality|craft)\b/i,
      out: "This can slide into perfection-pressure: “not ready yet” becomes the default.",
    },
    {
      rx: /\b(people|team|relationship|empath|care|support)\b/i,
      out: "You can over-carry the emotional load — fixing the room before naming what you need.",
    },
    { rx: /\b(drive|ambit|goal|push|grit|work)\b/i, out: "Your engine can outrun your recovery — momentum turns into quiet burnout." },
    { rx: /\b(logic|analysis|think|reason|strategy)\b/i, out: "You can get stuck optimizing — the plan gets perfect while the step doesn’t happen." },
    { rx: /\b(creat|idea|vision|imagin)\b/i, out: "Ideas can multiply faster than closure — it starts to feel like you’re “behind” your own brain." },
    { rx: /\b(lead|own|responsib|standard)\b/i, out: "You might take responsibility for outcomes you don’t fully control." },
  ] as const;

  const chosen: string[] = [];

  for (const b of bullets) {
    const hit = patterns.find((p) => p.rx.test(b));
    if (hit && !chosen.includes(hit.out)) chosen.push(hit.out);
    if (chosen.length >= 3) break;
  }

  const defaults = [
    "When you’re good at reading the room, you can start self-editing mid-sentence.",
    "When you’re reliable, you can become the “default adult” — even in your own life.",
    "When you’re capable, you can delay asking for help until it’s urgent.",
  ];

  while (chosen.length < 3) {
    const next = defaults[chosen.length];
    if (next) chosen.push(next);
    else break;
  }

  return {
    intro: "These aren’t flaws. They’re what a strength can look like when it’s overused, stressed, or pointed at the wrong problem.",
    bullets: chosen.slice(0, 4),
  };
}

/* =============================================================================
   Motivations (Top 3 universal drivers)
   ============================================================================= */

type DriverId = "meaning" | "mastery" | "people" | "freedom" | "curiosity" | "momentum";

type DriverDef = {
  id: DriverId;
  label: string;
  accent: RGB;
  whenItHits: string;
  looksLike: string;
  drainsWhen: string;
  tryThis: string;
};

const MOTIVATION_DRIVERS: DriverDef[] = [
  {
    id: "meaning",
    label: "Meaning",
    accent: { r: 255, g: 180, b: 120 }, // ember
    whenItHits: "when the work connects to real impact or a real “why.”",
    looksLike: "You care more, stay longer, and you’ll push through friction because it matters.",
    drainsWhen: "it’s busywork, status, or the point feels foggy.",
    tryThis: "Pick one thing you’re doing this week and write the “real reason” in one sentence. Then do one 20-minute rep.",
  },
  {
    id: "mastery",
    label: "Mastery",
    accent: { r: 190, g: 140, b: 255 }, // violet
    whenItHits: "when you can feel yourself getting better through reps.",
    looksLike: "You chase feedback, refine fast, and you like a clean skill ladder.",
    drainsWhen: "there’s no measurable improvement (same loop, same result).",
    tryThis: "Choose one skill. Do 3 short reps this week and track one metric (speed, accuracy, clarity, time).",
  },
  {
    id: "people",
    label: "People",
    accent: { r: 120, g: 200, b: 255 }, // sky
    whenItHits: "when there’s real interaction: feedback, challenge, shared effort.",
    looksLike: "You sharpen around mentors/teammates and you move faster with a real loop.",
    drainsWhen: "it’s isolated for too long or you can’t get honest feedback.",
    tryThis: "Get one real mirror: ask someone smart for a 30-second critique on something you made or did.",
  },
  {
    id: "freedom",
    label: "Freedom",
    accent: { r: 120, g: 255, b: 190 }, // mint
    whenItHits: "when you can choose the approach and own the path.",
    looksLike: "You work best when you can design, test, and adjust your own system.",
    drainsWhen: "everything is pre-scripted or you’re micromanaged.",
    tryThis: "Take one task and redesign the method. Same goal — your approach. Then run it once.",
  },
  {
    id: "curiosity",
    label: "Curiosity",
    accent: { r: 255, g: 150, b: 230 }, // pink
    whenItHits: "when there’s something real to figure out.",
    looksLike: "You ask better questions, connect dots, and get energy from learning.",
    drainsWhen: "nothing new is happening and it feels repetitive without insight.",
    tryThis: "Pick one question you actually care about. Spend 15 minutes finding one surprising answer and write it down.",
  },
  {
    id: "momentum",
    label: "Momentum",
    accent: { r: 255, g: 210, b: 110 }, // warm gold
    whenItHits: "when things move: start → ship → done.",
    looksLike: "You get clarity through action and confidence through finishing.",
    drainsWhen: "progress stalls, decisions drag, or it’s all planning.",
    tryThis: "Choose a tiny finish line you can hit today (10–20 minutes). Ship it imperfectly.",
  },
];

function includesAny(haystack: string, words: string[]) {
  const s = (haystack ?? "").toLowerCase();
  return words.some((w) => s.includes(w));
}

function scoreDrivers(args: {
  signals: Array<{ id: SignalId; strength: number; why: string; examples: string[] }>;
  terms: WordCloudItem[];
}) {
  const { signals, terms } = args;

  const textFromSignals = signals
    .flatMap((s) => [s.why, ...(s.examples ?? [])])
    .map((x) => (x ?? "").toString())
    .join(" | ")
    .toLowerCase();

  const termText = (terms ?? [])
    .slice(0, 26)
    .map((t) => (t.term ?? "").toString().toLowerCase())
    .join(" | ");

  const blob = `${textFromSignals} | ${termText}`;

  const bySignal = new Map<SignalId, number>();
  for (const s of signals) bySignal.set(s.id, clamp01(s.strength ?? 0));

  const base: Record<DriverId, number> = {
    meaning: 0.08,
    mastery: 0.08,
    people: 0.08,
    freedom: 0.08,
    curiosity: 0.08,
    momentum: 0.08,
  };

  // Signal boosts (coarse but stable)
  base.people += (bySignal.get("people") ?? 0) * 0.65;
  base.curiosity += (bySignal.get("curiosity") ?? 0) * 0.65;

  base.momentum += (bySignal.get("action") ?? 0) * 0.45;
  base.mastery += (bySignal.get("action") ?? 0) * 0.35;

  base.meaning += (bySignal.get("clarity") ?? 0) * 0.28;
  base.momentum += (bySignal.get("clarity") ?? 0) * 0.18;

  // Keyword boosts (small, so it doesn't get weird)
  if (includesAny(blob, ["impact", "meaning", "purpose", "help", "contribute", "difference", "community"])) base.meaning += 0.22;
  if (includesAny(blob, ["practice", "reps", "improve", "progress", "skill", "craft", "master"])) base.mastery += 0.22;
  if (includesAny(blob, ["team", "people", "mentor", "coach", "friends", "collab", "together", "feedback"])) base.people += 0.22;
  if (includesAny(blob, ["freedom", "choice", "autonomy", "independent", "own", "self", "design"])) base.freedom += 0.20;
  if (includesAny(blob, ["learn", "curious", "explore", "research", "science", "data", "question", "figure out"])) base.curiosity += 0.22;
  if (includesAny(blob, ["build", "ship", "finish", "done", "execute", "action", "start"])) base.momentum += 0.20;

  const scored = MOTIVATION_DRIVERS.map((d) => ({
    def: d,
    score: clamp01(base[d.id]),
  })).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  // Always return 3 (stable ordering)
  return {
    top3: scored.slice(0, 3),
    top: scored[0],
  };
}

/* =============================================================================
   Page
   ============================================================================= */

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const themeId: SpotlightThemeId = "nightDusk";
  const gradientLevel: GradientLevel = 3;
  void gradientLevel;

  const dark = isDarkTheme(themeId);

  const initialTabFromUrl = React.useMemo<LocalTab>(() => {
    const raw = searchParams?.get("tab") ?? searchParams?.get("section");
    return coerceTab(raw);
  }, [searchParams]);

  const [tab, setTab] = React.useState<LocalTab>(initialTabFromUrl);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const vmTab: InsightsTab = tab === "funFacts" ? "summary" : tab;
  const vm = React.useMemo(() => buildInsightsViewModel(vmTab, { useLocal: mounted }), [vmTab, mounted]);

  // SAFETY: lens might be undefined during refactors / missing config
  const superDef = React.useMemo(() => getInsightLens("superpowers"), []);
  const safeSuper = superDef ?? { body: "", bullets: [] as string[] };

  const nextStepsBaseSummary = React.useMemo(() => getNextStepsDefinition("insights.summary"), []);
  const nextStepsSummary = React.useMemo(() => {
    if (!nextStepsBaseSummary) return null;
    return { ...nextStepsBaseSummary, bridgeLine: "" };
  }, [nextStepsBaseSummary]);

  const nextStepsBaseMotivations = React.useMemo(() => getNextStepsDefinition("insights.motivations"), []);
  const nextStepsMotivations = React.useMemo(() => {
    const base = nextStepsBaseMotivations ?? nextStepsBaseSummary ?? null;
    if (!base) return null;
    return { ...base, bridgeLine: "" };
  }, [nextStepsBaseMotivations, nextStepsBaseSummary]);

  const nextStepsBaseStrengths = React.useMemo(() => getNextStepsDefinition("insights.strengths"), []);
  const nextStepsStrengths = React.useMemo(() => {
    const base = nextStepsBaseStrengths ?? nextStepsBaseSummary ?? null;
    if (!base) return null;
    return { ...base, bridgeLine: "" };
  }, [nextStepsBaseStrengths, nextStepsBaseSummary]);

  const nextStepsBaseSkills = React.useMemo(() => getNextStepsDefinition("insights.skills"), []);
  const nextStepsSkills = React.useMemo(() => {
    const base = nextStepsBaseSkills ?? nextStepsBaseSummary ?? null;
    if (!base) return null;
    return { ...base, bridgeLine: "" };
  }, [nextStepsBaseSkills, nextStepsBaseSummary]);

  function setTabAndSync(next: LocalTab) {
    setTab(next);
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("tab", next);
    params.delete("section");
    router.replace(`/main/insights?${params.toString()}`);
  }

  const wordCloudRaw = vm.summary.wordCloud;
  const wordCloud = React.useMemo<WordCloudItem[]>(() => wordCloudRaw ?? [], [wordCloudRaw]);
  const topWordSet = React.useMemo(() => topTerms(wordCloud), [wordCloud]);

  const wordCloudDisplay = React.useMemo(() => {
    if (!wordCloud?.length) return [];
    const sorted = [...wordCloud].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
    return sorted.slice(0, 26);
  }, [wordCloud]);

  const watchouts = React.useMemo(() => guessWatchoutsFromSuperpowers(safeSuper.bullets), [safeSuper.bullets]);

  const signals = React.useMemo(() => normalizeSignals(vm.summary.signalBar), [vm.summary.signalBar]);
  const watchoutLine = React.useMemo(() => pickWatchoutSentence(watchouts), [watchouts]);

  const counselorMobile = React.useMemo(
    () =>
      buildCounselorNarrative({
        headline: vm.summary.headline || "",
        signals,
        watchoutLine,
        variant: "mobile",
      }),
    [vm.summary.headline, signals, watchoutLine]
  );

  const counselorDesktop = React.useMemo(
    () =>
      buildCounselorNarrative({
        headline: vm.summary.headline || "",
        signals,
        watchoutLine,
        variant: "desktop",
      }),
    [vm.summary.headline, signals, watchoutLine]
  );

  // Motivations derived (universal drivers → personalized selection)
  const nameFromHeadline = React.useMemo(() => extractNameFromHeadline(vm.summary.headline || ""), [vm.summary.headline]);

  const motivationsTop = React.useMemo(() => scoreDrivers({ signals, terms: wordCloudDisplay }), [signals, wordCloudDisplay]);

  const [openDriver, setOpenDriver] = React.useState<DriverId | null>(null);
  React.useEffect(() => {
    // default open: top driver (stable; mount only)
    const topId = motivationsTop.top?.def?.id ?? null;
    setOpenDriver(topId);
  }, [motivationsTop.top?.def?.id]);

  const motivationReceipts = React.useMemo(() => {
    const receipts: string[] = [];

    const q = pickQuote(signals);
    if (q) receipts.push(q);

    // Add up to 2 more short receipts from signal examples (unique)
    const more = signals
      .flatMap((s) => (s.examples ?? []).map((x) => cleanOneLine(x)))
      .filter((x) => x && x.length >= 6 && x.length <= 110);

    for (const m of more) {
      if (receipts.length >= 3) break;
      if (!receipts.includes(m)) receipts.push(m);
    }

    // If still empty, fall back to top word cloud terms (as “themes”)
    if (receipts.length === 0 && wordCloudDisplay.length) {
      const t = wordCloudDisplay
        .slice(0, 3)
        .map((w) => cleanOneLine(w.term))
        .filter(Boolean);
      if (t.length) receipts.push(`Themes that keep showing up: ${t.join(", ")}.`);
    }

    return receipts.slice(0, 4);
  }, [signals, wordCloudDisplay]);

  const energyBoosters = React.useMemo(() => {
    const base = wordCloudDisplay
      .slice(0, 10)
      .map((w) => cleanOneLine(w.term))
      .filter((t) => t.length >= 3 && t.length <= 18);

    // keep boosters unique and "chip-sized"
    const out: string[] = [];
    for (const b of base) {
      const k = b.toLowerCase();
      if (out.some((x) => x.toLowerCase() === k)) continue;
      out.push(b);
      if (out.length >= 6) break;
    }
    return out;
  }, [wordCloudDisplay]);

  const energyDrainers = React.useMemo(() => {
    const top3 = motivationsTop.top3.map((x) => x.def.id);
    const map: Record<DriverId, string[]> = {
      people: ["no feedback loop", "working in a vacuum", "group drama / fake vibes"],
      mastery: ["no progress", "same reps forever", "unclear standards"],
      meaning: ["busywork", "point feels fuzzy", "status games"],
      curiosity: ["nothing new", "no questions allowed", "repeat without insight"],
      freedom: ["micromanaged", "pre-scripted steps", "no choice"],
      momentum: ["stalled decisions", "endless planning", "waiting on approvals"],
    };

    const out: string[] = [];
    for (const id of top3) {
      for (const d of map[id] ?? []) {
        if (!out.includes(d)) out.push(d);
        if (out.length >= 6) break;
      }
      if (out.length >= 6) break;
    }
    return out.slice(0, 6);
  }, [motivationsTop.top3]);

  // For Skills: pass the most “complete” model we have (SkillsTab is forgiving).
  const skillsModel = React.useMemo(() => {
    const anyVm = vm as unknown as Record<string, unknown>;
    // prefer vm.skills if present; else pass vm
    if (anyVm && typeof anyVm === "object" && anyVm.skills) return anyVm.skills;
    return vm;
  }, [vm]);

  return (
    <>
      <style jsx global>{`
        .el-word {
          transform: translateY(var(--el-ty, 0px)) rotate(var(--el-rot, 0deg)) scale(1);
          letter-spacing: var(--el-ls, 0px);
          will-change: transform;
          transition: transform 160ms ease;
        }
        .el-word:hover {
          transform: translateY(var(--el-ty, 0px)) rotate(var(--el-rot, 0deg)) scale(1.03);
        }
        .el-word:active {
          transform: translateY(var(--el-ty, 0px)) rotate(var(--el-rot, 0deg)) scale(0.988);
        }

        button[aria-label*="sign out" i],
        a[aria-label*="sign out" i],
        button[title*="sign out" i],
        a[title*="sign out" i] {
          display: none !important;
        }
      `}</style>

      {/* tighter top spacing */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col pb-28 pt-0">
        {/* Page title (LEFT, calm) */}
        <div className="mb-3 pt-0">
          <h1
            className={[
              "text-[36px] md:text-[44px] font-semibold tracking-tight",
              "text-white/92",
              "leading-[1.08] pb-1",
            ].join(" ")}
            style={{ overflow: "visible" }}
          >
            Insights
          </h1>
          <div className="mt-0.5 text-[14px] md:text-[15px] text-white/60">What it all means</div>
        </div>

        {/* Tabs row (FLOATING: NO OUTER BOX) */}
        <div className="relative mb-5">
          <div className="relative flex gap-2 overflow-x-auto pb-0 pr-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((t) => {
              const selected = t.id === tab;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={tabPillBaseClass()}
                  style={tabPillStyle({ dark, selected, accent: t.accent })}
                  aria-current={selected ? "page" : undefined}
                  onClick={() => setTabAndSync(t.id)}
                >
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full"
                    style={tabDotStyle({ dark, selected, accent: t.accent })}
                  />
                  <span className="relative">{t.label}</span>
                </button>
              );
            })}
          </div>

          <div
            aria-hidden
            className={[
              "pointer-events-none absolute right-0 top-0 h-full w-10",
              dark ? "bg-gradient-to-l from-[#0b1220] to-transparent" : "bg-gradient-to-l from-white to-transparent",
            ].join(" ")}
          />
        </div>

        {tab === "summary" ? (
          <section className="mb-6">
            <div className={readingSurface(dark)}>
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                <div
                  className={[
                    "absolute -top-24 left-1/2 h-[260px] w-[680px] -translate-x-1/2 rounded-full blur-3xl",
                    dark ? "bg-orange-300/10" : "bg-orange-400/10",
                  ].join(" ")}
                />
                <div
                  className={[
                    "absolute top-12 -left-24 h-[220px] w-[360px] rounded-full blur-3xl",
                    dark ? "bg-sky-300/10" : "bg-sky-400/10",
                  ].join(" ")}
                />

                <div
                  className={[
                    "absolute inset-0",
                    dark ? "bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" : "bg-gradient-to-b from-black/[0.04] via-transparent to-transparent",
                  ].join(" ")}
                />

                {/* SPINE REMOVED */}
              </div>

              <div className="relative">
                <div className={sectionKicker(dark)}>Counselor Notes</div>

                <div className={["mt-2", counselorHeadline(dark)].join(" ")}>
                  {vm.summary.headline || "Here’s what I think I’m seeing."}
                </div>

                <div className="mt-4 space-y-3 md:hidden">
                  {counselorMobile.paragraphs.map((p, i) => (
                    <p key={`cn_m_${i}`} className={counselorPara(dark)}>
                      {p}
                    </p>
                  ))}
                </div>

                <div className="mt-4 hidden space-y-3 md:block">
                  {counselorDesktop.paragraphs.map((p, i) => (
                    <p key={`cn_d_${i}`} className={counselorPara(dark)}>
                      {p}
                    </p>
                  ))}
                </div>

                <div className={["mt-4 text-[14px] leading-relaxed", mutedText(dark)].join(" ")}>
                  Want the zoom-in version? Open the tabs for{" "}
                  <span className={dark ? "text-white/80 font-semibold" : "text-slate-800 font-semibold"}>Motivations</span>,{" "}
                  <span className={dark ? "text-white/80 font-semibold" : "text-slate-800 font-semibold"}>Strengths</span>, and{" "}
                  <span className={dark ? "text-white/80 font-semibold" : "text-slate-800 font-semibold"}>Skills</span>.
                </div>
              </div>

              <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

              <div>
                <div className={sectionKicker(dark)}>Themes</div>

                <div className="mt-4">
                  {wordCloudDisplay.length ? (
                    <div className="flex flex-wrap gap-x-3 gap-y-2 leading-none">
                      {wordCloudDisplay.map((w) => {
                        const isTop = topWordSet.has(w.term.toLowerCase());
                        return (
                          <span
                            key={w.term}
                            className={[
                              "select-none el-word",
                              wordColorClasses(dark, w.term),
                              isTop ? ["rounded-full px-2.5 py-1", highlightWrap(dark)].join(" ") : "",
                            ].join(" ")}
                            style={{
                              fontSize: `${wordSizePx(w.weight)}px`,
                              opacity: wordOpacity(w.weight),
                              ...wordChaosVars(w.term, w.weight),
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

              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className={["h-4 w-4", dark ? "text-lime-200/80" : "text-lime-700/80"].join(" ")} />
                  <div className={sectionKicker(dark)}>Superpowers</div>
                </div>

                <div className={["mt-2 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>
                  {safeSuper.body || "What you naturally do well when it matters."}
                </div>

                {safeSuper.bullets?.length ? (
                  <ul className="mt-4 space-y-2">
                    {safeSuper.bullets.map((b, i) => (
                      <li key={`sp_b_${i}`} className="flex gap-2 text-[15px] leading-relaxed">
                        <span aria-hidden className={dark ? "text-white/35" : "text-slate-400"}>
                          •
                        </span>
                        <span className={dark ? "text-white/78" : "text-slate-700"}>{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

              <div>
                <div className="flex items-center gap-2">
                  <Shield className={["h-4 w-4", dark ? "text-amber-200/80" : "text-amber-700/80"].join(" ")} />
                  <div className={sectionKicker(dark)}>Watchouts</div>
                </div>

                <div className={["mt-2 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>{watchouts.intro}</div>

                <ul className="mt-4 space-y-2">
                  {watchouts.bullets.map((b, i) => (
                    <li key={`wo_b_${i}`} className="flex gap-2 text-[15px] leading-relaxed">
                      <span aria-hidden className={dark ? "text-white/35" : "text-slate-400"}>
                        •
                      </span>
                      <span className={dark ? "text-white/78" : "text-slate-700"}>{b}</span>
                    </li>
                  ))}
                </ul>

                <QuickFeedbackInline dark={dark} contextTag={`insights:${tab}`} />
              </div>

              <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

              <div>
                <div className={sectionKicker(dark)}>Next Steps</div>
                <div className={["mt-2 text-[14px] leading-relaxed", mutedText(dark)].join(" ")}>
                  One real move. Small is fine. Real is the point.
                </div>

                {nextStepsSummary ? (
                  <div className="mt-4">
                    <NextStepsStack
                      dark={dark}
                      useLocal={mounted}
                      definition={nextStepsSummary}
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
        ) : tab === "motivations" ? (
          <MotivationsTab
            dark={dark}
            motivationsTop={motivationsTop}
            openDriver={openDriver}
            setOpenDriver={setOpenDriver}
            energyBoosters={energyBoosters}
            energyDrainers={energyDrainers}
            motivationReceipts={motivationReceipts}
            nextStepsMotivations={nextStepsMotivations}
            mounted={mounted}
            tab={tab}
            nameFromHeadline={nameFromHeadline}
          />
        ) : tab === "strengths" ? (
          <StrengthsTab
            dark={dark}
            signals={signals}
            wordCloudDisplay={wordCloudDisplay}
            superBullets={safeSuper.bullets}
            watchoutBullets={watchouts.bullets}
            nextStepsStrengths={nextStepsStrengths}
            mounted={mounted}
            tab={tab}
            nameFromHeadline={nameFromHeadline}
          />
        ) : tab === "skills" ? (
          <SkillsTab
            dark={dark}
            nextStepsSkills={nextStepsSkills}
            mounted={mounted}
            tab={tab}
            nameFromHeadline={nameFromHeadline}
            model={skillsModel}
          />
        ) : tab === "funFacts" ? (
          <section className="mb-6">
            <div className={readingSurface(dark)}>
              <div className={sectionKicker(dark)}>Fun Facts</div>
              <div className={["mt-2 text-[18px] font-semibold tracking-tight", sectionTitle(dark)].join(" ")}>
                A lighter mirror — still grounded in how you move through the world.
              </div>
              <div className={["mt-2 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>
                This is where we keep the “delight” layer — the stuff that helps you see yourself from a new angle without turning life into a quiz.
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
                      A biography-style mirror — creative + technical + real-world impact.
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
          </section>
        ) : (
          <section className="mb-6">
            <div
              className={[
                "rounded-[28px] px-5 py-5",
                "shadow-[0_28px_95px_rgba(0,0,0,0.70)]",
                "backdrop-blur-xl",
                dark ? "text-white/80 bg-slate-950/25" : "text-slate-800 bg-white/80",
              ].join(" ")}
            >
              <div className={["text-lg font-semibold", sectionTitle(dark)].join(" ")}>Section</div>
              <div className={["mt-1 text-sm", mutedText(dark)].join(" ")}>This section is scaffolded.</div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}