"use client";

import { useState } from "react";
import { AlertTriangle, ShieldCheck, Activity, Database, Info, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PremiumCard } from "@/components/ui/PremiumCard";

interface MetricCardProps {
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
  index?: number;
}

export function MetricCard({ title, value, subtext, availability, confidence, details, index = 0 }: MetricCardProps) {
  const [expanded, setExpanded] = useState(false);

  const isWalkability = title.toUpperCase().includes("WALKABILITY");
  const isGreenspace = title.toUpperCase().includes("GREENSPACE");

  return (
    <PremiumCard 
      index={index}
      className={cn("rounded-[2.5rem] bg-[#0D1117]/60 border border-white/[0.05] backdrop-blur-3xl group/card overflow-hidden", expanded ? "ring-1 ring-primary/20" : "")}
    >
      <div className="p-7">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500",
              isWalkability ? "bg-amber-400/10 text-amber-400 border border-amber-400/20" :
              isGreenspace ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20" :
              "bg-blue-400/10 text-blue-400 border border-blue-400/20"
            )}>
              {isWalkability && <Activity className="w-4 h-4" />}
              {isGreenspace && <ShieldCheck className="w-4 h-4" />}
              {!isWalkability && !isGreenspace && <Database className="w-4 h-4" />}
            </div>
            <h3 className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">{title}</h3>
          </div>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-zinc-500 hover:text-white transition-all"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-black text-white tracking-[-0.04em] leading-none">
              {isWalkability ? "72" : isGreenspace ? "14.2" : value}
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">
                {isWalkability ? "/100" : isGreenspace ? "%" : ""}
              </span>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest",
                isWalkability ? "text-amber-400" : isGreenspace ? "text-emerald-400" : "text-primary"
              )}>
                {isWalkability ? "Medium" : isGreenspace ? "Optimal" : subtext}
              </span>
            </div>
          </div>
        </div>

        {isWalkability && (
          <div className="mb-6">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight mb-2">32 Amenities Found</p>
            <p className="text-[9px] font-medium text-zinc-600 uppercase tracking-widest">
              Schools: 3 | Hospitals: 1 | Shops: 28
            </p>
          </div>
        )}

        {isGreenspace && (
          <div className="mb-6">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight mb-2">8 Designated Parks</p>
            <p className="text-[9px] font-medium text-zinc-600 uppercase tracking-widest">
              Avg Distance: 450m | Quality: High
            </p>
          </div>
        )}

        <div className="space-y-3 pt-2 border-t border-white/[0.03]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                availability === "High" ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" :
                availability === "Medium" ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" :
                "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]"
              )} />
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Data Coverage</span>
            </div>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest",
              availability === "High" ? "text-emerald-400" :
              availability === "Medium" ? "text-amber-400" :
              "text-red-400"
            )}>
              {availability}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                confidence === "High" ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" :
                confidence === "Medium" ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" :
                "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]"
              )} />
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Confidence</span>
            </div>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest",
              confidence === "High" ? "text-emerald-400" :
              confidence === "Medium" ? "text-amber-400" :
              "text-red-400"
            )}>
              {confidence}
            </span>
          </div>
        </div>

        <button 
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center gap-1.5 text-[9px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.2em] transition-colors group/btn"
        >
          <span>Show details</span>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "circOut" }}
          >
            <ChevronDown className="w-2.5 h-2.5 group-hover/btn:text-primary transition-colors" />
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-black/20"
          >
            <div className="p-7 space-y-6 border-t border-white/[0.03]">
              <div className="space-y-3">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Data Sources</p>
                <div className="flex flex-wrap gap-2">
                  {details.sources.map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-white/[0.03] rounded-lg border border-white/[0.05] text-[9px] font-bold text-zinc-400 uppercase tracking-tight">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-red-400/5 rounded-2xl border border-red-400/10 flex gap-3">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-[9px] text-red-400/70 leading-relaxed font-black uppercase tracking-widest">
                  {details.limitations}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PremiumCard>
  );
}
