"use client";

import { MetricCard } from "./MetricCard";
import { useDashboard } from "@/context/DashboardContext";
import { Search, MapPin, Info, AlertCircle, Globe, GitCompare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { StatusGlow } from "@/components/ui/StatusGlow";
import { MetricValue } from "@/components/ui/MetricValue";
import { GlassDivider } from "@/components/ui/GlassDivider";
import { RadarChart } from "@/components/ui/RadarChart";
import { UrbanButton } from "@/components/ui/UrbanButton";

export function Sidebar() {
  const { metrics, loading, addToComparison } = useDashboard();

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
    <aside className="w-[380px] border-r border-zinc-800 bg-[#0B0F17] flex flex-col overflow-hidden shrink-0 z-10">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        
        {/* Area Overview - Dominant Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative rounded-3xl bg-gradient-to-br from-zinc-900/50 to-black/50 border border-white/5 p-6 shadow-2xl overflow-hidden group backdrop-blur-xl"
        >
          {/* Animated background glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-all duration-700" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <GlassBadge variant="primary" icon={<Globe className="w-2.5 h-2.5" />}>
                Active Session
              </GlassBadge>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-zinc-700" />)}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-zinc-500 mb-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Location Profile</span>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tighter leading-[0.9] mb-4 drop-shadow-2xl">
                  {loading ? (
                    <span className="inline-block w-48 h-10 bg-white/5 animate-pulse rounded-lg" />
                  ) : (
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
                      {metrics?.metadata.locationName || "Central District"}
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-2">
                  <StatusGlow status="success" />
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                    Benchmarked Engine Active
                  </span>
                </div>
              </div>
              
              {!loading && metrics && (
                <div className="flex flex-col items-end gap-4">
                  <div className="scale-110 origin-right">
                    <RadarChart 
                      size={90} 
                      data={[
                        { label: "W", value: metrics.walkability.score },
                        { label: "G", value: metrics.greenspace.score },
                        { label: "D", value: metrics.density.score },
                      ]} 
                    />
                  </div>
                  <UrbanButton 
                    variant="ghost" 
                    size="sm"
                    onClick={() => addToComparison(metrics)}
                    className="h-8 text-[10px] font-black tracking-widest bg-primary/5 border-primary/10 hover:bg-primary/20"
                    icon={<GitCompare className="w-3 h-3" />}
                  >
                    COMPARE
                  </UrbanButton>
                </div>
              )}

            </div>

            <GlassDivider gradient={false} className="opacity-50" />

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 transition-all hover:bg-white/[0.06] hover:border-white/10">
                <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.15em] mb-3">Confidence</span>
                <MetricValue 
                  value={metrics?.metadata.confidence === "High" ? "98" : metrics?.metadata.confidence === "Medium" ? "72" : "45"} 
                  unit="%" 
                  size="sm"
                  trend={metrics?.metadata.confidence === "High" ? "up" : "neutral"}
                  trendValue="Optimal"
                />
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 transition-all hover:bg-white/[0.06] hover:border-white/10">
                <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.15em] mb-3">Coverage</span>
                <MetricValue 
                  value={metrics?.metadata.coverage || 0} 
                  unit="%" 
                  size="sm"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metrics Section Header */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <h3 className="text-[10px] font-black text-white tracking-[0.3em] uppercase">Core Indices</h3>
            <GlassDivider className="w-12" gradient={true} />
          </div>
          <button className="text-zinc-500 hover:text-white transition-colors">
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Metrics List */}
        <div className={`space-y-4 transition-all duration-500 ${loading ? 'opacity-40 blur-[2px] pointer-events-none' : 'opacity-100'}`}>
          <AnimatePresence mode="popLayout">
            {metrics ? (
              <div className="space-y-4">
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

                <MetricCard 
                  index={3}
                  title="Building Density" 
                  value={metrics.density.label} 
                  subtext={metrics.density.subtext}
                  availability={metrics.density.value > 50 ? "High" : "Low"} 
                  confidence={metrics.metadata.confidence}
                  details={metrics.density.details}
                />
              </div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Warning / Notes */}
        {!loading && metrics && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-3"
          >
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-500/80 leading-relaxed font-bold uppercase tracking-widest">
              Note: Estimates are based on OSM data heuristics. Research-grade validation pending.
            </p>
          </motion.div>
        )}
      </div>
    </aside>
  );
}
