"use client";

import * as React from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  Sparkles,
  Orbit,
  ArrowUpRight,
} from "lucide-react";
import { isDarkTheme, type SpotlightThemeId } from "@/theme/everleapVisuals";

import ExploreLaneRail from "../components/ExploreLaneRail";
import ExplorePathPanel from "../components/ExplorePathPanel";
import type { ExplorePathPanelData } from "../components/ExplorePathPanel";
import {
  getWorkAgenticOpening,
  readStoredFirstName,
} from "./_data/getWorkAgenticOpening";

const PATHS: ExplorePathPanelData[] = [
  {
    id: "game-designer",
    title: "Game Designer",
    hook: "You shape rules, rewards, and challenges so curiosity becomes play.",
    description:
      "Game designers create systems that make people curious, challenged, and proud. It blends imagination, psychology, and logic to shape experiences people want to explore again and again.",
    previewLabel: "Inside this path",
    previewMeta: "Common directions",
    previewItems: [
      "Systems design — shaping progression, rewards, and balance.",
      "Level design — crafting spaces that guide tension, discovery, and flow.",
      "Narrative design — weaving story and player choice into the world.",
    ],
  },
  {
    id: "product-builder",
    title: "Product / UX Builder",
    hook: "You make tools, apps, and systems easier and better for real people.",
    description:
      "Product builders shape experiences people rely on every day. They notice friction, simplify complexity, and design systems that feel natural instead of confusing.",
    previewLabel: "Inside this path",
    previewMeta: "Common directions",
    previewItems: [
      "UX design — shaping how people move through apps and tools.",
      "Product strategy — deciding what problems a product should solve.",
      "Interaction design — crafting how systems respond to human behavior.",
    ],
  },
  {
    id: "health-support",
    title: "Health + Human Support",
    hook: "Some people build careers helping others recover, grow, or feel less alone.",
    description:
      "Support work focuses on helping people through pain, change, and recovery. It requires steadiness, trust, and the ability to listen and guide people through difficult moments.",
    previewLabel: "Inside this path",
    previewMeta: "Common directions",
    previewItems: [
      "Therapeutic support — helping people navigate emotional challenges.",
      "Rehabilitation work — supporting physical recovery and resilience.",
      "Community health — helping groups of people stay healthier together.",
    ],
  },
  {
    id: "teaching",
    title: "Teaching / Mentorship",
    hook: "You help someone else understand something they didn’t before.",
    description:
      "Teaching is about helping people grow confidence and skill. Great mentors guide understanding, challenge thinking, and help others discover what they’re capable of.",
    previewLabel: "Inside this path",
    previewMeta: "Common directions",
    previewItems: [
      "Education — guiding learning in schools or programs.",
      "Coaching — helping people improve skills through feedback and practice.",
      "Mentorship — supporting someone's growth over time.",
    ],
  },
];

function sectionKicker() {
  return "text-[12px] font-semibold uppercase tracking-[0.16em] text-white/50";
}

function getPathHref(pathId: string) {
  switch (pathId) {
    case "game-designer":
      return "/main/explore/work/game-designer";
    case "product-builder":
      return "/main/explore/work/product-ux-builder";
    case "health-support":
      return "/main/explore/work/health-human-support";
    case "teaching":
      return "/main/explore/work/teaching-mentorship";
    default:
      return `/main/explore/work/${pathId}`;
  }
}

export default function ExploreWorkPage() {
  const themeId: SpotlightThemeId = "nightDusk";
  const dark = isDarkTheme(themeId);
  const [openId, setOpenId] = React.useState<string>(PATHS[0].id);
  const [firstName, setFirstName] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFirstName(readStoredFirstName());
  }, []);

  const opening = React.useMemo(
    () =>
      getWorkAgenticOpening({
        pageKind: "lane",
        pathId: "work",
        firstName,
      }),
    [firstName]
  );

  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(1000px 480px at 6% -8%, rgba(110,170,255,0.22), transparent 60%),
            radial-gradient(900px 420px at 100% 0%, rgba(255,170,120,0.18), transparent 58%),
            radial-gradient(780px 360px at 50% 100%, rgba(120,255,210,0.10), transparent 62%),
            radial-gradient(540px 240px at 38% 24%, rgba(170,140,255,0.08), transparent 55%)
          `,
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-28 pt-4 md:px-6 md:pt-5">
        <div className="space-y-6 md:space-y-7">
          <header className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.06] px-5 py-5 shadow-[0_34px_110px_rgba(0,0,0,0.30)] backdrop-blur-2xl md:px-7 md:py-6">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(720px 280px at 0% 0%, rgba(120,180,255,0.24), transparent 58%)," +
                  "radial-gradient(560px 260px at 100% 100%, rgba(255,190,130,0.18), transparent 58%)," +
                  "radial-gradient(380px 200px at 52% 24%, rgba(160,120,255,0.10), transparent 62%)," +
                  "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
              }}
            />

            <div
              aria-hidden
              className="pointer-events-none absolute -left-10 top-12 hidden h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl md:block"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute right-6 top-8 hidden h-28 w-28 rounded-full bg-amber-300/10 blur-3xl md:block"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute right-16 bottom-0 hidden h-36 w-36 rounded-full bg-violet-300/10 blur-3xl md:block"
            />

            <div className="relative max-w-3xl">
              <div className="mb-3 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.08] text-white/88 shadow-[0_10px_28px_rgba(0,0,0,0.20)]">
                  <BriefcaseBusiness className="h-5 w-5" />
                </span>

                <div className={sectionKicker()}>Explore</div>
              </div>

              <div className="max-w-2xl">
                <p className="text-[15px] leading-7 text-white/82 md:text-[16px]">
                  {opening.intro}
                </p>

                <p className="mt-3 text-[14px] leading-6 text-white/66 md:text-[15px]">
                  {opening.body}
                </p>

                <p className="mt-3 text-[14px] leading-6 text-white/58 md:text-[15px]">
                  {opening.bridge}
                </p>
              </div>

              <h1 className="mt-5 text-[2.15rem] font-semibold tracking-tight text-white drop-shadow-[0_8px_24px_rgba(120,180,255,0.12)] md:text-[2.8rem]">
                Work
              </h1>

              <p
                className={
                  dark
                    ? "mt-3 max-w-2xl text-[15.5px] leading-7 text-white/76 md:text-[16.5px]"
                    : "mt-3 max-w-2xl text-[15.5px] leading-7 text-slate-700 md:text-[16.5px]"
                }
              >
                Ways people turn curiosity into real work. This is not about picking
                a forever answer. It is about following a direction, noticing what
                feels alive, and going deeper when something starts to click.
              </p>

              <div className="mt-4 flex flex-wrap gap-2.5">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/16 bg-cyan-300/10 px-3 py-1.5 text-[12px] font-semibold text-cyan-100/90">
                  <Sparkles className="h-3.5 w-3.5" />
                  Curiosity → work
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/16 bg-amber-300/10 px-3 py-1.5 text-[12px] font-semibold text-amber-100/90">
                  <Orbit className="h-3.5 w-3.5" />
                  Explore directions
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/16 bg-violet-300/10 px-3 py-1.5 text-[12px] font-semibold text-violet-100/90">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  Go deeper when ready
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-white/52">
                Start with one path. Open it. See what lives inside it. If it
                pulls you in, step deeper into the path.
              </p>
            </div>
          </header>

          <section className="space-y-2.5">
            <div className={sectionKicker()}>Lanes</div>
            <ExploreLaneRail />
          </section>

          <section className="space-y-3">
            <div className="relative overflow-hidden rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-4 backdrop-blur-xl">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(520px 180px at 0% 0%, rgba(120,180,255,0.10), transparent 58%)," +
                    "radial-gradient(420px 160px at 100% 100%, rgba(255,180,120,0.08), transparent 58%)",
                }}
              />

              <div className="relative">
                <div className={sectionKicker()}>Paths in work</div>
                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-white/62">
                  These are not job titles to commit to. They are directions for
                  exploring how your energy, taste, and mind might meet the world.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              {PATHS.map((path) => {
                const href = getPathHref(path.id);

                return (
                  <div key={path.id} className="space-y-3">
                    <ExplorePathPanel
                      path={path}
                      open={openId === path.id}
                      onToggle={() =>
                        setOpenId((prev) => (prev === path.id ? "" : path.id))
                      }
                    />

                    <div className="mt-3 px-1">
                      <Link
                        href={href}
                        className="
                          group flex items-center justify-between
                          rounded-2xl
                          border border-cyan-300/20
                          bg-cyan-300/10
                          px-4 py-3
                          text-sm font-semibold text-cyan-100/95
                          backdrop-blur-xl
                          transition
                          hover:bg-cyan-300/16
                          hover:border-cyan-300/30
                          hover:shadow-[0_0_24px_rgba(120,200,255,0.25)]
                        "
                      >
                        <span>Enter path</span>

                        <ArrowUpRight className="h-4 w-4 opacity-80 transition group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}