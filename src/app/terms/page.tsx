"use client";

import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-app flex flex-col">
      <SiteHeader />

      {/* Vertically centered between header/footer + soft spotlight */}
      <main className="flex-1 grid place-items-center px-4 py-10 spotlight-white">
        <div className="w-full max-w-2xl">
          <section
            className="card-surface rounded-2xl"
            role="region"
            aria-labelledby="terms-title"
          >
            <div className="p-5">
              <h1 id="terms-title" className="mb-1 text-2xl font-semibold tracking-tight">
                Terms of Service
              </h1>
              <p className="mb-4 text-sm opacity-80">Last updated October 4, 2025</p>

              <article className="prose prose-sm prose-slate max-w-none">
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing or using Everleap, you agree to these Terms. If you do not
                  agree, do not use the service.
                </p>

                <h2>2. Eligibility &amp; Accounts</h2>
                <p>
                  You are responsible for your account credentials and for all activity
                  under your account. If you are under the age required by your local
                  laws, you must have consent from a parent or guardian.
                </p>

                <h2>3. Use of the Service</h2>
                <ul>
                  <li>Do not misuse, disrupt, or interfere with the service.</li>
                  <li>Do not attempt to access data you do not have permission to access.</li>
                  <li>Follow all applicable laws and regulations.</li>
                </ul>

                <h2>4. Content &amp; Feedback</h2>
                <p>
                  You retain ownership of content you submit. By submitting content or
                  feedback, you grant us a non-exclusive license to use it to operate and
                  improve the service.
                </p>

                <h2>5. Privacy</h2>
                <p>
                  Your use of the service is subject to our{" "}
                  <a href="/privacy">Privacy Policy</a>.
                </p>

                <h2>6. Third-Party Services</h2>
                <p>
                  We may link to or integrate third-party services. We are not responsible
                  for their content or practices.
                </p>

                <h2>7. Disclaimers</h2>
                <p>
                  The service is provided “as is” without warranties of any kind, to the
                  fullest extent permitted by law.
                </p>

                <h2>8. Limitation of Liability</h2>
                <p>
                  To the fullest extent permitted by law, Everleap will not be liable for
                  any indirect, incidental, special, consequential, or punitive damages.
                </p>

                <h2>9. Changes to the Service or Terms</h2>
                <p>
                  We may modify the service or these Terms from time to time. Updates will
                  be posted here with a revised “Last updated” date.
                </p>

                <h2>10. Contact</h2>
                <p>
                  Questions about these Terms? Email{" "}
                  <a href="mailto:legal@everleap.demoland.site">
                    legal@everleap.demoland.site
                  </a>.
                </p>
              </article>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
