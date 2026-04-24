"use client";

import { MetricCard } from "./MetricCard";
import { useDashboard } from "@/context/DashboardContext";
import { Search, MapPin, Info, AlertCircle, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassDivider } from "@/components/ui/GlassDivider";

export function Sidebar() {
  const { metrics, loading } = useDashboard();

  if (!metrics && !loading) {
    return (
      <aside className="w-[380px] border-r border-zinc-800 bg-[#0B0F17] flex flex-col shrink-0 z-10 items-center justify-center p-12 text-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10"
        >
          <div className="w-20 h-20 bg-white/[0.03] rounded-3xl flex items-center justify-center mb-6 border border-white/5 shadow-2xl relative overflow-hidden group mx-auto">
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Search className="w-10 h-10 text-zinc-600 group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-xl font-black text-white mb-3 tracking-tight uppercase">Ready to Analyze</h3>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
            Select a location on the map<br/>to generate research-grade insights.
          </p>
        </motion.div>
      </aside>
    );
  }

  return (
    <aside className="w-[420px] bg-[#0B0F17]/40 backdrop-blur-3xl flex flex-col overflow-hidden shrink-0 z-10 border-r border-white/[0.03]">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
        
        {/* Area Overview - Dominant Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative rounded-[2.5rem] bg-[#0D1117]/60 border border-white/[0.05] p-8 shadow-2xl overflow-hidden group backdrop-blur-3xl"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">
                  Area Overview
                </span>
                <h2 className="text-3xl font-black text-white tracking-[-0.04em] leading-tight">
                  {loading ? (
                    <span className="inline-block w-48 h-8 bg-white/5 animate-pulse rounded-xl" />
                  ) : (
                    metrics?.metadata.locationName || "New York City, USA"
                  )}
                </h2>
                <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px] font-bold tracking-tight">
                  <span>40.7128° N, 74.0060° W</span>
                  <button className="p-1 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:text-white transition-colors">
                    <Bookmark className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
            </div>

            <GlassDivider className="mb-6 opacity-20" />

            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Data Coverage</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-primary">65%</span>
                  <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 uppercase tracking-tighter">Medium</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Overall Confidence</span>
                <span className="text-[9px] font-black text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20 uppercase tracking-tighter">Low</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Last Updated</span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Today, 10:32 AM</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metrics Section Header */}
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h3 className="text-[10px] font-black text-white tracking-[0.5em] uppercase opacity-60">Indices</h3>
            <div className="w-16 h-[1px] bg-gradient-to-r from-primary/40 to-transparent" />
          </div>
          <button className="text-zinc-600 hover:text-white transition-colors p-2 hover:bg-white/[0.05] rounded-xl">
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Metrics List */}
        <div className={`space-y-6 transition-all duration-700 ${loading ? 'opacity-40 blur-[4px] pointer-events-none translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <AnimatePresence mode="popLayout">
            {metrics ? (
              <div className="space-y-6 px-1">
                <MetricCard 
                  index={1}
                  title="Walkability Index" 
                  value={metrics.walkability.label} 
                  subtext={metrics.walkability.subtext}
                  availability={metrics.walkability.value > 10 ? "High" : "Medium"} 
                  confidence={metrics.metadata.confidence}
                  details={metrics.walkability.details}
                />
                
                <MetricCard 
                  index={2}
                  title="Greenspace Access" 
                  value={metrics.greenspace.label} 
                  subtext={metrics.greenspace.subtext}
                  availability={metrics.greenspace.value > 10 ? "High" : "Medium"} 
                  confidence={metrics.metadata.confidence}
                  details={metrics.greenspace.details}
                />
              </div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Bottom Alert */}
        {!loading && metrics && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 flex gap-4 backdrop-blur-md"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-[10px] text-amber-500/70 leading-relaxed font-bold uppercase tracking-[0.1em]">
              Precision Notice: Estimates are based on OSM heuristics. Research-grade validation recommended.
            </p>
          </motion.div>
        )}
      </div>
    </aside>
  );
}
