"use client";

import Image from "next/image";
import * as React from "react";
import {
  Atom,
  Beaker,
  Bird,
  BookOpen,
  Brain,
  Compass,
  Feather,
  Flame,
  Orbit,
  Sparkles,
  SquareDashedBottomCode,
  Telescope,
  Wrench,
} from "lucide-react";

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
};

const PLACEHOLDER_PORTRAIT = "/time-twins/placeholder.png";

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
      return "bg-[radial-gradient(circle_at_50%_18%,rgba(255,231,184,0.24),transparent_34%),radial-gradient(circle_at_50%_38%,rgba(255,210,120,0.10),transparent_42%),linear-gradient(180deg,rgba(58,43,28,0.82),rgba(14,11,9,0.98))]";
    case "inventor-electric":
      return "bg-[radial-gradient(circle_at_50%_18%,rgba(120,180,255,0.28),transparent_34%),radial-gradient(circle_at_45%_36%,rgba(88,140,255,0.12),transparent_44%),linear-gradient(180deg,rgba(10,28,52,0.8),rgba(4,8,18,0.98))]";
    case "scientist-luminous":
      return "bg-[radial-gradient(circle_at_50%_18%,rgba(140,255,200,0.22),transparent_34%),radial-gradient(circle_at_55%_36%,rgba(90,220,170,0.10),transparent_44%),linear-gradient(180deg,rgba(18,40,34,0.8),rgba(6,12,10,0.98))]";
    case "logic-victorian":
      return "bg-[radial-gradient(circle_at_50%_18%,rgba(200,150,255,0.22),transparent_34%),radial-gradient(circle_at_50%_38%,rgba(160,110,255,0.10),transparent_44%),linear-gradient(180deg,rgba(38,23,54,0.82),rgba(11,8,17,0.98))]";
    case "code-shadow":
      return "bg-[radial-gradient(circle_at_50%_18%,rgba(120,220,210,0.22),transparent_34%),radial-gradient(circle_at_50%_36%,rgba(60,180,160,0.10),transparent_44%),linear-gradient(180deg,rgba(8,27,30,0.84),rgba(5,10,12,0.985))]";
    case "cosmic-wonder":
      return "bg-[radial-gradient(circle_at_50%_18%,rgba(110,140,255,0.24),transparent_34%),radial-gradient(circle_at_48%_34%,rgba(170,120,255,0.10),transparent_44%),linear-gradient(180deg,rgba(13,20,52,0.82),rgba(5,7,16,0.985))]";
    case "geometry-marble":
      return "bg-[radial-gradient(circle_at_50%_18%,rgba(175,205,255,0.20),transparent_34%),radial-gradient(circle_at_52%_36%,rgba(130,150,235,0.08),transparent_44%),linear-gradient(180deg,rgba(24,28,40,0.8),rgba(8,10,18,0.985))]";
    case "future-dusk":
      return "bg-[radial-gradient(circle_at_50%_18%,rgba(255,145,120,0.22),transparent_34%),radial-gradient(circle_at_48%_36%,rgba(255,95,125,0.10),transparent_44%),linear-gradient(180deg,rgba(44,24,28,0.82),rgba(10,8,14,0.985))]";
    case "painter-bloom":
      return "bg-[radial-gradient(circle_at_50%_18%,rgba(255,110,150,0.24),transparent_34%),radial-gradient(circle_at_55%_36%,rgba(255,165,115,0.10),transparent_44%),linear-gradient(180deg,rgba(56,19,33,0.82),rgba(14,7,12,0.985))]";
    case "ink-moon":
      return "bg-[radial-gradient(circle_at_50%_18%,rgba(205,165,235,0.20),transparent_34%),radial-gradient(circle_at_52%_36%,rgba(140,120,220,0.08),transparent_44%),linear-gradient(180deg,rgba(26,20,34,0.82),rgba(8,7,13,0.985))]";
    default:
      return "bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.10),transparent_34%),radial-gradient(circle_at_50%_36%,rgba(255,255,255,0.05),transparent_44%),linear-gradient(180deg,rgba(22,22,28,0.8),rgba(8,8,12,0.98))]";
  }
}

function ArchetypeIcon({
  archetype,
  className,
}: {
  archetype?: TimeTwinPortraitArchetype;
  className?: string;
}) {
  switch (archetype) {
    case "inventor":
      return <Wrench className={className} />;
    case "scientist":
      return <Beaker className={className} />;
    case "mathematician":
      return <SquareDashedBottomCode className={className} />;
    case "coder":
      return <Brain className={className} />;
    case "cosmic-guide":
      return <Telescope className={className} />;
    case "philosopher":
      return <Compass className={className} />;
    case "futurist":
      return <Orbit className={className} />;
    case "artist":
      return <Flame className={className} />;
    case "writer":
      return <Feather className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

function PatternOverlay({
  pattern,
  accentRgb,
}: {
  pattern?: TimeTwinHeroPattern;
  accentRgb: RGB;
}) {
  const soft = rgba(accentRgb, 0.1);
  const faint = rgba(accentRgb, 0.06);
  const line = rgba(accentRgb, 0.14);

  switch (pattern) {
    case "sketch":
      return (
        <div className="absolute inset-0 opacity-80">
          <div
            className="absolute left-[8%] top-[18%] h-px w-[42%] rotate-[-8deg]"
            style={{ background: line }}
          />
          <div
            className="absolute left-[18%] top-[34%] h-px w-[36%] rotate-[11deg]"
            style={{ background: line }}
          />
          <div
            className="absolute right-[10%] top-[24%] h-px w-[34%] rotate-[-14deg]"
            style={{ background: faint }}
          />
          <div
            className="absolute right-[18%] top-[48%] h-px w-[28%] rotate-[7deg]"
            style={{ background: faint }}
          />
          <Bird
            className="absolute right-[14%] top-[18%] h-8 w-8"
            style={{ color: rgba(accentRgb, 0.22) }}
          />
        </div>
      );

    case "coil":
      return (
        <div className="absolute inset-0 opacity-80">
          <div
            className="absolute left-[14%] top-[16%] h-28 w-28 rounded-full border"
            style={{ borderColor: line }}
          />
          <div
            className="absolute left-[18%] top-[20%] h-20 w-20 rounded-full border"
            style={{ borderColor: faint }}
          />
          <div
            className="absolute right-[12%] top-[22%] h-32 w-32 rounded-full border"
            style={{ borderColor: line }}
          />
          <div
            className="absolute right-[18%] top-[28%] h-20 w-20 rounded-full border"
            style={{ borderColor: faint }}
          />
          <Atom
            className="absolute left-[46%] top-[18%] h-8 w-8"
            style={{ color: rgba(accentRgb, 0.18) }}
          />
        </div>
      );

    case "glass":
      return (
        <div className="absolute inset-0 opacity-80">
          <div
            className="absolute left-[12%] top-[20%] h-28 w-20 rounded-[999px_999px_24px_24px] border"
            style={{ borderColor: line, background: soft }}
          />
          <div
            className="absolute left-[28%] top-[30%] h-20 w-14 rounded-[999px_999px_20px_20px] border"
            style={{ borderColor: faint }}
          />
          <div
            className="absolute right-[14%] top-[18%] h-32 w-24 rounded-[999px_999px_26px_26px] border"
            style={{ borderColor: line, background: faint }}
          />
          <Beaker
            className="absolute right-[42%] top-[22%] h-8 w-8"
            style={{ color: rgba(accentRgb, 0.18) }}
          />
        </div>
      );

    case "diagram":
      return (
        <div className="absolute inset-0 opacity-80">
          <div
            className="absolute left-[10%] top-[18%] h-20 w-28 rounded-xl border"
            style={{ borderColor: line }}
          />
          <div
            className="absolute left-[42%] top-[22%] h-14 w-14 rounded-full border"
            style={{ borderColor: faint }}
          />
          <div
            className="absolute right-[12%] top-[18%] h-24 w-24 rounded-xl border"
            style={{ borderColor: line }}
          />
          <div
            className="absolute left-[33%] top-[28%] h-px w-[14%]"
            style={{ background: line }}
          />
          <div
            className="absolute left-[54%] top-[30%] h-px w-[16%]"
            style={{ background: faint }}
          />
          <BookOpen
            className="absolute left-[18%] top-[46%] h-7 w-7"
            style={{ color: rgba(accentRgb, 0.18) }}
          />
        </div>
      );

    case "grid":
      return (
        <div
          className="absolute inset-0 opacity-70"
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
        <div className="absolute inset-0 opacity-80">
          <Sparkles
            className="absolute left-[16%] top-[20%] h-5 w-5"
            style={{ color: rgba(accentRgb, 0.3) }}
          />
          <Sparkles
            className="absolute left-[34%] top-[12%] h-4 w-4"
            style={{ color: rgba(accentRgb, 0.18) }}
          />
          <Sparkles
            className="absolute right-[18%] top-[18%] h-6 w-6"
            style={{ color: rgba(accentRgb, 0.24) }}
          />
          <Sparkles
            className="absolute right-[34%] top-[34%] h-4 w-4"
            style={{ color: rgba(accentRgb, 0.16) }}
          />
        </div>
      );

    case "geometry":
      return (
        <div className="absolute inset-0 opacity-75">
          <div
            className="absolute left-[12%] top-[22%] h-24 w-24 rotate-45 border"
            style={{ borderColor: line }}
          />
          <div
            className="absolute left-[34%] top-[18%] h-20 w-20 rounded-full border"
            style={{ borderColor: faint }}
          />
          <div
            className="absolute right-[16%] top-[20%] h-24 w-24 border"
            style={{ borderColor: line }}
          />
          <Compass
            className="absolute right-[40%] top-[26%] h-8 w-8"
            style={{ color: rgba(accentRgb, 0.18) }}
          />
        </div>
      );

    case "skyline":
      return (
        <div className="absolute inset-0 opacity-80">
          <div
            className="absolute bottom-0 left-0 right-0 h-20"
            style={{
              background: `linear-gradient(180deg, transparent, ${rgba(
                accentRgb,
                0.08
              )})`,
            }}
          />
          <div
            className="absolute bottom-0 left-[8%] h-20 w-8 rounded-t-md"
            style={{ background: rgba(accentRgb, 0.12) }}
          />
          <div
            className="absolute bottom-0 left-[18%] h-28 w-10 rounded-t-md"
            style={{ background: rgba(accentRgb, 0.1) }}
          />
          <div
            className="absolute bottom-0 left-[32%] h-16 w-8 rounded-t-md"
            style={{ background: rgba(accentRgb, 0.09) }}
          />
          <div
            className="absolute bottom-0 right-[28%] h-24 w-10 rounded-t-md"
            style={{ background: rgba(accentRgb, 0.1) }}
          />
          <div
            className="absolute bottom-0 right-[16%] h-32 w-12 rounded-t-md"
            style={{ background: rgba(accentRgb, 0.12) }}
          />
          <div
            className="absolute bottom-0 right-[8%] h-[72px] w-8 rounded-t-md"
            style={{ background: rgba(accentRgb, 0.08) }}
          />
        </div>
      );

    case "paint":
      return (
        <div className="absolute inset-0 opacity-80">
          <div
            className="absolute left-[8%] top-[20%] h-24 w-32 rounded-full blur-2xl"
            style={{ background: rgba(accentRgb, 0.16) }}
          />
          <div
            className="absolute right-[12%] top-[16%] h-28 w-28 rounded-full blur-2xl"
            style={{ background: rgba(accentRgb, 0.12) }}
          />
          <div
            className="absolute left-[26%] top-[38%] h-16 w-40 rotate-[-8deg] rounded-full blur-xl"
            style={{ background: rgba(accentRgb, 0.08) }}
          />
        </div>
      );

    case "ink":
      return (
        <div className="absolute inset-0 opacity-80">
          <div
            className="absolute left-[10%] top-[18%] h-24 w-28 rounded-full blur-2xl"
            style={{ background: rgba(accentRgb, 0.1) }}
          />
          <div
            className="absolute right-[14%] top-[24%] h-28 w-32 rounded-full blur-2xl"
            style={{ background: rgba(accentRgb, 0.08) }}
          />
          <div
            className="absolute left-[34%] top-[30%] h-20 w-20 rounded-full blur-xl"
            style={{ background: rgba(accentRgb, 0.06) }}
          />
          <Feather
            className="absolute right-[22%] top-[18%] h-8 w-8"
            style={{ color: rgba(accentRgb, 0.16) }}
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
  archetype,
}: {
  portraitImage?: string;
  name: string;
  accentRgb: RGB;
  archetype?: TimeTwinPortraitArchetype;
}) {
  const glow = rgba(accentRgb, 0.34);
  const border = rgba(accentRgb, 0.26);
  const [src, setSrc] = React.useState<string>(
    safeSrc(portraitImage) ?? PLACEHOLDER_PORTRAIT
  );

  React.useEffect(() => {
    setSrc(safeSrc(portraitImage) ?? PLACEHOLDER_PORTRAIT);
  }, [portraitImage]);

  return (
    <div
      className="relative mb-4 h-[92px] w-[92px] overflow-hidden rounded-[24px] border bg-black/45 backdrop-blur md:mb-4 md:h-[104px] md:w-[104px]"
      style={{
        borderColor: border,
        boxShadow: `0 0 34px ${glow}`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: `linear-gradient(180deg, ${rgba(
            accentRgb,
            0.14
          )}, transparent 38%)`,
        }}
      />
      <Image
        src={src}
        alt={name}
        fill
        sizes="104px"
        className="object-cover"
        onError={() => {
          if (src !== PLACEHOLDER_PORTRAIT) {
            setSrc(PLACEHOLDER_PORTRAIT);
          }
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-10 bg-gradient-to-t from-black/30 to-transparent" />
      <div
        className="absolute -bottom-2 -right-2 z-[3] flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur"
        style={{
          borderColor: rgba(accentRgb, 0.24),
          background: "rgba(8, 10, 16, 0.72)",
          boxShadow: `0 0 18px ${rgba(accentRgb, 0.24)}`,
        }}
      >
        <ArchetypeIcon
          archetype={archetype}
          className="h-4 w-4 text-white/85"
        />
      </div>
    </div>
  );
}

export function TimeTwinHero({
  name,
  era,
  tagline,
  mindType,
  heroImage,
  portraitImage,
  visualTheme,
  portraitArchetype,
  heroPattern,
  accentRgb,
}: TimeTwinHeroProps) {
  const glow = rgba(accentRgb, 0.32);
  const border = rgba(accentRgb, 0.24);

  return (
    <section className="relative w-full">
      <div
        className="relative overflow-hidden rounded-[28px] border bg-black/30"
        style={{
          borderColor: "rgba(255,255,255,0.10)",
          boxShadow: `0 24px 64px rgba(0,0,0,0.32), 0 0 0 1px ${rgba(
            accentRgb,
            0.08
          )}`,
        }}
      >
        <div
          className={[
            "absolute inset-0",
            heroBackgroundClass(visualTheme),
          ].join(" ")}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 50% 20%, rgba(255,255,255,0.08), transparent 30%),
                radial-gradient(circle at 30% 60%, rgba(140,180,255,0.06), transparent 40%),
                radial-gradient(circle at 70% 50%, rgba(200,120,255,0.06), transparent 40%)
              `,
            }}
          />

          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage: `
                radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.7), transparent),
                radial-gradient(1.5px 1.5px at 80% 20%, rgba(255,255,255,0.6), transparent),
                radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.6), transparent),
                radial-gradient(1px 1px at 60% 40%, rgba(255,255,255,0.5), transparent),
                radial-gradient(1.5px 1.5px at 75% 80%, rgba(255,255,255,0.6), transparent),
                radial-gradient(1px 1px at 14% 56%, rgba(255,255,255,0.5), transparent),
                radial-gradient(1.5px 1.5px at 52% 16%, rgba(255,255,255,0.55), transparent),
                radial-gradient(1px 1px at 88% 62%, rgba(255,255,255,0.5), transparent)
              `,
            }}
          />
        </div>

        <PatternOverlay pattern={heroPattern} accentRgb={accentRgb} />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 50% 22%, ${rgba(accentRgb, 0.18)}, transparent 28%),
              radial-gradient(circle at 50% 34%, ${rgba(accentRgb, 0.08)}, transparent 42%)
            `,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-black/48 to-black/88" />

        <div
          className="pointer-events-none absolute left-1/2 top-[-56px] h-[180px] w-[180px] -translate-x-1/2 rounded-full blur-3xl md:top-[-72px] md:h-[240px] md:w-[240px]"
          style={{
            background: glow,
          }}
        />

        <div className="relative z-10 flex min-h-[224px] flex-col items-center px-5 pb-6 pt-8 text-center md:min-h-[280px] md:px-6 md:pb-8 md:pt-10">
          <PortraitBadge
            portraitImage={portraitImage}
            name={name}
            accentRgb={accentRgb}
            archetype={portraitArchetype}
          />

          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/46 md:text-[11px]">
            Your Time Twin
          </div>

          <h1 className="max-w-[520px] text-[28px] font-semibold tracking-[-0.03em] text-white md:text-[38px]">
            {name}
          </h1>

          <div className="mt-1 text-[12px] text-white/58 md:text-[13px]">
            {era}
          </div>

          <p className="mt-3 max-w-[460px] text-[15px] leading-7 text-white/82 md:mt-3 md:text-[16px] md:leading-7">
            {tagline}
          </p>

          <div
            className="mt-4 rounded-full border px-4 py-1.5 text-[11px] font-medium text-white/92 backdrop-blur md:mt-5 md:text-[12px]"
            style={{
              borderColor: border,
              background: rgba(accentRgb, 0.1),
              boxShadow: `0 0 16px ${rgba(accentRgb, 0.22)}`,
            }}
          >
            {mindType}
          </div>
        </div>
      </div>
    </section>
  );
}