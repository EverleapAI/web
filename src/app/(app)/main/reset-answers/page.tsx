"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

const RESET_CODE = "101010";
// The server wipe cannot reach these — they live in the browser. If the local
// onboarding answers survived, the intro would re-claim them on the way back in
// and quietly restore the account we just cleared.
const LOCAL_KEYS_TO_CLEAR = [
  "everleap_onboarding_answers",
  "everleap_zip",
  "everleap.story.answers.v3",
  "everleap_onboarding_synthesis",
  "everleapOnboarding_v4_convo_min",
  "everleap_ai_lab_answers",
];

type Step = "enter-code" | "confirm" | "processing";

export default function ResetAnswersPage(): React.JSX.Element {
  const router = useRouter();

  const [step, setStep] = React.useState<Step>("enter-code");
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function validateCode() {
    setError(null);

    if (code.trim() !== RESET_CODE) {
      setError("Incorrect code.");
      return;
    }

    setStep("confirm");
  }

  async function performReset() {
    setError(null);
    setStep("processing");

    try {
      const res = await fetch("/api/story/reset", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code.trim(),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Reset failed.");
      }

      try {
        for (const k of LOCAL_KEYS_TO_CLEAR) window.localStorage.removeItem(k);
      } catch {}

      // Back to the very beginning. Onboarding is not session-gated, so a signed-in
      // user can walk it again; it ends at /regauth, where the middleware sees the
      // surviving session and forwards them to /main/intro — which claims the new
      // answers and fires generation, exactly as it does for a brand-new account.
      router.replace("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed.");
      setStep("confirm");
    }
  }

  return (
    <div className="min-h-[100svh] bg-slate-950 text-white">
      <main className="mx-auto flex min-h-[100svh] w-full max-w-[520px] flex-col justify-center px-6 text-center">
        {step === "enter-code" ? (
          <>
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/34">
              Developer Tools
            </div>

            <h1 className="mt-4 text-[2rem] font-semibold tracking-[-0.05em]">
              Start over
            </h1>

            <p className="mt-4 text-white/60">
              Enter the access code to continue.
            </p>

            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") validateCode();
              }}
              placeholder="Access code"
              inputMode="numeric"
              autoComplete="off"
              className="mt-8 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-white outline-none placeholder:text-white/25 focus:border-cyan-200/30"
            />

            {error ? (
              <div className="mt-3 text-sm text-red-300">{error}</div>
            ) : null}

            <div className="mt-6 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => router.push("/main")}
                className="rounded-full border border-white/10 px-5 py-3 text-white/70"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={validateCode}
                className="rounded-full bg-cyan-300/15 px-6 py-3 font-semibold text-cyan-100"
              >
                Continue
              </button>
            </div>
          </>
        ) : null}

        {step === "confirm" ? (
          <>
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/34">
              Confirm Reset
            </div>

            <h1 className="mt-4 text-[2rem] font-semibold tracking-[-0.05em]">
              Erase everything?
            </h1>

            <p className="mt-5 text-white/60">
              Every answer you have given, every action, badge, match and piece of
              guidance — including your onboarding answers, your name and your ZIP.
              The account will know nothing about you.
            </p>

            <p className="mt-3 text-white/45">
              You stay signed in and your passkey still works. You will start again
              from the first onboarding question. This cannot be undone.
            </p>

            {error ? (
              <div className="mt-4 text-red-300">{error}</div>
            ) : null}

            <div className="mt-8 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => router.push("/main")}
                className="rounded-full border border-white/10 px-5 py-3 text-white/70"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void performReset()}
                className="rounded-full bg-red-500/20 px-5 py-3 font-semibold text-red-200"
              >
                Yes, erase it all
              </button>
            </div>
          </>
        ) : null}

        {step === "processing" ? (
          <>
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/34">
              Processing
            </div>

            <h1 className="mt-4 text-[2rem] font-semibold tracking-[-0.05em]">
              Erasing your account
            </h1>

            <p className="mt-5 text-white/60">
              Clearing everything, then taking you back to the start…
            </p>
          </>
        ) : null}
      </main>
    </div>
  );
}