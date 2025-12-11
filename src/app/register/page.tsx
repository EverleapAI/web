"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  fetchJson,
  performRegistration,
  hydrateSession,
  Endpoints,
  type RegOptionsResponse,
} from "@/lib/passkey";

/**
 * Dedicated Passkey Registration Page (new users only)
 * Uses shared helpers from @/lib/passkey
 *
 * Flow
 *  1) POST Endpoints.register.options[0]  -> creation options (JSON with b64url fields)
 *  2) navigator.credentials.create        -> attestation
 *  3) POST Endpoints.register.verify[0]   -> sets/refreshes HttpOnly session cookie
 *  4) GET  /api/me (hydrateSession)       -> reflect cookie, then redirect
 *
 * Query params supported for prefill:
 *   ?firstName=<name>&contact=<email|phone>
 */

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}
function isPhoneLike(v: string) {
  return /^[+()\-.\s0-9]{7,}$/.test(v.trim());
}

export default function RegisterPage() {
  const router = useRouter();
  const params = useSearchParams();

  const [firstName, setFirstName] = React.useState(params.get("firstName") ?? "");
  const [contact, setContact] = React.useState(params.get("contact") ?? "");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const contactMethod = React.useMemo<"email" | "phone" | null>(() => {
    if (!contact.trim()) return null;
    if (isEmail(contact)) return "email";
    if (isPhoneLike(contact)) return "phone";
    return null;
  }, [contact]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!firstName.trim()) return setError("Please enter your first name.");
    if (!contactMethod) return setError("Enter a valid email or phone number.");

    try {
      setBusy(true);

      // 1) Registration options from BFF (same-origin)
      const opts = await fetchJson<RegOptionsResponse>(Endpoints.register.options[0], {
        method: "POST",
        body: JSON.stringify({
          firstName: firstName.trim(),
          contact: { method: contactMethod, value: contact.trim() },
        }),
      });

      if (!opts?.ok) {
        setBusy(false);
        return setError(opts?.error || "Couldn’t start passkey registration.");
      }

      // 2) WebAuthn create()
      const attestation = await performRegistration(opts.options);
      if (!attestation) throw new Error("No credential returned (cancelled?)");

      // 3) Verify (sets HttpOnly cookie)
      await fetchJson(Endpoints.register.verify[0], {
        method: "POST",
        body: JSON.stringify(attestation),
      });

      // 4) Hydrate & go
      await hydrateSession();
      setSuccess(true);
      router.replace("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Registration failed.");
      } else {
        setError("Registration failed.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-2xl font-semibold">Create your Everleap account</h1>
      <p className="text-sm text-gray-600 mt-2">
        Create a passkey using Touch ID, Face ID, Windows Hello, or a security key.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">First name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Ada"
            autoComplete="given-name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email or phone</label>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="ada@example.com or +1 415 555 0199"
            autoComplete="username"
            inputMode="email"
          />
          <p className="text-xs text-gray-500 mt-1">
            We’ll bind your passkey to this identifier.
          </p>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl border px-4 py-3 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          {busy ? "Creating…" : "Create passkey"}
        </button>
      </form>

      {success && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          Passkey created! Redirecting…
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="mt-8 text-xs text-gray-500">
        Already have a passkey?{" "}
        <a href="/login" className="underline">
          Log in
        </a>
        .
      </div>
    </main>
  );
}
