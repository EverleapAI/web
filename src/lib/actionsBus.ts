// src/lib/actionsBus.ts
//
// A tiny window-event bus so "I added something to do" is felt across the app:
// saving an action anywhere fires ACTION_ADDED (→ a toast) and both events
// refresh the Actions nav count badge. Decoupled — callers just emit; the
// ToastHost + nav badge listen. Client-only (guards window).

export const ACTION_ADDED = "everleap:action-added";
export const ACTIONS_CHANGED = "everleap:actions-changed";

/** A doable was committed to the user's Actions list (shows a toast + bumps the badge). */
export function emitActionAdded(title?: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ACTION_ADDED, { detail: { title } }));
}

/** An action's status changed (done / removed / etc.) — refresh the badge count. */
export function emitActionsChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ACTIONS_CHANGED));
}
