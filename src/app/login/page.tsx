"use client";

import * as React from "react";
import {
  fetchJson,
  performAuthentication,
  performRegistration,
  hydrateSession,
  Endpoints,
  parseContact,
  type AuthnOptionsResponse,
  type RegOptionsResponse,
} from "@/lib/passkey";

/**
 * Everleap Passwordless Entry
 * --------------------------------------------------
 * Unified login + registration using WebAuthn passkeys.
 *
 * Flow:
 *  1) User enters email or phone → Continue
 *  2) Try authentication options (auth.options)
 *  3) If UNKNOWN_CONTACT → switch to registration (register.options)
 *  4) Complete passkey flow (get() or create())
 *  5) Verify → hydrate → redirect
 */

export default function LoginPage() {
  const [identifier, setIdentifier] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const contact = parseContact(identifier);
    if (!contact) {
      setError("Enter a valid email or phone number.");
      return;
    }

    setBusy(true);
    try {
      // 1️⃣ Attempt authentication first
      const auth = await fetchJson<AuthnOptionsResponse>(Endpoints.auth.options[0], {
        method: "POST",
        body: JSON.stringify({ contact }),
      });

      if (!auth.ok && auth.error === "UNKNOWN_CONTACT") {
        // 2️⃣ New user → begin registration flow
        const reg = await fetchJson<RegOptionsResponse>(Endpoints.register.options[0], {
          method: "POST",
          body: JSON.stringify({ contact }),
        });

        if (!reg.ok) throw new Error(reg.error || "Registration failed to start.");

        // Create new passkey credential
        const attestation = await performRegistration(reg.options);

        // Verify registration
        await fetchJson(Endpoints.register.verify[0], {
          method: "POST",
          body: JSON.stringify(attestation),
        });

        await hydrateSession();
        window.location.assign("/dashboard");
        return;
      }

      if (!auth.ok) throw new Error(auth.error || "Sign-in failed. Try again.");

      // 3️⃣ Existing user → authenticate
      const assertion = await performAuthentication(auth.options);

      await fetchJson(Endpoints.auth.verify[0], {
        method: "POST",
        body: JSON.stringify(assertion),
      });

      await hydrateSession();
      window.location.assign("/dashboard");
    } catch (err: unknown) {
      console.error("Auth error:", err);
      if (err instanceof Error) {
        setError(err.message || "Something went wrong.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex flex-col justify-center min-h-screen px-6 bg-white">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center">Sign in securely</h1>
        <p className="text-gray-500 text-center mt-2">
          Use your passkey — no passwords needed.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Email or phone"
            autoComplete="username"
            className="w-full border border-gray-300 rounded-xl h-12 px-4 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={busy}
            className="w-full h-12 rounded-xl bg-blue-600 text-white text-base font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {busy ? "Processing…" : "Continue"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-sm text-red-600">{error}</p>
        )}

        <p className="mt-8 text-xs text-center text-gray-400">
          Everleap • Secure by WebAuthn
        </p>
      </div>
    </main>
  );
}
