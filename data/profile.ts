export const activityLastWeek = [
  { day: "Mon", lessons: 0, challenges: 0 },
  { day: "Tue", lessons: 0, challenges: 0 },
  { day: "Wed", lessons: 0, challenges: 0 },
  { day: "Thu", lessons: 0, challenges: 0 },
  { day: "Fri", lessons: 0, challenges: 0 },
  { day: "Sat", lessons: 0, challenges: 0 },
  { day: "Sun", lessons: 0, challenges: 0 },
];

export const activityLastMonth = [
  { day: "W1", lessons: 0, challenges: 0 },
  { day: "W2", lessons: 0, challenges: 0 },
  { day: "W3", lessons: 0, challenges: 0 },
  { day: "W4", lessons: 0, challenges: 0 },
];

export const modules = [
  {
    name: "Introduction to Python",
    progress: 0,
    lessons: null,
    completed: 0,
  },
  {
    name: "Variables & Data Types",
    progress: 0,
    lessons: null,
    completed: 0,
  },
  { name: "Control Flow", progress: 0, lessons: null, completed: 0 },
  { name: "Functions", progress: 0, lessons: null, completed: 0 },
];

export const currentXP = 0;
export const maxXP = 1000;
export const xpPercentage = (currentXP / maxXP) * 100;

export const levelsData = [
  {
    id: "beginner",
    title: "Beginner",
    status: "COMPLETED",
    description: "Setup environment and Hello World",
    icon: "/beginner.png",
    iconBg: "bg-white",
    badgeBg: "bg-[#DCFCE7]",
    badgeText: "text-[#166534]",
  },
  {
    id: "intermediate",
    title: "Intermediate",
    status: "ON GOING",
    description: "Setup environment and Hello World",
    icon: "/intermediate.png",
    iconBg: "bg-white",
    badgeBg: "bg-[#DBEAFE]",
    badgeText: "text-[#1E40AF]",
  },
  {
    id: "advance",
    title: "Advance",
    status: "LOCKED",
    description: "Setup environment and Hello World",
    icon: "/advance.png",
    iconBg: "bg-white",
    badgeBg: "bg-[#E5E7EB]",
    badgeText: "text-[#4B5563]",
  },
];
