import { Link, useParams } from "@tanstack/react-router";
import { Check, Lock, Monitor } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { levelMeta } from "data/learn";

export default function Level() {
  const params = useParams({ strict: false });
  const levelId = params.levelId as string | undefined;
  const level = levelId ? levelMeta[levelId] : null;

  if (!level) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 flex-wrap gap-2">
        <span className="text-gray-500">Level not found.</span>
        <Link to="/learn" className="text-blue-600 font-medium">
          Back to Learn
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Current Path Header Card */}
        <Card className="max-w-3xl mx-auto rounded-[1.25rem] md:rounded-[2rem] border border-gray-100 shadow-sm mb-12 md:mb-16">
          <CardContent className="p-4 md:p-6 flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 shadow-xs border border-blue-100/50">
              <Monitor className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-gray-400 uppercase">
                CURRENT PATH
              </span>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mt-0.5">
                {level.name}
              </h1>
            </div>
          </CardContent>
        </Card>

        {/* Learning Journey / Map */}
        <div className="relative max-w-2xl mx-auto">
          {level.lessons.map((lesson, i) => {
            const isCompleted = lesson.completed;
            const isOngoing = !isCompleted && (i === 0 || level.lessons[i - 1].completed);
            const isLocked = !isCompleted && !isOngoing;

            return (
              <div key={lesson.id} className="relative mb-8 md:mb-12 group last:mb-0">
                {/* Vertical Line Connector */}
                {i < level.lessons.length - 1 && (
                  <div
                    className={`absolute left-5 md:left-7 top-10 md:top-14 bottom-[-2rem] md:bottom-[-3rem] w-0.5 md:w-1 transition-colors duration-500 ${
                      isCompleted ? "bg-green-400" : "bg-gray-100"
                    }`}
                  />
                )}

                <div className="flex items-start gap-4 md:gap-8">
                  {/* Node Icon/Number */}
                  <div
                    className={`shrink-0 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-sm border-4 border-white z-10 transition-all duration-300 ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isOngoing
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-white text-gray-400 border-gray-100"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 md:w-7 md:h-7 stroke-[3px]" />
                    ) : (
                      <span className="text-sm md:text-lg font-black">
                        {i + 1}
                      </span>
                    )}
                  </div>

                  {/* Lesson Card */}
                  <Link
                    to={isLocked ? "." : "/learn/$levelId/lesson/$lessonId"}
                    params={{ levelId: levelId!, lessonId: lesson.id }}
                    disabled={isLocked}
                    className="flex-1"
                  >
                    <Card
                      className={`rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 p-6 md:p-8 transition-all duration-200 ${
                        isLocked
                          ? "bg-white/50 opacity-60 cursor-not-allowed"
                          : "hover:bg-gray-50/50 hover:border-blue-100/50 cursor-pointer shadow-sm"
                      }`}
                    >
                      <div className="flex flex-col gap-2">
                        <div>
                          <Badge
                            variant="secondary"
                            className={`text-[9px] md:text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full ${
                              isCompleted
                                ? "bg-green-100 text-green-700"
                                : isOngoing
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {isCompleted
                              ? "COMPLETED"
                              : isOngoing
                                ? "ON GOING"
                                : "LOCKED"}
                          </Badge>
                        </div>
                        <h3 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight mt-1">
                          {lesson.title}
                        </h3>
                        <p className="text-sm md:text-base font-medium text-gray-400">
                          Setup environment and Hello World
                        </p>
                      </div>
                    </Card>
                  </Link>

                  {/* Decorative Lock or State indicator on right */}
                  {isLocked && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">
                      <Lock className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/learn"
            className="text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
          >
            ← BACK TO LEARN
          </Link>
        </div>
      </div>
    </div>
  );
}
