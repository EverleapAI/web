"use client";

import * as React from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as Toast from "@radix-ui/react-toast";

/** Supported global themes (palettes) */
export type ThemeName = "sand" | "ocean" | "pilot" | "mint";

/** Cycle order for the toggle control */
const TOGGLE_ORDER: ThemeName[] = ["sand", "ocean", "pilot", "mint"];

/** Normalize and validate a theme string (with legacy mapping) */
function coerceTheme(t: string | null | undefined): ThemeName {
  const v = (t || "").toLowerCase();
  // legacy aliases -> map to mint
  if (v === "midnight" || v === "dark") return "mint";
  if (v === "sand" || v === "ocean" || v === "pilot" || v === "mint") return v;
  return "sand";
}

/** Persist to localStorage + cookie for SSR parity */
function persistTheme(theme: ThemeName) {
  try {
    window.localStorage.setItem("EL_Theme", theme);
  } catch {}
  try {
    const maxAge = 365 * 24 * 60 * 60;
    const secure =
      typeof window !== "undefined" && window.location.protocol === "https:";
    document.cookie = `EL_Theme=${theme}; Path=/; Max-Age=${maxAge}; SameSite=Lax${
      secure ? "; Secure" : ""
    }`;
  } catch {}
}

/** Apply to <html data-theme="..."> */
function applyTheme(theme: ThemeName) {
  document.documentElement.setAttribute("data-theme", theme);
}

/** Context */
type ThemeCtx = {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  toggle: () => void;
};
const ThemeContext = React.createContext<ThemeCtx | null>(null);

export function useTheme(): ThemeCtx {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <Providers>.");
  return ctx;
}

/** Determine initial theme on the client */
function getInitialTheme(): ThemeName {
  const fromHtml = document.documentElement.getAttribute("data-theme");
  if (fromHtml) return coerceTheme(fromHtml);

  try {
    const ls = window.localStorage.getItem("EL_Theme");
    if (ls) return coerceTheme(ls);
  } catch {}

  return "sand";
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<ThemeName>(() => {
    if (typeof document === "undefined") return "sand";
    return getInitialTheme();
  });

  React.useEffect(() => {
    applyTheme(theme);
    persistTheme(theme);
    window.dispatchEvent(
      new CustomEvent("everleap:themechange", { detail: { theme } })
    );
  }, [theme]);

  // Sync across tabs
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "EL_Theme" && e.newValue) {
        setThemeState(coerceTheme(e.newValue));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setTheme = React.useCallback(
    (t: ThemeName) => setThemeState(coerceTheme(t)),
    []
  );

  const toggle = React.useCallback(() => {
    const idx = TOGGLE_ORDER.indexOf(theme);
    const next = TOGGLE_ORDER[(idx + 1) % TOGGLE_ORDER.length];
    setThemeState(next);
  }, [theme]);

  const value = React.useMemo(
    () => ({ theme, setTheme, toggle }),
    [theme, setTheme, toggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Toast.Provider swipeDirection="right" duration={4000}>
          {children}
          {process.env.NODE_ENV !== "production" ? (
            <ReactQueryDevtools initialIsOpen={false} />
          ) : null}
          <Toast.Viewport className="fixed bottom-4 right-4 z-[9999] w-[360px] max-w-[calc(100vw-2rem)] outline-none" />
        </Toast.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
