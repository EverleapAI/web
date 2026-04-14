// src/app/main/domain/actions.ts

export type ActionStatus = "planned" | "started" | "done";

export type ActionLog =
  | { id: string; type: "system"; text: string; createdAt: number }
  | { id: string; type: "note"; text: string; createdAt: number };

export type ActionItem = {
  id: string;

  title: string;
  goal: string;
  steps?: string[];

  sourcePageId: string;
  createdAt: number;
  updatedAt: number;

  status: ActionStatus;

  logs: ActionLog[]; // ✅ NEW

  minutesSpent?: number;
  felt?: "energized" | "neutral" | "drained";
};

const ACTIONS_STORAGE_KEY = "everleap.actions.v2";

type StoredActionsPayload = {
  v: 2;
  items: ActionItem[];
};

function now() {
  return Date.now();
}

function uid() {
  return `log_${Math.random().toString(36).slice(2)}`;
}

function isBrowser() {
  return typeof window !== "undefined" && window.localStorage;
}

function safeJsonParse<T>(raw: string | null): T | null {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function normalize(items: ActionItem[]) {
  return [...items].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function loadActions(opts?: { useLocal?: boolean }): ActionItem[] {
  if (!opts?.useLocal || !isBrowser()) return [];

  const parsed = safeJsonParse<StoredActionsPayload>(
    window.localStorage.getItem(ACTIONS_STORAGE_KEY)
  );

  if (!parsed || parsed.v !== 2) return [];

  return normalize(parsed.items);
}

export function saveActions(items: ActionItem[], opts?: { useLocal?: boolean }) {
  if (!opts?.useLocal || !isBrowser()) return;

  window.localStorage.setItem(
    ACTIONS_STORAGE_KEY,
    JSON.stringify({ v: 2, items: normalize(items).slice(0, 100) })
  );
}

export function createAction(input: {
  id?: string;
  title: string;
  goal: string;
  steps?: string[];
  sourcePageId: string;
}): ActionItem {
  const t = now();
  return {
    id: input.id ?? `act_${t}`,
    title: input.title,
    goal: input.goal,
    steps: input.steps,
    sourcePageId: input.sourcePageId,
    createdAt: t,
    updatedAt: t,
    status: "planned",
    logs: [], // ✅
  };
}

export function upsertAction(items: ActionItem[], next: ActionItem) {
  const idx = items.findIndex((x) => x.id === next.id);
  if (idx === -1) return normalize([next, ...items]);

  const copy = [...items];
  copy[idx] = { ...next, updatedAt: now() };
  return normalize(copy);
}

/* ================================
   LOGGING
================================ */

export function addLog(
  items: ActionItem[],
  id: string,
  log: Omit<ActionLog, "id" | "createdAt">
): ActionItem[] {
  const idx = items.findIndex((x) => x.id === id);
  if (idx === -1) return items;

  const entry: ActionLog = {
    ...log,
    id: uid(),
    createdAt: now(),
  };

  const copy = [...items];
  copy[idx] = {
    ...copy[idx],
    logs: [entry, ...(copy[idx].logs ?? [])], // newest first
    updatedAt: now(),
  };

  return normalize(copy);
}

/* ================================
   STATUS + SYSTEM LOGS
================================ */

export function startAction(items: ActionItem[], id: string) {
  let next = setStatus(items, id, "started");
  return addLog(next, id, { type: "system", text: "Started" });
}

export function markDone(items: ActionItem[], id: string) {
  let next = setStatus(items, id, "done");
  return addLog(next, id, { type: "system", text: "Marked done" });
}

export function reopenAction(items: ActionItem[], id: string) {
  let next = setStatus(items, id, "started");
  return addLog(next, id, { type: "system", text: "Reopened" });
}

function setStatus(items: ActionItem[], id: string, status: ActionStatus) {
  const idx = items.findIndex((x) => x.id === id);
  if (idx === -1) return items;

  const copy = [...items];
  copy[idx] = { ...copy[idx], status, updatedAt: now() };
  return normalize(copy);
}

export function addNote(items: ActionItem[], id: string, text: string) {
  return addLog(items, id, { type: "note", text });
}

export function findLatestActionForPage(
  items: ActionItem[],
  pageId: string
) {
  return normalize(items).find((x) => x.sourcePageId === pageId) ?? null;
}