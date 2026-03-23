import type React from "react";
import { cn } from "@/src/lib/utils";

interface ConceptCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function ConceptCard({
  title,
  description,
  icon,
  className,
  ...props
}: ConceptCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start p-6 rounded-3xl bg-white border border-[#E5E5E5] shadow-sm w-full transition-all hover:shadow-md",
        className,
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-base text-gray-600 leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}
