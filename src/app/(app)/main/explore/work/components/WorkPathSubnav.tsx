// apps/web/src/app/(app)/main/explore/work/components/WorkPathSubnav.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

type Props = {
  pathSlug: string;
};

type SubnavLink = {
  label: string;
  shortLabel?: string;
  href: string;
  exact?: boolean;
  color: string;
  activeGlow: string;
};

function railWrap() {
  return [
    "relative w-full overflow-x-auto pb-1",
    "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  ].join(" ");
}

function railTrack() {
  return [
    "relative inline-flex min-w-max items-center gap-2 rounded-[22px] border p-2",
    "border-white/10 bg-white/[0.035]",
    "backdrop-blur-2xl",
    "shadow-[0_18px_60px_rgba(0,0,0,0.22)]",
  ].join(" ");
}

function pillBase(active: boolean) {
  return [
    "relative inline-flex h-10 shrink-0 items-center justify-center rounded-full px-4",
    "whitespace-nowrap text-sm font-semibold tracking-[-0.01em]",
    "transition-all duration-200",
    "active:scale-[0.98]",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/18",
    active ? "text-white" : "text-white/68 hover:text-white",
  ].join(" ");
}

export function WorkPathSubnav({ pathSlug }: Props) {
  const pathname = usePathname();

  const links: SubnavLink[] = [
    {
      label: "What this is",
      shortLabel: "Overview",
      href: `/main/explore/work/${pathSlug}`,
      exact: true,
      color: "border-white/14 bg-white/[0.08] text-white",
      activeGlow: "shadow-[0_10px_30px_rgba(255,255,255,0.08)]",
    },
    {
      label: "Branches",
      shortLabel: "Specialties",
      href: `/main/explore/work/${pathSlug}/specialties`,
      color: "border-cyan-300/22 bg-cyan-300/12 text-cyan-100",
      activeGlow: "shadow-[0_0_26px_rgba(82,196,255,0.22)]",
    },
    {
      label: "Daily rhythm",
      shortLabel: "Day",
      href: `/main/explore/work/${pathSlug}/day`,
      color: "border-sky-300/22 bg-sky-300/12 text-sky-100",
      activeGlow: "shadow-[0_0_26px_rgba(110,190,255,0.20)]",
    },
    {
      label: "Where it can go",
      shortLabel: "Forecast",
      href: `/main/explore/work/${pathSlug}/forecast`,
      color: "border-violet-300/22 bg-violet-300/12 text-violet-100",
      activeGlow: "shadow-[0_0_26px_rgba(170,130,255,0.22)]",
    },
    {
      label: "How to try it",
      shortLabel: "Next Steps",
      href: `/main/explore/work/${pathSlug}/next-steps`,
      color: "border-emerald-300/22 bg-emerald-300/12 text-emerald-100",
      activeGlow: "shadow-[0_0_26px_rgba(80,230,180,0.20)]",
    },
  ];

  return (
    <div className="relative">
      <div className="mb-2 pl-1">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">
          Follow the path
        </div>
      </div>

      <div className={railWrap()}>
        <div className={railTrack()}>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[22px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
            }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]"
          >
            <motion.div
              className="absolute inset-y-0 w-[34%]"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.00) 10%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.00) 90%, transparent 100%)",
                filter: "blur(12px)",
              }}
              animate={{ x: ["-140%", "340%"] }}
              transition={{
                duration: 7.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          <div className="relative z-10 flex items-center gap-2">
            {links.map((link) => {
              const active = link.exact
                ? pathname === link.href
                : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    pillBase(active),
                    active
                      ? ["border", link.color, link.activeGlow].join(" ")
                      : "border border-transparent hover:bg-white/[0.06]",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="relative">
                    <span className="hidden sm:inline">{link.label}</span>
                    <span className="sm:hidden">
                      {link.shortLabel ?? link.label}
                    </span>

                    {active ? (
                      <span className="absolute left-1/2 top-full mt-1 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/80" />
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}