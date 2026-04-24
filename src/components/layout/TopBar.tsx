"use client";

import { Suspense, useState } from "react";
import { SearchBar } from "@/components/map/SearchBar";
import { HelpCircle, User, Hexagon, Bell, ChevronDown, Compass } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useDashboard } from "@/context/DashboardContext";

export function TopBar() {
  const [radius, setRadius] = useState("500");
  const searchParams = useSearchParams();
  const { analyze, loading } = useDashboard();

  const handleAnalyze = () => {
    const lat = parseFloat(searchParams.get("lat") || "");
    const lng = parseFloat(searchParams.get("lng") || "");
    const name = searchParams.get("name") || "Selected Area";
    
    if (isNaN(lat) || isNaN(lng)) {
      alert("Please select a location on the map first");
      return;
    }

    analyze(lat, lng, parseInt(radius), undefined, name);
  };

  return (
    <header className="h-16 border-b border-white/[0.05] bg-[#06080C]/80 backdrop-blur-3xl flex items-center justify-between px-8 z-40 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-grid-white/[0.02] [background-size:24px_24px]" />
      
      <div className="flex items-center gap-12 relative z-10">
        {/* Logo Section */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <Hexagon className="w-8 h-8 text-[#E5B152] fill-[#E5B152]/10 transition-transform group-hover:rotate-90 duration-700" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-black tracking-[0.3em] text-white uppercase leading-none">UrbanLens</h1>
            <span className="text-[6px] font-black text-[#E5B152] uppercase tracking-[0.5em] mt-1.5 opacity-50">Intelligence Matrix</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <div className="w-[360px] relative group">
            <Suspense fallback={<div className="h-10 bg-white/[0.03] rounded-xl animate-pulse" />}>
              <SearchBar />
            </Suspense>
          </div>
          
          <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-[0.9rem] h-10 px-4 hover:bg-white/[0.04] hover:border-white/10 transition-all group cursor-pointer relative">
            <Compass className="w-3.5 h-3.5 text-[#E5B152]/70 group-hover:rotate-180 transition-transform duration-1000" />
            <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">{radius}M Radius</span>
            <ChevronDown className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />
            <select 
              value={radius} 
              onChange={(e) => setRadius(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={loading}
            >
              <option value="500">500m Analysis</option>
              <option value="1000">1km Analysis</option>
              <option value="2000">2km Analysis</option>
            </select>
          </div>

          <button 
            onClick={handleAnalyze}
            disabled={loading}
            className="h-10 px-8 bg-[#E5B152]/5 border border-[#E5B152]/30 rounded-[0.9rem] text-[#E5B152] text-[9px] font-black uppercase tracking-[0.3em] hover:bg-[#E5B152] hover:text-black transition-all shadow-[0_0_20px_rgba(229,177,82,0.05)] active:scale-95 disabled:opacity-20"
          >
            {loading ? "Processing..." : "Analyze Matrix"}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center text-zinc-600 hover:text-white transition-all hover:bg-white/[0.03] rounded-xl">
            <HelpCircle className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center text-zinc-600 hover:text-white transition-all hover:bg-white/[0.03] rounded-xl relative">
            <Bell className="w-4 h-4" />
            <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#E5B152] rounded-full border-2 border-[#06080C]" />
          </button>
        </div>
        
        <div className="h-8 w-[1px] bg-white/[0.05]" />
        
        <div className="flex items-center gap-3.5 pl-2 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-[9px] font-black text-white uppercase tracking-[0.15em] leading-none group-hover:text-[#E5B152] transition-colors">Enterprise AI</p>
            <p className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest mt-1.5">Alpha Access</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center group-hover:border-[#E5B152]/40 transition-all overflow-hidden">
            <div className="w-full h-full bg-[#E5B152]/10 flex items-center justify-center">
              <User className="w-4 h-4 text-[#E5B152]/60 group-hover:text-[#E5B152] transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
