import type React from "react";
import { cn } from "@/lib/utils";

interface LessonCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  moduleNumber: number | string;
  title: string;
  description?: string;
  status?: "locked" | "unlocked" | "completed";
}

export function LessonCard({
  moduleNumber,
  title,
  description,
  status = "unlocked",
  className,
  ...props
}: LessonCardProps) {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";

  return (
    <button
      className={cn(
        "flex flex-col items-start w-full p-5 rounded-2xl border-2 transition-all duration-200 text-left bg-card",
        isLocked
          ? "border-transparent bg-muted/50 opacity-60 pointer-events-none text-muted-foreground"
          : isCompleted
            ? "border-green-500/30 hover:border-green-500/50 shadow-sm"
            : "border-border hover:border-primary/50 hover:shadow-md cursor-pointer",
        className,
      )}
      disabled={isLocked}
      {...props}
    >
      <div
        className={cn(
          "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider mb-2",
          isLocked
            ? "bg-muted-foreground/20 text-muted-foreground"
            : isCompleted
              ? "bg-green-500/20 text-green-500"
              : "bg-primary/20 text-primary",
        )}
      >
        MODULE {moduleNumber}
      </div>

      <h3
        className={cn(
          "text-lg font-bold mb-1",
          isLocked ? "text-muted-foreground" : "text-foreground",
        )}
      >
        {title}
      </h3>

      {description && (
        <p className="text-sm text-muted-foreground font-medium line-clamp-2">
          {description}
        </p>
      )}
    </button>
  );
}
