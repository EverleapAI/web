// src/app/(app)/main/components/ActionsFeedback.tsx
//
// The visible feedback that makes "give people things to DO" land:
//  - useActionsCount(): live count of active actions for the nav badge, kept in
//    sync via the actionsBus events (no prop-drilling).
//  - ToastHost: a transient confirmation when something is added to Actions.

"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { ACTION_ADDED, ACTIONS_CHANGED } from "@/lib/actionsBus";

type ActionLike = { status?: string };

export function useActionsCount(): number {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch("/api/guidance/actions", { credentials: "include" });
        if (!r.ok) return;
        const d = await r.json();
        if (!alive || !d?.ok || !Array.isArray(d.actions)) return;
        setCount(
          (d.actions as ActionLike[]).filter((a) => a.status === "saved" || a.status === "doing").length
        );
      } catch {
        /* leave the last known count */
      }
    };
    load();
    window.addEventListener(ACTION_ADDED, load);
    window.addEventListener(ACTIONS_CHANGED, load);
    return () => {
      alive = false;
      window.removeEventListener(ACTION_ADDED, load);
      window.removeEventListener(ACTIONS_CHANGED, load);
    };
  }, []);

  return count;
}

type Toast = { id: number; text: string };

export function ToastHost() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  React.useEffect(() => {
    const onAdd = (e: Event) => {
      const title = (e as CustomEvent).detail?.title as string | undefined;
      const id = Date.now() + Math.random();
      const text = title ? `Added “${title}” to your Actions` : "Added to your Actions";
      setToasts((t) => [...t, { id, text }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
    };
    window.addEventListener(ACTION_ADDED, onAdd);
    return () => window.removeEventListener(ACTION_ADDED, onAdd);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[60] flex flex-col items-center gap-2 px-4"
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 96px)" }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex max-w-[92vw] items-center gap-2 rounded-full border border-emerald-400/30 bg-[#0c1226]/95 px-4 py-2.5 text-[13.5px] font-medium text-white shadow-[0_16px_44px_rgba(3,7,20,0.6)] backdrop-blur-xl"
          style={{ animation: "elToastIn 220ms ease-out" }}
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          <span className="truncate">{t.text}</span>
        </div>
      ))}
      <style>{`@keyframes elToastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

export default ToastHost;
