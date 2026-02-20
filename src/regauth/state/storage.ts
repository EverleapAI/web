// src/regauth/state/storage.ts

"use client";

import {
  LOCAL_AUTH_STORAGE_KEY,
  LOCAL_REGAUTH_DRAFT_KEY,
} from "../config";
import type {
  RegAuthStoragePayload,
  RegAuthDraftPayload,
  RegAuthSession,
  RegAuthUser,
} from "../types";

/* =============================================================================
   Safe localStorage helpers
   ============================================================================= */

function readJSON<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJSON<T>(key: string, value: T | null) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // swallow; storage may be full or unavailable
  }
}

/* =============================================================================
   Session storage (UI-first stub)
   ============================================================================= */

const EMPTY_PAYLOAD: RegAuthStoragePayload = {
  schemaVersion: 1,
  session: null,
  user: null,
};

export function getAuthStorage(): RegAuthStoragePayload {
  return (
    readJSON<RegAuthStoragePayload>(LOCAL_AUTH_STORAGE_KEY) ??
    EMPTY_PAYLOAD
  );
}

export function setAuthStorage(payload: RegAuthStoragePayload) {
  writeJSON(LOCAL_AUTH_STORAGE_KEY, payload);
}

export function clearAuthStorage() {
  writeJSON(LOCAL_AUTH_STORAGE_KEY, null);
}

export function getSession(): RegAuthSession | null {
  return getAuthStorage().session;
}

export function getUser(): RegAuthUser | null {
  return getAuthStorage().user;
}

export function setSessionAndUser(session: RegAuthSession, user: RegAuthUser) {
  const payload: RegAuthStoragePayload = {
    schemaVersion: 1,
    session,
    user,
  };
  setAuthStorage(payload);
}

export function clearSession() {
  setAuthStorage({
    schemaVersion: 1,
    session: null,
    user: null,
  });
}

/* =============================================================================
   Draft storage (identifier, resend timers, etc.)
   ============================================================================= */

const EMPTY_DRAFT: RegAuthDraftPayload = {
  schemaVersion: 1,
};

export function getRegAuthDraft(): RegAuthDraftPayload {
  return (
    readJSON<RegAuthDraftPayload>(LOCAL_REGAUTH_DRAFT_KEY) ??
    EMPTY_DRAFT
  );
}

export function setRegAuthDraft(draft: RegAuthDraftPayload) {
  writeJSON(LOCAL_REGAUTH_DRAFT_KEY, draft);
}

export function clearRegAuthDraft() {
  writeJSON(LOCAL_REGAUTH_DRAFT_KEY, null);
}
