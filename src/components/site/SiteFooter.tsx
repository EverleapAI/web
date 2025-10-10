"use client";

export default function SiteFooter() {
  return (
    <footer className="footer-quiet">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 text-xs text-slate-600">
        <p>© {new Date().getFullYear()} Everleap</p>
        <nav className="flex items-center gap-3">
          <a className="underline underline-offset-2" href="/privacy">Privacy</a>
          <a className="underline underline-offset-2" href="/terms">Terms</a>
          <a className="underline underline-offset-2" href="/accessibility">Accessibility</a>
        </nav>
      </div>
    </footer>
  );
}
