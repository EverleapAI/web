"use client";

// TodayHeart — the "beating heart" home card. One template that flexes by
// dispatch type. Deliberately sparse: an optional "we heard you" reinforcement
// line, ONE line of substance (the move), the living visuals (coverage +
// pulse), a luminous CTA, and — only when relevant — a quiet loose-thread nudge.
// Meaning stays in a few words; state/identity/rhythm are carried by the art.

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Check, RotateCcw } from "lucide-react";

import { emitActionAdded } from "@/lib/actionsBus";

import { CoverageMeter } from "./CoverageMeter";
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
  // bare move. Early on (no coverage yet) it's the fuller establishing read from
  // the synthesis body; once we actually know them it's the grounded, rotating
  // one-liner reinforcement. Present in every state.
  const leadEyebrow = hasCoverage
    ? data.reinforcement?.eyebrow ?? "What I keep noticing about you"
    : "What I'm already seeing in you";
  const leadLine = establishingRead({
    body: data.synthesis?.body,
    reads: data.reads,
    fallback: data.reinforcement?.line ?? "",
  });

  // Empty progress art says nothing — the meter/pulse only earn their space once
  // there's real coverage to carry (and, for the pulse, an actual rhythm).
  const showMeter = hasCoverage;
  // Show the rhythm only when there's an actual beat this week — an empty "0
  // beats" chart reads as a scolding, not a signal.
  const showPulse = hasCoverage && !rhythm.firstBeat && rhythm.total7d > 0;
  // A do/look move isn't itself the story step, so invite it explicitly under
  // the progress meter. A learn move already IS "continue your story".
  const showStoryNudge = showMeter && dispatch.type !== "learn";

  return (
    <div className="relative">
      {/* top row: dispatch identity + the beating "Today" pulse */}
      <div className="flex items-center justify-between">
        <DispatchGlyph type={dispatch.type} />
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping"
              style={{ background: `rgb(${rgb})` }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ background: `rgb(${rgb})` }}
            />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
            Today
          </span>
        </div>
      </div>

      {/* The arrival masthead — the centered anchor in every state. */}
      <WelcomeName
        firstName={welcome.firstName}
        accentRgb={rgb}
        isNewUser={welcome.isNewUser}
      />

      {/* The agentic lead — present in EVERY state. A fuller establishing read
          while we're still learning them; a grounded, rotating one-liner once we
          know them. Never a bare move. */}
      {leadLine ? (
        <div className="mt-5">
          <div
            className="text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: `rgb(${rgb})` }}
          >
            {leadEyebrow}
          </div>
          <p className="mt-2.5 max-w-[560px] text-[18px] leading-[1.55] text-white/90">
            {leadLine}
          </p>
        </div>
      ) : null}

      {/* The action — the move, its when/time, and the one bright CTA, grouped
          so the button clearly belongs to the move it acts on. Sits below the
          read, at a lighter weight, so the read stays the hero. */}
      <div className="mt-6">
        <h1 className="max-w-[520px] text-[17px] font-semibold leading-[1.25] tracking-[-0.02em] text-white">
          {dispatch.move}
        </h1>

        {dispatch.meta ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[
              { k: "When", v: dispatch.meta.when },
              { k: "Time", v: dispatch.meta.duration },
            ].map((m) => (
              <span
                key={m.k}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px]"
                style={{
                  background: `rgba(${rgb},0.10)`,
                  border: `1px solid rgba(${rgb},0.24)`,
                }}
              >
                <span
                  className="font-bold uppercase tracking-wide"
                  style={{ color: `rgba(${rgb},0.9)` }}
                >
                  {m.k}
                </span>
                <span className="text-white/70">{m.v}</span>
              </span>
            ))}
          </div>
        ) : null}

        <button
          type="button"
          onClick={dispatch.save ? handleSaveAction : onPrimary}
          disabled={saving || saved}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3.5 text-[14px] font-semibold transition hover:brightness-[1.08] disabled:opacity-80"
          style={{
            color: "rgba(255,255,255,0.97)",
            background: `linear-gradient(135deg, rgba(${rgb},0.34), rgba(${rgb},0.15))`,
            border: `1px solid rgba(${rgb},0.5)`,
            boxShadow: `0 10px 30px rgba(${rgb},0.26), inset 0 1px 0 rgba(255,255,255,0.16)`,
          }}
        >
          <span style={{ textShadow: `0 0 18px rgba(${rgb},0.5)` }}>
            {primaryLabel}
          </span>
          {saved ? (
            <Check className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Progress — the picture forming, plus an explicit invite to keep building
          the story that fills it. Ambient rhythm sits below the progress. */}
      {showMeter ? <CoverageMeter coverage={coverage} accentRgb={rgb} /> : null}
      {showStoryNudge ? (
        <button
          type="button"
          onClick={() => router.push("/main/story")}
          className="group mt-2.5 flex w-full items-center gap-1.5 px-1 text-left"
        >
          <span
            className="text-[12.5px] font-medium"
            style={{ color: `rgba(${rgb},0.92)` }}
          >
            Continue your story
          </span>
          <ChevronRight
            className="h-3.5 w-3.5 transition group-hover:translate-x-0.5"
            style={{ color: `rgba(${rgb},0.7)` }}
          />
        </button>
      ) : null}
      {showPulse ? <PulseTrace rhythm={rhythm} accentRgb={rgb} /> : null}

      {/* A finished-but-unreflected action: a whisper, not the room. */}
      {data.looseThread?.title ? (
        <button
          type="button"
          onClick={() => router.push(data.looseThread!.route)}
          className="group mt-4 flex w-full items-center gap-2 rounded-lg px-1 py-2 text-left transition hover:bg-white/[0.03]"
        >
          <RotateCcw
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: "rgba(55,211,160,0.75)" }}
          />
          <span className="flex-1 text-[12px] leading-snug text-white/45 transition group-hover:text-white/70">
            Still open · reflect on “{data.looseThread.title}”
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-white/25" />
        </button>
      ) : null}
    </div>
  );
}
