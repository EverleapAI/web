"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import VoiceField from "@/components/site/VoiceField";
import RequireConsent from "@/components/site/RequireConsent";
import ConversationChrome from "@/components/conversation/ConversationChrome";
import { api } from "@/lib/api";
import {
  isWebAuthnAvailable,
  performRegistration,
  performAuthentication,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
} from "@/lib/webauthn";

/* ---- local helpers (match welcome page feel) ---- */
function clsx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
function isEmail(input: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.trim()); }
function normNanp(input: string) {
  const d = input.replace(/\D+/g, "");
  if (d.length === 11 && d.startsWith("1")) return d.slice(1);
  if (d.length === 10) return d;
  return null;
}
function toE164(input: string) { const n = normNanp(input); return n ? `+1${n}` : null; }
function stripTrailingPunct(s: string) { return s.trim().replace(/[.!?。、，。]+$/g, ""); }

function errMsg(e: unknown, fallback = "Something went wrong."): string {
  return e instanceof Error ? e.message : fallback;
}

/* ---- types for API responses (minimal) ---- */
type MagicRequestRes =
  | { ok: true; bridgeId?: string; debugUrl?: string }
  | { ok: false; error: string };

type WebAuthnOptionsOK<T> = { ok: true; options: T };
type WebAuthnOptionsErr = { ok: false; error: string };
type AuthnOptionsResponse = WebAuthnOptionsOK<PublicKeyCredentialRequestOptionsJSON> | WebAuthnOptionsErr;
type RegOptionsResponse = WebAuthnOptionsOK<PublicKeyCredentialCreationOptionsJSON> | WebAuthnOptionsErr;

export default function LoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [firstName, setFirstName] = useState("");
  const [contact, setContact] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // bridge UX
  const [bridgeId, setBridgeId] = useState<string | null>(null);
  const [debugUrl, setDebugUrl] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);

  // stage-in like welcome page
  const [showPrompt, setShowPrompt] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // 🔒 Always start fresh on /login (and clear any stale onboarding state)
  useEffect(() => {
    try {
      localStorage.removeItem("everleap.login");
      localStorage.removeItem("everleap.welcome");
      localStorage.removeItem("everleap.user");
      localStorage.removeItem("everleap.role");
      localStorage.removeItem("everleap.contact");
    } catch {}
    setFirstName("");
    setContact("");
    setStep(1);
  }, []);

  // animation staging
  useEffect(() => {
    setShowPrompt(false);
    setShowContent(false);
    const t1 = setTimeout(() => setShowPrompt(true), 100);
    const t2 = setTimeout(() => setShowContent(true), 260);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [step]);

  const webauthn = isWebAuthnAvailable();
  const progress = useMemo(() => (step === 1 ? 0.5 : 1), [step]);
  const headline = useMemo(() => {
    if (step === 1) return "Nice to meet you — what’s your first name?";
    return `Great, ${firstName || "friend"} — how can we reach you?`;
  }, [step, firstName]);

  function onFirstNameDone() {
    if (firstName.trim()) setStep(2);
  }

  function parseContact(rawInput: string): { method: "email" | "phone"; value: string } | null {
    const raw = rawInput.trim();
    if (isEmail(raw)) return { method: "email", value: raw.toLowerCase() };
    const e164 = toE164(raw);
    if (e164) return { method: "phone", value: e164 };
    return null;
  }

  async function doMagicLink() {
    setError(null);
    const parsed = parseContact(contact);
    if (!firstName.trim()) { setError("Please tell us your first name."); return; }
    if (!parsed) { setError("That doesn’t look like a valid email or US/Canada phone."); return; }

    setBusy(true);
    setBridgeId(null);
    setDebugUrl(null);
    try {
      // ⬇️ drop /api — goes to Functions via api.ts
      const res = await api.post<MagicRequestRes>("/auth/magic/request", {
        firstName: firstName.trim(),
        lastName: null,
        contact: { method: parsed.method, value: parsed.value },
        redirect: "/dashboard",
      });

      if (!res.ok) {
        setError(res.error || "Couldn’t send your link right now.");
        setBusy(false);
        return;
      }

      // show bridge wait UI if phone on desktop
      if (parsed.method === "phone" && (res.bridgeId || res.debugUrl)) {
        if (res.bridgeId) setBridgeId(res.bridgeId);
        if (res.debugUrl) setDebugUrl(res.debugUrl);
        startBridgePolling(res.bridgeId || null);
      } else {
        // email flow: show hint (and dev debug URL if present)
        if (res.debugUrl) setDebugUrl(res.debugUrl);
        setBusy(false);
      }
    } catch (e: unknown) {
      setError(errMsg(e, "Network error."));
      setBusy(false);
    }
  }

  function startBridgePolling(id: string | null) {
    if (!id) { setBusy(false); return; }
    setPolling(true);
    // Poll every 2s for readiness
    const iv = setInterval(async () => {
      try {
        // ⬇️ drop /api — goes to Functions via api.ts
        const r = await api.post<{ ok: boolean; ready?: boolean }>("/auth/magic/bridge/poll", { bridgeId: id });
        if (r?.ok && r.ready) {
          clearInterval(iv);
          setPolling(false);
          // Server mints session on poll → just reload
          window.location.reload();
        }
      } catch {
        clearInterval(iv);
        setPolling(false);
        setBusy(false);
      }
    }, 2000);
  }

  async function doPasskey() {
    setError(null);
    const parsed = parseContact(contact);
    if (!firstName.trim()) { setError("Please tell us your first name."); return; }
    if (!parsed) { setError("That doesn’t look like a valid email or US/Canada phone."); return; }

    setBusy(true);
    try {
      // 1) Try authentication first (best path)
      // ⬇️ drop /api — goes to Functions via api.ts
      const authOpts = await api.post<AuthnOptionsResponse>("/webauthn/authentication/options", {
        contact: { method: parsed.method, value: parsed.value },
      });

      if (authOpts.ok) {
        const assertionJSON = await performAuthentication(authOpts.options);
        // ⬇️ drop /api — goes to Functions via api.ts
        await fetch(api.url("/webauthn/authentication/verify"), {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assertionResponse: assertionJSON }),
          redirect: "follow",
        });
        router.replace("/dashboard");
        return;
      }

      // 2) If unknown contact → fall back to registration
      if (!authOpts.ok && authOpts.error === "UNKNOWN_CONTACT") {
        // ⬇️ drop /api — goes to Functions via api.ts
        const regOpts = await api.post<RegOptionsResponse>("/webauthn/registration/options", {
          firstName: firstName.trim(),
          contact: { method: parsed.method, value: parsed.value },
        });
        if (!regOpts.ok) {
          setError(regOpts.error || "Couldn’t start passkey.");
          setBusy(false);
          return;
        }

        const attJSON = await performRegistration(regOpts.options);
        // ⬇️ drop /api — goes to Functions via api.ts
        await fetch(api.url("/webauthn/registration/verify"), {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attestationResponse: attJSON }),
          redirect: "follow",
        });
        router.replace("/dashboard");
        return;
      }

      // Other errors from auth options
      setError(authOpts.error || "Passkey sign-in isn’t available right now.");
      setBusy(false);
    } catch (e: unknown) {
      setError(errMsg(e, "Passkey flow failed."));
      setBusy(false);
    }
  }

  /* ---------- UI blocks ---------- */
  const NameField = () => (
    <div className="space-y-3">
      <label className="sr-only">First name</label>
      <div className="rounded-2xl card-surface">
        <div className="p-3">
          <VoiceField
            placeholder="First name — e.g. Jordan"
            value={firstName}
            focusOnMount
            expect="free"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
            onMicResult={(text: string) => { const cleaned = stripTrailingPunct(text); if (cleaned.trim()) { setFirstName(cleaned); onFirstNameDone(); } }}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter" && firstName.trim()) onFirstNameDone(); }}
            onBlur={() => firstName.trim() && onFirstNameDone()}
          />
        </div>
      </div>
      {/* fixed tailwind class name */}
      <p className="text-[11px] opacity-70 pl-1">You can type or tap the mic and speak.</p>
    </div>
  );

  const ContactField = () => (
    <div className="space-y-3">
      <div className={clsx("rounded-2xl card-surface", error && "outline outline-2 outline-red-300")}>
        <div className="p-3">
          <VoiceField
            placeholder="Phone or email — e.g. (555) 123-4567 or you@example.com"
            value={contact}
            focusOnMount
            expect="contact"
            onChange={(e: ChangeEvent<HTMLInputElement>) => { setError(null); setContact(e.target.value); }}
            onMicResult={(t: string) => { const cleaned = stripTrailingPunct(t); if (cleaned.trim()) { setError(null); setContact(cleaned); } }}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") doMagicLink(); }}
            onBlur={() => contact.trim() && undefined}
          />
        </div>
      </div>
      {!error && <p className="text-[11px] opacity-70 pl-1">US/Canada phone or any valid email.</p>}
      {error && <p className="text-[12px] text-red-700">{error}</p>}
    </div>
  );

  /* ---------- Layout + actions ---------- */
  const promptClass =
    "transition-all duration-300 " + (showPrompt ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1");
  const contentClass =
    "mt-4 space-y-5 transition-all duration-300 " + (showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1");

  return (
    <RequireConsent>
      <div className="min-h-dvh bg-app flex flex-col">
        <SiteHeader />
        <main className="flex-1 grid place-items-center px-4">
          <ConversationChrome
            progress={progress}
            prompt={<span className={promptClass}>{headline}</span>}
          >
            <section className={contentClass}>
              {step === 1 && <NameField />}

              {step === 2 && (
                <div className="space-y-4">
                  <ContactField />

                  {/* Actions */}
                  <div className="space-y-3">
                    {webauthn && (
                      <button
                        type="button"
                        className="btn-primary w-full disabled:opacity-60"
                        onClick={doPasskey}
                        disabled={busy}
                      >
                        {busy ? "Working…" : "Continue with passkey"}
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn-secondary w-full disabled:opacity-60"
                      onClick={doMagicLink}
                      disabled={busy}
                    >
                      {busy ? "Sending…" : "Send me a link"}
                    </button>
                  </div>

                  {/* Bridge / debug hints */}
                  {(bridgeId || debugUrl) && (
                    <div className="rounded-2xl card-surface p-3 space-y-2">
                      {bridgeId && (
                        <p className="text-sm">
                          We sent a link to your phone. Open it and you’ll be signed in here automatically.
                          {polling ? " Waiting for your phone…" : ""}
                        </p>
                      )}
                      {debugUrl && (
                        <p className="text-xs opacity-80 break-all">
                          Dev shortcut: <a className="link" href={debugUrl}>Open magic link</a>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {step > 1 && (
                <div className="pt-2">
                  <button type="button" onClick={() => setStep(1)} className="btn-link">Back</button>
                </div>
              )}
            </section>
          </ConversationChrome>
        </main>
        <SiteFooter />
      </div>
    </RequireConsent>
  );
}
