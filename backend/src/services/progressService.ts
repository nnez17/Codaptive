import mongoose from "mongoose";
import User, { type IUser } from "../models/User";
import Lesson from "../models/Lesson";
import Module from "../models/Module";

export const updateUserProgress = async (
  userId: string,
  lessonId: mongoose.Types.ObjectId,
  moduleId: mongoose.Types.ObjectId,
) => {
  if (!mongoose.isValidObjectId(userId)) throw new Error("Invalid userId");
  if (!mongoose.isValidObjectId(lessonId)) throw new Error("Invalid lessonId");
  if (!mongoose.isValidObjectId(moduleId)) throw new Error("Invalid moduleId");

  const user = (await User.findById(userId)) as IUser;
  if (!user) throw new Error("User not found");

  if (!user.progress) user.progress = { modules: [], lessons: [], levels: [] };
  if (!user.activity) user.activity = { lastWeek: [], lastMonth: [] };
  if (!user.activity.lastWeek) user.activity.lastWeek = [];
  if (!user.activity.lastMonth) user.activity.lastMonth = [];

  const lessonObjectId = lessonId;
  const moduleObjectId = moduleId;

  const lessonIndex = user.progress.lessons.findIndex(
    (l) => l.lessonId.toString() === lessonId,
  );

  if (lessonIndex === -1) {
    user.progress.lessons.push({
      lessonId: lessonObjectId,
      completed: true,
      completedAt: new Date(),
    } as any);
  } else if (user.progress.lessons[lessonIndex]) {
    user.progress.lessons[lessonIndex].completed = true;
    user.progress.lessons[lessonIndex].completedAt = new Date();
  }

  const totalLessonsInModule = await Lesson.countDocuments({
    moduleId: moduleObjectId,
  });

  const userLessonsInModule = await Lesson.find({
    moduleId: moduleObjectId,
  }).select("_id");
  const completedIds = user.progress.lessons
    .filter((l) => l.completed)
    .map((l) => l.lessonId.toString());

  const finishedCount = userLessonsInModule.filter((l) =>
    completedIds.includes(l._id.toString()),
  ).length;

  const percentage =
    totalLessonsInModule > 0
      ? Math.round((finishedCount / totalLessonsInModule) * 100)
      : 0;

  const moduleIndex = user.progress.modules.findIndex(
    (m) => m.moduleId.toString() === moduleId,
  );

  if (moduleIndex > -1 && user.progress.modules[moduleIndex]) {
    user.progress.modules[moduleIndex].progress = percentage;
    user.progress.modules[moduleIndex].completed = percentage === 100;
  } else {
    const moduleData = await Module.findById(moduleId);
    user.progress.modules.push({
      moduleId: moduleObjectId,
      name: moduleData?.name || "Unknown Module",
      progress: percentage,
      completed: percentage === 100,
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activityIndex = user.activity.lastWeek.findIndex(
    (a) => new Date(a.day).setHours(0, 0, 0, 0) === today.getTime(),
  );

  if (activityIndex > -1 && user.activity.lastWeek[activityIndex]) {
    user.activity.lastWeek[activityIndex].lessons += 1;
  } else {
    user.activity.lastWeek.push({
      day: today,
      lessons: 1,
      challenges: 0,
    } as any);
  }

  const now = new Date();
  const currentWeek = Math.ceil(now.getDate() / 7);

  const monthIndex = user.activity.lastMonth.findIndex(
    (m) => m.week === currentWeek,
  );

  if (monthIndex > -1 && user.activity.lastMonth[monthIndex]) {
    user.activity.lastMonth[monthIndex].lessons += 1;
  } else {
    user.activity.lastMonth.push({
      week: currentWeek,
      lessons: 1,
      challenges: 0,
    });
  }

  if (user.activity.lastMonth.length > 5) {
    user.activity.lastMonth.shift();
  }

  const currentLevelId = "beginner";
  const allModulesInLevelCompleted =
    user.progress.modules.filter((m) => m.completed).length >= 3;

  const levelIndex = user.progress.levels.findIndex(
    (l) => l.levelId === currentLevelId,
  );

  if (levelIndex > -1 && user.progress.levels[levelIndex]) {
    if (allModulesInLevelCompleted) {
      user.progress.levels[levelIndex].status = "COMPLETED";

      const nextLevelIndex = user.progress.levels.findIndex(
        (l) => l.levelId === "intermediate",
      );
      if (
        nextLevelIndex > -1 &&
        user.progress.levels[nextLevelIndex] &&
        user.progress.levels[nextLevelIndex].status === "LOCKED"
      ) {
        user.progress.levels[nextLevelIndex].status = "ON GOING";
      }
    } else {
      user.progress.levels[levelIndex].status = "ON GOING";
    }
  } else {
    user.progress.levels.push({
      levelId: currentLevelId,
      status: allModulesInLevelCompleted ? "COMPLETED" : "ON GOING",
    } as any);
  }

  user.markModified("progress");
  user.markModified("activity");
  user.markModified("activity.lastMonth");
  user.markModified("progress.levels");
  return await user.save();
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
