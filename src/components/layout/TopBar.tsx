"use client";

import { Suspense, useState } from "react";
import { SearchBar } from "@/components/map/SearchBar";
import { Navigation, Target, HelpCircle, User, Hexagon, Layers, Bell } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useDashboard } from "@/context/DashboardContext";
import { motion } from "framer-motion";
import { UrbanButton } from "@/components/ui/UrbanButton";
import { GlassDivider } from "@/components/ui/GlassDivider";

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
    <header className="h-16 border-b border-white/5 bg-[#0B0F17]/80 backdrop-blur-xl flex items-center px-8 shrink-0 justify-between z-20 relative">
      <div className="flex items-center gap-12 flex-1">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 90 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(255,184,0,0.1)] group"
          >
            <Hexagon className="w-5 h-5 text-primary fill-primary/10 group-hover:fill-primary/30 transition-all" />
          </motion.div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">UrbanLens</h1>
            <span className="text-[8px] font-black text-primary tracking-[0.4em] uppercase mt-1 opacity-80">Intelligence Deck v1.0</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          <div className="relative flex-1 group">
            <Suspense fallback={<div className="h-10 bg-white/5 animate-pulse rounded-xl w-full border border-white/5"></div>}>
              <SearchBar />
            </Suspense>
          </div>
          <UrbanButton variant="ghost" size="sm" className="h-10 w-10 p-0" icon={<Target className="w-4 h-4 text-zinc-500" />} />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-xl px-3 h-10 transition-all hover:bg-white/[0.06] hover:border-white/10">
          <Layers className="w-3.5 h-3.5 text-zinc-500" />
          <select 
            value={radius} 
            onChange={(e) => setRadius(e.target.value)}
            className="bg-transparent border-none text-[10px] font-black text-zinc-300 focus:outline-none focus:ring-0 cursor-pointer pr-4 uppercase tracking-widest"
            disabled={loading}
          >
            <option value="500">500m Precision</option>
            <option value="1000">1km Reach</option>
            <option value="2000">2km Horizon</option>
          </select>
        </div>
        
        <UrbanButton 
          onClick={handleAnalyze}
          disabled={loading}
          icon={loading ? null : <Navigation className="w-3.5 h-3.5" />}
          className="h-10"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Analysing...</span>
            </div>
          ) : "Analyze Hub"}
        </UrbanButton>

        <div className="flex items-center gap-2 ml-4">
          <GlassDivider className="h-8 w-[1px] rotate-0" gradient={false} />
          <div className="flex items-center gap-1 pl-4">
            <button className="p-2.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all relative group">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full border-2 border-[#0B0F17]" />
            </button>
            <button className="p-2.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"><HelpCircle className="w-4 h-4" /></button>
            <button className="flex items-center gap-3 pl-2 group ml-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-white/10 overflow-hidden ring-2 ring-transparent group-hover:ring-primary/50 transition-all">
                <User className="w-full h-full p-1.5 text-zinc-400" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
