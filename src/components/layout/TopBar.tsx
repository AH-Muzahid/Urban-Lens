"use client";

import { Suspense, useState } from "react";
import { SearchBar } from "@/components/map/SearchBar";
import { Navigation } from "lucide-react";

import { useSearchParams } from "next/navigation";
import { useDashboard } from "@/context/DashboardContext";

export function TopBar() {
  const [radius, setRadius] = useState("500");
  const searchParams = useSearchParams();
  const { analyze, loading } = useDashboard();

  const handleAnalyze = () => {
    const lat = parseFloat(searchParams.get("lat") || "");
    const lng = parseFloat(searchParams.get("lng") || "");
    
    if (isNaN(lat) || isNaN(lng)) {
      alert("Please select a location on the map first.");
      return;
    }

    analyze(lat, lng, parseInt(radius));
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-6 shrink-0 justify-between z-20 shadow-sm relative">
      <div className="flex items-center gap-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">UrbanLens</h1>
        </div>
        
        <div className="w-[320px]">
          <Suspense fallback={<div className="h-9 bg-muted animate-pulse rounded-md w-full"></div>}>
            <SearchBar />
          </Suspense>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <select 
          value={radius} 
          onChange={(e) => setRadius(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          disabled={loading}
        >
          <option value="500">500m Radius</option>
          <option value="1000">1km Radius</option>
          <option value="2000">2km Radius</option>
        </select>
        
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          {loading ? "Analyzing..." : "Analyze Area"}
        </button>
      </div>
    </header>
  );
}
