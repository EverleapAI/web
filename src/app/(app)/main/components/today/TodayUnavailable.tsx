"use client";

// What Today shows when Today could not be loaded.
//
// There used to be a "fallback card" here: the legacy TodayCard, fed by an older
// guidance blob, sitting under a hand-written tiny task pulled from a static
// content registry. It looked like a real screen — a headline, a question, a
// button — so a failed request rendered as a perfectly calm page that simply
// wasn't about you. Canned questions dressed as personal ones is the exact thing
// this product exists not to do, and it was our own error state doing it.
//
// The heart payload is computed live on every request and is returned even for a
// brand-new account with no guidance row, so if it is missing, nothing "hasn't
// generated yet" — the call actually failed. That is worth saying plainly, and
// worth offering to retry, which is the one thing that has ever fixed it.

import * as React from "react";
import { RefreshCw } from "lucide-react";

import { PROSE_CLASS, PROSE_STYLE, TEXT_HEADING, TEXT_MUTED } from "@/lib/ui/prose";

export function TodayUnavailable({
  onRetry,
  retrying,
}: {
  onRetry: () => void;
  retrying?: boolean;
}) {
  const rgb = "92,180,255";

  return (
    <div className="py-2">
      <h1
        className="text-[22px] font-semibold leading-[1.2] tracking-[-0.02em]"
        style={{ color: TEXT_HEADING }}
      >
        Today didn&apos;t load
      </h1>

      <p
        className={`mt-3 max-w-[460px] text-[17px] ${PROSE_CLASS}`}
        style={PROSE_STYLE}
      >
        Nothing is lost — this is just the connection. Your story, your actions and
        your awards are all still here.
      </p>

      <div className="mt-5">
        <button
          type="button"
          onClick={onRetry}
          disabled={retrying}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition hover:brightness-110 active:opacity-80 disabled:opacity-70"
          style={{
            color: `rgb(${rgb})`,
            background: `rgba(${rgb},0.08)`,
            border: `1px solid rgba(${rgb},0.28)`,
          }}
        >
          <RefreshCw
            className={`h-4 w-4 ${retrying ? "animate-spin" : ""}`}
          />
          <span>{retrying ? "Trying again…" : "Try again"}</span>
        </button>
      </div>

      <p className="mt-4 text-[12.5px]" style={{ color: TEXT_MUTED }}>
        If it keeps happening, it&apos;s us, not you.
      </p>
    </div>
  );
}
