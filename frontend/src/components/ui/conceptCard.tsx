import type React from "react";
import { cn } from "@/lib/utils";

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
        "flex flex-col items-start p-6 rounded-3xl bg-card border border-border shadow-sm w-full transition-all hover:shadow-md",
        className,
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-base text-muted-foreground leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}
