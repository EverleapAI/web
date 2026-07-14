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
      style={{ fontWeight: "var(--title-weight, 600)" }}
      className={[
        "inline-flex items-center text-label transition",
        disabled
          ? "cursor-not-allowed text-white/24"
          : "text-cyan-200 hover:text-cyan-100",
      ].join(" ")}
    >
      {isContinue ? <span>{label} --&gt;</span> : <span>{label}</span>}
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
    <nav className="w-full px-5 py-4">
      <div className="mx-auto flex h-auto w-full max-w-[420px] items-center justify-between">
        <div>
          {canGoBack ? (
            <NavButton label="Back" onClick={onBack} variant="back" />
          ) : (
            <span aria-hidden="true" className="block w-12" />
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
            <span aria-hidden="true" className="block w-24" />
          )}
        </div>
      </div>
    </nav>
  );
}