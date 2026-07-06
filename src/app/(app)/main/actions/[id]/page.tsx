// src/app/(app)/main/actions/[id]/page.tsx
//
// Mission screen — a saved action you can actually run. Tapping Start generates
// a personalized "why this matters to you" + a small step checklist (one AI
// call, server-side, cached on the action). Checking steps, then finishing with
// a quick reflection (what you noticed + how it felt), fires the celebration and
// feeds the reflection back into your signal.

"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Circle,
  ExternalLink,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import { ConstellationAnchor } from "../../components/ui/ConstellationAnchor";
import { emitActionsChanged, emitCelebrate } from "@/lib/actionsBus";

type MissionStep = { text: string; done: boolean };
type Mission = { why: string; steps: MissionStep[]; generatedAt: string; echo?: string };
type MissionAction = {
  id: string;
  title: string;
  description: string | null;
  href: string | null;
  lane: string | null;
  status: "saved" | "doing" | "done" | "dismissed";
  mission: Mission | null;
  startedAt: string | null;
  completedAt: string | null;
  reflection: string | null;
  felt: string | null;
};

type Rgb = { r: number; g: number; b: number };
const LANE_ACCENT: Record<string, Rgb> = {
  work: { r: 92, g: 180, b: 255 },
  learning: { r: 182, g: 160, b: 255 },
  world: { r: 244, g: 198, b: 103 },
  impact: { r: 87, g: 214, b: 160 },
  play: { r: 255, g: 144, b: 192 },
};
const rgba = (c: Rgb, a: number) => `rgba(${c.r},${c.g},${c.b},${a})`;

const FELT_OPTIONS: { key: "energized" | "neutral" | "drained"; label: string }[] = [
  { key: "energized", label: "Energized" },
  { key: "neutral", label: "Neutral" },
  { key: "drained", label: "Drained" },
];

async function missionOp(body: Record<string, unknown>): Promise<MissionAction | null> {
  try {
    const r = await fetch("/api/guidance/action-mission", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) return null;
    const d = await r.json();
    return d?.ok ? (d.action as MissionAction) : null;
  } catch {
    return null;
  }
}

export default function MissionPage() {
  const params = useParams();
  const id = String(params?.id ?? "");

  const [action, setAction] = React.useState<MissionAction | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [missing, setMissing] = React.useState(false);
  const [starting, setStarting] = React.useState(false);
  const [reflectOpen, setReflectOpen] = React.useState(false);
  const [reflection, setReflection] = React.useState("");
  const [felt, setFelt] = React.useState<"energized" | "neutral" | "drained" | null>(null);
  const [finishing, setFinishing] = React.useState(false);
  const [echo, setEcho] = React.useState<string | null>(null);
  const [echoLoading, setEchoLoading] = React.useState(false);
  const echoRequested = React.useRef(false);

  React.useEffect(() => {
    let alive = true;
    missionOp({ id, op: "get" }).then((a) => {
      if (!alive) return;
      if (a) setAction(a);
      else setMissing(true);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [id]);

  // Once complete, ask Everleap to reflect back on what you noticed (the visible
  // end of the feedback loop). Generated once, then cached on the mission.
  React.useEffect(() => {
    if (action?.status !== "done") return;
    if (action.mission?.echo) {
      setEcho(action.mission.echo);
      return;
    }
    if (echoRequested.current) return;
    echoRequested.current = true;
    setEchoLoading(true);
    missionOp({ id, op: "echo" }).then((a) => {
      if (a?.mission?.echo) setEcho(a.mission.echo);
      setEchoLoading(false);
    });
  }, [action?.status, action?.mission?.echo, id]);

  const accent = LANE_ACCENT[action?.lane ?? ""] ?? { r: 92, g: 180, b: 255 };
  const steps = action?.mission?.steps ?? [];
  const doneCount = steps.filter((s) => s.done).length;
  const allDone = steps.length > 0 && doneCount === steps.length;
  const isDone = action?.status === "done";

  const start = async () => {
    setStarting(true);
    const a = await missionOp({ id, op: "start" });
    if (a) setAction(a);
    setStarting(false);
    emitActionsChanged();
  };

  const toggle = async (index: number) => {
    if (!action?.mission) return;
    const next = steps.map((s, i) => (i === index ? { ...s, done: !s.done } : s));
    setAction({ ...action, mission: { ...action.mission, steps: next } }); // optimistic
    const a = await missionOp({ id, op: "toggleStep", index, done: next[index].done });
    if (a) setAction(a);
  };

  const finish = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setFinishing(true);
    const a = await missionOp({ id, op: "complete", reflection: reflection.trim(), felt });
    setFinishing(false);
    if (a) {
      setAction(a);
      setReflectOpen(false);
      emitActionsChanged();
      emitCelebrate(cx, cy);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[680px] px-[6px] pb-28 pt-2">
      <Link
        href="/main/actions"
        className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-white/55 transition hover:text-white/85"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Actions
      </Link>

      {loading ? (
        <SectionCard tone="hero">
          <div className="animate-pulse space-y-3 py-2">
            <div className="h-6 w-2/3 rounded-lg bg-white/10" />
            <div className="h-3.5 w-full rounded bg-white/[0.07]" />
            <div className="h-3.5 w-5/6 rounded bg-white/[0.07]" />
          </div>
        </SectionCard>
      ) : missing || !action ? (
        <SectionCard tone="neutral">
          <p className="text-[14px] text-white/64">This action couldn’t be found.</p>
        </SectionCard>
      ) : (
        <div className="space-y-4">
          {/* Hero */}
          <SectionCard tone="hero" backdrop={<ConstellationAnchor seed={`mission:${action.id}`} accent={accent} />}>
            <div className="max-w-2xl">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-[5px]"
                  style={{ backgroundColor: rgba(accent, 0.14), color: rgba(accent, 0.95) }}
                >
                  <Sparkles className="h-3 w-3" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
                  {isDone ? "Mission complete" : action.status === "doing" ? "Mission in progress" : "Mission"}
                </span>
              </div>
              <h1 className="text-[23px] font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-[26px]">
                {action.title}
              </h1>
              {action.href ? (
                <a
                  href={action.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-white/70 transition hover:text-white"
                >
                  Open the resource <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          </SectionCard>

          {isDone ? (
            /* Completed look-back */
            <SectionCard tone="neutral">
              <div className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-emerald-300/85">
                <Check className="h-4 w-4" /> Done
              </div>
              {action.felt ? (
                <p className="mt-2 text-[14px] text-white/72">
                  Afterward you felt <span className="font-semibold text-white">{action.felt}</span>.
                </p>
              ) : null}
              {action.reflection ? (
                <p className="mt-2 text-[14px] leading-[1.6] text-white/72">“{action.reflection}”</p>
              ) : null}
              <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
                <div
                  className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]"
                  style={{ color: rgba(accent, 0.9) }}
                >
                  <Sparkles className="h-3 w-3" /> What I’m taking from this
                </div>
                {echoLoading ? (
                  <div className="flex items-center gap-2 text-[13.5px] text-white/50">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Reading what you noticed…
                  </div>
                ) : echo ? (
                  <p className="text-[14px] leading-[1.6] text-white/82">{echo}</p>
                ) : (
                  <p className="text-[13.5px] leading-[1.6] text-white/55">
                    Finishing this fed back into what Everleap is learning about you.
                  </p>
                )}
              </div>
            </SectionCard>
          ) : !action.mission ? (
            /* Not started — offer to build the mission */
            <SectionCard tone="neutral">
              <div className="flex flex-col items-start gap-3 py-1">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: rgba(accent, 0.12), color: rgba(accent, 0.95) }}
                >
                  <Wand2 className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-[17px] font-semibold text-white">Turn this into a mission</h2>
                  <p className="mt-1 max-w-md text-[13.5px] leading-[1.6] text-white/64">
                    Everleap will build you a few concrete steps — tailored to what you’ve shared — so
                    this becomes something you can actually start this week.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={start}
                  disabled={starting}
                  className="mt-1 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-semibold text-white transition hover:brightness-110 disabled:opacity-70"
                  style={{ backgroundColor: rgba(accent, 0.2) }}
                >
                  {starting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Building your steps…
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" /> Start this mission
                    </>
                  )}
                </button>
              </div>
            </SectionCard>
          ) : (
            /* Active mission — why + steps + complete */
            <>
              {action.mission.why ? (
                <SectionCard tone="neutral">
                  <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
                    Why this is worth trying
                  </div>
                  <p className="text-[14.5px] leading-[1.66] text-white/82">{action.mission.why}</p>
                </SectionCard>
              ) : null}

              <SectionCard tone="neutral">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55">Your steps</h2>
                  <span className="text-[12px] font-medium text-white/45">
                    {doneCount} of {steps.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {steps.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggle(i)}
                      className="flex w-full items-start gap-3 rounded-2xl border border-white/6 bg-white/[0.02] px-3.5 py-3 text-left transition hover:bg-white/[0.04]"
                    >
                      <span
                        className={`mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border transition ${
                          s.done
                            ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-300"
                            : "border-white/25 text-transparent"
                        }`}
                        style={!s.done ? { borderColor: rgba(accent, 0.4) } : undefined}
                      >
                        <Check className="h-[13px] w-[13px]" strokeWidth={3} />
                      </span>
                      <span
                        className={`text-[14.5px] leading-[1.5] ${
                          s.done ? "text-white/45 line-through" : "text-white/88"
                        }`}
                      >
                        {s.text}
                      </span>
                    </button>
                  ))}
                </div>

                {!reflectOpen ? (
                  <button
                    type="button"
                    onClick={() => setReflectOpen(true)}
                    className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-semibold transition ${
                      allDone ? "text-white hover:brightness-110" : "text-white/85 hover:text-white"
                    }`}
                    style={
                      allDone
                        ? { backgroundColor: rgba(accent, 0.22) }
                        : { backgroundColor: "rgba(255,255,255,0.06)" }
                    }
                  >
                    <Circle className="h-4 w-4" /> Mark this mission complete
                  </button>
                ) : null}
              </SectionCard>

              {/* Reflection */}
              {reflectOpen ? (
                <SectionCard tone="hero" backdrop={<ConstellationAnchor seed={`reflect:${action.id}`} accent={accent} />}>
                  <div className="max-w-2xl">
                    <h2 className="text-[18px] font-semibold text-white">How did it go?</h2>
                    <p className="mt-1 text-[13.5px] leading-[1.6] text-white/64">
                      A quick reflection helps Everleap understand what actually energizes you.
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {FELT_OPTIONS.map((o) => (
                        <button
                          key={o.key}
                          type="button"
                          onClick={() => setFelt(o.key)}
                          className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition ${
                            felt === o.key
                              ? "border-transparent text-white"
                              : "border-white/14 text-white/62 hover:text-white/85"
                          }`}
                          style={felt === o.key ? { backgroundColor: rgba(accent, 0.24) } : undefined}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={reflection}
                      onChange={(e) => setReflection(e.target.value)}
                      placeholder="What did you notice? (optional)"
                      rows={3}
                      className="mt-3 w-full resize-none rounded-2xl border border-white/12 bg-white/[0.04] px-3.5 py-2.5 text-[14px] leading-[1.55] text-white placeholder:text-white/35 focus:border-white/25 focus:outline-none"
                    />

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={finish}
                        disabled={finishing}
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-semibold text-white transition hover:brightness-110 disabled:opacity-70"
                        style={{ backgroundColor: rgba(accent, 0.24) }}
                      >
                        {finishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        Finish mission
                      </button>
                      <button
                        type="button"
                        onClick={() => setReflectOpen(false)}
                        className="text-[13.5px] font-medium text-white/50 transition hover:text-white/80"
                      >
                        Not yet
                      </button>
                    </div>
                  </div>
                </SectionCard>
              ) : null}
            </>
          )}
        </div>
      )}
    </div>
  );
}
