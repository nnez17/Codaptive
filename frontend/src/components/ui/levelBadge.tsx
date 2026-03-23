import type React from "react";
import { cn } from "@/src/lib/utils";

interface LevelBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function LevelBadge({
  title,
  subtitle,
  icon,
  className,
  ...props
}: LevelBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-4 bg-[#171717] rounded-2xl w-full max-w-sm text-white shadow-md border border-[#262626]",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col">
        {subtitle && (
          <span className="text-xs text-[#A3A3A3] font-medium tracking-wide uppercase mb-1">
            {subtitle}
          </span>
        )}
        <span className="text-lg font-bold">{title}</span>
      </div>
      {icon && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#EAB308]/20 text-[#EAB308]">
          {icon}
        </div>
      )}
    </div>
  );
}
