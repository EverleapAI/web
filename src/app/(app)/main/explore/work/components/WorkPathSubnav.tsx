// apps/web/src/app/(app)/main/explore/work/components/WorkPathSubnav.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  pathSlug: string;
};

export function WorkPathSubnav({ pathSlug }: Props) {
  const pathname = usePathname();

  const links = [
    {
      label: "Overview",
      href: `/main/explore/work/${pathSlug}`,
      exact: true,
    },
    {
      label: "Specialties",
      href: `/main/explore/work/${pathSlug}/specialties`,
    },
    {
      label: "Day",
      href: `/main/explore/work/${pathSlug}/day`,
    },
    {
      label: "Forecast",
      href: `/main/explore/work/${pathSlug}/forecast`,
    },
    {
      label: "Next Steps",
      href: `/main/explore/work/${pathSlug}/next-steps`,
    },
  ];

  return (
    <div className="relative w-full overflow-x-auto">
      <div className="flex min-w-max gap-2 rounded-[20px] border border-white/8 bg-white/[0.03] p-2 backdrop-blur-xl">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition",
                active
                  ? "bg-white/14 text-white shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
                  : "text-white/68 hover:bg-white/[0.07] hover:text-white",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}