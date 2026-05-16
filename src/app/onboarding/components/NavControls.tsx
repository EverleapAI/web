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
      whileTap={disabled ? undefined : { scale: 0.98 }}
      onClick={onClick}
      disabled={Boolean(disabled)}
      className={[
        "inline-flex min-h-11 items-center justify-center rounded-full text-[15px] font-semibold transition",
        disabled
          ? "cursor-not-allowed text-white/20"
          : isContinue
            ? "bg-white px-5 text-slate-950 hover:bg-cyan-50"
            : "px-1 text-white/46 hover:text-white/78",
      ].join(" ")}
    >
      {isContinue ? `${label} →` : label}
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
    <nav className="w-full border-t border-white/8 pt-3">
      <div className="flex min-h-12 items-center justify-between gap-4">
        <div>
          {canGoBack ? (
            <NavButton label="Back" onClick={onBack} variant="back" />
          ) : (
            <span aria-hidden="true" className="block min-h-11 w-12" />
          )}
        </div>

        <div>
          {showContinue ? (
            <NavButton
              label={continueLabel}
              onClick={onContinue}
              disabled={continueDisabled}
              variant="continue"
            />
          ) : (
            <span aria-hidden="true" className="block min-h-11 w-24" />
          )}
        </div>
      </div>
    </nav>
  );
}