// apps/web/src/app/(app)/main/explore/_components/DayDescent.tsx
//
// "A real day" gone deep (design-doc Concept 05 + the Concept 03 descent). A
// full-screen, one-moment-at-a-time walk through a real day — each moment its own
// VISUAL scene (a time-of-day atmosphere, not a text card), swiped like a story.
// It ends on the honey doors: watch a real one, or turn it into a mission you go
// do. "Step back up" always returns to the constellation — never bottomless.

"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Loader2, Play, Wand2 } from "lucide-react";

import { DescentMedia, DescentShell } from "./DescentShell";
import { DayRibbon } from "./DayRibbon";
import type { RealityMoment } from "../_data/exploreSchema";

const HONEY = "244, 192, 103";

// Map a moment's time label to a scene: a sky gradient, a sun/moon disc position,
// and whether it's day or night — so the descent feels like moving through hours.
/** The hour a moment's label implies. Shared by the scene and the day rail. */
export function hourOf(label: string | undefined): number {
  const m = (label ?? "").match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (m) {
    let h = parseInt(m[1], 10) % 12;
    if (/pm/i.test(m[3])) h += 12;
    return h;
  }
  const l = (label ?? "").toLowerCase();
  if (/night|late evening/.test(l)) return 22;
  if (/evening|dusk|end of day/.test(l)) return 19;
  if (/late afternoon/.test(l)) return 16;
  // Midday sits before the afternoon rather than on top of it — they used to
  // share hour 14, which stacked two markers on the same pixel of the ribbon.
  if (/midday|lunch|noon/.test(l)) return 12;
  if (/afternoon/.test(l)) return 14;
  if (/late morning/.test(l)) return 11;
  if (/dawn|sunrise|early/.test(l)) return 6;
  if (/morning/.test(l)) return 9;
  return 12;
}

/** The sky colour at that hour — the day rail is drawn from these. */
export function skyTintAt(hour: number): string {
  if (hour < 5 || hour >= 21) return "#0a1030";
  if (hour < 8) return "#c9764f";
  if (hour < 11) return "#2f6f9e";
  if (hour < 15) return "#3a86c0";
  if (hour < 18) return "#8a6a4e";
  return "#6a3a54";
}

function scene(label: string | undefined): { sky: string; discTop: string; discColor: string; night: boolean; glow: string } {
  const m = (label ?? "").match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  let hour = 12;
  if (m) {
    hour = parseInt(m[1], 10) % 12;
    if (/pm/i.test(m[3])) hour += 12;
  } else if (/night/i.test(label ?? "")) hour = 22;
  else if (/evening|dusk/i.test(label ?? "")) hour = 19;
  else if (/dawn|sunrise|early/i.test(label ?? "")) hour = 6;

  if (hour < 5 || hour >= 21)
    return { night: true, sky: "linear-gradient(180deg,#0a1030,#0a0f22 60%,#05070f)", discTop: "22%", discColor: "#cfd8ff", glow: "rgba(180,200,255,0.45)" };
  if (hour < 8)
    return { night: false, sky: "linear-gradient(180deg,#2a2140,#5a3a4e 45%,#c9764f 100%)", discTop: "58%", discColor: "#ffd9a0", glow: "rgba(255,180,120,0.6)" };
  if (hour < 11)
    return { night: false, sky: "linear-gradient(180deg,#173a5e,#2f6f9e 60%,#7fb0cf)", discTop: "30%", discColor: "#fff1c4", glow: "rgba(255,235,170,0.7)" };
  if (hour < 15)
    return { night: false, sky: "linear-gradient(180deg,#1d5a8a,#3a86c0 60%,#8fc0e0)", discTop: "20%", discColor: "#fff7d6", glow: "rgba(255,245,200,0.8)" };
  if (hour < 18)
    return { night: false, sky: "linear-gradient(180deg,#26466e,#8a6a4e 60%,#e0a05a)", discTop: "42%", discColor: "#ffe6a8", glow: "rgba(255,210,140,0.7)" };
  return { night: false, sky: "linear-gradient(180deg,#241a3a,#6a3a54 50%,#d1704f)", discTop: "62%", discColor: "#ffcaa0", glow: "rgba(255,160,110,0.6)" };
}

export function DayDescent({
  moments,
  pathSlug,
  specialtyTitle,
  careerTitle,
  accent,
  creating,
  onClose,
  onStartMission,
}: {
  moments: RealityMoment[];
  pathSlug: string;
  specialtyTitle: string;
  careerTitle: string;
  accent: string;
  creating: boolean;
  onClose: () => void;
  onStartMission: () => void;
}) {
  const total = moments.length + 1; // + the outro
  const [i, setI] = React.useState(0);
  const atOutro = i >= moments.length;
  const m = atOutro ? null : moments[i];
  const sc = scene(m?.timeLabel);
  const imgUrl = m
    ? m.image ||
      `/api/guidance/day-scene-image?path=${encodeURIComponent(pathSlug)}&moment=${encodeURIComponent(m.id)}`
    : null;

  const go = React.useCallback(
    (d: 1 | -1) => setI((n) => Math.max(0, Math.min(total - 1, n + d))),
    [total]
  );
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  const videoHref = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `day in the life ${careerTitle}`
  )}`;

  // Portal to <body> so the full-screen scene escapes the page's stacking context
  // and covers the app's bottom nav (z-50) for true immersion.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <DescentShell
      backTo={specialtyTitle}
      accent={accent}
      step={i}
      total={total}
      onClose={onClose}
      // The rail IS the day — a dawn-to-dusk band with a marker per moment that
      // you can tap to jump, rather than a read-out of how far you've got.
      rail={
        <DayRibbon
          moments={moments}
          active={Math.min(i, moments.length - 1)}
          outroActive={atOutro}
          onJump={(k) => setI(k)}
        />
      }
      media={
        atOutro ? null : (
          <DescentMedia style={{ background: sc.sky }}>
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 h-28 w-28 -translate-x-1/2 rounded-full"
              style={{ top: sc.discTop, background: sc.discColor, boxShadow: `0 0 90px 30px ${sc.glow}` }}
            />
            {sc.night ? (
              <span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(1px 1px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 70% 20%, #fff, transparent), radial-gradient(1.5px 1.5px at 45% 40%, #fff, transparent), radial-gradient(1px 1px at 85% 55%, #fff, transparent)", opacity: 0.7 }} />
            ) : null}
            {imgUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={imgUrl}
                src={imgUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700"
                onLoad={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "1";
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}
            <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3" style={{ background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.55))" }} />
            <button aria-label="Previous" type="button" onClick={() => go(-1)} className="absolute inset-y-0 left-0 w-1/3" />
            <button aria-label="Next" type="button" onClick={() => go(1)} className="absolute inset-y-0 right-0 w-2/3" />
            {/* The time of day used to be stamped on the photo. The ribbon in
                the header now names the period AND places it in the day, so the
                stamp was the same word twice on one screen — and the picture is
                better without something written across it. */}
          </DescentMedia>
        )
      }
    >
      {atOutro ? (
        /* Outro — the honey doors: watch a real one, or go do it. */
        <div className="flex flex-col gap-4 pt-6">
          <div className="text-micro font-semibold uppercase tracking-eyebrow" style={{ color: `rgb(${HONEY})` }}>
            That&rsquo;s the day
          </div>
          <h2 className="text-title font-semibold leading-display tracking-title">
            Now see it, or go do it.
          </h2>
          <p className="text-read leading-read text-white/72">
            Reading about {specialtyTitle} isn&rsquo;t the same as being there. Watch a real one, or
            turn it into a small thing you actually try this week.
          </p>
          <a
            href={videoHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 transition hover:brightness-110"
            style={{ borderColor: `rgba(${accent},0.5)`, background: `rgba(${accent},0.12)` }}
          >
            <span className="inline-flex items-center gap-2.5 font-semibold">
              <Play className="h-5 w-5" /> See a real day on the job
            </span>
            <ArrowRight className="h-5 w-5 text-white/70" />
          </a>
          <button
            type="button"
            onClick={onStartMission}
            disabled={creating}
            className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 font-semibold transition hover:brightness-105 disabled:opacity-70"
            style={{ background: `linear-gradient(180deg,#ffdf9e,rgb(${HONEY}))`, color: "#1a1204" }}
          >
            <span className="inline-flex items-center gap-2.5">
              <Wand2 className="h-5 w-5" /> Try {specialtyTitle} for real — start a mission
            </span>
            {creating ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
          </button>
          <button type="button" onClick={() => go(-1)} className="mt-1 text-meta text-white/45 transition hover:text-white/75">
            ← back to the day
          </button>
        </div>
      ) : (
        /* The moment's words. The scene above is supplied to the shell as media,
           so it scrolls with the text instead of pinning a third of the screen. */
        <div>

              <div className="text-micro font-semibold uppercase tracking-eyebrow" style={{ color: `rgb(${accent})` }}>
                {/* "3 of 4" lives in the ribbon now, next to the dot showing
                    which moment that is. Repeating it here said nothing new. */}
                A day in {specialtyTitle}
              </div>
              <h2 className="mt-2 text-read font-semibold leading-read text-white">{m?.title}</h2>
              {/* The scene-setting sentence reads at full size; the rest sits a
                  rung down. Sixty words of even prose under a photo is still a
                  wall — this gives the eye somewhere to land first, without
                  losing the detail for anyone who wants it. */}
              {(() => {
                const body = m?.body ?? "";
                const parts = body.split(/(?<=[.!?])\s+/);
                // A full stop is not always the end of a sentence. "You're
                // listening to E.T. Mensah's 'All For You'" split at the
                // initials, leaving a four-word lead and dropping sixty words
                // into the small, dim style — which is what "the text is tiny
                // down here" turned out to be. Rather than keep a list of
                // abbreviations, keep absorbing fragments until the lead is long
                // enough to actually be a sentence; E.T., U.S. and Dr. all fall
                // out of that for free.
                let lead = "";
                let i = 0;
                while (i < parts.length && lead.length < 45) {
                  lead = lead ? `${lead} ${parts[i]}` : parts[i];
                  i++;
                }
                const rest = parts.slice(i).join(" ").trim();
                return (
                  <>
                    <p className="mt-2 text-read leading-read text-white/88">{lead || body}</p>
                    {rest ? (
                      <p className="mt-2 text-label leading-read text-white/78">{rest}</p>
                    ) : null}
                  </>
                );
              })()}
              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  disabled={i === 0}
                  className="inline-flex items-center gap-1.5 text-meta text-white/55 transition hover:text-white disabled:opacity-30"
                >
                  {/* "Back" opposite "Next moment" read as an exit rather than
                      half of a pair — the wrong impression on a screen whose
                      real exit is elsewhere and whose app nav is covered.
                      Naming both ends the same thing makes them obviously two
                      directions through the day, leaving "Step back up" as the
                      only control here that means leave. */}
                  <ArrowLeft className="h-4 w-4" /> Previous moment
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-label font-semibold transition hover:brightness-110"
                  style={{ borderColor: `rgba(${accent},0.5)`, background: `rgba(${accent},0.12)`, color: `rgb(${accent})` }}
                >
                  {i === moments.length - 1 ? "See the day out" : "Next moment"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
        </div>
      )}
    </DescentShell>
  );
}

export default DayDescent;
