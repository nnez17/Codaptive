"use client";

import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/src/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function GlobalNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
      <div className="relative mb-12">
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full scale-150" />

        <img
          src="/Macot.png"
          alt="404 Mascot"
          className="w-64 h-64 md:w-80 md:h-80 object-contain relative z-10 drop-shadow-2xl animate-bounce-subtle"
        />

        {/* 404 number display */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-2xl shadow-xl border border-gray-100 z-20">
          <span className="text-4xl font-black text-gray-900 tracking-tighter">
            404
          </span>
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 max-w-md leading-tight">
        Oops! Page Not Found
      </h1>

      <p className="text-gray-500 text-lg mb-10 max-w-sm mx-auto leading-relaxed">
        It seems you're lost outside the learning path. Let's get back on the
        right track!
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[400px]">
        <Button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="flex-1 h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm tracking-widest shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all gap-2"
        >
          <Home className="w-5 h-5" />
          GO HOME
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          className="flex-1 h-14 rounded-2xl border-gray-200 bg-white text-gray-600 font-bold text-sm tracking-widest hover:bg-gray-50 active:scale-[0.98] transition-all gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          GO BACK
        </Button>
      </div>
    </div>
  );
}
