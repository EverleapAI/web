"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

export default function ConsentPage() {
  const router = useRouter();

  function accept() {
    try {
      localStorage.setItem("everleap.consentAccepted", "1");
    } catch {}
    router.push("/login");
  }

  function decline() {
    router.push("/");
  }

  return (
    <div className="min-h-dvh bg-app flex flex-col">
      <SiteHeader />

      {/* Vertically centered between header/footer (consistent pattern) */}
      <main className="flex-1 grid place-items-center px-4 py-10 spotlight-white">
        <div className="w-full max-w-md">
          <section
            className="card-surface rounded-2xl"
            role="region"
            aria-labelledby="consent-title"
          >
            <div className="p-5 space-y-4">
              <h1 id="consent-title" className="text-xl font-semibold tracking-tight">
                Consent to Participate
              </h1>

              <p className="text-sm opacity-80">
                Everleap asks for your consent to collect and process your answers so we can
                build your personalized profile and recommendations. You can withdraw consent at
                any time.
              </p>

              <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
                <li>We store your name and contact information.</li>
                <li>We analyze your responses to generate insights.</li>
                <li>
                  We keep your data private per our{" "}
                  <Link href="/privacy" className="underline underline-offset-2">
                    Privacy Policy
                  </Link>
                  .
                </li>
              </ul>

              <div className="pt-2 flex flex-col gap-3">
                <button type="button" onClick={accept} className="btn-primary w-full">
                  I Agree
                </button>
                <button type="button" onClick={decline} className="btn-muted w-full">
                  Not Now
                </button>
              </div>

              <p className="text-[11px] opacity-70">
                Questions? Email{" "}
                <a
                  className="underline underline-offset-2"
                  href="mailto:privacy@everleap.demoland.site"
                >
                  privacy@everleap.demoland.site
                </a>
                .
              </p>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
