"use client";

import { Footprints, TreeDeciduous, Building2, Train } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const statusColor = (level: "High" | "Medium" | "Low" | string) => {
  if (level === "High") return "text-emerald-400";
  if (level === "Medium") return "text-[#facc15]";
  if (level === "Low") return "text-red-400";
  return "text-zinc-500";
};

const dotColor = (level: "High" | "Medium" | "Low" | string) => {
  if (level === "High") return "bg-emerald-400 shadow-[0_0_6px_#22c55e]";
  if (level === "Medium") return "bg-[#facc15] shadow-[0_0_6px_#facc15]";
  if (level === "Low") return "bg-red-400 shadow-[0_0_6px_#ef4444]";
  return "bg-zinc-600";
};

export function DataSources() {
  const { metrics, loading } = useDashboard();

  if (!metrics && !loading) return null;

  const confidence = metrics?.metadata.confidence ?? "Unknown";

  const items = [
    {
      icon: Footprints,
      label: "Walkability Score",
      value: metrics ? `${metrics.walkability.score} /100` : "—",
      status: metrics ? (metrics.walkability.score > 70 ? "High" : metrics.walkability.score > 40 ? "Medium" : "Low") : "Unknown",
    },
    {
      icon: TreeDeciduous,
      label: "Greenspace",
      value: metrics ? `${metrics.greenspace.value.toFixed(1)}%` : "—",
      status: metrics ? (metrics.greenspace.value > 15 ? "High" : metrics.greenspace.value > 5 ? "Medium" : "Low") : "Unknown",
    },
    {
      icon: Building2,
      label: "Building Density",
      value: metrics ? `${metrics.density.value.toLocaleString()} avg/km²` : "—",
      status: "High",
    },
    {
      icon: Train,
      label: "Transit Access",
      value: metrics ? `${metrics.transit.score}%` : "—",
      status: metrics ? (metrics.transit.score > 60 ? "High" : metrics.transit.score > 30 ? "Medium" : "Low") : "Unknown",
    },
  ];

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-auto"
    >
      <div className="flex items-center gap-0 bg-[#0f172a] border border-white/[0.08] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
        {items.map((item, i) => (
          <div
            key={item.label}
            className={cn(
              "flex items-center gap-3 px-6 py-3 transition-colors duration-200 hover:bg-white/[0.04]",
              i < items.length - 1 && "border-r border-white/[0.06]"
            )}
          >
            <item.icon className={cn("w-4 h-4 shrink-0", statusColor(item.status))} />
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wide font-medium leading-none mb-1">
                {item.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white leading-none">
                  {loading ? (
                    <span className="inline-block w-12 h-3.5 bg-white/10 rounded animate-pulse" />
                  ) : item.value}
                </span>
                {!loading && (
                  <span className={cn("text-[10px] font-bold", statusColor(item.status))}>
                    {item.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
