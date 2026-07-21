// apps/web/src/app/(app)/main/explore/_components/CareerReaction.tsx
//
// The feedback row inside each career recommendation card — the Insights
// "Reactions" concept, re-worded for a career. Three pills, each semantic:
//   I'd try this  → green   → reveals the "Try it…" mission button
//   Not for me    → amber   → dismisses the card; the parent slides in the next
//                             ranked career from the queue (a dismissal is a win)
//   Tell me more  → blue    → opens the full career screen
//
// Reuses the shared reaction store (pageKey "explore_work", itemKey = slug) and
// the generic actions endpoint, so a career mission behaves exactly like an
// Insights one: Start (blue) → Continue (amber) → Reflect (green).

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sparkles, X, ArrowRight, Wand2, Loader2, HelpCircle } from "lucide-react";

import { RowTitle, RowMeta } from "@/lib/ui/card";
import { emitActionsChanged } from "@/lib/actionsBus";
import { useCardReaction, type CardReactionValue } from "../../insights/hooks/useCardReaction";

const PAGE_KEY = "explore_work";

type Option = {
  value: CardReactionValue;
  label: string;
  rgb: string;
  Icon: typeof Sparkles;
};

const OPTIONS: Option[] = [
  { value: "energized", label: "I'd try this", rgb: "52, 211, 153", Icon: Sparkles },
  { value: "not_for_me", label: "Not for me", rgb: "245, 176, 90", Icon: X },
  { value: "curious", label: "Tell me more", rgb: "96, 176, 255", Icon: HelpCircle },
];

type ExistingMission = { id: string; status: string };

export function CareerReaction({
  slug,
  title,
  onDismiss,
  missions,
}: {
  slug: string;
  title: string;
  /** Called when the user taps "Not for me" — the parent removes this card and
   *  reveals the next career in the queue. */
  onDismiss: (slug: string) => void;
  /**
   * Every mission on this screen, looked up once by the parent.
   *
   * Each card used to ask the actions endpoint about itself, so a deck of four
   * meant four round trips on a page that already fires nineteen requests. When
   * the parent provides them, this asks for nothing. Left optional so the card
   * still works on its own wherever it is used without a deck around it.
   */
  missions?: Map<string, ExistingMission>;
}) {
  const { reaction, setReaction } = useCardReaction(PAGE_KEY, slug);
  const router = useRouter();
  const [creating, setCreating] = React.useState(false);
  const [mission, setMission] = React.useState<ExistingMission | null>(null);

  const sourceRef = `${PAGE_KEY}:${slug}`;
  const careerHref = `/main/explore/work/${slug}`;

  // Always look up whether a mission already exists for this career: it decides
  // Start vs Continue vs Reflect AND freezes the row — once you've committed to
  // trying a career, you can't then dismiss it out from under the mission.
  React.useEffect(() => {
    // The deck already fetched every mission for this screen.
    if (missions) {
      setMission(missions.get(slug) ?? null);
      return;
    }
    let cancelled = false;
    fetch(`/api/guidance/actions?source_ref=${encodeURIComponent(sourceRef)}`, {
      credentials: "include",
      cache: "no-store",
    })
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
  }, [sourceRef, missions, slug]);

  // Committed to a mission → the reaction row freezes; "I'd try this" reads lit.
  const locked = mission !== null;
  const showMissionButton = reaction === "energized" || locked;

  const returnHere = () =>
    typeof window !== "undefined" ? window.location.pathname + window.location.search : "";

  const withReturn = (id: string) => {
    const returnTo = returnHere();
    return `/main/actions/${id}${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`;
  };

  const startMission = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const res = await fetch("/api/guidance/actions", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sourceType: "explore",
          sourceRef,
          lane: "work",
          title: `Try it: ${title}`,
          description: `Get a first-hand feel for what being a ${title} is really like — find one small, real thing to try this week and notice how it lands.`,
          href: careerHref,
        }),
      });
      const d = await res.json().catch(() => null);
      if (d?.ok && d.action?.id) {
        emitActionsChanged();
        router.push(withReturn(d.action.id));
      } else {
        setCreating(false);
      }
    } catch {
      setCreating(false);
    }
  };

  const onPick = (value: CardReactionValue) => {
    if (locked) return; // committed to a mission — the row is frozen
    if (value === "not_for_me") {
      setReaction("not_for_me");
      onDismiss(slug);
      return;
    }
    if (value === "curious") {
      setReaction(reaction === "curious" ? null : "curious");
      router.push(careerHref);
      return;
    }
    // "I'd try this" — toggle; the Try it button appears below when lit.
    setReaction(reaction === "energized" ? null : "energized");
  };

  // Mission button, colour-coded by state — always names the mission (the career)
  // so the button says WHAT it is, not just "this mission".
  const variant = !mission
    ? { label: `Try it: ${title}`, sub: "Start a mission — a few concrete steps to actually go try it.", rgb: "96, 176, 255", Icon: Wand2 }
    : mission.status === "done"
      ? { label: `Reflect on: ${title}`, sub: "Look back on how trying it went.", rgb: "52, 211, 153", Icon: Sparkles }
      : { label: `Continue: ${title}`, sub: "Pick up the mission you started for this.", rgb: "245, 176, 90", Icon: Wand2 };
  const VariantIcon = variant.Icon;

  return (
    <div className="relative mt-3.5">
      <div className="mb-2 px-0.5 text-meta text-white/45">Does this feel like you?</div>
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map(({ value, label, rgb, Icon }) => {
          // When locked to a mission, "I'd try this" reads lit and the rest dim.
          const on = locked ? value === "energized" : reaction === value;
          const dim = locked && !on;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={on}
              disabled={locked}
              onClick={() => onPick(value)}
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

      {/* "I'd try this" (or an existing mission) → the mission button. */}
      {showMissionButton ? (
        <button
          type="button"
          onClick={mission ? () => router.push(withReturn(mission.id)) : startMission}
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

export default CareerReaction;
