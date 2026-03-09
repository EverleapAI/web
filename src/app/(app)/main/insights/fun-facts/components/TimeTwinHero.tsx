"use client";

import Image from "next/image";
import * as React from "react";

type RGB = {
  r: number;
  g: number;
  b: number;
};

type TimeTwinVisualTheme =
  | "inventor-parchment"
  | "inventor-electric"
  | "scientist-luminous"
  | "logic-victorian"
  | "code-shadow"
  | "cosmic-wonder"
  | "geometry-marble"
  | "future-dusk"
  | "painter-bloom"
  | "ink-moon";

type TimeTwinPortraitArchetype =
  | "inventor"
  | "scientist"
  | "mathematician"
  | "coder"
  | "cosmic-guide"
  | "philosopher"
  | "futurist"
  | "artist"
  | "writer";

type TimeTwinHeroPattern =
  | "sketch"
  | "coil"
  | "glass"
  | "diagram"
  | "grid"
  | "stars"
  | "geometry"
  | "skyline"
  | "paint"
  | "ink";

export type TimeTwinHeroAlternate = {
  id: string;
  name: string;
  accentRgb: RGB;
};

type TimeTwinHeroProps = {
  name: string;
  era: string;
  tagline: string;
  mindType: string;

  heroImage?: string;
  portraitImage?: string;

  visualTheme?: TimeTwinVisualTheme;
  portraitArchetype?: TimeTwinPortraitArchetype;
  heroPattern?: TimeTwinHeroPattern;

  accentRgb: RGB;

  alternates?: TimeTwinHeroAlternate[];
  onSelectAlternate?: (id: string) => void;
};

type StarPosition = {
  wrapper: string;
  label: string;
  size: string;
  nameAlign: string;
};

const PLACEHOLDER_PORTRAIT = "/time-twins/placeholder.png";

const STAR_POSITIONS: StarPosition[] = [
  {
    wrapper:
      "left-[4.5%] top-[13%] sm:left-[6%] sm:top-[13%] md:left-[7%] md:top-[14%]",
    label: "left-0 top-full mt-2",
    size: "h-[20px] w-[20px] sm:h-[22px] sm:w-[22px]",
    nameAlign: "items-start text-left",
  },
  {
    wrapper:
      "right-[4.5%] top-[12%] sm:right-[6%] sm:top-[11%] md:right-[7%] md:top-[13%]",
    label: "right-0 top-full mt-2",
    size: "h-[18px] w-[18px] sm:h-[20px] sm:w-[20px]",
    nameAlign: "items-end text-right",
  },
  {
    wrapper:
      "left-[5.5%] bottom-[16%] sm:left-[7%] sm:bottom-[15%] md:left-[8%] md:bottom-[17%]",
    label: "left-0 bottom-full mb-2",
    size: "h-[17px] w-[17px] sm:h-[19px] sm:w-[19px]",
    nameAlign: "items-start text-left",
  },
  {
    wrapper:
      "right-[5.5%] bottom-[17%] sm:right-[7%] sm:bottom-[16%] md:right-[8%] md:bottom-[18%]",
    label: "right-0 bottom-full mb-2",
    size: "h-[20px] w-[20px] sm:h-[22px] sm:w-[22px]",
    nameAlign: "items-end text-right",
  },
];

function rgba(rgb: RGB, alpha: number) {
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function safeSrc(value?: string) {
  const v = String(value ?? "").trim();
  return v.length > 0 ? v : undefined;
}

function heroBackgroundClass(theme?: TimeTwinVisualTheme) {
  switch (theme) {
    case "inventor-parchment":
      return "bg-[radial-gradient(circle_at_50%_18%,rgba(255,231,184,0.32),transparent_30%),radial-gradient(circle_at_50%_40%,rgba(255,210,120,0.14),transparent_42%),linear-gradient(180deg,rgba(66,48,30,0.86),rgba(14,11,9,0.985))]";
    case "inventor-electric":
      return "bg-[radial-gradient(circle_at_50%_16%,rgba(120,180,255,0.36),transparent_30%),radial-gradient(circle_at_46%_38%,rgba(88,140,255,0.16),transparent_42%),linear-gradient(180deg,rgba(10,28,58,0.86),rgba(4,8,18,0.985))]";
    case "scientist-luminous":
      return "bg-[radial-gradient(circle_at_50%_16%,rgba(140,255,200,0.28),transparent_30%),radial-gradient(circle_at_55%_38%,rgba(90,220,170,0.14),transparent_42%),linear-gradient(180deg,rgba(18,44,36,0.86),rgba(6,12,10,0.985))]";
    case "logic-victorian":
      return "bg-[radial-gradient(circle_at_50%_16%,rgba(200,150,255,0.30),transparent_30%),radial-gradient(circle_at_50%_38%,rgba(160,110,255,0.14),transparent_42%),linear-gradient(180deg,rgba(40,22,58,0.86),rgba(11,8,17,0.985))]";
    case "code-shadow":
      return "bg-[radial-gradient(circle_at_50%_16%,rgba(120,220,210,0.28),transparent_30%),radial-gradient(circle_at_50%_38%,rgba(60,180,160,0.14),transparent_42%),linear-gradient(180deg,rgba(8,29,34,0.88),rgba(5,10,12,0.988))]";
    case "cosmic-wonder":
      return "bg-[radial-gradient(circle_at_50%_16%,rgba(110,140,255,0.34),transparent_30%),radial-gradient(circle_at_48%_34%,rgba(170,120,255,0.16),transparent_42%),linear-gradient(180deg,rgba(12,20,56,0.88),rgba(5,7,16,0.988))]";
    case "geometry-marble":
      return "bg-[radial-gradient(circle_at_50%_16%,rgba(175,205,255,0.26),transparent_30%),radial-gradient(circle_at_52%_38%,rgba(130,150,235,0.12),transparent_42%),linear-gradient(180deg,rgba(24,28,42,0.86),rgba(8,10,18,0.988))]";
    case "future-dusk":
      return "bg-[radial-gradient(circle_at_50%_16%,rgba(255,145,120,0.30),transparent_30%),radial-gradient(circle_at_48%_38%,rgba(255,95,125,0.14),transparent_42%),linear-gradient(180deg,rgba(48,22,28,0.88),rgba(10,8,14,0.988))]";
    case "painter-bloom":
      return "bg-[radial-gradient(circle_at_50%_16%,rgba(255,110,150,0.34),transparent_30%),radial-gradient(circle_at_55%_38%,rgba(255,165,115,0.16),transparent_42%),linear-gradient(180deg,rgba(58,18,34,0.88),rgba(14,7,12,0.988))]";
    case "ink-moon":
      return "bg-[radial-gradient(circle_at_50%_16%,rgba(205,165,235,0.28),transparent_30%),radial-gradient(circle_at_52%_38%,rgba(140,120,220,0.12),transparent_42%),linear-gradient(180deg,rgba(28,20,38,0.88),rgba(8,7,13,0.988))]";
    default:
      return "bg-[radial-gradient(circle_at_50%_16%,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.06),transparent_42%),linear-gradient(180deg,rgba(22,22,28,0.84),rgba(8,8,12,0.985))]";
  }
}

function PatternOverlay({
  pattern,
  accentRgb,
}: {
  pattern?: TimeTwinHeroPattern;
  accentRgb: RGB;
}) {
  const faint = rgba(accentRgb, 0.08);
  const line = rgba(accentRgb, 0.16);

  switch (pattern) {
    case "sketch":
      return (
        <div className="absolute inset-0 opacity-60">
          <div
            className="absolute left-[10%] top-[24%] h-px w-[34%] rotate-[-8deg]"
            style={{ background: line }}
          />
          <div
            className="absolute left-[20%] top-[40%] h-px w-[28%] rotate-[10deg]"
            style={{ background: faint }}
          />
          <div
            className="absolute right-[12%] top-[30%] h-px w-[28%] rotate-[-12deg]"
            style={{ background: faint }}
          />
        </div>
      );

    case "coil":
      return (
        <div className="absolute inset-0 opacity-55">
          <div
            className="absolute left-[15%] top-[18%] h-24 w-24 rounded-full border"
            style={{ borderColor: line }}
          />
          <div
            className="absolute left-[20%] top-[23%] h-16 w-16 rounded-full border"
            style={{ borderColor: faint }}
          />
          <div
            className="absolute right-[14%] top-[24%] h-28 w-28 rounded-full border"
            style={{ borderColor: line }}
          />
        </div>
      );

    case "glass":
      return (
        <div className="absolute inset-0 opacity-55">
          <div
            className="absolute left-[13%] top-[22%] h-24 w-16 rounded-[999px_999px_20px_20px] border"
            style={{ borderColor: line }}
          />
          <div
            className="absolute right-[16%] top-[20%] h-28 w-20 rounded-[999px_999px_22px_22px] border"
            style={{ borderColor: faint }}
          />
        </div>
      );

    case "diagram":
      return (
        <div className="absolute inset-0 opacity-55">
          <div
            className="absolute left-[12%] top-[20%] h-16 w-24 rounded-xl border"
            style={{ borderColor: line }}
          />
          <div
            className="absolute right-[13%] top-[22%] h-20 w-20 rounded-xl border"
            style={{ borderColor: faint }}
          />
          <div
            className="absolute left-[36%] top-[28%] h-px w-[14%]"
            style={{ background: line }}
          />
        </div>
      );

    case "grid":
      return (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(${faint} 1px, transparent 1px),
              linear-gradient(90deg, ${faint} 1px, transparent 1px)
            `,
            backgroundSize: "26px 26px",
          }}
        />
      );

    case "stars":
      return (
        <div className="absolute inset-0 opacity-55">
          <div
            className="absolute left-[18%] top-[22%] h-1.5 w-1.5 rounded-full"
            style={{ background: rgba(accentRgb, 0.48) }}
          />
          <div
            className="absolute left-[35%] top-[14%] h-1 w-1 rounded-full"
            style={{ background: rgba(accentRgb, 0.28) }}
          />
          <div
            className="absolute right-[18%] top-[20%] h-1.5 w-1.5 rounded-full"
            style={{ background: rgba(accentRgb, 0.42) }}
          />
          <div
            className="absolute right-[34%] top-[36%] h-1 w-1 rounded-full"
            style={{ background: rgba(accentRgb, 0.26) }}
          />
        </div>
      );

    case "geometry":
      return (
        <div className="absolute inset-0 opacity-50">
          <div
            className="absolute left-[12%] top-[24%] h-20 w-20 rotate-45 border"
            style={{ borderColor: line }}
          />
          <div
            className="absolute right-[18%] top-[22%] h-20 w-20 border"
            style={{ borderColor: faint }}
          />
        </div>
      );

    case "skyline":
      return (
        <div className="absolute inset-0 opacity-40">
          <div
            className="absolute bottom-0 left-0 right-0 h-16"
            style={{
              background: `linear-gradient(180deg, transparent, ${rgba(
                accentRgb,
                0.08
              )})`,
            }}
          />
        </div>
      );

    case "paint":
      return (
        <div className="absolute inset-0 opacity-50">
          <div
            className="absolute left-[8%] top-[20%] h-20 w-28 rounded-full blur-2xl"
            style={{ background: rgba(accentRgb, 0.16) }}
          />
          <div
            className="absolute right-[12%] top-[16%] h-24 w-24 rounded-full blur-2xl"
            style={{ background: rgba(accentRgb, 0.14) }}
          />
        </div>
      );

    case "ink":
      return (
        <div className="absolute inset-0 opacity-50">
          <div
            className="absolute left-[10%] top-[18%] h-24 w-28 rounded-full blur-2xl"
            style={{ background: rgba(accentRgb, 0.12) }}
          />
          <div
            className="absolute right-[14%] top-[24%] h-24 w-32 rounded-full blur-2xl"
            style={{ background: rgba(accentRgb, 0.08) }}
          />
        </div>
      );

    default:
      return null;
  }
}

function PortraitBadge({
  portraitImage,
  name,
  accentRgb,
}: {
  portraitImage?: string;
  name: string;
  accentRgb: RGB;
}) {
  const glow = rgba(accentRgb, 0.46);
  const border = rgba(accentRgb, 0.34);
  const [src, setSrc] = React.useState<string>(
    safeSrc(portraitImage) ?? PLACEHOLDER_PORTRAIT
  );

  React.useEffect(() => {
    setSrc(safeSrc(portraitImage) ?? PLACEHOLDER_PORTRAIT);
  }, [portraitImage]);

  return (
    <div
      className="relative mb-3 h-[78px] w-[78px] overflow-hidden rounded-[22px] border bg-black/35 backdrop-blur md:mb-4 md:h-[92px] md:w-[92px]"
      style={{
        borderColor: border,
        boxShadow: `0 0 0 1px ${rgba(
          accentRgb,
          0.14
        )}, 0 0 42px ${glow}, 0 18px 40px rgba(0,0,0,0.28)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: `
            linear-gradient(180deg, ${rgba(accentRgb, 0.18)}, transparent 38%),
            radial-gradient(circle at 50% 0%, rgba(255,255,255,0.12), transparent 36%)
          `,
        }}
      />
      <Image
        src={src}
        alt={name}
        fill
        sizes="92px"
        className="object-cover"
        onError={() => {
          if (src !== PLACEHOLDER_PORTRAIT) {
            setSrc(PLACEHOLDER_PORTRAIT);
          }
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-10 bg-gradient-to-t from-black/34 to-transparent" />
    </div>
  );
}

function ConstellationStars({
  alternates,
  onSelectAlternate,
}: {
  alternates: TimeTwinHeroAlternate[];
  onSelectAlternate?: (id: string) => void;
}) {
  const visibleAlternates = alternates.slice(0, 4);

  if (visibleAlternates.length === 0) return null;

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-[6]">
        <div className="absolute inset-x-[14%] top-[28%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-x-[16%] bottom-[23%] h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        <div className="absolute left-[16%] top-[22%] h-[42%] w-px bg-gradient-to-b from-white/6 via-white/10 to-transparent" />
        <div className="absolute right-[16%] top-[20%] h-[46%] w-px bg-gradient-to-b from-white/6 via-white/10 to-transparent" />
      </div>

      {visibleAlternates.map((alternate, index) => {
        const position = STAR_POSITIONS[index] ?? STAR_POSITIONS[0];
        const bright = rgba(alternate.accentRgb, 0.85);
        const mid = rgba(alternate.accentRgb, 0.3);
        const faint = rgba(alternate.accentRgb, 0.18);

        return (
          <button
            key={alternate.id}
            type="button"
            onClick={() => onSelectAlternate?.(alternate.id)}
            className={[
              "group absolute z-[30] flex flex-col",
              "transition-transform duration-300 ease-out",
              "hover:scale-[1.08] active:scale-[0.98]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
              position.wrapper,
              position.nameAlign,
            ].join(" ")}
            aria-label={`Show ${alternate.name}`}
            title={alternate.name}
          >
            <span
              className={[
                "relative flex items-center justify-center rounded-full border border-white/16 bg-white/8 backdrop-blur-md",
                "transition duration-300 group-hover:border-white/30 group-hover:bg-white/12",
                "animate-[pulse_3.2s_ease-in-out_infinite]",
                position.size,
              ].join(" ")}
              style={{
                boxShadow: `0 0 0 1px rgba(255,255,255,0.03), 0 0 18px ${faint}, 0 0 34px ${mid}`,
              }}
            >
              <span
                className="absolute inset-[-10px] rounded-full blur-xl opacity-70 transition duration-300 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle, ${bright} 0%, ${mid} 48%, transparent 76%)`,
                }}
              />
              <span
                className="relative h-1.5 w-1.5 rounded-full"
                style={{
                  background: `rgb(${alternate.accentRgb.r}, ${alternate.accentRgb.g}, ${alternate.accentRgb.b})`,
                  boxShadow: `0 0 14px ${bright}`,
                }}
              />
            </span>

            <span
              className={[
                "mt-2 max-w-[112px] text-[10px] font-medium leading-[1.2] text-white/68",
                "transition duration-300 group-hover:text-white/92",
                "sm:max-w-[124px] sm:text-[11px]",
              ].join(" ")}
            >
              {alternate.name}
            </span>
          </button>
        );
      })}
    </>
  );
}

export function TimeTwinHero({
  name,
  era,
  tagline,
  heroImage,
  portraitImage,
  visualTheme,
  heroPattern,
  accentRgb,
  alternates = [],
  onSelectAlternate,
}: TimeTwinHeroProps) {
  const glow = rgba(accentRgb, 0.4);
  const realHeroSrc = safeSrc(heroImage);

  return (
    <section className="relative w-full">
      <div
        className="pointer-events-none absolute inset-x-4 -top-10 h-[180px] rounded-full blur-[90px] md:inset-x-8 md:-top-12 md:h-[220px]"
        aria-hidden
        style={{
          background: `radial-gradient(circle, ${rgba(
            accentRgb,
            0.22
          )} 0%, transparent 70%)`,
        }}
      />

      <div
        className="relative overflow-hidden rounded-[30px] border bg-black/30"
        style={{
          borderColor: rgba(accentRgb, 0.18),
          boxShadow: `0 28px 72px rgba(0,0,0,0.36), 0 0 0 1px ${rgba(
            accentRgb,
            0.08
          )}, 0 0 44px ${rgba(accentRgb, 0.14)}`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px"
          aria-hidden
          style={{
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.62) 16%, ${rgba(
              accentRgb,
              0.62
            )} 50%, rgba(255,255,255,0.42) 84%, transparent)`,
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          aria-hidden
          style={{
            background: `
              linear-gradient(180deg, rgba(255,255,255,0.16), transparent 13%, transparent 84%, rgba(255,255,255,0.03)),
              linear-gradient(90deg, ${rgba(accentRgb, 0.14)}, transparent 22%, transparent 78%, ${rgba(
              accentRgb,
              0.06
            )})
            `,
          }}
        />

        {realHeroSrc ? (
          <div className="absolute inset-0">
            <Image
              src={realHeroSrc}
              alt={name}
              fill
              priority
              className="object-cover opacity-[0.24]"
            />
          </div>
        ) : (
          <div
            className={["absolute inset-0", heroBackgroundClass(visualTheme)].join(" ")}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(circle at 50% 18%, rgba(255,255,255,0.11), transparent 30%),
                  radial-gradient(circle at 28% 58%, rgba(140,180,255,0.08), transparent 42%),
                  radial-gradient(circle at 72% 50%, rgba(200,120,255,0.08), transparent 42%)
                `,
              }}
            />

            <div
              className="absolute inset-0 opacity-80"
              style={{
                backgroundImage: `
                  radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.82), transparent),
                  radial-gradient(1.5px 1.5px at 80% 20%, rgba(255,255,255,0.70), transparent),
                  radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.66), transparent),
                  radial-gradient(1px 1px at 60% 40%, rgba(255,255,255,0.56), transparent),
                  radial-gradient(1.5px 1.5px at 75% 80%, rgba(255,255,255,0.70), transparent),
                  radial-gradient(1px 1px at 14% 56%, rgba(255,255,255,0.58), transparent),
                  radial-gradient(1.5px 1.5px at 52% 16%, rgba(255,255,255,0.64), transparent),
                  radial-gradient(1px 1px at 88% 62%, rgba(255,255,255,0.56), transparent)
                `,
              }}
            />
          </div>
        )}

        <PatternOverlay pattern={heroPattern} accentRgb={accentRgb} />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 50% 20%, ${rgba(
                accentRgb,
                0.26
              )}, transparent 28%),
              radial-gradient(circle at 50% 34%, ${rgba(
                accentRgb,
                0.10
              )}, transparent 44%)
            `,
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/42 to-black/88" />

        <div
          className="pointer-events-none absolute left-1/2 top-[-56px] z-[4] h-[190px] w-[190px] -translate-x-1/2 rounded-full blur-[90px] md:top-[-72px] md:h-[250px] md:w-[250px]"
          style={{ background: glow }}
        />

        <ConstellationStars
          alternates={alternates}
          onSelectAlternate={onSelectAlternate}
        />

        <div className="relative z-[12] flex min-h-[198px] flex-col items-center px-5 pb-5 pt-6 text-center md:min-h-[244px] md:px-6 md:pb-6 md:pt-8">
          <PortraitBadge
            portraitImage={portraitImage}
            name={name}
            accentRgb={accentRgb}
          />

          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50 md:text-[11px]">
            Your Time Twin
          </div>

          <h1 className="max-w-[520px] text-[24px] font-semibold tracking-[-0.03em] text-white md:text-[34px]">
            {name}
          </h1>

          <div className="mt-1 text-[12px] text-white/62 md:text-[13px]">
            {era}
          </div>

          <p className="mt-3 max-w-[460px] text-[15px] leading-7 text-white/84 md:text-[16px] md:leading-7">
            {tagline}
          </p>

          {alternates.length > 0 ? (
            <div className="mt-4 flex items-center gap-2 text-[11px] text-white/44 sm:hidden">
              <div className="h-1.5 w-1.5 rounded-full bg-white/55" />
              Tap the stars around the portrait to explore alternates.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}