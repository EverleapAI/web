// src/app/(app)/main/components/InProgressMissionNudge.tsx
//
// A "pick up where you left off" card on Today — surfaces an in-progress mission
// (a started action with steps) right where the user lands, so a mission they
// began doesn't get forgotten in the Actions list. Renders nothing when there's
// no in-progress mission. Refreshes on the shared actionsBus events.

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { SectionCard } from "./ui/SectionCard";
import { ConstellationAnchor } from "./ui/ConstellationAnchor";
import { ACTION_ADDED, ACTIONS_CHANGED } from "@/lib/actionsBus";

type Step = { text: string; done: boolean };
type Action = {
  id: string;
  title: string;
  lane: string | null;
  status: string;
  mission?: { steps?: Step[] } | null;
};

export function InProgressMissionNudge() {
  const [mission, setMission] = React.useState<Action | null>(null);

  React.useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch("/api/guidance/actions?status=doing", { credentials: "include" });
        if (!r.ok) return;
        const d = await r.json();
        if (!alive || !d?.ok || !Array.isArray(d.actions)) return;
        const withSteps = (d.actions as Action[]).find((a) => (a.mission?.steps?.length ?? 0) > 0) ?? null;
        setMission(withSteps);
      } catch {
        /* leave as-is */
      }
    };
    load();
    window.addEventListener(ACTIONS_CHANGED, load);
    window.addEventListener(ACTION_ADDED, load);
    return () => {
      alive = false;
      window.removeEventListener(ACTIONS_CHANGED, load);
      window.removeEventListener(ACTION_ADDED, load);
    };
  }, []);

  if (!mission) return null;

  const steps = mission.mission?.steps ?? [];
  const done = steps.filter((s) => s.done).length;
  const pct = steps.length ? Math.round((done / steps.length) * 100) : 0;
  const accent = { r: 92, g: 180, b: 255 };

  return (
    <Link href={`/main/actions/${mission.id}`} className="mt-4 block">
      <SectionCard tone="hero" backdrop={<ConstellationAnchor seed={`nudge:${mission.id}`} accent={accent} />}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-1.5 text-micro font-semibold uppercase tracking-eyebrow text-cyan-200/80">
              <Sparkles className="h-3 w-3" /> Pick up where you left off
            </div>
            <div className="truncate text-body font-semibold text-white">{mission.title}</div>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1 w-28 overflow-hidden rounded-full bg-white/[0.1]">
                <div className="h-full rounded-full bg-emerald-400/70" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-micro text-white/55">
                {done}/{steps.length} steps
              </span>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-white/50" />
        </div>
      </SectionCard>
    </Link>
  );
}

export default InProgressMissionNudge;
