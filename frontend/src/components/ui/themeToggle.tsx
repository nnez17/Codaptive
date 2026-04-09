"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/themeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const resolvedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300 active:scale-90 group"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Sun icon */}
      <Sun
        className={`w-[18px] h-[18px] md:w-5 md:h-5 absolute transition-all duration-500 ${
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
      />
      {/* Moon icon */}
      <Moon
        className={`w-[18px] h-[18px] md:w-5 md:h-5 absolute transition-all duration-500 ${
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
      />
    </button>
  );
}
