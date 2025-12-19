// src/lib/everleapOnboardingStorage.ts

export const ONBOARDING_KEY = "everleapOnboarding_v1";

export type EverleapOnboarding = {
  name?: string;
  zipCode?: string;
  // keep it open so older/newer fields don't break
  [key: string]: unknown;
};

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function readOnboarding(): EverleapOnboarding {
  if (typeof window === "undefined") return {};
  const parsed = safeParse<EverleapOnboarding>(window.localStorage.getItem(ONBOARDING_KEY));
  return parsed && typeof parsed === "object" ? parsed : {};
}

export function writeOnboarding(next: EverleapOnboarding) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ONBOARDING_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export function patchOnboarding(patch: Partial<EverleapOnboarding>) {
  const current = readOnboarding();
  writeOnboarding({ ...current, ...patch });
}

/* =========================
   Specific helpers
========================= */

export function readNameFromOnboarding(): string {
  const v = (readOnboarding().name ?? "").toString().trim();
  return v;
}

export function readZipFromOnboarding(): string {
  const v = (readOnboarding().zipCode ?? "").toString().trim();
  return v;
}

export function setZipInOnboarding(zipCode: string) {
  patchOnboarding({ zipCode: zipCode.trim() });
}

/** Very light validation: "" allowed (skip), or 5 digits */
export function normalizeZip(input: string): string {
  const z = input.trim();
  if (!z) return "";
  return /^\d{5}$/.test(z) ? z : "";
}
