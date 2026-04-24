"use client";

import { Suspense, useState } from "react";
import { SearchBar } from "@/components/map/SearchBar";
import { Navigation, Target, HelpCircle, User, Hexagon, Bell, ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useDashboard } from "@/context/DashboardContext";
import { motion } from "framer-motion";

export function TopBar() {
  const [radius, setRadius] = useState("500");
  const searchParams = useSearchParams();
  const { analyze, loading } = useDashboard();

  const handleAnalyze = () => {
    const lat = parseFloat(searchParams.get("lat") || "");
    const lng = parseFloat(searchParams.get("lng") || "");
    const name = searchParams.get("name") || "Selected Area";
    
    if (isNaN(lat) || isNaN(lng)) {
      alert("Please select a location on the map first.");
      return;
    }

    analyze(lat, lng, parseInt(radius), undefined, name);
  };

  return (
    <header className="h-20 bg-[#0B0F17]/40 backdrop-blur-3xl flex items-center px-10 shrink-0 justify-between z-20 relative border-b border-white/[0.03]">
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(255,184,0,0.1)] group relative"
          >
            <Hexagon className="w-5 h-5 text-primary fill-primary/10 relative z-10" />
          </motion.div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-[-0.05em] text-white uppercase italic leading-none">UrbanLens</h1>
            <span className="text-[8px] font-black text-primary tracking-[0.4em] uppercase mt-1 opacity-50">Intelligence Deck</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-80">
          <div className="relative flex-1 group">
            <Suspense fallback={<div className="h-10 bg-white/5 animate-pulse rounded-xl w-full border border-white/5"></div>}>
              <SearchBar />
            </Suspense>
          </div>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.05] text-zinc-500 hover:text-white transition-all">
            <Target className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 h-10 transition-all hover:bg-white/[0.05] group cursor-pointer relative">
          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{radius}m Radius</span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-primary transition-colors" />
          <select 
            value={radius} 
            onChange={(e) => setRadius(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={loading}
          >
            <option value="500">500m Precision</option>
            <option value="1000">1km Reach</option>
            <option value="2000">2km Horizon</option>
          </select>
        </div>
        
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="h-10 px-6 rounded-xl border border-primary text-primary text-[10px] font-black tracking-[0.2em] uppercase hover:bg-primary hover:text-black transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-[0_0_20px_rgba(255,184,0,0.1)]"
        >
          {loading ? (
            <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : <Navigation className="w-3 h-3" />}
          <span>{loading ? "Analysing..." : "Analyze Area"}</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button className="p-2 text-zinc-500 hover:text-white transition-all">
              <HelpCircle className="w-4.5 h-4.5" />
            </button>
            <button className="p-2 text-zinc-500 hover:text-white transition-all relative">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
            </button>
          </div>
          <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-white/10 overflow-hidden cursor-pointer hover:border-primary/50 transition-all">
            <User className="w-full h-full p-2 text-zinc-500" />
          </div>
        </div>
      </div>
    </header>
  );
}
