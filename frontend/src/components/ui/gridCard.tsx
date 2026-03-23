import type React from "react";
import { cn } from "@/src/lib/utils";
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
        "flex items-center justify-center min-w-12 min-h-12 px-4 py-2 bg-white rounded-xl border-2 text-base font-medium transition-all shadow-sm",
        isSelected
          ? "border-blue-500 text-blue-700 bg-blue-50"
          : "border-[#E5E5E5] text-gray-800 hover:border-blue-400 hover:bg-gray-50",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
