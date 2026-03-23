"use client";

import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useAccount } from "@/src/contexts/account";
import {
  activityLastWeek,
  activityLastMonth,
  modules,
  currentXP,
  maxXP,
  xpPercentage,
  levelsData,
} from "data/profile";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Profilebar from "@/src/components/layout/profilebar";
import { BookOpen, ChevronRight, Check, Trophy } from "lucide-react";

export default function Profile() {
  const { account } = useAccount();
  const [activityRange, setActivityRange] = useState<"7d" | "30d">("7d");
  const [showLevels, setShowLevels] = useState(false);

  const chartData = useMemo(
    () => (activityRange === "7d" ? activityLastWeek : activityLastMonth),
    [activityRange],
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Profilebar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {account === null ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <Card className="w-full max-w-md rounded-2xl border border-gray-100 shadow-sm">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  No account
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
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
                {/* Greeting Card */}
                <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6 md:mb-8">
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-4 ring-blue-100 shadow-lg shadow-blue-100/50 shrink-0 bg-blue-600 flex items-center justify-center">
                      {account.avatar ? (
                        <img
                          src={account.avatar}
                          alt={account.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-2xl md:text-3xl font-bold">
                          {account.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                        Hello {account.name}!
                      </h1>
                      <p className="text-sm md:text-base text-gray-500 mt-1">
                        Ready to continue your learning streak?
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats & Progress Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8 pb-24 md:pb-0">
                  {/* Learning Stats Card */}
                  <div className="lg:col-span-2 bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-lg md:text-xl font-bold text-gray-900">
                          Your learning stats
                        </h2>
                        <p className="text-sm text-gray-400 mt-0.5">
                          {activityRange === "7d"
                            ? "Activity in the last week"
                            : "Activity in the last month"}
                        </p>
                      </div>
                      <div className="shrink-0 rounded-xl bg-gray-50 p-1 border border-gray-100">
                        <Button
                          variant={activityRange === "7d" ? "outline" : "ghost"}
                          size="sm"
                          onClick={() => setActivityRange("7d")}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                            activityRange === "7d"
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-500 hover:text-gray-700"
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
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-500 hover:text-gray-700"
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
                        className="[&_svg]:outline-none [&_svg]:border-none"
                      >
                        <BarChart
                          data={chartData}
                          barGap={4}
                          barCategoryGap="20%"
                          className="[&_.recharts-cartesian-axis-line]:hidden [&_.recharts-cartesian-grid-line]:stroke-[#F3F4F6] [&_.recharts-cartesian-grid-bg]:fill-none"
                          style={{ outline: "none", border: "none" }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#F3F4F6"
                            strokeWidth={1}
                            fill="transparent"
                          />
                          <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            stroke="none"
                            className="[&_line]:hidden"
                            tick={{
                              fill: "#9CA3AF",
                              fontSize: 12,
                              fontWeight: 500,
                            }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            stroke="none"
                            className="[&_line]:hidden"
                            tick={{ fill: "#9CA3AF", fontSize: 12 }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #E5E7EB",
                              borderRadius: "12px",
                              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                              fontSize: "13px",
                            }}
                          />
                          <Bar
                            dataKey="lessons"
                            fill="#2563EB"
                            radius={[6, 6, 0, 0]}
                            name="Lessons"
                          />
                          <Bar
                            dataKey="challenges"
                            fill="#93C5FD"
                            radius={[6, 6, 0, 0]}
                            name="Challenges"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#2563EB]" />
                        <span className="text-xs text-gray-500 font-medium">
                          Lessons
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#93C5FD]" />
                        <span className="text-xs text-gray-500 font-medium">
                          Challenges
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Overview */}
                  <aside className="flex flex-col gap-6 md:gap-8">
                    <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                      <h2 className="text-lg md:text-xl font-bold text-gray-900">
                        Progress Overview
                      </h2>

                      <div className="grid grid-cols-2 gap-4 mt-5">
                        <div className="rounded-2xl border border-gray-100 bg-gray-50/40 p-4 text-center">
                          <div className="text-3xl font-extrabold text-gray-900">
                            {
                              modules.filter(
                                (module) => module.progress === 100,
                              ).length
                            }
                          </div>
                          <div className="text-[11px] font-bold tracking-widest text-gray-400 mt-1">
                            COMPLETED
                          </div>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-gray-50/40 p-4 text-center">
                          <div className="text-3xl font-extrabold text-gray-900">
                            {
                              modules.filter(
                                (module) =>
                                  module.progress !== 100 &&
                                  module.progress > 0,
                              ).length
                            }
                          </div>
                          <div className="text-[11px] font-bold tracking-widest text-gray-400 mt-1">
                            IN PROGRESS
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-gray-700">
                            Current Level XP
                          </div>
                          <div className="text-sm font-semibold text-blue-600">
                            {currentXP} / {maxXP} XP
                          </div>
                        </div>
                        <div className="mt-3 w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-blue-500 to-blue-600 transition-all duration-700 ease-out"
                            style={{ width: `${xpPercentage}%` }}
                          />
                        </div>
                        <div className="mt-3 text-xs text-gray-400 text-right">
                          {maxXP - currentXP} XP to next tier
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
                                Beginner
                              </div>
                              <div className="mt-3 text-sm text-white/70">
                                Next:{" "}
                                <span className="font-semibold text-white">
                                  Intermediate
                                </span>
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

                {/* Course Section */}
                <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6 md:mb-8">
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-gray-900">
                        Python Fundamental
                      </h2>
                      <p className="text-sm text-gray-400 mt-0.5">
                        Your current course progress
                      </p>
                    </div>
                    <Button
                      variant="link"
                      className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors p-0 h-auto"
                    >
                      See all
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4 md:space-y-5">
                    {modules.map((module) => (
                      <div
                        key={module.name}
                        className="w-full text-left flex items-center gap-4 md:gap-6 p-4 md:p-5 rounded-xl md:rounded-2xl border border-gray-100 transition-all duration-300 hover:border-blue-100 hover:bg-blue-50/10"
                      >
                        <div
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${
                            module.progress === 100
                              ? "bg-green-50"
                              : module.progress !== null && module.progress > 0
                                ? "bg-blue-50"
                                : "bg-gray-50"
                          }`}
                        >
                          {module.progress === 100 ? (
                            <Check
                              className="w-5 h-5 md:w-6 md:h-6 text-green-500 shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            />
                          ) : module.progress !== null &&
                            module.progress > 0 ? (
                            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                          ) : (
                            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-gray-300" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">
                              {module.name}
                            </h3>
                            <span
                              className={`text-xs font-bold ml-2 shrink-0 ${
                                module.progress === 100
                                  ? "text-green-500"
                                  : module.progress !== null &&
                                      module.progress > 0
                                    ? "text-blue-500"
                                    : "text-gray-300"
                              }`}
                            >
                              {module.progress}%
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  module.progress === 100
                                    ? "bg-green-500"
                                    : module.progress !== null &&
                                        module.progress > 0
                                      ? "bg-blue-500"
                                      : "bg-gray-200"
                                }`}
                                style={{ width: `${module.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400 shrink-0">
                              {module.completed}/{module.lessons} lessons
                            </span>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-300 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-in slide-in-from-right-10 fade-in duration-500">
                <div className="flex items-center gap-5 mb-8 md:mb-12">
                  <div className="flex-1 space-y-1">
                    <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
                      Level Progress
                    </h1>
                    <p className="text-sm md:text-base font-medium text-gray-500">
                      Track your journey and see how far you've come
                    </p>
                  </div>
                </div>

                <div className="max-w-xl mx-auto space-y-5 pb-20">
                  {levelsData.map((level, idx) => (
                    <div
                      key={level.id}
                      className="flex items-center gap-5 md:gap-7 animate-in slide-in-from-bottom-6 fade-in duration-500"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div
                        className={`shrink-0 w-28 h-28 md:w-36 md:h-36 rounded-[2rem] bg-white flex items-center justify-center shadow-md border border-gray-50`}
                      >
                        <img
                          src={level.icon}
                          alt={level.title}
                          className="w-20 h-20 md:w-28 md:h-28 object-contain"
                        />
                      </div>

                      <div className="flex-1 bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border-[3px] border-gray-100 flex flex-col gap-1 transition-all">
                        <div className="flex">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] md:text-[11px] font-black tracking-widest uppercase ${level.badgeBg} ${level.badgeText} shadow-xs border border-black/5`}
                          >
                            {level.status}
                          </span>
                        </div>
                        <h3
                          className={`text-2xl md:text-3xl font-black tracking-tight ${level.status === "LOCKED" ? "text-gray-300" : "text-gray-900"}`}
                        >
                          {level.title}
                        </h3>
                        <p className="text-sm md:text-base font-medium text-gray-400">
                          {level.description}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="pt-8">
                    <Button
                      type="button"
                      onClick={() => setShowLevels(false)}
                      className="w-full py-5 md:py-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-md transition-all h-auto cursor-pointer"
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
