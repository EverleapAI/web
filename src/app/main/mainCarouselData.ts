// src/app/main/mainCarouselData.ts

export type MainCardId =
  | "spotlight"
  | "motivations"
  | "strengths"
  | "skills"
  | "superpowers"
  | "friends"
  | "family"
  | "careers"
  | "education";

// These are just tokens; the UI layer will map them to real icon components.
export type IconToken =
  | "spark"
  | "heart"
  | "shield"
  | "tools"
  | "bolt"
  | "people"
  | "home"
  | "compass"
  | "book";

export type SpotlightTaskType = "reflect" | "action" | "explore" | "practice";

export type SpotlightTaskStatus = "pending" | "in_progress" | "done";

export interface SpotlightTask {
  id: string;
  label: string;
  type: SpotlightTaskType;
  status: SpotlightTaskStatus;
}

export interface CardSection {
  heading: string;
  body: string;
}

export interface MainCardBase {
  id: MainCardId;
  title: string;
  icon: IconToken;
  accentColor: string; // hex color; soft, glowing accent
  summary: string; // short personality-driven overview
  sections: CardSection[]; // “Motivations-style” sections
}

export interface SpotlightCard extends MainCardBase {
  id: "spotlight";
  tasks: SpotlightTask[];
  coachingMessage: string;
  // 0–1 for now; the UI can render as % or a ring.
  progress: number;
}

export type InsightCard = MainCardBase & {
  id: Exclude<MainCardId, "spotlight">;
};

export type MainCarouselCard = SpotlightCard | InsightCard;

export const mainCarouselCards: MainCarouselCard[] = [
  {
    id: "spotlight",
    title: "Spotlight",
    icon: "spark",
    accentColor: "#8DBBFF",
    summary:
      "Here’s where to put your energy this session. These are the moves that matter most right now.",
    sections: [
      {
        heading: "Today’s Focus",
        body: "We’ve picked a small set of actions that match who you are and where you want to go. You don’t need to do everything—just move one step forward.",
      },
      {
        heading: "Why This Matters",
        body: "Each item here ties back to your motivations, strengths, and the futures you’re curious about. The goal isn’t perfection; it’s momentum.",
      },
      {
        heading: "How To Use Spotlight",
        body: "Start at the top of your list and pick the thing that feels most doable. After you complete it, check it off and see how the Spotlight shifts over time.",
      },
    ],
    tasks: [
      {
        id: "spotlight-1",
        label: "Do a 3-minute check-in on how your week actually feels, not just how it looks.",
        type: "reflect",
        status: "pending",
      },
      {
        id: "spotlight-2",
        label: "Capture one story where you felt proud of yourself recently.",
        type: "practice",
        status: "pending",
      },
      {
        id: "spotlight-3",
        label: "Explore one new career, major, or path that matches your energy today.",
        type: "explore",
        status: "pending",
      },
      {
        id: "spotlight-4",
        label: "Pick one tiny habit you could try this week that supports your goals.",
        type: "action",
        status: "pending",
      },
    ],
    coachingMessage:
      "If you only do one thing today, choose the task that feels both a little uncomfortable and a little exciting. That’s usually where growth lives.",
    progress: 0.2,
  },
  {
    id: "motivations",
    title: "Motivations",
    icon: "heart",
    accentColor: "#FFB5E1",
    summary:
      "You’re driven by meaning, momentum, and the feeling that what you do actually matters—to you and to others.",
    sections: [
      {
        heading: "What Lights You Up",
        body: "You get energized when there’s a clear purpose behind what you’re doing. You’d rather work hard on something you care about than coast on something that feels empty.",
      },
      {
        heading: "What Drains You",
        body: "Endless busywork, unclear expectations, and environments where nobody seems to care are major energy leaks. You need room to ask why, not just do what you’re told.",
      },
      {
        heading: "How You Stay Engaged",
        body: "You stay most engaged when you can see progress, get feedback, and feel like your effort is actually moving something forward—whether that’s a project, a person, or yourself.",
      },
      {
        heading: "Signals You’re Misaligned",
        body: "When you start procrastinating more, spacing out, or feeling weirdly exhausted by simple tasks, it’s often a sign your work isn’t connecting to your deeper reasons for doing it.",
      },
    ],
  },
  {
    id: "strengths",
    title: "Strengths",
    icon: "shield",
    accentColor: "#A5FFD6",
    summary:
      "You have a mix of social, analytical, and creative strengths that show up most when you’re given real responsibility.",
    sections: [
      {
        heading: "How You Naturally Show Up",
        body: "You tend to step in when something matters to you—offering ideas, organizing chaos, or supporting people who are struggling. You don’t need to be the loudest to have impact.",
      },
      {
        heading: "What People Rely On You For",
        body: "Friends and classmates often lean on you for perspective, problem-solving, or just having someone steady in the room when things feel messy.",
      },
      {
        heading: "Your Hidden Strengths",
        body: "You notice patterns—how people behave, how systems work, and where things could be better. That awareness is a strength, even if you haven’t fully used it yet.",
      },
      {
        heading: "How To Grow Your Strengths",
        body: "The fastest way to grow is to use your strengths on slightly harder challenges: bigger projects, new groups, or situations where the outcome actually matters.",
      },
    ],
  },
  {
    id: "skills",
    title: "Skills",
    icon: "tools",
    accentColor: "#7EE7F6",
    summary:
      "Your skills are a mix of things you’ve practiced, things you’ve picked up along the way, and things you haven’t fully realized you’re good at yet.",
    sections: [
      {
        heading: "Current Skill Set",
        body: "You’ve built skills in communication, problem-solving, and learning quickly. Even when you don’t feel ‘expert’, you pick things up faster than you give yourself credit for.",
      },
      {
        heading: "Skills in Progress",
        body: "Some skills are still loading—like managing time under pressure, speaking up more confidently, or sticking with hard tasks when motivation dips.",
      },
      {
        heading: "Transferable Skills",
        body: "Things like listening, leading small groups, organizing people, or figuring out how to explain ideas clearly are valuable in almost any school, job, or project.",
      },
      {
        heading: "Next Skills to Build",
        body: "You’ll get the most payoff by choosing 1–2 skills to intentionally practice over the next few months, instead of trying to level up everything at once.",
      },
    ],
  },
  {
    id: "superpowers",
    title: "Superpowers",
    icon: "bolt",
    accentColor: "#C7A6FF",
    summary:
      "Your superpowers are the parts of you that feel almost unfair when they’re fully turned on—in a good way.",
    sections: [
      {
        heading: "Your Standout Energy",
        body: "When you care about something, your focus and creativity can flip on fast. You can connect ideas, people, and moments in ways that make others feel seen and inspired.",
      },
      {
        heading: "Your Social Superpower",
        body: "You have the ability to read a room and adjust—sometimes by breaking the tension, sometimes by quietly helping someone feel less alone.",
      },
      {
        heading: "Your Learning Superpower",
        body: "You can go deep on topics that hook your curiosity. When something matters, you’re capable of learning faster than you expect—especially with the right structure.",
      },
      {
        heading: "Using Superpowers Intentionally",
        body: "Superpowers get even stronger when you aim them. Choosing where to direct your energy is a skill by itself—and it’s one that will shape your future.",
      },
    ],
  },
  {
    id: "friends",
    title: "Friends",
    icon: "people",
    accentColor: "#FFB8C6",
    summary:
      "Your friendships are a huge part of how you experience life, and they shape the risks you take, the goals you set, and how you see yourself.",
    sections: [
      {
        heading: "How You Show Up as a Friend",
        body: "You’re often the one who checks in, listens, or helps people feel less weird about whatever they’re going through. You value honesty and low-drama connections.",
      },
      {
        heading: "What You Need From Friends",
        body: "You do best with people who respect your boundaries, support your goals, and don’t punish you for growing or changing directions.",
      },
      {
        heading: "Friendship Patterns",
        body: "You may drift toward people who need help or who feel misunderstood. That can be meaningful, but it’s worth checking that you’re also getting support back.",
      },
      {
        heading: "Building a Supportive Circle",
        body: "Over time, your closest circle will matter more than the number of people who know your name. It’s okay to be picky about who gets front-row seats in your life.",
      },
    ],
  },
  {
    id: "family",
    title: "Family",
    icon: "home",
    accentColor: "#FFC58A",
    summary:
      "Your family context shapes how you think about security, risk, success, and what’s ‘normal’—even when you eventually build your own path.",
    sections: [
      {
        heading: "How Family Shows Up for You",
        body: "There may be support, pressure, expectations, or silence around certain topics. All of that influences how easy or hard it feels to make your own choices.",
      },
      {
        heading: "Unspoken Rules",
        body: "Every family has rules nobody writes down—about money, grades, emotions, or what counts as ‘success’. Noticing those rules is the first step toward deciding which ones fit you.",
      },
      {
        heading: "Your Role in the Family",
        body: "You might be the fixer, the peacemaker, the high-achiever, the quiet one, or some mix. That role often leaks into school, work, and friendships too.",
      },
      {
        heading: "Owning Your Story",
        body: "You don’t have to repeat everything you grew up with. You can learn from it, keep what works, and slowly build a version of life that feels more like you.",
      },
    ],
  },
  {
    id: "careers",
    title: "Careers",
    icon: "compass",
    accentColor: "#8BE4FF",
    summary:
      "You don’t need a perfect answer right now. You just need to explore futures that fit your energy, values, and style of working.",
    sections: [
      {
        heading: "How You Might Like to Work",
        body: "You’ll likely do best in environments where you can mix thinking and doing—solving real problems, collaborating with people, and seeing visible outcomes.",
      },
      {
        heading: "Clues From Your Interests",
        body: "Things you get lost in now—games, hobbies, topics you research for fun—often contain clues about future paths, even if the connection isn’t obvious yet.",
      },
      {
        heading: "Experiment Over Certainty",
        body: "The strongest career moves often come from trying things: short projects, summer jobs, clubs, volunteering, or shadowing someone in a field you’re curious about.",
      },
      {
        heading: "Defining ‘Success’ for You",
        body: "Your version of success might include impact, flexibility, financial stability, creativity, or freedom. Getting clear on your mix makes decisions a lot easier.",
      },
    ],
  },
  {
    id: "education",
    title: "Education",
    icon: "book",
    accentColor: "#B6B8FF",
    summary:
      "School isn’t just about grades—it’s about how you learn, what environments you thrive in, and what opens doors for your future.",
    sections: [
      {
        heading: "How You Learn Best",
        body: "You may learn best through doing, discussing, visualizing, or teaching others. When your learning style matches the environment, everything feels less like a grind.",
      },
      {
        heading: "School vs. Real Learning",
        body: "Some of your most important learning will happen outside of formal classes—through projects, side interests, online courses, or people you meet.",
      },
      {
        heading: "Your Relationship With Grades",
        body: "Grades can open certain doors, but they don’t define your intelligence or potential. They’re one signal, not your entire story.",
      },
      {
        heading: "Designing Your Next Step",
        body: "Whether it’s college, trade school, work, a gap year, or something hybrid, the best next step is the one that helps you grow without completely burning you out.",
      },
    ],
  },
];
