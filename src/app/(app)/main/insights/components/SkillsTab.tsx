// apps/web/src/app/(app)/main/insights/components/SkillsTab.tsx
"use client";

import * as React from "react";

import { NextStepsStack } from "@/app/(app)/main/components/nextSteps/NextStepsStack";
import * as SkillsTaxonomy from "../content/skillsTaxonomy";

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
   Local UI helpers
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

function pickAccent(term: string, palette: RGB[]) {
  const h = hashString((term ?? "").toLowerCase().trim());
  return palette[h % palette.length] ?? palette[0]!;
}

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
   Quick Feedback (inline expand; no overlay) — local copy
   ============================================================================= */

type QuickRating = "mostly" | "somewhat" | "not_really";
const QUICK_FEEDBACK_STORAGE_KEY = "everleap.insights.skills.quickFeedback.v1";

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

  function onSave() {
    if (!rating) return;
    writeLocalQuickFeedback({ rating, note: (note ?? "").trim() });
    setSaved(true);
    setOpen(false);
  }

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

              <button type="button" onClick={onSave} disabled={!rating} className={saveButton(dark, !rating)}>
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
   Model extraction (from page.tsx "model" prop)
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

function asSignalId(v: unknown): SignalId | null {
  return v === "action" || v === "people" || v === "curiosity" || v === "clarity" ? v : null;
}

function normalizeSignals(raw: unknown): SignalLike[] {
  if (!Array.isArray(raw)) return [];
  const out: SignalLike[] = [];

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

function normalizeWordCloud(raw: unknown): WordCloudItemLike[] {
  if (!Array.isArray(raw)) return [];
  const out: WordCloudItemLike[] = [];
  for (const it of raw as Array<Record<string, unknown>>) {
    if (!isRecord(it)) continue;
    const term = cleanOneLine(asString(it.term, ""));
    if (!term) continue;
    out.push({ term, weight: clamp01(asNumber(it.weight, 0)) });
  }
  out.sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
  return out.slice(0, 26);
}

function extractReceiptsFromSignals(signals: SignalLike[], terms: WordCloudItemLike[]) {
  const receipts: string[] = [];

  for (const s of signals) {
    for (const ex of s.examples ?? []) {
      const t = cleanOneLine(ex);
      if (t && t.length >= 6 && t.length <= 110 && !receipts.includes(t)) receipts.push(t);
      if (receipts.length >= 3) break;
    }
    if (receipts.length >= 3) break;
  }

  if (receipts.length < 2 && terms.length) {
    const t = terms
      .slice(0, 3)
      .map((w) => cleanOneLine(w.term))
      .filter(Boolean);
    if (t.length) receipts.push(`Themes that keep showing up: ${t.join(", ")}.`);
  }

  return receipts.slice(0, 4);
}

/* =============================================================================
   Taxonomy adapter (robust to export name / return shape)
   ============================================================================= */

type SkillDomain = "self" | "people" | "thinking" | "making";

type SkillCardDef = {
  id: string;
  domain: SkillDomain;
  label: string;
  oneLine: string;
  whenFed: string;
  whenStarved: string;
  upside: string;
  watchout: string;
  receipts: string[];
  score: number;
};

const DOMAIN_ACCENTS: Record<SkillDomain, RGB[]> = {
  self: [
    { r: 255, g: 190, b: 110 }, // ember
    { r: 190, g: 140, b: 255 }, // violet
  ],
  people: [
    { r: 120, g: 200, b: 255 }, // sky
    { r: 255, g: 150, b: 230 }, // pink
  ],
  thinking: [
    { r: 190, g: 140, b: 255 }, // violet
    { r: 160, g: 255, b: 140 }, // lime
  ],
  making: [
    { r: 120, g: 255, b: 190 }, // mint
    { r: 120, g: 200, b: 255 }, // sky
  ],
};

function normalizeSkillHit(raw: unknown, idx: number): SkillCardDef | null {
  if (!isRecord(raw)) return null;

  const defNode: Record<string, unknown> = isRecord(raw.def) ? (raw.def as Record<string, unknown>) : raw;

  const id = cleanOneLine(asString(defNode.id ?? raw.id ?? raw.key, "")) || `skill_${idx + 1}`;

  const domainRaw = cleanOneLine(asString(defNode.domain, "thinking"));
  const domain: SkillDomain =
    domainRaw === "self" || domainRaw === "people" || domainRaw === "thinking" || domainRaw === "making"
      ? domainRaw
      : "thinking";

  const label =
    cleanOneLine(asString(defNode.label ?? defNode.title ?? defNode.name ?? raw.title ?? raw.label, "")) ||
    `Skill ${idx + 1}`;

  const oneLine = cleanOneLine(asString(defNode.oneLine, "")) || "A repeatable move you can train.";
  const whenFed = cleanOneLine(asString(defNode.whenFed, "")) || "";
  const whenStarved = cleanOneLine(asString(defNode.whenStarved, "")) || "";
  const upside = cleanOneLine(asString(defNode.upside, "")) || "";
  const watchout = cleanOneLine(asString(defNode.watchout, "")) || "";

  const receiptsRaw = raw.receipts;
  const receipts =
    Array.isArray(receiptsRaw)
      ? receiptsRaw
          .filter((x): x is string => typeof x === "string")
          .map((x) => cleanOneLine(x))
          .filter(Boolean)
          .slice(0, 2)
      : [];

  const score = clamp01(asNumber(raw.score, 0));

  return { id, domain, label, oneLine, whenFed, whenStarved, upside, watchout, receipts, score };
}

type BuilderArgs = {
  name: string;
  signals: SignalLike[];
  terms: WordCloudItemLike[];
  receipts: string[];
  topN: number;
};

type BuilderResultRecord = Record<string, unknown>;

type BuilderFn = (args: BuilderArgs) => unknown;

function firstFunction(mod: Record<string, unknown>, keys: string[]): BuilderFn | null {
  for (const k of keys) {
    const fn = mod[k];
    if (typeof fn === "function") return fn as BuilderFn;
  }
  return null;
}

function readListFromBuilderResult(res: unknown): unknown[] | null {
  if (Array.isArray(res)) return res;

  if (!isRecord(res)) return null;

  const top6 = (res as BuilderResultRecord).top6;
  if (Array.isArray(top6)) return top6;

  const skills = (res as BuilderResultRecord).skills;
  if (isRecord(skills) && Array.isArray((skills as BuilderResultRecord).top6)) return (skills as BuilderResultRecord).top6 as unknown[];

  const items = (res as BuilderResultRecord).items;
  if (Array.isArray(items)) return items;

  return null;
}

function getTextField(res: unknown, key: string): string {
  if (!isRecord(res)) return "";
  return cleanOneLine(asString((res as BuilderResultRecord)[key], ""));
}

function getBooleanField(res: unknown, key: string): boolean {
  if (!isRecord(res)) return false;
  return Boolean((res as BuilderResultRecord)[key]);
}

function getTaxonomyProfile(args: {
  name: string;
  signals: SignalLike[];
  terms: WordCloudItemLike[];
  receipts: string[];
  topN: number;
}): {
  introLine: string;
  proofLine: string;
  watchoutLine: string;
  isDefault: boolean;
  items: SkillCardDef[];
} | null {
  const mod = SkillsTaxonomy as unknown as Record<string, unknown>;

  const builder = firstFunction(mod, [
    "buildSkillsProfile",
    "buildSkillProfile",
    "buildSkillsTaxonomy",
    "buildSkillTaxonomy",
  ]);

  if (!builder) return null;

  try {
    const res = builder({
      name: args.name,
      signals: args.signals,
      terms: args.terms,
      receipts: args.receipts,
      topN: args.topN,
    });

    const list = readListFromBuilderResult(res);
    if (!Array.isArray(list)) return null;

    const introLine =
      getTextField(res, "introLine") || "Here are the skills you seem to reach for when things get real.";
    const proofLine = getTextField(res, "proofLine") || "These are grounded in your themes + examples.";
    const watchoutLine =
      getTextField(res, "watchoutLine") || "If this feels generic, we need a couple more real examples.";
    const isDefault = getBooleanField(res, "isDefault");

    const items: SkillCardDef[] = [];
    const seen = new Set<string>();

    for (let i = 0; i < list.length; i += 1) {
      const st = normalizeSkillHit(list[i], i);
      if (!st) continue;
      if (seen.has(st.id)) continue;
      seen.add(st.id);
      items.push(st);
      if (items.length >= args.topN) break;
    }

    return { introLine, proofLine, watchoutLine, isDefault, items };
  } catch {
    return null;
  }
}

/* =============================================================================
   Component
   ============================================================================= */

export default function SkillsTab(props: {
  dark: boolean;
  mounted: boolean;
  tab: string;
  nameFromHeadline: string;
  model: unknown; // <-- matches page.tsx: model={skillsModel}
  nextStepsSkills: NextStepsDefinition | null;
}): React.JSX.Element {
  const { dark, mounted, tab, nameFromHeadline, model, nextStepsSkills } = props;

  const { signals, terms, receipts } = React.useMemo(() => {
    const m = model;

    // Try common places the VM keeps summary data
    let summary: Record<string, unknown> | null = null;

    if (isRecord(m) && isRecord(m.summary)) summary = m.summary as Record<string, unknown>;
    else if (isRecord(m) && isRecord(m.vm) && isRecord((m.vm as Record<string, unknown>).summary))
      summary = ((m.vm as Record<string, unknown>).summary as Record<string, unknown>) ?? null;
    else if (isRecord(m) && isRecord(m.source) && isRecord((m.source as Record<string, unknown>).summary))
      summary = ((m.source as Record<string, unknown>).summary as Record<string, unknown>) ?? null;

    const signalBarRaw = summary?.signalBar ?? (isRecord(m) ? m.signalBar : undefined);
    const wordCloudRaw = summary?.wordCloud ?? (isRecord(m) ? m.wordCloud : undefined);

    const signals = normalizeSignals(signalBarRaw);
    const terms = normalizeWordCloud(wordCloudRaw);
    const receipts = extractReceiptsFromSignals(signals, terms);

    return { signals, terms, receipts };
  }, [model]);

  const profile = React.useMemo(() => {
    const p = getTaxonomyProfile({
      name: nameFromHeadline,
      signals,
      terms,
      receipts,
      topN: 6,
    });

    if (p) return p;

    return {
      introLine:
        (nameFromHeadline ? `${nameFromHeadline}, ` : "") +
        "I can’t load the skills taxonomy right now — but once it’s connected, you’ll see a ranked set of repeatable skills here.",
      proofLine: "Proof: (taxonomy unavailable).",
      watchoutLine: "Watchout: if this persists, check skillsTaxonomy export names + import path.",
      isDefault: true,
      items: [] as SkillCardDef[],
    };
  }, [nameFromHeadline, signals, terms, receipts]);

  return (
    <section className="mb-6">
      <style jsx>{`
        .el-skill-chip {
          background: linear-gradient(
            180deg,
            rgba(var(--c), ${dark ? "0.22" : "0.14"}),
            rgba(255, 255, 255, ${dark ? "0.03" : "0.88"})
          );
          border-color: rgba(var(--c), ${dark ? "0.50" : "0.30"});
          box-shadow: 0 0 0 1px rgba(var(--c), ${dark ? "0.14" : "0.10"}),
            0 14px 44px rgba(0, 0, 0, ${dark ? "0.40" : "0.10"}), 0 0 34px rgba(var(--c), ${dark ? "0.26" : "0.18"});
        }
        .el-skill-chip:hover {
          transform: translateY(-1px);
          background: linear-gradient(
            180deg,
            rgba(var(--c), ${dark ? "0.30" : "0.18"}),
            rgba(255, 255, 255, ${dark ? "0.05" : "0.94"})
          );
          border-color: rgba(var(--c), ${dark ? "0.60" : "0.40"});
          box-shadow: 0 0 0 1px rgba(var(--c), ${dark ? "0.20" : "0.12"}),
            0 18px 60px rgba(0, 0, 0, ${dark ? "0.46" : "0.12"}), 0 0 48px rgba(var(--c), ${dark ? "0.38" : "0.24"});
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
              dark
                ? "bg-gradient-to-b from-white/[0.05] via-transparent to-transparent"
                : "bg-gradient-to-b from-black/[0.04] via-transparent to-transparent",
            ].join(" ")}
          />
        </div>

        <div className="relative">
          <div className={sectionKicker(dark)}>Skills</div>

          <div
            className={[
              "mt-2 text-[20px] md:text-[22px] font-semibold tracking-tight leading-snug",
              sectionTitle(dark),
            ].join(" ")}
          >
            Your repeatable moves.
          </div>

          <p className={["mt-3 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>{profile.introLine}</p>

          <div className={["mt-3 text-[13px] leading-relaxed", mutedText(dark)].join(" ")}>
            {profile.proofLine}
            <span className={dark ? "text-white/35" : "text-slate-500"}> · </span>
            {profile.watchoutLine}
          </div>
        </div>

        <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

        <div className="relative">
          <div className={sectionKicker(dark)}>Your skills</div>
          <div className={["mt-2 text-[13px] leading-relaxed", mutedText(dark)].join(" ")}>
            Read this like a playbook — not a résumé.
            {mounted ? ` (${profile.items.length} shown.)` : ""}
          </div>

          {profile.items.length ? (
            <div className="mt-4 space-y-3">
              {profile.items.map((sk, idx) => {
                const palette = DOMAIN_ACCENTS[sk.domain] ?? DOMAIN_ACCENTS.thinking;
                const accent = pickAccent(sk.id, palette);
                const a = rgb(accent);

                const chips: string[] = [
                  sk.upside ? cleanOneLine(sk.upside).replace(/\.$/, "") : "",
                  sk.receipts?.[0] ? cleanOneLine(sk.receipts[0]).replace(/^Theme:\s*/i, "") : "",
                ]
                  .filter(Boolean)
                  .slice(0, 3);

                return (
                  <div
                    key={`${sk.id}_${idx}`}
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
                        <div className={["text-[16px] font-semibold", sectionTitle(dark)].join(" ")}>{sk.label}</div>

                        <div
                          className={[
                            "ml-2 text-[12px] font-semibold uppercase tracking-[0.14em]",
                            mutedText(dark),
                          ].join(" ")}
                        >
                          {sk.domain}
                        </div>
                      </div>

                      <p className={["mt-2 text-[14px] leading-relaxed", dark ? "text-white/82" : "text-slate-700"].join(" ")}>
                        {sk.oneLine}
                      </p>

                      {sk.whenFed || sk.whenStarved ? (
                        <div className="mt-3 grid gap-2 md:grid-cols-2">
                          {sk.whenFed ? (
                            <div
                              className={[
                                "rounded-[18px] border px-3.5 py-3",
                                dark ? "border-white/10 bg-white/[0.03]" : "border-black/10 bg-white/80",
                              ].join(" ")}
                            >
                              <div className={["text-[12px] font-semibold uppercase tracking-[0.14em]", mutedText(dark)].join(" ")}>
                                When it’s fed
                              </div>
                              <div className={["mt-1 text-[13px] leading-relaxed", bodyText(dark)].join(" ")}>{sk.whenFed}</div>
                            </div>
                          ) : null}

                          {sk.whenStarved ? (
                            <div
                              className={[
                                "rounded-[18px] border px-3.5 py-3",
                                dark ? "border-white/10 bg-white/[0.03]" : "border-black/10 bg-white/80",
                              ].join(" ")}
                            >
                              <div className={["text-[12px] font-semibold uppercase tracking-[0.14em]", mutedText(dark)].join(" ")}>
                                When it’s starved
                              </div>
                              <div className={["mt-1 text-[13px] leading-relaxed", bodyText(dark)].join(" ")}>{sk.whenStarved}</div>
                            </div>
                          ) : null}
                        </div>
                      ) : null}

                      {(chips.length || sk.watchout) && (
                        <div className="mt-3">
                          {chips.length ? (
                            <div className="flex flex-wrap gap-2">
                              {chips.map((t) => {
                                const chipAccent = pickAccent(`${sk.id}:${t}`, [accent, ...palette]);
                                return (
                                  <span
                                    key={`${sk.id}_chip_${t}`}
                                    className={[chipShell(dark), "el-skill-chip"].join(" ")}
                                    style={{ "--c": rgb(chipAccent) } as CSSVars}
                                  >
                                    {t}
                                  </span>
                                );
                              })}
                            </div>
                          ) : null}

                          {sk.watchout ? (
                            <div className={["mt-3 text-[13px] leading-relaxed", mutedText(dark)].join(" ")}>
                              <span className={dark ? "text-white/55" : "text-slate-600"}>Watch-out: </span>
                              {sk.watchout.replace(/\.$/, "")}.
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={["mt-4 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>Skills are loading…</div>
          )}
        </div>

        <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

        <div className="relative">
          <QuickFeedbackInline dark={dark} contextTag={`insights:${tab}:skills`} />
        </div>

        <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

        <div className="relative">
          <div className={sectionKicker(dark)}>One small move</div>
          <div className={["mt-2 text-[14px] leading-relaxed", mutedText(dark)].join(" ")}>
            Pick one skill and feed it on purpose this week. Small is fine. Real is the point.
          </div>

          {nextStepsSkills ? (
            <div className="mt-4">
              <NextStepsStack dark={dark} useLocal={mounted} definition={nextStepsSkills} variant="embedded" collapsible={false} defaultOpen />
            </div>
          ) : (
            <div className={["mt-4 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>Next steps are loading…</div>
          )}
        </div>
      </div>
    </section>
  );
}