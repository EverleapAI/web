"use client";

import { motion } from "framer-motion";

type Props = {
  canGoBack: boolean;
  showContinue: boolean;
  continueLabel?: string;
  continueDisabled?: boolean;
  onBack: () => void;
  onContinue: () => void;
};

function NavButton({
  label,
  onClick,
  disabled,
  variant,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant: "back" | "continue";
}) {
  const isContinue = variant === "continue";

  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.985 }}
      onClick={onClick}
      disabled={Boolean(disabled)}
      className={[
        "inline-flex min-h-[56px] items-center justify-center rounded-full px-6 text-[16px] font-semibold tracking-[-0.02em] transition",
        "sm:min-h-[58px] sm:text-[17px]",
        disabled
          ? "cursor-not-allowed border border-white/10 bg-white/[0.02] text-white/22"
          : isContinue
            ? "min-w-[156px] bg-cyan-300 text-slate-950 shadow-[0_14px_38px_rgba(34,211,238,0.22)] hover:bg-cyan-200"
            : "min-w-[136px] border border-white/18 bg-white/[0.015] text-white/86 hover:border-white/32 hover:bg-white/[0.035]",
      ].join(" ")}
    >
      {isContinue ? (
        <span>{label}</span>
      ) : (
        <span className="flex items-center gap-3">
          <span className="text-[22px] leading-none">←</span>
          <span>{label}</span>
        </span>
      )}
    </motion.button>
  );
}

export default function NavControls({
  canGoBack,
  showContinue,
  continueLabel = "Continue",
  continueDisabled,
  onBack,
  onContinue,
}: Props) {
  return (
    <nav className="w-full translate-y-[-20px] pt-4">
      <div className="mx-auto flex min-h-[64px] w-full max-w-[420px] items-center justify-between gap-5">
        <div className="flex-1">
          {canGoBack ? (
            <NavButton label="Back" onClick={onBack} variant="back" />
          ) : (
            <span aria-hidden="true" className="block min-h-[56px] w-full" />
          )}
        </div>

        <div className="flex-1">
          {showContinue ? (
            <NavButton
              label={continueLabel}
              onClick={onContinue}
              disabled={continueDisabled}
              variant="continue"
            />
          ) : (
            <span aria-hidden="true" className="block min-h-[56px] w-full" />
          )}
        </div>
      </div>
    </nav>
  );
}