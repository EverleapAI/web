// apps/web/src/components/site/RequireConsent.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * RequireConsent
 * - Authoritative (future-proof): optionally pings /api/consent/status if present (ignored if 404).
 * - Local fast-path: versioned consent object in localStorage ("everleap.consent").
 * - Legacy migrations: "everleap.consentAccepted" === "1" or "consent.accepted" === "true".
 * - DEV bypass: ?consent=1 sets current version accepted.
 * - Redirects to /consent?next=<current path+query> when not accepted.
 * - Shows a small fallback panel if redirect is slow/blocked.
 */

type ConsentRecord = {
  version: number;
  accepted: boolean;
  scopes?: string[];        // e.g., ["voice","analytics"]
  acceptedAtUtc?: string;   // ISO timestamp
};

const CONSENT_KEY = "everleap.consent";
const LEGACY_KEY_1 = "everleap.consentAccepted";
const LEGACY_KEY_2 = "consent.accepted";
const CONSENT_VERSION = 1; // bump when your consent text/terms meaningfully change

function readConsentLocal(): ConsentRecord | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (typeof parsed?.version === "number" && typeof parsed?.accepted === "boolean") {
      return parsed;
    }
  } catch {}
  return null;
}

function writeConsentLocal(rec: ConsentRecord) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(rec));
  } catch {}
}

function migrateLegacy(): ConsentRecord | null {
  // Legacy flags → write a minimal current record and return it
  try {
    const v1 = localStorage.getItem(LEGACY_KEY_1) === "1";
    const v2 = localStorage.getItem(LEGACY_KEY_2) === "true";
    const accepted = v1 || v2;
    if (accepted) {
      const rec: ConsentRecord = {
        version: CONSENT_VERSION,
        accepted: true,
        acceptedAtUtc: new Date().toISOString(),
      };
      writeConsentLocal(rec);
      return rec;
    }
  } catch {}
  return null;
}

function localOk(rec: ConsentRecord | null): boolean {
  if (!rec?.accepted) return false;
  // Require at least the current version (you can choose === if you need a forced re-consent)
  return rec.version >= CONSENT_VERSION;
}

function currentPathWithQuery(): string {
  try {
    const u = new URL(window.location.href);
    const path = u.pathname || "/";
    const qs = u.search || "";
    return path.startsWith("/") ? `${path}${qs}` : "/";
  } catch {
    return "/";
  }
}

export default function RequireConsent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<"checking" | "redirecting" | "ready">("checking");
  const [showFallback, setShowFallback] = useState(false);
  const redirectedRef = useRef(false);

  // Tiny delay before showing fallback UI, to avoid flicker on fast paths
  useEffect(() => {
    const t = window.setTimeout(() => setShowFallback(true), 350);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    let canceled = false;

    const check = async () => {
      try {
        // DEV bypass: ?consent=1 sets accepted= true @ current version
        try {
          const url = new URL(window.location.href);
          if (url.searchParams.get("consent") === "1") {
            writeConsentLocal({
              version: CONSENT_VERSION,
              accepted: true,
              acceptedAtUtc: new Date().toISOString(),
            });
          }
        } catch {}

        // Migrate legacy → new record if present
        const migrated = migrateLegacy();

        // Local fast-path
        const local = readConsentLocal() ?? migrated;
        if (localOk(local)) {
          if (!canceled) setState("ready");
          return;
        }

        // Optional authoritative ping (no-op if the route isn't wired yet)
        try {
          const res = await fetch("/api/consent/status", { method: "GET", cache: "no-store" });
          if (res.ok) {
            const data = (await res.json()) as Partial<ConsentRecord> & { accepted?: boolean };
            const serverAccepted = Boolean(data?.accepted);
            const serverVersion = typeof data?.version === "number" ? data.version : 0;
            if (serverAccepted && serverVersion >= CONSENT_VERSION) {
              // cache locally for faster subsequent checks
              writeConsentLocal({
                version: serverVersion,
                accepted: true,
                scopes: Array.isArray(data?.scopes) ? data.scopes : undefined,
                acceptedAtUtc:
                  typeof data?.acceptedAtUtc === "string"
                    ? data.acceptedAtUtc
                    : new Date().toISOString(),
              });
              if (!canceled) {
                setState("ready");
                return;
              }
            }
          }
        } catch {
          // ignore network/404 — we'll fall back to redirect
        }

        // Not accepted → go to /consent with a safe next param
        if (!canceled) {
          setState("redirecting");
          if (!redirectedRef.current) {
            redirectedRef.current = true;
            const next = encodeURIComponent(currentPathWithQuery());
            router.replace(`/consent?next=${next}`);
          }
        }
      } catch {
        // Safe default if anything goes wrong: redirect to consent
        if (!canceled) {
          setState("redirecting");
          if (!redirectedRef.current) {
            redirectedRef.current = true;
            const next = encodeURIComponent(currentPathWithQuery());
            router.replace(`/consent?next=${next}`);
          }
        }
      }
    };

    check();

    // Cross-tab sync: if consent is set elsewhere, unlock here
    const onStorage = (e: StorageEvent) => {
      if (e.key === CONSENT_KEY || e.key === LEGACY_KEY_1 || e.key === LEGACY_KEY_2) {
        const rec = readConsentLocal() ?? migrateLegacy();
        if (localOk(rec)) setState("ready");
      }
    };
    window.addEventListener("storage", onStorage);

    // Re-validate on tab visibility (covers server-side consent change)
    const onVisibility = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      canceled = true;
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [router]);

  if (state === "ready") return <>{children}</>;

  // Lightweight themed fallback (visible only if redirect is slow or blocked)
  return showFallback ? (
    <div className="min-h-dvh bg-app relative">
      <div className="absolute inset-0 tint-scrim" />
      <div className="relative z-10 flex min-h-dvh items-center justify-center px-4">
        <section
          className="w-full max-w-sm rounded-2xl card-surface ring-1 ring-black/5 shadow-sm p-5 space-y-3 text-center"
          role="status"
          aria-busy="true"
          aria-live="polite"
        >
          <h1 className="text-lg font-semibold tracking-tight drop-shadow-sm">One moment…</h1>
          <p className="text-sm opacity-80">We’re making sure you’ve agreed to the consent notice.</p>
          <div className="flex items-center justify-center">
            <span className="inline-block h-2 w-24 overflow-hidden rounded-full bg-black/10">
              <span className="block h-full w-1/3 animate-pulse bg-[rgb(var(--accent-rgb))]" />
            </span>
          </div>
          <div className="pt-2">
            <a
              href={`/consent?next=${encodeURIComponent(currentPathWithQuery())}`}
              className="inline-flex items-center justify-center rounded-xl bg-tint/90 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-black/5 transition-transform hover:bg-tint active:scale-[0.99]"
            >
              Go to consent
            </a>
          </div>
          <p className="text-micro opacity-70">
            Tip: add <code>?consent=1</code> to the URL in dev.
          </p>
        </section>
      </div>
    </div>
  ) : null;
}
