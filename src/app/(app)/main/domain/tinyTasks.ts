// src/app/main/domain/tinyTasks.ts

export type TinyTaskStatus = "idle" | "done";

export type TinyTaskKind = "choice" | "text";

export type TinyTaskDefinition =
  | {
      id: string;
      pageId: string; // e.g. "insights.summary"
      title: string; // short label
      prompt: string; // what the user does
      kind: "choice";
      minutes: number; // <= 5
      options: { id: string; label: string }[];
      profileHint?: string; // optional: “helps Everleap understand…”
    }
  | {
      id: string;
      pageId: string;
      title: string;
      prompt: string;
      kind: "text";
      minutes: number; // <= 5
      placeholder?: string;
      maxChars?: number;
      profileHint?: string;
    };

export type TinyTaskResult =
  | {
      v: 1;
      id: string;
      pageId: string;
      completedAt: number;
      kind: "choice";
      choiceId: string;
    }
  | {
      v: 1;
      id: string;
      pageId: string;
      completedAt: number;
      kind: "text";
      text: string;
    };

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

function keyFor(pageId: string) {
  return `everleap.tinytask.${pageId}.v1`;
}

/**
 * Loads the Tiny Task result for a page (page-scoped).
 * Returns null if none or invalid.
 */
export function loadTinyTaskResult(pageId: string, opts?: { useLocal?: boolean }) {
  if (!opts?.useLocal) return null;
  if (!isBrowser()) return null;

  const parsed = safeJsonParse<TinyTaskResult>(window.localStorage.getItem(keyFor(pageId)));
  if (!parsed || parsed.v !== 1) return null;

  if (parsed.pageId !== pageId) return null;

  // light validation
  if (parsed.kind === "choice") {
    if (!parsed.id || !parsed.choiceId || !Number.isFinite(parsed.completedAt)) return null;
    return parsed;
  }
  if (parsed.kind === "text") {
    if (!parsed.id || typeof parsed.text !== "string" || !Number.isFinite(parsed.completedAt))
      return null;
    return parsed;
  }
  return null;
}

/**
 * Saves a Tiny Task result for a page (overwrites existing).
 */
export function saveTinyTaskResult(pageId: string, result: TinyTaskResult, opts?: { useLocal?: boolean }) {
  if (!opts?.useLocal) return;
  if (!isBrowser()) return;

  window.localStorage.setItem(keyFor(pageId), JSON.stringify(result));
}

/**
 * Clears a page’s Tiny Task result.
 */
export function clearTinyTaskResult(pageId: string, opts?: { useLocal?: boolean }) {
  if (!opts?.useLocal) return;
  if (!isBrowser()) return;

  window.localStorage.removeItem(keyFor(pageId));
}

/**
 * Convenience builders
 */
export function makeChoiceResult(input: {
  id: string;
  pageId: string;
  choiceId: string;
}): TinyTaskResult {
  return {
    v: 1,
    id: input.id,
    pageId: input.pageId,
    completedAt: Date.now(),
    kind: "choice",
    choiceId: input.choiceId,
  };
}

export function makeTextResult(input: {
  id: string;
  pageId: string;
  text: string;
}): TinyTaskResult {
  return {
    v: 1,
    id: input.id,
    pageId: input.pageId,
    completedAt: Date.now(),
    kind: "text",
    text: input.text,
  };
}
