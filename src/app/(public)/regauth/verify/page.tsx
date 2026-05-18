"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sanitizeReturnTo } from "@/regauth/lib/returnTo";
import RegAuthVisual from "../components/RegAuthVisual";

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
    rawReturnTo && !rawReturnTo.startsWith("/regauth")
      ? rawReturnTo
      : "/main";

  const [digits, setDigits] = React.useState<string[]>(
    () => new Array(6).fill("")
  );

  const [pendingIdentifier, setPendingIdentifier] =
    React.useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const refs = React.useMemo(
    () =>
      Array.from({ length: 6 }, () =>
        React.createRef<HTMLInputElement>()
      ),
    []
  );

  const lastSubmittedRef = React.useRef<string | null>(null);

  const code = joinCode(digits);
  const isComplete = /^\d{6}$/.test(code);

  React.useEffect(() => {
    try {
      setPendingIdentifier(
        window.sessionStorage.getItem("regauth_pending_identifier")
      );
    } catch {}

    const t = window.setTimeout(() => refs[0]?.current?.focus(), 0);

    return () => window.clearTimeout(t);
  }, [refs]);

  function focusIndex(i: number) {
    refs[Math.max(0, Math.min(5, i))]?.current?.focus();
  }

  function getOnboardingPayload() {
    let answers: unknown = null;

    try {
      const rawAnswers = window.localStorage.getItem(
        "everleap_onboarding_answers"
      );

      answers = rawAnswers ? JSON.parse(rawAnswers) : null;
    } catch {
      answers = null;
    }

    const zipCode =
      window.localStorage.getItem("everleap_zip") ?? "";

    return {
      flowKey: "onboarding_v1",
      answers,
      zipCode,
    };
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
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          code: nextCode,
          onboarding: getOnboardingPayload(),
        }),
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
        window.sessionStorage.removeItem(
          "regauth_pending_identifier"
        );
      } catch {}

      router.replace(
        `/regauth/zip?returnTo=${encodeURIComponent(returnTo)}`
      );
    } catch {
      setError("Something went wrong.");

      setIsSubmitting(false);
      lastSubmittedRef.current = null;
    }
  }

  React.useEffect(() => {
    if (isComplete) {
      void submit(code);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete, code]);

  function onChange(i: number, val: string) {
    const clean = onlyDigits(val).slice(0, 6);

    setError(null);
    lastSubmittedRef.current = null;

    const next = [...digits];

    if (clean.length > 1) {
      for (
        let j = 0;
        j < clean.length && i + j < 6;
        j += 1
      ) {
        next[i + j] = clean[j] ?? "";
      }
    } else {
      next[i] = clean || "";
    }

    setDigits(next);

    const nextFocus = Math.min(
      5,
      i + Math.max(clean.length, 1)
    );

    if (clean && nextFocus <= 5) {
      focusIndex(nextFocus);
    }
  }

  function onKeyDown(
    i: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      const next = [...digits];

      next[i - 1] = "";

      setDigits(next);

      lastSubmittedRef.current = null;

      focusIndex(i - 1);
    }
  }

  function useDifferentIdentifier() {
    try {
      window.sessionStorage.removeItem(
        "regauth_pending_identifier"
      );
    } catch {}

    router.replace(
      `/regauth?returnTo=${encodeURIComponent(returnTo)}`
    );
  }

  return (
    <main className="flex min-h-screen justify-center px-4 pb-8 pt-10 text-white">
      <div className="w-full max-w-md space-y-4 text-center">
        <RegAuthVisual kind="verify" />

        <div className="space-y-2">
          <h1 className="text-[2rem] font-semibold tracking-[-0.05em] text-white">
            Check your email.
          </h1>

          <p className="text-[15px] leading-6 text-white/64">
            Enter the 6-digit code
            {pendingIdentifier ? (
              <>
                {" "}
                sent to{" "}
                <span className="text-white/80">
                  {pendingIdentifier}
                </span>
                .
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
              onChange={(e) =>
                onChange(i, e.target.value)
              }
              onKeyDown={(e) => onKeyDown(i, e)}
              disabled={isSubmitting}
              inputMode="numeric"
              autoComplete={
                i === 0 ? "one-time-code" : "off"
              }
              pattern="[0-9]*"
              className="h-12 w-10 rounded-xl border border-white/10 bg-white/[0.06] text-center text-lg text-white outline-none transition focus:border-white/25 focus:bg-white/[0.09] focus:ring-2 focus:ring-white/20 disabled:opacity-50"
              maxLength={1}
            />
          ))}
        </div>

        {isSubmitting ? (
          <p className="text-sm text-white/60">
            Checking…
          </p>
        ) : null}

        {error ? (
          <p className="text-sm text-red-300">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={useDifferentIdentifier}
          disabled={isSubmitting}
          className="text-sm text-white/50 underline transition hover:text-white/75 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Use a different email or phone number
        </button>
      </div>
    </main>
  );
}