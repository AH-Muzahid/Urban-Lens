"use client";

import { useState } from "react";
import { ChevronDown, AlertTriangle, ShieldCheck, Activity, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { StatusGlow } from "@/components/ui/StatusGlow";
import { MetricValue } from "@/components/ui/MetricValue";
import { GlassDivider } from "@/components/ui/GlassDivider";

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

  const getVariant = (level: string) => {
    switch (level) {
      case "High": return "success";
      case "Medium": return "warning";
      case "Low": return "error";
      default: return "secondary";
    }
  };

  const getStatusColor = (level: string) => {
    switch (level) {
      case "High": return "text-emerald-400";
      case "Medium": return "text-amber-400";
      case "Low": return "text-red-400";
      default: return "text-zinc-500";
    }
  };

  return (
    <PremiumCard 
      index={index}
      className={cn(expanded ? "ring-1 ring-primary/20" : "")}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <StatusGlow status="success" pulse={true} />
              <h3 className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">{title}</h3>
            </div>
            
            <MetricValue 
              value={value} 
              unit={subtext} 
              size="md"
            />
          </div>
          
          <GlassBadge 
            variant={getVariant(confidence)} 
            icon={<ShieldCheck className="w-2.5 h-2.5" />}
          >
            {confidence} Trust
          </GlassBadge>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-black/20 rounded-xl p-2.5 border border-white/5">
            <div className="flex items-center gap-1.5 mb-1">
              <Database className="w-3 h-3 text-zinc-500" />
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Coverage</span>
            </div>
            <div className={cn("text-xs font-black tracking-wide", getStatusColor(availability))}>
              {availability.toUpperCase()}
            </div>
          </div>
          <div className="bg-black/20 rounded-xl p-2.5 border border-white/5">
            <div className="flex items-center gap-1.5 mb-1">
              <Activity className="w-3 h-3 text-zinc-500" />
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Reliability</span>
            </div>
            <div className={cn("text-xs font-black tracking-wide", getStatusColor(confidence))}>
              {confidence === "High" ? "OPTIMAL" : confidence === "Medium" ? "MODERATE" : "VOLATILE"}
            </div>
          </div>
        </div>

        <button 
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2 rounded-lg bg-white/[0.03] border border-white/5 text-[10px] font-bold text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2 group/btn"
        >
          {expanded ? "COLLAPSE AUDIT" : "VIEW DATA AUDIT"} 
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-3 h-3" />
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <GlassDivider gradient={false} />
            <div className="px-5 pb-5 pt-0 mt-0">
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-zinc-100 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1 h-3 bg-primary rounded-full" />
                    Data Sources
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {details.sources.map((s, i) => (
                      <span key={i} className="px-2 py-1 bg-white/[0.03] rounded border border-white/5 text-[9px] text-zinc-400 font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-zinc-100 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1 h-3 bg-zinc-500 rounded-full" />
                    Computation Method
                  </p>
                  <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
                    {details.method}
                  </p>
                </div>

                <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/10 space-y-2">
                  <p className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" />
                    Technical Constraints
                  </p>
                  <p className="text-[10px] text-red-400/70 leading-relaxed font-medium italic">
                    {details.limitations}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PremiumCard>
  );
}
