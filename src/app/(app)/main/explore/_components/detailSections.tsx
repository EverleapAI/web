// apps/web/src/app/(app)/main/explore/_components/detailSections.tsx
//
// The Explore path detail spine, extracted into presentational section bodies so
// they can render both inline on the essentials screen (Why-it-fits) and as
// standalone drill-down screens (Reality / Trajectory / Next steps / Branches).
// No accordions here — each body is the full section; the caller supplies the
// card/header wrapper. Kept defensive (optional chaining) so a lite/partial path
// never throws the way the client scorer once did.

"use client";

import * as React from "react";
import {
  BookmarkCheck,
  ChevronDown,
  ExternalLink,
  Loader2,
  MapPin,
  Monitor,
  Plus,
} from "lucide-react";

import {
  type ExplorePath,
  type FitSignal,
  type PathBranchPreview,
  type Rgb,
  type TrajectoryTone,
} from "../_data/exploreSchema";
import { useSavedActions } from "../_lib/exploreActions";
import { rgba } from "./exploreUi";

export const TONE_COLOR: Record<TrajectoryTone, Rgb> = {
  positive: { r: 87, g: 214, b: 160 },
  warning: { r: 244, g: 198, b: 103 },
  mixed: { r: 92, g: 180, b: 255 },
  neutral: { r: 210, g: 218, b: 235 },
};

export function Bullets({ items, accent }: { items: string[]; accent: Rgb }) {
  return (
    <ul className="mt-2 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-[14px] font-normal leading-[1.65] tracking-[0] text-[#E3E7EF]">
          <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: rgba(accent, 0.85) }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function FitSignalRow({ signal, accent }: { signal: FitSignal; accent: Rgb }) {
  const [open, setOpen] = React.useState(false);
  const pct = Math.max(6, Math.min(100, signal.score));
  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className="w-full rounded-2xl border border-white/6 bg-white/[0.02] px-3.5 py-3 text-left transition hover:bg-white/[0.04]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[14px] font-medium text-white/88">{signal.label}</span>
        <span className="flex items-center gap-2">
          <span className="text-[12px] font-semibold tabular-nums text-white/55">{signal.score}</span>
          <ChevronDown className={`h-4 w-4 text-white/45 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${rgba(accent, 0.9)}, ${rgba(accent, 0.5)})` }} />
      </div>
      {open ? <p className="mt-2.5 text-[13px] font-normal leading-[1.65] tracking-[0] text-[#878B95]">{signal.explanation}</p> : null}
    </button>
  );
}

function BranchCard({
  preview,
  detail,
  accent,
}: {
  preview: PathBranchPreview;
  detail?: { whatYouActuallyDo: string[]; skillsThatGrowHere: string[]; starterProjects: string[] };
  accent: Rgb;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-[15px] font-semibold text-[#F7F9FC]">{preview.title}</h4>
          <p className="mt-1 text-[13px] font-normal leading-[1.65] tracking-[0] text-[#878B95]">{preview.oneLiner}</p>
        </div>
        {detail ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] p-1.5 text-white/60 transition hover:text-white"
            aria-label="Toggle details"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        ) : null}
      </div>
      <p className="mt-2 text-[13px] font-normal leading-[1.65] tracking-[0] text-[#878B95]">
        <span className="font-semibold text-[#F7F9FC]">Could fit you if: </span>
        {preview.whyItCouldFit}
      </p>
      {open && detail ? (
        <div className="mt-3 space-y-3 border-t border-white/8 pt-3">
          {detail.whatYouActuallyDo.length ? (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">What you actually do</div>
              <Bullets items={detail.whatYouActuallyDo} accent={accent} />
            </div>
          ) : null}
          {detail.skillsThatGrowHere.length ? (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">Skills that grow here</div>
              <Bullets items={detail.skillsThatGrowHere} accent={accent} />
            </div>
          ) : null}
          {detail.starterProjects.length ? (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">Starter projects</div>
              <Bullets items={detail.starterProjects} accent={accent} />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/* ── Section bodies ──────────────────────────────────────────────────────── */

export function WhyFitsSection({ path, accent }: { path: ExplorePath; accent: Rgb }) {
  const ov = path.overview;
  return (
    <>
      {ov?.fitSignals?.length ? (
        <div className="space-y-2">
          {ov.fitSignals.slice(0, 3).map((s) => (
            <FitSignalRow key={s.id} signal={s} accent={accent} />
          ))}
        </div>
      ) : null}
      {ov?.whyItPullsYouIn?.length ? (
        <div className="mt-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">Why it pulls people in</div>
          <Bullets items={ov.whyItPullsYouIn.slice(0, 3)} accent={accent} />
        </div>
      ) : null}
    </>
  );
}

export function RealitySection({ path, accent }: { path: ExplorePath; accent: Rgb }) {
  const r = path.reality;
  if (!r) return null;
  return (
    <>
      {genericRealityTitle(r.title) ? null : (
        <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-white">{r.title}</h2>
      )}
      {r.summary ? <p className="mt-2 text-[14px] font-normal leading-[1.65] tracking-[0] text-[#E3E7EF]">{r.summary}</p> : null}
      {r.pulse ? (
        <p className="mt-3 border-l-2 pl-3 text-[14px] italic leading-[1.6] text-white/78" style={{ borderColor: rgba(accent, 0.5) }}>
          {r.pulse}
        </p>
      ) : null}
      {r.moments?.length ? (
        <ol className="mt-4 space-y-3">
          {r.moments.map((m) => (
            <li key={m.id} className="rounded-2xl border border-white/6 bg-white/[0.02] px-4 py-3">
              {m.timeLabel ? (
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: rgba(accent, 0.85) }}>{m.timeLabel}</div>
              ) : null}
              <div className="mt-0.5 text-[14px] font-semibold text-white">{m.title}</div>
              <p className="mt-1 text-[13.5px] font-normal leading-[1.65] tracking-[0] text-[#E3E7EF]">{m.body}</p>
            </li>
          ))}
        </ol>
      ) : null}
    </>
  );
}

export function TrajectorySection({ path, accent }: { path: ExplorePath; accent: Rgb }) {
  const t = path.trajectory;
  if (!t) return null;
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-white">{t.outlookLabel}</h2>
      </div>
      {t.outlookSummary ? <p className="mt-2 text-[14px] font-normal leading-[1.65] tracking-[0] text-[#E3E7EF]">{t.outlookSummary}</p> : null}

      {t.metrics?.length ? (
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {t.metrics.map((m) => {
            const tone = TONE_COLOR[m.tone ?? "neutral"] ?? TONE_COLOR.neutral;
            return (
              <div key={m.id} className="rounded-2xl border border-white/8 bg-white/[0.02] px-3 py-2.5">
                <div className="text-[11px] uppercase tracking-[0.12em] text-white/42">{m.label}</div>
                <div className="mt-1 text-[16px] font-semibold tracking-[-0.02em]" style={{ color: rgba(tone, 0.95) }}>{m.value}</div>
                {m.note ? <div className="mt-0.5 text-[11.5px] leading-[1.4] text-white/50">{m.note}</div> : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {t.salaryBand?.median ? (
        <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">Typical pay</div>
          <div className="mt-1.5 flex items-baseline gap-3 text-white">
            <span className="text-[13px] text-white/55">{t.salaryBand.low}</span>
            <span className="text-[19px] font-semibold tracking-[-0.02em]">{t.salaryBand.median}</span>
            <span className="text-[13px] text-white/55">{t.salaryBand.high}</span>
          </div>
          {t.salaryBand.note ? <div className="mt-1 text-[12px] text-white/50">{t.salaryBand.note}</div> : null}
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {t.whatIsGrowing?.length ? (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: rgba(TONE_COLOR.positive, 0.85) }}>What&apos;s growing</div>
            <Bullets items={t.whatIsGrowing} accent={TONE_COLOR.positive} />
          </div>
        ) : null}
        {t.whatIsUnderPressure?.length ? (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: rgba(TONE_COLOR.warning, 0.85) }}>Under pressure</div>
            <Bullets items={t.whatIsUnderPressure} accent={TONE_COLOR.warning} />
          </div>
        ) : null}
      </div>

      {t.aiImpact?.summary ? (
        <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">AI impact</div>
          <p className="mt-1.5 text-[13.5px] font-normal leading-[1.65] tracking-[0] text-[#E3E7EF]">{t.aiImpact.summary}</p>
        </div>
      ) : null}
    </>
  );
}

export function NextStepsSection({ path, accent }: { path: ExplorePath; accent: Rgb }) {
  const actions = useSavedActions(path.lane, `${path.lane}:${path.slug}`);
  const ns = path.nextSteps;
  if (!ns) return null;
  return (
    <>
      {ns.heroSummary ? <p className="mb-3 text-[14px] font-normal leading-[1.65] tracking-[0] text-[#E3E7EF]">{ns.heroSummary}</p> : null}
      <div className="space-y-4">
        {ns.sections.filter((s) => s.items.length).map((s) => (
          <div key={s.id}>
            <div className="mb-2 flex items-center gap-2 text-[12.5px] font-semibold text-white/80">
              {s.mode === "local" ? <MapPin className="h-4 w-4 text-white/55" /> : <Monitor className="h-4 w-4 text-white/55" />}
              <span>{s.title}</span>
            </div>
            <div className="space-y-2">
              {s.items.map((it) => {
                const saved = actions.isSaved(it.title);
                const saving = actions.savingTitle === it.title;
                return (
                  <div
                    key={it.id}
                    className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]"
                  >
                    <a
                      href={it.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-start justify-between gap-3 px-4 pb-2 pt-3 transition hover:bg-white/[0.03]"
                    >
                      <span className="min-w-0">
                        <span className="text-[14px] font-medium text-white/88">{it.title}</span>
                        {it.note ? <span className="mt-0.5 block text-[12.5px] leading-[1.5] text-white/55">{it.note}</span> : null}
                      </span>
                      <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-white/40 transition group-hover:text-white/70" />
                    </a>
                    <div className="border-t border-white/[0.06] px-3 py-2">
                      <button
                        type="button"
                        onClick={() => actions.save({ title: it.title, description: it.note, href: it.href })}
                        disabled={saved || saving}
                        aria-label={saved ? "Added to your Actions" : "Add to my Actions"}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition hover:brightness-110 disabled:cursor-default disabled:hover:brightness-100"
                        style={
                          saved
                            ? { backgroundColor: rgba(accent, 0.14), color: rgba(accent, 0.95) }
                            : { backgroundColor: rgba(accent, 0.18), color: "#fff" }
                        }
                      >
                        {saving ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : saved ? (
                          <BookmarkCheck className="h-3.5 w-3.5" />
                        ) : (
                          <Plus className="h-3.5 w-3.5" />
                        )}
                        {saving ? "Adding…" : saved ? "Added to Actions" : "Add to my Actions"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function BranchesSection({ path, accent }: { path: ExplorePath; accent: Rgb }) {
  const b = path.branches;
  if (!b) return null;
  return (
    <div className="grid gap-3">
      {b.previews.map((p) => (
        <BranchCard
          key={p.id}
          preview={p}
          detail={b.detail.find((d) => d.slug === p.slug)}
          accent={accent}
        />
      ))}
    </div>
  );
}

/* ── Section registry (drives the essentials menu + section screens) ──────── */

export type SectionKey = "reality" | "outlook" | "try" | "specialties";
export type SectionMeta = { key: SectionKey; title: string; teaser: string };

const SECTION_KEYS: SectionKey[] = ["reality", "outlook", "try", "specialties"];
export function isSectionKey(v: unknown): v is SectionKey {
  return typeof v === "string" && (SECTION_KEYS as string[]).includes(v);
}

export function genericRealityTitle(t?: string): boolean {
  return !t || t.trim().toLowerCase().replace(/[.!]+$/, "") === "what it's really like";
}

/** The deep sections that actually have content, in order — for the essentials
 *  menu and for validating a section-screen URL. */
export function getSectionMenu(path: ExplorePath): SectionMeta[] {
  const out: SectionMeta[] = [];

  const r = path.reality;
  const hasReality = Boolean(r && (r.moments?.length || r.summary));
  if (hasReality && r) {
    const teaser =
      r.summary?.trim().slice(0, 96) ||
      r.pulse?.trim().slice(0, 96) ||
      (genericRealityTitle(r.title) ? "What a real day actually looks like" : r.title);
    out.push({ key: "reality", title: "What it's really like", teaser });
  }

  const t = path.trajectory;
  const payMedian = t?.salaryBand?.median;
  const hasTrajectory = Boolean(t && (t.metrics?.length || t.salaryBand || t.whatIsGrowing?.length));
  if (hasTrajectory && t) {
    const teaser =
      [t.outlookLabel, payMedian ? `typically ${payMedian}` : null].filter(Boolean).join(" · ") ||
      "Where this can take you";
    out.push({ key: "outlook", title: "Where it leads", teaser });
  }

  const ns = path.nextSteps;
  const stepCount = ns?.sections?.reduce((n, s) => n + s.items.length, 0) ?? 0;
  if (stepCount > 0) {
    out.push({
      key: "try",
      title: "Try it for real",
      teaser: `${stepCount} way${stepCount > 1 ? "s" : ""} to try it for real`,
    });
  }

  const b = path.branches;
  if (b && b.previews?.length) {
    out.push({
      key: "specialties",
      title: b.label ? b.label[0].toUpperCase() + b.label.slice(1) : "Directions",
      teaser: b.intro ? b.intro : `${b.previews.length} directions this can go`,
    });
  }

  return out;
}

export function SectionBody({
  path,
  section,
  accent,
}: {
  path: ExplorePath;
  section: SectionKey;
  accent: Rgb;
}) {
  switch (section) {
    case "reality":
      return <RealitySection path={path} accent={accent} />;
    case "outlook":
      return <TrajectorySection path={path} accent={accent} />;
    case "try":
      return <NextStepsSection path={path} accent={accent} />;
    case "specialties":
      return <BranchesSection path={path} accent={accent} />;
    default:
      return null;
  }
}
