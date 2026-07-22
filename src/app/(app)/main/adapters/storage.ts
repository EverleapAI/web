// src/app/main/adapters/storage.ts

/* =============================================================================
   Storage adapter (safe + centralized)
   - No domain logic here (no signals/retort generation)
   - Just: keys, safe read/write helpers, and small caches used by /main
   ============================================================================= */

import type {
  OnboardingSnapshot,
  SessionTinyState,
  RetortViewModel,
} from "../domain/types";

/* =============================================================================
   Keys (centralized)
   ============================================================================= */

export const ONBOARDING_STORAGE_KEY = "everleapOnboarding_v4_convo_min";

// Main page caches
export const RETORT_CACHE_KEY = "everleap.main.retort.cache.v1"; // { fp, paragraphs, updatedAt }
export const QUOTE_SESSION_KEY = "everleap.main.quote.v1";

// Zip state label cache (session)
export const ZIP_PLACE_SESSION_PREFIX = "everleap.zipPlace.v1:";

// Tiny task state (session) + persisted “tiny” sources
export const TINY_TASKS_SESSION_KEY = "everleap.main.tiny.session.v1";

/* =============================================================================
   Safe JSON helpers
   ============================================================================= */

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeJsonStringify(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function hasWindow() {
  return typeof window !== "undefined";
}

function safeGetLocal(key: string): string | null {
  if (!hasWindow()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetLocal(key: string, value: string) {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

function safeGetSession(key: string): string | null {
  if (!hasWindow()) return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetSession(key: string, value: string) {
  if (!hasWindow()) return;
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

/* =============================================================================
   Read core data used by /main
   ============================================================================= */

export function readOnboardingSnapshot(): OnboardingSnapshot | null {
  return safeJsonParse<OnboardingSnapshot>(safeGetLocal(ONBOARDING_STORAGE_KEY));
}


/* =============================================================================
   Zip cache (state label) - session
   ============================================================================= */

export function zipCacheKey(zip5: string) {
  return `${ZIP_PLACE_SESSION_PREFIX}${zip5}`;
}

export function readCachedHomeStateLabel(zip5: string): string | null {
  if (!zip5) return null;
  return safeGetSession(zipCacheKey(zip5));
}

export function writeCachedHomeStateLabel(zip5: string, stateLabel: string) {
  if (!zip5 || !stateLabel) return;
  safeSetSession(zipCacheKey(zip5), stateLabel);
}

/* =============================================================================
   Tiny tasks state (session) + persisted sources
   ============================================================================= */

export function readSessionTinyState(): SessionTinyState {
  const parsed = safeJsonParse<SessionTinyState>(safeGetSession(TINY_TASKS_SESSION_KEY));
  if (!parsed) return { shownIds: [], completedIds: [] };

  const shownIds = Array.isArray(parsed.shownIds) ? parsed.shownIds : [];
  const completedIds = Array.isArray(parsed.completedIds) ? parsed.completedIds : [];

  // sanitize to known ids
  const valid = (v: unknown): v is SessionTinyState["shownIds"][number] =>
    v === "weekly_focus" || v === "curiosity_sprint";

  return {
    shownIds: shownIds.filter(valid),
    completedIds: completedIds.filter(valid),
  };
}

export function writeSessionTinyState(next: SessionTinyState) {
  safeSetSession(TINY_TASKS_SESSION_KEY, safeJsonStringify(next));
}



/* =============================================================================
   Retort cache (fingerprint-based)
   ============================================================================= */

type RetortCache = {
  fp: string;
  paragraphs: string[];
  updatedAt: number;
};

export function readRetortCache(): RetortCache | null {
  return safeJsonParse<RetortCache>(safeGetLocal(RETORT_CACHE_KEY));
}

export function writeRetortCache(fp: string, paragraphs: string[]) {
  const payload: RetortCache = { fp, paragraphs, updatedAt: Date.now() };
  safeSetLocal(RETORT_CACHE_KEY, safeJsonStringify(payload));
}

export function getCachedRetortViewModel(fp: string): RetortViewModel | null {
  const cached = readRetortCache();
  if (!cached || cached.fp !== fp) return null;
  if (!Array.isArray(cached.paragraphs) || cached.paragraphs.length === 0) return null;

  return {
    paragraphs: cached.paragraphs.slice(0, 3),
    key: cached.fp,
  };
}

/* =============================================================================
   Quote (stable per session)
   ============================================================================= */

export type QuoteVM = { text: string; author: string };

export function readSessionQuote(): QuoteVM | null {
  return safeJsonParse<QuoteVM>(safeGetSession(QUOTE_SESSION_KEY));
}

export function writeSessionQuote(quote: QuoteVM) {
  if (!quote?.text || !quote?.author) return;
  safeSetSession(QUOTE_SESSION_KEY, safeJsonStringify(quote));
}