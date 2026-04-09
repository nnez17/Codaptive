import { Link, useParams } from "@tanstack/react-router";
import { Check, Lock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLessons } from "@/services/lessonService";
import { useAccount } from "@/contexts/account";

export default function Level() {
  const { account } = useAccount();
  const params = useParams({ strict: false });
  const levelId = params.levelId as string | undefined;

  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await getLessons();
        const lessons = res.data || [];
        const filtered = lessons.filter((l: any) => l.level === levelId);
        setLessons(filtered);
      } catch (err) {
        console.error("Failed to fetch lessons for level:", err);
      } finally {
        setLoading(false);
      }
    };
    if (levelId) fetchLessons();
  }, [levelId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-bold italic">
          Gathering lessons for {levelId}...
        </p>
      </div>
    );
  }

  const levelName = levelId
    ? levelId.charAt(0).toUpperCase() + levelId.slice(1) + " Python"
    : "Unknown Level";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Card className="max-w-3xl mx-auto rounded-[1.25rem] md:rounded-[2rem] border border-border bg-card shadow-sm mb-12 md:mb-16">
          <CardContent className="p-4 md:p-6 flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 shadow-xs border border-primary/20">
              <img
                src={
                  levelId === "beginner"
                    ? "/Beginner.png"
                    : levelId === "intermediate"
                      ? "/Intermediate.png"
                      : "/Advance.png"
                }
                className="w-8 h-8 md:w-12 md:h-12"
                alt="mascot"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-muted-foreground/60 uppercase">
                CURRENT PATH
              </span>
              <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight mt-0.5">
                {levelName}
              </h1>
            </div>
          </CardContent>
        </Card>

        <div className="relative max-w-2xl mx-auto">
          {lessons.length > 0 ? (
            lessons.map((lesson, i) => {
              const lessonId = lesson.lessonId || lesson._id;
              const prevLessonId =
                i > 0 ? lessons[i - 1].lessonId || lessons[i - 1]._id : null;

              const lessonProgress = account?.progress.lessons.find(
                (l: any) =>
                  l.lessonId === lessonId ||
                  l._id === lessonId ||
                  l.id === lessonId,
              );
              const prevLessonProgress = prevLessonId
                ? account?.progress.lessons.find(
                    (l: any) =>
                      l.lessonId === prevLessonId ||
                      l._id === prevLessonId ||
                      l.id === prevLessonId,
                  )
                : null;

              const isCompleted = lessonProgress?.completed || false;
              const isPrevCompleted =
                i === 0 || (prevLessonProgress?.completed ?? false);

              const isOngoing = !isCompleted && isPrevCompleted;
              const isLocked = !isOngoing && !isCompleted;

              return (
                <div
                  key={lessonId}
                  className="relative mb-8 md:mb-12 group last:mb-0"
                >
                  {i < lessons.length - 1 && (
                    <div
                      className={`absolute left-5 md:left-7 top-10 md:top-14 -bottom-8 md:-bottom-12 w-0.5 md:w-1 transition-colors duration-500 ${
                        isCompleted ? "bg-green-400" : "bg-border"
                      }`}
                    />
                  )}

                  <div className="flex items-start gap-4 md:gap-8">
                    <div
                      className={`shrink-0 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-sm border-4 border-background z-10 transition-all duration-300 ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isOngoing
                            ? "bg-primary text-primary-foreground shadow-sm animate-pulse shadow-primary/20"
                            : "bg-muted text-muted-foreground border-border"
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
                      to={
                        isLocked || isCompleted
                          ? "."
                          : "/learn/$levelId/lesson/$lessonId"
                      }
                      params={{
                        levelId: levelId!,
                        lessonId: lesson.lessonId || lesson._id,
                      }}
                      disabled={isLocked || isCompleted}
                      className="flex-1"
                    >
                      <Card
                        className={`rounded-[1.5rem] md:rounded-[2rem] border border-border bg-card p-6 md:p-8 transition-all duration-200 ${
                          isLocked
                            ? "opacity-60 cursor-not-allowed bg-muted/40"
                            : "hover:bg-muted/30 hover:border-primary/30 cursor-pointer shadow-sm"
                        }`}
                      >
                        <div className="flex flex-col gap-2">
                          <div>
                            <Badge
                              variant="secondary"
                              className={`text-[9px] md:text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full ${
                                isCompleted
                                  ? "bg-green-500/10 text-green-500"
                                  : isOngoing
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {isCompleted
                                ? "COMPLETED"
                                : isOngoing
                                  ? "ON GOING"
                                  : "LOCKED"}
                            </Badge>
                          </div>
                          <h3 className="text-lg md:text-2xl font-black text-foreground tracking-tight mt-1">
                            {lesson.title}
                          </h3>
                          <p className="text-sm md:text-base font-medium text-muted-foreground">
                            Learn {lesson.title.toLowerCase()} and complete
                            challenges.
                          </p>
                        </div>
                      </Card>
                    </Link>

                    {/* Decorative Lock or State indicator on right */}
                    {isLocked && (
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">
                        <Lock className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-[2.5rem] border-2 border-dashed border-border">
              <p className="text-muted-foreground">
                No lessons available for this level yet.
              </p>
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/learn"
            className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
          >
            ← BACK TO LEARN
          </Link>
        </div>
      </div>
    </div>
  );
}
