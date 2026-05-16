"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sanitizeReturnTo } from "@/regauth/lib/returnTo";

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export default function ZipPage(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawReturnTo = sanitizeReturnTo(searchParams?.get("returnTo"));

  const returnTo =
    rawReturnTo && !rawReturnTo.startsWith("/regauth") ? rawReturnTo : "/main";

  const [zip, setZip] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  function onChange(value: string) {
    const next = onlyDigits(value).slice(0, 5);

    setZip(next);

    if (error) {
      setError(null);
    }
  }

  async function onContinue() {
    if (submitting) return;

    if (zip.length > 0 && zip.length !== 5) {
      setError("Enter a valid 5-digit ZIP code, or leave it blank.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (zip.length === 5) {
        window.localStorage.setItem("everleap_zip", zip);
      } else {
        window.localStorage.removeItem("everleap_zip");
      }
    } catch {}

    router.push(`/regauth?returnTo=${encodeURIComponent(returnTo)}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 text-white">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-3 text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/32">
            EVERLEAP
          </div>

          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white">
            Enter your zip code
          </h1>

          <p className="text-[15px] leading-7 text-white/64">
            This allows me to show you local resources near you. You can skip
            this for now.
          </p>
        </div>

        <div className="space-y-4">
          <input
            value={zip}
            onChange={(e) => onChange(e.target.value)}
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="ZIP code optional"
            className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 text-center text-lg tracking-[0.18em] text-white outline-none transition placeholder:text-white/24 focus:border-white/22 focus:bg-white/[0.07]"
          />

          <button
            type="button"
            onClick={() => void onContinue()}
            disabled={submitting}
            className="h-14 w-full rounded-2xl bg-white font-medium text-black transition hover:bg-white/92 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Continuing…" : "Continue"}
          </button>
        </div>

        {error ? (
          <p className="text-center text-sm text-red-300">{error}</p>
        ) : null}
      </div>
    </main>
  );
}