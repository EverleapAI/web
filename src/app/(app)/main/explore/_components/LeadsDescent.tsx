// apps/web/src/app/(app)/main/explore/_components/LeadsDescent.tsx
//
// "Where it leads" gone deep. The information payoff — but as a DESCENT, not a
// wall (design-doc Concept 03 + 04): one beat per screen, each door phrased as
// the user's own question ("what would I actually earn?", "could a robot take
// this?"), and each answer drawn as an OBJECT — a pay band, AI-as-weather with
// the real breakdown, growing vs. fading. It ends on a real thing to go do.

"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Loader2, Wand2 } from "lucide-react";

import { DescentShell } from "./DescentShell";
import type { AiImpact, SalaryBand } from "../_data/exploreSchema";

const HONEY = "244, 192, 103";
const GOOD = "52, 211, 153";
const WARN = "245, 176, 90";

type Beat = { q: string; render: () => React.ReactNode };

export function LeadsDescent({
  salary,
  outlookLabel,
  outlookSummary,
  growing,
  pressure,
  ai,
  specialtyTitle,
  lane,
  pathSlug,
  accent,
  creating,
  onClose,
  onStartMission,
}: {
  lane: string;
  pathSlug: string;
  salary?: SalaryBand;
  outlookLabel?: string;
  outlookSummary?: string;
  growing: string[];
  pressure: string[];
  ai?: AiImpact;
  specialtyTitle: string;
  accent: string;
  creating: boolean;
  onClose: () => void;
  onStartMission: () => void;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // "The climb" — the fourth object from the depth brief. Fetched rather than
  // stored on the path, so adding it didn't mean regenerating 807 careers.
  const [rungs, setRungs] = React.useState<LadderRung[]>([]);
  React.useEffect(() => {
    if (lane !== "work" || !pathSlug) return;
    let cancelled = false;
    fetch(`/api/guidance/ladder?lane=work&path=${encodeURIComponent(pathSlug)}`, {
      credentials: "include",
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { ok?: boolean; rungs?: LadderRung[] } | null) => {
        if (!cancelled && d?.ok && Array.isArray(d.rungs)) setRungs(d.rungs);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lane, pathSlug]);

  const beats: Beat[] = [];

  if (salary) {
    beats.push({
      q: "So — what would I actually earn?",
      render: () => (
        <div className="rounded-2xl border px-5 py-5" style={{ borderColor: `rgba(${accent},0.24)`, background: `rgba(${accent},0.06)` }}>
          <div className="text-micro font-semibold uppercase tracking-eyebrow" style={{ color: `rgba(${accent},0.9)` }}>Typical pay · a real range</div>
          <div className="mt-1 text-title font-semibold leading-display">{salary.median}</div>
          <div className="relative mt-4 h-2.5 rounded-full bg-white/[0.09]">
            <div className="absolute inset-y-0 rounded-full" style={{ left: "12%", right: "12%", background: `linear-gradient(90deg, rgba(${accent},0.6), rgb(${accent}))` }} />
            <div className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" style={{ left: "48%", boxShadow: `0 0 0 5px rgba(${accent},0.25)` }} />
          </div>
          {salary.low || salary.high ? (
            <div className="mt-2 flex justify-between text-meta tabular-nums text-white/60">
              <span>{salary.low ? `Starting · ${salary.low}` : ""}</span>
              <span>{salary.high ? `Experienced · ${salary.high}` : ""}</span>
            </div>
          ) : null}
          {salary.note ? <p className="mt-3 text-label leading-read text-white/70">{salary.note}</p> : null}
        </div>
      ),
    });
  }

  if (outlookLabel || growing.length || pressure.length) {
    beats.push({
      q: "Is this a field that's growing — or fading?",
      render: () => (
        <div className="space-y-3">
          {outlookLabel ? (
            <div className="rounded-2xl border px-5 py-4" style={{ borderColor: `rgba(${accent},0.24)`, background: `rgba(${accent},0.06)` }}>
              <div className="text-label font-semibold text-white">{outlookLabel}</div>
              {outlookSummary ? <p className="mt-1 text-label leading-read text-white/70">{outlookSummary}</p> : null}
            </div>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            {growing.length ? (
              <div className="rounded-2xl border px-4 py-4" style={{ borderColor: `rgba(${GOOD},0.24)`, background: `rgba(${GOOD},0.05)` }}>
                <div className="text-micro font-semibold uppercase tracking-eyebrow" style={{ color: `rgba(${GOOD},0.9)` }}>↑ Rising</div>
                <Bullets items={growing} rgb={GOOD} />
              </div>
            ) : null}
            {pressure.length ? (
              <div className="rounded-2xl border px-4 py-4" style={{ borderColor: `rgba(${WARN},0.24)`, background: `rgba(${WARN},0.05)` }}>
                <div className="text-micro font-semibold uppercase tracking-eyebrow" style={{ color: `rgba(${WARN},0.9)` }}>↓ Under pressure</div>
                <Bullets items={pressure} rgb={WARN} />
              </div>
            ) : null}
          </div>
        </div>
      ),
    });
  }

  // Appended, never prepended: it arrives from a fetch, and inserting a beat
  // ahead of the reader would renumber the step they're on mid-read. It also
  // reads best last — pay, then outlook, then "and where does it go".
  const climbBeat: Beat | null =
    rungs.length > 1
      ? { q: "So — where does this actually go?", render: () => <Climb rungs={rungs} accent={accent} /> }
      : null;

  if (ai) {
    beats.push({
      q: "Could a robot take this job?",
      render: () => (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-2xl border px-5 py-4" style={{ borderColor: `rgba(${HONEY},0.28)`, background: `rgba(${HONEY},0.06)` }}>
            <span className="h-11 w-11 shrink-0 rounded-full" style={{ background: `radial-gradient(circle at 40% 35%, #ffe6a8, rgb(${HONEY}))`, boxShadow: `0 0 22px rgba(${HONEY},0.5)` }} />
            <div>
              <div className="text-label font-semibold text-white">{ai.level || "Mostly sunny"}</div>
              <p className="text-meta leading-read text-white/68">{ai.summary}</p>
            </div>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-3">
            <AiCol title="AI helps with" items={ai.helpsWith} rgb={accent} />
            <AiCol title="Pressure on" items={ai.putsPressureOn} rgb={WARN} />
            <AiCol title="Humans still own" items={ai.humansStillOwn} rgb={GOOD} />
          </div>
        </div>
      ),
    });
  }

  if (climbBeat) beats.push(climbBeat);

  const total = beats.length + 1;
  const [i, setI] = React.useState(0);
  const atOutro = i >= beats.length;
  const go = React.useCallback((d: 1 | -1) => setI((n) => Math.max(0, Math.min(total - 1, n + d))), [total]);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  if (!mounted) return null;

  return (
    <DescentShell accent={accent} step={i} total={total} onClose={onClose} backTo={specialtyTitle}>
      <>
        {atOutro ? (
          <div className="flex flex-col gap-4 pt-6">
            <div className="text-micro font-semibold uppercase tracking-eyebrow" style={{ color: `rgb(${HONEY})` }}>That&rsquo;s where it leads</div>
            <h2 className="text-title font-semibold leading-display tracking-title">Reading it is one thing. Doing it is another.</h2>
            <p className="text-read leading-read text-white/72">Turn {specialtyTitle} into one small, real thing you try this week — the fastest way to know if the numbers are worth it for you.</p>
            <button type="button" onClick={onStartMission} disabled={creating} className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 font-semibold transition hover:brightness-105 disabled:opacity-70" style={{ background: `linear-gradient(180deg,#ffdf9e,rgb(${HONEY}))`, color: "#1a1204" }}>
              <span className="inline-flex items-center gap-2.5"><Wand2 className="h-5 w-5" /> Try {specialtyTitle} for real — start a mission</span>
              {creating ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
            </button>
            <button type="button" onClick={() => go(-1)} className="text-meta text-white/45 transition hover:text-white/75">← back</button>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="text-micro font-semibold uppercase tracking-eyebrow" style={{ color: `rgb(${accent})` }}>Where it leads · {i + 1} of {beats.length}</div>
            <h2 className="mb-4 mt-2 text-read font-semibold leading-read text-white">{beats[i].q}</h2>
            <div>{beats[i].render()}</div>
            <div className="mt-5 flex items-center justify-between">
              <button type="button" onClick={() => go(-1)} disabled={i === 0} className="inline-flex items-center gap-1.5 text-meta text-white/55 transition hover:text-white disabled:opacity-30">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button type="button" onClick={() => go(1)} className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-label font-semibold transition hover:brightness-110" style={{ borderColor: `rgba(${accent},0.5)`, background: `rgba(${accent},0.12)`, color: `rgb(${accent})` }}>
                {i === beats.length - 1 ? "So what do I do?" : "Next"} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </>
    </DescentShell>
  );
}

function Bullets({ items, rgb }: { items: string[]; rgb: string }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.slice(0, 3).map((it, i) => (
        <li key={i} className="flex gap-2.5 text-label leading-read text-white/82">
          <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: `rgba(${rgb},0.85)` }} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function AiCol({ title, items, rgb }: { title: string; items: string[]; rgb: string }) {
  if (!items?.length) return null;
  return (
    <div className="rounded-2xl border px-3.5 py-3.5" style={{ borderColor: `rgba(${rgb},0.22)`, background: `rgba(${rgb},0.05)` }}>
      <div className="text-micro font-semibold uppercase tracking-eyebrow" style={{ color: `rgba(${rgb},0.9)` }}>{title}</div>
      <ul className="mt-2 space-y-1.5">
        {items.slice(0, 3).map((it, i) => (
          <li key={i} className="text-meta leading-read text-white/78">{it}</li>
        ))}
      </ul>
    </div>
  );
}

export default LeadsDescent;


export type LadderRung = { title: string; when: string; shift: string };

/**
 * The climb.
 *
 * Drawn rather than narrated: rungs stack upward, the line brightens as it rises,
 * and each stage says what actually CHANGES about the work. Read bottom to top,
 * because that's the direction of travel.
 *
 * Deliberately doesn't celebrate the top. Most people stop partway and that's a
 * whole career — the copy the model writes says so, and the object shouldn't
 * argue with it by making the last rung look like the prize.
 */
function Climb({ rungs, accent }: { rungs: LadderRung[]; accent: string }) {
  const ordered = [...rungs].reverse(); // highest first, so it reads as a climb
  const top = ordered.length - 1;
  return (
    <div className="rounded-card border px-5 py-5" style={{ borderColor: `rgba(${accent},0.24)`, background: `rgba(${accent},0.06)` }}>
      <div className="text-micro font-semibold uppercase tracking-eyebrow" style={{ color: `rgba(${accent},0.9)` }}>
        The climb · roughly
      </div>
      <ol className="mt-4 space-y-0">
        {ordered.map((r, i) => {
          // Brighter higher up: the eye reads the shape before the words.
          const strength = 0.35 + (0.6 * (top - i)) / Math.max(1, top);
          const isLast = i === ordered.length - 1;
          return (
            <li key={`${r.title}-${i}`} className="relative flex gap-3.5 pb-5 last:pb-0">
              {!isLast ? (
                <span
                  aria-hidden
                  className="absolute left-[7px] top-4 bottom-0 w-px"
                  style={{ background: `linear-gradient(180deg, rgba(${accent},${strength}), rgba(${accent},0.18))` }}
                />
              ) : null}
              <span
                aria-hidden
                className="relative mt-1 h-3.5 w-3.5 shrink-0 rounded-full"
                style={{
                  background: `rgba(${accent},${strength})`,
                  boxShadow: i === 0 ? `0 0 12px 2px rgba(${accent},0.5)` : undefined,
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-body font-semibold text-white">{r.title}</span>
                  <span className="text-meta text-white/50">{r.when}</span>
                </div>
                <p className="mt-1 text-label leading-read text-white/70">{r.shift}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-1 text-meta leading-read text-white/45">
        Plenty of people stop partway up, and that&rsquo;s a whole career too.
      </p>
    </div>
  );
}
