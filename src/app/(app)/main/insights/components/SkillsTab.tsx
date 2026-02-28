"use client";

import * as React from "react";

import { NextStepsStack } from "@/app/(app)/main/components/nextSteps/NextStepsStack";

/* =============================================================================
   Type safety (avoid importing NextStepsDefinition directly)
   - Prevents "type not exported" errors from nextSteps.ts
   - Always matches what NextStepsStack expects
   ============================================================================= */

type NextStepsDefinition = React.ComponentProps<typeof NextStepsStack>["definition"];

/* =============================================================================
   Local UI helpers (copy vibe from page.tsx — no exports)
   ============================================================================= */

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

function softCard(dark: boolean) {
  return [
    "relative overflow-hidden rounded-[22px] border",
    "px-4 py-4",
    "backdrop-blur-xl transition",
    dark ? "border-white/10 bg-white/[0.045]" : "border-black/10 bg-white/85",
  ].join(" ");
}

function softChip(dark: boolean) {
  return [
    "inline-flex items-center",
    "rounded-full border px-3 py-1.5",
    "text-[13px] font-semibold",
    "backdrop-blur-xl",
    dark ? "border-white/10 bg-white/[0.04] text-white/80" : "border-black/10 bg-white/80 text-slate-800",
  ].join(" ");
}

/* =============================================================================
   Model extraction helpers (forgiving, no assumptions about VM shape)
   ============================================================================= */

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object";
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v)
    ? v
        .filter((x): x is string => typeof x === "string")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
}

function stableKey(parts: Array<string | number | null | undefined>) {
  return parts
    .map((p) => (p === null || p === undefined ? "" : String(p)))
    .join("_")
    .replace(/\s+/g, "_");
}

function uniq(list: string[]) {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const s of list) {
    const k = s.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(s);
  }
  return out;
}

type SkillItem = {
  id: string;
  title: string;
  body: string;
  showsUpAs: string[];
  goodAt: string[];
  watchOuts: string[];
};

function extractSkillsModel(model: unknown): {
  opener: string;
  items: SkillItem[];
} {
  const m = isRecord(model) ? model : {};

  const skillsNode = isRecord(m.skills) ? (m.skills as Record<string, unknown>) : null;

  const opener =
    asString((skillsNode?.opener ?? m.opener) as unknown, "").trim() ||
    asString((skillsNode?.headline ?? m.headline) as unknown, "").trim();

  const rawArray =
    (Array.isArray(skillsNode?.items) && (skillsNode?.items as unknown[])) ||
    (Array.isArray(skillsNode?.cards) && (skillsNode?.cards as unknown[])) ||
    (Array.isArray(skillsNode) && (skillsNode as unknown[])) ||
    (Array.isArray(m.items) && (m.items as unknown[])) ||
    (Array.isArray(m.cards) && (m.cards as unknown[])) ||
    [];

  const items: SkillItem[] = [];

  for (let i = 0; i < rawArray.length; i += 1) {
    const it = rawArray[i];
    if (!isRecord(it)) continue;

    const title =
      asString(it.title, "").trim() ||
      asString(it.label, "").trim() ||
      asString(it.name, "").trim() ||
      `Skill ${i + 1}`;

    const id = asString(it.id, "").trim() || asString(it.key, "").trim() || stableKey(["skill", i, title.slice(0, 32)]);

    const body =
      asString(it.body, "").trim() ||
      asString(it.narrative, "").trim() ||
      asString(it.description, "").trim();

    const showsUpAs = uniq(
      asStringArray(it.showsUpAs ?? it.shows_up_as ?? it.signals ?? it.examples ?? it.showsUp ?? it.shows)
    );
    const goodAt = uniq(asStringArray(it.goodAt ?? it.good_at ?? it.strengths ?? it.good));
    const watchOuts = uniq(asStringArray(it.watchOuts ?? it.watch_outs ?? it.watchouts ?? it.watch));

    items.push({
      id,
      title,
      body,
      showsUpAs,
      goodAt,
      watchOuts,
    });
  }

  return { opener, items };
}

/* =============================================================================
   Quick Check (inline, localStorage) — Skills-specific
   Mirrors the Strengths “inline expand + save local” UX vibe.
   ============================================================================= */

type QuickRating = "mostly" | "somewhat" | "not_really";

const QUICK_CHECK_SKILLS_STORAGE_KEY = "everleap.insights.quickCheck.skills.v1";

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
        ? "bg-white/[0.10] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_18px_44px_rgba(0,0,0,0.40),0_0_42px_rgba(110,231,183,0.12)]"
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

function readLocalQuickCheck(): { rating: QuickRating; note: string; savedAt: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(QUICK_CHECK_SKILLS_STORAGE_KEY);
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

function writeLocalQuickCheck(v: { rating: QuickRating; note: string }) {
  if (typeof window === "undefined") return;
  const payload = { ...v, savedAt: Date.now() };
  window.localStorage.setItem(QUICK_CHECK_SKILLS_STORAGE_KEY, JSON.stringify(payload));
}

function QuickCheckInline({ dark, contextTag }: { dark: boolean; contextTag: string }): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState<QuickRating | null>(null);
  const [note, setNote] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    const existing = readLocalQuickCheck();
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
    writeLocalQuickCheck({
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

      <div className="mt-2 text-[14px] leading-relaxed">
        <div className={mutedText(dark)}>
          Does this skills read feel like{" "}
          <span className={dark ? "text-white/80 font-semibold" : "text-slate-800 font-semibold"}>you</span>?
        </div>
      </div>

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
                  "radial-gradient(520px 220px at 12% 0%, rgba(110,231,183,0.14), transparent 62%)," +
                  "radial-gradient(520px 220px at 88% 0%, rgba(120,160,255,0.10), transparent 62%)," +
                  "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
                opacity: dark ? 1 : 0.7,
              }}
            />
          </div>

          <div className="relative p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className={[sectionKicker(dark), "text-[11px]"].join(" ")}>One-line note (optional)</div>
                <div className={["mt-1 text-[13px] leading-relaxed", mutedText(dark)].join(" ")}>
                  If something is missing, tell me the vibe — not a full explanation.
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
                placeholder='Example: “More creative / less academic.”'
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
                aria-label={`Quick check note (${contextTag})`}
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
              <span className={dark ? "text-white/40" : "text-slate-600"}>{QUICK_CHECK_SKILLS_STORAGE_KEY}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   Component
   ============================================================================= */

type Props = {
  dark: boolean;
  nextStepsSkills: NextStepsDefinition | null;
  mounted: boolean;
  tab: string;
  nameFromHeadline: string;
  model: unknown;
};

export default function SkillsTab(props: Props) {
  const { dark, nextStepsSkills, mounted, tab, nameFromHeadline, model } = props;

  const { opener, items } = React.useMemo(() => extractSkillsModel(model), [model]);

  const openerLine = React.useMemo(() => {
    const name = (nameFromHeadline ?? "").trim();
    const who = name ? `${name}, ` : "";
    const base =
      opener ||
      `${who}these aren’t “résumé skills.” This is the set of tools you reach for when something gets real — the moves you make without forcing it.`;

    const cleaned = base.replace(/\s+/g, " ").trim();
    return cleaned.endsWith(".") ? cleaned : `${cleaned}.`;
  }, [nameFromHeadline, opener]);

  const fallbackItems: SkillItem[] = React.useMemo(
    () => [
      {
        id: "overlap",
        title: "Finding the overlap",
        body:
          "You’re not random. When something clicks for you, it’s usually at the intersection — what you enjoy, what you’re naturally good at, and what actually matters in the real world. You tend to feel momentum when those three line up. When they don’t, things feel flat, even if they look impressive on paper.",
        showsUpAs: ["connecting interests to real impact", "spotting patterns between different areas", "turning scattered ideas into direction"],
        goodAt: ["choosing paths that feel meaningful", "building toward something that actually fits you"],
        watchOuts: ["staying in analysis mode too long", "waiting for the perfect alignment before starting"],
      },
      {
        id: "pattern",
        title: "Pattern awareness",
        body:
          "You tend to notice what’s really driving a moment — what you’re reacting to, what you’re chasing, what you’re protecting. That gives you an edge. You can adjust faster than most because you see the pattern underneath the surface. When you use that well, it looks like maturity. When you overdo it, it can turn into overthinking.",
        showsUpAs: ["naming what’s actually happening", "reading the emotional temperature", "resetting mid-spiral"],
        goodAt: ["self-correcting without drama", "learning from situations instead of repeating them"],
        watchOuts: ["over-identifying with a label", "using insight as a substitute for action"],
      },
      {
        id: "transferable",
        title: "Transferable skills",
        body:
          "You build skills that travel. What you learn in one arena tends to show up somewhere else — school, teams, work, projects. You don’t just collect experiences; you extract capability from them. That makes you adaptable. The risk is that because it feels natural, you might underestimate how valuable it actually is.",
        showsUpAs: ["learning fast in new environments", "making yourself useful quickly", "adapting without losing yourself"],
        goodAt: ["building competence through reps", "finding your role on a team"],
        watchOuts: ["calling it 'basic' because it feels easy", "under-selling what you can do"],
      },
    ],
    []
  );

  const displayItems = items.length ? items : fallbackItems;

  return (
    <section className="mb-6">
      <div className={readingSurface(dark)}>
        {/* subtle cinematic glows (no boxes-in-boxes) */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className={[
              "absolute -top-24 left-1/2 h-[260px] w-[680px] -translate-x-1/2 rounded-full blur-3xl",
              dark ? "bg-emerald-300/10" : "bg-emerald-400/10",
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
        </div>

        <div className="relative">
          <div className={sectionKicker(dark)}>Skills</div>

          <div className={["mt-2 text-[18px] font-semibold tracking-tight", sectionTitle(dark)].join(" ")}>
            Tools you reach for
          </div>

          <div className={["mt-2 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>{openerLine}</div>

          <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

          <div>
            <div className={sectionKicker(dark)}>Your skills</div>
            <div className={["mt-2 text-[14px] leading-relaxed", mutedText(dark)].join(" ")}>
              Not everything needs to be “big.” The point is: these are repeatable.
              {mounted ? ` (Showing ${displayItems.length} signal${displayItems.length === 1 ? "" : "s"}.)` : ""}
            </div>

            <div className="mt-4 space-y-3">
              {displayItems.map((s, i) => {
                const kBase = stableKey(["skill", s.id, i, s.title.slice(0, 24)]);
                const shows = s.showsUpAs.slice(0, 8);
                const good = s.goodAt.slice(0, 8);
                const watch = s.watchOuts.slice(0, 8);

                return (
                  <div key={`sk_${kBase}`} className={softCard(dark)}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className={["text-[15px] font-semibold", sectionTitle(dark)].join(" ")}>{s.title}</div>
                        <div className={["mt-1 text-[14px] leading-relaxed", bodyText(dark)].join(" ")}>
                          {s.body || "This shows up for you when things matter."}
                        </div>
                      </div>

                      <div
                        className={[
                          "shrink-0 rounded-full border px-2.5 py-1 text-[12px] font-semibold backdrop-blur-xl",
                          dark ? "border-white/10 bg-white/[0.04] text-white/70" : "border-black/10 bg-white/70 text-slate-700",
                        ].join(" ")}
                        aria-hidden
                      >
                        #{i + 1}
                      </div>
                    </div>

                    {shows.length || good.length || watch.length ? (
                      <div className="mt-4 space-y-3">
                        {shows.length ? (
                          <div>
                            <div className={sectionKicker(dark)}>Shows up as</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {shows.map((t, j) => (
                                <span key={`sk_${kBase}_show_${j}_${t}`} className={softChip(dark)}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {good.length ? (
                          <div>
                            <div className={sectionKicker(dark)}>Good at</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {good.map((t, j) => (
                                <span key={`sk_${kBase}_good_${j}_${t}`} className={softChip(dark)}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {watch.length ? (
                          <div>
                            <div className={sectionKicker(dark)}>Watch-outs</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {watch.map((t, j) => (
                                <span key={`sk_${kBase}_watch_${j}_${t}`} className={softChip(dark)}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Check must be immediately before One small move */}
          <QuickCheckInline dark={dark} contextTag={`insights:${tab}:skills`} />

          <div className={["my-6 h-px", subtleDivider(dark)].join(" ")} />

          <div>
            <div className={sectionKicker(dark)}>One small move</div>
            <div className={["mt-2 text-[14px] leading-relaxed", mutedText(dark)].join(" ")}>
              Small is fine. Real is the point. Pick something that gives one of your skills a clean place to land.
            </div>

            {nextStepsSkills ? (
              <div className="mt-4">
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
              <div className={["mt-4 text-[15px] leading-relaxed", bodyText(dark)].join(" ")}>Next steps are loading…</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}