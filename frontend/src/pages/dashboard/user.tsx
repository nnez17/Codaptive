"use client";

import { useMemo, useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccount } from "@/contexts/account";
import { levelsData, getLevelInfo } from "data/profile";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { BookOpen, ChevronRight, Check, Trophy } from "lucide-react";
import Profilebar from "@/components/layout/profilebar";
import { getLessons } from "@/services/lessonService";

export default function Profile() {
  const { account } = useAccount();
  const [activityRange, setActivityRange] = useState<"7d" | "30d">("7d");
  const [showLevels, setShowLevels] = useState(false);
  const [allLessons, setAllLessons] = useState<any[]>([]);

  const userXP = account?.stats.xp ?? 0;

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await getLessons();
        setAllLessons(res.data || []);
      } catch (err) {
        console.error("Failed to fetch lessons:", err);
      }
    };
    fetchLessons();
  }, []);

  const chartData = useMemo(() => {
    if (!account) return [];

    const now = new Date();

    if (activityRange === "7d") {
      const result = [];
      const currentDay = now.getDay();
      const diff = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
      const startOfWeek = new Date(now.setDate(diff));
      startOfWeek.setHours(0, 0, 0, 0);

      const activityMap: Record<string, any> = {};
      account.activity.lastWeek?.forEach((entry: any) => {
        activityMap[entry.day] = entry;
      });

      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];

        const entry = activityMap[dateStr];
        result.push({
          day: dateStr,
          lessons: entry?.lessons || 0,
          challenges: entry?.challenges || 0,
          label: date.toLocaleDateString("en-US", { weekday: "short" }),
        });
      }
      return result;
    } else {
      const monthTotals: Record<
        string,
        { lessons: number; challenges: number }
      > = {};

      account.progress.lessons.forEach((l: any) => {
        if (l.completed && l.completedAt) {
          const d = new Date(l.completedAt);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          if (!monthTotals[key])
            monthTotals[key] = { lessons: 0, challenges: 0 };
          monthTotals[key].lessons += 1;
        }
      });

      const result = [];
      for (let i = 3; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const data = monthTotals[key] || { lessons: 0, challenges: 0 };

        result.push({
          day: key,
          lessons: data.lessons,
          challenges: data.challenges,
          label: d.toLocaleDateString("en-US", { month: "short" }),
        });
      }
      return result;
    }
  }, [activityRange, account]);

  const displayLessons = useMemo(() => {
    if (!allLessons || !account)
      return { lessons: [], totalCompleted: 0, totalCount: 0 };

    const levelPriority: Record<string, number> = {
      advanced: 3,
      intermediate: 2,
      beginner: 1,
    };
    const levelsGrouped = allLessons.reduce((acc: any, lesson: any) => {
      const levelId = lesson.level || "beginner";
      if (!acc[levelId]) acc[levelId] = [];
      acc[levelId].push(lesson);
      return acc;
    }, {});

    const result: any[] = [];
    let totalCompleted = 0;
    let foundFirstIncomplete = false;

    const sortedLevelIds = Object.keys(levelsGrouped).sort(
      (a, b) => (levelPriority[a] || 0) - (levelPriority[b] || 0),
    );

    for (const levelId of sortedLevelIds) {
      const lessons = levelsGrouped[levelId];
      const levelState = account.progress.levels.find(
        (l: any) => l.levelId === levelId,
      );

      const isLevelLocked =
        levelId !== "beginner" &&
        (!levelState || levelState.status === "LOCKED");

      if (isLevelLocked) continue;

      lessons.forEach((lesson: any) => {
        const lessonTargetId = lesson.lessonId || lesson._id || lesson.id;
        const lessonProgress = account.progress.lessons.find(
          (p: any) =>
            p.lessonId === lessonTargetId ||
            p._id === lessonTargetId ||
            p.id === lessonTargetId,
        );
        const isCompleted = lessonProgress?.completed || false;
        if (isCompleted) totalCompleted++;

        let isOngoing = false;
        if (!isCompleted && !foundFirstIncomplete) {
          isOngoing = true;
          foundFirstIncomplete = true;
        }

        result.push({
          id: lesson.lessonId,
          name: lesson.title,
          level: levelId,
          progress: isCompleted ? 100 : 0,
          isOngoing,
          isCompleted,
        });
      });
    }

    return {
      lessons: result,
      totalCompleted,
      totalCount: result.length,
    };
  }, [allLessons, account]);

  const stats = useMemo(() => {
    if (!account || allLessons.length === 0)
      return { completed: 0, inProgress: 0 };

    const completedCount = account.progress.lessons.filter(
      (l: any) => l.completed,
    ).length;

    const unlockedLevelIds = account.progress.levels
      .filter((lvl: any) => lvl.status !== "LOCKED")
      .map((lvl: any) => lvl.levelId);

    if (!unlockedLevelIds.includes("beginner"))
      unlockedLevelIds.push("beginner");

    const totalAvailableCount = allLessons.filter((lesson: any) =>
      unlockedLevelIds.includes(lesson.level || "beginner"),
    ).length;

    return {
      completed: completedCount,
      inProgress: Math.max(0, totalAvailableCount - completedCount),
    };
  }, [account, allLessons]);

  const currentLevelInfo = useMemo(() => 
    getLevelInfo(
      account?.stats || { xp: 0, level: 1, maxXP: 1000 }, 
      account?.progress.levels || []
    ), [account]);

  const displayLevels = useMemo(() => {
    return levelsData.map((l) => {
      const levelProgress = account?.progress.levels.find(p => p.levelId === l.id);
      const status = levelProgress?.status || (l.id === 'beginner' ? 'ON GOING' : 'LOCKED');
      
      let badgeBg = "bg-muted";
      let badgeText = "text-muted-foreground/60";

      if (status === "COMPLETED") {
        badgeBg = "bg-green-500/10";
        badgeText = "text-green-500";
      } else if (status === "ON GOING") {
        badgeBg = "bg-primary/10";
        badgeText = "text-primary";
      }

      return {
        ...l,
        status,
        badgeBg,
        badgeText,
      };
    });
  }, [account]);

  const displayMaxXP = account?.stats.maxXP ?? currentLevelInfo.maxXP;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Profilebar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {account === null ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <Card className="w-full max-w-md rounded-2xl border border-border shadow-sm bg-card">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-foreground">
                  No account
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  You are not logged in, so the profile does not have an
                  account.
                </p>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-3">
                <Button className="w-full rounded-xl" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button variant="outline" className="w-full rounded-xl" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="min-h-[calc(100vh-6rem)] relative">
            {!showLevels ? (
              <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
                <div className="bg-card rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-border mb-6 md:mb-8">
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-4 ring-primary/10 shadow-lg shadow-primary/20 shrink-0 bg-primary flex items-center justify-center">
                      {account.avatar ? (
                        <img
                          src={account.avatar}
                          alt={account.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-primary-foreground text-2xl md:text-3xl font-bold">
                          {account.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                        Hello {account.username}!
                      </h1>
                      <p className="text-sm md:text-base text-muted-foreground mt-1">
                        Ready to continue your learning streak?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8 pb-24 md:pb-0">
                  <div className="lg:col-span-2 bg-card rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-border">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-lg md:text-xl font-bold text-foreground">
                          Your learning stats
                        </h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {activityRange === "7d"
                            ? "Activity in the last week"
                            : "Activity in the last 4 months"}
                        </p>
                      </div>
                      <div className="shrink-0 rounded-xl bg-muted p-1 border border-border">
                        <Button
                          variant={activityRange === "7d" ? "outline" : "ghost"}
                          size="sm"
                          onClick={() => setActivityRange("7d")}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                            activityRange === "7d"
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Last week
                        </Button>
                        <Button
                          variant={
                            activityRange === "30d" ? "outline" : "ghost"
                          }
                          size="sm"
                          onClick={() => setActivityRange("30d")}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                            activityRange === "30d"
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Last month
                        </Button>
                      </div>
                    </div>
                    <div className="h-48 md:h-64">
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                        aspect={undefined}
                        className="[&_svg]:outline-none [&_svg]:border-none"
                      >
                        <BarChart
                          data={chartData}
                          barGap={4}
                          barCategoryGap="20%"
                          className="[&_.recharts-cartesian-axis-line]:hidden [&_.recharts-cartesian-grid-bg]:fill-none"
                          style={{ outline: "none", border: "none" }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="var(--color-border)"
                            strokeWidth={1}
                            fill="transparent"
                          />
                          <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            stroke="none"
                            className="[&_line]:hidden"
                            tick={{
                              fill: "var(--color-muted-foreground)",
                              fontSize: 12,
                              fontWeight: 500,
                            }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            stroke="none"
                            className="[&_line]:hidden"
                            tick={{
                              fill: "var(--color-muted-foreground)",
                              fontSize: 12,
                            }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--color-card)",
                              border: "1px solid var(--color-border)",
                              borderRadius: "12px",
                              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                              fontSize: "13px",
                              color: "var(--color-foreground)",
                            }}
                            labelStyle={{
                              color: "var(--color-foreground)",
                            }}
                            itemStyle={{
                              color: "var(--color-foreground)",
                            }}
                          />
                          <Bar
                            dataKey="lessons"
                            fill="var(--color-primary)"
                            radius={[6, 6, 0, 0]}
                            name="Lessons"
                          />
                          <Bar
                            dataKey="challenges"
                            fill="var(--color-primary)"
                            fillOpacity={0.4}
                            radius={[6, 6, 0, 0]}
                            name="Challenges"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-xs text-muted-foreground font-medium">
                          Lessons
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary/40" />
                        <span className="text-xs text-muted-foreground font-medium">
                          Challenges
                        </span>
                      </div>
                    </div>
                  </div>

                  <aside className="flex flex-col gap-6 md:gap-8">
                    <div className="bg-card rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-border">
                      <h2 className="text-lg md:text-xl font-bold text-foreground">
                        Progress Overview
                      </h2>

                      <div className="grid grid-cols-2 gap-4 mt-5">
                        <div className="rounded-2xl border border-border bg-muted/40 p-4 text-center">
                          <div className="text-3xl font-extrabold text-foreground">
                            {stats.completed}
                          </div>
                          <div className="text-[11px] font-bold tracking-widest text-muted-foreground mt-1 text-uppercase">
                            COMPLETED
                          </div>
                        </div>
                        <div className="rounded-2xl border border-border bg-muted/40 p-4 text-center">
                          <div className="text-3xl font-extrabold text-foreground">
                            {stats.inProgress}
                          </div>
                          <div className="text-[11px] font-bold tracking-widest text-muted-foreground mt-1 text-uppercase">
                            IN PROGRESS
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-foreground/80">
                            Current Level XP
                          </div>
                          <div className="text-sm font-semibold text-primary">
                            {userXP} / {displayMaxXP} XP
                          </div>
                        </div>
                        <div className="mt-3 w-full bg-muted rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                            style={{
                              width: `${(userXP / displayMaxXP) * 100}%`,
                            }}
                          />
                        </div>
                        <div className="mt-3 text-xs text-muted-foreground text-right">
                          {displayMaxXP - userXP} XP to next tier
                        </div>
                      </div>
                    </div>

                    <Button
                      asChild
                      variant="ghost"
                      className="w-full p-0 h-auto block hover:bg-transparent focus-visible:ring-0"
                    >
                      <button
                        type="button"
                        onClick={() => setShowLevels(true)}
                        className="w-full text-left bg-[#0B1220] rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-[#111827] text-white relative overflow-hidden cursor-pointer focus:outline-hidden group"
                      >
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute -top-20 -left-24 h-72 w-72 rounded-full bg-blue-500 blur-3xl" />
                          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-500 blur-3xl" />
                        </div>

                        <div className="relative">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-col">
                              <div className="text-xs font-semibold text-white/60 tracking-widest uppercase">
                                Current Level
                              </div>
                              <div className="mt-2 text-3xl font-extrabold tracking-tight">
                                {currentLevelInfo.title}
                              </div>
                              <div className="mt-3 text-sm text-white/70">
                                {currentLevelInfo.nextLevel ? (
                                  <>
                                    Next:{" "}
                                    <span className="font-semibold text-white">
                                      {currentLevelInfo.nextLevel.title}
                                    </span>
                                  </>
                                ) : (
                                  <span className="font-semibold text-white">
                                    Max Level reached!
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="shrink-0 w-12 h-12 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                              <Trophy className="w-5 h-5 text-white/80" />
                            </div>
                          </div>
                          <div className="mt-6 h-px w-full bg-white/10" />
                          <div className="mt-4 text-[10px] font-black tracking-widest text-blue-400 flex items-center gap-1 uppercase">
                            View all levels <ChevronRight className="w-3 h-3" />
                          </div>
                        </div>
                      </button>
                    </Button>
                  </aside>
                </div>

                <div className="bg-card rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-border">
                  <div className="flex items-center justify-between mb-6 md:mb-8">
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-foreground">
                        Python Fundamental
                      </h2>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {displayLessons.totalCompleted} /{" "}
                        {displayLessons.totalCount} lessons completed
                      </p>
                    </div>
                    <Button
                      variant="link"
                      onClick={() => setShowLevels(true)}
                      className="flex items-center gap-1 text-sm text-primary font-medium hover:text-primary/80 transition-colors p-0 h-auto"
                    >
                      See all
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4 md:space-y-5">
                    {displayLessons.lessons.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-2xl border border-dashed border-border">
                        No lessons started yet. Start your journey in the Learn
                        tab!
                      </div>
                    ) : (
                      displayLessons.lessons.map((lesson: any) => (
                        <div
                          key={lesson.id}
                          className={`w-full text-left flex items-center gap-4 md:gap-6 p-4 md:p-5 rounded-xl md:rounded-2xl border border-border transition-all duration-300 ${
                            lesson.isOngoing
                              ? "hover:border-primary/30 hover:bg-primary/5 border-primary/20 bg-primary/5"
                              : "hover:border-primary/20 hover:bg-primary/5 shadow-sm"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${
                              lesson.isCompleted
                                ? "bg-green-500/10"
                                : lesson.isOngoing
                                  ? "bg-primary/10"
                                  : "bg-muted"
                            }`}
                          >
                            {lesson.isCompleted ? (
                              <Check
                                className="w-5 h-5 md:w-6 md:h-6 text-green-500 shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                              />
                            ) : lesson.isOngoing ? (
                              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                            ) : (
                              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground/40" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <h3
                                className={`text-sm md:text-base font-semibold truncate ${!lesson.isOngoing && !lesson.isCompleted ? "text-muted-foreground/60" : "text-foreground"}`}
                              >
                                {lesson.name}
                              </h3>
                              <span
                                className={`text-xs font-bold ml-2 shrink-0 ${
                                  lesson.isCompleted
                                    ? "text-green-500"
                                    : lesson.isOngoing
                                      ? "text-primary"
                                      : "text-muted-foreground/50"
                                }`}
                              >
                                {lesson.progress}%
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden border border-border/50">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    lesson.isCompleted
                                      ? "bg-green-500"
                                      : lesson.isOngoing
                                        ? "bg-primary"
                                        : "bg-muted-foreground/20"
                                  }`}
                                  style={{ width: `${lesson.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground shrink-0 uppercase tracking-tighter font-bold">
                                {lesson.isCompleted
                                  ? "COMPLETED"
                                  : lesson.isOngoing
                                    ? "ON GOING"
                                    : "LOCKED"}
                              </span>
                            </div>
                          </div>

                          {lesson.isOngoing ? (
                            <Link
                              to="/learn/$levelId/lesson/$lessonId"
                              params={{
                                levelId: lesson.level,
                                lessonId: lesson.id,
                              }}
                              className="shrink-0 p-2 hover:bg-primary/10 rounded-lg transition-colors"
                            >
                              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" />
                            </Link>
                          ) : (
                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground/20 shrink-0" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-in slide-in-from-right-10 fade-in duration-500">
                <div className="flex items-center gap-5 mb-8 md:mb-12">
                  <div className="flex-1 space-y-1">
                    <h1 className="text-2xl md:text-4xl font-black text-foreground tracking-tight">
                      Level Progress
                    </h1>
                    <p className="text-sm md:text-base font-medium text-muted-foreground">
                      Track your journey and see how far you've come
                    </p>
                  </div>
                </div>

                <div className="max-w-xl mx-auto space-y-5 pb-20">
                  {displayLevels.map((level, idx) => (
                    <div
                      key={level.id}
                      className="flex items-center gap-5 md:gap-7 animate-in slide-in-from-bottom-6 fade-in duration-500"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <img
                        src={level.icon}
                        alt={level.title}
                        className="w-20 h-20 md:w-28 md:h-28 object-cover hidden md:block"
                      />

                      <div className="flex-1 bg-card rounded-[2rem] p-6 md:p-8 shadow-sm border-[3px] border-border flex flex-col gap-1 transition-all">
                        <div className="flex">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] md:text-[11px] font-black tracking-widest uppercase ${level.badgeBg} ${level.badgeText} shadow-xs border border-border`}
                          >
                            {level.status}
                          </span>
                        </div>
                        <h3
                          className={`text-2xl md:text-3xl font-black tracking-tight ${level.status === "LOCKED" ? "text-muted-foreground/60" : "text-foreground"}`}
                        >
                          {level.title}
                        </h3>
                        <p className="text-sm md:text-base font-medium text-muted-foreground">
                          {level.description}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="pt-8">
                    <Button
                      type="button"
                      onClick={() => setShowLevels(false)}
                      className="w-full py-5 md:py-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-md transition-all h-auto cursor-pointer"
                    >
                      BACK TO PROFILE
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
