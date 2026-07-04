"use client";

import * as React from "react";

/**
 * A generated "cosmic portrait" badge for a Time Twin. There are no real
 * photos of most historical figures, so instead of a shared placeholder image
 * each twin gets a deterministic abstract portrait: a silhouette lit from an
 * accent-colored nebula, with a scatter of stars. The layout is seeded from the
 * twin's name so it's stable across renders (same person always looks the same),
 * and a few stars twinkle unless the user prefers reduced motion.
 */

type RGB = { r: number; g: number; b: number };

type Props = {
  /** Used only as a deterministic seed so the same twin always renders the same. */
  seed: string;
  accentRgb: RGB;
  /** Rendered CSS size in px (the canvas backing store is scaled for DPR). */
  size?: number;
  className?: string;
  /** Turn off the twinkle animation regardless of user preference (e.g. tiny thumbnails). */
  static?: boolean;
  rounded?: number;
  /** Real library portrait to show instead of the generated canvas. Falls back
   *  to the canvas badge if the image is absent or fails to load. */
  imageUrl?: string;
};

function hashSeed(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function TimeTwinPortrait({
  seed,
  accentRgb,
  size = 92,
  className,
  static: isStatic = false,
  rounded,
  imageUrl,
}: Props) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const { r, g, b } = accentRgb;
  const [imgFailed, setImgFailed] = React.useState(false);

  // Reset the fallback flag when the source changes (e.g. switching twins).
  React.useEffect(() => {
    setImgFailed(false);
  }, [imageUrl]);

  const showImage = Boolean(imageUrl) && !imgFailed;

  React.useEffect(() => {
    if (showImage) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Bind to a non-null local so the narrowing survives inside the closures below.
    const c = ctx;

    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const px = size * dpr;
    canvas.width = px;
    canvas.height = px;

    const rng = mulberry32(hashSeed(seed));

    // Pre-generate a stable field of background stars.
    const starCount = Math.round(px * 0.06);
    const stars = Array.from({ length: starCount }, () => ({
      x: rng() * px,
      y: rng() * px * 0.74,
      radius: (rng() * 1.3 + 0.3) * dpr,
      baseAlpha: rng() * 0.55 + 0.18,
      // twinkle phase/speed
      phase: rng() * Math.PI * 2,
      speed: rng() * 0.9 + 0.4,
      twinkles: rng() > 0.55,
    }));

    const cornerRadius = (rounded ?? size * 0.24) * dpr;

    function roundedClip() {
      const rd = cornerRadius;
      c.beginPath();
      c.moveTo(rd, 0);
      c.arcTo(px, 0, px, px, rd);
      c.arcTo(px, px, 0, px, rd);
      c.arcTo(0, px, 0, 0, rd);
      c.arcTo(0, 0, px, 0, rd);
      c.closePath();
      c.clip();
    }

    function paint(time: number) {
      c.save();
      c.clearRect(0, 0, px, px);
      roundedClip();

      // Deep accent-biased ground.
      const bg = c.createLinearGradient(0, 0, px, px);
      bg.addColorStop(0, `rgb(${(r * 0.26) | 0}, ${(g * 0.26) | 0}, ${(b * 0.32) | 0})`);
      bg.addColorStop(0.55, `rgb(${(r * 0.13) | 0}, ${(g * 0.13) | 0}, ${(b * 0.18) | 0})`);
      bg.addColorStop(1, "#04050d");
      c.fillStyle = bg;
      c.fillRect(0, 0, px, px);

      // Nebula glow behind the head.
      const glow = c.createRadialGradient(px * 0.5, px * 0.42, 2, px * 0.5, px * 0.42, px * 0.55);
      glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.5)`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = glow;
      c.fillRect(0, 0, px, px);

      // Stars.
      for (const s of stars) {
        let alpha = s.baseAlpha;
        if (!isStatic && s.twinkles) {
          alpha = s.baseAlpha * (0.55 + 0.45 * Math.sin(time * 0.001 * s.speed + s.phase));
        }
        c.fillStyle = `rgba(255,255,255,${Math.max(0, alpha)})`;
        c.beginPath();
        c.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        c.fill();
      }

      // Silhouette: head + shoulders.
      c.fillStyle = "rgba(3,4,12,0.84)";
      c.beginPath();
      c.arc(px * 0.5, px * 0.44, px * 0.155, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.moveTo(px * 0.5, px * 0.56);
      c.quadraticCurveTo(px * 0.5, px * 0.63, px * 0.74, px * 0.8);
      c.lineTo(px * 0.74, px);
      c.lineTo(px * 0.26, px);
      c.lineTo(px * 0.26, px * 0.8);
      c.quadraticCurveTo(px * 0.5, px * 0.63, px * 0.5, px * 0.56);
      c.fill();

      // Accent rim light along the head.
      c.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
      c.lineWidth = Math.max(1.4, px * 0.006);
      c.beginPath();
      c.arc(px * 0.5, px * 0.44, px * 0.155, Math.PI * 0.88, Math.PI * 1.92);
      c.stroke();

      c.restore();
    }

    let raf = 0;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isStatic || prefersReduced) {
      paint(0);
    } else {
      const loop = (t: number) => {
        paint(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [seed, r, g, b, size, isStatic, rounded, showImage]);

  if (showImage) {
    return (
      <img
        src={imageUrl}
        alt={`Portrait of ${seed}`}
        width={size}
        height={size}
        onError={() => setImgFailed(true)}
        className={className}
        style={{
          width: size,
          height: size,
          display: "block",
          objectFit: "cover",
          borderRadius: rounded ?? size * 0.24,
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`Abstract portrait for ${seed}`}
      className={className}
      style={{ width: size, height: size, display: "block" }}
    />
  );
}

export default TimeTwinPortrait;
