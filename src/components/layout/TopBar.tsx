"use client";

import { Suspense, useState } from "react";
import { SearchBar } from "@/components/map/SearchBar";
import { useSearchParams } from "next/navigation";
import { useDashboard } from "@/context/DashboardContext";
import { Compass } from "lucide-react";
import BasicDropdown from "@/components/smoothui/basic-dropdown";

const radiusItems = [
  { id: "500", label: "500m Radius" },
  { id: "1000", label: "1000m Radius" },
  { id: "2000", label: "2000m Radius" },
];

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
    <nav className="relative flex items-center justify-between bg-[#06080C]/80 backdrop-blur-xl px-6 py-4 border-b border-white/[0.04] z-50">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[2px] border-[#E5B152]/30 border-dashed animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-1 rounded-full border-[2.5px] border-[#E5B152] border-t-transparent animate-[spin_3s_linear_infinite]" />
            <div className="w-2.5 h-2.5 bg-[#E5B152] rounded-full shadow-[0_0_10px_rgba(229,177,82,0.8)]" />
          </div>
          <span className="text-white font-black tracking-widest text-xl uppercase">URBANLENS</span>
        </div>
      </div>

      <div className="flex items-center space-x-3 flex-1 max-w-3xl px-10">
        <Suspense fallback={<div className="flex-1 h-10 bg-[#1f2937]/50 rounded-lg animate-pulse" />}>
          <SearchBar />
        </Suspense>

        <button className="p-2 border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-800 shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V5m0 14v-3m7-7h-3m-14 0H5"></path>
          </svg>
        </button>

        <div className="relative min-w-[140px] shrink-0 text-[#E5B152]">
          <BasicDropdown 
            label={radius + "m Radius"}
            items={radiusItems}
            onChange={(item) => setRadius(item.id.toString())}
          />
        </div>

        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="shrink-0 bg-transparent border border-[#E5B152] text-[#E5B152] px-6 py-2 rounded-lg text-sm font-bold tracking-widest hover:bg-[#E5B152]/10 transition-all disabled:opacity-50"
        >
          {loading ? "PROCESSING..." : "ANALYZE MATRIX"}
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"></path>
          </svg>
        </button>
        <button className="text-gray-400 hover:text-white text-xl font-medium">?</button>
        <div className="w-8 h-8 bg-gray-700 rounded-full border border-gray-600 flex items-center justify-center overflow-hidden">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
            </svg>
        </div>
      </div>
    </nav>
  );
}
