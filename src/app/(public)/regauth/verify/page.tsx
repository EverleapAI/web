"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sanitizeReturnTo } from "@/regauth/lib/returnTo";

function onlyDigits(raw: string): string {
  return (raw ?? "").replace(/\D+/g, "");
}

function joinCode(digits: string[]): string {
  return digits.join("");
}

export default function VerifyPage(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawReturnTo = sanitizeReturnTo(searchParams?.get("returnTo"));

  const returnTo =
    rawReturnTo && !rawReturnTo.startsWith("/regauth") ? rawReturnTo : "/main";

  const [digits, setDigits] = React.useState<string[]>(() =>
    new Array(6).fill("")
  );
  const [pendingEmail, setPendingEmail] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const refs = React.useMemo(
    () => Array.from({ length: 6 }, () => React.createRef<HTMLInputElement>()),
    []
  );

  const lastSubmittedRef = React.useRef<string | null>(null);

  const code = joinCode(digits);
  const isComplete = /^\d{6}$/.test(code);

  React.useEffect(() => {
    try {
      setPendingEmail(window.sessionStorage.getItem("regauth_pending_email"));
    } catch {}

    const t = window.setTimeout(() => refs[0]?.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [refs]);

  function focusIndex(i: number) {
    refs[Math.max(0, Math.min(5, i))]?.current?.focus();
  }

  async function submit(nextCode = code) {
    if (!/^\d{6}$/.test(nextCode) || isSubmitting) return;
    if (lastSubmittedRef.current === nextCode) return;

    setIsSubmitting(true);
    setError(null);
    lastSubmittedRef.current = nextCode;

    try {
      const res = await fetch("/api/regauth/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: nextCode }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || "That code didn’t match. Try again.");
        setIsSubmitting(false);
        setDigits(new Array(6).fill(""));
        lastSubmittedRef.current = null;
        window.setTimeout(() => focusIndex(0), 0);
        return;
      }

      try {
        window.sessionStorage.removeItem("regauth_pending_email");
      } catch {}

      // ✅ UPDATED REDIRECT
      window.location.href = `/main/secure-device?returnTo=${encodeURIComponent(
        returnTo
      )}`;
    } catch {
      setError("Something went wrong.");
      setIsSubmitting(false);
      lastSubmittedRef.current = null;
    }
  }

  React.useEffect(() => {
    if (isComplete) void submit(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete, code]);

  function onChange(i: number, val: string) {
    const clean = onlyDigits(val).slice(0, 6);

    setError(null);
    lastSubmittedRef.current = null;

    const next = [...digits];

    if (clean.length > 1) {
      for (let j = 0; j < clean.length && i + j < 6; j++) {
        next[i + j] = clean[j];
      }
    } else {
      next[i] = clean || "";
    }

    setDigits(next);

    const nextFocus = Math.min(5, i + Math.max(clean.length, 1));
    if (clean && nextFocus <= 5) focusIndex(nextFocus);
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      const next = [...digits];
      next[i - 1] = "";
      setDigits(next);
      lastSubmittedRef.current = null;
      focusIndex(i - 1);
    }
  }

  function useDifferentEmail() {
    try {
      window.sessionStorage.removeItem("regauth_pending_email");
    } catch {}

    router.replace(`/regauth?returnTo=${encodeURIComponent(returnTo)}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 text-white">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Check your email.
          </h1>

          <p className="text-sm text-white/60">
            Enter the 6-digit code
            {pendingEmail ? (
              <>
                {" "}
                sent to <span className="text-white/80">{pendingEmail}</span>.
              </>
            ) : (
              "."
            )}
          </p>
        </div>

        <div className="flex justify-center gap-2">
          {refs.map((ref, i) => (
            <input
              key={i}
              ref={ref}
              value={digits[i]}
              onChange={(e) => onChange(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              disabled={isSubmitting}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              pattern="[0-9]*"
              className="h-14 w-11 rounded-xl border border-white/10 bg-white/10 text-center text-xl text-white outline-none transition focus:border-white/25 focus:bg-white/15 focus:ring-2 focus:ring-white/20 disabled:opacity-50"
              maxLength={1}
            />
          ))}
        </div>

        {isSubmitting ? (
          <p className="text-sm text-white/60">Checking…</p>
        ) : null}

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <button
          type="button"
          onClick={useDifferentEmail}
          disabled={isSubmitting}
          className="text-sm text-white/50 underline transition hover:text-white/75 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Use a different email
        </button>
      </div>
    </main>
  );
}