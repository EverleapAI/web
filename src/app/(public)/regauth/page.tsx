"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { sanitizeReturnTo } from "@/regauth/lib/returnTo";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function onlyDigits(s: string): string {
  return (s ?? "").replace(/\D+/g, "");
}

function isLikelyEmail(v: string): boolean {
  const s = (v ?? "").trim();
  const at = s.indexOf("@");
  if (at <= 0) return false;
  const dot = s.lastIndexOf(".");
  return dot > at + 1 && dot < s.length - 1;
}

function isLikelyPhone(v: string): boolean {
  const d = onlyDigits(v);
  if (d.length === 10) return true;
  if (d.length === 11 && d.startsWith("1")) return true;
  return false;
}

function normalizeIdentifier(raw: string): string {
  const s = (raw ?? "").trim();
  if (isLikelyEmail(s)) return s.toLowerCase();
  if (isLikelyPhone(s)) return onlyDigits(s);
  return s;
}

type Method = "device" | "code" | "magic";
type ModeParam = "device" | "code" | "link";

function modeToMethod(mode: string | null): Method {
  if (mode === "code") return "code";
  if (mode === "link") return "magic";
  return "device";
}

function methodToMode(method: Method): ModeParam {
  if (method === "magic") return "link";
  return method;
}

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

type InputFieldProps = {
  value: string;
  onChangeValue: (next: string) => void;
  placeholder: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
};

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(function InputField(props, ref): React.JSX.Element {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            "radial-gradient(420px 160px at 18% 0%, rgba(255,170,110,0.14), transparent 62%)," +
            "radial-gradient(420px 160px at 82% 0%, rgba(120,160,255,0.12), transparent 62%)," +
            "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.04))",
          opacity: 1,
        }}
      />
      <input
        ref={ref}
        value={props.value}
        onChange={(e) => props.onChangeValue(e.target.value)}
        onKeyDown={props.onKeyDown}
        inputMode={props.inputMode}
        autoComplete={props.autoComplete}
        placeholder={props.placeholder}
        className={cx(
          "relative h-11 w-full rounded-2xl px-4 text-sm",
          "bg-transparent text-white placeholder:text-white/35",
          "outline-none ring-1 ring-inset",
          props.ariaInvalid ? "ring-red-300/35 focus:ring-red-300/45" : "ring-white/12 focus:ring-white/22",
          "focus-visible:ring-2 focus-visible:ring-white/18"
        )}
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(0,0,0,0.10), " +
            "inset 0 14px 26px rgba(0,0,0,0.20), " +
            "inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
        aria-invalid={props.ariaInvalid ? true : undefined}
        aria-describedby={props.ariaDescribedBy}
      />
    </div>
  );
});

function laneDot(id: Method) {
  if (id === "device") return "bg-amber-300/85";
  if (id === "code") return "bg-sky-300/85";
  return "bg-violet-300/85";
}

function laneGlowDotStyle(id: Method): React.CSSProperties {
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

export default function RegAuthEntryPage(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const returnTo = sanitizeReturnTo(searchParams?.get("returnTo"));

  const urlMode = (searchParams?.get("mode") ?? "device") as ModeParam;
  const [method, setMethod] = React.useState<Method>(() => modeToMethod(urlMode));

  const [showOther, setShowOther] = React.useState(false);

  const [value, setValue] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [error, setError] = React.useState<string | null>(null);
  const [passkeyMsg, setPasskeyMsg] = React.useState<string | null>(null);
  const [magicMsg, setMagicMsg] = React.useState<string | null>(null);

  const codeInputRef = React.useRef<HTMLInputElement | null>(null);
  const magicInputRef = React.useRef<HTMLInputElement | null>(null);

  const passkeySupported = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    return typeof (window as unknown as { PublicKeyCredential?: unknown }).PublicKeyCredential !== "undefined";
  }, []);

  React.useEffect(() => {
    const next = modeToMethod(searchParams?.get("mode"));
    setMethod((cur) => (cur === next ? cur : next));
    setShowOther(false);
    setError(null);
    setPasskeyMsg(null);
    setMagicMsg(null);
  }, [searchParams]);

  const qp = React.useMemo(() => {
    const p = new URLSearchParams();
    if (returnTo) p.set("returnTo", returnTo);
    const s = p.toString();
    return s ? `?${s}` : "";
  }, [returnTo]);

  function setUrlMode(nextMethod: Method) {
    const p = new URLSearchParams();
    if (returnTo) p.set("returnTo", returnTo);
    p.set("mode", methodToMode(nextMethod));
    const s = p.toString();
    router.replace(`/regauth${s ? `?${s}` : ""}`);
  }

  const codeIsValid = React.useMemo(() => {
    const s = (value ?? "").trim();
    if (!s) return false;
    return isLikelyEmail(s) || isLikelyPhone(s);
  }, [value]);

  const magicIsValid = React.useMemo(() => {
    const s = (value ?? "").trim();
    if (!s) return false;
    return isLikelyEmail(s);
  }, [value]);

  const codeInputMode = React.useMemo<React.HTMLAttributes<HTMLInputElement>["inputMode"]>(() => {
    const trimmed = (value ?? "").trim();
    if (!trimmed) return "email";
    const d = onlyDigits(trimmed);
    if (d.length >= 7 && !trimmed.includes("@")) return "tel";
    return "email";
  }, [value]);

  React.useEffect(() => {
    if (method !== "code") return;
    const t = window.setTimeout(() => codeInputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [method]);

  React.useEffect(() => {
    if (method !== "magic") return;
    const t = window.setTimeout(() => magicInputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [method]);

  function setMethodClean(next: Method) {
    setMethod(next);
    setUrlMode(next);
    setShowOther(false);
    setError(null);
    setPasskeyMsg(null);
    setMagicMsg(null);
  }

  function onPasskeyPrimary() {
    setError(null);
    setMagicMsg(null);
    setPasskeyMsg(null);

    if (!passkeySupported) {
      setPasskeyMsg("Passkeys aren’t available on this device.");
      return;
    }

    setPasskeyMsg("Passkey sign-in isn’t ready here yet. Try Code.");
    setMethodClean("code");
  }

  function onAppleMock() {
    setError(null);
    setPasskeyMsg(null);
    setMagicMsg("Apple isn’t set up yet.");
  }

  function onGoogleMock() {
    setError(null);
    setPasskeyMsg(null);
    setMagicMsg("Google isn’t set up yet.");
  }

  async function onContinueCode() {
    const trimmed = (value ?? "").trim();
    if (!trimmed) {
      setError("Drop your email or phone.");
      return;
    }
    if (!codeIsValid) {
      setError("That doesn’t look right — try again.");
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setPasskeyMsg(null);
    setMagicMsg(null);

    try {
      const identifier = normalizeIdentifier(trimmed);

      const res = await fetch("/api/regauth/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ identifier, returnTo: returnTo ?? undefined }),
      });

      if (!res.ok) {
        setError("Couldn’t send it. Try again.");
        setIsSubmitting(false);
        return;
      }

      router.push(`/regauth/verify${qp}`);
    } catch {
      setError("Something went wrong. Try again.");
      setIsSubmitting(false);
    }
  }

  function onSendLinkMock() {
    setError(null);
    setPasskeyMsg(null);

    if (!magicIsValid) {
      setMagicMsg("That email looks off.");
      return;
    }
    setMagicMsg("Links aren’t set up yet.");
  }

  function onKeyDownCode(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      void onContinueCode();
    }
  }

  function onKeyDownMagic(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      onSendLinkMock();
    }
  }

  const tabs = React.useMemo(
    () =>
      [
        { id: "device", label: "Device" },
        { id: "code", label: "Code" },
        { id: "magic", label: "Link" },
      ] as const,
    []
  );

  function tabClass(active: boolean): string {
    return cx(
      "relative inline-flex items-center gap-2 px-1.5 py-1 text-[13px] font-semibold tracking-wide",
      "rounded-lg transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/12",
      active ? "text-white" : "text-white/55 hover:text-white/85"
    );
  }

  function underlineStyle(active: boolean, id: Method): React.CSSProperties {
    if (!active) return { opacity: 0 };
    if (id === "device") {
      return {
        opacity: 1,
        background: "linear-gradient(90deg, rgba(255,214,178,0.0), rgba(255,214,178,0.55), rgba(255,214,178,0.0))",
      };
    }
    if (id === "code") {
      return {
        opacity: 1,
        background: "linear-gradient(90deg, rgba(186,230,253,0.0), rgba(186,230,253,0.55), rgba(186,230,253,0.0))",
      };
    }
    return {
      opacity: 1,
      background: "linear-gradient(90deg, rgba(221,214,254,0.0), rgba(221,214,254,0.55), rgba(221,214,254,0.0))",
    };
  }

  function LegalBlock(): React.JSX.Element {
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
              <span aria-hidden className="absolute inset-0 rounded-full" style={laneGlowDotStyle(method)} />
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
                  onClick={onAppleMock}
                  className={cx(
                    "h-10 rounded-2xl px-3 text-sm font-medium text-white/90",
                    "ring-1 ring-inset ring-white/12 bg-white/[0.03] hover:bg-white/[0.06]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/12"
                  )}
                >
                  Apple
                </button>

                <button
                  type="button"
                  onClick={onGoogleMock}
                  className={cx(
                    "h-10 rounded-2xl px-3 text-sm font-medium text-white/90",
                    "ring-1 ring-inset ring-white/12 bg-white/[0.03] hover:bg-white/[0.06]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/12"
                  )}
                >
                  Google
                </button>
              </div>

              <div className="mt-2 text-[11px] text-white/40">(Mocked) Social sign-in isn’t set up yet.</div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }

  function onChangeValue(next: string) {
    setValue(next);
    if (error) setError(null);
    if (magicMsg) setMagicMsg(null);
  }

  function MethodNudge(): React.JSX.Element | null {
    const msg = passkeyMsg || magicMsg || error;
    if (!msg) return null;

    const tone =
      error ? "text-red-300" : passkeyMsg ? "text-amber-200" : magicMsg ? "text-amber-200" : "text-white/70";

    return (
      <motion.div
        key="method-nudge"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.16 }}
        className={cx("mt-3 text-[13px] leading-relaxed", tone)}
        aria-live="polite"
      >
        {msg}
      </motion.div>
    );
  }

  return (
    <main className="w-full">
      <div className="relative mx-auto flex w-full max-w-6xl px-4 py-4 md:px-8 md:py-10">
        <section className="relative w-full overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(980px 560px at 22% 18%, rgba(86,114,255,0.10), transparent 62%)," +
                "radial-gradient(820px 560px at 74% 26%, rgba(125,211,252,0.06), transparent 66%)",
            }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(520px 340px at 7% 22%, rgba(255,170,110,0.16), transparent 62%)," +
                "radial-gradient(420px 260px at 12% 18%, rgba(255,110,140,0.10), transparent 66%)",
              mixBlendMode: "screen",
              opacity: 0.9,
            }}
          />

          <div className="relative px-5 py-6 md:px-10 md:py-9">
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

                <span className="text-[11px] tracking-[0.26em] antialiased" style={{ color: "rgba(255,214,178,0.92)" }}>
                  EVERLEAP
                </span>
              </Link>
            </div>

            <div className="mx-auto mt-6 w-full max-w-3xl md:mt-8">
              <h1 className="text-[32px] font-medium leading-tight tracking-tight text-white md:text-[46px]">Come on in.</h1>

              <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-white/65 md:mt-4 md:text-[15px]">
                How do you want to sign in today?
              </p>

              <div className="mt-6 w-full max-w-[520px] md:mt-7">
                <div className="flex items-center gap-6">
                  {tabs.map((t) => {
                    const active = method === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setMethodClean(t.id)}
                        aria-current={active ? "page" : undefined}
                        className={tabClass(active)}
                      >
                        <span className="relative inline-flex h-4 w-4 items-center justify-center">
                          <span
                            aria-hidden
                            className={cx("absolute inset-0 rounded-full", active ? "" : "opacity-0")}
                            style={laneGlowDotStyle(t.id)}
                          />
                          <span aria-hidden className={cx("relative h-2 w-2 rounded-full", laneDot(t.id))} />
                        </span>

                        <span>{t.label}</span>

                        <span
                          aria-hidden
                          className="absolute -bottom-1.5 left-0 right-0 h-px"
                          style={underlineStyle(active, t.id)}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5">
                  <AnimatePresence mode="wait" initial={false}>
                    {method === "device" ? (
                      <motion.div
                        key="content-device"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-5"
                      >
                        <div className="space-y-2">
                          <div className="text-white/90 text-sm font-semibold">Device passkey</div>
                          <div className="text-[13px] leading-relaxed text-white/60">
                            Sign in with your device passkey (Face ID / Touch ID / PIN).
                          </div>
                        </div>

                        <div>
                          <PortalButton onClick={onPasskeyPrimary}>Use my device</PortalButton>
                          <MethodNudge />
                        </div>

                        <div>
                          <OtherOptions />
                        </div>

                        <div className="pt-1">
                          <div className="h-px w-full bg-white/10" />
                          <LegalBlock />
                        </div>
                      </motion.div>
                    ) : null}

                    {method === "code" ? (
                      <motion.div
                        key="content-code"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-5"
                      >
                        <div className="space-y-2">
                          <div className="text-white/90 text-sm font-semibold">Send me a code</div>
                          <div className="text-[13px] leading-relaxed text-white/60">We’ll text or email it.</div>
                        </div>

                        <div className="space-y-3">
                          <InputField
                            ref={codeInputRef}
                            value={value}
                            onChangeValue={onChangeValue}
                            placeholder="email or phone"
                            inputMode={codeInputMode}
                            autoComplete="username"
                            onKeyDown={onKeyDownCode}
                            ariaInvalid={!!error}
                            ariaDescribedBy="regauth-code-help"
                          />
                          <div id="regauth-code-help" className="text-xs text-white/45">
                            Standard rates may apply.
                          </div>
                        </div>

                        <div>
                          <PortalButton onClick={() => void onContinueCode()} disabled={!codeIsValid || isSubmitting}>
                            {isSubmitting ? "Sending…" : "Send code"}
                          </PortalButton>
                          <MethodNudge />
                        </div>

                        <div>
                          <OtherOptions />
                        </div>

                        <div className="pt-1">
                          <div className="h-px w-full bg-white/10" />
                          <LegalBlock />
                        </div>
                      </motion.div>
                    ) : null}

                    {method === "magic" ? (
                      <motion.div
                        key="content-magic"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-5"
                      >
                        <div className="space-y-2">
                          <div className="text-white/90 text-sm font-semibold">Email me a link</div>
                          <div className="text-[13px] leading-relaxed text-white/60">One tap and you’re back in.</div>
                        </div>

                        <div className="space-y-3">
                          <InputField
                            ref={magicInputRef}
                            value={value}
                            onChangeValue={onChangeValue}
                            placeholder="email"
                            inputMode="email"
                            autoComplete="email"
                            onKeyDown={onKeyDownMagic}
                          />
                          <div className="text-xs text-white/45">We’ll send a sign-in link.</div>
                        </div>

                        <div>
                          <PortalButton onClick={onSendLinkMock} disabled={!magicIsValid}>
                            Send link
                          </PortalButton>
                          <MethodNudge />
                        </div>

                        <div>
                          <OtherOptions />
                        </div>

                        <div className="pt-1">
                          <div className="h-px w-full bg-white/10" />
                          <LegalBlock />
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}