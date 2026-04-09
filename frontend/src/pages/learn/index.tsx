"use client";

import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { BookOpen, ChevronRight, Loader2, Lock } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLessons } from "@/services/lessonService";
import { useAccount } from "@/contexts/account";

export default function Learn() {
  const { account } = useAccount();
  const [levels, setLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndGroupLessons = async () => {
      try {
        const res = await getLessons();
        const lessons = res.data || [];
        
        const levelDescriptions: Record<string, string> = {
          beginner: "Master the basics: variables, loops, and logic.",
          intermediate: "Deep dive into functions, classes, and modules.",
          advanced: "Harness decorators, generators, and async programming."
        };

        const grouped = lessons.reduce((acc: any, lesson: any) => {
          const levelId = lesson.level || "beginner";
          if (!acc[levelId]) {
            acc[levelId] = {
              id: levelId,
              name: levelId.charAt(0).toUpperCase() + levelId.slice(1) + " Python",
              description: levelDescriptions[levelId] || `Master ${levelId} concepts and fundamentals.`,
              lessonCount: 0
            };
          }
          acc[levelId].lessonCount++;
          return acc;
        }, {});

        const order: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3 };
        const sortedLevels = Object.values(grouped).sort((a: any, b: any) => 
          (order[a.id] || 99) - (order[b.id] || 99)
        );
        setLevels(sortedLevels);
      } catch (err) {
        console.error("Failed to fetch/group lessons:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAndGroupLessons();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100dvh-60px)] bg-background flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-bold">
          Loading learning paths...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-60px)] bg-background">
      <div className="md:hidden flex flex-col min-h-[calc(100dvh-60px)]">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 gap-4">
          {levels.length > 0 ? (
            levels.map((m) => {
              const id = m.id;
              const levelProgress = account?.progress.levels.find(l => l.levelId === id);
              const status = levelProgress?.status || (id === 'beginner' ? 'ON GOING' : 'LOCKED');
              const isCompleted = status === 'COMPLETED';
              const isOngoing = status === 'ON GOING';
              const isLocked = status === 'LOCKED';

              return (
                <Link
                  key={id}
                  to={isLocked ? "." : "/learn/$levelId"}
                  params={{ levelId: id }}
                  disabled={isLocked}
                  className={`w-full max-w-[340px] ${isLocked ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  <div
                    className={`
                      rounded-2xl border-2 px-5 py-4 transition-all duration-200 w-full
                      ${
                        isCompleted
                          ? "border-border bg-card"
                          : isOngoing
                            ? "border-primary/40 bg-card shadow-sm shadow-primary/5"
                            : "border-border/50 bg-muted/20"
                      }
                      ${!isLocked ? "active:scale-[0.98]" : ""}
                    `}
                  >
                    <Badge
                      variant="secondary"
                      className={`
                        text-[9px] font-extrabold tracking-[0.12em] uppercase px-2.5 py-0.5 rounded-md mb-1.5 w-fit
                        ${
                          isCompleted
                            ? "bg-green-500/15 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                            : isOngoing 
                              ? "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                              : "bg-muted text-muted-foreground"
                        }
                      `}
                    >
                      {status}
                    </Badge>

                    <h2 className="text-[17px] font-bold tracking-tight leading-snug text-foreground flex items-center gap-2">
                      {m.name}
                      {isLocked && <Lock className="w-3.5 h-3.5 text-muted-foreground/50" />}
                    </h2>
                    <p className="text-[13px] text-muted-foreground mt-0.5">
                      {m.description}
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No content available.</p>
              <p className="text-xs text-muted-foreground/60">Try adding lessons via the admin panel.</p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm px-6 pt-3 pb-5 border-t border-border/50">
          <Link to="/profile" className="block max-w-[340px] mx-auto">
            <Button
              variant="default"
              className="w-full h-[52px] rounded-full text-[15px] font-bold tracking-widest uppercase
                bg-linear-to-r from-blue-600 via-blue-500 to-indigo-500
                text-white shadow-lg shadow-blue-500/20
                transition-all duration-200 active:scale-[0.97]"
            >
              Go to Profile
            </Button>
          </Link>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Learn Python
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mb-8">
            Choose a level and start with the first lesson.
          </p>

          <div className="space-y-5">
            {levels.length > 0 ? (
              levels.map((m) => {
                const id = m.id;
                const levelProgress = account?.progress.levels.find(l => l.levelId === id);
                const status = levelProgress?.status || (id === 'beginner' ? 'ON GOING' : 'LOCKED');
                const isCompleted = status === 'COMPLETED';
                const isLocked = status === 'LOCKED';

                return (
                  <Card
                    key={id}
                    className={`rounded-2xl border transition-all ${
                      isLocked 
                        ? "opacity-60 border-border bg-muted/20" 
                        : "border-border shadow-sm hover:border-primary/30 hover:shadow-md bg-card"
                    }`}
                  >
                    <Link
                      to={isLocked ? "." : "/learn/$levelId"}
                      params={{ levelId: id }}
                      disabled={isLocked}
                      className={`block ${isLocked ? "cursor-not-allowed" : ""}`}
                    >
                      <CardHeader className="flex flex-row items-start gap-6 p-6">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${isLocked ? "bg-muted" : "bg-primary/10"}`}>
                          {isLocked ? (
                            <Lock className="w-7 h-7 text-muted-foreground/40" />
                          ) : (
                            <BookOpen className="w-7 h-7 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge 
                              variant={isLocked ? "outline" : "secondary"}
                              className={`text-[10px] uppercase tracking-wider ${
                                isCompleted ? "bg-green-500/10 text-green-500 border-none" : ""
                              }`}
                            >
                              {status}
                            </Badge>
                          </div>
                          <h2 className="text-xl font-semibold text-foreground">
                            {m.name}
                          </h2>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {m.description}
                          </p>
                          <p className="text-xs text-muted-foreground/60 mt-2">
                            {m.lessonCount} lessons
                          </p>
                        </div>
                        {!isLocked && <ChevronRight className="w-5 h-5 text-muted-foreground/40 shrink-0 mt-1" />}
                      </CardHeader>
                    </Link>
                  </Card>
                );
              })
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl bg-muted/30">
                <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-1">No levels found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                  We couldn't find any lessons in the database. Please add some lessons using the admin panel.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
