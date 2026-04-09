import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface GridCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isSelected?: boolean;
}

export function GridCard({
  children,
  isSelected = false,
  className,
  ...props
}: GridCardProps) {
  return (
    <Button
      className={cn(
        "flex items-center justify-center min-w-12 min-h-12 px-4 py-2 bg-card rounded-xl border-2 text-base font-medium transition-all shadow-sm",
        isSelected
          ? "border-primary text-primary bg-primary/10"
          : "border-border text-foreground hover:border-primary/50 hover:bg-muted",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
