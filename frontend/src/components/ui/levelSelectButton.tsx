import type React from "react";
import { cn } from "@/lib/utils";

interface LevelSelectButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  sublabel?: string;
  status?: "locked" | "unlocked" | "completed" | "current";
  icon?: React.ReactNode;
}

export function LevelSelectButton({
  label,
  sublabel,
  status = "unlocked",
  icon,
  className,
  ...props
}: LevelSelectButtonProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "locked":
        return "bg-muted text-muted-foreground/60 border-transparent opacity-60 pointer-events-none";
      case "completed":
        return "bg-card text-foreground border-border hover:border-primary/50";
      case "current":
        return "bg-primary/10 text-primary border-primary/30 hover:border-primary/60 shadow-sm";
      case "unlocked":
      default:
        return "bg-card text-foreground border-border hover:border-primary/50 shadow-sm";
    }
  };

  const getIconContainerStyles = () => {
    switch (status) {
      case "locked":
        return "bg-muted-foreground/20 text-muted-foreground/60";
      case "completed":
        return "bg-green-500/20 text-green-500";
      case "current":
        return "bg-primary/20 text-primary";
      case "unlocked":
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <button
      className={cn(
        "flex items-center gap-4 w-full p-4 rounded-2xl border-2 transition-all duration-200 ease-in-out text-left",
        getStatusStyles(),
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "shrink-0 flex items-center justify-center w-12 h-12 rounded-xl",
          getIconContainerStyles(),
        )}
      >
        {icon || <span className="text-lg font-bold">{label.charAt(0)}</span>}
      </div>

      <div className="flex flex-col grow text-left">
        <span className="font-semibold text-base">{label}</span>
        {sublabel && (
          <span className="text-sm opacity-80 mt-0.5">{sublabel}</span>
        )}
      </div>

      {/* Optional check/progress mark could go right here */}
    </button>
  );
}
