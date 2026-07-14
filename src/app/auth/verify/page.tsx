// apps/web/src/app/auth/verify/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ClipboardEvent, ChangeEvent, KeyboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import ConversationChrome from "@/components/conversation/ConversationChrome";

/* ---------- Helpers: display/masking ---------- */
function maskEmail(email: string) {
  const v = String(email || "").trim().toLowerCase();
  const [user, domain] = v.split("@");
  if (!user || !domain) return v;
  const head = user.slice(0, 2);
  const tail = user.length > 4 ? user.slice(-1) : "";
  return `${head}${"•".repeat(Math.max(2, user.length - head.length - tail.length))}${tail}@${domain}`;
}
function prettyNanp(phone: string) {
  const n = String(phone || "").replace(/\D+/g, "");
  const ten = n.length === 11 && n.startsWith("1") ? n.slice(1) : n;
  if (ten.length !== 10) return phone ?? "";
  return `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`;
}

type Role = "student" | "supporter";
type Contact = { method: "phone" | "email"; value: string; display?: string };

/* Normalize API base; ensure exactly one /api */
const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7071/api").replace(/\/+$/, "");
const BASE_WITH_API = /\/api$/i.test(RAW_BASE) ? RAW_BASE : `${RAW_BASE}/api`;

const AUTH_SEND = `${BASE_WITH_API}/auth/send-otp`;
const BFF_VERIFY = `/api/session/verify`; // same-origin BFF route
const ME_BOOTSTRAP = `${BASE_WITH_API}/me/bootstrap-profile`;

/* ---------- API types & calls ---------- */
type VerifyOk = { ok: true; userId: string; redirect?: string | null };
type VerifyErr = { ok: false; error?: string; code?: string };
type VerifyResp = VerifyOk | VerifyErr;

type BootstrapBody = {
  role: Role;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
};

async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return `HTTP ${res.status}`;
  }
}

async function sendOtp(contact: Contact) {
  const res = await fetch(AUTH_SEND, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ contact }),
  });
  if (!res.ok) throw new Error(await safeText(res));
  const txt = await res.text().catch(() => "");
  const data = txt ? (JSON.parse(txt) as { requestId?: string; ttlSec?: number }) : {};
  return data;
}

async function verifyOtpBff(args: {
  code: string;
  contact: Contact;
  requestId?: string;
  firstName: string;
  lastName: string;
  role: Role;
}) {
  const res = await fetch(BFF_VERIFY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(args),
  });

  const txt = await res.text().catch(() => "");
  let data: VerifyResp = { ok: false, error: undefined, code: undefined };
  try {
    data = (txt ? JSON.parse(txt) : {}) as VerifyResp;
  } catch {
    /* non-JSON */
  }

  if (!res.ok || data.ok === false) {
    const err = new Error((data as VerifyErr)?.error || (txt || `HTTP ${res.status}`)) as Error & { code?: string };
    if ((data as VerifyErr)?.code) err.code = (data as VerifyErr).code;
    throw err;
  }

  return data as VerifyOk;
}

async function bootstrapProfile(userId: string, body: BootstrapBody) {
  const res = await fetch(ME_BOOTSTRAP, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-user-id": userId },
    cache: "no-store",
    body: JSON.stringify(body),
  });
  return res.ok ? res.json() : null;
}

/* ---------- OTP Input Component ---------- */
function OtpInput({
  value,
  setValue,
  onComplete,
}: {
  value: string;
  setValue: (next: string) => void;
  onComplete: () => void;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  if (refs.current.length !== 6) refs.current = Array(6).fill(null);

  const hiddenRef = useRef<HTMLInputElement | null>(null);

  // Focus the first box on mount (avoid referencing value to keep deps empty)
  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  function focusIndex(i: number) {
    if (i <= 5) refs.current[i]?.focus();
  }

  function handleChange(idx: number, e: ChangeEvent<HTMLInputElement>) {
    const beforeLen = value.length;
    const d = e.target.value.replace(/\D+/g, "");
    const arr = value.padEnd(6, " ").split("");
    let i = idx;
    for (const ch of d) {
      if (i > 5) break;
      arr[i] = ch;
      i++;
    }
    const next = arr.join("").replace(/\s/g, "").slice(0, 6);
    setValue(next);

    if (d.length === 1 && next.length >= beforeLen && idx < 5) {
      focusIndex(idx + 1); // auto-advance
    }
    if (next.length === 6) onComplete();
  }

  function handleKeyDown(idx: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      const arr = value.split("");
      if (value[idx]) arr[idx] = "";
      else if (idx > 0) arr[idx - 1] = "";
      setValue(arr.join(""));
      if (!value[idx] && idx > 0) refs.current[idx - 1]?.focus();
      e.preventDefault();
    } else if (e.key === "Enter" && value.length === 6) {
      onComplete();
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && idx > 0) {
      refs.current[idx - 1]?.focus();
      e.preventDefault();
    } else if (e.key === "ArrowRight" && idx < 5) {
      refs.current[idx + 1]?.focus();
      e.preventDefault();
    }
  }

  function handlePaste(idx: number, e: ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text").replace(/\D+/g, "");
    if (!text) return;
    e.preventDefault();
    const arr = value.padEnd(6, " ").split("");
    let i = idx;
    for (const ch of text) {
      if (i > 5) break;
      arr[i] = ch;
      i++;
    }
    const next = arr.join("").replace(/\s/g, "").slice(0, 6);
    setValue(next);
    if (next.length === 6) onComplete();
  }

  // Hidden consolidated input to help mobile autofill
  function handleHiddenChange(e: ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/\D+/g, "").slice(0, 6);
    if (!v) return;
    setValue(v);
    if (v.length === 6) onComplete();
    const idx = Math.min(5, v.length);
    refs.current[idx]?.focus();
  }

  return (
    <>
      <input
        ref={hiddenRef}
        type="tel"
        inputMode="numeric"
        autoComplete="one-time-code"
        name="otp"
        value={value}
        onChange={handleHiddenChange}
        className="sr-only absolute -z-10 opacity-0 pointer-events-none"
        tabIndex={-1}
        aria-hidden="true"
      />
      <div className="grid grid-cols-6 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            inputMode="numeric"
            type="tel"
            autoComplete="one-time-code"
            name={`otp-${i + 1}`}
            maxLength={1}
            value={value[i] ?? ""}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={(e) => handlePaste(i, e)}
            onFocus={(e) => e.currentTarget.select()}
            aria-label={`Digit ${i + 1}`}
            className="h-12 w-full rounded-xl border border-black/10 bg-white/90 text-center text-lg outline-none focus:ring-2 focus:ring-[rgb(var(--accent-rgb))]/40"
          />
        ))}
      </div>
    </>
  );
}

/* ---------- Page ---------- */
export default function VerifyPage() {
  const router = useRouter();
  const search = useSearchParams();

  const [contact, setContact] = useState<Contact | null>(null);
  const [requestId, setRequestId] = useState<string>("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [resetCounter, setResetCounter] = useState(0);

  // Saved onboarding info (for bootstrap-profile after verify)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<Role | "">("");

  // Restore contact + onboarding details
  useEffect(() => {
    try {
      const raw = localStorage.getItem("everleap.contact");
      if (raw) setContact(JSON.parse(raw) as Contact);
    } catch {}
    try {
      const saved = JSON.parse(localStorage.getItem("everleap.user") || "{}") as {
        firstName?: string;
        lastName?: string;
        role?: Role;
      };
      if (saved?.firstName) setFirstName(saved.firstName);
      if (saved?.lastName) setLastName(saved.lastName);
      if (saved?.role === "student" || saved?.role === "supporter") setRole(saved.role);
    } catch {}
  }, []);

  // Kick off OTP send when contact is present
  useEffect(() => {
    if (!contact) return;
    (async () => {
      try {
        const res = await sendOtp(contact);
        if (res?.requestId) {
          setRequestId(res.requestId);
          try {
            localStorage.setItem("everleap.otp.requestId", String(res.requestId));
          } catch {}
        }
        setCooldown(30); // UI resend timer
      } catch (err) {
        console.error("send-otp failed", err);
        setError("Couldn’t send your code. Please try again.");
      }
    })();
  }, [contact]);

  // Cooldown ticker
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  // Guard: if no contact, bounce back to welcome
  useEffect(() => {
    const t = setTimeout(() => {
      if (!contact) router.replace("/welcome");
    }, 100);
    return () => clearTimeout(t);
  }, [contact, router]);

  const masked = useMemo(() => {
    if (!contact) return "";
    return contact.method === "email" ? maskEmail(contact.value) : prettyNanp(contact.value);
  }, [contact]);

  async function onVerify() {
    if (code.length !== 6 || !contact) {
      setError("Enter the 6-digit code.");
      setErrorCode(null);
      return;
    }
    if (!firstName.trim() || !lastName.trim() || (role !== "student" && role !== "supporter")) {
      setError("Please provide your first name, last name, and role.");
      setErrorCode(null);
      return;
    }

    setSubmitting(true);
    setError(null);
    setErrorCode(null);
    try {
      // 1) Verify OTP via BFF (sets HttpOnly cookies on success)
      const verify = await verifyOtpBff({
        code,
        contact,
        requestId: requestId || localStorage.getItem("everleap.otp.requestId") || undefined,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role,
      });

      if (!verify?.ok || !verify?.userId) {
        throw new Error(verify?.redirect || "Invalid or expired code.");
      }
      const userId = String(verify.userId);

      // 2) Mark verified (local UI hint for client components/header)
      try {
        localStorage.setItem("everleap.verified", "1");
      } catch {}
      try {
        localStorage.setItem("everleap.userId", userId);
      } catch {}

      // 3) Bootstrap profile (idempotent; harmless if already set)
      try {
        if (role && firstName.trim() && lastName.trim()) {
          const body: BootstrapBody = {
            role,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            ...(contact.method === "email" ? { email: contact.value } : { phone: contact.value }),
          };
          await bootstrapProfile(userId, body);
        }
      } catch (e) {
        console.warn("bootstrap-profile failed (continuing):", e);
      }

      // 4) Cleanup transient local keys and route
      try {
        localStorage.removeItem("everleap.otp.requestId");
      } catch {}

      const nextParam = search?.get("next") || "";
      const dest = verify.redirect || (nextParam.startsWith("/") ? nextParam : "/dashboard");
      router.push(dest);
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (e?.code === "USER_EXISTS") {
        setErrorCode("USER_EXISTS");
        setError("An account with this contact already exists.");
      } else {
        setError(typeof e?.message === "string" ? e.message : "Verification failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function resend() {
    if (!contact || cooldown > 0) return;
    setError(null);
    setErrorCode(null);
    setCode("");
    sendOtp(contact)
      .then((res) => {
        if (res?.requestId) {
          setRequestId(res.requestId);
          try {
            localStorage.setItem("everleap.otp.requestId", String(res.requestId));
          } catch {}
        }
        setCooldown(30);
        setResetCounter((c) => c + 1);
      })
      .catch(() => setError("Couldn’t resend your code. Try again in a moment."));
  }

  function useDifferentContact() {
    try {
      localStorage.removeItem("everleap.contact");
    } catch {}
    // optionally set welcome step back to contact
    try {
      const state = JSON.parse(localStorage.getItem("everleap.welcome") || "{}") as Record<string, unknown>;
      localStorage.setItem("everleap.welcome", JSON.stringify({ ...state, step: 4 }));
    } catch {}
    router.push("/welcome");
  }

  const channel = contact?.method === "email" ? "email" : "phone";
  const promptText =
    channel === "email"
      ? `We sent a 6-digit code to ${masked}.`
      : `We texted a 6-digit code to ${masked}.`;

  return (
    <div className="min-h-dvh bg-app flex flex-col">
      <SiteHeader />
      <main className="flex-1 grid place-items-center px-4">
        <ConversationChrome prompt={`Check your ${channel}.`} subtitle={promptText} revealInputAfterMs={300}>
          <section key={resetCounter} className="space-y-5">
            <div className="rounded-2xl card-surface p-5 ring-1 ring-black/5 shadow-sm">
              <OtpInput value={code} setValue={setCode} onComplete={onVerify} />
              {error && (
                <div className="mt-2 text-meta text-red-700" role="alert" aria-live="assertive">
                  {error}
                </div>
              )}

              {/* Special handling for existing accounts */}
              {errorCode === "USER_EXISTS" && (
                <div className="mt-3 rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-meta text-yellow-900">
                  <p className="mb-2">
                    It looks like you already have an account with this {channel}. You can sign in, or try a different
                    contact.
                  </p>
                  <div className="flex gap-2">
                    <a
                      href="/welcome-back"
                      className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold bg-yellow-600/90 text-white ring-1 ring-black/5 hover:bg-yellow-600"
                    >
                      Go to sign in
                    </a>
                    <button
                      type="button"
                      onClick={useDifferentContact}
                      className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold bg-white ring-1 ring-black/10 hover:bg-white/90"
                    >
                      Use a different contact
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onVerify}
                  disabled={submitting || code.length < 6}
                  className="flex-1 rounded-xl bg-tint/90 px-4 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-black/5 hover:bg-tint disabled:opacity-60"
                >
                  {submitting ? "Verifying…" : "Verify"}
                </button>
                <button
                  type="button"
                  onClick={resend}
                  disabled={cooldown > 0}
                  className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold bg-white/90 shadow-sm ring-1 ring-black/10 hover:bg-white disabled:opacity-60"
                >
                  {cooldown > 0 ? `Resend (${cooldown}s)` : "Resend code"}
                </button>
              </div>
            </div>
          </section>
        </ConversationChrome>
      </main>
      <SiteFooter />
    </div>
  );
}
