// src/lib/actionsBus.ts
//
// A tiny window-event bus so "I added something to do" is felt across the app:
// saving an action anywhere fires ACTION_ADDED (→ a toast) and both events
// refresh the Actions nav count badge. Decoupled — callers just emit; the
// ToastHost + nav badge listen. Client-only (guards window).

export const ACTION_ADDED = "everleap:action-added";
export const ACTIONS_CHANGED = "everleap:actions-changed";
export const CELEBRATE = "everleap:celebrate";
export const OPEN_ACHIEVEMENTS = "everleap:open-achievements";
export const BADGE_EARNED = "everleap:badge-earned";

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

/** Fire a celebratory constellation burst from a screen point (viewport coords). */
export function emitCelebrate(x: number, y: number): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CELEBRATE, { detail: { x, y } }));
}

/**
 * Open the global Achievements modal (from the footer, a progress rail, anywhere).
 *
 * Awards is one collection however you got here. It used to open scoped to the
 * screen you came from, which made the same badge move around and read as several
 * different sets — so it takes no surface, and there is nothing to pass.
 */
export function emitOpenAchievements(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_ACHIEVEMENTS));
}

export type BadgeSurface = "today" | "insights" | "explore" | "actions";

export type BadgeTier = "nothing" | "bronze" | "silver" | "gold";
export type EarnedBadge = {
  slug: string;
  name: string;
  glyph?: string;
  accent?: string;
  tier?: BadgeTier;
};

/** A badge was just unlocked — fires the earn toast + celebration. */
export function emitBadgeEarned(badge: EarnedBadge): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(BADGE_EARNED, { detail: badge }));
}
