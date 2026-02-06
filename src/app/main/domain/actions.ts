// src/app/main/domain/actions.ts

export type ActionStatus = "planned" | "started" | "done";

export type ActionProof =
  | { kind: "text"; text: string }
  | { kind: "link"; url: string; label?: string }
  | { kind: "photo"; dataUrl: string; caption?: string };

export type ActionItem = {
  id: string;

  // Display
  title: string;
  goal: string; // explicit, measurable-ish
  steps?: string[];

  // Meta
  sourcePageId: string; // e.g. "insights.summary"
  createdAt: number;
  updatedAt: number;

  // State
  status: ActionStatus;

  // Optional “evidence”
  proof?: ActionProof;

  // Optional check-in fields (useful for badges later)
  minutesSpent?: number; // rough
  felt?: "energized" | "neutral" | "drained";
};

const ACTIONS_STORAGE_KEY = "everleap.actions.v1";

type StoredActionsPayload = {
  v: 1;
  items: ActionItem[];
};

function now() {
  return Date.now();
}

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function normalizeItems(items: ActionItem[]): ActionItem[] {
  // Sort newest-updated first; cap later in save.
  return [...items].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
}

export function loadActions(opts?: { useLocal?: boolean }): ActionItem[] {
  if (!opts?.useLocal) return [];
  if (!isBrowser()) return [];

  const parsed = safeJsonParse<StoredActionsPayload>(
    window.localStorage.getItem(ACTIONS_STORAGE_KEY)
  );

  if (!parsed || parsed.v !== 1 || !Array.isArray(parsed.items)) return [];

  // Light validation + defaults
  const cleaned: ActionItem[] = parsed.items
    .filter((x): x is ActionItem => !!x && typeof x === "object")
    .map((x) => {
      const createdAt = Number.isFinite(x.createdAt) ? x.createdAt : now();
      const updatedAt = Number.isFinite(x.updatedAt) ? x.updatedAt : createdAt;

      const status: ActionStatus =
        x.status === "done" || x.status === "started" || x.status === "planned"
          ? x.status
          : "planned";

      return {
        id: String(x.id ?? `act_${createdAt}`),
        title: String(x.title ?? "Action"),
        goal: String(x.goal ?? ""),
        steps: Array.isArray(x.steps) ? x.steps.map(String) : undefined,
        sourcePageId: String(x.sourcePageId ?? "unknown"),
        createdAt,
        updatedAt,
        status,
        proof: x.proof as ActionProof | undefined,
        minutesSpent: Number.isFinite(x.minutesSpent) ? x.minutesSpent : undefined,
        felt:
          x.felt === "energized" || x.felt === "neutral" || x.felt === "drained"
            ? x.felt
            : undefined,
      };
    });

  return normalizeItems(cleaned);
}

export function saveActions(items: ActionItem[], opts?: { useLocal?: boolean }) {
  if (!opts?.useLocal) return;
  if (!isBrowser()) return;

  const payload: StoredActionsPayload = {
    v: 1,
    items: normalizeItems(items).slice(0, 100),
  };

  window.localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(payload));
}

/**
 * Upsert by id (most common). Returns the updated list.
 */
export function upsertAction(
  items: ActionItem[],
  next: ActionItem,
  opts?: { touchUpdatedAt?: boolean }
): ActionItem[] {
  const touch = opts?.touchUpdatedAt ?? true;
  const updated: ActionItem = {
    ...next,
    updatedAt: touch ? now() : next.updatedAt ?? now(),
  };

  const idx = items.findIndex((x) => x.id === updated.id);
  if (idx === -1) return normalizeItems([updated, ...items]);

  const copy = [...items];
  copy[idx] = { ...copy[idx], ...updated };
  return normalizeItems(copy);
}

/**
 * Convenience: create a new ActionItem with sane defaults.
 */
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
  };
}

export function setActionStatus(
  items: ActionItem[],
  id: string,
  status: ActionStatus
): ActionItem[] {
  const idx = items.findIndex((x) => x.id === id);
  if (idx === -1) return items;

  const copy = [...items];
  copy[idx] = { ...copy[idx], status, updatedAt: now() };
  return normalizeItems(copy);
}

export function attachActionProof(
  items: ActionItem[],
  id: string,
  proof: ActionProof
): ActionItem[] {
  const idx = items.findIndex((x) => x.id === id);
  if (idx === -1) return items;

  const copy = [...items];
  copy[idx] = { ...copy[idx], proof, updatedAt: now() };
  return normalizeItems(copy);
}

/**
 * Finds the most recently updated Action for a given page.
 */
export function findLatestActionForPage(
  items: ActionItem[],
  pageId: string
): ActionItem | null {
  const match = normalizeItems(items).find((a) => a.sourcePageId === pageId);
  return match ?? null;
}
