import type React from "react";

interface CodeWindowProps {
  filename?: string;
  children?: React.ReactNode;
  className?: string;
}

export function CodeWindow({
  filename = "main.py",
  children,
  className = "",
}: CodeWindowProps) {
  return (
    <div
      className={`relative flex flex-col items-start w-full max-w-[512px] bg-[#171717] rounded-3xl shadow-2xl overflow-hidden pointer-events-auto ${className}`}
      style={{
        border: "1px solid #262626",
        boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
        zIndex: 2,
      }}
    >
      {/* Window Bar */}
      <div className="flex flex-row items-center px-4 py-3 gap-2 w-full bg-[#262626] min-h-[41px]">
        <div className="w-3 h-3 bg-[#EF4444] rounded-full" />
        <div className="w-3 h-3 bg-[#EAB308] rounded-full" />
        <div className="w-3 h-3 bg-[#22C55E] rounded-full" />
        <div className="flex-1 flex pl-4 items-center justify-end md:justify-start">
          <span className="text-[#A3A3A3] font-mono text-xs leading-none order-last md:order-0 ml-auto md:ml-0">
            {filename}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col items-start p-6 pt-5 gap-4 w-full box-border">
        {children}
      </div>
    </div>
  );
}
