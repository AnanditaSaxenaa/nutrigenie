import * as React from "react"
import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Theming with HSL vars
        "bg-[hsl(var(--input))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))]",
        "placeholder:text-[hsl(var(--muted-foreground))]",
        "file:text-[hsl(var(--foreground))]",
        "selection:bg-[hsl(var(--primary))] selection:text-[hsl(var(--primary-foreground))]",

        // Base input style
        "flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none",
        "border bg-transparent dark:bg-input/30 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",

        // Focus and error states
        "focus-visible:border-[hsl(var(--ring))] focus-visible:ring-[hsl(var(--ring))]/50 focus-visible:ring-[3px]",
        "aria-invalid:border-[hsl(var(--destructive))] aria-invalid:ring-[hsl(var(--destructive))]/20 dark:aria-invalid:ring-[hsl(var(--destructive))]/40",

        className
      )}
      {...props}
    />
  );
}

export { Input };
