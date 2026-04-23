"use client";

import { cn } from "@/lib/utils";

interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
  className?: string;
  icon?: React.ReactNode;
}

export function GlassBadge({ children, variant = "primary", className, icon }: GlassBadgeProps) {
  const variants = {
    primary: "bg-primary/10 border-primary/20 text-primary shadow-[0_0_10px_rgba(255,184,0,0.1)]",
    secondary: "bg-zinc-800/50 border-zinc-700/50 text-zinc-400",
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]",
    warning: "bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.1)]",
    error: "bg-red-500/10 border-red-500/20 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]",
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[9px] font-black tracking-wider uppercase",
      variants[variant],
      className
    )}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </div>
  );
}
