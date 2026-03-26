// apps/web/src/app/(app)/main/explore/learning/_data/mock/humanBehaviorLeadershipPath.ts

import type { LearningPathContent } from "../learningPathSchema";

export const HUMAN_BEHAVIOR_LEADERSHIP_PATH: LearningPathContent = {
  id: "human-behavior-leadership",
  slug: "human-behavior-leadership",
  lane: "learning",

  theme: {
    tone: "people-dynamics",
    accent: { r: 120, g: 190, b: 255 },
    accentStrong: { r: 160, g: 120, b: 255 },
    glow: { r: 140, g: 200, b: 255 },
    surfaceLabel: "People + leadership",
  },

  card: {
    title: "Human Behavior + Leadership",
    hook: "Understand people — and learn how to lead, influence, and support them.",
    description:
      "A path for people interested in psychology, communication, leadership, and how people think, feel, and act.",
  },

  hero: {
    eyebrow: "Learning path",
    title: "Human Behavior + Leadership",
    hook:
      "For people who notice how others think, feel, and interact — and want to get better at working with them.",
    summary:
      "This path is about understanding people in real situations — how they think, what motivates them, how groups behave, and how leadership actually works.",
    whyItPullsYouIn: [
      "You notice how people act and react.",
      "You care about helping or guiding others.",
      "You are curious about motivation and behavior.",
      "You want to lead or influence in real situations.",
    ],
  },

  traitChips: [
    { id: "people-awareness", label: "People awareness" },
    { id: "empathy", label: "Empathy" },
    { id: "communication", label: "Communication" },
    { id: "leadership", label: "Leadership" },
  ],

  fitSignals: [
    {
      id: "reads-people",
      label: "You read people well",
      score: 92,
      explanation:
        "You notice emotions, reactions, and social dynamics quickly.",
    },
    {
      id: "helping-drive",
      label: "You want to help or guide others",
      score: 90,
      explanation:
        "You naturally step into roles where you support or organize people.",
    },
    {
      id: "group-awareness",
      label: "You notice how groups behave",
      score: 88,
      explanation:
        "You see patterns in how people interact in teams or social settings.",
    },
  ],

  whatYouLearn: [
    {
      id: "psychology-basics",
      title: "How people think and behave",
      description:
        "Core ideas in psychology, motivation, and decision-making.",
    },
    {
      id: "communication",
      title: "How communication actually works",
      description:
        "Listening, clarity, persuasion, and emotional awareness.",
    },
    {
      id: "group-dynamics",
      title: "How groups function",
      description:
        "Leadership, roles, influence, and team dynamics.",
    },
    {
      id: "leadership-skills",
      title: "How leadership works in real life",
      description:
        "Guiding people, making decisions, and handling challenges.",
    },
    {
      id: "real-world-application",
      title: "How to apply this in real situations",
      description:
        "Using these skills in school, teams, and everyday life.",
    },
  ],

  featuredOpportunity: {
    title: "Observe people in real situations",
    provider: "Real world",
    summary:
      "Spend time noticing how people act in groups — who leads, who follows, and how decisions get made.",
    whyStartHere:
      "This path becomes real when you start observing behavior in real environments.",
    mode: "hybrid",
    formatLabel: "Observation + reflection",
  },

  opportunityGroups: [
    {
      id: "near-you",
      title: "Near you (real people, real dynamics)",
      description:
        "Places where you can observe, participate, and lead in real situations.",
      items: [
        {
          id: "volunteer",
          title: "Volunteer in your community",
          provider: "VolunteerMatch",
          summary:
            "Work with people in real environments and see how communication and leadership play out.",
          whyItFits:
            "You learn fast when you are working with real people.",
          mode: "local",
          href: "https://www.volunteermatch.org",
          locationLabel: "Near you",
          formatLabel: "Real-world interaction",
          tags: ["local", "hands-on"],
        },
        {
          id: "student-leadership",
          title: "Student leadership roles",
          provider: "School programs",
          summary:
            "Take on roles in student government, clubs, or team leadership.",
          whyItFits:
            "You practice leadership directly instead of just learning about it.",
          mode: "local",
          href: "https://www.google.com/search?q=student+leadership+programs+high+school",
          locationLabel: "School / local",
          formatLabel: "Leadership roles",
          tags: ["local", "hands-on"],
        },
        {
          id: "toastmasters",
          title: "Toastmasters (youth + local clubs)",
          provider: "Toastmasters",
          summary:
            "Practice communication, speaking, and leadership in structured environments.",
          whyItFits:
            "You build confidence and communication skill through repetition.",
          mode: "hybrid",
          href: "https://www.toastmasters.org/find-a-club",
          locationLabel: "Local / hybrid",
          formatLabel: "Speaking + leadership",
          tags: ["structured", "hands-on"],
        },
        {
          id: "mentoring",
          title: "Peer mentoring or tutoring",
          provider: "School / community",
          summary:
            "Help others learn and improve while developing leadership and empathy.",
          whyItFits:
            "Teaching is one of the fastest ways to understand people.",
          mode: "local",
          href: "https://www.google.com/search?q=peer+mentoring+program+near+me",
          locationLabel: "Local",
          formatLabel: "Mentorship",
          tags: ["local", "hands-on"],
        },
        {
          id: "community-groups",
          title: "Community groups and team environments",
          provider: "Meetup",
          summary:
            "Join groups where people collaborate, organize, and lead together.",
          whyItFits:
            "You see real group dynamics instead of theory.",
          mode: "local",
          href: "https://www.meetup.com",
          locationLabel: "Near you",
          formatLabel: "Group interaction",
          tags: ["local", "hands-on"],
        },
      ],
    },

    {
      id: "build-skill",
      title: "Build understanding",
      description:
        "Use these to understand what you are seeing in real-world interactions.",
      items: [
        {
          id: "khan-psych",
          title: "Khan Academy Psychology",
          provider: "Khan Academy",
          summary:
            "Learn the basics of how people think, feel, and behave.",
          whyItFits:
            "Gives structure to what you observe in real life.",
          mode: "virtual",
          href: "https://www.khanacademy.org/science/ap-psychology",
          formatLabel: "Structured learning",
          tags: ["structured", "free", "self-paced"],
        },
        {
          id: "coursera-leadership",
          title: "Leadership and communication courses",
          provider: "Coursera",
          summary:
            "Courses on leadership, communication, and team dynamics.",
          whyItFits:
            "Helps you understand the patterns behind behavior.",
          mode: "virtual",
          href: "https://www.coursera.org/courses?query=leadership%20communication",
          formatLabel: "Courses",
          tags: ["structured", "self-paced"],
        },
        {
          id: "stanford-ecorner",
          title: "Stanford eCorner (leadership stories)",
          provider: "Stanford",
          summary:
            "Real stories about leadership, decision-making, and working with people.",
          whyItFits:
            "Shows how leadership actually plays out in real situations.",
          mode: "virtual",
          href: "https://ecorner.stanford.edu",
          formatLabel: "Talks",
          tags: ["self-paced"],
        },
        {
          id: "bigfuture",
          title: "BigFuture career exploration",
          provider: "College Board",
          summary:
            "Explore careers related to psychology, leadership, and social impact.",
          whyItFits:
            "Helps connect your interests to real paths.",
          mode: "virtual",
          href: "https://bigfuture.collegeboard.org",
          formatLabel: "Exploration",
          tags: ["self-paced"],
        },
        {
          id: "ted-talks",
          title: "TED Talks on human behavior",
          provider: "TED",
          summary:
            "Watch talks on psychology, leadership, and social dynamics.",
          whyItFits:
            "Quick exposure to real ideas and perspectives.",
          mode: "virtual",
          href: "https://www.ted.com/topics/psychology",
          formatLabel: "Short content",
          tags: ["self-paced"],
        },
      ],
    },
  ],
};