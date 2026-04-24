"use client";

import { motion } from "framer-motion";
import { useDashboard } from "@/context/DashboardContext";
import { Activity, ShieldCheck, Database, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

export function SummaryBar() {
  const { metrics, loading } = useDashboard();

  if (!metrics && !loading) return null;

  const summaryItems = [
    {
      icon: Activity,
      label: "Walkability",
      value: metrics?.walkability.score ? `${metrics.walkability.score}/100` : "72/100",
      status: metrics?.walkability.score ? (metrics.walkability.score > 80 ? "High" : metrics.walkability.score > 50 ? "Medium" : "Low") : "Medium",
      color: "text-amber-500",
      bg: "bg-amber-500/5",
    },
    {
      icon: ShieldCheck,
      label: "Greenspace",
      value: metrics?.greenspace.value ? `${metrics.greenspace.value.toFixed(1)}%` : "14.2%",
      status: metrics?.greenspace.value ? (metrics.greenspace.value > 20 ? "High" : metrics.greenspace.value > 10 ? "Medium" : "Low") : "Medium",
      color: "text-emerald-500",
      bg: "bg-emerald-500/5",
    },
    {
      icon: Database,
      label: "Density",
      value: metrics?.density.value ? `${metrics.density.value.toLocaleString()}` : "8,342",
      status: metrics?.density.score ? (metrics.density.score > 80 ? "High" : metrics.density.score > 50 ? "Medium" : "Low") : "High",
      color: "text-[#E5B152]",
      bg: "bg-[#E5B152]/5",
    },
    {
      icon: Navigation,
      label: "Transit",
      value: metrics?.transit.score ? `${metrics.transit.score}%` : "42%",
      status: metrics?.transit.score ? (metrics.transit.score > 60 ? "High" : "Low") : "Low",
      color: "text-red-500",
      bg: "bg-red-500/5",
    }
  ];

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1 bg-[#0A0E14]/60 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl"
    >
      {summaryItems.map((item) => (
        <div key={item.label} className="flex items-center gap-4 px-6 py-2.5 hover:bg-white/[0.02] transition-colors rounded-xl group">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center border border-white/[0.05]", item.bg)}>
            <item.icon className={cn("w-3.5 h-3.5", item.color)} />
          </div>
          <div className="flex flex-col">
            <span className="text-[7px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-tight mb-0.5">{item.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white tracking-tight leading-none group-hover:text-[#E5B152] transition-colors">{loading ? "---" : item.value}</span>
              {!loading && (
                <div className={cn("w-1 h-1 rounded-full", 
                  item.status === "High" ? "bg-emerald-400" :
                  item.status === "Medium" ? "bg-amber-400" :
                  "bg-red-400"
                )} />
              )}
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
