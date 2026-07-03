"use client";

import * as React from "react";

export type GeneratedTinyTask = {
  id: string;
  question: string;
  options: string[];
  signal_key: string;
  selected_option: string | null;
  selected_option_index: number | null;
};

type GeneratedResponse<TPayload> = {
  ok?: boolean;
  payload?: TPayload | null;
  tiny_tasks?: GeneratedTinyTask[];
};

// The backend generates these off a background queue drained once a
// minute, so a user can land here just after answering, before the
// payload exists yet. Poll for a bit so it can swap in without a
// reload — callers should keep a local fallback for the wait in the
// meantime.
const POLL_INTERVAL_MS = 5000;
const MAX_POLLS = 12; // ~60s, matching the generation timer's cadence

export function useGeneratedInsights<TPayload>(endpoint: string) {
  const [payload, setPayload] = React.useState<TPayload | null>(null);
  const [tinyTasks, setTinyTasks] = React.useState<GeneratedTinyTask[]>([]);
  const [fetchDone, setFetchDone] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    async function fetchPayload(): Promise<{
      payload: TPayload;
      tinyTasks: GeneratedTinyTask[];
    } | null> {
      const res = await fetch(endpoint);
      const data = (await res.json().catch(() => null)) as
        | GeneratedResponse<TPayload>
        | null;

      return res.ok && data?.ok && data.payload
        ? { payload: data.payload, tinyTasks: data.tiny_tasks ?? [] }
        : null;
    }

    async function loadGenerated(pollsRemaining: number) {
      try {
        const result = await fetchPayload();

        if (cancelled) return;

        if (result) {
          setPayload(result.payload);
          setTinyTasks(result.tinyTasks);
          setFetchDone(true);
          return;
        }

        setFetchDone(true);

        if (pollsRemaining > 0) {
          timeoutId = setTimeout(
            () => loadGenerated(pollsRemaining - 1),
            POLL_INTERVAL_MS
          );
        }
      } catch (error) {
        console.error(`Failed to load generated insights from ${endpoint}`, error);
        if (!cancelled) setFetchDone(true);
      }
    }

    loadGenerated(MAX_POLLS);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [endpoint]);

  return { payload, tinyTasks, fetchDone };
}
