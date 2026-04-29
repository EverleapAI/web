"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { startAuthentication } from "@simplewebauthn/browser";
import { sanitizeReturnTo } from "@/regauth/lib/returnTo";

export default function RegAuthEntryPage(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawReturnTo = sanitizeReturnTo(searchParams?.get("returnTo"));

  const returnTo =
    rawReturnTo && !rawReturnTo.startsWith("/regauth")
      ? rawReturnTo
      : "/main";

  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [passkeyLoading, setPasskeyLoading] = React.useState(false);
  const [showPasskey, setShowPasskey] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      setShowPasskey(
        window.localStorage.getItem("everleap.passkey.enabled") === "true"
      );
    } catch {}

    let cancelled = false;

    async function checkSession() {
      try {
        const res = await fetch("/api/regauth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await res.json().catch(() => null);

        if (!cancelled && data?.authed) {
          router.replace(returnTo);
        }
      } catch {}
    }

    void checkSession();

    return () => {
      cancelled = true;
    };
  }, [router, returnTo]);

  async function handlePasskeyLogin() {
    if (passkeyLoading) return;

    setPasskeyLoading(true);
    setError(null);

    try {
      const startRes = await fetch("/api/regauth/passkey/login/options", {
        method: "POST",
      });

      const startData = await startRes.json().catch(() => null);

      if (!startRes.ok || !startData?.options) {
        setError(startData?.error || "Could not start device sign-in.");
        return;
      }

      const credential = await startAuthentication(startData.options);

      const verifyRes = await fetch("/api/regauth/passkey/login/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credential),
      });

      if (!verifyRes.ok) {
        setError("Device sign-in failed.");
        return;
      }

      window.location.href = returnTo;
    } catch {
      setError("Device sign-in cancelled or failed.");
    } finally {
      setPasskeyLoading(false);
    }
  }

  async function onContinue() {
    const trimmed = email.trim().toLowerCase();

    if (!trimmed || !trimmed.includes("@")) {
      setError("Enter a valid email.");
      return;
    }

    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/regauth/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          identifier: trimmed,
          returnTo,
        }),
      });

      if (!res.ok) {
        setError("Couldn’t send code. Try again.");
        setSubmitting(false);
        return;
      }

      try {
        window.sessionStorage.setItem("regauth_pending_email", trimmed);
      } catch {}

      router.push(`/regauth/verify?returnTo=${encodeURIComponent(returnTo)}`);
    } catch {
      setError("Something went wrong. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 text-white">
      <div className="w-full max-w-md space-y-5 text-center">
        {showPasskey ? (
          <>
            <button
              type="button"
              onClick={() => void handlePasskeyLogin()}
              disabled={passkeyLoading}
              className="h-12 w-full rounded-xl bg-white font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {passkeyLoading ? "Checking…" : "Continue with this device"}
            </button>

            <div className="text-xs text-white/40">or</div>
          </>
        ) : null}

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {showPasskey ? "Use your email instead" : "Let’s get you in."}
          </h1>
        </div>

        <div className="space-y-3">
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void onContinue();
              }
            }}
            placeholder="you@example.com"
            inputMode="email"
            autoComplete="email"
            className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/25 focus:bg-white/15 focus:ring-2 focus:ring-white/20"
          />

          <button
            type="button"
            onClick={() => void onContinue()}
            disabled={submitting}
            className="h-12 w-full rounded-xl bg-white font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Sending…" : "Send me a code"}
          </button>
        </div>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}
      </div>
    </main>
  );
}