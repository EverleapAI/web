// apps/web/src/app/(app)/main/explore/work/_data/getWorkAgenticOpening.ts

export type WorkAgenticPageKind =
  | "lane"
  | "overview"
  | "day"
  | "forecast"
  | "nextSteps"
  | "specialties"
  | "specialtyDetail";

export type WorkAgenticOpening = {
  intro: string;
  body: string;
  bridge: string;
};

type GetWorkAgenticOpeningArgs = {
  pageKind: WorkAgenticPageKind;
  pathId: string;
  specialtySlug?: string | null;
  firstName?: string | null;
};

function toTitleCase(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function extractFirstNameFromUnknown(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;

  const obj = value as Record<string, unknown>;
  const candidateKeys = [
    "firstName",
    "firstname",
    "preferredName",
    "preferred_name",
    "name",
    "fullName",
    "full_name",
  ];

  for (const key of candidateKeys) {
    const raw = obj[key];
    if (typeof raw === "string" && raw.trim()) {
      const first = raw.trim().split(/\s+/)[0];
      if (first) return toTitleCase(first);
    }
  }

  for (const nestedKey of ["user", "profile", "answers", "aboutYou", "about"]) {
    const nested = obj[nestedKey];
    const nestedName = extractFirstNameFromUnknown(nested);
    if (nestedName) return nestedName;
  }

  return null;
}

export function readStoredFirstName(): string | null {
  if (typeof window === "undefined") return null;

  const storageKeys = [
    "everleapOnboarding_v4_convo_min",
    "everleap.story.answers.v3",
    "everleap.story.answers",
    "everleap.user",
    "everleap.profile",
    "userProfile",
  ];

  for (const key of storageKeys) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw) as unknown;
      const firstName = extractFirstNameFromUnknown(parsed);
      if (firstName) return firstName;
    } catch {
      // Ignore malformed values and continue.
    }
  }

  return null;
}

function withLead(firstName?: string | null) {
  return firstName ? `${firstName}, ` : "";
}

function getLaneOpening(firstName?: string | null): WorkAgenticOpening {
  const lead = withLead(firstName);

  return {
    intro: `${lead}this is not about picking a forever answer before you have enough signal.`,
    body:
      "Work becomes easier to explore when you stop asking which title sounds impressive and start asking which kinds of problems, people, systems, or worlds keep catching your attention in a real way. The goal here is to notice where your mind already leans — then give that instinct something more concrete to move toward.",
    bridge:
      "Start with the directions that feel unusually close. You are not choosing your whole future here. You are finding the paths that seem to recognize something true about you.",
  };
}

function getOverviewOpening(
  pathId: string,
  firstName?: string | null
): WorkAgenticOpening {
  const lead = withLead(firstName);

  switch (pathId) {
    case "game-designer":
      return {
        intro: `${lead}this path usually pulls people who notice the structure underneath the experience.`,
        body:
          "It is rarely just about liking games. It is more often about noticing pacing, reward, friction, balance, challenge, atmosphere, and the invisible logic that makes someone want to keep going. People drawn here often care about systems, emotion, story, or world-building in a way that feels hard to switch off.",
        bridge:
          "Use this page to feel whether game design is simply interesting to you — or whether it feels like a world your mind already keeps trying to step inside.",
      };

    case "product-ux-builder":
    case "product-builder":
      return {
        intro: `${lead}this path often begins with the feeling that something should work better than it does.`,
        body:
          "People drawn here usually notice friction fast. They see the extra step, the awkward flow, the confusing screen, or the tool that almost helps but does not quite land. Over time, that instinct can become product judgment, design clarity, and a real ability to make systems feel more human.",
        bridge:
          "This page is here to help you sense whether that mix of structure, empathy, and improvement feels deeper than a passing interest.",
      };

    case "health-human-support":
    case "health-support":
      return {
        intro: `${lead}this path tends to pull people who do not automatically look away from the human side of things.`,
        body:
          "Some people naturally notice overwhelm, pain, discouragement, recovery, or the quiet effort it takes for someone to stay steady. This kind of work turns trust, grounded care, and real presence into something people can actually rely on.",
        bridge:
          "Use this page to feel whether that kind of role feels heavy in the wrong way — or meaningful in the kind of way that keeps calling you closer.",
      };

    case "teaching-mentorship":
    case "teaching":
      return {
        intro: `${lead}this path often starts with the instinct to help understanding happen.`,
        body:
          "People drawn here often notice where someone is stuck, what they almost understand, and what kind of explanation, challenge, or encouragement would help something finally click. Teaching and mentorship turn that instinct into guidance, clarity, growth, and trust over time.",
        bridge:
          "As you move through this page, notice whether helping people learn feels merely admirable to you — or whether it feels surprisingly natural from the inside.",
      };

    default:
      return {
        intro: `${lead}there is usually a reason this path surfaced for you.`,
        body:
          "The strongest directions often begin as a pattern: what keeps your attention, what you naturally analyze, and what kinds of problems or worlds keep pulling you back.",
        bridge:
          "This page is here to help you feel what this path is really about before deciding how deeply you want to go.",
      };
  }
}

function getDayOpening(
  pathId: string,
  firstName?: string | null
): WorkAgenticOpening {
  const lead = withLead(firstName);

  switch (pathId) {
    case "game-designer":
      return {
        intro: `${lead}one of the clearest ways to understand this path is to feel the rhythm of a real day inside it.`,
        body:
          "This work is usually less about one giant flash of inspiration and more about pattern recognition, iteration, tradeoffs, playtesting, feedback, and constant refinement. You notice something, shape it, test it, and reshape it until the experience starts landing the way it should.",
        bridge:
          "As you read this page, notice whether the rhythm feels draining, flat, or quietly energizing. That reaction matters more than whether the title sounds impressive.",
      };

    case "product-ux-builder":
    case "product-builder":
      return {
        intro: `${lead}sometimes the clearest way to understand a path is to imagine the flow of an actual day inside it.`,
        body:
          "Product and UX work often move between observation, design thinking, prioritization, collaboration, feedback, and refining what helps a person move through a system more clearly.",
        bridge:
          "Pay attention to whether that rhythm feels interesting from the inside, not just smart from the outside.",
      };

    case "health-human-support":
    case "health-support":
      return {
        intro: `${lead}this page is here to help you imagine the lived rhythm of the work, not just the title of it.`,
        body:
          "Support-oriented paths often move through real human moments: listening, responding, adjusting, staying steady, and helping someone feel a little more supported than they did before.",
        bridge:
          "The question is not whether every moment sounds easy. It is whether the emotional rhythm of the day feels meaningful to you.",
      };

    case "teaching-mentorship":
    case "teaching":
      return {
        intro: `${lead}one of the best ways to understand this path is to feel the daily rhythm of helping understanding happen.`,
        body:
          "Teaching and mentorship usually move through explanation, feedback, adjustment, encouragement, and small moments where something finally clicks for another person.",
        bridge:
          "Notice whether that rhythm feels tiring in the wrong way, or satisfying in the kind of way that keeps pulling you back.",
      };

    default:
      return {
        intro: `${lead}sometimes the clearest way to understand a path is to imagine the rhythm of a real day inside it.`,
        body:
          "A career is not just a title or a list of skills. It is a pattern of attention, collaboration, challenge, and momentum repeated over time.",
        bridge:
          "As you move through these moments, notice whether the energy of the day feels like something you would want to step into more often.",
      };
  }
}

function getForecastOpening(
  pathId: string,
  firstName?: string | null
): WorkAgenticOpening {
  const lead = withLead(firstName);

  switch (pathId) {
    case "game-designer":
      return {
        intro: `${lead}this page is less about predicting everything and more about showing how momentum usually builds in this world.`,
        body:
          "Most people do not begin with a finished identity. They begin with curiosity, small experiments, stronger questions, feedback, and a body of work that slowly becomes more recognizable over time.",
        bridge:
          "The point of a forecast is not pressure. It is perspective — a way to see how this path can deepen if it keeps feeling more alive as you get closer to it.",
      };

    case "product-ux-builder":
    case "product-builder":
      return {
        intro: `${lead}growth in this path usually comes from repeated contact with real problems and stronger judgment over time.`,
        body:
          "People often begin by noticing friction, then move toward designing better flows, making sharper product decisions, and thinking more strategically about systems as their confidence grows.",
        bridge:
          "This forecast is here to help you imagine the arc of the path, not to suggest you need to rush to the end of it.",
      };

    case "health-human-support":
    case "health-support":
      return {
        intro: `${lead}paths like this usually deepen through experience, trust, and the ability to stay grounded in more complex human situations over time.`,
        body:
          "Growth here often means becoming steadier, more skillful, and more capable of helping in ways that are both practical and emotionally real.",
        bridge:
          "A forecast helps you feel whether the long-term shape of this path still feels meaningful as it becomes more demanding, more skillful, and more important.",
      };

    case "teaching-mentorship":
    case "teaching":
      return {
        intro: `${lead}this page is here to show how the path can evolve as your confidence, skill, and influence grow.`,
        body:
          "People in this world often begin by helping in small ways, then become clearer, stronger, and more effective at guiding understanding and growth over time.",
        bridge:
          "The future of the path matters not because you need to decide now, but because it helps you sense whether the direction keeps getting more interesting.",
      };

    default:
      return {
        intro: `${lead}growth on a path usually happens in layers, not all at once.`,
        body:
          "People often begin with curiosity and signals, then build confidence through repetition, clearer identity, and stronger work over time.",
        bridge:
          "This forecast is meant to give you perspective on how the path can deepen, not pressure you into choosing the whole future today.",
      };
  }
}

function getNextStepsOpening(
  pathId: string,
  firstName?: string | null
): WorkAgenticOpening {
  const lead = withLead(firstName);

  switch (pathId) {
    case "game-designer":
      return {
        intro: `${lead}you do not need a master plan to move toward this path.`,
        body:
          "Momentum usually starts with one real signal: noticing a mechanic, changing a system, making a tiny experiment, joining a space where people are building, or testing whether your curiosity gets stronger when you get closer to the work itself.",
        bridge:
          "Think of this page as a set of believable doors into the world of game design. You are not trying to prove everything at once — just choose the next door that feels alive.",
      };

    case "product-ux-builder":
    case "product-builder":
      return {
        intro: `${lead}you do not need to map the whole future before taking a useful step.`,
        body:
          "The strongest momentum here often starts with one real act of noticing: friction in an app, a flow that could be clearer, or a system that should feel easier for the person using it.",
        bridge:
          "This page is meant to give you a few believable doors into product and UX work so you can move from instinct to evidence.",
      };

    case "health-human-support":
    case "health-support":
      return {
        intro: `${lead}the next step here does not have to be dramatic to matter.`,
        body:
          "Support-oriented paths usually become real through small signals: being trusted, showing up steadily, learning how care actually works, and getting closer to the environments where people genuinely need help.",
        bridge:
          "Use this page to find one door that lets you move from empathy and instinct into something grounded and real.",
      };

    case "teaching-mentorship":
    case "teaching":
      return {
        intro: `${lead}you do not have to become a finished mentor before you begin acting like one.`,
        body:
          "This path usually gets clearer through small proofs: helping someone understand something, noticing where learning breaks down, and spending time in spaces where growth and guidance really happen.",
        bridge:
          "The goal here is not to do everything. It is to choose one next move that lets you test whether this kind of work keeps pulling you in.",
      };

    default:
      return {
        intro: `${lead}you do not need certainty before taking a real next step.`,
        body:
          "Most strong directions get clearer through contact with the work itself: a tiny experiment, a first conversation, or one environment that makes the path feel more real.",
        bridge:
          "Treat this page as a set of doors. Pick one that feels doable and interesting, then let the signal get stronger from there.",
      };
  }
}

function getSpecialtiesOpening(
  pathId: string,
  firstName?: string | null
): WorkAgenticOpening {
  const lead = withLead(firstName);

  switch (pathId) {
    case "game-designer":
      return {
        intro: `${lead}this is where the path usually starts feeling more personal.`,
        body:
          "Game design is not one single role. Some people come alive around systems and balance. Some care most about space, pacing, and movement. Others are drawn to story, choice, and emotional pull.",
        bridge:
          "The point is not to choose perfectly right now. It is to notice which version of the path feels most like your kind of mind.",
      };

    case "product-ux-builder":
    case "product-builder":
      return {
        intro: `${lead}this is often the moment when a broad path turns into something more recognizable.`,
        body:
          "Some people are most drawn to product thinking, some to interaction and flow, and some to the structure underneath how a tool actually works for a human being.",
        bridge:
          "You are not locking yourself in. You are noticing which version feels most energizing to move toward.",
      };

    case "health-human-support":
    case "health-support":
      return {
        intro: `${lead}this path can take different forms depending on what kind of care feels most real to you.`,
        body:
          "Some people are pulled toward emotional support, some toward recovery and rehabilitation, and some toward helping communities or groups stay healthier over time.",
        bridge:
          "What matters here is noticing where your steadiness, care, and attention feel most alive.",
      };

    case "teaching-mentorship":
    case "teaching":
      return {
        intro: `${lead}this is where a general instinct to guide people starts taking shape.`,
        body:
          "Some people are drawn to formal teaching, some to coaching and skill-building, and some to long-term mentorship that helps a person grow over time.",
        bridge:
          "You do not need to force a final answer. You are simply looking for the version that feels most natural to you.",
      };

    default:
      return {
        intro: `${lead}this is where the path starts separating into different versions of itself.`,
        body:
          "Most broad directions become more interesting once you can feel the internal branches inside them. Usually one version pulls harder than the others.",
        bridge:
          "That signal matters. It helps the path feel less generic and more like a real fit.",
      };
  }
}

function getSpecialtyDetailOpening(
  pathId: string,
  specialtySlug: string,
  firstName?: string | null
): WorkAgenticOpening {
  const lead = withLead(firstName);

  if (pathId === "game-designer") {
    switch (specialtySlug) {
      case "systems-designer":
        return {
          intro: `${lead}this version of the path usually pulls people who care about the invisible structure underneath the experience.`,
          body:
            "You may be less interested in surface flash and more interested in why a loop works, why a reward lands, why progression keeps pulling someone forward, or why a system suddenly feels unfair.",
          bridge:
            "If this branch fits, you are probably drawn to the logic, balance, and tradeoffs that make the whole world hold together.",
        };

      case "level-designer":
        return {
          intro: `${lead}this version of the path usually pulls people who feel space, movement, and pacing very intuitively.`,
          body:
            "You may notice how an environment guides attention, where tension builds, where players get relief, and how layout alone can change what the experience feels like.",
          bridge:
            "If this branch fits, you are probably drawn to the choreography of a player moving through a world.",
        };

      case "narrative-designer":
        return {
          intro: `${lead}this version of the path usually pulls people who care about emotion, choice, and what a story feels like when the player is inside it.`,
          body:
            "You may be drawn not just to plot, but to consequence, character logic, emotional timing, and the difference between watching a story and inhabiting one.",
          bridge:
            "If this branch fits, you are probably interested in how writing, systems, and player agency begin to overlap.",
        };
    }
  }

  return {
    intro: `${lead}this version of the path usually attracts a particular kind of energy.`,
    body:
      "Once a broad path starts narrowing into a specialty, the fit often becomes easier to feel. Certain kinds of problems, patterns, and ways of thinking begin to pull harder than others.",
    bridge:
      "The goal here is not to force certainty. It is to notice whether this version of the path feels more like you.",
  };
}

export function getWorkAgenticOpening({
  pageKind,
  pathId,
  specialtySlug,
  firstName,
}: GetWorkAgenticOpeningArgs): WorkAgenticOpening {
  switch (pageKind) {
    case "lane":
      return getLaneOpening(firstName);

    case "overview":
      return getOverviewOpening(pathId, firstName);

    case "day":
      return getDayOpening(pathId, firstName);

    case "forecast":
      return getForecastOpening(pathId, firstName);

    case "nextSteps":
      return getNextStepsOpening(pathId, firstName);

    case "specialties":
      return getSpecialtiesOpening(pathId, firstName);

    case "specialtyDetail":
      return getSpecialtyDetailOpening(
        pathId,
        specialtySlug ?? "",
        firstName
      );

    default:
      return {
        intro: "There is usually a reason this path surfaced for you.",
        body:
          "The strongest directions often begin as a pattern: what keeps your attention, what you naturally analyze, and what kinds of problems or worlds pull you in.",
        bridge:
          "This page is here to help you feel what this path is really about before deciding how deeply you want to go.",
      };
  }
}