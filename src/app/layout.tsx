// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";
import { AiGuideHost } from "@/components/main/AiGuideHost";

// The reading face — the one the AGENT speaks in.
//
// Everything the app says about itself (buttons, labels, nav, counts) stays in
// the system UI font, because that is what it is: interface. But the read on
// Today is a person talking to you, and it was set in Segoe UI — the font
// Windows uses for its settings dialogs. No amount of leading tuning gets a
// settings dialog to feel like something written to you.
//
// Source Serif 4, self-hosted. Two things follow from it being VARIABLE:
//   1. weight 425 is finally a real weight. On the system stack it silently
//      snapped to 400, which is why the refresh doc's `font-weight: 425` was a
//      no-op — it was asking a static font for a weight it does not have.
//   2. no runtime font fetch, no CDN, no build-time network call. A push here
//      is a deploy, and the deploy does not get to depend on fonts.google.com
//      being up.
const reading = localFont({
  src: "../fonts/SourceSerif4-Variable.woff2",
  variable: "--font-read",
  weight: "200 900",
  display: "swap",
  preload: true,
  // If the face ever fails, land on a serif — not back on the UI sans, which
  // would silently undo the whole point.
  fallback: ["Georgia", "Cambria", "Times New Roman", "serif"],
});

export const metadata: Metadata = {
  title: "Everleap",
  description: "Public site",
};

// No server cookie/header reads
export const dynamic = "force-static";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const prepaint = `
    (function () {
      try {
        var doc = document.documentElement;

        // Match the app shell instead of forcing a white root.
        doc.setAttribute('data-theme', 'dark');

        // One-time cleanup of old theme state (prevents surprise legacy themes)
        try { localStorage.removeItem('everleap.theme'); } catch {}
        try { localStorage.removeItem('EL_Theme'); } catch {}
        try { document.cookie = 'EL_Theme=; Path=/; Max-Age=0; SameSite=Lax'; } catch {}
      } catch {}
    })();
  `;

  return (
    <html
      lang="en"
      data-theme="dark"
      className={reading.variable}
      suppressHydrationWarning
    >
      <head>
        {/* viewport-fit=cover is what makes env(safe-area-inset-*) resolve to a
            real number on iPhone. Without it every inset is 0 — so the bottom nav,
            which lifts itself by that inset, was sitting in the band iOS Safari
            reserves for its own toolbar, where the first tap expands the toolbar
            instead of reaching the button. The whole app already reads these
            insets (nav, toasts, modals, story footer); they just never had values. */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <script dangerouslySetInnerHTML={{ __html: prepaint }} />
      </head>
      <body>
        <Providers>
          {children}

          {/* Global Everleap AI guide overlay */}
          <AiGuideHost />
        </Providers>
      </body>
    </html>
  );
}