import type React from "react";
import { cn } from "@/lib/utils";

interface AnswerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  letter: string;
  text: string;
  isSelected?: boolean;
  status?: "default" | "correct" | "incorrect";
}

export function AnswerButton({
  letter,
  text,
  isSelected = false,
  status = "default",
  className,
  ...props
}: AnswerButtonProps) {
  const getStyles = () => {
    if (status === "correct") {
      return "border-green-500 bg-green-50 text-green-700";
    }
    if (status === "incorrect") {
      return "border-red-500 bg-red-50 text-red-700";
    }
    if (isSelected) {
      return "border-primary bg-primary/10 text-primary";
    }
    return "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5";
  };

  const getLetterStyles = () => {
    if (status === "correct")
      return "bg-green-100 text-green-700 border-green-200";
    if (status === "incorrect") return "bg-red-100 text-red-700 border-red-200";
    if (isSelected) return "bg-primary/20 text-primary border-primary/30";
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <button
      className={cn(
        "flex items-center w-full px-4 py-3 rounded-2xl border-2 transition-all duration-200 ease-in-out font-medium text-left",
        getStyles(),
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg border font-bold text-sm mr-4 shrink-0 transition-colors",
          getLetterStyles(),
        )}
      >
        {letter}
      </div>
      <span className="flex-1 text-base">{text}</span>
    </button>
  );
}
