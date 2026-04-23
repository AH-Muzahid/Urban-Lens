"use client";

import { cn } from "@/lib/utils";

interface StatusGlowProps {
  status: "success" | "warning" | "error" | "info";
  className?: string;
  pulse?: boolean;
}

export function StatusGlow({ status, className, pulse = true }: StatusGlowProps) {
  const colors = {
    success: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
    warning: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
    error: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]",
    info: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]",
  };

  return (
    <div className={cn("relative flex h-2 w-2", className)}>
      {pulse && (
        <span className={cn(
          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
          status === "success" && "bg-emerald-400",
          status === "warning" && "bg-amber-400",
          status === "error" && "bg-red-400",
          status === "info" && "bg-blue-400"
        )} />
      )}
      <span className={cn("relative inline-flex rounded-full h-2 w-2", colors[status])} />
    </div>
  );
}
