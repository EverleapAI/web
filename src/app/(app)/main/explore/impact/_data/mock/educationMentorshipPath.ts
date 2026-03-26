// apps/web/src/app/(app)/main/explore/impact/_data/mock/educationMentorshipPath.ts

import type { ImpactPathContent } from "../impactPathSchema";

export const EDUCATION_MENTORSHIP_PATH: ImpactPathContent = {
  id: "education-mentorship",
  slug: "education-mentorship",
  lane: "impact",

  theme: {
    tone: "guiding-light",
    accent: { r: 108, g: 196, b: 164 },
    accentStrong: { r: 72, g: 168, b: 140 },
    glow: { r: 72, g: 168, b: 140 },
    surfaceLabel: "Guiding others",
  },

  card: {
    title: "Education & Mentorship",
    hook:
      "You see someone struggling — and instead of moving on, you slow down and help them figure it out.",
    description:
      "Mentorship is not about being the smartest person in the room. It is about noticing where someone is stuck, meeting them there, and helping them move forward. That can be explaining a concept, encouraging someone who feels lost, or helping someone believe they can actually improve.",
  },

  hero: {
    eyebrow: "Impact Path",
    title: "Education & Mentorship",
    hook:
      "Helping someone go from ‘I don’t get it’ to ‘wait… I think I do.’",
    summary:
      "Some people move quickly through learning and leave others behind. Others slow down, explain things, and help people build confidence along the way. Mentorship happens in small moments — a conversation, a study session, a bit of encouragement — that quietly change how someone sees themselves and what they think they can do.",
    whyItPullsYouIn: [
      "You like helping people understand things they find confusing.",
      "You notice when someone is struggling and want to support them.",
      "You feel good when someone gains confidence because of your help.",
    ],
  },

  traitChips: [
    { id: "teacher-energy", label: "Explains clearly" },
    { id: "patient", label: "Patient presence" },
    { id: "encouraging", label: "Builds confidence" },
    { id: "observant", label: "Notices struggles" },
  ],

  fitSignals: [
    {
      id: "explains-well",
      label: "You naturally explain things",
      score: 4,
      explanation:
        "People often come to you when they do not understand something because you can break it down clearly.",
    },
    {
      id: "patient-listener",
      label: "You meet people where they are",
      score: 4,
      explanation:
        "You take time to understand what someone is struggling with before jumping in.",
    },
    {
      id: "confidence-builder",
      label: "You build confidence in others",
      score: 5,
      explanation:
        "You notice that encouragement and small wins can change how someone feels about learning.",
    },
    {
      id: "progress-awareness",
      label: "You notice progress over time",
      score: 4,
      explanation:
        "You enjoy seeing someone improve, even if it happens slowly.",
    },
  ],

  branchPreviews: [
    {
      id: "peer-tutoring",
      slug: "peer-tutoring",
      title: "Peer Tutoring",
      oneLiner:
        "Helping someone finally understand something that has been frustrating them.",
      whyItCouldFit:
        "Learning often clicks faster when someone explains it in a relatable way.",
      energy: "people",
    },
    {
      id: "youth-mentorship",
      slug: "youth-mentorship",
      title: "Youth Mentorship",
      oneLiner:
        "Being someone a younger student can look up to and learn from.",
      whyItCouldFit:
        "Guidance and encouragement can change how someone sees their own future.",
      energy: "grounded",
    },
    {
      id: "learning-support",
      slug: "learning-support",
      title: "Learning Support",
      oneLiner:
        "Helping people stay consistent, motivated, and on track.",
      whyItCouldFit:
        "Sometimes support matters more than explanation.",
      energy: "support",
    },
  ],

  branches: [
    {
      id: "peer-tutoring",
      slug: "peer-tutoring",
      title: "Peer Tutoring",
      summary:
        "Peer tutoring is about helping someone move past confusion in real time.",
      whatYouActuallyDo: [
        "Break down concepts into simple steps",
        "Answer questions and adjust explanations",
        "Help someone practice until it clicks",
      ],
      skillsThatGrowHere: ["Communication", "Clarity", "Adaptability"],
      starterProjects: [
        "Help a friend with one topic",
        "Run a small study session",
        "Create a simple guide",
      ],
      atmosphere:
        "Focused, interactive, and rewarding when something finally clicks.",
    },
    {
      id: "youth-mentorship",
      slug: "youth-mentorship",
      title: "Youth Mentorship",
      summary:
        "Mentorship is often about presence — being someone who listens, supports, and guides.",
      whatYouActuallyDo: [
        "Listen to challenges and questions",
        "Encourage effort and consistency",
        "Share experiences and perspective",
      ],
      skillsThatGrowHere: ["Empathy", "Leadership", "Patience"],
      starterProjects: [
        "Mentor a younger student",
        "Help lead a group activity",
        "Support an after-school program",
      ],
      atmosphere:
        "Supportive, personal, and built on trust.",
    },
    {
      id: "learning-support",
      slug: "learning-support",
      title: "Learning Support",
      summary:
        "Sometimes the biggest impact is helping someone stay consistent and not give up.",
      whatYouActuallyDo: [
        "Check in regularly",
        "Help organize study habits",
        "Encourage follow-through",
      ],
      skillsThatGrowHere: ["Consistency", "Motivation", "Accountability"],
      starterProjects: [
        "Be a study partner",
        "Help someone stay on track",
        "Create a shared routine",
      ],
      atmosphere:
        "Steady, encouraging, and relationship-driven.",
    },
  ],

  tryNow: {
    title: "Try This",
    summary:
      "Mentorship becomes real the moment you help one person move forward.",
    actions: [
      {
        id: "help-someone-learn",
        title: "Help One Person Understand Something",
        type: "conversation",
        effort: "light",
        timeEstimate: "30–60 minutes",
        whyThisMatters:
          "Even one moment of clarity can change how someone feels about learning.",
        instructions: [
          "Find someone stuck on something.",
          "Ask what they do not understand.",
          "Explain it simply.",
          "Stay with them until it clicks.",
        ],
      },
    ],
  },

  howItFeels: {
    title: "How It Often Feels",
    summary:
      "Mentorship is quiet, personal, and powerful in small moments.",
    moments: [
      {
        id: "aha-moment",
        title: "The Click",
        body:
          "Someone suddenly understands something that felt impossible a few minutes earlier.",
      },
      {
        id: "confidence-growth",
        title: "Confidence Builds",
        body:
          "Over time, they start believing they can figure things out.",
      },
      {
        id: "they-dont-need-you",
        title: "They Don’t Need You Anymore",
        body:
          "The best moment is when they can do it without you.",
      },
    ],
  },

  growthPath: {
    title: "How This Path Grows",
    summary:
      "Mentorship grows from helping individuals to guiding larger groups.",
    stages: [
      {
        id: "helping-friends",
        label: "Helping Friends",
        timeframe: "Weeks–Months",
        summary: "You start by helping people close to you.",
        signalsOfProgress: [
          "People ask you for help",
          "Your explanations improve",
        ],
      },
      {
        id: "structured-mentorship",
        label: "Structured Mentorship",
        timeframe: "Months–Years",
        summary:
          "You begin mentoring more formally.",
        signalsOfProgress: [
          "You guide longer learning journeys",
          "You design learning experiences",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Try this for real",
    summary:
      "The best way to understand mentorship is to actually help someone — or join a program where people are already doing it.",
    actions: [],
    opportunityGroups: [
      {
        id: "local",
        title: "Near you",
        description:
          "Ways to support learning and mentorship in your local community.",
        items: [
          {
            id: "schoolhouse-local-tutoring",
            title: "Schoolhouse.world – Free Peer Tutoring",
            mode: "local",
            provider: "Schoolhouse.world",
            summary:
              "Join live tutoring sessions and volunteer-led academic support that connects students who need help with students who can explain clearly.",
            whyItHelps:
              "You get real tutoring experience with actual learners instead of keeping mentorship hypothetical.",
            href: "https://schoolhouse.world",
            formatLabel: "Live Tutoring",
          },
          {
            id: "boys-girls-club",
            title: "Boys & Girls Club Mentorship",
            mode: "local",
            provider: "Boys & Girls Club",
            summary:
              "Support younger students in structured youth programs focused on growth, confidence, and belonging.",
            whyItHelps:
              "You build real mentorship relationships in a setting designed around young people.",
            href: "https://www.bgca.org",
            formatLabel: "Local",
          },
          {
            id: "ymca-mentorship",
            title: "YMCA Youth Programs",
            mode: "local",
            provider: "YMCA",
            summary:
              "Participate in youth mentoring, learning support, and development programs through local YMCA branches.",
            whyItHelps:
              "You guide others in a structured environment where consistency matters.",
            href: "https://www.ymca.org",
            formatLabel: "Local",
          },
          {
            id: "library-programs",
            title: "Library Learning Programs",
            mode: "local",
            provider: "Institute of Museum and Library Services",
            summary:
              "Explore reading programs, homework help, and community learning initiatives connected to local libraries.",
            whyItHelps:
              "You support learning in a calm, community-based setting where people already come looking for help.",
            href: "https://www.imls.gov",
            formatLabel: "Local",
          },
          {
            id: "after-school",
            title: "After-School Programs",
            mode: "local",
            provider: "Afterschool Alliance",
            summary:
              "Find programs centered on homework help, enrichment, and youth support outside the school day.",
            whyItHelps:
              "You gain hands-on mentorship experience with younger learners who benefit from steady encouragement.",
            href: "https://www.afterschoolalliance.org",
            formatLabel: "Local",
          },
        ],
      },
      {
        id: "online",
        title: "Online",
        description:
          "Ways to mentor, teach, or support learning digitally.",
        items: [
          {
            id: "khan-academy",
            title: "Khan Academy",
            mode: "virtual",
            provider: "Khan Academy",
            summary:
              "Use clear instructional resources to strengthen your own explanations and support someone else’s learning.",
            whyItHelps:
              "You get better at breaking down concepts in ways that actually make sense.",
            href: "https://www.khanacademy.org",
            formatLabel: "Online",
          },
          {
            id: "schoolhouse",
            title: "Schoolhouse.world",
            mode: "virtual",
            provider: "Schoolhouse.world",
            summary:
              "Volunteer tutoring platform where students help other students through live online sessions.",
            whyItHelps:
              "You teach real learners in real sessions, which makes mentorship feel concrete fast.",
            href: "https://schoolhouse.world",
            formatLabel: "Online",
          },
          {
            id: "coursera",
            title: "Coursera",
            mode: "virtual",
            provider: "Coursera",
            summary:
              "Explore courses on learning, teaching, communication, and educational psychology.",
            whyItHelps:
              "You understand education more deeply instead of relying only on instinct.",
            href: "https://www.coursera.org",
            formatLabel: "Online",
          },
          {
            id: "online-study-groups",
            title: "Online Study Groups",
            mode: "virtual",
            provider: "Discord Communities",
            summary:
              "Join or lead collaborative study communities where explanation, encouragement, and consistency all matter.",
            whyItHelps:
              "You practice guiding others and holding a group together around learning goals.",
            href: "https://discord.com",
            formatLabel: "Online",
          },
          {
            id: "un-volunteer",
            title: "UN Online Volunteering",
            mode: "virtual",
            provider: "United Nations",
            summary:
              "Support global education and youth-development initiatives through remote volunteer opportunities.",
            whyItHelps:
              "You contribute to real-world learning efforts beyond your immediate environment.",
            href: "https://www.onlinevolunteering.org",
            formatLabel: "Online",
          },
        ],
      },
    ],
  },
};