"use client";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { BookOpen, Terminal, Rocket } from "lucide-react";
import { HeroVisual } from "@/src/components/ui/heroSection";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-[#EFF6FF] flex min-h-[calc(100vh-4rem)] pt-20 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between w-full py-12 md:py-20">
          <div className="flex-1 text-center md:text-left -mt-12">
            <h1 className="flex flex-col">
              <span className="text-gray-900 font-bold text-4xl md:text-7xl">
                Learn Python for
              </span>
              <span className="text-blue-600 font-semibold text-4xl md:text-7xl">
                real-world
              </span>
              <span className="text-gray-900 font-medium text-4xl md:text-7xl">
                development
              </span>
            </h1>
            <p className="mt-6 md:mt-8 text-gray-600 text-base md:text-lg max-w-xl mx-auto md:mx-0">
              Stop watching videos and start coding. Practice Python with
              interactive lessons, coding puzzles, and real programming
              challenges directly in your browser.
            </p>
            <div className="flex justify-center md:justify-start mt-8 md:mt-12">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-[20px] w-auto h-auto text-lg font-semibold shadow-xl shadow-blue-600/20">
                Start Learning
              </Button>
            </div>
          </div>

          <div className="flex-1 w-full flex justify-center items-center mt-12 md:mt-0 lg:pl-10">
            <HeroVisual />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-[#F1F5F9] border-t py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-12 md:gap-0">
          <div className="flex-1 flex flex-col items-center justify-center">
            <span className="text-blue-600 font-bold text-4xl md:text-5xl mb-2">
              100+
            </span>
            <span className="text-gray-500 font-medium text-xs md:text-sm">
              Active Python Learners
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center md:border-l border-[#F1F5F9]">
            <span className="text-blue-600 font-bold text-4xl md:text-5xl mb-2">
              50+
            </span>
            <span className="text-gray-500 font-medium text-xs md:text-sm">
              Interactive Exercises
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center md:border-l border-[#F1F5F9]">
            <span className="text-blue-600 font-bold text-4xl md:text-5xl mb-2">
              40+
            </span>
            <span className="text-gray-500 font-medium text-xs md:text-sm">
              Step-by-Step Lessons
            </span>
          </div>
        </div>
      </div>

      {/* Learning Path Section */}
      <div
        id="path"
        className="bg-[#F8FAFC] py-24 flex flex-col justify-center"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Python Learning Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From your first "Hello World" to building complex automation
              scripts, we guide you every step of the way.
            </p>
          </div>

          <div className="relative mt-8 md:mt-12">
            {/* Vertical Line */}
            <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-1 bg-blue-100 hidden md:block"></div>
            <div className="absolute inset-y-0 right-12 w-1 bg-blue-100 md:hidden"></div>

            <div className="relative space-y-16 md:space-y-24">
              {/* Item 1 */}
              <div className="flex flex-col md:flex-row items-center w-full relative">
                <div className="w-full md:w-1/2 pr-20 md:pr-16 text-right">
                  <h3 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
                    Beginner Python
                  </h3>
                  <p className="text-gray-600 text-sm md:text-lg leading-relaxed">
                    Master the basics: variables, loops, functions, and error
                    handling. Build your foundation.
                  </p>
                </div>
                <div className="absolute right-12 md:left-1/2 transform translate-x-1/2 md:-translate-x-1/2 flex items-center justify-center">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm md:text-xl ring-4 ring-white shadow-xl shadow-blue-900/10">
                    A1
                  </div>
                </div>
                <div className="hidden md:block md:w-1/2 pl-16"></div>
              </div>

              {/* Item 2 */}
              <div className="flex flex-col md:flex-row items-center w-full relative">
                <div className="hidden md:block md:w-1/2 md:pr-16"></div>
                <div className="absolute right-12 md:left-1/2 transform translate-x-1/2 md:-translate-x-1/2 flex items-center justify-center">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm md:text-xl ring-4 ring-white shadow-xl shadow-blue-900/10">
                    B1
                  </div>
                </div>
                <div className="w-full md:w-1/2 pr-20 md:pr-0 md:pl-16 text-right md:text-left">
                  <h3 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
                    Intermediate Python
                  </h3>
                  <p className="text-gray-600 text-sm md:text-lg leading-relaxed">
                    Dive into data structures, OOP, and build your first
                    real-world projects.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex flex-col md:flex-row items-center w-full relative">
                <div className="w-full md:w-1/2 pr-20 md:pr-16 text-right">
                  <h3 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
                    Advanced Python
                  </h3>
                  <p className="text-gray-600 text-sm md:text-lg leading-relaxed">
                    Master advanced concepts like decorators, generators, and
                    concurrency.
                  </p>
                </div>
                <div className="absolute right-12 md:left-1/2 transform translate-x-1/2 md:-translate-x-1/2 flex items-center justify-center">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm md:text-xl ring-4 ring-white shadow-xl shadow-blue-900/10">
                    C1
                  </div>
                </div>
                <div className="hidden md:block md:w-1/2 pl-16"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-25">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Learn Python by Doing
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We believe the best way to learn coding is to write code. Our
              platform is built for action from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-blue-50/50 bg-white/50 backdrop-blur-sm rounded-3xl">
              <div className="absolute inset-0 bg-linear-to-br from-blue-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-blue-100/50">
                  <BookOpen className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Interactive Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Bite-sized Python lessons designed for modern developers.
                  Learn concepts, then immediately apply them in code.
                </p>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-blue-50/50 bg-white/50 backdrop-blur-sm rounded-3xl">
              <div className="absolute inset-0 bg-linear-to-br from-blue-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-blue-100/50">
                  <Terminal className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Coding Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Solve real-world programming puzzles directly in your browser
                  with our integrated IDE and instant feedback.
                </p>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-blue-50/50 bg-white/50 backdrop-blur-sm rounded-3xl">
              <div className="absolute inset-0 bg-linear-to-br from-blue-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-blue-100/50">
                  <Rocket className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Build Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Go beyond syntax. Build functional applications and automation
                  tools to build a portfolio that stands out.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div id="community" className="bg-[#1E3A8A]">
        <div className="items-center text-center py-24">
          <h2 className="text-4xl font-bold text-white mb-4">
            Join A Global Community
          </h2>
          <p className="text-white text-lg max-w-2xl mx-auto">
            You're not alone. Learn alongside thousands of other developers.
          </p>
        </div>
      </div>

      {/* Benefits / CTA Section */}
      <div className="bg-white py-12 md:py-24 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative bg-[#EFF6FF] rounded-[32px] md:rounded-[48px] p-8 md:p-12 text-center border border-blue-100/50 shadow-2xl shadow-blue-900/5 overflow-hidden group">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#DBEAFE] rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F3E8FF] rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 md:mb-8 tracking-tight leading-tight">
                Ready to start coding?
              </h2>
              <p className="text-base md:text-xl text-gray-600 mb-10 md:mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
                Join 120+ learners and launch your programming journey today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
                <Button className="bg-[#2563EB] hover:bg-blue-700 text-white px-8 py-5 rounded-[20px] text-lg font-bold shadow-xl shadow-blue-600/25 transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto h-auto">
                  Start Learning for Free
                </Button>
                <Button
                  variant="outline"
                  className="bg-white hover:bg-gray-50 text-gray-900 border-gray-100 px-8 py-5 rounded-[20px] text-lg font-bold shadow-lg shadow-gray-200/50 transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto h-auto"
                >
                  View Curriculum
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
