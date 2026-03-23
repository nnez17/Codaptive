import type React from "react";
import { cn } from "@/src/lib/utils";

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
        return "bg-[#F5F5F5] text-[#A3A3A3] border-transparent opacity-60 pointer-events-none";
      case "completed":
        return "bg-white text-gray-900 border-[#E5E5E5] hover:border-blue-400";
      case "current":
        return "bg-[#EFF6FF] text-blue-700 border-[#BFDBFE] hover:border-blue-400 shadow-sm";
      case "unlocked":
      default:
        return "bg-white text-gray-900 border-[#E5E5E5] hover:border-blue-400 shadow-sm";
    }
  };

  const getIconContainerStyles = () => {
    switch (status) {
      case "locked":
        return "bg-gray-200 text-gray-400";
      case "completed":
        return "bg-green-100 text-green-600";
      case "current":
        return "bg-blue-100 text-blue-600";
      case "unlocked":
      default:
        return "bg-gray-100 text-gray-600";
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
