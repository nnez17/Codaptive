import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface LabeledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  showPasswordToggle?: boolean;
  maxLengthDisplay?: number;
  error?: boolean;
  required?: boolean;
}

const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(
  (
    {
      className,
      label,
      type,
      showPasswordToggle,
      maxLengthDisplay,
      error,
      required,
      value,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const actualType = isPassword && showPassword ? "text" : type;

    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full">
        <div className="relative group">
          {/* Labeled Border Container */}
          <div
            className={cn(
              "relative border rounded-xl transition-all duration-200 bg-background",
              error
                ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.1)]"
                : "border-border group-within:border-primary group-within:ring-1 group-within:ring-primary/20",
            )}
          >
            {/* Label - Floating on the border */}
            <label
              htmlFor={props.id || label}
              className="absolute -top-2.5 left-4 bg-background px-1.5 text-xs font-medium text-muted-foreground"
            >
              {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className="flex items-center px-4 py-3 min-h-[56px]">
              <input
                ref={ref}
                id={props.id || label}
                type={actualType}
                className={cn(
                  "flex-1 bg-transparent border-none p-0 text-foreground placeholder:text-muted-foreground focus:ring-0 text-base sm:text-lg font-medium outline-none",
                  className,
                )}
                value={value}
                {...props}
              />

              {isPassword && showPasswordToggle && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>

          {maxLengthDisplay !== undefined && (
            <div className="flex justify-end mt-1 px-1">
              <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                {charCount}/{maxLengthDisplay}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  },
);

LabeledInput.displayName = "LabeledInput";

export { LabeledInput };
