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

export const levelStatus = {
  ONGOING: "ON GOING",
  COMPLETED: "COMPLETED",
  LOCKED: "LOCKED",
};

export const levelsData = [
  {
    id: "beginner",
    title: "Beginner",
    threshold: 0,
    maxXP: 2000,
    description:
      "Master the basics: variables, loops, functions, and error handling. Build your foundation.",
    icon: "/Beginner.png",
    iconBg: "bg-white",
    badgeBg: "bg-[#DCFCE7]",
    badgeText: "text-[#166534]",
  },
  {
    id: "intermediate",
    title: "Intermediate",
    threshold: 2000,
    maxXP: 5000,
    description:
      "Dive into data structures, OOP, and build your first real-world projects.",
    icon: "/Intermediate.png",
    iconBg: "bg-white",
    badgeBg: "bg-[#DBEAFE]",
    badgeText: "text-[#1E40AF]",
  },
  {
    id: "advanced",
    title: "Advanced",
    threshold: 5000,
    maxXP: 10000,
    description:
      "Master advanced concepts like decorators, generators, and concurrency.",
    icon: "/Advance.png",
    iconBg: "bg-white",
    badgeBg: "bg-[#E5E7EB]",
    badgeText: "text-[#4B5563]",
  },
];

export function getLevelInfo(accountStats: { xp: number; level: number; maxXP: number }, progressLevels: any[] = []) {
  const ongoingLevel = progressLevels.find(l => l.status === "ON GOING") 
                    || progressLevels.slice().reverse().find(l => l.status === "COMPLETED")
                    || { levelId: levelsData[0].id };
  
  const currentPathData = levelsData.find(l => l.id === (ongoingLevel.levelId || ongoingLevel.id)) || levelsData[0];
  const currentIndex = levelsData.findIndex(l => l.id === currentPathData.id);
  const nextLevel = levelsData[currentIndex + 1] || null;

  return {
    ...currentPathData,
    levelNumber: accountStats.level,
    xpInLevel: accountStats.xp,
    maxXP: accountStats.maxXP,
    progress: (accountStats.xp / accountStats.maxXP) * 100,
    neededXP: accountStats.maxXP - accountStats.xp,
    nextLevel,
  };
}

// Default values for initial load or demo
export const currentXP = 0;
export const levelInfo = getLevelInfo({ xp: 0, level: 1, maxXP: 1000 }, [{ levelId: "beginner", status: "ON GOING" }]);
export const maxXP = levelInfo.maxXP;
export const xpPercentage = levelInfo.progress;
