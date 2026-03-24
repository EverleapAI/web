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
        "This version of teaching is about guiding a whole group through learning that has to be clear, structured, and emotionally manageable. You are not just explaining content — you are creating the environment where a room full of different people can actually learn.",
      whatYouActuallyDo: [
        "Plan lessons that move a group from confusion toward understanding in a way that feels organized and doable.",
        "Lead a room with different energy levels, different strengths, and different frustrations all at the same time.",
        "Notice when the lesson is not landing and adjust in real time instead of just pushing through the plan.",
        "Give feedback, manage behavior, build trust, and create a space where students feel safe enough to try.",
      ],
      skillsThatGrowHere: [
        "Room leadership",
        "Lesson design",
        "Live adjustment under pressure",
        "Group communication",
      ],
      starterProjects: [
        "Volunteer in classrooms, after-school programs, camps, or youth learning environments.",
        "Practice explaining the same idea three different ways for three different kinds of learners.",
        "Create a short lesson plan and test it by helping a younger student or peer understand something real.",
      ],
      atmosphere:
        "Structured, fast-moving, and very human. The energy comes from holding the whole room together while still helping individuals feel seen.",
    },
    {
      id: "mentor-coach",
      slug: "mentor-coach",
      title: "Mentor or Coach",
      summary:
        "This version is more personal and relationship-driven. Instead of guiding a whole room, you are helping one person or a small group improve through feedback, encouragement, strategy, and trust.",
      whatYouActuallyDo: [
        "Work closely with individuals to understand what is blocking their progress and what kind of support they actually need.",
        "Give specific feedback that helps someone improve without shutting down.",
        "Build confidence over time by helping a person notice real progress, not just mistakes.",
        "Adjust how you guide based on motivation, personality, and what kind of challenge the person is facing.",
      ],
      skillsThatGrowHere: [
        "One-on-one guidance",
        "Feedback that motivates",
        "Trust-building",
        "Reading individual needs",
      ],
      starterProjects: [
        "Tutor someone regularly in a subject, skill, or sport and track what helps them improve.",
        "Volunteer as a peer mentor, youth mentor, or assistant coach.",
        "Practice giving feedback that is honest, specific, and still encouraging enough to keep someone moving.",
      ],
      atmosphere:
        "Close, personal, and high-trust. The work feels less like performing in front of a room and more like helping someone grow in a way they can actually feel.",
    },
    {
      id: "education-creator",
      slug: "education-creator",
      title: "Education Creator",
      summary:
        "This version is about teaching at scale through videos, courses, workshops, curriculum, and other learning experiences. You are still helping people understand — but through systems and content that reach far beyond one room.",
      whatYouActuallyDo: [
        "Turn complex ideas into lessons, videos, guides, or experiences that feel clear and engaging.",
        "Design learning flows so someone can move step by step without needing you physically in the room.",
        "Think carefully about pacing, examples, visuals, and structure so understanding can happen asynchronously.",
        "Revise content based on what confuses people, what keeps attention, and what actually helps ideas land.",
      ],
      skillsThatGrowHere: [
        "Curriculum design",
        "Instructional clarity",
        "Teaching through media",
        "Learning experience design",
      ],
      starterProjects: [
        "Create a short mini-course, tutorial series, or learning guide about something you know well.",
        "Study creators and educators who explain difficult ideas simply and notice how they structure attention.",
        "Build one lesson in Notion, Slides, or video form and test it on real people to see what still confuses them.",
      ],
      atmosphere:
        "Creative, strategic, and design-heavy. The challenge is making teaching work even when you are not physically there to rescue the learner in real time.",
    },
  ],

  dayInLife: {
    title: "A day in the life",
    summary:
      "Teaching is not just explaining. It is reading people, adjusting in real time, and helping something finally click.",

    moments: [
      {
        id: "morning-prep",
        timeLabel: "7:45 AM",
        title: "Prepare for real people, not just content",
        body:
          "You review the plan, but you are really thinking about the students. Who struggled yesterday? Who is disengaged? Preparation is not just material — it is strategy.",
      },
      {
        id: "first-class",
        timeLabel: "9:00 AM",
        title: "Try to make it land",
        body:
          "You explain something that should make sense. It doesn’t fully land. You adjust, rephrase, try again. Then you see it — someone gets it. That moment is the signal.",
      },
      {
        id: "midday-pressure",
        timeLabel: "11:30 AM",
        title: "Keep the room with you",
        body:
          "Attention shifts. Energy drops. Some students are lost, others are ahead. You are constantly balancing pace, clarity, and engagement in real time.",
      },
      {
        id: "lunch",
        timeLabel: "12:45 PM",
        title: "The moments that actually matter",
        body:
          "A student stays after. A quick conversation turns into something real. This is where trust builds. Teaching is not just content — it is connection.",
      },
      {
        id: "afternoon-support",
        timeLabel: "2:15 PM",
        title: "Help someone move forward",
        body:
          "One-on-one is different. You slow down, meet them where they are, and find a way through. This is where progress becomes visible.",
      },
      {
        id: "end-of-day",
        timeLabel: "4:00 PM",
        title: "See what actually worked",
        body:
          "You review work, give feedback, and notice patterns. Who improved? Who is still stuck? Teaching gets better through small adjustments every day.",
      },
      {
        id: "after-hours",
        timeLabel: "Evening",
        title: "The impact shows later",
        body:
          "The real payoff is delayed. It shows up when someone remembers, improves, or starts believing they can understand something. That is the work.",
      },
    ],
  },

  forecast: {
    title: "What growth can look like",
    summary:
      "You gain traction when you consistently help real people learn.",
    stages: [],
  },

  /* =========================
     FORECAST PASS (NEW)
  ========================= */

  forecastV2: {
    outlookLabel: "Stable - but demanding",
    outlookSummary:
      "Teaching is one of the most meaningful and stable careers, but it is also one of the most demanding. The need for strong teachers is constant, yet the day-to-day work requires energy, patience, and resilience. This path rewards people who care deeply about impact, not just convenience.",

    metrics: [
      {
        id: "demand",
        label: "Demand",
        value: "Consistent",
        tone: "positive",
        note: "Schools and programs always need strong educators",
      },
      {
        id: "stability",
        label: "Stability",
        value: "High",
        tone: "positive",
        note: "Reliable long-term career path",
      },
      {
        id: "burnout",
        label: "Burnout risk",
        value: "Real",
        tone: "mixed",
        note: "Emotional and workload pressure can be high",
      },
      {
        id: "impact",
        label: "Impact",
        value: "Very high",
        tone: "positive",
        note: "Direct influence on people's growth and confidence",
      },
    ],

    salaryRange: {
      low: "$45K",
      median: "$62K",
      high: "$95K+",
    },

    industry: {
      sourceLabel: "Bureau of Labor Statistics",
      sourceUrl:
        "https://www.bls.gov/ooh/education-training-and-library/high-school-teachers.htm",
      growthPercent: "1%",
      annualOpenings: "67,100",
      medianPay: "$62,360",
      educationTypical: "Bachelor's degree + credential",
    },

    whatIsGrowing: [
      "Teachers who can adapt to different learning styles",
      "Mentorship and one-on-one support roles",
      "Hybrid and alternative education models",
    ],

    whatIsUnderPressure: [
      "Rigid systems that limit flexibility",
      "High workloads and administrative demands",
      "People entering without strong support systems",
    ],

    aiImpact: {
      level: "low",
      summary:
        "AI can assist with planning and content, but it cannot replace real human teaching, connection, or understanding.",
      helpsWith: [
        "Lesson planning support",
        "Content generation",
        "Administrative tasks",
      ],
      putsPressureOn: ["Basic content delivery"],
      humansStillOwn: [
        "Connection with students",
        "Reading the room and adapting",
        "Helping someone actually understand",
      ],
    },

    whyThisCouldFeelExciting: [
      "You directly impact people's lives and confidence",
      "You see real growth in others over time",
      "You can shape how someone experiences learning",
    ],

    whyThisCouldFeelRisky: [
      "The work can be emotionally demanding",
      "Progress is not always immediate or visible",
      "You need strong boundaries and energy management",
    ],
  },

  nextSteps: {
    title: "Real next steps",
    summary:
      "Start teaching someone - that is where this path begins.",
    actions: [],
    opportunityGroups: [],
  },

  nextStepsV2: {
    heroTitle: "You can teach something this week",
    heroSummary:
      "You do not need a classroom. Teaching starts the moment you help someone understand something better.",
    heroBadge: "Help someone learn",

    sections: [
      {
        id: "local",
        eyebrow: "Near 94901",
        title: "Where teaching becomes real",
        description:
          "Teaching becomes real when you are working with actual people.",
        mode: "local",
        items: [
          {
            id: "tutor",
            title: "Help someone study (friend / younger student)",
            href: "#",
            note:
              "The fastest way to test this path - real learning, real feedback.",
            badge: "Start now",
            mode: "local",
          },
          {
            id: "library",
            title: "Marin County Library tutoring / programs",
            href: "https://marinlibrary.org/",
            note:
              "Libraries often support learning programs and tutoring opportunities.",
            badge: "Local",
            mode: "local",
          },
          {
            id: "ymca",
            title: "YMCA youth programs",
            href: "https://www.ymcasf.org/",
            note:
              "Work with younger students in structured environments.",
            badge: "Programs",
            mode: "local",
          },
        ],
      },

      {
        id: "remote",
        eyebrow: "Online",
        title: "Start teaching from anywhere",
        description:
          "These help you understand and practice teaching quickly.",
        mode: "remote",
        items: [
          {
            id: "khan",
            title: "Khan Academy",
            href: "https://www.khanacademy.org",
            note: "Study how great explanations actually work.",
            badge: "Free",
            mode: "remote",
          },
          {
            id: "youtube",
            title: "Educational YouTube",
            href: "https://www.youtube.com",
            note:
              "Break down how strong educators explain ideas clearly.",
            badge: "Free",
            mode: "remote",
          },
          {
            id: "notion",
            title: "Build a mini course (Notion)",
            href: "https://www.notion.so",
            note:
              "Turn something you know into a structured lesson.",
            badge: "Build",
            mode: "remote",
          },
        ],
      },
    ],
  },
};