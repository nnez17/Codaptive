import type React from "react";
import { cn } from "@/lib/utils";
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
        "fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300 border-t border-border",
        isCorrect ? "bg-green-500/10" : "bg-destructive/10",
        className,
      )}
      {...props}
    >
      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-background border border-border shadow-sm",
            )}
          >
            {isCorrect ? (
              <Check className="w-6 h-6 text-green-500 stroke-[4px]" />
            ) : (
              <X className="w-6 h-6 text-destructive stroke-[4px]" />
            )}
          </div>
          <div className="flex flex-col">
            <h3
              className={cn(
                "text-xl font-black",
                isCorrect ? "text-green-500" : "text-destructive",
              )}
            >
              {isCorrect ? "Correct" : "Incorrect"}
            </h3>
            {message && (
              <p
                className={cn(
                  "text-sm font-bold",
                  isCorrect ? "text-green-500/80" : "text-destructive/80",
                )}
              >
                {message}
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={onContinue}
          className="w-full sm:w-[180px] h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm tracking-widest shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
        >
          {continueText}
        </Button>
      </div>
    </div>
  );
}
