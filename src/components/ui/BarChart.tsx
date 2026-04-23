"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BarChartProps {
  data: {
    label: string;
    valueA: number;
    valueB: number;
  }[];
  className?: string;
}

export function BarChart({ data, className }: BarChartProps) {
  const maxValue = 100;

  return (
    <div className={cn("space-y-8", className)}>
      {data.map((item, i) => (
        <div key={item.label} className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
              {item.label}
            </span>
            <div className="flex gap-4 text-[10px] font-black">
              <span className="text-primary tracking-widest">{item.valueA}%</span>
              <span className="text-zinc-600 tracking-widest">vs</span>
              <span className="text-white tracking-widest">{item.valueB}%</span>
            </div>
          </div>
          
          <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden flex relative">
            {/* Grid markers */}
            <div className="absolute inset-0 flex justify-between pointer-events-none px-0.5">
              {[0, 25, 50, 75, 100].map((m) => (
                <div key={m} className="w-[1px] h-full bg-white/5" />
              ))}
            </div>

            {/* Bars */}
            <div className="relative w-full h-full flex flex-col justify-center gap-[1px]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(item.valueA / maxValue) * 100}%` }}
                transition={{ duration: 1, delay: i * 0.1, ease: "circOut" }}
                className="h-full bg-primary/40 border-r border-primary shadow-[0_0_15px_rgba(255,184,0,0.2)]"
              />
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(item.valueB / maxValue) * 100}%` }}
                transition={{ duration: 1, delay: i * 0.1 + 0.2, ease: "circOut" }}
                className="h-full bg-white/10 border-r border-white/30"
              />
            </div>
          </div>
        </div>
      ))}
      
      {/* Legend */}
      <div className="pt-4 flex justify-center gap-8 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest text-primary">Location 1</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/30" />
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest text-white">Location 2</span>
        </div>
      </div>
    </div>
  );
}
