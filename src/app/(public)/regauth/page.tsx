"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sanitizeReturnTo } from "@/regauth/lib/returnTo";
import RegAuthVisual from "./components/RegAuthVisual";

export default function RegAuthEntryPage(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawReturnTo = sanitizeReturnTo(searchParams?.get("returnTo"));

  const returnTo =
    rawReturnTo && !rawReturnTo.startsWith("/regauth")
      ? rawReturnTo
      : "/main";

  const [identifier, setIdentifier] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onContinue() {
    const trimmed = identifier.trim();

    if (!trimmed) {
      setError("Enter your email or phone number.");
      return;
    }

    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/regauth/start", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          identifier: trimmed,
          returnTo,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || "Couldn’t send code. Try again.");
        setSubmitting(false);
        return;
      }

      try {
        window.sessionStorage.setItem(
          "regauth_pending_identifier",
          trimmed
        );
      } catch {}

      router.push(
        `/regauth/verify?returnTo=${encodeURIComponent(returnTo)}`
      );
    } catch {
      setError("Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen justify-center px-4 pb-8 pt-10 text-white">
      <div className="w-full max-w-md space-y-4 text-center">
        <RegAuthVisual kind="code" />

        <div className="space-y-2">
          <h1 className="text-[2rem] font-semibold tracking-[-0.05em] text-white">
            You’re ready to join Everleap!
          </h1>

          <p className="text-[15px] leading-6 text-white/64">
            Enter your email or phone number and I’ll send you a sign-in code.
          </p>
        </div>

        <div className="space-y-3">
          <input
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);

              if (error) {
                setError(null);
              }
            }}
            placeholder="Email or phone number"
            autoComplete="username"
            className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/25 focus:bg-white/[0.09] focus:ring-2 focus:ring-white/20"
          />

          <button
            type="button"
            onClick={() => void onContinue()}
            disabled={submitting}
            className="h-11 w-full rounded-xl bg-white font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Sending…" : "Send me a code"}
          </button>
        </div>

        {error ? (
          <p className="text-sm text-red-300">
            {error}
          </p>
        ) : null}
      </div>
    </main>
  );
}