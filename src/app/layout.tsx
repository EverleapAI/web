// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { AiGuideHost } from "@/components/main/AiGuideHost";

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
    <html lang="en" data-theme="dark" suppressHydrationWarning>
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