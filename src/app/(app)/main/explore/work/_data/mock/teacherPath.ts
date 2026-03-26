// apps/web/src/app/(app)/main/explore/work/_data/mock/teacherPath.ts

import type { WorkPathContent } from "../workPathSchema";

export const TEACHER_PATH: WorkPathContent = {
  id: "teacher",
  slug: "teacher",
  lane: "work",

  theme: {
    tone: "guiding-light",
    accent: { r: 94, g: 214, b: 160 },
    accentStrong: { r: 76, g: 184, b: 255 },
    glow: { r: 142, g: 239, b: 206 },
    surfaceLabel: "Mentorship",
  },

  card: {
    title: "Teacher",
    hook: "Help people understand something they couldn't see before.",
    description:
      "A path for people who enjoy explaining ideas, guiding others, and helping someone go from confusion to clarity.",
  },

  hero: {
    eyebrow: "Work Path",
    title: "Teacher",
    hook:
      "You notice when someone almost understands something - and want to help them get there.",
    summary:
      "Teaching is helping understanding actually take hold - not just delivering information.",
    whyItPullsYouIn: [
      "You enjoy explaining ideas and seeing things click.",
      "You notice when someone is stuck or almost there.",
      "You like helping people grow over time.",
    ],
  },

  traitChips: [
    { id: "communication", label: "Clear communication" },
    { id: "patience", label: "Patience" },
    { id: "people-awareness", label: "People awareness" },
    { id: "concept-clarity", label: "Concept clarity" },
  ],

  fitSignals: [
    {
      id: "explaining-instinct",
      label: "Explaining instinct",
      score: 91,
      explanation:
        "You naturally want to help people understand things, not leave them stuck.",
    },
    {
      id: "people-focus",
      label: "People focus",
      score: 88,
      explanation: "You get energy from helping others grow.",
    },
    {
      id: "clarity-building",
      label: "Clarity building",
      score: 86,
      explanation:
        "You break complex ideas into steps others can follow.",
    },
  ],

  snapshotStats: [
    {
      id: "focus-mode",
      label: "Best mode",
      value: "Explanation + interaction",
      note: "Helping ideas land clearly",
    },
    {
      id: "daily-shape",
      label: "Work rhythm",
      value: "Prep + teaching",
      note: "Explain to adjust to support",
    },
    {
      id: "output",
      label: "Typical output",
      value: "Understanding",
      note: "People gaining skill and confidence",
    },
  ],

  specialtyPreviews: [
    {
      id: "classroom-teacher",
      slug: "classroom-teacher",
      title: "Classroom Teacher",
      oneLiner: "Guides groups through structured learning.",
      whyItCouldFit:
        "Strong if you like building environments where groups grow.",
      energy: "craft",
    },
    {
      id: "mentor-coach",
      slug: "mentor-coach",
      title: "Mentor or Coach",
      oneLiner: "Helps individuals improve through feedback and guidance.",
      whyItCouldFit:
        "Strong for one-on-one growth and confidence building.",
      energy: "high-creative",
    },
    {
      id: "education-creator",
      slug: "education-creator",
      title: "Education Creator",
      oneLiner: "Builds learning content for large audiences.",
      whyItCouldFit:
        "Strong if you like teaching at scale through content.",
      energy: "systems",
    },
  ],

  specialties: [
    {
      id: "classroom-teacher",
      slug: "classroom-teacher",
      title: "Classroom Teacher",
      summary:
        "This version of teaching is about guiding a whole group through learning that has to be clear, structured, and emotionally manageable.",
      whatYouActuallyDo: [
        "Plan lessons that move a group from confusion toward understanding.",
        "Lead a room with different energy levels and abilities.",
        "Adjust in real time when something is not landing.",
      ],
      skillsThatGrowHere: [
        "Room leadership",
        "Lesson design",
        "Group communication",
      ],
      starterProjects: [
        "Volunteer in classrooms or youth programs.",
        "Create a lesson and teach it to someone.",
      ],
      atmosphere:
        "Structured, fast-moving, and very human.",
    },
    {
      id: "mentor-coach",
      slug: "mentor-coach",
      title: "Mentor or Coach",
      summary:
        "More personal, one-on-one guidance focused on growth and feedback.",
      whatYouActuallyDo: [
        "Work closely with individuals.",
        "Give feedback that helps improvement.",
        "Build confidence over time.",
      ],
      skillsThatGrowHere: [
        "One-on-one guidance",
        "Trust-building",
      ],
      starterProjects: [
        "Tutor someone regularly.",
        "Volunteer as a mentor or assistant coach.",
      ],
      atmosphere: "Personal and high-trust.",
    },
    {
      id: "education-creator",
      slug: "education-creator",
      title: "Education Creator",
      summary:
        "Teaching through content at scale — videos, courses, guides.",
      whatYouActuallyDo: [
        "Turn ideas into structured lessons.",
        "Design learning flows.",
      ],
      skillsThatGrowHere: [
        "Curriculum design",
        "Instructional clarity",
      ],
      starterProjects: [
        "Create a mini-course.",
        "Build a tutorial series.",
      ],
      atmosphere: "Creative and system-driven.",
    },
  ],

  dayInLife: {
    title: "A day in the life",
    summary:
      "Teaching is not just explaining. It is reading people and adjusting in real time.",
    moments: [],
  },

  forecast: {
    title: "What growth can look like",
    summary:
      "You gain traction when you consistently help real people learn.",
    stages: [],
  },

  forecastV2: {
    outlookLabel: "Stable - but demanding",
    outlookSummary:
      "Teaching is meaningful and stable but requires energy and resilience.",
    metrics: [],
    salaryRange: {
      low: "$45K",
      median: "$62K",
      high: "$95K+",
    },
    industry: {
      sourceLabel: "BLS",
      sourceUrl:
        "https://www.bls.gov/ooh/education-training-and-library/high-school-teachers.htm",
    },
    whatIsGrowing: [],
    whatIsUnderPressure: [],
    aiImpact: {
      level: "low",
      summary: "",
      helpsWith: [],
      putsPressureOn: [],
      humansStillOwn: [],
    },
    whyThisCouldFeelExciting: [],
    whyThisCouldFeelRisky: [],
  },

  nextSteps: {
    title: "Real next steps",
    summary:
      "Start teaching someone - that is where this path begins.",
    actions: [],
    opportunityGroups: [],
  },

  nextStepsV2: {
    heroTitle: "The fastest way to understand teaching is to teach someone real",
    heroSummary:
      "Do not wait for permission or a classroom. Teaching becomes real the moment you help someone go from confused to clear.",
    heroBadge: "Make learning happen",

    sections: [
      {
        id: "local",
        eyebrow: "Near 94901",
        title: "Get in front of real learners",
        description:
          "Teaching becomes real when you work with actual people.",
        mode: "local",
        items: [
          {
            id: "marin-library-volunteer",
            title: "Marin County Library Volunteer Programs",
            href: "https://marinlibrary.org/support/volunteer/",
            note:
              "A real entry point into tutoring and community learning.",
            badge: "Community teaching",
            mode: "local",
          },
          {
            id: "ymca-sf-youth",
            title: "YMCA San Francisco Youth Programs",
            href: "https://www.ymcasf.org/programs/youth-programs",
            note:
              "Work with kids in structured learning environments.",
            badge: "Youth programs",
            mode: "local",
          },
          {
            id: "boys-girls-club",
            title: "Boys & Girls Clubs of Marin",
            href: "https://www.bgcamarin.org/",
            note:
              "Mentor and support students directly.",
            badge: "Mentorship",
            mode: "local",
          },
        ],
      },
      {
        id: "remote",
        eyebrow: "Online",
        title: "Learn how great teaching works",
        description:
          "Study strong teaching and start practicing immediately.",
        mode: "remote",
        items: [
          {
            id: "khan-academy",
            title: "Khan Academy",
            href: "https://www.khanacademy.org/",
            note: "Study clear, structured explanations.",
            badge: "Model teaching",
            mode: "remote",
          },
          {
            id: "crashcourse",
            title: "CrashCourse (YouTube)",
            href: "https://www.youtube.com/user/crashcourse",
            note: "See engaging teaching at scale.",
            badge: "Engaging teaching",
            mode: "remote",
          },
          {
            id: "notion-course",
            title: "Build a Mini Course (Notion)",
            href: "https://www.notion.so/",
            note:
              "Turn something you know into a lesson.",
            badge: "Create lessons",
            mode: "remote",
          },
        ],
      },
    ],
  },
};