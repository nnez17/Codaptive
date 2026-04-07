import mongoose from "mongoose";
import User, { type IUser } from "../models/User";
import Lesson, { type ILesson } from "../models/Lesson";

export const updateUserProgress = async (
  lessonId: string,
  user: IUser,
  lessonData: ILesson,
) => {
  const lessonIndex = user.progress.lessons.findIndex(
    (l) => l.lessonId === lessonId,
  );
  if (lessonIndex === -1) {
    user.progress.lessons.push({
      lessonId,
      completed: true,
      completedAt: new Date(),
    });
  } else {
    user.progress.lessons[lessonIndex]!.completed = true;
    user.progress.lessons[lessonIndex]!.completedAt = new Date();
  }

  const currentLevel = lessonData.level;

  const totalInLevel = await Lesson.countDocuments({ level: currentLevel });

  const userLessons = await Lesson.find({
    lessonId: { $in: user.progress.lessons.map((l) => l.lessonId) },
    level: currentLevel,
  });

  if (userLessons.length >= totalInLevel) {
    const lvlIdx = user.progress.levels.findIndex(
      (l) => l.levelId === currentLevel,
    );

    if (lvlIdx > -1) {
      user.progress.levels[lvlIdx]!.status = "COMPLETED";

      const roadmap = ["beginner", "intermediate", "advanced"];
      const nextLevelName = roadmap[roadmap.indexOf(currentLevel) + 1];
      if (nextLevelName) {
        const nextLvlIdx = user.progress.levels.findIndex(
          (l) => l.levelId === nextLevelName,
        );
        if (
          nextLvlIdx > -1 &&
          user.progress.levels[nextLvlIdx]!.status === "LOCKED"
        ) {
          user.progress.levels[nextLvlIdx]!.status = "ON GOING";
        }
      }
    }
  }

  const today = new Date().toISOString().split("T")[0]!;

  const activityIndex = user.activity.lastWeek.findIndex(
    (a) => a.day === today,
  );

  if (activityIndex > -1) {
    user.activity.lastWeek[activityIndex]!.lessons += 1;
  } else {
    user.activity.lastWeek.push({
      day: today,
      lessons: 1,
      challenges: 0,
    });
  }

  if (user.activity.lastWeek.length > 7) {
    user.activity.lastWeek.shift();
  }

  const now = new Date();
  const currentWeekNumber = Math.ceil(now.getDate() / 7);

  const monthActivityIndex = user.activity.lastMonth.findIndex(
    (m) => m.week === currentWeekNumber,
  );

  if (monthActivityIndex > -1) {
    user.activity.lastMonth[monthActivityIndex]!.lessons += 1;
  } else {
    user.activity.lastMonth.push({
      week: currentWeekNumber,
      lessons: 1,
      challenges: 0,
    });
  }

  if (user.activity.lastMonth.length > 5) {
    user.activity.lastMonth.shift();
  }

  user.markModified("progress");
  user.markModified("activity.lastWeek");
  user.markModified("activity.lastMonth");
};

export const updateUserChallengeProgress = async (userId: string) => {
  if (!mongoose.isValidObjectId(userId)) throw new Error("Invalid userId");

  const user = (await User.findById(userId)) as IUser;
  if (!user) throw new Error("User not found");

  if (!user.activity) user.activity = { lastWeek: [], lastMonth: [] };
  if (!user.activity.lastWeek) user.activity.lastWeek = [];
  if (!user.activity.lastMonth) user.activity.lastMonth = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activityIndex = user.activity.lastWeek.findIndex(
    (a) => new Date(a.day).setHours(0, 0, 0, 0) === today.getTime(),
  );

  if (activityIndex > -1 && user.activity.lastWeek[activityIndex]) {
    user.activity.lastWeek[activityIndex].challenges += 1;
  } else {
    user.activity.lastWeek.push({
      day: today,
      lessons: 0,
      challenges: 1,
    } as any);
  }

  const now = new Date();
  const currentWeek = Math.ceil(now.getDate() / 7);

  const monthIndex = user.activity.lastMonth.findIndex(
    (m) => m.week === currentWeek,
  );

  if (monthIndex > -1 && user.activity.lastMonth[monthIndex]) {
    user.activity.lastMonth[monthIndex].challenges += 1;
  } else {
    user.activity.lastMonth.push({
      week: currentWeek,
      lessons: 0,
      challenges: 1,
    } as any);
  }

  if (user.activity.lastWeek.length > 7) user.activity.lastWeek.shift();
  if (user.activity.lastMonth.length > 5) user.activity.lastMonth.shift();

  user.markModified("activity");
  user.markModified("activity.lastMonth");
  return await user.save();
};

export const updateUserSettings = async (
  userId: string,
  settings: { theme?: "light" | "dark"; notifications?: boolean },
) => {
  if (!mongoose.isValidObjectId(userId)) throw new Error("Invalid userId");

  const user = (await User.findById(userId)) as IUser;
  if (!user) throw new Error("User not found");

  if (!user.settings) user.settings = { theme: "light", notifications: false };

  if (settings.theme) user.settings.theme = settings.theme;
  if (settings.notifications !== undefined)
    user.settings.notifications = settings.notifications;

  user.markModified("settings");
  return await user.save();
};
