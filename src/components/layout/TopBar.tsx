"use client";

import { Suspense, useState } from "react";
import { SearchBar } from "@/components/map/SearchBar";
import { useSearchParams } from "next/navigation";
import { useDashboard } from "@/context/DashboardContext";
import { Moon, Sun } from "lucide-react";
import BasicDropdown from "@/components/smoothui/basic-dropdown";
import BasicToast, { ToastType } from "@/components/smoothui/basic-toast";
import { useTheme } from "next-themes";

const radiusItems = [
  { id: "500", label: "500m Radius" },
  { id: "1000", label: "1000m Radius" },
  { id: "2000", label: "2000m Radius" },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0 transition-colors flex items-center justify-center w-9 h-9"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 hidden dark:block" />
      <Moon className="h-4 w-4 block dark:hidden" />
    </button>
  );
}

function TopBarContent() {
  const [radius, setRadius] = useState("500");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("info");
  
  const searchParams = useSearchParams();
  const { analyze, loading } = useDashboard();

  const handleAnalyze = () => {
    const lat = parseFloat(searchParams.get("lat") || "");
    const lng = parseFloat(searchParams.get("lng") || "");
    const name = searchParams.get("name") || "Selected Area";
    
    if (isNaN(lat) || isNaN(lng)) {
      setToastMessage("Please select a location on the map first");
      setToastType("warning");
      setShowToast(true);
      return;
    }

    analyze(lat, lng, parseInt(radius), undefined, name);
  };

  return (
    <nav className="relative flex items-center justify-between bg-white/95 dark:bg-[#0a0f1a]/95 backdrop-blur-xl px-6 h-[68px] border-b border-black/5 dark:border-white/[0.06] z-50 transition-colors">
      <div className="flex items-center gap-6 flex-1 max-w-3xl">
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[2px] border-[#facc15]/30 border-dashed animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-1 rounded-full border-[2.5px] border-[#facc15] border-t-transparent animate-[spin_3s_linear_infinite]" />
            <div className="w-2.5 h-2.5 bg-[#facc15] rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
          </div>
          <span className="text-zinc-900 dark:text-white font-semibold tracking-[0.15em] text-lg uppercase transition-colors">URBANLENS</span>
        </div>

        {/* Search */}
        <div className="flex-1">
          <Suspense fallback={<div className="h-10 w-full bg-[#111827] rounded-lg animate-pulse" />}>
            <SearchBar />
          </Suspense>
        </div>
      </div>

      <div className="flex items-center space-x-4 shrink-0">
        <div className="relative min-w-[140px] shrink-0 text-zinc-300">
          <BasicDropdown 
            label={radius + "m Radius"}
            items={radiusItems}
            onChange={(item) => setRadius(item.id.toString())}
          />
        </div>

        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="shrink-0 bg-[#facc15] hover:bg-[#fde047] text-black px-5 py-2 rounded-lg text-sm font-bold tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-[0_2px_12px_rgba(250,204,21,0.25)] hover:shadow-[0_2px_20px_rgba(250,204,21,0.4)]"
        >
          {loading ? "Processing..." : "Analyze Area"}
        </button>

        <div className="flex items-center space-x-3 ml-2 pl-4 border-l border-white/[0.04]">
          <ThemeToggle />
          <button className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
          <div className="w-8 h-8 bg-zinc-200 dark:bg-[#1f2937]/50 rounded-full border border-zinc-300 dark:border-white/[0.04] flex items-center justify-center overflow-hidden transition-colors cursor-pointer hover:bg-zinc-300 dark:hover:bg-[#1f2937]">
              <svg className="w-4 h-4 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
          </div>
        </div>
      </div>
      
      <BasicToast
        isVisible={showToast}
        message={toastMessage}
        onClose={() => setShowToast(false)}
        type={toastType}
      />
    </nav>
  );
}

export function TopBar() {
  return (
    <Suspense fallback={<div className="h-[76px] w-full bg-white/80 dark:bg-[#06080C]/80 border-b border-black/5 dark:border-white/[0.04]" />}>
      <TopBarContent />
    </Suspense>
  );
}
