"use client";

import * as React from "react";
import { ArrowLeft } from "lucide-react";

type PublicFlowCardProps = {
  dark: boolean;
  cardClassName: string;

  disabled?: boolean;

  onBack?: () => void;
  backLabel?: string;

  centerChip?: React.ReactNode; // e.g. "Consent"
  rightSlot?: React.ReactNode;  // e.g. toggle

  children: React.ReactNode;

  /** Optional area for a status/ack block */
  statusSlot?: React.ReactNode;

  /** Actions area (buttons) */
  actions?: React.ReactNode;

  footerNote?: React.ReactNode;
};

export default function PublicFlowCard({
  dark,
  cardClassName,
  disabled,
  onBack,
  backLabel = "Back",
  centerChip,
  rightSlot,
  children,
  statusSlot,
  actions,
  footerNote,
}: PublicFlowCardProps) {
  const headerBtnBase = dark
    ? "text-slate-200 hover:bg-white/10"
    : "text-slate-700 hover:bg-black/5";

  return (
    <section className="w-full">
      <div
        className={`relative w-full overflow-hidden rounded-3xl border px-6 py-7 md:px-8 md:py-8 ${cardClassName}`}
      >
        {/* Header row */}
        <div className="flex items-center justify-between gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              disabled={!!disabled}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition ${headerBtnBase} ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Go back"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {backLabel}
            </button>
          ) : (
            <div />
          )}

          {centerChip ?? <div />}

          {rightSlot ?? <div />}
        </div>

        <div className="mt-4">{children}</div>

        {statusSlot ? <div className="mt-5">{statusSlot}</div> : null}

        {actions ? <div className="mt-6">{actions}</div> : null}

        {footerNote ? <div className="mt-3">{footerNote}</div> : null}
      </div>
    </section>
  );
}
