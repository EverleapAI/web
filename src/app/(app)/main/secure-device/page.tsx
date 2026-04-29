"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { startRegistration } from "@simplewebauthn/browser";

export default function SecureDevicePage(): React.JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSetup() {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const startRes = await fetch(
        "/api/regauth/passkey/register/options",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const startData = await startRes.json().catch(() => null);

      if (!startRes.ok || !startData?.options) {
        setError(startData?.error || "Could not start setup.");
        return;
      }

      const credential = await startRegistration(startData.options);

      const verifyRes = await fetch(
        "/api/regauth/passkey/register/verify",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify(credential),
        }
      );

      const verifyData = await verifyRes.json().catch(() => null);

      if (!verifyRes.ok) {
        setError(verifyData?.error || "Could not save device.");
        return;
      }

      // ✅ mark passkey enabled for this device
      try {
        window.localStorage.setItem("everleap.passkey.enabled", "true");
      } catch {}

      router.replace("/main");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function skip() {
    router.replace("/main");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 text-white">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-2xl font-semibold">
          Use this device next time
        </h1>

        <p className="text-sm text-white/60">
          Skip the code. Use Face ID, Touch ID, or your device.
        </p>

        {error && (
          <p className="text-sm text-red-300">{error}</p>
        )}

        <div className="space-y-3">
          <button
            onClick={handleSetup}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-white text-black font-medium disabled:opacity-50"
          >
            {loading ? "Setting up…" : "Set it up"}
          </button>

          <button
            onClick={skip}
            disabled={loading}
            className="text-sm text-white/50 underline"
          >
            Not now
          </button>
        </div>
      </div>
    </main>
  );
}