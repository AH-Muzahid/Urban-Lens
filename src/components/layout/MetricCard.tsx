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
      case "High": return "bg-emerald-400";
      case "Medium": return "bg-[#E5B152]";
      case "Low": return "bg-red-400";
      default: return "bg-zinc-500";
    }
  };

  const getStatusPillColor = (status: string) => {
    switch (status) {
      case "High": return "bg-emerald-500/10 text-emerald-400";
      case "Medium": return "bg-[#E5B152]/10 text-[#E5B152]";
      case "Low": return "bg-red-500/10 text-red-400";
      default: return "bg-zinc-500/10 text-zinc-400";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: (index || 0) * 0.1 }}
      className="rounded-xl border border-white/[0.08] bg-[#0A0E17] p-5 overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-4">
        {isWalkability && <Activity className="w-4 h-4 text-[#E5B152]" />}
        {isGreenspace && <TreeDeciduous className="w-4 h-4 text-emerald-400" />}
        {isTransit && <TrainFront className="w-4 h-4 text-blue-400" />}
        {isDensity && <Target className="w-4 h-4 text-purple-400" />}
        {!isWalkability && !isGreenspace && !isTransit && !isDensity && <Database className="w-4 h-4 text-[#E5B152]" />}
        <span className="text-xs font-bold text-[#E5B152] uppercase tracking-wider">{title}</span>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-4xl font-semibold text-white">{value}</span>
        {title === "WALKABILITY" && <span className="text-lg text-gray-300">amenities</span>}
      </div>

      <p className="text-sm text-gray-400 mb-4">{subtext}</p>
      
      <div className="h-px bg-white/[0.08] w-full mb-4" />

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", getStatusColor(availability))} />
            <span className="text-sm text-gray-300">Data coverage</span>
          </div>
          <span className={cn("text-xs font-medium px-2.5 py-0.5 rounded-full", getStatusPillColor(availability))}>
            {availability}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", getStatusColor(confidence))} />
            <span className="text-sm text-gray-300">Confidence</span>
          </div>
          <span className={cn("text-xs font-medium px-2.5 py-0.5 rounded-full", getStatusPillColor(confidence))}>
            {confidence}
          </span>
        </div>
      </div>

      <button 
        onClick={() => setExpanded(!expanded)} 
        className="text-sm text-gray-400 hover:text-gray-300 flex items-center gap-1 transition-colors"
      >
        Show details
        <ChevronDown className={cn("w-4 h-4 transition-transform", expanded && "rotate-180")} />
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sources</p>
                <div className="flex flex-wrap gap-2">
                  {details.sources.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-white/[0.03] border border-white/[0.05] rounded text-gray-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Methodology</p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {details.method}
                </p>
              </div>

              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded flex gap-3">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200 leading-relaxed">
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
