"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

export default function AccessPage() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/";

  const [code, setCode] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/access/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, next: nextPath })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Invalid access code.");
        setBusy(false);
        return;
      }

      const data = (await res.json()) as { redirectTo: string };
      window.location.href = data.redirectTo || nextPath;
    } catch {
      setError("Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden text-white">
      {/* Background video */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black" />

        <video
          className="absolute inset-0 h-full w-full object-cover opacity-80 blur-[0.5px]"
          src="/video/background.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />

        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/55 to-black/75" />
        <div className="absolute inset-0 [box-shadow:inset_0_0_160px_rgba(0,0,0,0.75)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/55 p-6 shadow-2xl backdrop-blur-md">
          <div className="mb-6">
            <div className="text-xs tracking-wider text-white/60">
              EVERLEAP PRIVATE ACCESS
            </div>

            <h1 className="mt-2 text-2xl font-semibold">
              Welcome to Everleap
            </h1>

            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 leading-relaxed">
              <p className="font-medium text-white/95">
                Everleap is building a clearer picture of who you are — and where
                that can lead.
              </p>
              <p className="mt-2">
                What you see here is early, evolving, and shared with a small
                group of invited participants.
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block text-sm text-white/70">
              Access code
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-2 w-full rounded-xl bg-black/50 border border-white/20 px-4 py-3 outline-none focus:border-white/40"
                placeholder="Enter access code"
                autoFocus
              />
            </label>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy || !code.trim()}
              className="w-full rounded-xl bg-white text-black py-3 font-medium disabled:opacity-50"
            >
              {busy ? "Unlocking…" : "Enter Everleap"}
            </button>

            <div className="text-xs text-white/45">
              Private alpha · Session access
            </div>
          </form>
        </div>
      </div>

      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          video {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}
