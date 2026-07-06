// src/app/(app)/main/profile/portrait/page.tsx
//
// "How I see you" — the self-portrait. A warm, second-person reflection of who
// Everleap is coming to understand you to be, generated from your own signal.
// First visit may take a few seconds (it generates, then caches).

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Compass, Sparkles } from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import { ConstellationAnchor } from "../../components/ui/ConstellationAnchor";

const ACCENT = { r: 182, g: 160, b: 255 };
const rgba = (a: number) => `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${a})`;

type Facet = { title: string; body: string };
type Portrait = { headline: string; facets: Facet[]; closing: string; generatedAt: string };

export default function PortraitPage() {
  const [state, setState] = React.useState<"loading" | "empty" | "ready" | "error">("loading");
  const [portrait, setPortrait] = React.useState<Portrait | null>(null);

  React.useEffect(() => {
    let alive = true;
    fetch("/api/guidance/self-portrait", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!alive) return;
        if (d?.ok && d.portrait) {
          setPortrait(d.portrait as Portrait);
          setState("ready");
        } else if (d?.ok) {
          setState("empty");
        } else {
          setState("error");
        }
      })
      .catch(() => {
        if (alive) setState("error");
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-[680px] px-[6px] pb-28 pt-2">
      <Link
        href="/main/profile"
        className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-white/55 transition hover:text-white/85"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Me
      </Link>

      <SectionCard tone="hero" backdrop={<ConstellationAnchor seed="portrait" accent={ACCENT} />}>
        <div className="max-w-2xl">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
            <Sparkles className="h-3 w-3" /> How I see you
          </div>
          {state === "ready" && portrait ? (
            <h1 className="text-[22px] font-semibold leading-[1.28] tracking-[-0.02em] text-white sm:text-[25px]">
              {portrait.headline}
            </h1>
          ) : (
            <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-white sm:text-[25px]">
              A picture forming
            </h1>
          )}
        </div>
      </SectionCard>

      {state === "loading" ? (
        <div className="mt-3">
          <SectionCard tone="neutral">
            <div className="flex items-center gap-3 py-1">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                  style={{ background: rgba(0.8) }}
                />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: rgba(0.95) }} />
              </span>
              <span className="text-[14px] text-white/70">Reading back over everything you’ve shared…</span>
            </div>
          </SectionCard>
        </div>
      ) : state === "empty" ? (
        <div className="mt-3">
          <SectionCard tone="neutral">
            <div className="flex flex-col items-start gap-3 py-1">
              <h2 className="text-[16px] font-semibold text-white">Not quite enough yet</h2>
              <p className="max-w-md text-[13.5px] leading-[1.6] text-white/64">
                As you answer more, explore, and try things, a picture of who you are will take shape here — in your
                own patterns, not a personality test.
              </p>
              <Link
                href="/main/explore"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/14 bg-white/[0.08] px-4 py-2 text-[13.5px] font-semibold text-white transition hover:bg-white/[0.12]"
              >
                <Compass className="h-4 w-4" /> Keep exploring
              </Link>
            </div>
          </SectionCard>
        </div>
      ) : state === "error" ? (
        <div className="mt-3">
          <SectionCard tone="neutral">
            <p className="text-[14px] text-white/64">Couldn’t load this right now. Try again in a moment.</p>
          </SectionCard>
        </div>
      ) : portrait ? (
        <div className="mt-3 space-y-3">
          {portrait.facets.map((f, i) => (
            <SectionCard key={i} tone="neutral">
              <div className="flex gap-3.5">
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold tabular-nums"
                  style={{ background: rgba(0.16), border: `1px solid ${rgba(0.45)}`, color: "#fff" }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[15.5px] font-semibold tracking-[-0.01em] text-white">{f.title}</h3>
                  <p className="mt-1 text-[14px] leading-[1.6] text-white/74">{f.body}</p>
                </div>
              </div>
            </SectionCard>
          ))}

          {portrait.closing ? (
            <div className="px-3 pt-1">
              <p className="text-[15px] italic leading-[1.6] text-white/80">{portrait.closing}</p>
            </div>
          ) : null}

          <p className="px-3 pt-1 text-[12px] leading-[1.55] text-white/40">
            This is Everleap’s read of what you’ve shared — a starting point, not a verdict. It keeps changing as you do.
          </p>
        </div>
      ) : null}
    </div>
  );
}
