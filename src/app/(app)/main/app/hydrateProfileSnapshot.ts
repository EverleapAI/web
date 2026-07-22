// src/app/(app)/main/app/hydrateProfileSnapshot.ts
//
// Refreshes the local onboarding snapshot from the DB (the source of truth) so
// any in-app screen shows the logged-in user's real name + signals even when
// localStorage is empty (logout / new device / cleared storage). Call this
// before a screen reads the snapshot to build its view model.

"use client";

const ONBOARDING_SNAPSHOT_KEY = "everleapOnboarding_v4_convo_min";

export type ServerProfile = {
  name?: string | null;
  zip?: string | null;
  situation?: string | null;
  certainty?: string | null;
  certaintyIdea?: string | null;
  postPlans?: string[];
  activities?: string[];
  motivations?: string[];
  strengths?: string[];
  skills?: string[];
  answers?: Record<string, unknown>;
};

/**
 * Fetch guidance/profile and merge it into the local snapshot (server wins for
 * fields it has; existing local fields are preserved). Never writes an email
 * prefix as a name. No-ops safely if unauthenticated / offline.
 *
 * Returns the server profile so a caller can build a view model straight from
 * it rather than reading the snapshot blob back out of localStorage. Returns
 * null when the server had nothing to say — callers should treat that as
 * "not known yet", never as "zero".
 */
export async function hydrateProfileSnapshotFromServer(): Promise<ServerProfile | null> {
  if (typeof window === "undefined") return null;
  try {
    let serverProfile: ServerProfile | null = null;
    try {
      const res = await fetch("/api/guidance/profile", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json?.ok && json.profile) serverProfile = json.profile as ServerProfile;
      }
    } catch {
      return null;
    }
    if (!serverProfile) return null;

    const existingRaw = window.localStorage.getItem(ONBOARDING_SNAPSHOT_KEY);
    const merged: Record<string, unknown> = existingRaw ? JSON.parse(existingRaw) || {} : {};

    const put = (key: string, value: unknown) => {
      if (value != null && value !== "" && !(Array.isArray(value) && value.length === 0)) {
        merged[key] = value;
      }
    };
    put("name", serverProfile.name);
    put("zip_code", serverProfile.zip);
    put("situation", serverProfile.situation);
    put("certainty", serverProfile.certainty);
    put("certaintyIdea", serverProfile.certaintyIdea);
    put("postPlans", serverProfile.postPlans);
    put("activities", serverProfile.activities);
    put("motivations", serverProfile.motivations);
    put("strengths", serverProfile.strengths);
    put("skills", serverProfile.skills);
    put("answers", serverProfile.answers);

    window.localStorage.setItem(ONBOARDING_SNAPSHOT_KEY, JSON.stringify(merged));
    return serverProfile;
  } catch {
    // ignore — screen falls back to whatever is already local
    return null;
  }
}
