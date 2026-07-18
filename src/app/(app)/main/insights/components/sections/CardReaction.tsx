// apps/web/src/app/(app)/main/insights/components/sections/CardReaction.tsx
//
// The colorful one-tap reaction row on each Insights item card — the Explore
// "Reactions" concept, re-weighted for a compact card. An Insights card is the
// AI's hypothesis about the user, so a reaction is a direct confirm/deny on the
// science. Three pills, each in its own SEMANTIC colour:
//   energized  → green    ("Energizes me")
//   not_for_me → amber    ("Not for me")   — a dismissal is a first-class win
//   curious    → blue     ("Curious")
// One tap, reversible, stored latest-only.
//
// Choosing "Curious" reveals a mission button that mirrors the mission's state,
// colour-coded by state:
//   no mission yet → "Start this mission"     (blue)
//   in progress    → "Continue this mission"  (amber)
//   completed      → "Reflect on this mission" (green) → the reflect view
// Once a mission exists the reactions FREEZE — Curious stays lit but the row is
// no longer clickable, because they've committed to acting on this one.

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  X,
  HelpCircle,
  Wand2,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { RowTitle, RowMeta } from "@/lib/ui/card";
import { emitActionsChanged } from "@/lib/actionsBus";
import { useCardReaction, type CardReactionValue } from "../../hooks/useCardReaction";

type Option = {
  value: CardReactionValue;
  label: string;
  rgb: string;
  Icon: typeof Zap;
};

const OPTIONS: Option[] = [
  { value: "energized", label: "Energizes me", rgb: "52, 211, 153", Icon: Zap },
  { value: "not_for_me", label: "Not for me", rgb: "245, 176, 90", Icon: X },
  { value: "curious", label: "Curious", rgb: "96, 176, 255", Icon: HelpCircle },
];

type ExistingMission = { id: string; status: string };

export function CardReaction({
  pageKey,
  itemKey,
}: {
  pageKey: string;
  itemKey: string;
}) {
  const { reaction, setReaction } = useCardReaction(pageKey, itemKey);
  const router = useRouter();
  const [creating, setCreating] = React.useState(false);
  const [mission, setMission] = React.useState<ExistingMission | null>(null);

  const curious = reaction === "curious";

  // Once they're curious, look up whether a mission already exists for this exact
  // hypothesis — that decides Start vs Continue vs Reflect, and whether the row
  // is frozen.
  React.useEffect(() => {
    if (!curious) {
      setMission(null);
      return;
    }
    let cancelled = false;
    fetch(
      `/api/guidance/actions?source_ref=${encodeURIComponent(`${pageKey}:${itemKey}`)}`,
      { credentials: "include", cache: "no-store" }
    )
      .then((r) => r.json())
      .then((d: { ok?: boolean; actions?: { id: string; status: string }[] }) => {
        if (cancelled) return;
        const a = d?.ok && Array.isArray(d.actions) ? d.actions[0] : null;
        setMission(a ? { id: a.id, status: a.status } : null);
      })
      .catch(() => {
        if (!cancelled) setMission(null);
      });
    return () => {
      cancelled = true;
    };
  }, [curious, pageKey, itemKey]);

  // Committed to a mission → the reaction freezes (Curious stays lit, no toggling).
  const locked = curious && mission !== null;

  const returnHere = () =>
    typeof window !== "undefined"
      ? window.location.pathname + window.location.search
      : "";

  const startMission = async () => {
    if (creating) return;
    setCreating(true);
    const returnTo = returnHere();
    try {
      const res = await fetch("/api/guidance/actions", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sourceType: "insight",
          sourceRef: `${pageKey}:${itemKey}`,
          title: `Explore: ${itemKey}`,
          description: `Get a first-hand feel for “${itemKey}” — find one small, real thing to try this week that leans into it, and notice how it lands.`,
        }),
      });
      const d = await res.json().catch(() => null);
      if (d?.ok && d.action?.id) {
        emitActionsChanged();
        router.push(
          `/main/actions/${d.action.id}${
            returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""
          }`
        );
      } else {
        setCreating(false);
      }
    } catch {
      setCreating(false);
    }
  };

  const openExisting = (id: string) => {
    const returnTo = returnHere();
    router.push(
      `/main/actions/${id}${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`
    );
  };

  // Mission button, colour-coded by state — always names the mission (the item)
  // so the button says WHAT it is, not just "this mission".
  const variant = !mission
    ? {
        label: `Start: ${itemKey}`,
        sub: "Turn it into a mission — a few concrete steps to actually go explore it.",
        rgb: "96, 176, 255",
        Icon: Wand2,
      }
    : mission.status === "done"
      ? {
          label: `Reflect on: ${itemKey}`,
          sub: "Look back on how it went and what you noticed.",
          rgb: "52, 211, 153",
          Icon: Sparkles,
        }
      : {
          label: `Continue: ${itemKey}`,
          sub: "Pick up the mission you started for this.",
          rgb: "245, 176, 90",
          Icon: Wand2,
        };
  const VariantIcon = variant.Icon;

  return (
    <div className="relative mt-3.5">
      <div className="mb-2 px-0.5 text-meta text-white/45">How does this land for you?</div>
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map(({ value, label, rgb, Icon }) => {
          const on = reaction === value;
          const dim = locked && !on;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={on}
              disabled={locked}
              onClick={locked ? undefined : () => setReaction(on ? null : value)}
              className={[
                "flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-2.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25",
                locked ? "cursor-default" : "active:scale-[0.97]",
                dim ? "opacity-40" : "",
              ].join(" ")}
              style={
                on
                  ? {
                      borderColor: `rgba(${rgb}, 0.7)`,
                      background: `linear-gradient(180deg, rgba(${rgb},0.30), rgba(${rgb},0.16))`,
                      boxShadow: `0 0 0 1px rgba(${rgb},0.35), 0 8px 22px rgba(${rgb},0.18)`,
                      color: `rgba(${rgb}, 1)`,
                    }
                  : {
                      borderColor: `rgba(${rgb}, 0.28)`,
                      background: `linear-gradient(180deg, rgba(${rgb},0.12), rgba(${rgb},0.05))`,
                      color: `rgba(${rgb}, 0.95)`,
                    }
              }
            >
              <Icon size={18} strokeWidth={2.1} />
              <span
                className="text-meta font-semibold leading-tight"
                style={{ color: on ? `rgba(${rgb}, 1)` : "rgba(255,255,255,0.82)" }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Curious → the mission button, mirroring the mission's state + colour. */}
      {curious ? (
        <button
          type="button"
          onClick={mission ? () => openExisting(mission.id) : startMission}
          disabled={creating}
          className="mt-2.5 flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition hover:brightness-110 disabled:opacity-70"
          style={{ borderColor: `rgba(${variant.rgb},0.6)`, backgroundColor: `rgba(${variant.rgb},0.12)` }}
        >
          <span className="flex min-w-0 items-center gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `rgba(${variant.rgb},0.22)`, color: "#fff" }}
            >
              <VariantIcon size={18} />
            </span>
            <span className="min-w-0">
              <RowTitle className="block">{variant.label}</RowTitle>
              <RowMeta className="mt-0.5 block">{variant.sub}</RowMeta>
            </span>
          </span>
          {creating ? (
            <Loader2 className="h-5 w-5 shrink-0 animate-spin text-white/85" />
          ) : (
            <ArrowRight className="h-5 w-5 shrink-0 text-white/85" />
          )}
        </button>
      ) : null}
    </div>
  );
}

export default CardReaction;
