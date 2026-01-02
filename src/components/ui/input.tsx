import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        "w-full min-w-0 h-11.25 rounded-md bg-white border border-transparent",
        "px-main py-md text-base outline-none leading-20",
        "placeholder:text-card-body placeholder:text-body",
        "border border-transparent",

        // Shadow from design system
        "shadow-input focus-visible:shadow-input",

        // Transitions
        "transition-[color,box-shadow]",

        // Focus state
        "focus-visible:bg-background",

        // Error state
        // "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",

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
  );
}

export { Input };
