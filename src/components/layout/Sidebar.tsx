"use client";

import { MetricCard } from "./MetricCard";
import { useDashboard } from "@/context/DashboardContext";
import { Info, AlertCircle, GitCompare, Target, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PremiumCard } from "@/components/ui/PremiumCard";

export function Sidebar() {
  const { metrics, loading, addToComparison, comparisonMetrics, isSidebarOpen, setIsSidebarOpen } = useDashboard();

  if (!metrics && !loading) {
    return (
      <aside className={cn(
        "absolute left-20 top-4 bottom-4 bg-white/90 dark:bg-[#06080C]/90 backdrop-blur-xl shadow-[20px_0_50px_rgba(0,0,0,0.1)] dark:shadow-[20px_0_50px_rgba(0,0,0,0.6)] flex flex-col shrink-0 z-40 overflow-hidden transition-all duration-300 rounded-2xl border border-black/5 dark:border-white/[0.08]",
        isSidebarOpen ? "w-[300px] opacity-100" : "w-0 opacity-0 border-0"
      )}>
        <div className="w-[300px] min-w-[300px] h-full flex flex-col items-center justify-center p-12 text-center relative">
        {/* Close Button */}
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.08] flex items-center justify-center text-zinc-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors z-50"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#E5B152]/5 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Scanning Effect Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <motion.div 
            animate={{ y: ["0%", "100%", "0%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#facc15] to-transparent shadow-[0_0_15px_#facc15]"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10"
        >
          <div className="w-32 h-32 bg-black/[0.01] dark:bg-white/[0.01] rounded-sm flex items-center justify-center mb-12 border border-black/[0.05] dark:border-white/[0.05] shadow-2xl relative overflow-hidden group mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E5B152]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <Target className="w-14 h-14 text-zinc-300 dark:text-zinc-800 group-hover:text-[#facc15] dark:group-hover:text-[#facc15] transition-all duration-700 group-hover:scale-110" />
            
            {/* Corner Brackets */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-black/[0.05] dark:border-white/[0.05] group-hover:border-[#E5B152]/40 transition-colors" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-black/[0.05] dark:border-white/[0.05] group-hover:border-[#E5B152]/40 transition-colors" />
          </div>
          <h3 className="text-[14px] font-black text-black dark:text-white mb-6 tracking-[0.5em] uppercase italic">Neural Network Offline</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] leading-relaxed max-w-[300px] mx-auto opacity-50 font-mono">
            Initialize geographic node parameters to commence high-fidelity urban matrix analysis.
          </p>
        </motion.div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={cn(
      "absolute left-20 top-4 bottom-4 bg-[#0b1220]/95 backdrop-blur-xl shadow-[20px_0_50px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden shrink-0 z-40 transition-all duration-300 rounded-2xl border border-white/[0.08]",
      isSidebarOpen ? "w-[320px] opacity-100" : "w-0 opacity-0 border-0"
    )}>
      <div className="w-[320px] min-w-[320px] h-full flex flex-col relative">
      {/* Close Button */}
      <button 
        onClick={() => setIsSidebarOpen(false)}
        className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.08] flex items-center justify-center text-zinc-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors z-50"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Texture Layer */}
      <div className="absolute inset-0 opacity-[0.01] dark:opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.02] pointer-events-none bg-grid-black/[0.05] dark:bg-grid-white/[0.02] [background-size:24px_24px]" />
      
      {/* Global Scanning Line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03] z-50">
        <motion.div 
          animate={{ y: ["-10%", "110%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-full h-[20%] bg-gradient-to-b from-transparent via-[#facc15] to-transparent"
        />
      </div>

      {/* Decorative Corner Brackets for Entire Sidebar */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-black/[0.05] dark:border-white/[0.05] z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-black/[0.05] dark:border-white/[0.05] z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-black/[0.05] dark:border-white/[0.05] z-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-black/[0.05] dark:border-white/[0.05] z-20 pointer-events-none" />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2 relative z-10">
        
        {/* Area Overview Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Header Metadata Section */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0f172a] p-3 overflow-hidden relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#facc15] uppercase tracking-wider">Area Overview</span>
              <button 
                onClick={() => metrics && addToComparison(metrics)}
                disabled={!metrics || comparisonMetrics.every(m => m !== null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col mb-3">
              <h2 className="text-2xl font-semibold text-black dark:text-white tracking-tight mb-1">
                {loading ? (
                  <span className="inline-block w-48 h-6 bg-black/5 dark:bg-white/5 animate-pulse rounded" />
                ) : (
                  metrics?.metadata.locationName || "Target"
                )}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {metrics?.metadata.lat.toFixed(4)}° N, {metrics?.metadata.lng.toFixed(4)}° W
              </p>
            </div>

            <div className="h-px bg-black/[0.05] dark:bg-white/[0.05] w-full mb-3" />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Data Coverage</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#E5B152]">{metrics?.metadata.coverage ?? 0}%</span>
                  <div className={cn(
                    "flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full border border-black/5 dark:border-white/5",
                    (metrics?.metadata.coverage ?? 0) > 80 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                    (metrics?.metadata.coverage ?? 0) > 40 ? "bg-[#facc15]/10 text-[#facc15]" :
                    "bg-red-500/10 text-red-600 dark:text-red-400"
                  )}>
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      (metrics?.metadata.coverage ?? 0) > 80 ? "bg-emerald-500 dark:bg-emerald-400" :
                      (metrics?.metadata.coverage ?? 0) > 40 ? "bg-[#facc15]" :
                      "bg-red-500 dark:bg-red-400"
                    )} />
                    {(metrics?.metadata.coverage ?? 0) > 80 ? "High" : (metrics?.metadata.coverage ?? 0) > 40 ? "Medium" : "Low"}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Overall Confidence</span>
                <div className={cn(
                  "flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full border border-black/5 dark:border-white/5",
                  metrics?.metadata.confidence === "High" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                  metrics?.metadata.confidence === "Medium" ? "bg-[#facc15]/10 text-[#facc15]" :
                  "bg-red-500/10 text-red-600 dark:text-red-400"
                )}>
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    metrics?.metadata.confidence === "High" ? "bg-emerald-500 dark:bg-emerald-400" :
                    metrics?.metadata.confidence === "Medium" ? "bg-[#facc15]" :
                    "bg-red-500 dark:bg-red-400"
                  )} />
                  {metrics?.metadata.confidence ?? "Unknown"}
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">Last Updated</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">Today, 10:32 AM</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metrics List */}
        <div className={`space-y-2 transition-all duration-1000 pb-6 ${loading ? 'opacity-30 blur-[10px] pointer-events-none translate-y-10' : 'opacity-100 translate-y-0'}`}>
          <AnimatePresence mode="popLayout">
            {metrics ? (
              <>
                <MetricCard 
                  index={1}
                  title="WALKABILITY" 
                  value={metrics.walkability.score.toString()} 
                  subtext={metrics.walkability.label}
                  availability={metrics.walkability.score > 70 ? "High" : "Medium"} 
                  confidence={metrics.metadata.confidence}
                  details={metrics.walkability.details}
                />
                
                <MetricCard 
                  index={2}
                  title="GREENSPACE" 
                  value={metrics.greenspace.value.toFixed(1)} 
                  subtext={metrics.greenspace.label}
                  availability={metrics.greenspace.value > 15 ? "High" : "Medium"} 
                  confidence={metrics.metadata.confidence}
                  details={metrics.greenspace.details}
                />

                <MetricCard 
                  index={3}
                  title="DENSITY" 
                  value={metrics.density.value.toLocaleString()} 
                  subtext={metrics.density.label}
                  availability="High" 
                  confidence="High"
                  details={metrics.density.details}
                />

                <MetricCard 
                  index={4}
                  title="TRANSIT" 
                  value={metrics.transit.score.toString()} 
                  subtext={metrics.transit.subtext}
                  availability={metrics.transit.score > 60 ? "High" : "Medium"} 
                  confidence={metrics.metadata.confidence}
                  details={metrics.transit.details}
                />

                <MetricCard 
                  index={5}
                  title="NOISE" 
                  value={metrics.noise.score.toString()} 
                  subtext={metrics.noise.subtext}
                  availability={metrics.noise.score > 50 ? "High" : "Medium"} 
                  confidence={metrics.metadata.confidence}
                  details={metrics.noise.details}
                />
              </>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Bottom Safety Notice with enhanced look */}
        {!loading && metrics && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-[#facc15]/[0.04] border border-[#facc15]/10 flex gap-3 backdrop-blur-3xl mx-1 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-[2px] h-full bg-[#facc15]/20" />
            <div className="absolute top-0 left-0 w-4 h-[1px] bg-[#facc15]/20" />
            
            <AlertCircle className="w-4 h-4 text-[#facc15]/50 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black text-[#facc15]/70 uppercase tracking-[0.4em]">Heuristic Disclaimer</span>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-600 leading-relaxed font-bold uppercase tracking-[0.25em] opacity-80 font-mono">
                Data derived via neural heuristics. Enterprise grade validation required for mission-critical deployments.
              </p>
            </div>
            
            {/* Corner Bracket */}
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-black/[0.05] dark:border-white/[0.05]" />
          </motion.div>
        )}
      </div>
      </div>
    </aside>
  );
}
