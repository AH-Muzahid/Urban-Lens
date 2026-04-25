"use client";

import { useState } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { ComparisonCard } from "./ComparisonCard";
import { GitCompare, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ComparisonMatrix() {
  const { comparisonMetrics, removeFromComparison } = useDashboard();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (comparisonMetrics.every(m => m === null)) return null;

  return (
    <div className="absolute bottom-12 left-12 right-12 z-30 pointer-events-none">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-6 pointer-events-auto bg-[#06080C]/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/[0.04] hover:bg-[#06080C] transition-colors"
          >
            <div className="w-10 h-10 rounded-[1.2rem] bg-[#E5B152]/5 border border-[#E5B152]/30 flex items-center justify-center shadow-[0_0_30px_rgba(229,177,82,0.1)] relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-40" />
              <GitCompare className="w-5 h-5 text-[#E5B152] drop-shadow-[0_0_10px_rgba(229,177,82,0.6)] group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.6em]">Neural Matrix</h3>
              <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.8em] mt-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5B152] animate-pulse" />
                Cross-Reference
              </p>
            </div>
            {isCollapsed ? (
              <ChevronUp className="w-5 h-5 text-[#E5B152] opacity-50" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#E5B152] opacity-50" />
            )}
          </button>
        </div>

        <div className={cn(
          "pointer-events-auto overflow-hidden transition-all duration-500",
          isCollapsed ? "h-0 opacity-0" : "h-auto opacity-100"
        )}>
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
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
    </div>
  );
}
