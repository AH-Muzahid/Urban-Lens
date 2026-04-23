"use client";

import { MetricCard } from "./MetricCard";
import { useDashboard } from "@/context/DashboardContext";
import { Search } from "lucide-react";

export function Sidebar() {
  const { metrics, loading } = useDashboard();

  if (!metrics && !loading) {
    return (
      <aside className="w-[380px] border-r border-border bg-background flex flex-col shrink-0 z-10 shadow-lg items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-border">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Analysis Yet</h3>
        <p className="text-sm text-muted-foreground">
          Select a location and click "Analyze Area" to start inspecting urban data.
        </p>
      </aside>
    );
  }

  return (
    <aside className="w-[380px] border-r border-border bg-background flex flex-col overflow-y-auto shrink-0 z-10 shadow-lg">
      <div className="p-5 flex flex-col gap-6">
        
        {/* Trust Indicators Summary */}
        <div className={`bg-zinc-900/50 rounded-2xl border border-border p-5 shadow-md relative overflow-hidden flex flex-col gap-4 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          <div className={`absolute top-0 left-0 w-1 h-full transition-colors duration-500 ${
            metrics?.metadata.confidence === "High" ? "bg-emerald-500" : 
            metrics?.metadata.confidence === "Medium" ? "bg-yellow-500" : "bg-red-500"
          }`}></div>
          
          <div>
            <h2 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground pl-2 mb-1">Area Overview</h2>
            <div className="pl-2 flex items-center justify-between">
              <span className="text-2xl font-bold truncate text-foreground">
                {loading ? "Analyzing..." : (metrics?.metadata.locationName || "Selected Area")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pl-2">
            <div className="bg-black/20 rounded-lg p-3 border border-border/50">
              <span className="block text-xs text-muted-foreground mb-1">Data Coverage</span>
              <span className="font-semibold text-zinc-100 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${metrics?.metadata.coverage && metrics.metadata.coverage > 70 ? 'bg-emerald-500' : 'bg-yellow-500'}`}></span>
                {metrics?.metadata.coverage}%
              </span>
            </div>
            <div className="bg-black/20 rounded-lg p-3 border border-border/50">
              <span className="block text-xs text-muted-foreground mb-1">Confidence</span>
              <span className={`font-semibold flex items-center gap-1.5 ${
                metrics?.metadata.confidence === "High" ? "text-emerald-500" : 
                metrics?.metadata.confidence === "Medium" ? "text-yellow-500" : "text-red-500"
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  metrics?.metadata.confidence === "High" ? "bg-emerald-500" : 
                  metrics?.metadata.confidence === "Medium" ? "bg-yellow-500" : "bg-red-500"
                }`}></span>
                {metrics?.metadata.confidence}
              </span>
            </div>
          </div>
        </div>

        {/* Metrics List */}
        <div className={`flex flex-col gap-4 transition-opacity duration-300 ${loading ? 'opacity-50 grayscale' : 'opacity-100'}`}>
          {metrics && (
            <>
              <MetricCard 
                title="Walkability" 
                value={metrics.walkability.label} 
                subtext={metrics.walkability.subtext}
                availability={metrics.walkability.value > 10 ? "High" : "Medium"} 
                confidence={metrics.metadata.confidence}
                details={metrics.walkability.details}
              />
              
              <MetricCard 
                title="Greenspace" 
                value={metrics.greenspace.label} 
                subtext={metrics.greenspace.subtext}
                availability={metrics.greenspace.value > 10 ? "High" : "Medium"} 
                confidence={metrics.metadata.confidence}
                details={metrics.greenspace.details}
              />

              <MetricCard 
                title="Density" 
                value={metrics.density.label} 
                subtext={metrics.density.subtext}
                availability={metrics.density.value > 50 ? "High" : "Low"} 
                confidence={metrics.metadata.confidence}
                details={metrics.density.details}
              />
            </>
          )}
        </div>

      </div>
    </aside>
  );
}
