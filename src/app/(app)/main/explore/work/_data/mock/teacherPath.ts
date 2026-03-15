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
      "A path for people who enjoy explaining ideas, guiding others, and helping someone go from confusion to clarity. Teaching blends communication, empathy, structure, and curiosity into work that shapes how other people grow.",
  },

  hero: {
    eyebrow: "Work Path",
    title: "Teacher",
    hook:
      "You notice when someone almost understands something — and you feel the urge to help them get the rest of the way there.",
    summary:
      "Teaching is the craft of helping people learn, grow, and see the world differently. It can happen in classrooms, training programs, workshops, mentoring environments, or digital platforms. At its best, it is not just about delivering information — it is about helping understanding actually take hold.",
    whyItPullsYouIn: [
      "You enjoy explaining ideas and seeing the moment when something suddenly makes sense.",
      "You naturally notice when someone is stuck, confused, or almost there.",
      "You like the idea that your work could help someone grow over time.",
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
        "A strong signal for this path is noticing that you often want to help someone understand something rather than just leaving them stuck.",
    },
    {
      id: "people-focus",
      label: "People focus",
      score: 88,
      explanation:
        "Teaching fits people who are energized by helping others grow instead of working only with abstract systems.",
    },
    {
      id: "clarity-building",
      label: "Clarity building",
      score: 86,
      explanation:
        "A teacher's job is turning complex ideas into steps someone else can follow and actually learn from.",
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
      value: "Preparation + teaching",
      note: "Planning lessons, guiding discussion, feedback",
    },
    {
      id: "output",
      label: "Typical output",
      value: "Lessons, growth, understanding",
      note: "Students gaining new abilities and confidence",
    },
  ],

  specialtyPreviews: [
    {
      id: "classroom-teacher",
      slug: "classroom-teacher",
      title: "Classroom Teacher",
      oneLiner:
        "Guides students through subjects like science, history, language, or math in a structured learning environment.",
      whyItCouldFit:
        "Great for someone who enjoys helping groups of students grow and building strong learning environments.",
      energy: "craft",
    },
    {
      id: "mentor-coach",
      slug: "mentor-coach",
      title: "Mentor or Coach",
      oneLiner:
        "Helps individuals develop skills through guidance, feedback, and encouragement.",
      whyItCouldFit:
        "Great for someone who enjoys one-on-one growth and seeing people build confidence.",
      energy: "high-creative",
    },
    {
      id: "education-creator",
      slug: "education-creator",
      title: "Education Creator",
      oneLiner:
        "Builds courses, videos, lessons, or learning tools that help large groups learn online.",
      whyItCouldFit:
        "Great for someone who likes teaching but also enjoys building learning materials and content.",
      energy: "systems",
    },
  ],

  specialties: [
    {
      id: "classroom-teacher",
      slug: "classroom-teacher",
      title: "Classroom Teacher",
      summary:
        "Classroom teachers guide groups of students through structured learning over weeks, months, or years.",
      whatYouActuallyDo: [
        "Design lessons and learning activities.",
        "Explain complex ideas clearly.",
        "Support students when they struggle or feel stuck.",
      ],
      skillsThatGrowHere: [
        "Public speaking",
        "Lesson design",
        "Patience",
        "Group leadership",
      ],
      starterProjects: [
        "Help tutor a younger student in a subject you understand well.",
        "Create a short lesson explaining something you love.",
        "Run a small workshop or study group.",
      ],
      atmosphere:
        "Dynamic, people-focused, and rewarding when students start connecting ideas.",
    },
    {
      id: "mentor-coach",
      slug: "mentor-coach",
      title: "Mentor or Coach",
      summary:
        "Mentors and coaches help individuals grow skills, confidence, and performance through guidance and encouragement.",
      whatYouActuallyDo: [
        "Observe where someone is struggling.",
        "Give feedback that helps them improve.",
        "Build trust and motivation.",
      ],
      skillsThatGrowHere: [
        "Empathy",
        "Observation",
        "Encouragement",
        "Personal guidance",
      ],
      starterProjects: [
        "Help coach a younger sports team or activity.",
        "Mentor someone learning a skill you already know.",
        "Run peer study sessions.",
      ],
      atmosphere:
        "Highly personal and rewarding when someone gains confidence through your support.",
    },
    {
      id: "education-creator",
      slug: "education-creator",
      title: "Education Creator",
      summary:
        "Education creators build learning content that reaches students through videos, courses, and digital tools.",
      whatYouActuallyDo: [
        "Design learning material and explanations.",
        "Build courses or lesson videos.",
        "Create systems that help people learn independently.",
      ],
      skillsThatGrowHere: [
        "Curriculum design",
        "Communication clarity",
        "Educational storytelling",
        "Learning psychology",
      ],
      starterProjects: [
        "Create a short explainer video on a topic you love.",
        "Build a mini online course or study guide.",
        "Design a simple learning resource others can use.",
      ],
      atmosphere:
        "Creative and scalable — your teaching can reach thousands of people.",
    },
  ],

  dayInLife: {
    title: "A day in the life",
    summary:
      "Teaching mixes preparation, explanation, and human interaction. Each day is about helping ideas click for different people.",
    moments: [
      {
        id: "morning-prep",
        timeLabel: "8:00 AM",
        title: "Prepare the lesson",
        body:
          "You review the plan for the day and think about how to explain ideas in a way students will understand.",
      },
      {
        id: "midday-class",
        timeLabel: "10:30 AM",
        title: "Teach and guide discussion",
        body:
          "You explain concepts, answer questions, and help students move through confusion toward understanding.",
      },
      {
        id: "afternoon-support",
        timeLabel: "1:30 PM",
        title: "Help students individually",
        body:
          "Some students need extra guidance, encouragement, or a different explanation.",
      },
      {
        id: "late-reflection",
        timeLabel: "4:00 PM",
        title: "Reflect and improve",
        body:
          "You adjust lessons, notice what worked, and think about how to help tomorrow's class learn even better.",
      },
    ],
  },

  forecast: {
    title: "What growth can look like",
    summary:
      "Teaching often begins with helping people informally — tutoring, mentoring, or coaching — and grows into more structured roles.",
    stages: [
      {
        id: "stage-1",
        label: "Early signal",
        timeframe: "Now → 2 months",
        summary:
          "You notice you enjoy explaining ideas and helping someone finally understand something.",
        signalsOfProgress: [
          "People ask you for help understanding topics.",
          "You enjoy breaking ideas into clear steps.",
          "You notice when someone is confused and want to help.",
        ],
      },
      {
        id: "stage-2",
        label: "Real traction",
        timeframe: "2 → 6 months",
        summary:
          "You begin helping others more intentionally through tutoring, mentoring, or coaching.",
        signalsOfProgress: [
          "You develop clearer explanations.",
          "You become more comfortable guiding others.",
          "You start building teaching materials.",
        ],
      },
      {
        id: "stage-3",
        label: "Deeper commitment",
        timeframe: "6+ months",
        summary:
          "You begin exploring education as a profession or a central part of your work.",
        signalsOfProgress: [
          "You enjoy seeing long-term growth in others.",
          "You experiment with different teaching styles.",
          "You gain confidence leading groups or individuals.",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Real next steps",
    summary:
      "The best way to explore teaching is to actually help someone learn something.",

    actions: [
      {
        id: "teacher-next-1",
        title: "Explain something you know well",
        type: "tiny-task",
        effort: "light",
        timeEstimate: "20–30 min",
        whyThisMatters:
          "Teaching becomes clearer when you try to explain an idea out loud.",
        instructions: [
          "Pick a concept you understand well.",
          "Explain it to someone younger or new to the topic.",
          "Notice what explanations helped the most.",
        ],
      },
      {
        id: "teacher-next-2",
        title: "Help someone study or practice",
        type: "project",
        effort: "medium",
        timeEstimate: "45–60 min",
        whyThisMatters:
          "Helping someone else succeed is the most direct way to feel whether teaching energizes you.",
        instructions: [
          "Offer to help someone study or learn a skill.",
          "Break the topic into steps.",
          "Pay attention to how their understanding improves.",
        ],
      },
    ],

    opportunityGroups: [
      {
        id: "near-you",
        title: "Near you",
        description:
          "Places around Marin where teaching and mentorship start to feel real.",
        items: [
          {
            id: "school-tutoring",
            title: "Volunteer tutoring",
            mode: "local",
            provider: "Schools or libraries",
            locationLabel: "Marin",
            distanceLabel: "Community learning",
            summary:
              "Helping younger students study can quickly show whether teaching feels natural.",
            whyItHelps:
              "You see learning happen in real time.",
          },
          {
            id: "community-workshops",
            title: "Run a small workshop",
            mode: "local",
            provider: "Community groups",
            locationLabel: "Marin",
            distanceLabel: "Creative teaching",
            summary:
              "Teach a skill, hobby, or topic you know well.",
            whyItHelps:
              "Teaching real people gives fast feedback.",
          },
        ],
      },
      {
        id: "online-now",
        title: "Online",
        description:
          "Places where teaching and learning experiments can begin immediately.",
        items: [
          {
            id: "khan-academy",
            title: "Study how great explanations work",
            mode: "virtual",
            provider: "Khan Academy",
            formatLabel: "Learning platform",
            summary:
              "A great place to observe clear teaching styles.",
            whyItHelps:
              "You learn how explanations can become simple and powerful.",
            href: "https://www.khanacademy.org",
          },
          {
            id: "youtube-education",
            title: "Watch strong educational creators",
            mode: "virtual",
            provider: "YouTube",
            formatLabel: "Educational channels",
            summary:
              "Many channels focus on making complex ideas understandable.",
            whyItHelps:
              "Studying teaching styles improves your own explanations.",
            href: "https://www.youtube.com",
          },
        ],
      },
    ],
  },
};