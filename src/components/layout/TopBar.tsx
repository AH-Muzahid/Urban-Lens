"use client";

import { Suspense, useState } from "react";
import { SearchBar } from "@/components/map/SearchBar";
import { Navigation } from "lucide-react";

export function TopBar() {
  const [radius, setRadius] = useState("500");

  const handleAnalyze = () => {
    // We will dispatch an event or update the URL with a trigger to fetch data
    console.log("Analyzing with radius:", radius);
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
          className="h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="500">500m Radius</option>
          <option value="1000">1km Radius</option>
          <option value="2000">2km Radius</option>
        </select>
        
        <button 
          onClick={handleAnalyze}
          className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Navigation className="w-4 h-4" />
          Analyze Area
        </button>
      </div>
    </header>
  );
}
