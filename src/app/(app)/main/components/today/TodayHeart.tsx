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
  const bigRead = !hasCoverage;
  const leadEyebrow = hasCoverage
    ? data.reinforcement?.eyebrow ?? "What I keep noticing about you"
    : "What I'm already seeing in you";
  const leadLine = hasCoverage
    ? data.reinforcement?.line || firstSentences(data.synthesis?.body, 1)
    : firstSentences(data.synthesis?.body, 2) || data.reinforcement?.line || "";

  // Empty progress art says nothing — the meter/pulse only earn their space once
  // there's real coverage to carry (and, for the pulse, an actual rhythm).
  const showMeter = hasCoverage;
  const showPulse = hasCoverage && !rhythm.firstBeat;

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

      {bigRead ? (
        <WelcomeName firstName={welcome.firstName} accentRgb={rgb} />
      ) : null}

      {/* The agentic lead — present in EVERY state. A fuller establishing read
          while we're still learning them; a grounded, rotating one-liner once we
          know them. Never a bare move. */}
      {leadLine ? (
        bigRead ? (
          <div className="mt-5">
            <div
              className="text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{ color: `rgb(${rgb})` }}
            >
              {leadEyebrow}
            </div>
            <p className="mt-2.5 max-w-[560px] text-[17px] leading-[1.5] text-white/90">
              {leadLine}
            </p>
          </div>
        ) : (
          <div className="mt-4 flex gap-2.5 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-3">
            <span
              className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: `rgb(${rgb})` }}
            />
            <div>
              <div
                className="text-[9px] font-bold uppercase tracking-[0.16em]"
                style={{ color: `rgb(${rgb})` }}
              >
                {leadEyebrow}
              </div>
              <p className="mt-1 text-[14px] leading-snug text-white/85">
                {leadLine}
              </p>
            </div>
          </div>
        )
      ) : null}

      {/* The forward move. Under the establishing read it's the next step;
          otherwise it's the hero line itself. */}
      <h1
        className={`${
          bigRead ? "mt-6 text-[19px] text-white/95" : "mt-4 text-[22px] text-white"
        } max-w-[560px] font-semibold leading-[1.16] tracking-[-0.03em]`}
      >
        {dispatch.move}
      </h1>

      {/* Do beats carry a compact when/time strip; other beats stay wordless. */}
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

      {/* Living visuals carry the state — but only once there's state to carry;
          empty progress art on a first visit is just noise. */}
      {showMeter ? <CoverageMeter coverage={coverage} accentRgb={rgb} /> : null}
      {showPulse ? <PulseTrace rhythm={rhythm} accentRgb={rgb} /> : null}

      <button
        type="button"
        onClick={dispatch.save ? handleSaveAction : onPrimary}
        disabled={saving || saved}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3.5 text-[14px] font-semibold transition hover:brightness-[1.08] disabled:opacity-80"
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
