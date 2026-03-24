// apps/web/src/app/(app)/main/explore/work/_data/mock/physicalTherapistPath.ts

import type { WorkPathContent } from "../workPathSchema";

export const PHYSICAL_THERAPIST_PATH: WorkPathContent = {
  id: "physical-therapist",
  slug: "physical-therapist",
  lane: "work",

  theme: {
    tone: "health-human",
    accent: { r: 94, g: 214, b: 160 },
    accentStrong: { r: 64, g: 180, b: 255 },
    glow: { r: 150, g: 240, b: 200 },
    surfaceLabel: "Human health",
  },

  card: {
    title: "Physical Therapist",
    hook: "Help people recover movement, strength, and confidence.",
    description:
      "A path for people who enjoy helping others heal, improve mobility, and regain physical strength.",
  },

  hero: {
    eyebrow: "Work Path",
    title: "Physical Therapist",
    hook:
      "You care about helping people move better and feel stronger in their bodies.",
    summary:
      "Physical therapists guide people through recovery - rebuilding strength, movement, and confidence after injury or physical challenges.",
    whyItPullsYouIn: [
      "You like helping people improve physically and mentally.",
      "You are curious how the body actually works.",
      "You want work where progress is visible and meaningful.",
    ],
  },

  traitChips: [
    { id: "empathy", label: "Empathy" },
    { id: "science-interest", label: "Science interest" },
    { id: "people-support", label: "People support" },
    { id: "patience", label: "Patience" },
  ],

  fitSignals: [
    {
      id: "helping-instinct",
      label: "Helping instinct",
      score: 90,
      explanation: "You get energy from helping people improve physically.",
    },
    {
      id: "human-biology",
      label: "Human biology interest",
      score: 88,
      explanation: "Understanding muscles, joints, and movement matters here.",
    },
    {
      id: "patience-and-guidance",
      label: "Patience + guidance",
      score: 87,
      explanation: "Recovery takes time - you help people stay consistent.",
    },
  ],

  snapshotStats: [
    {
      id: "focus-mode",
      label: "Best mode",
      value: "Hands-on guidance",
      note: "Direct work with people",
    },
    {
      id: "daily-shape",
      label: "Work rhythm",
      value: "Sessions + progress",
      note: "Assess to guide to adjust",
    },
    {
      id: "output",
      label: "Typical output",
      value: "Recovery progress",
      note: "Strength, mobility, confidence",
    },
  ],

  specialtyPreviews: [
    {
      id: "sports-therapy",
      slug: "sports-therapy",
      title: "Sports Physical Therapy",
      oneLiner: "Helps athletes recover and return to performance.",
      whyItCouldFit:
        "Strong if you are drawn to sports and performance.",
      energy: "active",
    },
    {
      id: "rehabilitation-therapy",
      slug: "rehabilitation-therapy",
      title: "Rehabilitation Therapy",
      oneLiner: "Helps patients recover from surgery, illness, or injury.",
      whyItCouldFit: "Strong if you care about long-term recovery.",
      energy: "human",
    },
  ],

  specialties: [
    {
      id: "sports-therapy",
      slug: "sports-therapy",
      title: "Sports Physical Therapy",
      summary:
        "This specialty is about getting athletes and active people back to movement, training, and performance after injury. You are working where recovery meets competition, confidence, and physical goals.",
      whatYouActuallyDo: [
        "Assess how someone moves, where they are compensating, and what is slowing recovery down.",
        "Guide rehab exercises that rebuild strength, mobility, balance, and confidence step by step.",
        "Help athletes return to practice or competition safely instead of just rushing them back too early.",
        "Work with coaches, trainers, and families so recovery fits the real demands of sport.",
      ],
      skillsThatGrowHere: [
        "Movement analysis",
        "Exercise progression",
        "Coaching under pressure",
        "Clear communication with driven people",
      ],
      starterProjects: [
        "Volunteer around sports teams, athletic training rooms, or adaptive athletics programs.",
        "Learn the basics of kinesiology, recovery, and common sports injuries.",
        "Observe how movement quality changes before and after fatigue, pain, or rehab work.",
      ],
      atmosphere:
        "Fast-moving, active, and goal-driven. The energy is often high because people want to get back to the version of themselves they know.",
    },
    {
      id: "rehabilitation-therapy",
      slug: "rehabilitation-therapy",
      title: "Rehabilitation Therapy",
      summary:
        "This specialty is about longer recovery arcs - after surgery, illness, injury, or life-changing physical setbacks. The work is slower, steadier, and often deeply human.",
      whatYouActuallyDo: [
        "Help patients rebuild movement after major injuries, surgeries, or health events.",
        "Break long-term recovery into smaller, manageable wins that people can actually stick with.",
        "Adapt exercises to the patient in front of you, not just the textbook version of recovery.",
        "Support people emotionally as well as physically when progress feels slow or frustrating.",
      ],
      skillsThatGrowHere: [
        "Patience under uncertainty",
        "Clinical observation",
        "Relationship-building",
        "Long-term progress planning",
      ],
      starterProjects: [
        "Volunteer in hospital, rehab, or community recovery environments.",
        "Learn anatomy and basic movement science so you can understand what recovery is asking of the body.",
        "Spend time noticing how people respond differently to pain, frustration, encouragement, and progress.",
      ],
      atmosphere:
        "Grounded, personal, and emotionally meaningful. You are often helping someone get everyday life back, not just performance.",
    },
  ],

  dayInLife: {
    title: "A day helping people move again",
    summary:
      "This work is hands-on, human, and visible. You are helping someone rebuild strength, movement, and confidence step by step.",

    moments: [
      {
        id: "morning-start",
        timeLabel: "9:00 AM",
        title: "Meet someone where they are",
        body:
          "Every session starts differently. Some people are improving, others are frustrated or in pain. You assess movement, but you are also reading mindset.",
      },
      {
        id: "first-session",
        timeLabel: "10:00 AM",
        title: "Guide the first movement",
        body:
          "You walk someone through exercises that feel small but matter. Even basic movement can be difficult. Your job is to guide, correct, and encourage.",
      },
      {
        id: "midday-progress",
        timeLabel: "11:45 AM",
        title: "Notice real progress",
        body:
          "A movement becomes smoother. Strength improves slightly. Sometimes it is subtle, but it is real. These moments build momentum.",
      },
      {
        id: "midday-challenge",
        timeLabel: "1:15 PM",
        title: "Push without breaking trust",
        body:
          "Recovery is uncomfortable. You need to push someone enough to improve, but not so much that they shut down. This balance is a core skill.",
      },
      {
        id: "afternoon-variety",
        timeLabel: "2:30 PM",
        title: "Every person is different",
        body:
          "No two patients are the same. Different injuries, different goals, different attitudes. You are constantly adapting your approach.",
      },
      {
        id: "visible-result",
        timeLabel: "4:00 PM",
        title: "See what changed",
        body:
          "At the end of a session, you can often see it. Better range, more confidence, less hesitation. Progress is physical and visible.",
      },
      {
        id: "long-term",
        timeLabel: "Ongoing",
        title: "Watch someone get their life back",
        body:
          "The real payoff happens over time. Someone who struggled to move starts walking, training, or living normally again. That is the impact of the work.",
      },
    ],
  },

  forecast: {
    title: "What growth can look like",
    summary: "This is a stable, in-demand healthcare path.",
    stages: [],
  },

  /* =========================
     FORECAST PASS (FINAL)
  ========================= */

  forecastV2: {
    outlookLabel: "Stable and growing - but highly committed",
    outlookSummary:
      "Physical therapy is a stable, in-demand healthcare path with strong long-term need. But entry requires significant education and commitment. The work is consistent and meaningful, but it is not casual - it demands patience, physical presence, and long-term investment.",

    metrics: [
      {
        id: "demand",
        label: "Demand",
        value: "High",
        tone: "positive",
        note: "Aging population and injury recovery drive steady need",
      },
      {
        id: "stability",
        label: "Stability",
        value: "Very high",
        tone: "positive",
        note: "Healthcare roles remain consistently needed",
      },
      {
        id: "education",
        label: "Education path",
        value: "Long",
        tone: "mixed",
        note: "Doctorate typically required",
      },
      {
        id: "physical",
        label: "Physical demands",
        value: "Real",
        tone: "mixed",
        note: "Hands-on work requires energy and presence",
      },
    ],

    salaryRange: {
      low: "$65K",
      median: "$97K",
      high: "$120K+",
    },

    industry: {
      sourceLabel: "Bureau of Labor Statistics",
      sourceUrl: "https://www.bls.gov/ooh/healthcare/physical-therapists.htm",
      growthPercent: "15%",
      annualOpenings: "24,200",
      medianPay: "$97,720",
      educationTypical: "Doctoral degree",
    },

    whatIsGrowing: [
      "Demand from aging populations",
      "Sports and performance recovery",
      "Preventative and long-term mobility care",
    ],

    whatIsUnderPressure: [
      "High education requirements and time investment",
      "Workload in high-demand clinical environments",
      "People entering without understanding the commitment",
    ],

    aiImpact: {
      level: "low",
      summary:
        "AI can assist with data, tracking, and planning, but it cannot replace hands-on therapy, physical guidance, or human interaction.",
      helpsWith: [
        "Tracking progress",
        "Program planning support",
        "Data and recovery insights",
      ],
      putsPressureOn: ["Basic program templating"],
      humansStillOwn: [
        "Hands-on physical guidance",
        "Reading patient movement and response",
        "Building trust and motivation",
      ],
    },

    whyThisCouldFeelExciting: [
      "You directly help people regain strength and independence",
      "Progress is visible and meaningful",
      "Strong long-term career stability",
    ],

    whyThisCouldFeelRisky: [
      "Requires long education and commitment",
      "Work can be physically and emotionally demanding",
      "Less flexibility early in the career path",
    ],
  },

  nextSteps: {
    title: "Real next steps",
    summary: "Start by getting close to real recovery and movement environments.",
    actions: [],
    opportunityGroups: [],
  },

  nextStepsV2: {
    heroTitle: "You can step into real recovery environments now",
    heroSummary:
      "This path becomes real when you are around people improving, recovering, and moving. Get close to that world.",
    heroBadge: "See it in action",

    sections: [
      {
        id: "local",
        eyebrow: "Near 94901",
        title: "Get close to real recovery work",
        description:
          "These are real Bay Area environments where movement, rehab, and patient care are happening.",
        mode: "local",
        items: [
          {
            id: "marinhealth",
            title: "MarinHealth Volunteer Program",
            href: "https://www.mymarinhealth.org/about-us/volunteer-services/volunteer-positions-programs/",
            note:
              "Direct hospital exposure. See real patients, real recovery, real care.",
            badge: "Hospital",
            mode: "local",
          },
          {
            id: "kaiser",
            title: "Kaiser San Rafael Volunteer Services",
            href: "https://healthy.kaiserpermanente.org/northern-california/facilities/San-Rafael-Medical-Center-100327/departments/volunteer-services-dlp-106380",
            note:
              "Another strong local entry into real clinical environments.",
            badge: "Local",
            mode: "local",
          },
          {
            id: "keen",
            title: "KEEN Adaptive Sports Volunteer",
            href: "https://www.keensanfrancisco.org/",
            note:
              "Work directly with people improving movement and confidence.",
            badge: "Hands-on",
            mode: "local",
          },
          {
            id: "borp",
            title: "BORP Adaptive Sports",
            href: "https://moveunitedsport.org/organization/bay-area-outreach-and-recreation-program/",
            note:
              "See how movement, disability, and recovery intersect in real life.",
            badge: "Bay Area",
            mode: "local",
          },
        ],
      },

      {
        id: "remote",
        eyebrow: "Online",
        title: "Understand how the body actually works",
        description:
          "These help you build the foundation behind what you will see in real environments.",
        mode: "remote",
        items: [
          {
            id: "khan",
            title: "Khan Academy: Health & Medicine",
            href: "https://www.khanacademy.org/science/health-and-medicine",
            note:
              "Clear, structured understanding of anatomy and physiology.",
            badge: "Free",
            mode: "remote",
          },
          {
            id: "ace",
            title: "ACE Fitness",
            href: "https://www.acefitness.org/",
            note:
              "Understand movement, exercise, and safe physical training.",
            badge: "Movement",
            mode: "remote",
          },
          {
            id: "coursera",
            title: "Coursera Health Courses",
            href: "https://www.coursera.org/browse/health",
            note: "More structured, deeper learning if you want it.",
            badge: "Courses",
            mode: "remote",
          },
        ],
      },
    ],
  },
};