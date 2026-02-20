"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { sanitizeReturnTo } from "@/regauth/lib/returnTo";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function onlyDigits(raw: string): string {
  return (raw ?? "").replace(/\D+/g, "");
}

function splitCode(raw: string): string[] {
  const d = onlyDigits(raw).slice(0, 6);
  const arr = new Array<string>(6).fill("");
  for (let i = 0; i < d.length; i += 1) arr[i] = d[i] ?? "";
  return arr;
}

function joinCode(digits: string[]): string {
  return digits.join("");
}

type RegAuthMode = "device" | "code" | "link";

function LegalLink({ href, children }: { href: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <Link
      href={href}
      className={cx(
        "text-white/45 underline-offset-4",
        "hover:text-white/70 hover:underline",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/12 rounded"
      )}
    >
      {children}
    </Link>
  );
}

function laneGlowDotStyle(id: RegAuthMode): React.CSSProperties {
  if (id === "device") {
    return {
      background:
        "radial-gradient(12px 12px at 35% 35%, rgba(255,236,206,0.95), rgba(255,168,96,0.60) 55%, rgba(255,96,120,0.35) 82%, transparent 100%)",
      filter: "blur(8px)",
      opacity: 0.95,
    };
  }
  if (id === "code") {
    return {
      background:
        "radial-gradient(12px 12px at 35% 35%, rgba(219,234,254,0.95), rgba(125,211,252,0.55) 55%, rgba(86,114,255,0.32) 82%, transparent 100%)",
      filter: "blur(8px)",
      opacity: 0.9,
    };
  }
  return {
    background:
      "radial-gradient(12px 12px at 35% 35%, rgba(237,233,254,0.95), rgba(196,181,253,0.55) 55%, rgba(244,114,182,0.30) 82%, transparent 100%)",
    filter: "blur(8px)",
    opacity: 0.9,
  };
}

function PortalButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}): React.JSX.Element {
  const isDisabled = !!disabled;

  const className = cx(
    "relative h-11 w-full overflow-hidden rounded-2xl font-medium",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/18",
    "transition-transform duration-150",
    isDisabled
      ? "cursor-not-allowed text-black/70"
      : "bg-white text-black hover:bg-white/95 active:scale-[0.99] hover:-translate-y-[1px]"
  );

  const style: React.CSSProperties = isDisabled
    ? {
        background: "rgba(255,255,255,0.70)",
        boxShadow:
          "0 18px 46px rgba(0,0,0,0.34), " +
          "inset 0 0 0 1px rgba(255,170,110,0.10), " +
          "inset 0 10px 22px rgba(255,200,160,0.14), " +
          "inset 0 -10px 20px rgba(0,0,0,0.10)",
      }
    : {
        boxShadow:
          "0 24px 60px rgba(0,0,0,0.46), " +
          "inset 0 0 0 1px rgba(255,170,110,0.16), " +
          "inset 0 16px 30px rgba(255,215,175,0.18)",
      };

  return (
    <button type="button" onClick={onClick} disabled={isDisabled} className={className} style={style}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(560px 140px at 50% -30%, rgba(255,185,135,0.42), transparent 60%)," +
            "linear-gradient(180deg, rgba(255,255,255,0.35), transparent 55%)",
          opacity: isDisabled ? 0.25 : 0.7,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(520px 260px at 18% 30%, rgba(255,110,140,0.12), transparent 58%)," +
            "radial-gradient(520px 260px at 82% 20%, rgba(120,160,255,0.12), transparent 62%)",
          mixBlendMode: "screen",
          opacity: isDisabled ? 0.15 : 0.35,
        }}
      />
      <span className="relative">{children}</span>
    </button>
  );
}

export default function VerifyPage(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();

  const returnTo = sanitizeReturnTo(searchParams?.get("returnTo"));

  const [digits, setDigits] = React.useState<string[]>(() => new Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const errId = React.useId();
  const hintId = React.useId();
  const groupLabelId = React.useId();

  const refs = React.useMemo(
    () => Array.from({ length: 6 }, () => React.createRef<HTMLInputElement>()),
    []
  );

  const code = joinCode(digits);
  const isComplete = code.length === 6 && /^\d{6}$/.test(code);

  const lastSubmittedRef = React.useRef<string | null>(null);

  const [showOther, setShowOther] = React.useState(false);

  function goToRegAuth(mode?: RegAuthMode) {
    const p = new URLSearchParams();
    if (returnTo) p.set("returnTo", returnTo);
    if (mode) p.set("mode", mode);
    const s = p.toString();
    router.push(`/regauth${s ? `?${s}` : ""}`);
  }

  const focusIndex = React.useCallback(
    (i: number) => {
      const idx = Math.max(0, Math.min(5, i));
      refs[idx]?.current?.focus();
      refs[idx]?.current?.select();
    },
    [refs]
  );

  const clearCode = React.useCallback(() => {
    setDigits(new Array(6).fill(""));
    setError(null);
    lastSubmittedRef.current = null;
    focusIndex(0);
  }, [focusIndex]);

  const applyBulk = React.useCallback(
    (raw: string, startIndex: number) => {
      const nextDigits = [...digits];
      const incoming = onlyDigits(raw);
      if (!incoming) return;

      let write = startIndex;
      for (let i = 0; i < incoming.length && write < 6; i += 1) {
        nextDigits[write] = incoming[i] ?? "";
        write += 1;
      }

      setDigits(nextDigits);
      setError(null);

      const nextEmpty = nextDigits.findIndex((d) => !d);
      if (nextEmpty === -1) focusIndex(5);
      else focusIndex(nextEmpty);
    },
    [digits, focusIndex]
  );

  const submit = React.useCallback(
    async (overrideCode?: string) => {
      const c = (overrideCode ?? joinCode(digits)).slice(0, 6);

      if (!/^\d{6}$/.test(c)) {
        setError("Enter the 6-digit code.");
        focusIndex(0);
        return;
      }
      if (isSubmitting) return;
      if (lastSubmittedRef.current === c) return;

      setIsSubmitting(true);
      setError(null);
      lastSubmittedRef.current = c;

      try {
        const res = await fetch("/api/regauth/verify", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ code: c }),
        });

        if (!res.ok) {
          setError("That code didn’t work.");
          setIsSubmitting(false);
          lastSubmittedRef.current = null;
          focusIndex(0);
          return;
        }

        const params = new URLSearchParams();
        params.set("from", "login");
        if (returnTo) params.set("returnTo", returnTo);
        router.replace(`/main?${params.toString()}`);
      } catch {
        setError("Something went wrong.");
        setIsSubmitting(false);
        lastSubmittedRef.current = null;
        focusIndex(0);
      }
    },
    [digits, focusIndex, isSubmitting, returnTo, router]
  );

  React.useEffect(() => {
    if (!isComplete) return;
    void submit(code);
  }, [code, isComplete, submit]);

  React.useEffect(() => {
    const t = window.setTimeout(() => focusIndex(0), 40);
    return () => window.clearTimeout(t);
  }, [focusIndex]);

  function onDigitChange(i: number, raw: string) {
    const cleaned = onlyDigits(raw);

    if (!cleaned) {
      const next = [...digits];
      next[i] = "";
      setDigits(next);
      return;
    }

    if (cleaned.length > 1) {
      applyBulk(cleaned, i);
      return;
    }

    const next = [...digits];
    next[i] = cleaned[0] ?? "";
    setDigits(next);
    setError(null);

    if (i < 5) focusIndex(i + 1);
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      void submit();
      return;
    }

    if (e.key === "Backspace") {
      if (digits[i]) {
        const next = [...digits];
        next[i] = "";
        setDigits(next);
        return;
      }
      if (i > 0) {
        e.preventDefault();
        const next = [...digits];
        next[i - 1] = "";
        setDigits(next);
        focusIndex(i - 1);
      }
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusIndex(i - 1);
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusIndex(i + 1);
      return;
    }
  }

  function onPaste(e: React.ClipboardEvent) {
    const txt = e.clipboardData.getData("text");
    const d = onlyDigits(txt);
    if (!d) return;
    e.preventDefault();

    const next = splitCode(d);
    setDigits(next);
    setError(null);

    const lastFilled = Math.min(5, Math.max(0, d.length - 1));
    focusIndex(lastFilled);
  }

  const describedBy = error ? `${hintId} ${errId}` : hintId;

  const ambientAnim = prefersReducedMotion
    ? undefined
    : {
        opacity: [0.88, 1, 0.88],
        transition: { duration: 7.2, repeat: Infinity, ease: "easeInOut" as const },
      };

  const driftAnim = prefersReducedMotion
    ? undefined
    : {
        x: [0, 10, 0],
        y: [0, -8, 0],
        transition: { duration: 18, repeat: Infinity, ease: "easeInOut" as const },
      };

  function OtherOptions(): React.JSX.Element {
    return (
      <div className="mt-4">
        <div className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-x-2 rounded-2xl"
            style={{
              top: -3,
              bottom: -3,
              background:
                "radial-gradient(360px 120px at 10% 50%, rgba(255,170,110,0.10), transparent 62%)," +
                "radial-gradient(360px 120px at 90% 50%, rgba(120,160,255,0.08), transparent 62%)",
              opacity: 0.85,
            }}
          />

          <button
            type="button"
            onClick={() => setShowOther((v) => !v)}
            aria-expanded={showOther}
            className={cx(
              "group relative inline-flex items-center gap-2 rounded-2xl px-2.5 py-1 text-[12px] font-semibold",
              "text-white/66 hover:text-white/90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/12"
            )}
          >
            <span className="relative inline-flex h-5 w-5 items-center justify-center">
              <span aria-hidden className="absolute inset-0 rounded-full" style={laneGlowDotStyle("device")} />
              <span aria-hidden className="relative h-2 w-2 rounded-full" style={{ background: "rgba(255,214,178,0.85)" }} />
            </span>

            <span>Other options</span>

            <ChevronDown
              className={cx(
                "h-4 w-4 transition-transform duration-150 opacity-75",
                showOther ? "rotate-180" : "",
                "group-hover:opacity-95"
              )}
              aria-hidden="true"
            />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {showOther ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.16 }}
              className="mt-3"
            >
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => goToRegAuth("device")}
                  className={cx(
                    "h-10 rounded-2xl px-3 text-sm font-medium text-white/90",
                    "ring-1 ring-inset ring-white/12 bg-white/[0.03] hover:bg-white/[0.06]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/12"
                  )}
                >
                  Try device passkey
                </button>

                <button
                  type="button"
                  onClick={() => goToRegAuth("link")}
                  className={cx(
                    "h-10 rounded-2xl px-3 text-sm font-medium text-white/90",
                    "ring-1 ring-inset ring-white/12 bg-white/[0.03] hover:bg-white/[0.06]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/12"
                  )}
                >
                  Email me a link
                </button>

                <button
                  type="button"
                  onClick={() => goToRegAuth()}
                  className={cx(
                    "h-10 rounded-2xl px-3 text-sm font-medium text-white/90",
                    "ring-1 ring-inset ring-white/12 bg-white/[0.03] hover:bg-white/[0.06]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/12"
                  )}
                >
                  Change email / phone
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }

  function Footer(): React.JSX.Element {
    return (
      <div className="pt-4">
        <div className="text-[11px] leading-relaxed text-white/40">
          <span>By continuing, you agree to our </span>
          <LegalLink href="/terms">Terms</LegalLink>
          <span> and </span>
          <LegalLink href="/privacy">Privacy</LegalLink>
          <span>.</span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/40">
          <LegalLink href="/contact">Contact</LegalLink>
          <span className="text-white/25">•</span>
          <LegalLink href="/accessibility">Accessibility</LegalLink>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full">
      <div className="relative mx-auto flex w-full max-w-5xl px-4 py-8 md:px-8 md:py-12">
        <section className="relative w-full overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.014] backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.62)]">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            animate={ambientAnim}
            style={{
              background:
                "radial-gradient(1150px 820px at 12% 10%, rgba(90,145,255,0.24), transparent 60%)," +
                "radial-gradient(1050px 780px at 70% 16%, rgba(125,211,252,0.16), transparent 64%)," +
                "radial-gradient(980px 720px at 62% 92%, rgba(255,180,120,0.22), transparent 64%)," +
                "radial-gradient(120% 120% at 50% 50%, transparent 0%, rgba(0,0,0,0.42) 70%, rgba(0,0,0,0.70) 100%)",
            }}
          />

          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            animate={driftAnim}
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.20) 0.6px, transparent 0.6px)",
              backgroundSize: "30px 30px",
              maskImage: "radial-gradient(70% 62% at 50% 34%, black, transparent 76%)",
              WebkitMaskImage: "radial-gradient(70% 62% at 50% 34%, black, transparent 76%)",
            }}
          />

          <div className="relative px-6 pb-7 pt-6 md:px-10 md:pb-9 md:pt-8">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/12"
                aria-label="Everleap home"
              >
                <span className="relative h-7 w-7" aria-hidden="true">
                  <span
                    aria-hidden="true"
                    className="absolute inset-[-12px] rounded-[18px]"
                    style={{
                      background:
                        "radial-gradient(18px 18px at 42% 38%, rgba(255,240,210,0.75), rgba(255,170,110,0.32) 55%, rgba(255,110,140,0.16) 80%, transparent 100%)",
                      filter: "blur(10px)",
                      opacity: 1,
                    }}
                  />
                  <span
                    className="relative block h-7 w-7 overflow-hidden rounded-xl ring-1 ring-white/15"
                    style={{ boxShadow: "0 12px 22px rgba(255,120,80,0.18)" }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(16px 16px at 35% 35%, rgba(255,236,206,1), rgba(255,168,96,0.98) 48%, rgba(255,96,120,0.88) 78%, rgba(22,16,30,0.25) 100%)",
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute left-[6px] top-[6px] h-[7px] w-[7px] rounded-full"
                      style={{ background: "rgba(255,255,255,0.55)" }}
                    />
                  </span>
                </span>

                <span className="text-[11px] tracking-[0.26em] antialiased text-white/80 group-hover:text-white/90">
                  EVERLEAP
                </span>
              </Link>

              <button
                type="button"
                onClick={() => goToRegAuth()}
                className="text-xs text-white/55 hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10"
              >
                Back
              </button>
            </div>

            <div className="mx-auto mt-7 w-full max-w-3xl md:mt-9">
              <h1 className="text-[30px] font-medium leading-tight tracking-tight text-white md:text-[42px]">
                Check your messages.
              </h1>

              <p className="mt-3 max-w-[54ch] text-sm leading-relaxed text-white/65 md:mt-4 md:text-[15px]">
                Type the 6-digit code we sent.
              </p>

              <div className="mt-6 w-full max-w-[520px] md:mt-7">
                <div className="space-y-5">
                  <div
                    className="relative"
                    onPaste={onPaste}
                    aria-labelledby={groupLabelId}
                    aria-describedby={describedBy}
                    role="group"
                  >
                    <div className="flex items-baseline justify-between">
                      <div id={groupLabelId} className="text-white/90 text-sm font-semibold">
                        Code
                      </div>
                      <div className="text-xs text-white/45">
                        <span className="tabular-nums">{code.length}</span>/6
                      </div>
                    </div>

                    <div className="mt-4">
                      <div
                        className={cx(
                          "relative flex overflow-hidden rounded-2xl",
                          "border border-white/12",
                          "bg-white/[0.03]",
                          "shadow-[inset_0_1px_0_rgba(255,255,255,0.10),inset_0_-18px_50px_rgba(0,0,0,0.26)]",
                          error ? "border-red-300/26" : ""
                        )}
                      >
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0 opacity-[0.85]"
                          style={{
                            background:
                              "radial-gradient(120% 140% at 50% 120%, rgba(255,189,120,0.10), transparent 56%)," +
                              "radial-gradient(120% 140% at 20% 10%, rgba(125,211,252,0.10), transparent 58%)",
                          }}
                        />
                        {refs.map((r, i) => {
                          const filled = Boolean(digits[i]);
                          return (
                            <div
                              key={`cell_${i}`}
                              className={cx(
                                "relative flex w-12 flex-1 items-center justify-center",
                                i !== 0 ? "border-l border-white/10" : ""
                              )}
                            >
                              <input
                                ref={r}
                                inputMode="numeric"
                                autoComplete={i === 0 ? "one-time-code" : "off"}
                                aria-label={`Digit ${i + 1}`}
                                aria-invalid={error ? true : undefined}
                                value={digits[i] ?? ""}
                                maxLength={1}
                                onChange={(e) => onDigitChange(i, e.target.value)}
                                onKeyDown={(e) => onKeyDown(i, e)}
                                className={cx(
                                  "h-14 w-full bg-transparent text-center text-lg font-semibold tabular-nums text-white",
                                  "outline-none placeholder:text-white/30 focus-visible:outline-none",
                                  filled ? "opacity-100" : "opacity-90"
                                )}
                                style={{
                                  textShadow: filled ? "0 10px 26px rgba(255,189,120,0.12)" : undefined,
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>

                      <p id={hintId} className="mt-3 text-xs text-white/55">
                        You can paste the whole code.
                      </p>
                    </div>

                    <div className="mt-3 min-h-[1.25rem]">
                      <p
                        id={errId}
                        role={error ? "alert" : "status"}
                        aria-live={error ? "assertive" : "polite"}
                        className={error ? "text-[13px] text-red-300" : "text-[13px] text-transparent"}
                      >
                        {error ?? "—"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <PortalButton onClick={() => void submit()} disabled={!isComplete || isSubmitting}>
                      {isSubmitting ? "Checking…" : "Continue"}
                    </PortalButton>

                    <div className="mt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={clearCode}
                        className="text-xs text-white/55 hover:text-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10"
                      >
                        Clear
                      </button>

                      <button
                        type="button"
                        disabled
                        className="text-xs text-white/35"
                        aria-label="Resend code (coming soon)"
                        title="Coming soon"
                      >
                        Resend
                      </button>
                    </div>

                    <OtherOptions />
                  </div>

                  <div className="pt-1">
                    <div className="h-px w-full bg-white/10" />
                    <Footer />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}