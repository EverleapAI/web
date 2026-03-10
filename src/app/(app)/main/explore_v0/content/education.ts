// src/app/main/explore/content/education.ts
import type { ExploreArea } from "./types";

/**
 * Explore › Education
 * Tone: life coach talking to an older teen.
 * Audio-ready: short, spoken paragraphs (use \n\n).
 *
 * Updated Structure goal:
 * - 4 curated learning directions (like Careers)
 * - Still includes why/hint/tags for personalized rendering
 * - NOW also includes curated “doors to walk through”:
 *   local (94901-ish) + national + online
 * - Deep dive pages can turn these into tactical “real world things to do”
 *
 * NOTE:
 * Card `id` is the stable topic key used by renderers (Tiny Tests, Actions IDs, feedback IDs).
 * Keep it aligned with the slug (kebab-case), even if `href` changes later.
 */
const education: ExploreArea = {
  id: "education",
  label: "Education",
  chip: "🎓",
  glowClass: "from-emerald-400 via-teal-400 to-cyan-400",
  href: "/main/explore/education",

  headline: "Education",
  summary:
    "This isn’t about perfect grades. It’s about choosing learning experiences that actually fit you — classes, programs, mentors, and real reps.",
  hint: "Pick one direction. Pick one door. Run one tiny test this week.",

  // Lane-level signals (fallback only)
  signals: ["learning", "growth", "self-directed", "real-world"],

  nextMoves: [
    {
      id: "edu-1",
      title: "Pick one direction (not five)",
      blurb:
        "One direction = momentum. Five directions = a tab explosion in your brain.",
    },
    {
      id: "edu-2",
      title: "Choose one “door” you can actually walk through",
      blurb:
        "A real class, program, club, mentor, or volunteer role — something you can point to.",
    },
    {
      id: "edu-3",
      title: "Make proof in 7 days",
      blurb:
        "A tiny artifact beats a big intention. Build, present, publish, or help someone.",
    },
  ],

  cards: [
    {
      // ✅ stable topic key (used by renderer + store)
      id: "learn-to-code",
      // ✅ slug lives in href for routing
      href: "/main/explore/education/learn-to-code",
      icon: "💻",
      title: "Build-to-learn (coding + making)",
      short:
        "If you like puzzles *and* you like control, this is a power-up.\n\n" +
        "Not because “coding is the future.” Because building teaches you to turn ideas into real things — apps, websites, games, tools.\n\n" +
        "Everleap’s recommendation here is simple: pick one place to build and one tiny project to ship.",
      why: [
        "You like fast feedback — you do something, it runs (or breaks), you fix it.",
        "You prefer building over memorizing. Progress feels visible.",
        "Autonomy matters — you can make your own projects, your own rules.",
      ],
      hint: "Make one tiny thing you can show someone by tonight.",
      tags: ["build-to-learn", "fast-feedback", "autonomy", "projects"],
      opportunities: {
        local: [
          {
            name: "The Lab (makerspace + studio)",
            provider: "Marin County Free Library",
            location: "Marin County (multiple branches)",
            note: "Drop-in making: coding, 3D printing, creative tech, mentorship.",
            url: "https://marinlibrary.org/the-lab/",
          },
          {
            name: "Computer Science courses (incl. Intro to Programming Python)",
            provider: "College of Marin",
            location: "Kentfield / Online options",
            note: "Real course sequence you can start without being ‘a CS person.’",
            url: "https://academics.marin.edu/program/comp",
          },
          {
            name: "Community Education short courses",
            provider: "College of Marin",
            location: "Marin campuses",
            note: "Short-term classes (not-for-credit) to try things without pressure.",
            url: "https://marin.edu/communityed",
          },
        ],
        national: [
          {
            name: "iD Tech Camps",
            provider: "iD Tech",
            location: "U.S. campuses (varies)",
            note: "Game dev, coding, AI, creative tech camps (summer-focused).",
            url: "https://www.idtech.com/",
          },
          {
            name: "Girls Who Code Programs",
            provider: "Girls Who Code",
            location: "U.S. (virtual + in-person options)",
            note: "Supportive on-ramp into coding + community.",
            url: "https://girlswhocode.com/",
          },
          {
            name: "FIRST Robotics / FIRST Tech Challenge",
            provider: "FIRST",
            location: "U.S. (local teams everywhere)",
            note: "Build + compete + learn teamwork (great if you like hands-on).",
            url: "https://www.firstinspires.org/",
          },
        ],
        online: [
          {
            name: "CS50x: Introduction to Computer Science",
            provider: "Harvard / edX",
            location: "Online",
            note: "Strong fundamentals + projects (free to audit).",
            url: "https://www.edx.org/learn/computer-science/harvard-university-cs50-s-introduction-to-computer-science",
          },
          {
            name: "Unity Learn Pathways",
            provider: "Unity",
            location: "Online",
            note: "If game dev is your pull, this is clean, structured reps.",
            url: "https://learn.unity.com/",
          },
          {
            name: "freeCodeCamp",
            provider: "freeCodeCamp",
            location: "Online",
            note: "Web dev practice + portfolio projects.",
            url: "https://www.freecodecamp.org/",
          },
        ],
      },
    },

    {
      id: "science-deep-dive",
      href: "/main/explore/education/science-deep-dive",
      icon: "🧪",
      title: "Go one layer deeper (science + how things work)",
      short:
        "This is for the “wait… how does that actually work?” part of your brain.\n\n" +
        "Science is basically learning to ask better questions — and not guessing.\n\n" +
        "Everleap’s recommendation: pick one real-world science door (hands-on if possible) and chase one question until you can teach it simply.",
      why: [
        "You hate vague answers — you want the real mechanism underneath.",
        "You like being right for the right reasons (evidence > vibes).",
        "You enjoy turning confusion into clarity.",
      ],
      hint: "Choose one question and chase it until you can explain it simply.",
      tags: ["curiosity", "evidence", "clarity", "deep-dive"],
      opportunities: {
        local: [
          {
            name: "Youth Crew (high school volunteer program)",
            provider: "The Marine Mammal Center",
            location: "Sausalito (near 94901)",
            note: "Hands-on animal care + ocean health education (application-based).",
            url: "https://www.marinemammalcenter.org/get-involved/volunteer/sausalito/youth-crew",
          },
          {
            name: "The Lab: 3D printing + making",
            provider: "Marin County Free Library",
            location: "Marin County",
            note: "Turn curiosity into prototypes (3D prints, design, experiments).",
            url: "https://marinlibrary.org/3d-printing/",
          },
          {
            name: "Environmental / science-related courses",
            provider: "College of Marin",
            location: "Marin campuses",
            note: "Try a real lab-style class without committing to a major.",
            url: "https://www1.marin.edu/schedule",
          },
        ],
        national: [
          {
            name: "Science Olympiad",
            provider: "Science Olympiad",
            location: "U.S. (school teams)",
            note: "Competitive science events that build real skill fast.",
            url: "https://www.soinc.org/",
          },
          {
            name: "HOSA – Future Health Professionals",
            provider: "HOSA",
            location: "U.S. (school chapters)",
            note: "If medicine/health is your direction, this is a real pathway.",
            url: "https://hosa.org/",
          },
          {
            name: "Citizen Science projects (national scale)",
            provider: "Zooniverse",
            location: "Online + field projects",
            note: "Contribute to real research with beginner-friendly starts.",
            url: "https://www.zooniverse.org/",
          },
        ],
        online: [
          {
            name: "Khan Academy (science + math tracks)",
            provider: "Khan Academy",
            location: "Online",
            note: "Quick skill gaps closed = confidence unlocked.",
            url: "https://www.khanacademy.org/science",
          },
          {
            name: "Crash Course (fast clarity)",
            provider: "Crash Course",
            location: "Online",
            note: "If you want the big picture before you go deep.",
            url: "https://www.youtube.com/@crashcourse",
          },
          {
            name: "Coursera science foundations",
            provider: "Coursera",
            location: "Online",
            note: "Structured courses if you like checklists + deadlines.",
            url: "https://www.coursera.org/browse/physical-science-and-engineering",
          },
        ],
      },
    },

    {
      id: "public-speaking",
      href: "/main/explore/education/public-speaking",
      icon: "🗣️",
      title: "Communication reps (speaking + explaining)",
      short:
        "If you can explain things clearly, people listen.\n\n" +
        "This isn’t about being loud. It’s about being understood.\n\n" +
        "Everleap’s recommendation: choose one place to get reps (class, club, or stage), then record yourself once a week until it feels normal.",
      why: [
        "You care how a message lands, not just what it technically says.",
        "You want influence without being fake — clear communication does that.",
        "You learn by performing and adjusting, not by waiting to feel ready.",
      ],
      hint: "Do one 60-second explanation on video — then improve it once.",
      tags: ["communication", "confidence", "reps", "influence"],
      opportunities: {
        local: [
          {
            name: "Intro to Public Speaking (COMM)",
            provider: "College of Marin",
            location: "Marin campuses / schedule varies",
            note: "A clean, structured way to get coached reps.",
            url: "https://netapps.marin.edu/Apps/Directory/ScheduleSearch.aspx",
          },
          {
            name: "Library events (talks, book groups, workshops)",
            provider: "Marin County Free Library",
            location: "Marin County",
            note: "Low-pressure practice: ask questions, share, host, facilitate.",
            url: "https://marinlibrary.org/",
          },
          {
            name: "Peer tutoring / mentoring (practice explaining)",
            provider: "Marin tutoring & mentoring programs",
            location: "Marin County",
            note: "Explaining = speaking. Helping someone learn builds your voice.",
            url: "https://www.marinvtmi.org/",
          },
        ],
        national: [
          {
            name: "Model United Nations (Model UN)",
            provider: "Model UN community",
            location: "U.S. (school + conferences)",
            note: "If you like debate + ideas + confidence through structure.",
            url: "https://bestdelegate.com/",
          },
          {
            name: "Speech & Debate (NSDA)",
            provider: "National Speech & Debate Association",
            location: "U.S.",
            note: "For people who want a clear skill ladder + community.",
            url: "https://www.speechanddebate.org/",
          },
          {
            name: "Junior Achievement leadership programs",
            provider: "Junior Achievement",
            location: "U.S.",
            note: "Build confidence by doing real projects with real teams.",
            url: "https://jausa.ja.org/",
          },
        ],
        online: [
          {
            name: "TED-Ed Student Talks",
            provider: "TED-Ed",
            location: "Online + school programs",
            note: "A clear format + coaching path for a real talk.",
            url: "https://ed.ted.com/",
          },
          {
            name: "Toastmasters (find a local club; some youth options vary)",
            provider: "Toastmasters International",
            location: "Online + local clubs",
            note: "Structured speaking reps with feedback (check local age policies).",
            url: "https://www.toastmasters.org/find-a-club",
          },
          {
            name: "YouTube practice loop (script → record → revise)",
            provider: "Self-directed",
            location: "Online",
            note: "The simplest speaking gym: 60 seconds weekly, forever.",
          },
        ],
      },
    },

    {
      id: "self-directed-micro-credentials",
      href: "/main/explore/education/self-directed-micro-credentials",
      icon: "🧭",
      title: "Self-directed skill sprints (mini-courses + proof)",
      short:
        "This is for people who want structure — without the trapped feeling.\n\n" +
        "You pick one skill, follow a short plan, and create proof you actually did it.\n\n" +
        "Everleap’s recommendation: choose one short sprint (7–14 days) and define your proof *before* you start.",
      why: [
        "You like a plan, but you want to choose the plan.",
        "You’re motivated by visible progress (checkpoints + proof).",
        "Consistency beats intensity for you — small reps stack up.",
      ],
      hint: "Pick a 7-day sprint and decide your ‘proof’ before you start.",
      tags: ["structure", "consistency", "proof", "self-directed"],
      opportunities: {
        local: [
          {
            name: "Community Education (short-term courses)",
            provider: "College of Marin",
            location: "Marin campuses",
            note: "Try a skill without the full-semester commitment.",
            url: "https://marin.edu/communityed",
          },
          {
            name: "Library skill workshops (maker + creative)",
            provider: "Marin County Free Library",
            location: "Marin County",
            note: "Free, low-pressure: make something, learn a tool, meet mentors.",
            url: "https://marinlibrary.org/",
          },
          {
            name: "Volunteer: health education + support (teen-friendly)",
            provider: "Huckleberry Youth Programs (Teen Health)",
            location: "San Rafael 94901",
            note: "If you’re into health/psych/social impact — real service reps.",
            url: "https://www.huckleberryyouth.org/marin-health-care-health-education/",
          },
        ],
        national: [
          {
            name: "Google Career Certificates",
            provider: "Google / Coursera",
            location: "Online (nationally recognized)",
            note: "Structured credential paths (PM, UX, data, IT, etc.).",
            url: "https://grow.google/certificates/",
          },
          {
            name: "Red Cross (CPR / Lifeguard / First Aid pathways vary by area)",
            provider: "American Red Cross",
            location: "U.S.",
            note: "Practical credentials with real-world utility (check age rules).",
            url: "https://www.redcross.org/take-a-class",
          },
          {
            name: "Junior Achievement finance + entrepreneurship",
            provider: "Junior Achievement",
            location: "U.S.",
            note: "Short programs that feel like real life, not school life.",
            url: "https://jausa.ja.org/",
          },
        ],
        online: [
          {
            name: "Coursera Professional Certificates",
            provider: "Coursera",
            location: "Online",
            note: "A sprint-friendly structure with “proof” baked in.",
            url: "https://www.coursera.org/professional-certificates",
          },
          {
            name: "LinkedIn Learning (skill sprints)",
            provider: "LinkedIn",
            location: "Online",
            note: "Pick one tool (Figma, Excel, Premiere, etc.) and sprint it.",
            url: "https://www.linkedin.com/learning/",
          },
          {
            name: "Notion / portfolio proof page (your output hub)",
            provider: "Self-directed",
            location: "Online",
            note: "Make one page that shows your projects, progress, and proof.",
          },
        ],
      },
    },
  ],
};

export default education;
