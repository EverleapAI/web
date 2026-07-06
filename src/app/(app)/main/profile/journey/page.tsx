// src/app/(app)/main/profile/journey/page.tsx
//
// Journey timeline — the user's Everleap story so far, as a vertical timeline of
// real milestones: joined, started exploring, and every mission finished. Built
// from created_at (me) + the dated fields on user_actions. No backend change.

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, CheckCircle2, Compass, Sparkles } from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import { ConstellationAnchor } from "../../components/ui/ConstellationAnchor";

const ACCENT = { r: 182, g: 160, b: 255 };
const rgba = (a: number) => `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${a})`;

type Action = {
  id: string;
  title: string;
  status: string;
  createdAt?: string;
  completedAt?: string | null;
  felt?: string | null;
};

type EventKind = "joined" | "saved" | "completed";
type Ev = { date: string; kind: EventKind; title: string; detail?: string };

const KIND_ICON: Record<EventKind, React.ComponentType<{ className?: string }>> = {
  joined: Sparkles,
  saved: Bookmark,
  completed: CheckCircle2,
};

function longDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

export default function JourneyPage() {
  const [events, setEvents] = React.useState<Ev[] | null>(null);

  React.useEffect(() => {
    let alive = true;
    Promise.all([
      fetch("/api/regauth/me", { credentials: "include", cache: "no-store" }).then((r) => r.json()).catch(() => null),
      fetch("/api/guidance/actions", { credentials: "include" }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ]).then(([me, act]) => {
      if (!alive) return;
      const list: Action[] = Array.isArray(act?.actions) ? act.actions : [];
      const evs: Ev[] = [];

      // Every finished mission is a real milestone.
      for (const a of list) {
        if (a.status === "done" && a.completedAt) {
          evs.push({
            date: a.completedAt,
            kind: "completed",
            title: a.title,
            detail: a.felt ? `Finished a mission — felt ${a.felt}.` : "Finished a mission.",
          });
        }
      }

      // The moment you first parked an idea to try.
      const firstSaved = list
        .map((a) => a.createdAt)
        .filter((d): d is string => Boolean(d))
        .sort((x, y) => x.localeCompare(y))[0];
      if (firstSaved) {
        evs.push({ date: firstSaved, kind: "saved", title: "Started exploring", detail: "Saved your first idea to try." });
      }

      // The origin.
      const joined = typeof me?.user?.created_at === "string" ? me.user.created_at : null;
      if (joined) {
        evs.push({ date: joined, kind: "joined", title: "Joined Everleap", detail: "Where your story begins." });
      }

      evs.sort((a, b) => b.date.localeCompare(a.date));
      setEvents(evs);
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

      <SectionCard tone="hero" backdrop={<ConstellationAnchor seed="journey" accent={ACCENT} />}>
        <div className="max-w-2xl">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
            <Sparkles className="h-3 w-3" /> Journey
          </div>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-white sm:text-[27px]">Your story so far</h1>
          <p className="mt-2 text-[14px] leading-[1.6] text-white/70">
            The path you’ve been walking — where you started, and everything you’ve actually tried since.
          </p>
        </div>
      </SectionCard>

      <div className="mt-3">
        <SectionCard tone="neutral">
          {events === null ? (
            <div className="animate-pulse space-y-4 py-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/10" />
                  <div className="flex-1 space-y-1.5 pt-1">
                    <div className="h-3.5 w-1/3 rounded bg-white/[0.08]" />
                    <div className="h-3 w-2/3 rounded bg-white/[0.05]" />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-start gap-3 py-2">
              <h2 className="text-[16px] font-semibold text-white">Your journey starts now</h2>
              <p className="max-w-md text-[13.5px] leading-[1.6] text-white/64">
                As you explore and try things, they’ll gather here into a story you can look back on.
              </p>
              <Link
                href="/main/explore"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/14 bg-white/[0.08] px-4 py-2 text-[13.5px] font-semibold text-white transition hover:bg-white/[0.12]"
              >
                <Compass className="h-4 w-4" /> Start exploring
              </Link>
            </div>
          ) : (
            <ol className="relative">
              {events.map((e, i) => {
                const Icon = KIND_ICON[e.kind];
                const last = i === events.length - 1;
                return (
                  <li key={`${e.kind}-${e.date}-${i}`} className="relative flex gap-3.5 pb-5 last:pb-0">
                    {!last ? (
                      <span
                        className="absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px"
                        style={{ background: `linear-gradient(${rgba(0.35)}, ${rgba(0.06)})` }}
                      />
                    ) : null}
                    <span
                      className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      style={{ background: rgba(0.16), border: `1px solid ${rgba(0.45)}`, color: "#fff" }}
                    >
                      <Icon className="h-[15px] w-[15px]" />
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="text-[10.5px] uppercase tracking-[0.12em] text-white/40">{longDate(e.date)}</div>
                      <div className="mt-0.5 text-[15px] font-semibold tracking-[-0.01em] text-white">{e.title}</div>
                      {e.detail ? <div className="mt-0.5 text-[13px] leading-[1.5] text-white/58">{e.detail}</div> : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
