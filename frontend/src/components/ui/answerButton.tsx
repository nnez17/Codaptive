import type React from "react";
import { cn } from "@/src/lib/utils";

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
      return "border-blue-500 bg-blue-50 text-blue-700";
    }
    return "border-[#E5E5E5] bg-white text-gray-800 hover:border-blue-300 hover:bg-blue-50/50";
  };

  const getLetterStyles = () => {
    if (status === "correct")
      return "bg-green-100 text-green-700 border-green-200";
    if (status === "incorrect") return "bg-red-100 text-red-700 border-red-200";
    if (isSelected) return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-gray-50 text-gray-500 border-gray-200";
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
