"use client";

export default function GlobalError(
  {
    error,
    reset,
  }: {
    error: Error & { digest?: string };
    reset?: () => void;
  }
) {
  // Inline styles so this renders even if global CSS fails to load.
  const wrapStyle: React.CSSProperties = {
    minHeight: "100svh",
    backgroundColor: "#FBFBFD",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    color: "#0f172a",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
  };

  const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 560,
    background: "#fff",
    border: "1px solid rgba(15,23,42,.08)",
    borderRadius: 16,
    boxShadow: "0 2px 10px rgba(15,23,42,.07)",
    padding: 20,
  };

  const buttonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    padding: "10px 14px",
    fontWeight: 600,
    backgroundColor: "rgb(10,132,255)",
    color: "#fff",
    border: "1px solid rgba(0,0,0,.05)",
    boxShadow: "0 8px 22px rgba(10,132,255,.22), 0 1px 0 rgba(255,255,255,.45) inset",
    cursor: "pointer",
    marginTop: 8,
  };

  return (
    <html lang="en" data-theme="white" suppressHydrationWarning>
      <body>
        <div style={wrapStyle}>
          <div style={cardStyle} role="alert" aria-live="assertive">
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, marginBottom: 6 }}>
              Something went wrong
            </h1>
            <p style={{ marginTop: 0, marginBottom: 12, opacity: 0.85 }}>
              Please try again in a moment.
            </p>

            {(process.env.NODE_ENV === "development") && (
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: 12,
                  background: "#F8FAFF",
                  border: "1px solid rgba(15,23,42,.08)",
                  borderRadius: 8,
                  padding: 12,
                  overflow: "auto",
                }}
              >
                {String(error?.message || "Unknown error")}
                {error?.digest ? `\n\nDigest: ${error.digest}` : ""}
              </pre>
            )}

            <div>
              <button
                type="button"
                style={buttonStyle}
                onClick={() => {
                  if (typeof reset === "function") reset();
                  else window.location.reload();
                }}
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
