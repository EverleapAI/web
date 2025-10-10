export const dynamic = "force-static";

import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Link from "next/link";

export default function Accessibility() {
  return (
    <div className="min-h-dvh bg-app flex flex-col">
      <SiteHeader />

      {/* Vertically centered between header/footer */}
      <main className="flex-1 grid place-items-center px-4 py-10 md:py-14">
        <div className="w-full max-w-[65ch]">
          <section className="card-surface">
            <div className="p-6 md:p-7 lg:p-8 max-h-[70vh] overflow-auto">
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">
                Accessibility
              </h1>

              <div className="prose prose-slate prose-sm">
                <p>
                  Everleap is for everyone. We’re committed to delivering an
                  inclusive experience that’s usable with assistive technologies
                  and flexible for different needs and devices.
                </p>

                <h3>Our commitment</h3>
                <p>
                  We aim to meet or exceed <strong>WCAG 2.2 AA</strong> guidelines.
                  That includes keyboard operability, clear focus states,
                  sufficient color contrast, readable typography, motion
                  reduction support, and helpful labels for screen readers.
                </p>

                <h3>What we design for</h3>
                <ul>
                  <li>Full keyboard navigation and visible focus</li>
                  <li>Screen readers (e.g., VoiceOver, NVDA)</li>
                  <li>High contrast and reduced motion preferences</li>
                  <li>Responsive layouts for phones, tablets, and desktops</li>
                  <li>Clear, student-friendly language and guidance</li>
                </ul>

                <h3>Having trouble?</h3>
                <p>
                  If you find an accessibility issue or need an alternative
                  format, we want to help. Email{" "}
                  <a className="underline" href="mailto:tomtully@everleap.ai">
                    tomtully@everleap.ai
                  </a>{" "}
                  with a brief description, your browser or device, and any
                  assistive tech you’re using. We typically respond within a few
                  business days.
                </p>

                <p className="text-xs text-slate-500">
                  Last updated: {/* add date */}
                </p>
              </div>
            </div>
          </section>

          <div className="mt-6 text-center">
            <Link
              href="/welcome"
              className="text-sm text-slate-700 hover:text-slate-900"
            >
              ← Back to Welcome
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
