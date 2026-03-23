import type React from "react";
import { cn } from "@/src/lib/utils";
import { X, Check } from "lucide-react";
import { Button } from "./button";

interface FeedbackSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "correct" | "incorrect";
  message?: string;
  onContinue?: () => void;
  continueText?: string;
}

export function FeedbackSheet({
  status,
  message,
  onContinue,
  continueText = "CONTINUE",
  className,
  ...props
}: FeedbackSheetProps) {
  const isCorrect = status === "correct";

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300",
        isCorrect ? "bg-[#EBFAEA]" : "bg-[#FDF2F2]",
        className,
      )}
      {...props}
    >
      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
              isCorrect ? "bg-white" : "bg-white",
            )}
          >
            {isCorrect ? (
              <Check className="w-6 h-6 text-[#4CAF50] stroke-[4px]" />
            ) : (
              <X className="w-6 h-6 text-[#F44336] stroke-[4px]" />
            )}
          </div>
          <div className="flex flex-col">
            <h3
              className={cn(
                "text-xl font-black",
                isCorrect ? "text-[#4CAF50]" : "text-[#F44336]",
              )}
            >
              {isCorrect ? "Correct" : "Incorrect"}
            </h3>
            {message && (
              <p
                className={cn(
                  "text-sm font-bold",
                  isCorrect ? "text-[#4CAF50]/80" : "text-[#F44336]/80",
                )}
              >
                {message}
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={onContinue}
          className="w-full sm:w-[180px] h-12 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-black text-sm tracking-widest shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
        >
          {continueText}
        </Button>
      </div>
    </div>
  );
}
