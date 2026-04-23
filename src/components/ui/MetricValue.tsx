"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MetricValueProps {
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function MetricValue({ 
  value, 
  unit, 
  trend, 
  trendValue, 
  className, 
  size = "md" 
}: MetricValueProps) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-6xl",
  };

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <div className="flex items-baseline gap-1.5">
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn("font-black tracking-tighter text-white", sizes[size])}
        >
          {value}
        </motion.span>
        {unit && (
          <span className="text-zinc-500 text-xs font-medium uppercase tracking-widest">
            {unit}
          </span>
        )}
      </div>
      
      {trend && trendValue && (
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider",
          trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-zinc-500"
        )}>
          <span>{trend === "up" ? "↑" : trend === "down" ? "↓" : "•"}</span>
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}
