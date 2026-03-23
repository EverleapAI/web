// apps/web/src/app/(app)/main/explore/work/[pathId]/next-steps/page.tsx

"use client";

import * as React from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Compass,
  MapPin,
  Monitor,
  Sparkles,
} from "lucide-react";

import { requireWorkPath } from "../../_data/workPaths";

/* =============================================================================
   Types
============================================================================= */

type OpportunityItem = {
  id: string;
  title: string;
  href: string;
  note: string;
  badge?: string;
};

type OpportunitySection = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: "local" | "remote";
  items: OpportunityItem[];
};

/* =============================================================================
   Helpers
============================================================================= */

function normalizeParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function sectionIcon(icon: OpportunitySection["icon"]) {
  if (icon === "local") {
    return <MapPin className="h-4 w-4" />;
  }

  return <Monitor className="h-4 w-4" />;
}

/* =============================================================================
   Software developer opportunities
============================================================================= */

const SOFTWARE_DEVELOPER_SECTIONS: OpportunitySection[] = [
  {
    id: "local",
    eyebrow: "Near 94901",
    title: "Real-world ways in around Marin and the Bay",
    description:
      "These are the kinds of places where this path stops being theoretical. Some are year-round, some are event-based, and some are seasonal — but all of them can get you closer to actually doing the work.",
    icon: "local",
    items: [
      {
        id: "marin-library-lab",
        title: "The Lab at Marin County Free Library",
        href: "https://marinlibrary.org/the-lab/",
        note:
          "A real Marin makerspace with coding, tech, and build-oriented tools. Great if you want a nearby place to start making things instead of just reading about them.",
        badge: "Local",
      },
      {
        id: "esporterz",
        title: "Esporterz Marin STEM, Coding & Robotics",
        href: "https://www.esporterz.com/",
        note:
          "Marin-based esports and STEM center with coding and robotics programs for kids and teens. Strong option if you want a social, in-person entry point.",
        badge: "Local",
      },
      {
        id: "dominican-idtech",
        title: "iD Tech Camps at Dominican University, San Rafael",
        href: "https://www.idtech.com/locations/california-summer-camps/dominican-university",
        note:
          "Coding, game development, robotics, and tech camps in San Rafael. More structured and seasonal, but very tangible.",
        badge: "Seasonal",
      },
      {
        id: "codeday-bay-area",
        title: "CodeDay Bay Area",
        href: "https://event.codeday.org/ba",
        note:
          "One of the most beginner-friendly ways to actually build something with other students. Good for meeting peers and shipping a first project.",
        badge: "Bay Area",
      },
      {
        id: "bapc",
        title: "Bay Area Programming Contest",
        href: "https://bapc.gunncpc.com/",
        note:
          "A Bay Area programming contest designed for high school students at different levels. Best if you want a more challenge-oriented route.",
        badge: "High School",
      },
      {
        id: "marin-library-teen-leadership",
        title: "Marin County Free Library Teen Leadership & Volunteer Opportunities",
        href: "https://marinlibrary.org/teen-volunteer-leadership-opportunities/",
        note:
          "Not software-only, but a real local route to responsibility, community involvement, and leadership — useful if you want nearby experience while building technical skills on the side.",
        badge: "Local",
      },
    ],
  },
  {
    id: "remote",
    eyebrow: "Online / Remote",
    title: "Start from anywhere, including tonight",
    description:
      "These are live links to real communities, programs, tutorials, and events that can get a teen building, learning, or meeting people in this field right now.",
    icon: "remote",
    items: [
      {
        id: "hack-club",
        title: "Hack Club",
        href: "https://hackclub.com/",
        note:
          "One of the best real communities for high school coders. Join a club, start one, build projects, and find other teens who are already making things.",
        badge: "Community",
      },
      {
        id: "hack-club-hackathons",
        title: "Hack Club Hackathons",
        href: "https://hackathons.hackclub.com/",
        note:
          "Live list of upcoming high school hackathons. Good if you want a deadline, teammates, and a real reason to build something fast.",
        badge: "Events",
      },
      {
        id: "girls-who-code-pathways",
        title: "Girls Who Code Pathways",
        href: "https://girlswhocode.com/programs/pathways",
        note:
          "Free online coding pathway for high school students. Strong option for beginners who want structure and community, especially girls and nonbinary students.",
        badge: "Free",
      },
      {
        id: "mit-app-inventor",
        title: "MIT App Inventor Beginner Tutorials",
        href: "https://appinventor.mit.edu/explore/ai2/beginner-videos",
        note:
          "One of the fastest ways to go from zero to making an app. Great for a first tangible project that feels real quickly.",
        badge: "Beginner",
      },
      {
        id: "kaggle-learn",
        title: "Kaggle Learn",
        href: "https://www.kaggle.com/learn",
        note:
          "Free, practical coding and data lessons. Good if you want short, hands-on modules instead of a giant course that drags on forever.",
        badge: "Free",
      },
      {
        id: "mlh-events",
        title: "Major League Hacking Event Schedule",
        href: "https://www.mlh.com/seasons/2026/events",
        note:
          "Live schedule of hackathons and digital events. Some skew older, but it is still a strong place to see where the student builder world is moving.",
        badge: "Live events",
      },
      {
        id: "codeday",
        title: "CodeDay",
        href: "https://www.codeday.org/",
        note:
          "Beginner-friendly student coding events and programs. Good if you want momentum without needing to already feel like an expert.",
        badge: "Beginner-friendly",
      },
      {
        id: "girls-who-code-home",
        title: "Girls Who Code Programs",
        href: "https://girlswhocode.com/programs",
        note:
          "Broader hub for clubs, summer programs, and online options. Worth checking if you want more than one way in.",
        badge: "Programs",
      },
    ],
  },
];

/* =============================================================================
   UI
============================================================================= */

function OpportunitySectionBlock({ section }: { section: OpportunitySection }) {
  return (
    <section className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-2xl border border-white/10 bg-white/8 p-2 text-white/86">
          {sectionIcon(section.icon)}
        </div>

        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100/72">
            {section.eyebrow}
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-white">
            {section.title}
          </h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-7 text-white/72">
            {section.description}
          </p>
        </div>
      </div>

      <div className="divide-y divide-white/8 rounded-[28px] border border-white/10 bg-white/[0.04] px-4 sm:px-5">
        {section.items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-4 py-4 transition first:pt-4 last:pb-4 hover:bg-white/[0.02]"
          >
            <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.55)]" />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[15px] font-semibold text-white transition group-hover:text-cyan-100">
                  {item.title}
                </h3>

                {item.badge ? (
                  <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/58">
                    {item.badge}
                  </span>
                ) : null}
              </div>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/72">
                {item.note}
              </p>
            </div>

            <div className="mt-1 shrink-0 text-white/42 transition group-hover:translate-x-0.5 group-hover:text-white">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* =============================================================================
   Page
============================================================================= */

export default function WorkNextStepsPage() {
  const router = useRouter();
  const params = useParams();
  const pathId = normalizeParam(params?.pathId);

  if (!pathId) notFound();

  const workPath = requireWorkPath(pathId);
  const isSoftwareDeveloper = workPath.id === "software-developer";

  const sections = isSoftwareDeveloper ? SOFTWARE_DEVELOPER_SECTIONS : [];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(87,83,255,0.18),_transparent_30%),radial-gradient(circle_at_20%_32%,_rgba(56,189,248,0.12),_transparent_28%),radial-gradient(circle_at_80%_22%,_rgba(244,114,182,0.1),_transparent_24%),linear-gradient(180deg,_#0a1222_0%,_#07111f_42%,_#050b16_100%)]" />
      <div className="absolute inset-x-0 top-0 h-56 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent)]" />
      <div className="absolute left-[-8rem] top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute right-[-6rem] top-16 h-72 w-72 rounded-full bg-violet-500/12 blur-3xl" />
      <div className="absolute bottom-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-500/8 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-2 text-sm font-medium text-white/86 transition hover:border-white/22 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <section className="relative overflow-hidden rounded-[32px] border border-white/12 bg-[linear-gradient(160deg,rgba(16,24,40,0.9)_0%,rgba(18,32,57,0.88)_36%,rgba(25,22,49,0.82)_100%)] px-5 py-6 shadow-[0_20px_90px_rgba(0,0,0,0.34)] sm:px-7 sm:py-7">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-y-0 right-0 w-[50%] bg-[radial-gradient(circle_at_28%_26%,rgba(56,189,248,0.26),transparent_32%),radial-gradient(circle_at_64%_48%,rgba(168,85,247,0.22),transparent_34%),radial-gradient(circle_at_72%_78%,rgba(244,114,182,0.16),transparent_24%)]" />
            <div className="absolute left-0 top-0 h-20 w-full bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent)]" />
          </div>

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100/90">
                <Compass className="h-3.5 w-3.5" />
                Next steps
              </div>

              <h1 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-[3.2rem]">
                There are real ways into{" "}
                <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-200 bg-clip-text text-transparent">
                  {workPath.card.title}
                </span>{" "}
                right now
              </h1>

              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/82">
                You do not need to wait until college, until you feel ready, or until
                someone hands you permission. There are real places to build, learn,
                meet people, and start moving now. Pick one. Click through. Get involved.
              </p>
            </div>

            <div className="shrink-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white/88">
                <Sparkles className="h-4 w-4 text-cyan-200" />
                Why wait?
              </div>
            </div>
          </div>
        </section>

        {sections.length ? (
          <div className="space-y-10">
            {sections.map((section) => (
              <OpportunitySectionBlock key={section.id} section={section} />
            ))}
          </div>
        ) : (
          <section className="rounded-[30px] border border-white/10 bg-white/[0.045] px-5 py-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/62">
              Next steps
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-white">
              This path still needs live opportunity links
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/74">
              The new Next Steps page is designed to land the plane with real local and
              remote opportunities. This path has not been migrated yet.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}