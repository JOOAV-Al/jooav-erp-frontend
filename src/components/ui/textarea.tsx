import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "bg-white border border-transparent placeholder:text-body-passive shadow-input focus-visible:shadow-input text-body leading-[1.5] tracking-[0.04em] font-medium placeholder:text-sm text-sm",
        "focus-visible:bg-background aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-22 w-full rounded-lg px-md py-md shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:gray-300 disabled:text-outline-passive/50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
