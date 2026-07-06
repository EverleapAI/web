// src/app/(app)/main/profile/reflections/page.tsx
//
// Reflections journal — a growing diary of the real-world things you've tried.
// Every completed mission with what you noticed, how it felt, and Everleap's
// reflection back. Reads the same user_actions the Actions tab does.

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Compass, Sparkles } from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import { ConstellationAnchor } from "../../components/ui/ConstellationAnchor";

type Mission = { echo?: string };
type Action = {
  id: string;
  title: string;
  lane: string | null;
  status: string;
  completedAt?: string | null;
  reflection?: string | null;
  felt?: string | null;
  mission?: Mission | null;
};

const ACCENT = { r: 182, g: 160, b: 255 };
const rgba = (a: number) => `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${a})`;

const FELT_STYLE: Record<string, string> = {
  energized: "bg-emerald-400/15 text-emerald-300/90",
  neutral: "bg-white/[0.08] text-white/60",
  drained: "bg-amber-400/15 text-amber-300/90",
};

function when(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function ReflectionsPage() {
  const [items, setItems] = React.useState<Action[] | null>(null);

  React.useEffect(() => {
    let alive = true;
    fetch("/api/guidance/actions?status=done", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!alive) return;
        const list: Action[] = Array.isArray(d?.actions) ? d.actions : [];
        const withReflection = list
          .filter((a) => a.reflection?.trim() || a.felt || a.mission?.echo)
          .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));
        setItems(withReflection);
      })
      .catch(() => {
        if (alive) setItems([]);
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

      <SectionCard tone="hero" backdrop={<ConstellationAnchor seed="reflections" accent={ACCENT} />}>
        <div className="max-w-2xl">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
            <Sparkles className="h-3 w-3" /> Reflections
          </div>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-white sm:text-[27px]">
            What you’ve tried, and what you noticed
          </h1>
          <p className="mt-2 text-[14px] leading-[1.6] text-white/70">
            Every mission you’ve finished — a growing record of the real things you’ve done and how they landed.
          </p>
        </div>
      </SectionCard>

      {items === null ? (
        <div className="mt-3 space-y-3">
          {[0, 1].map((i) => (
            <SectionCard key={i} tone="neutral">
              <div className="animate-pulse space-y-2">
                <div className="h-4 w-1/2 rounded bg-white/10" />
                <div className="h-3.5 w-5/6 rounded bg-white/[0.07]" />
              </div>
            </SectionCard>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-3">
          <SectionCard tone="neutral">
            <div className="flex flex-col items-start gap-3 py-2">
              <h2 className="text-[17px] font-semibold text-white">No reflections yet</h2>
              <p className="max-w-md text-[13.5px] leading-[1.6] text-white/64">
                When you finish a mission and jot down what you noticed, it lands here — a diary of the
                things you’ve actually tried.
              </p>
              <Link
                href="/main/explore"
                className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-white/14 bg-white/[0.08] px-4 py-2 text-[13.5px] font-semibold text-white transition hover:bg-white/[0.12]"
              >
                <Compass className="h-4 w-4" /> Find something to try
              </Link>
            </div>
          </SectionCard>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          {items.map((a) => (
            <SectionCard key={a.id} tone="neutral">
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <span className="text-[11px] uppercase tracking-[0.12em] text-white/40">{when(a.completedAt)}</span>
                {a.felt ? (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${
                      FELT_STYLE[a.felt] ?? "bg-white/[0.08] text-white/60"
                    }`}
                  >
                    {a.felt}
                  </span>
                ) : null}
              </div>

              <Link
                href={`/main/actions/${a.id}`}
                className="text-[16px] font-semibold tracking-[-0.01em] text-white transition hover:underline"
              >
                {a.title}
              </Link>

              {a.reflection?.trim() ? (
                <p className="mt-2 text-[14px] leading-[1.6] text-white/72">“{a.reflection.trim()}”</p>
              ) : null}

              {a.mission?.echo ? (
                <div className="mt-3 rounded-2xl border border-white/8 bg-white/[0.02] p-3">
                  <div
                    className="mb-1 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em]"
                    style={{ color: rgba(0.9) }}
                  >
                    <Sparkles className="h-3 w-3" /> What Everleap took from this
                  </div>
                  <p className="text-[13.5px] leading-[1.6] text-white/78">{a.mission.echo}</p>
                </div>
              ) : null}
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
}
