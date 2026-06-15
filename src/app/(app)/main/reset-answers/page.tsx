"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

const RESET_CODE = "101010";
const STORY_STORAGE_KEY = "everleap.story.answers.v3";

type Step = "enter-code" | "confirm" | "processing" | "done";

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
      window.localStorage.removeItem(STORY_STORAGE_KEY);

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

      await new Promise((resolve) => window.setTimeout(resolve, 10000));

      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed.");
      setStep("confirm");
    }
  }

  function continueToToday() {
    router.push("/main");
    router.refresh();
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
              Reset Answers
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
              Reset your answers?
            </h1>

            <p className="mt-5 text-white/60">
              This will remove your Story answers and Today guidance generated
              from them.
            </p>

            <p className="mt-3 text-white/45">
              Your onboarding answers, account, and login will remain.
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
                Yes, Reset
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
              Rebuilding Today
            </h1>

            <p className="mt-5 text-white/60">
              Clearing Story answers and rebuilding guidance from onboarding.
            </p>
          </>
        ) : null}

        {step === "done" ? (
          <>
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/34">
              Complete
            </div>

            <h1 className="mt-4 text-[2rem] font-semibold tracking-[-0.05em]">
              Done
            </h1>

            <p className="mt-5 text-white/60">
              Your Story answers were removed. Today is ready to start again
              from onboarding.
            </p>

            <button
              type="button"
              onClick={continueToToday}
              className="mt-8 rounded-full bg-cyan-300/15 px-6 py-3 font-semibold text-cyan-100"
            >
              Continue
            </button>
          </>
        ) : null}
      </main>
    </div>
  );
}