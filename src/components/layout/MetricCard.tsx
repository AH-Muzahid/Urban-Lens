"use client";

import { useState } from "react";
import { Activity, Database, ChevronDown, Target, TreeDeciduous, TrainFront, Fingerprint, Info, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  index?: number;
  title: string;
  value: string;
  subtext?: string;
  availability: "High" | "Medium" | "Low" | "Unknown";
  confidence: "High" | "Medium" | "Low";
  details: {
    sources: string[];
    method: string;
    limitations: string;
  };
}

export function MetricCard({ index, title, value, subtext, availability, confidence, details }: MetricCardProps) {
  const [expanded, setExpanded] = useState(false);

  const isWalkability = title.toUpperCase().includes("WALKABILITY");
  const isGreenspace = title.toUpperCase().includes("GREENSPACE");
  const isDensity = title.toUpperCase().includes("DENSITY");
  const isTransit = title.toUpperCase().includes("TRANSIT");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "High": return "bg-emerald-500";
      case "Medium": return "bg-amber-500";
      case "Low": return "bg-red-500";
      default: return "bg-zinc-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "High": return "text-emerald-500";
      case "Medium": return "text-amber-500";
      case "Low": return "text-red-500";
      default: return "text-zinc-500";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: (index || 0) * 0.1 }}
      className="group/card relative rounded-sm border border-white/[0.04] bg-[#0D1117]/40 p-6 transition-all duration-500 hover:border-[#E5B152]/30 hover:bg-[#0D1117]/80 overflow-hidden"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#E5B152_1px,transparent_1px)] [background-size:16px_16px]" />
      
      {/* Scanning Light Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000">
        <motion.div 
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-full h-32 bg-gradient-to-b from-transparent via-[#E5B152]/[0.05] to-transparent"
        />
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/[0.1] group-hover/card:border-[#E5B152]/40 transition-colors" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/[0.1] group-hover/card:border-[#E5B152]/40 transition-colors" />

      {/* Icon and Title */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-9 h-9 rounded-sm flex items-center justify-center transition-all duration-500 group-hover/card:scale-110 border border-white/[0.05] group-hover/card:border-[#E5B152]/30",
            isWalkability ? "text-amber-500 bg-amber-500/5" :
            isGreenspace ? "text-emerald-500 bg-emerald-500/5" :
            isTransit ? "text-blue-500 bg-blue-500/5" :
            "text-[#E5B152] bg-[#E5B152]/5"
          )}>
            {isWalkability && <Activity className="w-4 h-4" />}
            {isGreenspace && <TreeDeciduous className="w-4 h-4" />}
            {isTransit && <TrainFront className="w-4 h-4" />}
            {isDensity && <Target className="w-4 h-4" />}
            {!isWalkability && !isGreenspace && !isTransit && !isDensity && <Database className="w-4 h-4" />}
          </div>
          <div className="flex flex-col">
            <h3 className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase group-hover/card:text-white transition-colors">{title}</h3>
            {index && <span className="text-[8px] font-mono text-zinc-700 tracking-wider uppercase">UNIT-0{index} {" // "} SYST-SEC-0{index}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#E5B152]/20 group-hover/card:bg-[#E5B152] transition-all animate-pulse" />
          <span className="text-[7px] font-black text-zinc-800 group-hover/card:text-zinc-600 uppercase tracking-widest transition-colors font-mono">STABLE</span>
        </div>
      </div>

      {/* Value and Unit */}
      <div className="flex items-baseline gap-4 mb-10 relative z-10">
        <span className="text-5xl font-black text-white tracking-tighter leading-none group-hover/card:text-[#E5B152] transition-colors duration-500">
          {value}
        </span>
        {subtext && (
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] group-hover/card:text-zinc-400 transition-colors">{subtext}</span>
            <div className="h-[2px] w-full bg-white/[0.05] mt-1 group-hover/card:bg-[#E5B152]/20 transition-all overflow-hidden">
               <motion.div 
                 initial={{ x: "-100%" }}
                 animate={{ x: "0%" }}
                 className="h-full w-full bg-[#E5B152]/40"
               />
            </div>
          </div>
        )}
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-2 gap-4 mb-8 border-t border-white/[0.03] pt-8 relative z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className={cn("w-1 h-1 rounded-full", getStatusColor(availability))} />
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Coverage</span>
          </div>
          <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] font-mono", getStatusText(availability))}>
            {availability}
          </span>
        </div>
        <div className="flex flex-col gap-2 pl-4 border-l border-white/[0.03]">
          <div className="flex items-center gap-2">
            <div className={cn("w-1 h-1 rounded-full", getStatusColor(confidence))} />
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Trust Index</span>
          </div>
          <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] font-mono", getStatusText(confidence))}>
            {confidence}
          </span>
        </div>
      </div>

      {/* Show Details Toggle */}
      <button 
        onClick={() => setExpanded(!expanded)}
        className="group/toggle w-full pt-4 transition-all flex items-center justify-between relative z-10"
      >
        <span className="text-[10px] font-bold text-zinc-500 group-hover/toggle:text-white transition-colors uppercase tracking-[0.2em]">
          {expanded ? "Hide details" : "Show details"}
        </span>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-zinc-700 group-hover/toggle:text-[#E5B152] transition-colors" />
        </motion.div>
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden relative z-10"
          >
            <div className="pt-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-3.5 h-3.5 text-[#E5B152]/30" />
                  <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em]">Neural Sources</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {details.sources.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2 bg-white/[0.01] border border-white/[0.03] rounded-sm group/source">
                      <div className="w-1 h-1 rounded-full bg-[#E5B152]/20 group-hover/source:bg-[#E5B152] transition-colors" />
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#E5B152]/30" />
                  <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em]">Heuristic Path</p>
                </div>
                <p className="text-[10px] text-zinc-400 font-bold leading-relaxed uppercase tracking-wider italic bg-white/[0.01] p-3 border border-dashed border-white/[0.05] rounded-sm">
                  {details.method}
                </p>
              </div>

              <div className="p-5 bg-[#E5B152]/[0.02] border border-[#E5B152]/10 flex gap-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[1px] h-full bg-[#E5B152]/30" />
                <Info className="w-4 h-4 text-[#E5B152]/40 shrink-0 mt-0.5" />
                <p className="text-[9px] text-[#E5B152]/70 leading-relaxed font-black uppercase tracking-widest">
                  {details.limitations}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
