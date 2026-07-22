// apps/web/src/app/(app)/main/guide/GuideSky.tsx
//
// The manual as a ride.
//
// A canvas starfield carries the depth; SVG sits on top for the stars you can
// actually tap, because those need hit targets, focus rings and labels a canvas
// can't give for free. Dropping into a star throws the field into hyperspace and
// backing out reverses it — one variable (how fast z falls) produces both the
// idle glitter and the jump, because every star is drawn from where it WAS to
// where it IS.
//
// Mobile is the primary canvas: star count and pixel ratio are both capped, and
// the whole loop holds still under prefers-reduced-motion. On a laptop the sky
// roughly triples and the panel moves alongside it.
//
// WHY THE STARS ARE HTML AND ONLY THE EDGES ARE SVG (2026-07-22).
//
// They were all SVG, drawn in a 384x268 viewBox and scaled to fit. On a phone
// that is roughly 1:1 and looked fine. On a laptop the column is ~880px, so
// EVERYTHING was magnified about 2.3x: an 11px label rendered at 26px, a 1.2px
// edge at nearly 3px, and the dashed "opens further" ring turned into fat dashes
// that read like a wireframe. The diagram wasn't badly drawn — it was a
// phone-sized drawing blown up, which is what made it look cheap. Tom: "it looks
// a little cheesy" on laptop.
//
// So position comes from the layout (percentages of the same coordinate space,
// so the constellation keeps its shape) and SIZE comes from the design tokens,
// at their real values, at every width. Bigger screen now means the stars spread
// out rather than swell. Edges stay SVG because a line between two points is
// what SVG is for, with non-scaling-stroke so they stay hairlines.

"use client";

import * as React from "react";
import {
  ArrowLeft, Award, BookOpen, ChevronRight, Compass, Flame, Footprints, Gem,
  Globe, GraduationCap, House, Languages, Lightbulb, ListChecks, MessageSquare,
  PieChart, Search, Settings, Sparkles, Sprout, Star, User, Wrench,
  type LucideIcon,
} from "lucide-react";

import { GUIDE_SKIES, findNode, hasSky, type GuideNode } from "./guideTree";

const VIEW_W = 384;
const VIEW_H = 268;

/** Percent of the sky, so the shape survives any width. */
const at = (x: number, y: number) => ({
  left: `${(x / VIEW_W) * 100}%`,
  top: `${(y / VIEW_H) * 100}%`,
});

/**
 * FOCUS — the sky leans toward whichever star you picked.
 *
 * The constellation moves; the stars and labels do not change size. That
 * distinction is the whole point: scaling the layer would scale the type with
 * it and bring straight back the magnified look that made this diagram cheap on
 * a laptop. So the POSITIONS spread apart and everything drawn stays exactly as
 * crisp as it was.
 *
 * The picked star also drifts partway toward the middle rather than all the way.
 * Fully centring it swings the whole sky on every tap, which reads as the map
 * being yanked around; a partial move reads as a camera leaning in.
 */
const FOCUS_ZOOM = 1.3;
const RECENTER = 0.45;
/**
 * viewBox units kept clear at the edges, so a label never runs off the frame.
 *
 * Taller than it is wide, because a label sits ABOVE or BELOW its star: the
 * vertical reach is the star's tap target plus a line of type, the horizontal
 * reach is only half the word. A single symmetric pad protected the stars and
 * still let "Skills" hang off the bottom of the Story sky on a phone.
 */
const FRAME_PAD_X = 34;
const FRAME_PAD_Y = 52;

type Focus = { z: number; tx: number; ty: number };
const NO_FOCUS: Focus = { z: 1, tx: 0, ty: 0 };

/**
 * The strongest lean that still keeps every star inside the frame.
 *
 * A fixed zoom cannot be safe for every star: leaning toward one near an edge
 * pushes the far ones out, and a map that loses a node while zooming has stopped
 * being a map. So it asks for the zoom it wants and backs off until everything
 * fits — generous where there's room, gentle where there isn't, never lossy.
 */
function focusFor(nodes: { id: string; x: number; y: number }[], selectedId: string): Focus {
  const s = nodes.find((n) => n.id === selectedId);
  if (!s) return NO_FOCUS;

  for (let z = FOCUS_ZOOM; z > 1.001; z -= 0.02) {
    const tx = s.x * (1 - z) + (VIEW_W / 2 - s.x) * RECENTER;
    const ty = s.y * (1 - z) + (VIEW_H / 2 - s.y) * RECENTER;
    const fits = nodes.every((n) => {
      const X = n.x * z + tx;
      const Y = n.y * z + ty;
      return (
        X >= FRAME_PAD_X && X <= VIEW_W - FRAME_PAD_X &&
        Y >= FRAME_PAD_Y && Y <= VIEW_H - FRAME_PAD_Y
      );
    });
    if (fits) return { z, tx, ty };
  }
  return NO_FOCUS;
}

/** Motion is a preference, not a detail. Focus still happens — it just arrives. */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/* ---------------------------------------------------------------------------
   THE SCENE — one continuous space, not a stack of separate skies.
   ---------------------------------------------------------------------------
   Going deeper used to swap the whole sky for a different one. That taught two
   contradicting metaphors: the lean says depth is continuous, and then the
   swap destroyed everything you were looking at. Tom: "why not use the star
   zoom metaphor… show the deep dive content as a new star behind the zoomed-in
   star."

   So a star is not a link. It is a cluster you have not resolved yet. Entering
   one keeps it on screen as the ANCHOR — the thing you are inside — drops its
   siblings, and resolves its children around it, reusing each child sky's
   hand-placed layout for its ARRANGEMENT while re-anchoring it onto the parent.
   The designed constellation survives; where it sits does not.

   Only one level of history is ever drawn. Keeping every ancestor is the
   tempting version and it stops being readable by the third level — fifteen
   stars, most of them dim. The rest lives in the breadcrumb. */

type Placed = GuideNode & { px: number; py: number; isAnchor: boolean };

/** Room left for labels when refitting a scene — labels reach further vertically. */
const SCENE_PAD_X = 48;
const SCENE_PAD_Y = 60;

function centroidOf(nodes: GuideNode[]) {
  const n = Math.max(1, nodes.length);
  return {
    x: nodes.reduce((t, p) => t + p.x, 0) / n,
    y: nodes.reduce((t, p) => t + p.y, 0) / n,
  };
}

/**
 * Refit a scene into the frame without distorting it.
 *
 * Positions compound as you descend — a child of a child of a corner star ends
 * up small and off to one side. Rather than hand-tuning a spread per level,
 * every scene is scaled and centred to fill the frame, so depth cannot make a
 * level badly composed. Uniform scale, so a constellation is never stretched.
 */
function refit(placed: Placed[]): Placed[] {
  if (placed.length < 2) return placed;
  const xs = placed.map((p) => p.px);
  const ys = placed.map((p) => p.py);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const w = Math.max(1, Math.max(...xs) - minX);
  const h = Math.max(1, Math.max(...ys) - minY);
  const k = Math.min((VIEW_W - SCENE_PAD_X * 2) / w, (VIEW_H - SCENE_PAD_Y * 2) / h);
  const ox = (VIEW_W - w * k) / 2 - minX * k;
  const oy = (VIEW_H - h * k) / 2 - minY * k;
  return placed.map((p) => ({ ...p, px: p.px * k + ox, py: p.py * k + oy }));
}

function buildScene(path: string[]): { placed: Placed[]; anchorId: string | null } {
  let placed: Placed[] = GUIDE_SKIES.root.nodes.map((n) => ({
    ...n, px: n.x, py: n.y, isAnchor: false,
  }));
  let anchorId: string | null = null;

  for (let i = 1; i < path.length; i++) {
    const id = path[i];
    const parent = placed.find((p) => p.id === id);
    const childSky = GUIDE_SKIES[id];
    if (!parent || !childSky) break;

    // The children keep their designed shape, re-hung on the parent's position.
    const c = centroidOf(childSky.nodes);
    placed = [
      { ...parent, isAnchor: true },
      ...childSky.nodes.map((n) => ({
        ...n,
        px: parent.px + (n.x - c.x),
        py: parent.py + (n.y - c.y),
        isAnchor: false,
      })),
    ];
    anchorId = id;
  }

  // The root layout is hand-placed and already composed; refitting it would
  // quietly redesign the one sky somebody actually approved.
  return { placed: path.length > 1 ? refit(placed) : placed, anchorId };
}

/* EVERY NODE HAS A REAL IMAGE — 29 catalogue scenes and one Time Twin portrait,
 * all assigned in guideTree and all verified present in the database.
 *
 * Two placeholders were tried and both were worse. A drawn constellation glyph
 * read as a SECOND constellation beside the real one ("I want the main
 * constellation star field to change on every click, not create another in the
 * content area"). An icon plate replaced it and was too thin — a small mark
 * adrift in a large panel. Tom: "can't we just pick a real image to use from
 * our DB?" We could: there are 3,237 of them.
 *
 * So the plate below now only ever appears if a photo fails to load, which is
 * possible because scene photos generate on demand. It exists so the panel can
 * never have a hole in it, not as a design choice — hence the bigger mark. */
const NODE_ICON: Record<string, LucideIcon> = {
  story: BookOpen, today: House, insights: Lightbulb, explore: Compass,
  actions: ListChecks, me: User,
  // Story + Insights share the three families, so they share their marks.
  "s-mot": Flame, "s-str": Gem, "s-ski": Wrench,
  "i-mot": Flame, "i-str": Gem, "i-ski": Wrench, "i-fun": Sparkles,
  "w-thing": Sprout, "w-lang": Languages, "w-school": GraduationCap, "w-here": Globe,
  "a-find": Search, "a-do": Footprints, "a-back": MessageSquare,
  "m-badge": Award, "m-cover": PieChart, "m-prof": Settings,
};

function NodePlate({ id, accent }: { id: string; accent: string }) {
  const Icon = NODE_ICON[id] ?? Star;
  return (
    <div
      className="flex aspect-[16/10] w-full items-center justify-center"
      style={{
        background: `linear-gradient(155deg, rgba(${accent},0.20) 0%, rgba(${accent},0.06) 55%, rgba(255,255,255,0.02) 100%)`,
      }}
      aria-hidden
    >
      <Icon className="h-16 w-16" style={{ color: `rgba(${accent},0.55)` }} strokeWidth={1.1} />
    </div>
  );
}

type Star = {
  x: number; y: number; z: number;
  mag: number; phase: number; speed: number; tint: string;
};

function newStar(z: number): Star {
  return {
    x: (Math.random() - 0.5) * 2,
    y: (Math.random() - 0.5) * 2,
    z,
    // Own brightness and own twinkle rhythm, so it reads as a sky rather than a
    // regular grid of identical dots. A few run warm or cold.
    mag: Math.random() * 0.75 + 0.25,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.9 + 0.5,
    tint:
      Math.random() < 0.14
        ? Math.random() < 0.5
          ? "180,214,255"
          : "255,224,170"
        : "226,234,248",
  };
}

function Starfield({ warpRef }: { warpRef: React.MutableRefObject<(dir: number) => void> }) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // A laptop sky is roughly three times the area of a phone one, so the same
    // count reads as a thin scatter rather than depth.
    const count = window.innerWidth < 640 ? 300 : window.innerWidth < 1280 ? 620 : 900;
    const field: Star[] = Array.from({ length: count }, () => newStar(Math.random() * 0.98 + 0.02));

    let w = 1, h = 1, raf = 0, warp = 0, warpUntil = 0;

    const size = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (s: Star) => ({
      x: w / 2 + (s.x / s.z) * w * 0.62,
      y: h / 2 + (s.y / s.z) * h * 0.62,
    });

    // `dir` is signed and fractional: ±1 is a descent or a climb, and a small
    // value is the nudge fired on every selection. The star field has to answer
    // EVERY click, not only the ones that change level — otherwise picking a
    // star looks like nothing happened to the sky, which is what made the panel
    // feel like where the action was.
    warpRef.current = (dir: number) => {
      if (reduced) return;
      warp = dir * 26;
      warpUntil = performance.now() + (Math.abs(dir) < 0.6 ? 380 : 640);
    };

    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      ctx.clearRect(0, 0, w, h);

      if (warp !== 0 && now > warpUntil) warp = 0;
      const push = warp !== 0 ? warp * 0.002 : 0;
      const warping = warp !== 0 && !reduced;

      for (let i = 0; i < field.length; i++) {
        const s = field[i];
        const before = project(s);
        s.z -= (0.000014 + push) * dt;

        // Recycle at both ends, so backing out never empties the field.
        if (s.z <= 0.02) { field[i] = newStar(1); continue; }
        if (s.z > 1) { field[i] = newStar(0.02); continue; }

        const p = project(s);
        if (p.x < -60 || p.x > w + 60 || p.y < -60 || p.y > h + 60) continue;

        const depth = 1 - s.z;
        const twinkle = reduced ? 1 : 0.7 + 0.3 * Math.sin(now * 0.0015 * s.speed + s.phase);
        const alpha = Math.min(1, s.mag * (0.3 + depth * 1.15) * twinkle);

        if (warping) {
          ctx.strokeStyle = `rgba(${s.tint},${alpha})`;
          ctx.lineWidth = Math.max(0.6, depth * 2.2);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(before.x, before.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${s.tint},${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.5, depth * 2 * s.mag), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver(size);
    ro.observe(cv);
    size();
    raf = requestAnimationFrame((t) => { last = t; frame(t); });

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [warpRef]);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}

export function GuideSky() {
  const [path, setPath] = React.useState<string[]>(["root"]);
  const [selected, setSelected] = React.useState<string>("story");
  const warpRef = React.useRef<(dir: number) => void>(() => {});

  // Which photos 404'd, by slug. This was first written as `onError` reaching
  // into the DOM to hide the image and reveal the glyph — which worked once and
  // then leaked: React has no idea a style was changed behind its back, so it
  // never put it right, and the NEXT star rendered its photo AND its glyph
  // stacked on top of each other. State React owns is the only kind it restores.
  const [failedPhotos, setFailedPhotos] = React.useState<Set<string>>(new Set());

  const skyId = path[path.length - 1];
  const sky = GUIDE_SKIES[skyId];
  const node = findNode(selected);
  const reduce = usePrefersReducedMotion();

  const { placed, anchorId } = React.useMemo(() => buildScene(path), [path]);
  const focus = React.useMemo(
    () => focusFor(placed.map((p) => ({ id: p.id, x: p.px, y: p.py })), selected),
    [placed, selected]
  );
  // "0s", not "none" — `transition: left none` is invalid and takes the whole
  // shorthand down with it.
  const ease = reduce ? "0s" : "620ms cubic-bezier(0.22, 1, 0.36, 1)";

  const descend = React.useCallback((id: string) => {
    warpRef.current(1);
    setPath((p) => [...p, id]);
    // The star you clicked STAYS selected, so its own words are what you read
    // while its children appear around it. Selecting the first child instead
    // meant one click answered a question you hadn't asked yet — you tapped
    // Explore and were told about Careers.
    setSelected(id);
  }, []);

  const ascendTo = React.useCallback((i: number, keep?: string) => {
    warpRef.current(-1);
    setPath((p) => {
      const next = p.slice(0, i + 1);
      setSelected(keep ?? GUIDE_SKIES[next[next.length - 1]].nodes[0].id);
      return next;
    });
  }, []);

  // ONE CLICK. A star with a sky in it opens on the first tap — you get its
  // words in the panel and its children in the sky, together.
  //
  // It used to take two: the first selected, the second went in. That made the
  // commonest thing on the screen cost twice what it looked like it should, and
  // the first click appeared to do nothing much. There is nothing worth reading
  // between "I tapped Explore" and "I am in Explore", so there is no reason to
  // charge a click for it.
  //
  // Leaving is the same single click in reverse: tap the star you are inside.
  // It stays selected on the way out, so the panel keeps saying what you were
  // just reading rather than jumping to something you didn't ask about.
  //
  // This is also why there is no "Look inside" button. It existed because the
  // sky-swap needed a trigger; once the tap IS the descent, a button naming a
  // destination puts a page-link back into a space you fly through.
  const tap = (id: string) => {
    if (id === anchorId) {
      ascendTo(path.length - 2, id);
      return;
    }
    if (hasSky(id)) {
      descend(id);
      return;
    }
    // A leaf: no level to change, so the field answers with a short drift.
    warpRef.current(0.32);
    setSelected(id);
  };

  return (
    <div className="space-y-4">
      <nav aria-label="Where you are" className="flex flex-wrap items-center gap-1.5">
        {path.map((id, i) => {
          const name = id === "root" ? "Everleap" : GUIDE_SKIES[id].title;
          const last = i === path.length - 1;
          return (
            <React.Fragment key={id}>
              {last ? (
                <span className="text-micro font-semibold uppercase tracking-eyebrow text-white/80">
                  {name}
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => ascendTo(i)}
                    className="text-micro font-semibold uppercase tracking-eyebrow text-white/45 transition hover:text-white"
                  >
                    {name}
                  </button>
                  <ChevronRight aria-hidden className="h-3 w-3 text-white/25" />
                </>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,1fr)] lg:items-start">
        {/* Taller on a phone. Labels are a fixed size now, so in the original
            wide-and-short box they crowded each other on a narrow screen —
            Explore and Actions sat 22px apart with their text overlapping. More
            height spreads the constellation vertically and the labels with it.
            The reverse of the laptop problem, caused by the same fix. */}
        <div
          className="relative aspect-[384/340] overflow-hidden rounded-card border border-white/[0.07] sm:aspect-[384/268]"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 40%, #0a1330 0%, #040a1e 55%, #01050f 100%)",
          }}
        >
          <Starfield warpRef={warpRef} />

          {/* THE WAY OUT, INSIDE THE SKY.
              It used to be a quiet text link BELOW the box — outside the thing
              it gets you out of, and on a phone often below the fold. The way
              out of a place belongs in that place, and it has to be the most
              obvious control on it. Sits above the stars (z-10) so a star near
              the corner can never sit on top of it.

              It goes ALL the way home, not up one level, and it says where that
              is. Climbing one rung means someone three deep has to find it and
              press it three times, never quite knowing how far there is to go;
              one button with a named destination is a thing you can trust
              without counting. Same rule as DescentShell's `backTo` — name the
              place, not the gesture. Tapping the star you're inside is still
              there for a single rung. */}
          {path.length > 1 ? (
            <button
              type="button"
              onClick={() => {
                warpRef.current(-1);
                setPath(["root"]);
                setSelected("story");
              }}
              className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-control border border-white/15 bg-[#0a1330]/85 px-3 py-2 text-label font-semibold text-white/85 backdrop-blur-sm transition hover:border-white/30 hover:bg-[#0a1330] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Your story
            </button>
          ) : null}

          {/* Edges only. Each one fades from the star it leaves to the star it
              reaches, so the direction of the dependency is visible without an
              arrowhead — the picture stays calm and still says which way it
              runs. non-scaling-stroke keeps them hairlines at any width. */}
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden
          >
            <defs>
              {sky.edges.map(([a, b]) => {
                const A = placed.find((n) => n.id === a);
                const B = placed.find((n) => n.id === b);
                if (!A || !B) return null;
                return (
                  <linearGradient
                    key={`g-${a}-${b}`}
                    id={`edge-${skyId}-${a}-${b}`}
                    gradientUnits="userSpaceOnUse"
                    x1={A.px} y1={A.py} x2={B.px} y2={B.py}
                  >
                    <stop offset="0%" stopColor={`rgba(${A.accent},0.05)`} />
                    <stop offset="50%" stopColor={`rgba(${B.accent},0.34)`} />
                    <stop offset="100%" stopColor={`rgba(${B.accent},0.10)`} />
                  </linearGradient>
                );
              })}
            </defs>
            {/* The same lean as the stars, as one transform. non-scaling-stroke
                means the zoom cannot thicken a line — the edges stay hairlines
                at every zoom and every screen width. */}
            <g
              transform={`translate(${focus.tx} ${focus.ty}) scale(${focus.z})`}
              style={{ transition: `transform ${ease}` }}
            >
              {/* The containment: a soft field of the anchor's colour around
                  everything that came out of it. Without this the anchor was
                  just another star sitting in the middle, and "you are inside
                  Explore" was something only the breadcrumb said.
                  A GLOW rather than a drawn circle on purpose — the sky's SVG
                  stretches to the box (preserveAspectRatio="none"), and on a
                  phone that box is a different shape to the viewBox, so a circle
                  would render as a squashed ellipse. A soft edge has nothing to
                  distort. */}
              {(() => {
                const a = placed.find((n) => n.isAnchor);
                if (!a) return null;
                const reach =
                  Math.max(
                    ...placed
                      .filter((p) => !p.isAnchor)
                      .map((p) => Math.hypot(p.px - a.px, p.py - a.py))
                  ) + 46;
                return (
                  <>
                    <defs>
                      <radialGradient
                        id={`halo-${skyId}`}
                        gradientUnits="userSpaceOnUse"
                        cx={a.px} cy={a.py} r={reach}
                      >
                        <stop offset="0%" stopColor={`rgba(${a.accent},0.16)`} />
                        <stop offset="55%" stopColor={`rgba(${a.accent},0.06)`} />
                        <stop offset="100%" stopColor={`rgba(${a.accent},0)`} />
                      </radialGradient>
                    </defs>
                    {/* Oversized so the focus lean can't drag an edge into view. */}
                    <rect
                      x={-VIEW_W} y={-VIEW_H}
                      width={VIEW_W * 3} height={VIEW_H * 3}
                      fill={`url(#halo-${skyId})`}
                    />
                  </>
                );
              })()}

              {/* Spokes from the anchor to what came out of it. Very faint —
                  they say "these are inside this" without competing with the
                  real dependencies below. */}
              {anchorId
                ? placed
                    .filter((p) => !p.isAnchor)
                    .map((p) => {
                      const a = placed.find((n) => n.isAnchor);
                      if (!a) return null;
                      return (
                        <line
                          key={`spoke-${p.id}`}
                          x1={a.px} y1={a.py} x2={p.px} y2={p.py}
                          stroke={`rgba(${p.accent},0.13)`}
                          strokeWidth={1}
                          vectorEffect="non-scaling-stroke"
                        />
                      );
                    })
                : null}

              {sky.edges.map(([a, b]) => {
                const A = placed.find((n) => n.id === a);
                const B = placed.find((n) => n.id === b);
                if (!A || !B) return null;
                // An edge touching the picked star stays lit. That turns the dim
                // into information — you can see what this one feeds — instead
                // of only being a spotlight effect.
                const touches = a === selected || b === selected;
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={A.px} y1={A.py} x2={B.px} y2={B.py}
                    stroke={`url(#edge-${skyId}-${a}-${b})`}
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                    opacity={touches ? 1 : 0.32}
                    style={{ transition: `opacity ${ease}` }}
                  />
                );
              })}
            </g>
          </svg>

          {/* The stars, at their real size whatever the screen. */}
          <div className="absolute inset-0" role="group" aria-label="A map of Everleap as a sky of stars">
            {placed.map((n: Placed) => {
              // The source is drawn larger than the things it feeds. That is the
              // only hierarchy in the picture, and it's a fact about the app.
              const isSel = n.id === selected;
              // The anchor is what you are standing inside, so it is never a way
              // further down — tapping it twice is how you leave it.
              const opens = hasSky(n.id) && !n.isAnchor;
              // The source, and whatever you are inside, are bigger; the picked
              // one grows on top of that. Element size, never layer scale.
              const core = (n.id === "story" || n.isAnchor ? 13 : 9) * (isSel ? 1.3 : 1);
              // Labels below, except near the floor where they'd be clipped.
              const above = n.py > 200;

              return (
                <button
                  key={n.id}
                  type="button"
                  aria-label={
                    n.isAnchor
                      ? `${n.label}, you are inside this`
                      : `${n.label}${opens ? ", opens further" : ""}`
                  }
                  aria-pressed={isSel}
                  onClick={() => tap(n.id)}
                  style={{
                    ...at(n.px * focus.z + focus.tx, n.py * focus.z + focus.ty),
                    // The unpicked stars fall back rather than disappear — this
                    // is still a map of the whole thing, with one part in front.
                    // The anchor keeps a little more presence than a sibling
                    // would: it is context, not clutter.
                    opacity: isSel ? 1 : n.isAnchor ? 0.6 : 0.38,
                    transition: `left ${ease}, top ${ease}, opacity ${ease}`,
                  }}
                  // 44px of tap target centred on the point, with the star drawn
                  // inside it — the hit area no longer has to be a fake circle.
                  // `!` because the dim is an inline style, and a plain hover
                  // rule loses to one. A dimmed star still has to answer when
                  // you point at it, or the sky reads as half disabled.
                  className="group absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none hover:!opacity-100"
                >
                  {/* Selection ring. Crisp 1px at any width, which is what the
                      scaled version could never be. */}
                  <span
                    aria-hidden
                    className="absolute rounded-full transition-all duration-300"
                    style={{
                      width: isSel ? 38 : opens ? 26 : 0,
                      height: isSel ? 38 : opens ? 26 : 0,
                      border: `1px solid rgba(${n.accent},${isSel ? 0.7 : 0.22})`,
                    }}
                  />
                  {/* The star itself: a bright core inside its own light,
                      rather than a flat dot on a flat disc. */}
                  <span
                    aria-hidden
                    className="relative rounded-full transition-all duration-300 group-hover:brightness-125"
                    style={{
                      width: core,
                      height: core,
                      background: `rgb(${n.accent})`,
                      boxShadow: `0 0 6px 1px rgba(${n.accent},${isSel ? 0.75 : 0.5}), 0 0 20px 6px rgba(${n.accent},${isSel ? 0.3 : 0.16})`,
                    }}
                  />
                  <span
                    className={[
                      "absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-micro font-semibold uppercase tracking-eyebrow transition",
                      above ? "bottom-full mb-1" : "top-full mt-1",
                      isSel ? "text-white/85" : "text-white/45 group-hover:text-white/75",
                    ].join(" ")}
                  >
                    {n.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The app's one card surface (see the design-system note: plain dark
            navy, hairline edge, no coloured wash). It was white/[0.03] over the
            page, which is a different card to every other card in Everleap. */}
        <div
          role="region"
          aria-live="polite"
          aria-label="What this star is"
          className="overflow-hidden rounded-card border border-white/[0.07] p-4"
          style={{
            background: "linear-gradient(180deg, rgb(22,29,54) 0%, rgb(15,20,40) 100%)",
            boxShadow: "0 18px 48px rgba(0,0,0,0.45)",
          }}
        >
          {/* Always an image, and always the same shape — a real photograph
              where one honestly exists, the icon plate everywhere else. A photo
              that 404s (they generate on demand) falls through to the plate
              rather than leaving a hole. */}
          {node ? (
            (() => {
              // Fun facts shows a real Time Twin, from the portrait endpoint.
              // Everything else shows a scene from the day-photo catalogue.
              const key = node.portrait ?? node.photo;
              const src = node.portrait
                ? `/api/guidance/time-twin-figure-image?slug=${encodeURIComponent(node.portrait)}`
                : node.photo
                  ? `/api/guidance/day-scene-image?path=${encodeURIComponent(node.photo)}&moment=m0` +
                    (node.photoBranch ? `&branch=${encodeURIComponent(node.photoBranch)}` : "")
                  : null;
              const usable = src && key && !failedPhotos.has(key);
              return (
                <figure className="mb-3 overflow-hidden rounded-panel border border-white/10">
                  {usable ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        key={key}
                        src={src}
                        alt=""
                        loading="lazy"
                        onError={() => {
                          if (!key) return;
                          setFailedPhotos((prev) =>
                            prev.has(key) ? prev : new Set(prev).add(key)
                          );
                        }}
                        // Portraits are people and get framed taller; scenes are
                        // places and read better wide.
                        className={[
                          "block w-full object-cover",
                          node.portrait ? "aspect-[4/3] object-top" : "aspect-[16/10]",
                        ].join(" ")}
                      />
                      {node.photoCaption ? (
                        <figcaption className="px-3 py-2 text-micro font-semibold uppercase tracking-eyebrow text-white/50">
                          {node.photoCaption}
                        </figcaption>
                      ) : null}
                    </>
                  ) : (
                    <NodePlate id={node.id} accent={node.accent} />
                  )}
                </figure>
              );
            })()
          ) : null}

          {node ? (
            <>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    background: `rgb(${node.accent})`,
                    boxShadow: `0 0 8px 2px rgba(${node.accent},0.5)`,
                  }}
                />
                <span
                  className="text-micro font-semibold uppercase tracking-eyebrow"
                  style={{ color: `rgb(${node.accent})` }}
                >
                  {node.label}
                </span>
              </div>
              <p className="mt-2 text-body leading-snug text-white/88">{node.what}</p>
              {node.fills ? (
                <p
                  className="mt-3 border-l pl-3 text-label leading-snug text-white/62"
                  style={{ borderColor: `rgba(${node.accent},0.35)` }}
                >
                  {node.fills}
                </p>
              ) : null}
              {/* No "Look inside" button. It existed because the sky-swap
                  needed a trigger; now that the zoom IS the descent, a button
                  naming a destination puts a page-link back into a space you
                  fly through. The ring on the star, and this line, teach the
                  gesture instead. */}
              {hasSky(node.id) && node.id !== anchorId ? (
                <p
                  className="mt-4 text-label font-semibold"
                  style={{ color: `rgba(${node.accent},0.85)` }}
                >
                  Tap {node.label} to go inside it.
                </p>
              ) : null}
              {node.id === anchorId ? (
                <p className="mt-4 text-label text-white/45">
                  You&rsquo;re inside {node.label}. Tap it again to come back out.
                </p>
              ) : null}
            </>
          ) : null}
        </div>
      </div>

    </div>
  );
}

export default GuideSky;
