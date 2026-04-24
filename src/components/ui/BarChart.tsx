"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface BarChartItem {
  label: string;
  valueA: number;
  valueB: number;
  confidenceA?: number;
  confidenceB?: number;
  description?: string;
}

interface BarChartProps {
  data: BarChartItem[];
  className?: string;
}

export function BarChart({ data, className }: BarChartProps) {
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const maxValue = 100;

  return (
    <div className={cn("space-y-10", className)}>
      {data.map((item, i) => {
        const confA = item.confidenceA ?? 100;
        const confB = item.confidenceB ?? 100;
        const isLowConf = confA < 70 || confB < 70;

        return (
          <div 
            key={item.label} 
            className="group space-y-4 relative"
            onMouseEnter={() => setActiveItem(i)}
            onMouseLeave={() => setActiveItem(null)}
          >
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-[0.3em] transition-colors duration-300",
                  activeItem === i ? "text-primary" : "text-zinc-500"
                )}>
                  {item.label}
                </span>
                {isLowConf && (
                  <AlertCircle className="w-3 h-3 text-amber-500/50" />
                )}
              </div>
              <div className="flex gap-5 text-[10px] font-black items-center">
                <div className="flex flex-col items-end">
                  <span className="text-primary tracking-widest leading-none">{item.valueA}%</span>
                  <span className="text-[7px] text-primary/40 uppercase tracking-tighter">Loc 1</span>
                </div>
                <span className="text-zinc-700 font-bold">/</span>
                <div className="flex flex-col items-start">
                  <span className="text-white tracking-widest leading-none">{item.valueB}%</span>
                  <span className="text-[7px] text-white/30 uppercase tracking-tighter">Loc 2</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {/* Bar A */}
              <div className="relative h-2 w-full bg-white/[0.02] rounded-full overflow-hidden">
                 {/* Confidence Mask/Texture for Loc 1 */}
                 {confA < 80 && (
                   <div 
                     className="absolute inset-0 opacity-30 z-10 pointer-events-none" 
                     style={{ 
                       backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.5) 5px, rgba(0,0,0,0.5) 10px)` 
                     }} 
                   />
                 )}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.valueA / maxValue) * 100}%` }}
                  transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "h-full bg-gradient-to-r from-primary/20 to-primary shadow-[0_0_20px_rgba(255,184,0,0.15)]",
                    confA < 60 && "opacity-50 grayscale-[0.5]"
                  )}
                />
              </div>

              {/* Bar B */}
              <div className="relative h-1.5 w-full bg-white/[0.01] rounded-full overflow-hidden">
                {/* Confidence Mask for Loc 2 */}
                {confB < 80 && (
                   <div 
                     className="absolute inset-0 opacity-30 z-10 pointer-events-none" 
                     style={{ 
                       backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(0,0,0,0.3) 5px, rgba(0,0,0,0.3) 10px)` 
                     }} 
                   />
                 )}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.valueB / maxValue) * 100}%` }}
                  transition={{ duration: 1.2, delay: i * 0.1 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "h-full bg-white/20",
                    confB < 60 && "opacity-30"
                  )}
                />
              </div>
            </div>

            {/* Hover description */}
            <AnimatePresence>
              {activeItem === i && item.description && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="absolute -left-4 top-1/2 -translate-x-full -translate-y-1/2 w-48 p-3 bg-black/80 backdrop-blur-md border border-white/5 rounded-lg hidden xl:block"
                >
                  <p className="text-[9px] text-zinc-400 leading-relaxed italic">
                    &ldquo;{item.description}&rdquo;
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Legend */}
      <div className="pt-8 flex items-center justify-between border-t border-white/5">
        <div className="flex gap-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Location Alpha</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Location Beta</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.02] border border-white/5">
          <div className="w-1 h-1 rounded-full bg-amber-500/50" />
          <span className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest">Confidence Indicators Enabled</span>
        </div>
      </div>
    </div>
  );
}
