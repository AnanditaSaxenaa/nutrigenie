import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({ className, ...props }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // base styles
        "inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow]",
        "text-[hsl(var(--foreground))] dark:text-[hsl(var(--muted-foreground))]",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[hsl(var(--ring)/0.5)]",
        "disabled:pointer-events-none disabled:opacity-50",

        // active state styles
        "data-[state=active]:bg-[hsl(var(--background))] data-[state=active]:text-[hsl(var(--foreground))]",
        "data-[state=active]:shadow-sm data-[state=active]:border-[hsl(var(--border))]",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
