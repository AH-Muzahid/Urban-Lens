"use client";

import { cn } from "@/lib/utils";

interface GlassDividerProps {
  className?: string;
  gradient?: boolean;
}

export function GlassDivider({ className, gradient = true }: GlassDividerProps) {
  return (
    <div className={cn(
      "h-[1px] w-full",
      gradient ? "bg-gradient-to-r from-transparent via-zinc-800 to-transparent" : "bg-zinc-800/50",
      className
    )} />
  );
}
