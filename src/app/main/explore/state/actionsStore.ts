// src/app/main/explore/state/actionsStore.ts
"use client";

/**
 * Explore › actionsStore
 * Purpose:
 * - A tiny, safe, client-only store for “Add to my Actions”.
 * - Persists to localStorage.
 *
 * Notes:
 * - Keep types broad enough to support multiple Explore lanes.
 * - Backward compatible with previously saved items.
 */

export type ActionKind = "tiny_task" | "opportunity";

/** All supported lanes that may write Actions. */
export type ActionLane =
  | "careers"
  | "education"
  | "travel"
  | "community"
  | "hobbies"
  // legacy / misc buckets kept for backward compatibility
  | "recommendations"
  | "explore";

export type ActionItem = {
  id: string; // stable unique id
  kind: ActionKind;

  // what the user sees
  title: string;
  detail?: string;

  // for grouping / filtering later
  lane?: ActionLane;
  topicId?: string; // e.g. education card id ("learnToCode") or travel card id ("ef-gap-year")
  recId?: string; // e.g. explore.<lane>.<topic>.v1

  // deep link back into the UI if you want
  href?: string;

  // timestamp
  createdAt: string;
};

export type ActionsState = {
  version: number;
  items: ActionItem[];
};

const STORAGE_KEY = "everleap.actions.v1";
const MAX_ITEMS = 200;

let _cache: ActionsState | null = null;

function nowIso(): string {
  return new Date().toISOString();
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function isLane(v: unknown): v is ActionLane {
  return (
    v === "careers" ||
    v === "education" ||
    v === "travel" ||
    v === "community" ||
    v === "hobbies" ||
    v === "recommendations" ||
    v === "explore"
  );
}

function normalizeState(input: unknown): ActionsState {
  const obj = (input ?? {}) as Record<string, unknown>;

  const version =
    typeof obj.version === "number" && Number.isFinite(obj.version)
      ? obj.version
      : 1;

  const itemsRaw = Array.isArray(obj.items) ? obj.items : [];
  const items: ActionItem[] = [];

  for (const it of itemsRaw) {
    const item = (it ?? {}) as Record<string, unknown>;
    const id = typeof item.id === "string" ? item.id : "";
    const kind =
      item.kind === "tiny_task" || item.kind === "opportunity"
        ? (item.kind as ActionKind)
        : null;

    const title = typeof item.title === "string" ? item.title : "";
    if (!id || !kind || !title) continue;

    const detail = typeof item.detail === "string" ? item.detail : undefined;

    const lane = isLane(item.lane) ? (item.lane as ActionLane) : undefined;

    const topicId = typeof item.topicId === "string" ? item.topicId : undefined;
    const recId = typeof item.recId === "string" ? item.recId : undefined;
    const href = typeof item.href === "string" ? item.href : undefined;

    const createdAt =
      typeof item.createdAt === "string" && item.createdAt.trim()
        ? item.createdAt
        : nowIso();

    items.push({
      id,
      kind,
      title,
      detail,
      lane,
      topicId,
      recId,
      href,
      createdAt,
    });
  }

  return { version, items: items.slice(0, MAX_ITEMS) };
}

function loadState(): ActionsState {
  if (typeof window === "undefined") return { version: 1, items: [] };

  if (_cache) return _cache;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = safeParse<ActionsState>(raw);
  _cache = normalizeState(parsed);
  return _cache;
}

function saveState(state: ActionsState) {
  if (typeof window === "undefined") return;
  _cache = state;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors (Safari private mode etc.)
  }
}

/** Subscribe helpers (super lightweight) */
type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  for (const fn of listeners) fn();
}

export function subscribeActionsStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getActionsState(): ActionsState {
  return loadState();
}

export function hasAction(id: string): boolean {
  const state = loadState();
  return state.items.some((x) => x.id === id);
}

export function addAction(item: Omit<ActionItem, "createdAt">): ActionItem {
  const state = loadState();

  // Already exists => return existing
  const existing = state.items.find((x) => x.id === item.id);
  if (existing) return existing;

  const next: ActionItem = {
    ...item,
    createdAt: nowIso(),
  };

  const nextItems = [next, ...state.items].slice(0, MAX_ITEMS);
  const nextState: ActionsState = { version: state.version, items: nextItems };

  saveState(nextState);
  emit();
  return next;
}

export function removeAction(id: string): void {
  const state = loadState();
  const nextItems = state.items.filter((x) => x.id !== id);
  if (nextItems.length === state.items.length) return;

  saveState({ version: state.version, items: nextItems });
  emit();
}

export function clearActions(): void {
  saveState({ version: 1, items: [] });
  emit();
}

/**
 * Convenience builders (optional)
 */
export function makeTinyTaskActionId(params: {
  lane: Exclude<ActionLane, "explore">;
  topicId: string;
}): string {
  return `action.${params.lane}.tiny.${params.topicId}`;
}

export function makeOpportunityActionId(params: {
  lane: "education" | "travel" | "community" | "hobbies" | "careers";
  topicId: string;
  name: string;
}): string {
  const safe = params.name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .slice(0, 60);
  return `action.${params.lane}.opp.${params.topicId}.${safe}`;
}
