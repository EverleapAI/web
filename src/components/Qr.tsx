// apps/web/src/components/Qr.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Props = {
  /** The URL or text to encode */
  value: string;
  /** Pixel size of the QR image (square) */
  size?: number;
  /** Optional caption shown under the code */
  caption?: string;
  className?: string;
};

/**
 * Lightweight QR component.
 * - Tries to use the `qrcode` npm package (better quality, local rendering).
 * - If not available, gracefully falls back to a remote image QR service.
 *
 * Tip: for the best experience, install the local lib in your web app:
 *   npm i qrcode
 */
export default function Qr({ value, size = 180, caption, className }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [libOk, setLibOk] = useState<boolean>(false);

  // Remote fallback URL (no dependency); only used if local lib isn't present
  const fallbackSrc = useMemo(() => {
    const enc = encodeURIComponent(value);
    const clamped = Math.max(120, Math.min(size, 512));
    return `https://api.qrserver.com/v1/create-qr-code/?data=${enc}&size=${clamped}x${clamped}&margin=2`;
  }, [value, size]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Dynamically import, so the app works even if 'qrcode' isn't installed
        const QR = await import("qrcode"); // npm i qrcode
        if (cancelled) return;
        const url = await QR.toDataURL(value, {
          errorCorrectionLevel: "M",
          margin: 2,
          width: size,
        });
        if (!cancelled) {
          setDataUrl(url);
          setLibOk(true);
        }
      } catch {
        if (!cancelled) {
          setDataUrl(null);
          setLibOk(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [value, size]);

  return (
    <figure
      className={[
        "rounded-2xl card-surface p-3 w-full select-none",
        "flex flex-col items-center justify-center gap-2",
        className || "",
      ].join(" ")}
      aria-label="QR code"
    >
      <div
        className="rounded-xl overflow-hidden"
        style={{ width: size, height: size }}
      >
        <Image
          alt="QR code"
          src={dataUrl ?? fallbackSrc}
          width={size}
          height={size}
          className="block"
          // Disable optimization so we don't need to configure remote domains,
          // and so data: URLs render directly.
          unoptimized
          priority
        />
      </div>
      {caption ? (
        <figcaption className="text-[12px] opacity-80 text-center break-all px-1">
          {caption}
        </figcaption>
      ) : null}
      {!libOk && (
        <p className="text-[10px] opacity-60">
          Tip: <code className="px-1 py-0.5 rounded bg-black/5">npm i qrcode</code> for sharper local rendering
        </p>
      )}
    </figure>
  );
}
