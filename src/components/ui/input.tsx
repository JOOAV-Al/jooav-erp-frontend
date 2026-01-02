// import * as React from "react";
// import { cn } from "@/lib/utils";

// function Input({ className, type, ...props }: React.ComponentProps<"input">) {
//   return (
//     <input
//       type={type}
//       data-slot="input"
//       className={cn(
//         // Base styles
//         "w-full min-w-0 h-11.25 rounded-md bg-white border border-transparent",
//         "px-main py-md text-base outline-none leading-20",
//         "placeholder:text-card-body placeholder:text-body",
//         "border border-transparent",

//         // Shadow from design system
//         "shadow-input focus-visible:shadow-input",

//         // Transitions
//         "transition-[color,box-shadow]",

//         // Focus state
//         "focus-visible:bg-background",

//         // Error state
//         // "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",

//         // Disabled state
//         "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",

//         // File input styles
//         "file:inline-flex file:h-7 file:border-0 file:bg-transparent",
//         "file:text-sm file:font-medium file:text-foreground",

//         // Selection
//         "selection:bg-primary selection:text-primary-foreground",

//         className
//       )}
//       {...props}
//     />
//   );
// }

// export { Input };


import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, ...props }, ref) => {
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
            "w-full min-w-0 h-11.25 rounded-md bg-white border border-transparent",
            "py-md text-base outline-none leading-20",
            "placeholder:text-card-body placeholder:text-body",
            "border border-transparent",

            // Dynamic padding based on icons
            // Logic: Base padding is 16px (px-main)
            // With left icon: 12px (pl-3) + 4px wrapper padding + icon width = total left space
            // The pl-12 (48px) gives us: 12px + 4px padding + ~20px icon + 12px text offset = flush at 16px from wrapper edge
            hasLeftIcon && !hasRightIcon && "pl-10 pr-main",
            !hasLeftIcon && hasRightIcon && "pl-main pr-10",
            hasLeftIcon && hasRightIcon && "pl-10 pr-10",
            !hasLeftIcon && !hasRightIcon && "px-main",

            // Shadow from design system
            "shadow-input focus-visible:shadow-input",

            // Transitions
            "transition-[color,box-shadow]",

            // Focus state
            "focus-visible:bg-background",

            // Disabled state
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",

            // File input styles
            "file:inline-flex file:h-7 file:border-0 file:bg-transparent",
            "file:text-sm file:font-medium file:text-foreground",

            // Selection
            "selection:bg-primary selection:text-primary-foreground",

            className
          )}
          {...props}
        />

        {/* Right Icon Wrapper - 4px padding */}
        {hasRightIcon && (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-auto">
            <div className="p-1 flex items-center justify-center">
              {rightIcon}
            </div>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };