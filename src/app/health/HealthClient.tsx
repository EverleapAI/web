// apps/web/src/app/health/HealthClient.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

type Goal = { id: number; name: string };

// Normalize base (may or may not already include /api)
const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
const BASE_WITH_API = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;

async function fetchGoals(): Promise<unknown> {
  if (!RAW_BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL not set");
  const url = `${BASE_WITH_API}/everleap-characteristics`;
  const res = await fetch(url, { credentials: "include", cache: "no-store" });
  const text = await res.text().catch(() => "");
  let data: unknown = text;
  try { data = text ? JSON.parse(text) : null; } catch {}
  if (!res.ok) {
    const msg =
      (typeof data === "string" ? data : (data as { message?: string })?.message) ||
      res.statusText ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export default function HealthClient() {
  const { data, error, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["health-goals"],
    queryFn: fetchGoals,
  });

  const okArray =
    Array.isArray(data) && data.every((x) => x && typeof x === "object" && "id" in x && "name" in x);

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
      <div className="w-[min(92vw,720px)] rounded-2xl border bg-white p-6 shadow-sm space-y-4">
        <h1 className="text-xl font-semibold">Health Check</h1>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-slate-700">
            API base: <code className="text-xs">{RAW_BASE || "(not set)"}</code>
          </p>
          <div className="mt-3">
            <Button onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? "Checking…" : "Recheck"}
            </Button>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="font-medium">Result</h2>
          {isLoading ? (
            <p className="mt-2 text-slate-600">Loading…</p>
          ) : error instanceof Error ? (
            <p className="mt-2 text-red-700">Error: {error.message}</p>
          ) : okArray ? (
            <>
              <p className="mt-2 text-emerald-700">
                OK: received {((data as Goal[]) || []).length} goals.
              </p>
              <ul className="mt-2 list-disc pl-5 text-sm">
                {(data as Goal[]).slice(0, 3).map((g) => (
                  <li key={g.id}>
                    #{g.id} — {g.name}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-2 text-amber-700">
              Unexpected payload (not an array). Check CORS and <code>NEXT_PUBLIC_API_BASE_URL</code>.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
