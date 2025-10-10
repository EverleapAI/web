// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Everleap",
  description: "Public site",
};

// No server cookie/header reads
export const dynamic = "force-static";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Pre-paint: ensure the page is WHITE and clear any legacy theme keys once.
  const prepaint = `
    (function () {
      try {
        var doc = document.documentElement;
        // Force white before first paint
        doc.setAttribute('data-theme', 'white');

        // One-time cleanup of old theme state (prevents surprise "sand")
        try { localStorage.removeItem('everleap.theme'); } catch {}
        try { localStorage.removeItem('EL_Theme'); } catch {}
        try { document.cookie = 'EL_Theme=; Path=/; Max-Age=0; SameSite=Lax'; } catch {}
      } catch {}
    })();
  `;

  return (
    <html lang="en" data-theme="white" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: prepaint }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
