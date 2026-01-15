// src/app/main/explore/content/community.ts
import type { ExploreArea } from "./types";

const community: ExploreArea = {
  id: "community",
  label: "Community",
  chip: "🤝",
  glowClass: "from-rose-400 via-pink-400 to-orange-400",
  href: "/main/explore/community",

  headline: "Community",
  summary: "Find people, places, and causes where you feel useful and seen.",
  hint: "Belonging happens faster when you contribute something small.",

  signals: ["local", "service", "connection", "low-pressure"],

  nextMoves: [
    {
      id: "com-n1",
      title: "Pick one place to show up twice",
      blurb: "First time = awkward. Second time = familiar.",
    },
    {
      id: "com-n2",
      title: "Do one ‘micro-help’ task",
      blurb: "Tiny contribution builds trust faster than small talk.",
    },
    {
      id: "com-n3",
      title: "Try one virtual community",
      blurb: "Low friction. Still real connection if you participate.",
    },
  ],

  cards: [
    {
      id: "community-center-support",
      icon: "🧓",
      title: "Community center helper (elderly + families)",
      short:
        "Be the person who makes someone’s day a little easier.\n\n" +
        "This can be serving meals, helping with a class, tech help for seniors, or just being a friendly presence.\n\n" +
        "If you like calm, real conversations and feeling useful, this hits.",
      tags: ["service", "in-person", "meaningful"],
      hint: "Try a single shift first. You’ll know quickly if it fits.",
      starterExperiment:
        "Tiny test: call or email one center and ask what a ‘first shift’ looks like.",
    },
    {
      id: "youth-tutor-coach",
      icon: "📚",
      title: "Tutor or coach (kids + teens)",
      short:
        "Be a stable, positive older-person energy for someone.\n\n" +
        "Tutoring, homework help, reading buddies, or coaching a beginner group.\n\n" +
        "You’ll build leadership without needing to be ‘the loud person.’",
      tags: ["leadership", "impact", "repeatable"],
      hint: "Pick one subject or skill you can explain simply.",
      starterExperiment:
        "Tiny test: offer one 30-minute help session (or volunteer once) and see how it feels.",
    },
    {
      id: "mutual-aid-volunteer",
      icon: "🛒",
      title: "Mutual aid + practical volunteering",
      short:
        "Less talking. More doing.\n\n" +
        "Food banks, donation sorting, community gardens, neighborhood cleanups, supply drives.\n\n" +
        "Perfect if you want impact without the pressure of constant socializing.",
      tags: ["hands-on", "teamwork", "low-social-pressure"],
      hint: "Choose a role where you can stay busy.",
      starterExperiment:
        "Tiny test: pick one event, bring a friend, and stay for the full time block.",
    },
    {
      id: "virtual-community-builder",
      icon: "💻",
      title: "Virtual communities (learn, build, belong)",
      short:
        "Online can be real — if you participate.\n\n" +
        "Join a community around something you’re building: coding, art, fitness, language learning, gaming, entrepreneurship.\n\n" +
        "The secret move: be the helpful person. That’s how you become known.",
      tags: ["virtual", "skills", "network"],
      hint: "Lurk less. Post one question or one small win.",
      starterExperiment:
        "Tiny test: join one Discord/Reddit/community group and introduce yourself with one sentence.",
    },
  ],
};

export default community;
