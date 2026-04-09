"use client";

import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function GlobalNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
      <div className="relative mb-12">
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-150" />

        <img
          src="/Macot.png"
          alt="404 Mascot"
          className="w-64 h-64 md:w-80 md:h-80 object-contain relative z-10 drop-shadow-2xl animate-bounce-subtle"
        />

        {/* 404 number display */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-card px-6 py-2 rounded-2xl shadow-xl border border-border z-20">
          <span className="text-4xl font-black text-foreground tracking-tighter">
            404
          </span>
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 max-w-md leading-tight">
        Oops! Page Not Found
      </h1>

      <p className="text-muted-foreground text-lg mb-10 max-w-sm mx-auto leading-relaxed">
        It seems you're lost outside the learning path. Let's get back on the
        right track!
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full px-2 sm:px-0 sm:max-w-[400px]">
        <Button
          type="button"
          size="lg"
          onClick={() => navigate({ to: "/" })}
          className="flex-1 h-auto! py-4 sm:py-3 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base sm:text-sm tracking-widest shadow-lg shadow-primary/20 active:scale-[0.98] transition-all gap-2"
        >
          <Home className="w-5 h-5" />
          GO HOME
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => window.history.back()}
          className="flex-1 h-auto! py-4 sm:py-3 rounded-2xl border-border bg-card text-foreground/80 font-bold text-base sm:text-sm tracking-widest hover:bg-muted/80 active:scale-[0.98] transition-all gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          GO BACK
        </Button>
      </div>
    </div>
  );
}
