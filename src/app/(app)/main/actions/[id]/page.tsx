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
import { useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Circle,
  Copy,
  ExternalLink,
  Eye,
  Loader2,
  MessageSquare,
  Sparkles,
  Wand2,
} from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import { ConstellationAnchor } from "../../components/ui/ConstellationAnchor";
import { emitActionsChanged, emitCelebrate } from "@/lib/actionsBus";

type MissionStep = { text: string; done: boolean };
type Mission = {
  why: string;
  steps: MissionStep[];
  generatedAt: string;
  echo?: string;
  script?: string;
  watchFor?: string[];
};
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
  reflections?: ReflectionEntry[];
};

type ReflectionEntry = {
  id: string;
  text: string;
  felt: string | null;
  createdAt: string;
};

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";
  const s = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

type Rgb = { r: number; g: number; b: number };
const LANE_ACCENT: Record<string, Rgb> = {
  work: { r: 92, g: 180, b: 255 },
  learning: { r: 182, g: 160, b: 255 },
  world: { r: 244, g: 198, b: 103 },
  impact: { r: 87, g: 214, b: 160 },
  play: { r: 255, g: 144, b: 192 },
};
const rgba = (c: Rgb, a: number) => `rgba(${c.r},${c.g},${c.b},${a})`;

// The mission screen can be reached from anywhere — Insights, Explore, Actions,
// Today. A `returnTo` query param (a safe internal path) sends "Back" to wherever
// they came from; without it we fall back to the Actions list.
function backTarget(returnTo: string | null): { href: string; label: string } {
  const href = returnTo && returnTo.startsWith("/main/") ? returnTo : "/main/actions";
  const base = href.split("?")[0];
  const label = base.startsWith("/main/insights")
    ? "Back to Insights"
    : base.startsWith("/main/explore")
      ? "Back to Explore"
      : base.startsWith("/main/today")
        ? "Back to Today"
        : base.startsWith("/main/me")
          ? "Back to Me"
          : "Back to Actions";
  return { href, label };
}

// A few short, guided prompts so there's room to reflect on more than one thing
// — all optional; non-empty answers combine into the single reflection field.
type ReflectFields = { noticed: string; surprised: string; next: string };

const REFLECT_PROMPTS: { key: keyof ReflectFields; placeholder: string }[] = [
  { key: "noticed", placeholder: "What did you notice while doing it?" },
  { key: "surprised", placeholder: "What surprised you, if anything? (optional)" },
  { key: "next", placeholder: "What might you try next? (optional)" },
];

function combineReflection(f: ReflectFields): string {
  return [f.noticed, f.surprised, f.next]
    .map((s) => s.trim())
    .filter(Boolean)
    .join("\n\n");
}

function ReflectionPrompts({
  fields,
  onChange,
}: {
  fields: ReflectFields;
  onChange: (key: keyof ReflectFields, value: string) => void;
}) {
  return (
    <div className="mt-3 space-y-2">
      {REFLECT_PROMPTS.map((p, i) => (
        <textarea
          key={p.key}
          value={fields[p.key]}
          onChange={(e) => onChange(p.key, e.target.value)}
          placeholder={p.placeholder}
          rows={i === 0 ? 3 : 2}
          className="w-full resize-none rounded-2xl border border-white/12 bg-white/[0.04] px-3.5 py-2.5 text-label leading-body text-white placeholder:text-white/35 focus:border-white/25 focus:outline-none"
        />
      ))}
    </div>
  );
}

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
  const searchParams = useSearchParams();
  const id = String(params?.id ?? "");
  const autoStart = searchParams?.get("start") === "1";
  const autoStarted = React.useRef(false);
  const back = backTarget(searchParams?.get("returnTo") ?? null);

  const [action, setAction] = React.useState<MissionAction | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [missing, setMissing] = React.useState(false);
  const [starting, setStarting] = React.useState(false);
  const [reflectOpen, setReflectOpen] = React.useState(false);
  const [reflectFields, setReflectFields] = React.useState<ReflectFields>({
    noticed: "",
    surprised: "",
    next: "",
  });
  const updateReflect = (key: keyof ReflectFields, value: string) =>
    setReflectFields((f) => ({ ...f, [key]: value }));
  // Lets a completed mission's reflection be re-opened and added to.
  const [editing, setEditing] = React.useState(false);
  const [felt, setFelt] = React.useState<"energized" | "neutral" | "drained" | null>(null);
  const [finishing, setFinishing] = React.useState(false);
  const [echo, setEcho] = React.useState<string | null>(null);
  const [echoLoading, setEchoLoading] = React.useState(false);
  const echoRequested = React.useRef(false);
  const [copied, setCopied] = React.useState(false);

  const copyScript = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

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
    // Nothing to reflect back until there's a feeling or a note — otherwise the
    // done view shows the reflect form (finish() owns echo once they reflect).
    if (!action.felt && !action.reflection) return;
    if (echoRequested.current) return;
    echoRequested.current = true;
    setEchoLoading(true);
    missionOp({ id, op: "echo" }).then((a) => {
      if (a?.mission?.echo) setEcho(a.mission.echo);
      setEchoLoading(false);
    });
  }, [action?.status, action?.mission?.echo, action?.felt, action?.reflection, id]);

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

  // Arriving from the card's "How would I even do this?" — build the playbook
  // right away so the how is there, no extra tap.
  React.useEffect(() => {
    if (!autoStart || autoStarted.current) return;
    if (!action || action.status !== "saved" || action.mission) return;
    autoStarted.current = true;
    void start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, action]);

  const toggle = async (index: number) => {
    if (!action?.mission) return;
    const next = steps.map((s, i) => (i === index ? { ...s, done: !s.done } : s));
    setAction({ ...action, mission: { ...action.mission, steps: next } }); // optimistic
    const a = await missionOp({ id, op: "toggleStep", index, done: next[index].done });
    if (a) setAction(a);
  };

  const finish = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!felt) return; // a feeling is required to close the loop
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setFinishing(true);
    const a = await missionOp({
      id,
      op: "complete",
      reflection: combineReflection(reflectFields),
      felt,
    });
    if (a) {
      setAction(a);
      setReflectOpen(false);
      setEditing(false);
      emitActionsChanged();
      emitCelebrate(cx, cy);
      // There's now a feeling to respond to — (re)generate the echo. Own it here
      // (rather than let the status effect race) so it also fires when reflecting
      // on an action that was already marked done with no feeling.
      echoRequested.current = true;
      setEcho(a.mission?.echo ?? null);
      if (!a.mission?.echo) {
        setEchoLoading(true);
        const withEcho = await missionOp({ id, op: "echo" });
        if (withEcho?.mission?.echo) {
          setAction(withEcho);
          setEcho(withEcho.mission.echo);
        }
        setEchoLoading(false);
      }
    }
    setFinishing(false);
  };

  // Append another reflection to an already-completed mission's journal.
  const addMore = async () => {
    const text = combineReflection(reflectFields);
    if (!text) return;
    setFinishing(true);
    const a = await missionOp({ id, op: "addReflection", reflection: text, felt });
    if (a) {
      setAction(a);
      setEditing(false);
      setReflectFields({ noticed: "", surprised: "", next: "" });
      setFelt(null);
      emitActionsChanged();
    }
    setFinishing(false);
  };

  const reflectionEntries = [...(action?.reflections ?? [])].reverse(); // newest first
  const hasReflectionText = combineReflection(reflectFields).length > 0;

  return (
    <div className="mx-auto w-full max-w-[680px] px-[6px] pb-28 pt-2">
      <Link
        href={back.href}
        className="mb-3 inline-flex items-center gap-1.5 text-meta font-medium text-white/55 transition hover:text-white/85"
      >
        <ArrowLeft className="h-4 w-4" />
        {back.label}
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
          <p className="text-label text-white/64">This action couldn’t be found.</p>
        </SectionCard>
      ) : (
        <div className="space-y-4">
          {/* Hero */}
          <SectionCard tone="hero" backdrop={<ConstellationAnchor seed={`mission:${action.id}`} accent={accent} />}>
            <div className="max-w-2xl">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-chip"
                  style={{ backgroundColor: rgba(accent, 0.14), color: rgba(accent, 0.95) }}
                >
                  <Sparkles className="h-3 w-3" />
                </span>
                <span className="text-micro font-semibold uppercase tracking-eyebrow text-white/44">
                  {isDone ? "Mission complete" : action.status === "doing" ? "Mission in progress" : "Mission"}
                </span>
              </div>
              <h1 className="text-title font-semibold leading-display tracking-title text-white sm:text-title">
                {action.title}
              </h1>
              {action.href ? (
                <a
                  href={action.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-meta font-medium text-white/70 transition hover:text-white"
                >
                  Open the resource <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          </SectionCard>

          {isDone ? (
            /* Completed look-back — or, when no feeling was ever captured
               (e.g. marked done before the gate, or arrived here via Today's
               "reflect on this"), a way to still reflect and close the loop. */
            <SectionCard tone="neutral">
              <div className="flex items-center gap-2 text-meta font-semibold uppercase tracking-eyebrow text-emerald-300/85">
                <Check className="h-4 w-4" /> Done
              </div>

              {!action.felt || editing ? (
                <div className="mt-3">
                  <h2 className="text-body font-semibold text-white">
                    {editing ? "Add a reflection" : "How did it go?"}
                  </h2>
                  <p className="mt-1 text-meta leading-read text-white/64">
                    {editing
                      ? "Anything you want to add, coming back to this?"
                      : "You finished this — one tap on how it felt is what teaches Everleap."}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {FELT_OPTIONS.map((o) => (
                      <button
                        key={o.key}
                        type="button"
                        onClick={() => setFelt(o.key)}
                        className={`rounded-full border px-3.5 py-1.5 text-meta font-medium transition ${
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
                  <ReflectionPrompts fields={reflectFields} onChange={updateReflect} />
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={editing ? addMore : finish}
                      disabled={finishing || (editing ? !hasReflectionText : !felt)}
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-label font-semibold text-white transition hover:brightness-110 disabled:opacity-40"
                      style={{ backgroundColor: rgba(accent, 0.24) }}
                    >
                      {finishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      {editing ? "Add reflection" : "Save reflection"}
                    </button>
                    {editing ? (
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="text-meta font-medium text-white/50 transition hover:text-white/80"
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                  {!editing && !felt ? (
                    <p className="mt-2 text-meta leading-body text-white/40">
                      Pick how it felt — that one tap is what teaches Everleap.
                    </p>
                  ) : null}
                </div>
              ) : (
                <>
                  {action.felt ? (
                    <p className="mt-2 text-label text-white/72">
                      Afterward you felt{" "}
                      <span className="font-semibold text-white">{action.felt}</span>.
                    </p>
                  ) : null}

                  {/* The reflection journal — every entry you've added, newest first. */}
                  {reflectionEntries.length > 0 ? (
                    <div className="mt-3 space-y-2.5">
                      {reflectionEntries.map((r) => (
                        <div
                          key={r.id}
                          className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5"
                        >
                          <div className="mb-1 flex items-center gap-1.5 text-micro text-white/42">
                            {r.felt ? (
                              <>
                                <span className="capitalize">{r.felt}</span>
                                <span aria-hidden>·</span>
                              </>
                            ) : null}
                            <span>{timeAgo(r.createdAt)}</span>
                          </div>
                          <p className="whitespace-pre-line text-label leading-read text-white/82">
                            {r.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : action.reflection ? (
                    <p className="mt-2 whitespace-pre-line text-label leading-read text-white/72">
                      {action.reflection}
                    </p>
                  ) : null}

                  {/* A REAL BUTTON, not a footnote.
                      This was 13px at 55% white — quieter than the body text it
                      sat under, on the one screen whose whole job is to collect
                      the thing it opens. Reflection is what turns something you
                      did into something the app knows, so it gets the same pill
                      every other primary action on this screen gets. */}
                  <button
                    type="button"
                    onClick={() => {
                      setReflectFields({ noticed: "", surprised: "", next: "" });
                      setFelt(null);
                      setEditing(true);
                    }}
                    className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-3 text-label font-semibold transition hover:brightness-110 active:opacity-80"
                    style={{
                      color: rgba(accent, 0.98),
                      background: rgba(accent, 0.1),
                      border: `1px solid ${rgba(accent, 0.32)}`,
                      boxShadow: `0 2px 12px ${rgba(accent, 0.1)}`,
                    }}
                  >
                    <MessageSquare className="h-4 w-4" />
                    {reflectionEntries.length > 0 ? "Add another reflection" : "Add a reflection"}
                  </button>
                  <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
                    <div
                      className="mb-1.5 flex items-center gap-1.5 text-micro font-semibold uppercase tracking-eyebrow"
                      style={{ color: rgba(accent, 0.9) }}
                    >
                      <Sparkles className="h-3 w-3" /> What I’m taking from this
                    </div>
                    {echoLoading ? (
                      <div className="flex items-center gap-2 text-meta text-white/50">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Reading what you noticed…
                      </div>
                    ) : echo ? (
                      <p className="text-label leading-read text-white/82">{echo}</p>
                    ) : (
                      <p className="text-meta leading-read text-white/55">
                        Finishing this fed back into what Everleap is learning about you.
                      </p>
                    )}
                  </div>
                </>
              )}
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
                  <h2 className="text-body font-semibold text-white">Turn this into a mission</h2>
                  <p className="mt-1 max-w-md text-meta leading-read text-white/64">
                    Everleap will build you a few concrete steps — tailored to what you’ve shared — so
                    this becomes something you can actually start this week.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={start}
                  disabled={starting}
                  className="mt-1 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-label font-semibold text-white transition hover:brightness-110 disabled:opacity-70"
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
                  <div className="mb-1.5 text-micro font-semibold uppercase tracking-eyebrow text-white/45">
                    Why this is worth trying
                  </div>
                  <p className="text-label leading-read text-white/82">{action.mission.why}</p>
                </SectionCard>
              ) : null}

              {/* The "how": a message you can actually send — removes the hardest
                  part (knowing what to say). Only present when the action means
                  reaching out to someone. */}
              {action.mission.script ? (
                <SectionCard tone="neutral">
                  <div
                    className="mb-2 flex items-center gap-1.5 text-micro font-semibold uppercase tracking-eyebrow"
                    style={{ color: rgba(accent, 0.9) }}
                  >
                    <MessageSquare className="h-3 w-3" /> A message you could send
                  </div>
                  <p className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5 text-label leading-read text-white/88">
                    “{action.mission.script}”
                  </p>
                  <button
                    type="button"
                    onClick={() => copyScript(action.mission!.script ?? "")}
                    className="mt-2.5 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-meta font-semibold transition hover:brightness-110"
                    style={{ backgroundColor: rgba(accent, 0.16), color: rgba(accent, 0.95) }}
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy this message"}
                  </button>
                </SectionCard>
              ) : null}

              <SectionCard tone="neutral">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-meta font-semibold uppercase tracking-eyebrow text-white/55">Your steps</h2>
                  <span className="text-meta font-medium text-white/45">
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
                        className={`text-label leading-body ${
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
                    className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-label font-semibold transition ${
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

              {/* What to watch for — gives the doing a point, and seeds the
                  reflection you'll write afterward. */}
              {action.mission.watchFor && action.mission.watchFor.length ? (
                <SectionCard tone="neutral">
                  <div
                    className="mb-2.5 flex items-center gap-1.5 text-micro font-semibold uppercase tracking-eyebrow"
                    style={{ color: rgba(accent, 0.9) }}
                  >
                    <Eye className="h-3 w-3" /> While you’re doing it, notice
                  </div>
                  <ul className="space-y-2">
                    {action.mission.watchFor.map((w, i) => (
                      <li key={i} className="flex gap-2.5 text-label leading-body text-white/78">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: rgba(accent, 0.8) }} />
                        {w}
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              ) : null}

              {/* Reflection */}
              {reflectOpen ? (
                <SectionCard tone="hero" backdrop={<ConstellationAnchor seed={`reflect:${action.id}`} accent={accent} />}>
                  <div className="max-w-2xl">
                    <h2 className="text-body font-semibold text-white">How did it go?</h2>
                    <p className="mt-1 text-meta leading-read text-white/64">
                      A quick reflection helps Everleap understand what actually energizes you.
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {FELT_OPTIONS.map((o) => (
                        <button
                          key={o.key}
                          type="button"
                          onClick={() => setFelt(o.key)}
                          className={`rounded-full border px-3.5 py-1.5 text-meta font-medium transition ${
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

                    <ReflectionPrompts fields={reflectFields} onChange={updateReflect} />

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={finish}
                        disabled={finishing || !felt}
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-label font-semibold text-white transition hover:brightness-110 disabled:opacity-40"
                        style={{ backgroundColor: rgba(accent, 0.24) }}
                      >
                        {finishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        Finish mission
                      </button>
                      <button
                        type="button"
                        onClick={() => setReflectOpen(false)}
                        className="text-meta font-medium text-white/50 transition hover:text-white/80"
                      >
                        Not yet
                      </button>
                    </div>
                    {!felt ? (
                      <p className="mt-2 text-meta leading-body text-white/40">
                        Pick how it felt to finish — that one tap is what teaches Everleap.
                      </p>
                    ) : null}
                  </div>
                </SectionCard>
              ) : null}
            </>
          )}

          {/* Bottom "back" pill — same destination as the top link, so you can
              return to where you came from without scrolling back up. */}
          <div className="pt-1">
            <Link
              href={back.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/14 px-4 py-2 text-meta font-medium text-white/60 transition hover:border-white/25 hover:text-white/90"
            >
              <ArrowLeft className="h-4 w-4" />
              {back.label}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
