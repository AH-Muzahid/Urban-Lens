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
      label: "Walkability Score",
      value: metrics?.walkability.value ? `${metrics.walkability.value}/100` : "72/100",
      status: metrics?.walkability.value ? (metrics.walkability.value > 80 ? "High" : metrics.walkability.value > 50 ? "Medium" : "Low") : "Medium",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      icon: ShieldCheck,
      label: "Greenspace",
      value: metrics?.greenspace.value ? `${metrics.greenspace.value}%` : "14.2%",
      status: metrics?.greenspace.value ? (metrics.greenspace.value > 20 ? "High" : metrics.greenspace.value > 10 ? "Medium" : "Low") : "Medium",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      icon: Database,
      label: "Building Density",
      value: "8,342 avg/km²",
      status: "High",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      icon: Navigation,
      label: "Transit Access",
      value: "42%",
      status: "Low",
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    }
  ];

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 px-8 py-4 bg-[#0B0F17]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    >
      {summaryItems.map((item) => (
        <div key={item.label} className="flex items-center gap-4 px-6 border-r border-white/5 last:border-none">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", item.bg, item.border)}>
            <item.icon className={cn("w-5 h-5", item.color)} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{item.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white tracking-tight">{loading ? "---" : item.value}</span>
              {!loading && (
                <span className={cn("text-[9px] font-black uppercase px-1.5 py-0.5 rounded border", 
                  item.status === "High" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" :
                  item.status === "Medium" ? "text-amber-400 bg-amber-400/10 border-amber-400/20" :
                  "text-red-400 bg-red-400/10 border-red-400/20"
                )}>
                  {item.status}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
