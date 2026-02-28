import * as React from "react";
import { cn } from "@/lib/utils";
// import { PenLine } from "lucide-react";

interface InputProps extends React.ComponentProps<"input"> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isEdit?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, isEdit=false, ...props }, ref) => {
    const hasLeftIcon = Boolean(leftIcon);
    const hasRightIcon = Boolean(rightIcon);

    return (
      <div className="relative w-full">
        {/* Left Icon Wrapper - 4px padding */}
        {hasLeftIcon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-auto">
            <div className="p-3 flex items-center justify-center">
              {leftIcon}
            </div>
          </div>
        )}

        <input
          ref={ref}
          type={type}
          data-slot="input"
          className={cn(
            // Base styles
            "w-full min-w-0 h-[48px] rounded-md bg-white border border-transparent",
            "py-md outline-none leading-normal tracking-[0.04em] text-body font-medium text-sm",
            "placeholder:text-card-body placeholder:text-body-passive",
            "border border-transparent",

            // Dynamic padding based on icons
            // Logic: Base padding is 16px (px-main)
            // With left icon: 12px (pl-3) + 4px wrapper padding + icon width = total left space
            // The pl-12 (48px) gives us: 12px + 4px padding + ~20px icon + 12px text offset = flush at 16px from wrapper edge
            hasLeftIcon && !hasRightIcon && "pl-12 pr-main",
            !hasLeftIcon && hasRightIcon && "pl-main pr-12",
            hasLeftIcon && hasRightIcon && "pl-10 pr-10",
            !hasLeftIcon && !hasRightIcon && "px-main",

            // Shadow from design system
            "shadow-input focus-visible:shadow-input",

            // Transitions
            "transition-[color,box-shadow]",

            // Focus state
            "focus-visible:bg-background",

            // Disabled state
            "disabled:bg-background disabled:text-body disabled:cursor-not-allowed disabled:pointer-events-none",

            // File input styles
            "file:inline-flex file:h-7 file:border-0 file:bg-transparent",
            "file:text-sm file:font-medium file:text-foreground",

            // Selection
            "selection:bg-primary selection:text-primary-foreground",

            className,
          )}
          {...props}
        />

        {/* Right Icon Wrapper - 4px padding */}
        {/* {hasRightIcon && (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-auto">
            <div className="p-1 flex items-center justify-center">
              {isEdit && <PenLine strokeWidth={2} className="h-5 w-5 text-outline-passive" />}
              {rightIcon}
            </div>
          </div>
        )} */}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };