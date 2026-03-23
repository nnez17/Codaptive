import type React from "react";
import { useMemo, useId } from "react";
import { cn } from "@/src/lib/utils";

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  output?: string;
  showWindowControls?: boolean;
}

export function CodeBlock({
  code,
  language = "python",
  showLineNumbers = true,
  output,
  showWindowControls = true,
  className,
  ...props
}: CodeBlockProps) {
  const blockId = useId();

  const parsedLines = useMemo(() => {
    return code
      .trim()
      .split("\n")
      .map((line, lineIdx) => ({
        id: `${blockId}-line-${lineIdx}`,
        number: lineIdx + 1,
        parts: line
          .split(/(print|var|\d+|def|class|return|=|\+|\-)/g)
          .map((part, partIdx) => ({
            id: `${blockId}-line-${lineIdx}-part-${partIdx}`,
            text: part,
          })),
      }));
  }, [code, blockId]);

  return (
    <div
      className={cn(
        "flex flex-col w-full bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg border border-[#333333]",
        className,
      )}
      {...props}
    >
      {/* Window Controls (macOS style) */}
      {showWindowControls && (
        <div className="flex px-4 py-3 items-center gap-2 border-b border-[#333333] bg-[#2d2d2d]">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
      )}

      {/* Code Area */}
      <div className="p-4 overflow-x-auto text-[14px] leading-relaxed font-mono">
        <table className="w-full border-spacing-0">
          <tbody>
            {parsedLines.map((line) => (
              <tr key={line.id}>
                {showLineNumbers && (
                  <td className="pr-4 select-none text-[#858585] text-right w-8 align-top">
                    {line.number}
                  </td>
                )}
                <td className="text-[#d4d4d4] whitespace-pre align-top">
                  {/* Basic syntax highlighting simulation, ideally use Prism or similar */}
                  {line.parts.map((part) => {
                    if (
                      ["print", "def", "class", "return", "var"].includes(
                        part.text,
                      )
                    ) {
                      return (
                        <span key={part.id} className="text-[#569cd6]">
                          {part.text}
                        </span>
                      );
                    }
                    if (/^\d+$/.test(part.text)) {
                      return (
                        <span key={part.id} className="text-[#b5cea8]">
                          {part.text}
                        </span>
                      );
                    }
                    if (["=", "+", "-"].includes(part.text)) {
                      return (
                        <span key={part.id} className="text-[#d4d4d4]">
                          {part.text}
                        </span>
                      );
                    }
                    return <span key={part.id}>{part.text}</span>;
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Output Console */}
      {output && (
        <div className="px-4 py-3 bg-[#111111] border-t border-[#333333] text-[#d4d4d4] font-mono text-sm">
          <span className="text-[#858585] mr-2">Output:</span>
          {output}
        </div>
      )}
    </div>
  );
}
