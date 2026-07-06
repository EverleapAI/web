"use client";

// TodayHeart — the "beating heart" home card. One template that flexes by
// dispatch type. Slice 1 renders the learn beat: welcome (new users) + the
// move + coverage meter + first step + pulse + return + quiet alternate lanes.
// Meaning stays in words; state/identity/rhythm are carried by the visuals.

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Check } from "lucide-react";

import { emitActionAdded } from "@/lib/actionsBus";

import { CoverageMeter } from "./CoverageMeter";
import { PulseTrace } from "./PulseTrace";
import { DispatchGlyph } from "./DispatchGlyph";
import { WelcomeName } from "./WelcomeName";
import { DISPATCH_ACCENT, type TodayHeartData } from "./todayHeart.types";

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

      {welcome.isNewUser ? (
        <WelcomeName firstName={welcome.firstName} accentRgb={rgb} />
      ) : null}

      {welcome.isNewUser && data.synthesis?.body ? (
        <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5">
          <div
            className="text-[9.5px] font-bold uppercase tracking-[0.16em]"
            style={{ color: `rgb(${rgb})` }}
          >
            What I'm already noticing
          </div>
          <p className="mt-2 text-[13.5px] leading-relaxed text-white/80">
            {data.synthesis.body}
          </p>
        </div>
      ) : null}

      {dispatch.orient ? (
        <p className="mt-3 text-[12.5px] leading-relaxed text-white/55">
          {dispatch.orient}
        </p>
      ) : null}

      <h1 className="mt-1.5 max-w-[560px] text-[22px] font-semibold leading-[1.16] tracking-[-0.03em] text-white">
        {dispatch.move}
      </h1>

      {dispatch.why ? (
        <p className="mt-2.5 max-w-[560px] text-[14px] leading-relaxed text-white/72">
          {dispatch.why}
        </p>
      ) : null}

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

      <CoverageMeter coverage={coverage} accentRgb={rgb} />

      {dispatch.steps && dispatch.steps.length ? (
        <div className="mt-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3">
          <div
            className="text-[9.5px] font-bold uppercase tracking-[0.16em]"
            style={{ color: `rgb(${rgb})` }}
          >
            The steps
          </div>
          <ol className="mt-2 flex flex-col gap-2">
            {dispatch.steps.map((step, i) => (
              <li key={i} className="flex gap-2.5">
                <span
                  className="mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{ color: `rgb(${rgb})`, background: `rgba(${rgb},0.14)` }}
                >
                  {i + 1}
                </span>
                <span className="text-[13.5px] leading-snug text-white/85">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : dispatch.firstStep ? (
        <div className="mt-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3">
          <div
            className="text-[9.5px] font-bold uppercase tracking-[0.16em]"
            style={{ color: `rgb(${rgb})` }}
          >
            First step
          </div>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/85">
            {dispatch.firstStep}
          </p>
        </div>
      ) : null}

      <PulseTrace rhythm={rhythm} accentRgb={rgb} />

      {dispatch.return ? (
        <div className="mt-3">
          <div className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-white/40">
            Comes back as
          </div>
          <p className="mt-1 text-[12.5px] leading-relaxed text-white/55">
            {dispatch.return}
          </p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={dispatch.save ? handleSaveAction : onPrimary}
        disabled={saving || saved}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-[14px] font-semibold transition hover:brightness-110 disabled:opacity-80"
        style={{
          color: `rgb(${rgb})`,
          background: `rgba(${rgb},0.14)`,
          border: `1px solid rgba(${rgb},0.34)`,
        }}
      >
        <span>{primaryLabel}</span>
        {saved ? (
          <Check className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      {dispatch.alternates?.length ? (
        <div className="mt-3 border-t border-white/[0.08] pt-3">
          <div className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white/35">
            Other lanes open
          </div>
          <div className="flex flex-col">
            {dispatch.alternates.map((alt) => (
              <button
                key={alt.route}
                type="button"
                onClick={() => router.push(alt.route)}
                className="group flex items-center gap-2.5 rounded-lg px-1 py-2 text-left transition hover:bg-white/[0.035]"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                <span className="flex-1 text-[12.5px] text-white/60 transition group-hover:text-white/90">
                  {alt.label}
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-white/30" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
