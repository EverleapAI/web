// apps/web/src/app/(app)/main/explore/_components/PathConstellation.tsx
//
// The specialty deep-dive as a constellation you light up (design-doc Concept 02).
// The star map IS the navigation — tap a star and its content renders as OBJECTS
// (a day-in-life swipe, a pay band, AI-as-weather, near-you/online opportunities),
// never a wall. The honey star is the deep end: a real-world thing to actually go
// do. Option B: the deep content is the career's (shared across its specialties)
// plus the specialty's own intro; per-specialty generation is a later layer.

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUp,
  Check,
  Globe,
  Loader2,
  MapPin,
  Sparkles,
  Video,
  Wand2,
} from "lucide-react";

import { ReadAtmosphere } from "../../components/ui/ReadAtmosphere";
import { DayDescent } from "./DayDescent";
import { LeadsDescent } from "./LeadsDescent";
import { NearDescent } from "./NearDescent";
import {
  laneAccent,
  type AiImpact,
  type ExplorePath,
  type Opportunity,
  type PathBranch,
  type RealityMoment,
  type Rgb,
  type SalaryBand,
} from "../_data/exploreSchema";
import { emitActionsChanged } from "@/lib/actionsBus";
import type { OnetDetail } from "./OnetFacts";

const HONEY = "244, 192, 103";
const rgbStr = (c: Rgb) => `${c.r}, ${c.g}, ${c.b}`;

type SpecialtyContent = {
  reality: { moments: RealityMoment[] };
  trajectory: {
    outlookLabel?: string;
    outlookSummary?: string;
    salaryBand?: SalaryBand;
    aiImpact?: AiImpact;
    whatIsGrowing: string[];
    whatIsUnderPressure: string[];
  };
};

type StarId = "why" | "day" | "leads" | "near" | "real";
type Star = { id: StarId; label: string; x: number; y: number; accent: string; honey?: boolean };
const POS: Record<StarId, { x: number; y: number }> = {
  why: { x: 70, y: 64 },
  day: { x: 186, y: 112 },
  leads: { x: 330, y: 70 },
  near: { x: 116, y: 196 },
  real: { x: 300, y: 200 },
};
const EDGES: [StarId, StarId][] = [
  ["why", "day"],
  ["day", "leads"],
  ["day", "near"],
  ["near", "real"],
  ["leads", "real"],
];

export function PathConstellation({
  path,
  branchSlug,
  whyYou = null,
}: {
  path: ExplorePath;
  branchSlug: string;
  whyYou?: string | null;
  onet?: OnetDetail | null;
}) {
  const router = useRouter();
  const branch = path.branches?.detail?.find((b) => b.slug === branchSlug) ?? null;
  const preview = path.branches?.previews?.find((b) => b.slug === branchSlug) ?? null;
  const accentRgb = branch?.accent ?? laneAccent(path);
  const a = rgbStr(accentRgb);

  const careerTitle = path.overview?.title ?? path.card.title;
  const specialtyTitle = branch?.title ?? preview?.title ?? careerTitle;
  const rawLead = branch?.summary || preview?.whyItCouldFit || preview?.oneLiner || "";
  const lead = rawLead.split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 2).join(" ");

  // Per-specialty deep content (day + outlook), generated the first time this
  // specialty is opened — so the dive is about THIS path, not the general career.
  // Falls back to career-level content until it loads / if unavailable.
  const [sc, setSc] = React.useState<SpecialtyContent | null>(null);
  React.useEffect(() => {
    if (!branchSlug) return;
    let cancelled = false;
    fetch(
      `/api/guidance/specialty-content?lane=${encodeURIComponent(path.lane)}&path=${encodeURIComponent(path.slug)}&branch=${encodeURIComponent(branchSlug)}`,
      { credentials: "include", cache: "no-store" }
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { ok?: boolean; content?: SpecialtyContent } | null) => {
        if (!cancelled && d?.ok && d.content) setSc(d.content);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [path.lane, path.slug, branchSlug]);

  // The day beats are the specialty's own; the PHOTOS stay career-level (keyed by
  // moment id, which lines up m0..m3) — a setting-and-tools shot of the career
  // reads true for any of its specialties, and one set per career is affordable.
  const moments = sc?.reality?.moments ?? path.reality?.moments ?? [];
  const salary = sc?.trajectory?.salaryBand ?? path.trajectory?.salaryBand;
  const ai = sc?.trajectory?.aiImpact ?? path.trajectory?.aiImpact;
  const growing = sc?.trajectory?.whatIsGrowing?.length ? sc.trajectory.whatIsGrowing : path.trajectory?.whatIsGrowing ?? [];
  const pressure = sc?.trajectory?.whatIsUnderPressure?.length ? sc.trajectory.whatIsUnderPressure : path.trajectory?.whatIsUnderPressure ?? [];
  const outlookLabel = sc?.trajectory?.outlookLabel ?? path.trajectory?.outlookLabel;
  const outlookSummary = sc?.trajectory?.outlookSummary ?? path.trajectory?.outlookSummary;
  const opps = (path.nextSteps?.sections ?? []).flatMap((s) => s.items);

  // The "why" panel has its own material only when there's a personal whyYou or
  // the branch carries lists. Without either, the lead IS its content — so the
  // header steps aside rather than printing the same paragraph twice.
  const whyHasOwnMaterial =
    Boolean(whyYou && whyYou.trim() !== lead.trim()) ||
    Boolean(branch?.whatYouActuallyDo?.length) ||
    Boolean(branch?.skillsThatGrowHere?.length);
  const hasLeads = Boolean(salary || ai || growing.length || pressure.length);

  // Which stars have content to show.
  const stars: Star[] = [
    { id: "why", label: branch ? "Why this path" : "Why you", ...POS.why, accent: a },
    ...(moments.length ? [{ id: "day" as const, label: "A real day", ...POS.day, accent: a }] : []),
    ...(hasLeads ? [{ id: "leads" as const, label: "Where it leads", ...POS.leads, accent: a }] : []),
    ...(opps.length
      ? [{
          id: "near" as const,
          // A World path is somewhere else — "near you" would be a promise it
          // can't keep, so it offers ways in instead.
          label: path.lane === "world" ? "Ways in from here" : "Try it near you",
          ...POS.near,
          accent: a,
        }]
      : []),
    { id: "real", label: "Try it for real", ...POS.real, accent: HONEY, honey: true },
  ];
  const ids = new Set(stars.map((s) => s.id));
  const edges = EDGES.filter(([x, y]) => ids.has(x) && ids.has(y));

  const [active, setActive] = React.useState<StarId>("why");
  const [lit, setLit] = React.useState<Set<StarId>>(new Set(["why"]));
  const [creating, setCreating] = React.useState(false);
  const [showDay, setShowDay] = React.useState(false);
  const [showLeads, setShowLeads] = React.useState(false);
  const [showNear, setShowNear] = React.useState(false);

  // Remember which stars were lit in past visits (Concept 02: depth you carry back).
  React.useEffect(() => {
    fetch(
      `/api/guidance/constellation-lit?path=${encodeURIComponent(path.slug)}&branch=${encodeURIComponent(branchSlug)}`,
      { credentials: "include", cache: "no-store" }
    )
      .then((r) => r.json())
      .then((d: { ok?: boolean; lit?: string[] }) => {
        if (d?.ok && Array.isArray(d.lit) && d.lit.length) {
          setLit((prev) => new Set([...prev, ...(d.lit as StarId[])]));
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A branch slug that matches nothing renders a hollow constellation: the title
  // falls back to the career, the lead is empty, and the why panel has nothing to
  // put in it. That's what a stale or mistyped link looks like, so send them to
  // the list of real ones instead. Only once the real path has loaded — the
  // fallback deck arrives first and has no branches yet.
  const branchMissing =
    Boolean(path.branches?.previews?.length) && !branch && !preview && Boolean(branchSlug);
  React.useEffect(() => {
    if (!branchMissing) return;
    router.replace(`/main/explore/${path.lane}/${path.slug}/specialties`);
  }, [branchMissing, router, path.lane, path.slug]);

  // Tapping a star swapped the panel below the map, which on most screens sits
  // under the fold — so it looked like nothing had happened. Bring it into view,
  // but only when it isn't already, so a tap on desktop doesn't yank the page.
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  // Reveal AFTER the panel has rendered. It carries key={active}, so it remounts
  // on every star change — scrolling from inside the click handler measured the
  // node that was on its way out.
  const skipFirstReveal = React.useRef(true);
  React.useEffect(() => {
    if (skipFirstReveal.current) {
      skipFirstReveal.current = false; // landing on "why" shouldn't move the page
      return;
    }
    const el = panelRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // Only skip when it's already near the TOP. Sitting halfway down counts as
    // visible to a rectangle and not to a person — you'd see the heading and
    // none of what's under it.
    if (r.top >= 0 && r.top < window.innerHeight * 0.25) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }, [active]);

  const open = (id: StarId) => {
    setActive(id);
    setLit((prev) => (prev.has(id) ? prev : new Set([...prev, id])));
    fetch("/api/guidance/constellation-lit", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path: path.slug, branch: branchSlug, star: id }),
    }).catch(() => {});
  };

  const startMission = async () => {
    if (creating) return;
    setCreating(true);
    const returnTo =
      typeof window !== "undefined" ? window.location.pathname + window.location.search : "";
    try {
      const res = await fetch("/api/guidance/actions", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sourceType: "explore_path",
          sourceRef: `${path.lane}:${path.slug}:${branchSlug}`,
          lane: path.lane,
          title: `Try it: ${specialtyTitle}`,
          description: `Get a first-hand feel for ${specialtyTitle} — find one small, real thing to try this week and notice how it lands.`,
        }),
      });
      const d = await res.json().catch(() => null);
      if (d?.ok && d.action?.id) {
        emitActionsChanged();
        router.push(`/main/actions/${d.action.id}?returnTo=${encodeURIComponent(returnTo)}`);
      } else setCreating(false);
    } catch {
      setCreating(false);
    }
  };

  return (
    <main className="relative min-h-screen pb-24 text-white">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <ReadAtmosphere seed={`${path.id}:${branchSlug}`} accent={{ r: accentRgb.r, g: accentRgb.g, b: accentRgb.b }} />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pt-4 sm:px-6">
        {/* Depth rail — step back up + how many stars lit. */}
        <div className="flex items-center justify-between">
          <Link
            href={`/main/explore/${path.lane}/${path.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-meta text-white/75 transition hover:border-white/20 hover:text-white"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            Step back up
          </Link>
          <span className="inline-flex items-center gap-2 text-micro font-semibold uppercase tracking-eyebrow text-white/45">
            <span style={{ color: `rgb(${a})` }}>{lit.size}</span> of {stars.length} lit
          </span>
        </div>

        <header>
          <div className="text-micro font-semibold uppercase tracking-eyebrow text-white/44">
            {careerTitle} · path
          </div>
          <h1 className="mt-1 text-title font-semibold leading-display tracking-title text-ink-strong sm:text-display">
            {specialtyTitle}
          </h1>
          {lead && whyHasOwnMaterial ? (
            <p className="mt-2.5 text-read leading-read text-white/80">{lead}</p>
          ) : null}
        </header>

        {/* The constellation — the navigation. */}
        <div className="rounded-card border border-white/8 bg-white/[0.015] px-1 py-2">
          {/* Capped: the map scales with width, so on a wide screen it grew tall
              enough to push the panel entirely under the fold. Constraining it
              lets the content below peek, which is half the "where did it go"
              problem. */}
          <svg viewBox="0 0 400 260" className="mx-auto w-full max-w-[540px]">
            <g>
              {edges.map(([x, y], i) => {
                const A = POS[x],
                  B = POS[y];
                const on = lit.has(x) && lit.has(y);
                return (
                  <line
                    key={i}
                    x1={A.x}
                    y1={A.y}
                    x2={B.x}
                    y2={B.y}
                    stroke={on ? `rgba(${a},0.5)` : "rgba(255,255,255,0.09)"}
                    strokeWidth={on ? 1.6 : 1.2}
                  />
                );
              })}
            </g>
            {stars.map((s) => {
              const on = lit.has(s.id);
              const isActive = active === s.id;
              return (
                <g
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer"
                  onClick={() => open(s.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      open(s.id);
                    }
                  }}
                >
                  {on ? (
                    <circle cx={s.x} cy={s.y} r={s.honey ? 18 : 14} fill={`rgb(${s.accent})`} opacity={0.16} />
                  ) : null}
                  <circle
                    cx={s.x}
                    cy={s.y}
                    r={s.honey ? 6.5 : 5}
                    fill={on ? `rgb(${s.accent})` : "#2a3550"}
                    stroke={`rgb(${s.accent})`}
                    strokeWidth={on ? 0 : 1.4}
                    style={s.honey ? { filter: `drop-shadow(0 0 8px rgb(${s.accent}))` } : undefined}
                  />
                  {isActive ? (
                    <circle cx={s.x} cy={s.y} r={s.honey ? 11 : 9} fill="none" stroke={`rgba(${s.accent},0.55)`} strokeWidth={1} />
                  ) : null}
                  <text
                    x={s.x}
                    y={s.y + (s.y > 150 ? 24 : -14)}
                    textAnchor="middle"
                    className="font-sans font-semibold"
                    fontSize={11}
                    fill={s.honey ? `rgb(${s.accent})` : on ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)"}
                    style={s.honey ? { textTransform: "uppercase", letterSpacing: "0.08em" } : undefined}
                  >
                    {s.label}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="px-3 pb-1 text-center text-micro text-white/40">
            Tap a star to go there — an unlit one is an invitation, never a to‑do.
          </p>
        </div>

        {/* The active star's content — drawn as objects, not a wall. */}
        <div
          ref={panelRef}
          key={active}
          className="scroll-mt-4 rounded-card border border-white/10 bg-[rgba(10,14,26,0.72)] px-5 py-5 [animation:cRise_.4s_ease]"
        >
          <StarPanel
            active={active}
            a={a}
            branch={branch}
            whyYou={whyYou}
            lead={lead}
            moments={moments}
            salary={salary}
            ai={ai}
            growing={growing}
            pressure={pressure}
            opps={opps}
            specialtyTitle={specialtyTitle}
            creating={creating}
            onStart={startMission}
            onOpenDay={() => setShowDay(true)}
            onOpenLeads={() => setShowLeads(true)}
            onOpenNear={() => setShowNear(true)}
          />
        </div>
      </div>

      {showDay ? (
        <DayDescent
          moments={moments}
          pathSlug={path.slug}
          specialtyTitle={specialtyTitle}
          careerTitle={careerTitle}
          accent={a}
          creating={creating}
          onClose={() => setShowDay(false)}
          onStartMission={startMission}
        />
      ) : null}

      {showLeads ? (
        <LeadsDescent
          salary={salary}
          outlookLabel={outlookLabel}
          outlookSummary={outlookSummary}
          growing={growing}
          pressure={pressure}
          ai={ai}
          specialtyTitle={specialtyTitle}
          accent={a}
          creating={creating}
          onClose={() => setShowLeads(false)}
          onStartMission={startMission}
        />
      ) : null}

      {showNear ? (
        <NearDescent
          opps={opps}
          lane={path.lane}
          parentTitle={careerTitle}
          specialtyTitle={specialtyTitle}
          accent={a}
          creating={creating}
          onClose={() => setShowNear(false)}
          onStartMission={startMission}
        />
      ) : null}

      <style>{`@keyframes cRise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </main>
  );
}

/* ---------------- object renderers ---------------- */

function Eyebrow({ children, a }: { children: React.ReactNode; a: string }) {
  return (
    <div className="text-micro font-semibold uppercase tracking-eyebrow" style={{ color: `rgba(${a},0.85)` }}>
      {children}
    </div>
  );
}

function List({ items, a }: { items: string[]; a: string }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.slice(0, 4).map((it, i) => (
        <li key={i} className="flex gap-2.5 text-label leading-read text-white/80">
          <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: `rgba(${a},0.85)` }} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function StarPanel(props: {
  active: StarId;
  a: string;
  branch: PathBranch | null;
  whyYou: string | null;
  lead: string;
  moments: RealityMoment[];
  salary?: SalaryBand;
  ai?: AiImpact;
  growing: string[];
  pressure: string[];
  opps: Opportunity[];
  specialtyTitle: string;
  creating: boolean;
  onStart: () => void;
  onOpenDay: () => void;
  onOpenLeads: () => void;
  onOpenNear: () => void;
}) {
  const { active, a } = props;

  if (active === "why") {
    return (
      <div>
        <div className="mb-2.5 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-control" style={{ background: `rgba(${a},0.14)`, color: `rgb(${a})` }}>
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <h2 className="text-read font-semibold leading-read text-white">Why this rhymes with you</h2>
        </div>
        {/* Never print what's already on screen. whyYou is a Work-match field, so
            on most branches it's empty and this fell back to the lead — repeating
            the paragraph from the top of the page fifteen lines further down. */}
        {props.whyYou && props.whyYou.trim() !== props.lead.trim() ? (
          <p className="text-read leading-read text-white/82">{props.whyYou}</p>
        ) : !props.branch?.whatYouActuallyDo?.length && !props.branch?.skillsThatGrowHere?.length ? (
          <p className="text-read leading-read text-white/82">{props.lead}</p>
        ) : null}
        {props.branch?.whatYouActuallyDo?.length ? (
          <div className="mt-4">
            <Eyebrow a={a}>What you&rsquo;d actually do</Eyebrow>
            <List items={props.branch.whatYouActuallyDo} a={a} />
          </div>
        ) : null}
        {props.branch?.skillsThatGrowHere?.length ? (
          <div className="mt-4">
            <Eyebrow a={a}>Skills that grow here</Eyebrow>
            <div className="mt-2 flex flex-wrap gap-2">
              {props.branch.skillsThatGrowHere.slice(0, 6).map((s, i) => (
                <span key={i} className="rounded-full border px-3 py-1 text-meta text-white/80" style={{ borderColor: `rgba(${a},0.28)`, background: `rgba(${a},0.07)` }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  if (active === "day") {
    return (
      <div>
        <div className="mb-1 flex items-center gap-2">
          <h2 className="text-read font-semibold leading-read text-white">A real day, from the inside</h2>
        </div>
        <p className="mb-3 text-meta text-white/55">
          <span className="sm:hidden">Swipe through it — a scene, a time, one line.</span>
          <span className="hidden sm:inline">A scene, a time, one line.</span>
        </p>
        {/* Below sm this is a swipe rail; at sm and up it becomes a grid. It used
            to be a rail everywhere with hidden scrollbars, so on a wide screen the
            second card was simply sliced off at the edge with nothing to say it
            continued. Cards are near-full-width on mobile so the cut edge reads as
            "there's more", not as broken. */}
        <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
          {props.moments.map((m) => (
            <div
              key={m.id}
              className="w-[86%] shrink-0 snap-start rounded-2xl border px-4 py-4 sm:w-auto"
              style={{ borderColor: `rgba(${a},0.2)`, background: `rgba(${a},0.05)` }}
            >
              {m.timeLabel ? <div className="text-micro font-semibold uppercase tracking-eyebrow" style={{ color: `rgba(${a},0.9)` }}>{m.timeLabel}</div> : null}
              <div className="mt-1.5 text-label font-semibold text-white">{m.title}</div>
              <p className="mt-1.5 text-meta leading-read text-white/68">{m.body}</p>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={props.onOpenDay}
          className="mt-3.5 flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition hover:brightness-110"
          style={{ borderColor: `rgba(${a},0.5)`, background: `rgba(${a},0.12)` }}
        >
          <span className="min-w-0">
            <span className="block text-label font-semibold text-white">Go deeper — walk the whole day</span>
            <span className="mt-0.5 block text-meta text-white/60">Dawn to dusk, one moment at a time — then watch a real one.</span>
          </span>
          <ArrowRight className="h-5 w-5 shrink-0" style={{ color: `rgb(${a})` }} />
        </button>
      </div>
    );
  }

  if (active === "leads") {
    return (
      <div>
        <h2 className="mb-3 text-read font-semibold leading-read text-white">Where it leads</h2>
        {props.salary ? (
          <div className="rounded-2xl border px-4 py-4" style={{ borderColor: `rgba(${a},0.2)`, background: `rgba(${a},0.05)` }}>
            <Eyebrow a={a}>What it pays</Eyebrow>
            <div className="mt-1 text-title font-semibold leading-display">{props.salary.median}</div>
            <div className="relative mt-3 h-2 rounded-full bg-white/[0.09]">
              <div className="absolute inset-y-0 rounded-full" style={{ left: "12%", right: "12%", background: `linear-gradient(90deg, rgba(${a},0.6), rgb(${a}))` }} />
              <div className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" style={{ left: "48%", boxShadow: `0 0 0 4px rgba(${a},0.25)` }} />
            </div>
            <div className="mt-2 flex justify-between text-meta tabular-nums text-white/55">
              <span>{props.salary.low}</span>
              <span>{props.salary.high}</span>
            </div>
            {props.salary.note ? <p className="mt-2 text-meta leading-read text-white/60">{props.salary.note}</p> : null}
          </div>
        ) : null}
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {props.ai ? (
            <div className="rounded-2xl border px-4 py-4" style={{ borderColor: `rgba(${a},0.2)`, background: `rgba(${a},0.05)` }}>
              <Eyebrow a={a}>Future‑proof?</Eyebrow>
              <div className="mt-2 flex items-center gap-3">
                <span className="h-9 w-9 shrink-0 rounded-full" style={{ background: `radial-gradient(circle at 40% 35%, #ffe6a8, ${`rgb(${HONEY})`})`, boxShadow: `0 0 20px rgba(${HONEY},0.45)` }} />
                <div>
                  <div className="text-label font-semibold text-white">{props.ai.level || "Mostly sunny"}</div>
                  <div className="text-meta leading-read text-white/62">{props.ai.summary}</div>
                </div>
              </div>
            </div>
          ) : null}
          {props.growing.length ? (
            <div className="rounded-2xl border px-4 py-4" style={{ borderColor: `rgba(${a},0.2)`, background: `rgba(${a},0.05)` }}>
              <Eyebrow a={a}>What&rsquo;s growing</Eyebrow>
              <List items={props.growing} a={a} />
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={props.onOpenLeads}
          className="mt-3.5 flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition hover:brightness-110"
          style={{ borderColor: `rgba(${a},0.5)`, background: `rgba(${a},0.12)` }}
        >
          <span className="min-w-0">
            <span className="block text-label font-semibold text-white">Go deeper — the whole picture</span>
            <span className="mt-0.5 block text-meta text-white/60">Pay, the outlook, and whether AI takes it — one question at a time.</span>
          </span>
          <ArrowRight className="h-5 w-5 shrink-0" style={{ color: `rgb(${a})` }} />
        </button>
      </div>
    );
  }

  if (active === "near") {
    const modeMeta = (mode?: string) =>
      mode === "local"
        ? { label: "Near you", Icon: MapPin }
        : mode === "virtual"
          ? { label: "Virtual", Icon: Video }
          : { label: "Online", Icon: Globe };
    return (
      <div>
        <h2 className="mb-1 text-read font-semibold leading-read text-white">Try it near you — or online</h2>
        <p className="mb-3 text-meta text-white/55">Real ways to go do it. (Near‑you gets sharper once we have your zip.)</p>
        <div className="space-y-2.5">
          {props.opps.slice(0, 5).map((o) => {
            const m = modeMeta(o.mode);
            return (
              <a
                key={o.id}
                href={o.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 rounded-2xl border px-4 py-3.5 transition hover:brightness-110"
                style={{ borderColor: `rgba(${a},0.2)`, background: `rgba(${a},0.05)` }}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ background: `rgba(${a},0.14)`, color: `rgb(${a})` }}>
                  <m.Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-micro font-semibold uppercase tracking-eyebrow" style={{ color: `rgba(${a},0.9)` }}>{m.label}</span>
                  <div className="text-label font-semibold text-white">{o.title}</div>
                  {o.note ? <div className="text-meta leading-read text-white/62">{o.note}{o.provider ? ` · ${o.provider}` : ""}</div> : null}
                </span>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/45" />
              </a>
            );
          })}
        </div>
        <button
          type="button"
          onClick={props.onOpenNear}
          className="mt-3.5 flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition hover:brightness-110"
          style={{ borderColor: `rgba(${a},0.5)`, background: `rgba(${a},0.12)` }}
        >
          <span className="min-w-0">
            <span className="block text-label font-semibold text-white">Go deeper — all the ways to try it</span>
            <span className="mt-0.5 block text-meta text-white/60">Near you, online, or virtual — every real door out.</span>
          </span>
          <ArrowRight className="h-5 w-5 shrink-0" style={{ color: `rgb(${a})` }} />
        </button>
      </div>
    );
  }

  // honey — try it for real
  return (
    <div className="overflow-hidden rounded-2xl border" style={{ borderColor: `rgba(${HONEY},0.5)`, background: `linear-gradient(180deg, rgba(${HONEY},0.16), rgba(${HONEY},0.05))` }}>
      <div className="px-5 py-5">
        <h2 className="text-read font-semibold leading-read text-white">The deep end is a taste, not a paragraph.</h2>
        <p className="mt-1.5 text-meta leading-read text-white/68">
          One small, real thing to actually do this week — proof you didn&rsquo;t just read about {props.specialtyTitle}, you went.
        </p>
        <button
          type="button"
          onClick={props.onStart}
          disabled={props.creating}
          className="mt-3.5 flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-left font-semibold transition hover:brightness-105 disabled:opacity-70"
          style={{ background: `linear-gradient(180deg, #ffdf9e, rgb(${HONEY}))`, color: "#1a1204" }}
        >
          <span className="inline-flex items-center gap-2.5">
            <Wand2 className="h-5 w-5" />
            Try {props.specialtyTitle} for real — start a mission
          </span>
          {props.creating ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
        </button>
        <div className="mt-3 flex items-center gap-2 text-meta" style={{ color: `rgb(${HONEY})` }}>
          <span className="grid h-5 w-5 place-items-center rounded border border-dashed" style={{ borderColor: `rgba(${HONEY},0.6)` }}>
            <Check className="h-3 w-3" />
          </span>
          Doing it drops a moment you keep — and a Direction starts forming.
        </div>
      </div>
    </div>
  );
}

export default PathConstellation;
