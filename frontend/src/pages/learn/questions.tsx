"use client";

import { Link, useParams } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Button } from "@/src/components/ui/button";
import { AnswerButton } from "@/src/components/ui/answerButton";
import { CodeWindow } from "@/src/components/ui/codeWindow";
import { LevelBadge } from "@/src/components/ui/levelBadge";
import { FeedbackSheet } from "@/src/components/ui/feedbackSheet";
import { X, Heart, MonitorPlay, Timer, BookOpen, Check } from "lucide-react";
import type { Section, Question, ExplanationSection } from "data/learn";
import { lessonsData } from "data/lesson_sample";

type Step =
  | {
      type: "explanation";
      data: ExplanationSection;
    }
  | {
      type: "question";
      data: Question;
      segments?: { id: string; text: string }[];
    };

export default function Questions() {
  const params = useParams({ strict: false });
  const levelId = params.levelId as string | undefined;
  const lessonId = params.lessonId as string | undefined;

  // Flatten sections and their questions into a single series of steps
  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    // Fallback to first lesson if not found
    const currentLesson =
      lessonsData[lessonId || ""] || lessonsData["lesson-1"];

    currentLesson.sections.forEach((section: Section) => {
      if (section.type === "explanation") {
        s.push({ type: "explanation", data: section });
      } else {
        section.questions.forEach((q: Question) => {
          if (q.type === "fill") {
            s.push({
              type: "question",
              data: q,
              segments: q.code.split("__").map((p, i) => ({
                id: `${q.id}-part-${i}`,
                text: p,
              })),
            });
          } else {
            s.push({ type: "question", data: q });
          }
        });
      }
    });
    return s;
  }, [lessonId]);

  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState<string | string[]>("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  const step = steps[current];

  if (!step) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-center gap-4 border-b border-gray-100">
          <MonitorPlay className="w-8 h-8 text-gray-800" />
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Lesson Complete!
          </h1>

          <LevelBadge
            title="Beginner"
            subtitle="Level"
            className="mb-6 w-full max-w-sm"
          />

          <div className="flex gap-4 mb-10 w-full max-w-sm justify-center">
            <div className="flex-1 flex flex-col items-center justify-center bg-[#F9FAFB] rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 text-green-500 mb-1">
                <Check className="w-5 h-5 bg-green-100 rounded-full p-0.5" />
                <span className="font-bold text-lg text-gray-900">100%</span>
              </div>
              <span className="text-sm font-semibold text-gray-500">
                Correct
              </span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center bg-[#F9FAFB] rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 text-blue-500 mb-1">
                <Timer className="w-5 h-5 bg-blue-100 rounded-full p-0.5" />
                <span className="font-bold text-lg text-gray-900">5 Min</span>
              </div>
              <span className="text-sm font-semibold text-gray-500">
                Time Taken
              </span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center bg-[#F9FAFB] rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-700 mb-1">
                <BookOpen className="w-5 h-5 bg-gray-200 rounded-full p-0.5" />
                <span className="font-bold text-lg text-gray-900">1</span>
              </div>
              <span className="text-sm font-semibold text-gray-500">
                Lesson Level
              </span>
            </div>
          </div>

          <div className="w-full max-w-sm">
            <Button
              className="w-full h-[52px] rounded-full text-base font-bold bg-blue-500 hover:bg-blue-600 shadow-sm border-b-4 border-blue-600 active:border-b-0 active:translate-y-1 transition-all"
              asChild
            >
              <Link to="/learn/$levelId" params={{ levelId: levelId ?? "" }}>
                FINISH SESSION
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const check = () => {
    if (step.type === "explanation") {
      setCurrent(current + 1);
      setAnswer("");
      return;
    }

    const q = step.data;
    if (q.type === "mcq") {
      setResult(answer === q.answer ? "correct" : "wrong");
    } else if (q.type === "fill") {
      if (Array.isArray(q.answer)) {
        const isCorrect =
          Array.isArray(answer) &&
          q.answer.length === answer.length &&
          q.answer.every((val, index) => val === answer[index]);
        setResult(isCorrect ? "correct" : "wrong");
      } else {
        setResult(answer === q.answer ? "correct" : "wrong");
      }
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
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <Link
          to="/learn/$levelId"
          params={{ levelId: levelId ?? "" }}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={2.5} />
        </Link>

        <div className="flex-1 h-3.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${(current / steps.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-1.5 text-red-500 font-bold">
          <Heart fill="currentColor" className="w-6 h-6" />
          <span>5</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 pb-32">
        {step.type === "explanation" ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-black text-gray-900">Explanation</h1>
            </div>
            <div className="bg-blue-50 border-2 border-blue-100 rounded-3xl p-8 mb-8 text-blue-900 text-lg md:text-xl font-bold leading-relaxed shadow-sm">
              {step.data.content}
            </div>
            {step.data.example && (
              <CodeWindow filename="example.py" className="mb-8">
                <pre className="font-mono text-base leading-7 text-[#ABB2BF] font-medium">
                  {step.data.example}
                </pre>
              </CodeWindow>
            )}
          </div>
        ) : step.data.type === "mcq" ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl md:text-3xl font-black text-center text-gray-900 mb-10">
              {step.data.question}
            </h2>
            {step.data.code && (
              <CodeWindow filename="main.py" className="mb-8">
                <pre className="font-mono text-base leading-7 text-[#ABB2BF] font-medium">
                  {step.data.code}
                </pre>
              </CodeWindow>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {step.data.options.map((opt, idx) => (
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
            <h2 className="text-2xl md:text-3xl font-black text-center text-gray-900 mb-4">
              {step.data.instruction}
            </h2>

            <div className="flex justify-center mb-10">
              <CodeWindow filename="main.py" className="">
                <div className="flex flex-wrap items-center gap-y-3 font-mono text-lg md:text-xl text-[#ABB2BF] whitespace-pre-wrap font-medium">
                  {step.type === "question" &&
                    step.segments?.map((seg, i, arr) => (
                      <span key={seg.id} className="flex items-center">
                        <span>{seg.text}</span>
                        {i < arr.length - 1 && (
                          <span
                            className={`inline-flex items-center justify-center min-w-[70px] h-10 mx-2 px-4 rounded-xl border-2 border-dashed transition-all ${
                              currentAnswers[i]
                                ? "bg-blue-500/20 border-blue-400 text-blue-300 border-solid"
                                : "border-[#404040] text-[#404040]"
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
              {step.data.options.map((opt) => (
                <Button
                  key={opt}
                  onClick={() => handleOptionClick(opt)}
                  variant="outline"
                  className={`h-auto py-4 px-8 rounded-2xl border-2 font-black text-xl shadow-sm transition-all active:scale-95 ${
                    currentAnswers.includes(opt)
                      ? "bg-blue-500 border-blue-600 text-white shadow-blue-200 shadow-xl -translate-y-1"
                      : "bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-500"
                  }`}
                >
                  {opt}
                </Button>
              ))}
              {currentAnswers.length > 0 && (
                <div className="w-full flex justify-center mt-4">
                  <Button
                    variant="ghost"
                    className="text-gray-400 hover:text-red-500 font-bold tracking-widest text-xs"
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
        <div className="fixed bottom-0 left-0 right-0 p-6 border-t bg-white z-40">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            <div className="hidden sm:block">
              <span className="text-xs font-black text-gray-400 tracking-widest uppercase">
                {step.type === "explanation"
                  ? "Ready to dive in?"
                  : "SELECT AN ANSWER"}
              </span>
            </div>
            <Button
              onClick={check}
              disabled={
                step.type === "question" &&
                (step.data.type === "mcq"
                  ? !answer
                  : (Array.isArray(answer) ? answer.length : answer ? 1 : 0) !==
                    step.data.code.split("__").length - 1)
              }
              className="w-full sm:w-auto rounded-2xl px-12 py-7 text-xl font-black bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:translate-y-1 active:shadow-none transition-all"
            >
              {step.type === "explanation" ? "GOT IT!" : "CHECK"}
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
