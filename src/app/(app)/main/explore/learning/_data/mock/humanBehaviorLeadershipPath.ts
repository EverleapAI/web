// apps/web/src/app/(app)/main/explore/learning/_data/mock/humanBehaviorLeadershipPath.ts

import type { LearningPathContent } from "../learningPathSchema";

export const HUMAN_BEHAVIOR_LEADERSHIP_PATH: LearningPathContent = {
  id: "human-behavior-leadership",
  slug: "human-behavior-leadership",
  lane: "learning",

  theme: {
    tone: "warm-signal",
    accent: { r: 110, g: 210, b: 185 },
    accentStrong: { r: 255, g: 173, b: 120 },
    glow: { r: 120, g: 220, b: 200 },
    surfaceLabel: "Human insight",
  },

  card: {
    title: "Human Behavior + Leadership",
    hook:
      "Understand people, guide energy, and help groups actually move.",
    description:
      "A path for people drawn to psychology, communication, mentoring, and real leadership.",
  },

  hero: {
    eyebrow: "Learning path",
    title: "Human Behavior + Leadership",
    hook:
      "For minds that notice people, patterns, and what actually helps others move.",
    summary:
      "This path starts with observation — then becomes action. You learn how people think, what motivates them, and how to guide individuals and groups in real situations.",
    whyItPullsYouIn: [
      "You notice moods and dynamics quickly.",
      "You care about what helps people grow.",
      "You like helping groups feel clearer or calmer.",
      "You want influence to feel real, not forced.",
    ],
  },

  traitChips: [
    { id: "people-radar", label: "People radar" },
    { id: "group-awareness", label: "Group awareness" },
    { id: "empathy", label: "Empathy" },
    { id: "communication", label: "Communication" },
  ],

  fitSignals: [
    {
      id: "notice-dynamics",
      label: "You notice group dynamics quickly",
      score: 94,
      explanation:
        "You can tell what is happening in a room before it is said out loud.",
    },
    {
      id: "curious-about-people",
      label: "You are curious about people",
      score: 91,
      explanation:
        "You want to understand behavior, not just react to it.",
    },
    {
      id: "help-groups-move",
      label: "You like helping groups function better",
      score: 88,
      explanation:
        "You naturally try to improve clarity, trust, or direction.",
    },
  ],

  whatYouLearn: [
    {
      id: "behavior",
      title: "How people actually behave",
      description:
        "Motivation, emotion, identity, and what drives decisions.",
    },
    {
      id: "communication",
      title: "How communication changes outcomes",
      description:
        "Tone, timing, clarity, and how messages land.",
    },
    {
      id: "group-dynamics",
      title: "How groups function",
      description:
        "Trust, culture, belonging, and what makes teams work or fail.",
    },
    {
      id: "mentorship",
      title: "How to support growth in others",
      description:
        "Feedback, encouragement, and helping someone improve.",
    },
    {
      id: "leadership",
      title: "What real leadership looks like",
      description:
        "Guiding energy, not controlling people.",
    },
  ],

  featuredOpportunity: {
    title: "Start observing real group dynamics",
    provider: "Real environments",
    summary:
      "Use a real class, team, or group as your learning environment.",
    whyStartHere:
      "This path becomes real when you observe actual people, not just read about them.",
    mode: "local",
    formatLabel: "Real-world observation",
  },

  opportunityGroups: [
    {
      id: "try-this-week",
      title: "Try this this week",
      description:
        "Fast ways to test whether this path actually feels real to you.",
      items: [
        {
          id: "observe-group",
          title: "Observe a real group like a systems lab",
          provider: "Real life",
          summary:
            "Watch a class, team, or group and track energy and behavior.",
          whyItFits:
            "You will immediately see patterns if this path fits you.",
          mode: "local",
          formatLabel: "Observation",
          tags: ["beginner-friendly", "hands-on"],
        },
        {
          id: "help-one-person",
          title: "Help one person improve at something",
          provider: "Self-directed",
          summary:
            "Support someone in a small, real way.",
          whyItFits:
            "Mentorship makes this path real instantly.",
          mode: "local",
          formatLabel: "Real interaction",
          tags: ["hands-on"],
        },
      ],
    },

    {
      id: "build-skill",
      title: "Build real skill",
      description:
        "Ways to deepen your understanding and practice leadership.",
      items: [
        {
          id: "khan-psych",
          title: "Khan Academy Psychology",
          provider: "Khan Academy",
          summary:
            "Learn foundational psychology concepts.",
          whyItFits:
            "Gives language to what you are already noticing.",
          mode: "virtual",
          href: "https://www.khanacademy.org/test-prep/mcat/behavior",
          formatLabel: "Self-paced",
          tags: ["free", "self-paced"],
        },
        {
          id: "coursera-leadership",
          title: "Intro leadership + communication courses",
          provider: "Coursera",
          summary:
            "Structured lessons on leadership and group dynamics.",
          whyItFits:
            "Helps you connect practice with frameworks.",
          mode: "virtual",
          formatLabel: "Structured learning",
          tags: ["structured"],
        },
      ],
    },

    {
      id: "near-you",
      title: "Near you (Marin / Bay Area)",
      description:
        "Real environments where leadership and people skills matter.",
      items: [
        {
          id: "student-leadership",
          title: "Student leadership or club roles",
          provider: "Schools / clubs",
          summary:
            "Lead meetings, organize groups, or support peers.",
          whyItFits:
            "Real groups are the best place to learn leadership.",
          mode: "local",
          locationLabel: "Marin / North Bay",
          tags: ["local", "hands-on"],
        },
        {
          id: "coaching",
          title: "Youth coaching or mentorship roles",
          provider: "Sports / camps",
          summary:
            "Help younger students grow and improve.",
          whyItFits:
            "You learn fast when you are responsible for someone else.",
          mode: "local",
          locationLabel: "Marin County",
          tags: ["local", "hands-on"],
        },
        {
          id: "volunteering",
          title: "Community volunteering",
          provider: "Nonprofits",
          summary:
            "Work in real human environments that need support.",
          whyItFits:
            "This path becomes clear when your actions affect real people.",
          mode: "local",
          locationLabel: "Near 94901",
          tags: ["local"],
        },
      ],
    },
  ],
};