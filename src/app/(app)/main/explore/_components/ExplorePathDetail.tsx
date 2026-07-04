// apps/web/src/app/(app)/main/explore/_components/ExplorePathDetail.tsx
//
// The single, reskinned detail engine for every Explore lane. Renders an
// ExplorePath's full spine (overview -> reality -> trajectory -> next steps ->
// optional branches) as one page with a sticky section sub-nav. Styled on the
// site's SectionCard system.

"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ExternalLink,
  Loader2,
  MapPin,
  Monitor,
} from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import {
  laneAccent,
  type ExplorePath,
  type FitSignal,
  type PathBranchPreview,
  type Rgb,
  type TrajectoryTone,
} from "../_data/exploreSchema";
import { useExploreProfile } from "../_lib/exploreProfile";
import { useSavedActions } from "../_lib/exploreActions";
import { scorePath } from "../_lib/scorePath";
import { LANE_NOUN, SectionHeader, SignalChip, rgba } from "./exploreUi";

const TONE_COLOR: Record<TrajectoryTone, Rgb> = {
  positive: { r: 87, g: 214, b: 160 },
  warning: { r: 244, g: 198, b: 103 },
  mixed: { r: 92, g: 180, b: 255 },
  neutral: { r: 210, g: 218, b: 235 },
};

function Bullets({ items, accent }: { items: string[]; accent: Rgb }) {
  return (
    <ul className="mt-2 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-[14px] leading-[1.6] text-white/78">
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
      {open ? <p className="mt-2.5 text-[13px] leading-[1.6] text-white/66">{signal.explanation}</p> : null}
    </button>
  );
}

function BranchCard({ preview, detail, accent }: { preview: PathBranchPreview; detail?: { whatYouActuallyDo: string[]; skillsThatGrowHere: string[]; starterProjects: string[] }; accent: Rgb }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-[15px] font-semibold text-white">{preview.title}</h4>
          <p className="mt-1 text-[13px] leading-[1.55] text-white/64">{preview.oneLiner}</p>
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
      <p className="mt-2 text-[13px] leading-[1.55] text-white/58">
        <span className="font-medium text-white/72">Could fit you if: </span>
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

export function ExplorePathDetail({ path }: { path: ExplorePath }) {
  const accent = laneAccent(path);
  const { profile } = useExploreProfile();
  const score = profile ? scorePath(path, profile) : 67;
  const actions = useSavedActions(path.lane, `${path.lane}:${path.slug}`);

  const hasReality = path.reality.moments.length > 0 || Boolean(path.reality.summary);
  const hasTrajectory =
    path.trajectory.metrics.length > 0 ||
    Boolean(path.trajectory.salaryBand) ||
    path.trajectory.whatIsGrowing.length > 0;
  const hasNextSteps = path.nextSteps.sections.some((s) => s.items.length > 0);
  const hasBranches = Boolean(path.branches && path.branches.previews.length > 0);

  const nav = [
    { id: "overview", label: "Overview" },
    hasReality ? { id: "reality", label: "What it's like" } : null,
    hasTrajectory ? { id: "trajectory", label: "Where it leads" } : null,
    hasNextSteps ? { id: "nextsteps", label: "Try it" } : null,
    hasBranches ? { id: "branches", label: path.branches!.label } : null,
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <div className="space-y-4 pb-24">
      <Link
        href={`/main/explore/${path.lane}`}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/55 transition hover:text-white/85"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to {path.lane[0].toUpperCase() + path.lane.slice(1)}</span>
      </Link>

      {/* Hero */}
      <SectionCard tone="hero">
        <div className="max-w-2xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
            {path.overview.eyebrow ?? LANE_NOUN[path.lane]}
          </div>
          <h1 className="mt-2 text-[27px] font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-[32px]">
            {path.overview.title}
          </h1>
          <div className="mt-3">
            <SignalChip score={score} accent={accent} />
          </div>
          {path.overview.hook ? (
            <p className="mt-4 text-[15px] font-medium leading-[1.6] text-white/86">{path.overview.hook}</p>
          ) : null}
          {path.overview.summary ? (
            <p className="mt-2.5 text-[14px] leading-[1.68] text-white/70">{path.overview.summary}</p>
          ) : null}
        </div>
      </SectionCard>

      {/* Sticky section sub-nav */}
      {nav.length > 1 ? (
        <div className="sticky top-2 z-20 -mx-1 flex gap-2 overflow-x-auto px-1 py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {nav.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="shrink-0 whitespace-nowrap rounded-full border border-white/10 bg-slate-950/70 px-3.5 py-1.5 text-[12.5px] font-semibold text-white/70 backdrop-blur-xl transition hover:text-white"
            >
              {n.label}
            </a>
          ))}
        </div>
      ) : null}

      {/* Overview — why it fits */}
      <SectionCard tone="neutral" className="scroll-mt-16" >
        <div id="overview" />
        <SectionHeader accent={accent}>Why this could fit you</SectionHeader>
        {path.overview.traitChips.length ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {path.overview.traitChips.map((c) => (
              <span key={c.id} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12.5px] text-white/74">
                {c.label}
              </span>
            ))}
          </div>
        ) : null}
        {path.overview.fitSignals.length ? (
          <div className="space-y-2">
            {path.overview.fitSignals.slice(0, 5).map((s) => (
              <FitSignalRow key={s.id} signal={s} accent={accent} />
            ))}
          </div>
        ) : null}
        {path.overview.whyItPullsYouIn.length ? (
          <div className="mt-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">Why it pulls people in</div>
            <Bullets items={path.overview.whyItPullsYouIn} accent={accent} />
          </div>
        ) : null}
      </SectionCard>

      {/* Reality */}
      {hasReality ? (
        <SectionCard tone="plum" className="scroll-mt-16">
          <div id="reality" />
          <SectionHeader accent={accent}>What it's really like</SectionHeader>
          <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-white">{path.reality.title}</h2>
          {path.reality.summary ? <p className="mt-2 text-[14px] leading-[1.66] text-white/74">{path.reality.summary}</p> : null}
          {path.reality.pulse ? (
            <p className="mt-3 border-l-2 pl-3 text-[14px] italic leading-[1.6] text-white/78" style={{ borderColor: rgba(accent, 0.5) }}>
              {path.reality.pulse}
            </p>
          ) : null}
          {path.reality.moments.length ? (
            <ol className="mt-4 space-y-3">
              {path.reality.moments.map((m) => (
                <li key={m.id} className="rounded-2xl border border-white/6 bg-white/[0.02] px-4 py-3">
                  {m.timeLabel ? (
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: rgba(accent, 0.85) }}>{m.timeLabel}</div>
                  ) : null}
                  <div className="mt-0.5 text-[14px] font-semibold text-white">{m.title}</div>
                  <p className="mt-1 text-[13.5px] leading-[1.6] text-white/68">{m.body}</p>
                </li>
              ))}
            </ol>
          ) : null}
        </SectionCard>
      ) : null}

      {/* Trajectory */}
      {hasTrajectory ? (
        <SectionCard tone="teal" className="scroll-mt-16">
          <div id="trajectory" />
          <SectionHeader accent={accent}>Where it leads</SectionHeader>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-white">{path.trajectory.outlookLabel}</h2>
          </div>
          {path.trajectory.outlookSummary ? <p className="mt-2 text-[14px] leading-[1.66] text-white/74">{path.trajectory.outlookSummary}</p> : null}

          {path.trajectory.metrics.length ? (
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {path.trajectory.metrics.map((m) => {
                const tone = TONE_COLOR[m.tone ?? "neutral"];
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

          {path.trajectory.salaryBand ? (
            <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">Typical pay</div>
              <div className="mt-1.5 flex items-baseline gap-3 text-white">
                <span className="text-[13px] text-white/55">{path.trajectory.salaryBand.low}</span>
                <span className="text-[19px] font-semibold tracking-[-0.02em]">{path.trajectory.salaryBand.median}</span>
                <span className="text-[13px] text-white/55">{path.trajectory.salaryBand.high}</span>
              </div>
              {path.trajectory.salaryBand.note ? <div className="mt-1 text-[12px] text-white/50">{path.trajectory.salaryBand.note}</div> : null}
            </div>
          ) : null}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {path.trajectory.whatIsGrowing.length ? (
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: rgba(TONE_COLOR.positive, 0.85) }}>What's growing</div>
                <Bullets items={path.trajectory.whatIsGrowing} accent={TONE_COLOR.positive} />
              </div>
            ) : null}
            {path.trajectory.whatIsUnderPressure.length ? (
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: rgba(TONE_COLOR.warning, 0.85) }}>Under pressure</div>
                <Bullets items={path.trajectory.whatIsUnderPressure} accent={TONE_COLOR.warning} />
              </div>
            ) : null}
          </div>

          {path.trajectory.aiImpact ? (
            <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">AI impact</div>
              <p className="mt-1.5 text-[13.5px] leading-[1.6] text-white/72">{path.trajectory.aiImpact.summary}</p>
            </div>
          ) : null}
        </SectionCard>
      ) : null}

      {/* Next steps */}
      {hasNextSteps ? (
        <SectionCard tone="neutral" className="scroll-mt-16">
          <div id="nextsteps" />
          <SectionHeader accent={accent}>Try it for real</SectionHeader>
          {path.nextSteps.heroSummary ? <p className="mb-3 text-[14px] leading-[1.66] text-white/72">{path.nextSteps.heroSummary}</p> : null}
          <div className="space-y-4">
            {path.nextSteps.sections.filter((s) => s.items.length).map((s) => (
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
                        className="group flex items-stretch gap-0 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] transition hover:bg-white/[0.04]"
                      >
                        <a
                          href={it.href}
                          target="_blank"
                          rel="noreferrer"
                          className="flex min-w-0 flex-1 items-start justify-between gap-3 px-4 py-3"
                        >
                          <span className="min-w-0">
                            <span className="text-[14px] font-medium text-white/88">{it.title}</span>
                            {it.note ? <span className="mt-0.5 block text-[12.5px] leading-[1.5] text-white/55">{it.note}</span> : null}
                          </span>
                          <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-white/40 transition group-hover:text-white/70" />
                        </a>
                        <button
                          type="button"
                          onClick={() => actions.save({ title: it.title, description: it.note, href: it.href })}
                          disabled={saved || saving}
                          aria-label={saved ? "Saved to Actions" : "Save to Actions"}
                          title={saved ? "Saved to Actions" : "Save to Actions"}
                          className="flex w-11 shrink-0 items-center justify-center border-l border-white/8 text-white/45 transition hover:bg-white/[0.04] hover:text-white/85 disabled:cursor-default"
                          style={saved ? { color: rgba(accent, 0.95) } : undefined}
                        >
                          {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : saved ? (
                            <BookmarkCheck className="h-4 w-4" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}

      {/* Branches */}
      {hasBranches && path.branches ? (
        <SectionCard tone="neutral" className="scroll-mt-16">
          <div id="branches" />
          <SectionHeader accent={accent}>
            {path.branches.label[0].toUpperCase() + path.branches.label.slice(1)}
          </SectionHeader>
          {path.branches.intro ? <p className="mb-3 text-[14px] leading-[1.66] text-white/72">{path.branches.intro}</p> : null}
          <div className="grid gap-3">
            {path.branches.previews.map((p) => (
              <BranchCard
                key={p.id}
                preview={p}
                detail={path.branches!.detail.find((d) => d.slug === p.slug)}
                accent={accent}
              />
            ))}
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}

export default ExplorePathDetail;
