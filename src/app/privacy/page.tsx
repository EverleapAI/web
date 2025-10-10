"use client";

import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-app flex flex-col">
      <SiteHeader />

      {/* Vertically centered between header/footer + soft spotlight */}
      <main className="flex-1 grid place-items-center px-4 py-10 spotlight-white">
        <div className="w-full max-w-2xl">
          <section
            className="card-surface rounded-2xl"
            role="region"
            aria-labelledby="privacy-title"
          >
            <div className="p-5">
              <h1 id="privacy-title" className="mb-1 text-2xl font-semibold tracking-tight">
                Privacy Policy
              </h1>
              <p className="mb-4 text-sm opacity-80">Last updated October 4, 2025</p>

              <article className="prose prose-sm prose-slate max-w-none">
                <h2>Overview</h2>
                <p>
                  We respect your privacy. This page summarizes what we collect, why we
                  collect it, and how we protect it. Replace this stub with your finalized
                  policy text.
                </p>

                <h2>Information We Collect</h2>
                <ul>
                  <li>Account details (name, email) you provide</li>
                  <li>Usage data to improve product performance</li>
                  <li>Optional responses to questions you choose to answer</li>
                </ul>

                <h2>How We Use Information</h2>
                <ul>
                  <li>Provide and improve Everleap services</li>
                  <li>Communicate updates and support</li>
                  <li>Maintain safety, security, and integrity</li>
                </ul>

                <h2>Data Sharing</h2>
                <p>
                  We don’t sell your personal information. We may share data with trusted
                  processors who help us operate Everleap, bound by confidentiality and
                  security obligations.
                </p>

                <h2>Security</h2>
                <p>
                  We use industry-standard safeguards. No system is perfectly secure, so
                  please use a strong password and keep it confidential.
                </p>

                <h2>Your Choices</h2>
                <ul>
                  <li>Access, update, or delete your data (subject to legal limits)</li>
                  <li>Opt out of non-essential communications</li>
                </ul>

                <h2>Contact</h2>
                <p>
                  Questions? Email{" "}
                  <a href="mailto:privacy@everleap.demoland.site">
                    privacy@everleap.demoland.site
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
