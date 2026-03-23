"use client";

import { Link } from "@tanstack/react-router";
import { BookOpen, ChevronRight, Lock } from "lucide-react";
import { Card, CardHeader } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { levels } from "data/learn";

export default function Learn() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Learn Python
        </h1>
        <p className="text-gray-600 text-sm md:text-base mb-8">
          Choose a level and start with the first lesson.
        </p>

        <div className="space-y-4 md:space-y-5">
          {levels.map((level) => (
            <Card
              key={level.id}
              className={`rounded-2xl border border-gray-100 shadow-sm transition-all ${
                level.locked
                  ? "opacity-75"
                  : "hover:border-blue-100 hover:shadow-md"
              }`}
            >
              {level.locked ? (
                <div className="block cursor-not-allowed">
                  <CardHeader className="flex flex-row items-start gap-4 md:gap-6 p-4 md:p-6">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0 bg-gray-100">
                      <Lock className="w-6 h-6 md:w-7 md:h-7 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                        {level.name}
                      </h2>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {level.desc}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {level.lessons} lessons
                      </p>
                    </div>
                  </CardHeader>
                </div>
              ) : (
                <Link
                  to="/learn/$levelId"
                  params={{ levelId: level.id }}
                  className="block"
                >
                  <CardHeader className="flex flex-row items-start gap-4 md:gap-6 p-4 md:p-6">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0 bg-blue-50">
                      <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                        {level.name}
                      </h2>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {level.desc}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {level.lessons} lessons
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 shrink-0 mt-1" />
                  </CardHeader>
                </Link>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/login">
            <Button variant="outline" className="rounded-xl">
              Sign in to save progress
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
