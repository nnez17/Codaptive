import type React from "react";
import { cn } from "@/src/lib/utils";

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
        "flex flex-col items-start w-full p-5 rounded-2xl border-2 transition-all duration-200 text-left bg-white",
        isLocked
          ? "border-transparent bg-gray-50 opacity-60 pointer-events-none"
          : isCompleted
            ? "border-green-200 hover:border-green-400 shadow-sm"
            : "border-gray-200 hover:border-blue-400 hover:shadow-md cursor-pointer",
        className,
      )}
      disabled={isLocked}
      {...props}
    >
      <div
        className={cn(
          "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider mb-2",
          isLocked
            ? "bg-gray-200 text-gray-500"
            : isCompleted
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700",
        )}
      >
        MODULE {moduleNumber}
      </div>

      <h3
        className={cn(
          "text-lg font-bold mb-1",
          isLocked ? "text-gray-500" : "text-gray-900",
        )}
      >
        {title}
      </h3>

      {description && (
        <p className="text-sm text-gray-500 font-medium line-clamp-2">
          {description}
        </p>
      )}
    </button>
  );
}
