"use client";

import { Link, useParams, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AnswerButton } from "@/components/ui/answerButton";
import { CodeWindow } from "@/components/ui/codeWindow";
import { FeedbackSheet } from "@/components/ui/feedbackSheet";
import { StreakPopup } from "@/components/ui/streakPopup";
import {
  X,
  Heart,
  BookOpen,
  Check,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { getLevelInfo } from "data/profile";
import { useAccount } from "@/contexts/account";
import { getUserProfile } from "@/services/userService";
import { getLesson, submitLesson } from "@/services/lessonService";
import { calculateStreak } from "@/utils/streak";

type Step =
  | {
      type: "explanation";
      data: {
        content: string;
        example?: string;
      };
    }
  | {
      type: "question";
      data: any;
      segments?: { id: string; text: string }[];
    };

export default function Questions() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const levelId = params.levelId as string | undefined;
  const lessonId = params.lessonId as string | undefined;

  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!lessonId) return;
      try {
        const res = await getLesson(lessonId);
        const lesson = res.data;

        const pages = lesson.pages || [];

        const newSteps: Step[] = [];

        pages.forEach((page: any) => {
          if (page.type === "explanation") {
            newSteps.push({
              type: "explanation",
              data: {
                content: page.content,
                example: page.example || "",
              },
            });
          } else if (page.type === "quiz" && page.question) {
            const q = page.question;
            const mappedQ = {
              ...q,
              id: q.id,
              type: q.type,
              question: q.question,
              instruction: q.instruction || q.question,
              code: q.code || "",
            };

            if (mappedQ.type === "fill") {
              const segments = mappedQ.code
                .split("__")
                .map((p: string, i: number) => ({
                  id: `${q.id}-part-${i}`,
                  text: p,
                }));
              newSteps.push({ type: "question", data: mappedQ, segments });
            } else {
              newSteps.push({ type: "question", data: mappedQ });
            }
          }
        });

        setSteps(newSteps);
      } catch (err) {
        console.error("Failed to fetch lesson data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessonId]);

  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState<string | string[]>("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [hearts, setHearts] = useState(5);
  const [hasAwardedXP, setHasAwardedXP] = useState(false);
  const [startTime] = useState(Date.now());
  const [correctCount, setCorrectCount] = useState(0);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popupStreak, setPopupStreak] = useState(0);
  const [xpGainedFromHealth, setXpGainedFromHealth] = useState(0);

  const { account, setAccount } = useAccount();
  const levelInfo = useMemo(
    () =>
      getLevelInfo(
        account?.stats || { xp: 0, level: 1, maxXP: 1000 },
        account?.progress.levels || [],
      ),
    [account],
  );

  const step = steps[current];

  const totalQuestions = useMemo(() => {
    return steps.filter((s) => s.type === "question").length;
  }, [steps]);

  const timeElapsed = useMemo(() => {
    if (step) return 0;
    const diff = (Date.now() - startTime) / 1000;
    return Math.floor(diff);
  }, [step, startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!step && !hasAwardedXP && !loading && steps.length > 0) {
      setHasAwardedXP(true);

      const submitStats = async () => {
        const baseXP =
          levelId === "intermediate" ? 700 : levelId === "advanced" ? 900 : 500;
        const xpGained =
          hearts > 0 ? Math.round(baseXP * (0.6 + (hearts - 1) * 0.1)) : 0;
        setXpGainedFromHealth(xpGained);

        if (!lessonId) return;

        try {
          const res = await submitLesson(lessonId, xpGained);

          const isSuccess = res.status === "success" || res.success === true;

          if (isSuccess) {
            if (account) {
              const updatedLessonsProgress = [
                ...(account.progress.lessons || []),
              ];
              const existingIdx = updatedLessonsProgress.findIndex(
                (l: any) => l.lessonId === lessonId || l._id === lessonId,
              );

              if (existingIdx > -1) {
                updatedLessonsProgress[existingIdx] = {
                  ...updatedLessonsProgress[existingIdx],
                  completed: true,
                };
              } else {
                updatedLessonsProgress.push({
                  lessonId,
                  completed: true,
                  completedAt: new Date().toISOString(),
                });
              }

              const updatedAccount = {
                ...account,
                stats: {
                  ...account.stats,
                  xp: account.stats.xp + xpGained,
                },
                progress: {
                  ...account.progress,
                  lessons: updatedLessonsProgress,
                },
              };

              setAccount(updatedAccount);
            }

            const profileRes = await getUserProfile();
            const profilePayload =
              profileRes.status === "success" || profileRes.success === true
                ? profileRes.data
                : profileRes;

            if (profilePayload) {
              setAccount(profilePayload);
              const streakValue = calculateStreak(profilePayload.progress.lessons || []);
              setPopupStreak(streakValue);

              const userId = profilePayload._id || profilePayload.id || "user";
              const today = new Date().toDateString();
              const lastShown = localStorage.getItem(
                `streak_popup_last_shown_${userId}`,
              );

              if (lastShown !== today) {
                setShowStreakPopup(true);
                localStorage.setItem(
                  `streak_popup_last_shown_${userId}`,
                  today,
                );
              }
            }
          }
        } catch (error) {
          console.error("Failed to save lesson stats", error);
        }
      };

      submitStats();
    }
  }, [
    step,
    hasAwardedXP,
    loading,
    steps.length,
    setAccount,
    hearts,
    correctCount,
    totalQuestions,
    lessonId,
  ]);

  const handleFinish = () => {
    navigate({ to: "/learn/$levelId", params: { levelId: levelId || "" } });
  };

  useEffect(() => {
    if (account && lessonId && step) {
      const lessonProgress = account.progress.lessons.find(
        (l: any) => l.lessonId === lessonId,
      );
      if (lessonProgress?.completed) {
        navigate({
          to: "/learn/$levelId",
          params: { levelId: levelId || "beginner" },
        });
      }
    }
  }, [account, lessonId, levelId, navigate, step]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-background rounded-lg border-2 border-primary/20 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-foreground mb-2">
          Preparing Lesson
        </h2>
        <p className="text-muted-foreground font-bold">
          Fetching the best content for you...
        </p>
      </div>
    );
  }

  if (!step) {
    return (
      <div className="min-h-screen bg-background">
        <StreakPopup
          isOpen={showStreakPopup}
          onClose={() => {
            setShowStreakPopup(false);
          }}
          streak={popupStreak}
        />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-muted rounded-full flex items-center justify-center mb-4 shadow-inner ring-4 ring-background">
              <img
                src="/Macot.png"
                alt="Level"
                className="w-24 h-24 md:w-32 md:h-32 object-contain"
              />
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 animate-in zoom-in duration-500">
              <span className="text-primary font-black text-xl">
                +{xpGainedFromHealth} XP
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-black text-foreground mb-8 tracking-tight">
            Assessment Complete
          </h1>

          <div className="w-full max-w-sm bg-[#0B1220] rounded-[2.5rem] p-8 shadow-2xl border border-[#1E293B] relative overflow-hidden mb-6 group transition-all hover:scale-[1.02]">
            <div className="absolute inset-0 opacity-20 bg-linear-to-br from-blue-500/20 to-indigo-500/20" />
            <div className="relative flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase">
                  Current Level
                </span>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  {levelInfo.title}
                </h2>
                <div className="pt-4">
                  <span className="text-xs font-bold text-white/50">
                    Next:{" "}
                  </span>
                  <span className="text-xs font-bold text-white/80">
                    {levelInfo.nextLevel?.title || "Max Level"}
                  </span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <img
                  src={levelInfo.icon}
                  alt={levelInfo.title}
                  className="w-10 h-10 object-contain grayscale brightness-200"
                />
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm px-2 mb-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">
                Current Level XP
              </span>
              <span className="text-[10px] font-black text-primary tracking-widest uppercase">
                {levelInfo.xpInLevel} / {levelInfo.maxXP - levelInfo.threshold}{" "}
                XP
              </span>
            </div>
            <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border/50 p-0.5">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${levelInfo.progress}%` }}
              />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground text-center mt-3 tracking-wide italic">
              {levelInfo.maxXP - levelInfo.threshold - levelInfo.xpInLevel} XP
              to next milestone
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-10 w-full max-w-sm">
            <div className="flex flex-col items-center justify-center bg-card rounded-3xl p-4 border-2 border-border shadow-sm transition-all hover:bg-muted/50">
              <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center mb-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
              </div>
              <span className="font-black text-xl text-foreground tabular-nums">
                {correctCount} / {totalQuestions}
              </span>
              <span className="text-[10px] font-black text-muted-foreground tracking-widest uppercase mt-1">
                Accuracy
              </span>
            </div>

            <div className="flex flex-col items-center justify-center bg-card rounded-3xl p-4 border-2 border-border shadow-sm transition-all hover:bg-muted/50">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-3 text-blue-500">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <span className="font-black text-xl text-foreground tabular-nums">
                {formatTime(timeElapsed)}
              </span>
              <span className="text-[10px] font-black text-muted-foreground tracking-widest uppercase mt-1">
                Time Spent
              </span>
            </div>

            <div className="flex flex-col items-center justify-center bg-card rounded-3xl p-4 border-2 border-border shadow-sm transition-all hover:bg-muted/50">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center mb-3">
                <Heart fill="currentColor" className="w-5 h-5 text-red-500" />
              </div>
              <span className="font-black text-xl text-foreground tabular-nums">
                {hearts}
              </span>
              <span className="text-[10px] font-black text-muted-foreground tracking-widest uppercase mt-1">
                Hearts Left
              </span>
            </div>
          </div>

          <div className="w-full max-w-sm">
            <Button
              className="w-full h-14 rounded-full text-lg font-bold bg-blue-500 hover:bg-blue-600 shadow-lg border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transition-all"
              onClick={handleFinish}
            >
              FINISH SESSION
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const check = async () => {
    if (step.type === "explanation") {
      setCurrent(current + 1);
      setAnswer("");
      return;
    }

    const q = step.data;
    setIsSubmitting(true);
    try {
      let isCorrect = false;
      if (Array.isArray(q.answer) && Array.isArray(answer)) {
        isCorrect = JSON.stringify(q.answer) === JSON.stringify(answer);
      } else {
        isCorrect = q.answer === answer;
      }

      setResult(isCorrect ? "correct" : "wrong");

      if (isCorrect) {
        setCorrectCount((c) => c + 1);
      } else {
        setHearts((h) => Math.max(0, h - 1));
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionClick = (opt: string) => {
    if (step.type !== "question") return;
    const q = step.data;

    if (q.type === "mcq") {
      setAnswer(opt);
    } else if (q.type === "fill") {
      const numBlanks = q.code.split("__").length - 1;
      if (numBlanks === 1) {
        setAnswer(opt);
      } else {
        setAnswer((prev) => {
          const currentArr = Array.isArray(prev) ? [...prev] : [];
          if (currentArr.length < numBlanks) {
            return [...currentArr, opt];
          }
          return currentArr;
        });
      }
    }
  };

  const currentAnswers = Array.isArray(answer)
    ? answer
    : answer
      ? [answer]
      : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <Link
          to="/learn/$levelId"
          params={{ levelId: levelId ?? "" }}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={2.5} />
        </Link>

        <div className="flex-1 h-3.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(current / steps.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-1.5 text-red-500 font-bold">
          <Heart fill="currentColor" className="w-6 h-6" />
          <span>{hearts}</span>
        </div>
      </div>

      {hearts === 0 && (
        <div className="fixed inset-0 z-100 bg-background flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-3xl font-black text-foreground mb-3">
            Out of Hearts!
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xs text-lg font-medium">
            Don't worry, you can try again later or review the previous lessons.
          </p>

          <Button
            className="w-full max-w-sm h-14 rounded-full text-lg font-bold bg-blue-500 hover:bg-blue-600 shadow-sm border-b-4 border-blue-600 active:border-b-0 active:translate-y-1 transition-all"
            asChild
          >
            <Link to="/learn/$levelId" params={{ levelId: levelId ?? "" }}>
              BACK TO LEARN
            </Link>
          </Button>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 pb-32">
        {step.type === "explanation" ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-primary/20 rounded-2xl">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-black text-foreground">
                Explanation
              </h1>
            </div>
            <div className="bg-primary/10 border-2 border-primary/20 rounded-3xl p-8 mb-8 text-foreground text-lg md:text-xl font-bold leading-relaxed shadow-sm">
              {step.data.content}
            </div>
            {step.data.example && (
              <div className="flex justify-center">
                <CodeWindow filename="example.py" className="mb-8">
                  <pre className="font-mono text-base leading-7 text-[#ABB2BF] font-medium">
                    {step.data.example}
                  </pre>
                </CodeWindow>
              </div>
            )}
          </div>
        ) : step.data.type === "mcq" ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl md:text-3xl font-black text-center text-foreground mb-10">
              {step.data.question}
            </h2>
            {step.data.code && (
              <div className="flex justify-center">
                <CodeWindow filename="main.py" className="mb-8">
                  <pre className="font-mono text-base leading-7 text-[#ABB2BF] font-medium">
                    {step.data.code}
                  </pre>
                </CodeWindow>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {step.data.options.map((opt: string, idx: number) => (
                <AnswerButton
                  key={opt}
                  letter={String.fromCharCode(65 + idx)}
                  text={opt}
                  isSelected={answer === opt}
                  onClick={() => handleOptionClick(opt)}
                  status={
                    result && answer === opt
                      ? result === "correct"
                        ? "correct"
                        : "incorrect"
                      : "default"
                  }
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl md:text-3xl font-black text-center text-foreground mb-4">
              {step.data.instruction}
            </h2>

            <div className="flex justify-center mb-10">
              <CodeWindow filename="main.py" className="">
                <div className="flex flex-wrap items-center justify-center gap-y-3 font-mono text-lg md:text-xl text-[#ABB2BF] whitespace-pre-wrap font-medium">
                  {step.type === "question" &&
                    step.segments?.map((seg, i, arr) => (
                      <span
                        key={seg.id}
                        className="flex items-center flex-wrap justify-center"
                      >
                        <span>{seg.text}</span>
                        {i < arr.length - 1 && (
                          <span
                            className={`inline-flex items-center justify-center min-w-[70px] h-10 mx-2 px-4 rounded-xl border-2 border-dashed transition-all ${
                              currentAnswers[i]
                                ? "bg-primary/20 border-primary/50 text-primary border-solid"
                                : "border-muted-foreground/50 text-muted-foreground"
                            }`}
                          >
                            {currentAnswers[i] || "___"}
                          </span>
                        )}
                      </span>
                    ))}
                </div>
              </CodeWindow>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {step.data.options.map((opt: string) => (
                <Button
                  key={opt}
                  onClick={() => handleOptionClick(opt)}
                  variant="outline"
                  className={`h-auto py-4 px-8 rounded-2xl border-2 font-black text-xl shadow-sm transition-all active:scale-95 ${
                    currentAnswers.includes(opt)
                      ? "bg-primary border-primary/80 text-primary-foreground shadow-primary/20 shadow-xl -translate-y-1"
                      : "bg-background border-border text-foreground/80 hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  {opt}
                </Button>
              ))}

              {currentAnswers.length > 0 && (
                <div className="w-full flex justify-center mt-4">
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive font-bold tracking-widest text-xs"
                    onClick={() => setAnswer([])}
                  >
                    RESET ANSWER
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {!result && (
        <div className="fixed bottom-0 left-0 right-0 p-6 border-t border-border bg-background z-40">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            <div className="hidden sm:block">
              <span className="text-xs font-black text-muted-foreground/60 tracking-widest uppercase">
                {step.type === "explanation"
                  ? "Ready to dive in?"
                  : "SELECT AN ANSWER"}
              </span>
            </div>
            <Button
              onClick={check}
              disabled={
                isSubmitting ||
                (step.type === "question" &&
                  (step.data.type === "mcq"
                    ? !answer
                    : (Array.isArray(answer)
                        ? answer.length
                        : answer
                          ? 1
                          : 0) !==
                      (step.data.code?.split("__").length || 1) - 1))
              }
              className="w-full sm:w-auto rounded-2xl px-12 py-7 text-xl font-black bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>CHECKING...</span>
                </>
              ) : step.type === "explanation" ? (
                "GOT IT!"
              ) : (
                "CHECK"
              )}
            </Button>
          </div>
        </div>
      )}

      {result && step.type === "question" && (
        <FeedbackSheet
          status={result === "correct" ? "correct" : "incorrect"}
          message={
            result === "correct"
              ? step.data.correctFeedback
              : step.data.wrongFeedback
          }
          onContinue={() => {
            setCurrent((c) => c + 1);
            setAnswer("");
            setResult(null);
          }}
        />
      )}
    </div>
  );
}
