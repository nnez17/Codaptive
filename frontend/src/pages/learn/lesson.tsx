"use client";

import { Link, useParams } from "@tanstack/react-router";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CodeWindow } from "@/components/ui/codeWindow";
import { X, Heart, BookOpen, Loader2 } from "lucide-react";
import api from "@/api/axios";
import { useEffect, useState } from "react";

export default function Lesson() {
  const params = useParams({ strict: false });
  const levelId = params.levelId as string | undefined;
  const lessonId = params.lessonId as string | undefined;

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) return;
      try {
        const res = await api.get(`/lessons/${lessonId}`);
        setLesson(res.data.data);
      } catch (err) {
        console.error("Failed to fetch lesson data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  const explanations = useMemo(() => {
    return lesson?.pages?.filter((s: any) => s.type === "explanation") || [];
  }, [lesson]);

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
        <h2 className="text-2xl font-black text-foreground mb-2">Preparing Lesson</h2>
        <p className="text-muted-foreground font-bold">Fetching the best content for you...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black text-foreground mb-2">Lesson Not Found</h2>
        <Button variant="outline" asChild className="mt-4">
          <Link to="/learn/$levelId" params={{ levelId: levelId ?? "" }}>
            Go Back
          </Link>
        </Button>
      </div>
    );
  }

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
          <div className="h-full bg-primary rounded-full w-[15%]" />
        </div>

        <div className="flex items-center gap-1.5 text-red-500 font-bold">
          <Heart fill="currentColor" className="w-6 h-6" />
          <span>5</span>
        </div>
      </div>


      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12 pb-32">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-primary/20 rounded-2xl">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">
            {lesson.title}
          </h1>
        </div>

        {explanations.map((section: any, idx: number) => (
          <div
            key={idx}
            className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="bg-primary/10 border-2 border-primary/20 rounded-3xl p-8 mb-4 text-foreground text-base md:text-lg font-medium leading-relaxed shadow-sm">
              {section.type === "explanation" && section.content}
            </div>

            {section.type === "explanation" && section.example && (
              <div className="flex justify-center">
                <CodeWindow filename="example.py" className="mb-4">
                  <pre className="font-mono text-base leading-7 text-[#ABB2BF] font-medium">
                    {section.example}
                  </pre>
                </CodeWindow>
              </div>
            )}
          </div>
        ))}
      </div>


      <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-border bg-background z-40">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="hidden sm:block">
            <span className="text-xs font-black text-muted-foreground/60 tracking-widest uppercase">
              SO YOU GET IT?
            </span>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <Button
              variant="ghost"
              className="hidden sm:flex text-muted-foreground hover:text-foreground font-bold px-6"
              asChild
            >
              <Link to="/learn/$levelId" params={{ levelId: levelId ?? "" }}>
                TUTUP
              </Link>
            </Button>
            <Button
              className="flex-1 sm:flex-none rounded-xl px-12 py-6 text-lg font-black bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
              asChild
            >
              <Link
                to="/learn/$levelId/questions/$lessonId"
                params={{ levelId: levelId ?? "", lessonId: lessonId ?? "" }}
              >
                CONTINUE
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
