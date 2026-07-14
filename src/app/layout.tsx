// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { AiGuideHost } from "@/components/main/AiGuideHost";

// Inter — a SANS. Same family of shapes as Segoe UI / SF Pro, not a serif.
//
// The app had no font at all, so it rendered in the system UI stack, and that is
// the root of the weight problem: Segoe UI ships 300/400/600/700 and HAS NO 500.
// So on Windows every weight between 401 and 599 silently rounds — you can have
// thin or you can have semibold, and nothing in between. That is why 600 keeps
// looking like the only way to make the read less washy: on desktop it literally
// is. SF Pro on iOS does have a 500, so the two devices disagree, which is also
// why the phone and the laptop have never quite matched.
//
// Inter is variable: every weight from 100 to 900 is real, on every device.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
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
      className={inter.variable}
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