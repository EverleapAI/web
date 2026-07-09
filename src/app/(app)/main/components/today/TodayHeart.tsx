"use client";

// TodayHeart — the "beating heart" home card. One template that flexes by
// dispatch type. Deliberately sparse: an optional "we heard you" reinforcement
// line, ONE line of substance (the move), the living visuals (coverage +
// pulse), a luminous CTA, and — only when relevant — a quiet loose-thread nudge.
// Meaning stays in a few words; state/identity/rhythm are carried by the art.

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronDown, Check, RotateCcw } from "lucide-react";

import { emitActionAdded } from "@/lib/actionsBus";

import { StoryRail } from "./StoryRail";
import { PulseTrace } from "./PulseTrace";
import { DispatchGlyph } from "./DispatchGlyph";
import { WelcomeName } from "./WelcomeName";
import { DISPATCH_ACCENT, type TodayHeartData } from "./todayHeart.types";

// Keep the read tight — the first couple of sentences carry the "I get you"
// weight; more than that turns an opening into an essay.
function firstSentences(text: string | null | undefined, n: number): string {
  if (!text) return "";
  const parts = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return (parts.length ? parts : [text.trim()]).slice(0, n).join(" ");
}

function ensureStop(s: string): string {
  const t = s.trim();
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

// Fallback only: trim a longer read down to roughly retort length when the
// backend pack hasn't supplied a dedicated retort yet.
function capWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text.trim();
  return `${words.slice(0, maxWords).join(" ").replace(/[,;:—-]$/, "")}…`;
}

// Keep a read to roughly four lines: if it runs long, drop whole trailing
// sentences until it fits (never a mid-sentence chop).
function capRead(text: string, maxChars: number): string {
  const t = text.trim();
  if (t.length <= maxChars) return t;
  const sentences = t.split(/(?<=[.!?])\s+/);
  let out = "";
  for (const s of sentences) {
    const next = out ? `${out} ${s}` : s;
    if (next.length > maxChars && out) break;
    out = next;
  }
  return out || t.slice(0, maxChars).replace(/\s+\S*$/, "").trim();
}

// The establishing read, rotated across visits so an early user doesn't see the
// exact same paragraph every day. Options: the synthesis body paragraph, plus
// grounded reinforcement lines paired into ~2-sentence reads (so the weight
// stays roughly even). Deterministic by day; falls back to the one-liner.
function establishingRead(input: {
  body: string | null | undefined;
  reads: string[] | null | undefined;
  fallback: string;
}): string {
  const options: string[] = [];

  const bodyPara = firstSentences(input.body, 2);
  if (bodyPara) options.push(bodyPara);

  const pool = (input.reads ?? [])
    .map((r) => (r ?? "").trim())
    .filter(Boolean)
    .map(ensureStop);

  if (pool.length === 1) {
    options.push(pool[0]);
  } else {
    for (let i = 0; i < pool.length; i++) {
      options.push(`${pool[i]} ${pool[(i + 1) % pool.length]}`);
    }
  }

  if (options.length === 0) return input.fallback;
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return capRead(options[dayIndex % options.length], 220);
}

export function TodayHeart({
  data,
  onPrimary,
}: {
  data: TodayHeartData;
  onPrimary: () => void;
}) {
  const router = useRouter();
  const { dispatch, coverage, rhythm, welcome } = data;
  const accent = DISPATCH_ACCENT[dispatch.type] ?? DISPATCH_ACCENT.learn;
  const rgb = accent.rgb;

  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [howLoading, setHowLoading] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [whyOpen, setWhyOpen] = React.useState(false);

  // Close the "Why" modal on Escape.
  React.useEffect(() => {
    if (!whyOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setWhyOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [whyOpen]);

  // "How would I even do this?" — saves the action and opens its playbook,
  // auto-generating the how (who to ask, what to say, what to watch for). A move
  // a teen can't picture starting is just anxiety; this makes it walkable.
  async function handleHowTo() {
    if (!dispatch.save || howLoading) return;
    setHowLoading(true);
    try {
      const res = await fetch("/api/guidance/actions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType: "today",
          lane: "today",
          title: dispatch.save.actionTitle,
          description: dispatch.why,
        }),
      });
      const d = await res.json().catch(() => null);
      if (res.ok && d?.action?.id) {
        emitActionAdded(dispatch.save.actionTitle);
        router.push(`/main/actions/${d.action.id}?start=1`);
        return;
      }
    } catch {
      // fall through — leave the button enabled to retry
    }
    setHowLoading(false);
  }

  // "Do" beats save the move into Actions (matching the app-wide pattern:
  // POST /api/guidance/actions then emit the toast), then step over to Actions.
  async function handleSaveAction() {
    if (!dispatch.save || saving || saved) return;
    setSaving(true);
    try {
      const res = await fetch("/api/guidance/actions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType: "today",
          lane: "today",
          title: dispatch.save.actionTitle,
          description: dispatch.why,
        }),
      });
      if (res.ok) {
        emitActionAdded(dispatch.save.actionTitle);
        setSaved(true);
        window.setTimeout(() => router.push(dispatch.destination.route), 750);
      }
    } catch {
      // leave the button enabled to retry
    } finally {
      setSaving(false);
    }
  }

  const primaryLabel = saved
    ? "Added to your Actions"
    : saving
      ? "Adding…"
      : dispatch.destination.label;

  const hasCoverage = coverage.filledCount > 0;

  // Every Today opens with an agentic lead — a real "we know you" read, never a
  // bare move. Voice over chrome: no eyebrow label, the prose just speaks.
  // Prefer the woven briefing (who you are → what you've done here → what's
  // next); fall back to the rotating establishing read for older packs.
  const leadLine =
    data.lead?.trim() ||
    establishingRead({
      body: data.synthesis?.body,
      reads: data.reads,
      fallback: data.reinforcement?.line ?? "",
    });

  // Progressive-disclosure hero: a ≤50-word retort shown by default, an optional
  // "See more" panel (below, not a modal) with the fuller read, and a "Why"
  // modal with the reasoning. Prefer the generated fields; fall back so older
  // packs still render cleanly.
  const heroRetort = data.retort?.trim() || capWords(leadLine, 48);
  const heroBody =
    data.body?.trim() ||
    (leadLine && leadLine !== heroRetort ? leadLine : null);
  const heroWhy = data.why?.trim() || dispatch.why?.trim() || null;

  // Empty progress art says nothing — the meter/pulse only earn their space once
  // there's real coverage to carry (and, for the pulse, an actual rhythm).
  const showMeter = hasCoverage;
  // Show the rhythm only when there's an actual beat this week — an empty "0
  // beats" chart reads as a scolding, not a signal.
  const showPulse = hasCoverage && !rhythm.firstBeat && rhythm.total7d > 0;
  // A do/look move isn't itself the story step, so invite it explicitly under
  // the progress meter. A learn move already IS "continue your story".
  const showStoryNudge = showMeter && dispatch.type !== "learn";
  // Point the nudge at whatever actually fills the NEXT gap. Most gaps
  // (motivations, strengths, skills, story, direction) are story-fed; the
  // "experience" gap is only filled by doing and reflecting on an action, so
  // sending someone to Story there would be a dead end.
  const gapNudge =
    coverage.nextGapKey === "experience"
      ? { label: "Reflect on what you've tried", route: "/main/actions" }
      : { label: "Continue your story", route: "/main/story" };

  return (
    <div className="relative">
      {/* top row: just the dispatch mark + a live pulse. Voice over chrome —
          the type glyph is the only signal; no "Do · in the world", no "Today"
          (you're on the Today tab already). */}
      <div className="flex items-center justify-between">
        <DispatchGlyph type={dispatch.type} showLabel={false} />
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping"
            style={{ background: `rgb(${rgb})` }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ background: `rgb(${rgb})` }}
          />
        </span>
      </div>

      {/* The arrival masthead — the centered anchor in every state. */}
      <WelcomeName
        firstName={welcome.firstName}
        accentRgb={rgb}
        isNewUser={welcome.isNewUser}
      />

      {/* The agentic lead — the hero. A ≤50-word retort in every state (neutral
          prose so the accent stays a spot), with "See more" opening a panel
          below and "Why" opening the reasoning. */}
      {heroRetort ? (
        <div className="mt-5 max-w-[560px]">
          <p
            className="text-[18px] leading-[1.55]"
            style={{
              color: "rgba(223,213,194,0.62)",
              textShadow: "0 1px 1px rgba(0,0,0,0.75)",
            }}
          >
            {heroRetort}
          </p>

          {expanded && heroBody ? (
            <p
              className="mt-3 text-[15.5px] leading-[1.6]"
              style={{
                color: "rgba(220,210,192,0.58)",
                textShadow: "0 1px 1px rgba(0,0,0,0.7)",
              }}
            >
              {heroBody}
            </p>
          ) : null}

          {heroBody || heroWhy ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {heroBody ? (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                  className="inline-flex items-center gap-1 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 text-[12.5px] font-medium text-white/70 transition hover:border-white/20 hover:text-white/90"
                >
                  {expanded ? "See less" : "See more"}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition ${expanded ? "rotate-180" : ""}`}
                  />
                </button>
              ) : null}
              {heroWhy ? (
                <button
                  type="button"
                  onClick={() => setWhyOpen(true)}
                  className="inline-flex items-center rounded-full px-3 py-1.5 text-[12.5px] font-medium text-white/55 transition hover:text-white/80"
                >
                  Why
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* The action — the move, its when/time, and the one bright CTA, grouped
          so the button clearly belongs to the move it acts on. Sits below the
          read, at a lighter weight, so the read stays the hero. */}
      <div className="mt-6">
        <h1
          className="max-w-[520px] text-[17px] font-semibold leading-[1.25] tracking-[-0.02em]"
          style={{
            color: "rgba(232,222,204,0.82)",
            textShadow: "0 1px 1px rgba(0,0,0,0.8)",
          }}
        >
          {dispatch.move}
        </h1>

        {dispatch.meta ? (
          <div className="mt-2 text-[12px] tabular-nums text-white/40">
            {dispatch.meta.duration} · {dispatch.meta.when}
          </div>
        ) : null}

        {/* One tap to the "how" — for a real-world do move, reassurance that
            you'll know exactly how to start is a click away. */}
        {dispatch.save ? (
          <button
            type="button"
            onClick={handleHowTo}
            disabled={howLoading}
            className="mt-2.5 inline-flex items-center gap-1 text-[12.5px] font-medium transition hover:brightness-110 disabled:opacity-70"
            style={{ color: `rgba(${rgb},0.85)` }}
          >
            {howLoading ? "Opening…" : "How would I even do this?"}
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        ) : null}

        {/* A calm spot-colour pill, not a full-width flood. Prominence is
            rationed — the read is the hero, this is the commit. */}
        <button
          type="button"
          onClick={dispatch.save ? handleSaveAction : onPrimary}
          disabled={saving || saved}
          className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition hover:brightness-110 disabled:opacity-70"
          style={{
            color: `rgb(${rgb})`,
            background: `rgba(${rgb},0.12)`,
            border: `1px solid rgba(${rgb},0.42)`,
            boxShadow: `0 4px 16px rgba(${rgb},0.12)`,
          }}
        >
          <span>{primaryLabel}</span>
          {saved ? (
            <Check className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Progress — "your story is forming", which also opens achievements. */}
      {showMeter ? <StoryRail coverage={coverage} accentRgb={rgb} /> : null}

      {/* ONE adaptive secondary nudge — a single named loose thread if there is
          one, otherwise the invitation to fill the next gap. Never both, never
          a growing stack. */}
      {data.looseThread?.title ? (
        <button
          type="button"
          onClick={() => router.push(data.looseThread!.route)}
          className="group mt-3 flex w-full items-center gap-2 px-1 text-left"
        >
          <RotateCcw
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: "rgba(55,211,160,0.85)" }}
          />
          <span className="flex-1 text-[12.5px] font-medium text-[rgb(55,211,160)] transition group-hover:brightness-110">
            {data.looseThread.kind === "due"
              ? `You started “${data.looseThread.title}” — how's it going?`
              : `Reflect on “${data.looseThread.title}”`}
          </span>
          <ChevronRight className="h-3.5 w-3.5" style={{ color: "rgba(55,211,160,0.7)" }} />
        </button>
      ) : showStoryNudge ? (
        <button
          type="button"
          onClick={() => router.push(gapNudge.route)}
          className="group mt-3 flex w-full items-center gap-1.5 px-1 text-left"
        >
          <span
            className="text-[12.5px] font-medium"
            style={{ color: `rgba(${rgb},0.92)` }}
          >
            {gapNudge.label}
          </span>
          <ChevronRight
            className="h-3.5 w-3.5 transition group-hover:translate-x-0.5"
            style={{ color: `rgba(${rgb},0.7)` }}
          />
        </button>
      ) : null}

      {/* Ambient rhythm — only when there's an actual beat this week. */}
      {showPulse ? <PulseTrace rhythm={rhythm} accentRgb={rgb} /> : null}

      {/* "Why" — the reasoning behind today's read, one tap away. */}
      {whyOpen && heroWhy ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Why you're seeing this"
          onClick={() => setWhyOpen(false)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[420px] rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#0c1428,#070d1c)] p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
          >
            <div
              className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.22em]"
              style={{ color: `rgb(${rgb})` }}
            >
              Why this
            </div>
            <p className="text-[15.5px] leading-[1.6] text-white/85">{heroWhy}</p>
            <button
              type="button"
              onClick={() => setWhyOpen(false)}
              className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition hover:brightness-110"
              style={{
                color: `rgb(${rgb})`,
                background: `rgba(${rgb},0.12)`,
                border: `1px solid rgba(${rgb},0.42)`,
              }}
            >
              Got it
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
