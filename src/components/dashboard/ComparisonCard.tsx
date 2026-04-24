"use client";

import { UrbanMetrics } from "@/types/metrics";
import { X, GitCompare, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ComparisonCardProps {
  metrics: UrbanMetrics | null;
  onRemove: () => void;
  index: number;
}

export function ComparisonCard({ metrics, onRemove, index }: ComparisonCardProps) {
  if (!metrics) {
    return (
      <div className="flex-1 min-w-[320px] h-[200px] rounded-[2.5rem] border border-white/[0.04] bg-white/[0.01] flex flex-col items-center justify-center p-8 group transition-all duration-700 hover:bg-white/[0.03] hover:border-[#E5B152]/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
        <div className="w-14 h-14 rounded-[1.8rem] border border-white/[0.08] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-[#E5B152]/30 transition-all duration-700 bg-white/[0.01]">
          <GitCompare className="w-6 h-6 text-zinc-800 group-hover:text-[#E5B152]/60 transition-colors duration-700" />
        </div>
        <p className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.6em] group-hover:text-zinc-600 transition-colors duration-700">Slot :: {index + 1}</p>
      </div>
    );
  }

  const avgScore = (metrics.walkability.score + (metrics.greenspace.value * 5) + (metrics.transit.score)) / 3;
  const grade = avgScore > 80 ? "A+" : avgScore > 60 ? "B" : "C";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 min-w-[320px] h-[200px] rounded-[2.5rem] border border-[#E5B152]/30 bg-[#06080C] p-8 relative group overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]"
    >
      {/* Texture Layer */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      
      {/* Glow Effect */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#E5B152]/10 rounded-full blur-[60px] group-hover:bg-[#E5B152]/20 transition-all duration-1000" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#E5B152]" />
              <span className="text-[9px] font-black text-[#E5B152] uppercase tracking-[0.6em]">Active Node</span>
            </div>
            <h4 className="text-lg font-black text-white tracking-tighter leading-tight truncate max-w-[200px]">
              {metrics.metadata.locationName}
            </h4>
          </div>
          <button 
            onClick={onRemove}
            className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-zinc-600 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-500 group/btn"
          >
            <X className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        <div className="flex-1 flex items-end justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-white tracking-tighter leading-none italic">
                {avgScore.toFixed(1)}
              </span>
              <span className="text-[10px] font-black text-[#E5B152] tracking-[0.4em] uppercase ml-2">PTS</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.6em]">Urban Index</span>
              <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/5 px-2 py-0.5 rounded-full border border-emerald-400/10">
                <ArrowUpRight className="w-3 h-3" />
                <span className="text-[9px] font-black">+2.4%</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.6em] mb-1">Grade</span>
              <span className="text-2xl font-black text-[#E5B152] tracking-tighter italic drop-shadow-[0_0_10px_rgba(229,177,82,0.4)]">{grade}</span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-2 h-8 rounded-full transition-all duration-700",
                    i <= 3 ? 'bg-[#E5B152] shadow-[0_0_15px_rgba(229,177,82,0.3)]' : 'bg-white/[0.04]'
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
