"use client";

import { useDashboard } from "@/context/DashboardContext";
import { ComparisonCard } from "./ComparisonCard";
import { GitCompare } from "lucide-react";

export function ComparisonMatrix() {
  const { comparisonMetrics, removeFromComparison } = useDashboard();

  return (
    <div className="absolute bottom-12 left-12 right-12 z-30 pointer-events-none">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 pointer-events-auto">
            <div className="w-14 h-14 rounded-[1.8rem] bg-[#E5B152]/5 border border-[#E5B152]/30 flex items-center justify-center shadow-[0_0_30px_rgba(229,177,82,0.1)] relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-40" />
              <GitCompare className="w-6 h-6 text-[#E5B152] drop-shadow-[0_0_10px_rgba(229,177,82,0.6)] group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-[0.6em]">Neural Matrix</h3>
              <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.8em] mt-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E5B152] animate-pulse" />
                Cross-Reference Intelligence
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-6 pointer-events-auto overflow-x-auto pb-4 no-scrollbar">
          {comparisonMetrics.map((metrics, index) => (
            <ComparisonCard 
              key={index}
              metrics={metrics}
              index={index}
              onRemove={() => removeFromComparison(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
