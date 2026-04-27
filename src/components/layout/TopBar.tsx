"use client";

import { Suspense, useState } from "react";
import { SearchBar } from "@/components/map/SearchBar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDashboard } from "@/context/DashboardContext";
import { LocateFixed, LocationEdit, MapPin, Moon, Sun, X } from "lucide-react";
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
      className="border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0 transition-colors flex items-center justify-center w-9 h-9"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 hidden dark:block" />
      <Moon className="h-4 w-4 block dark:hidden" />
    </button>
  );
}

function TopBarContent() {
  const [radius, setRadius] = useState("500");
  const [showCoordinateInputs, setShowCoordinateInputs] = useState(false);
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");
  const [geoWarning, setGeoWarning] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("info");
  
  const router = useRouter();
  const pathname = usePathname();
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

  const handleCoordinateSearch = () => {
    const lat = Number(latInput.trim());
    const lng = Number(lngInput.trim());

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setToastMessage("Latitude and longitude must be valid numbers");
      setToastType("warning");
      setShowToast(true);
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setToastMessage("Latitude must be -90..90 and longitude must be -180..180");
      setToastType("warning");
      setShowToast(true);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("lat", lat.toFixed(5));
    params.set("lng", lng.toFixed(5));
    if (!params.get("z")) {
      params.set("z", "13");
    }

    const locationName = `Lat ${lat.toFixed(3)}, Lng ${lng.toFixed(3)}`;
    params.set("name", locationName);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    analyze(lat, lng, parseInt(radius), undefined, locationName);
    setGeoWarning(null);

    setToastMessage("Location loaded from coordinates");
    setToastType("success");
    setShowToast(true);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoWarning("Geolocation is not supported in this browser.");
      setShowCoordinateInputs(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatInput(lat.toFixed(6));
        setLngInput(lng.toFixed(6));
        setShowCoordinateInputs(true);
        setGeoWarning(null);
      },
      () => {
        setShowCoordinateInputs(true);
        setGeoWarning("Location access is blocked. Enable location permission in your browser settings, then try again.");
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      }
    );
  };

  return (
    <nav className="relative flex items-center justify-between bg-white/95 dark:bg-[#0a0f1a]/95 backdrop-blur-xl px-6 h-[68px] border-b border-black/5 dark:border-white/[0.06] z-50 transition-colors">
      <div className="flex items-center gap-3 flex-1 max-w-3xl">
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[2px] border-[#facc15]/30 border-dashed animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-1 rounded-full border-[2.5px] border-[#facc15] border-t-transparent animate-[spin_3s_linear_infinite]" />
            <div className="w-2.5 h-2.5 bg-[#facc15] rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
          </div>
          <span className="text-zinc-900 dark:text-white font-semibold  text-xl uppercase transition-colors">URBANLENS</span>
        </div>

        {/* Search */}
        <div className="w-1/2">
          <Suspense fallback={<div className="h-10 w-full bg-[#111827] rounded-lg animate-pulse" />}>
            <SearchBar />
          </Suspense>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowCoordinateInputs((prev) => {
              const nextOpen = !prev;
              if (nextOpen) {
                const currentLat = searchParams.get("lat");
                const currentLng = searchParams.get("lng");
                if (currentLat) setLatInput(currentLat);
                if (currentLng) setLngInput(currentLng);
              }
              return nextOpen;
            });
          }}
          className="h-10 shrink-0 rounded-lg border border-black/10 dark:border-white/[0.08] bg-white/80 dark:bg-[#0b1220]/70 px-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-[#111827] inline-flex items-center"
          aria-label="Open coordinate inputs"
          aria-pressed={showCoordinateInputs}
        >
          <LocationEdit className="w-4 h-4" />
        
        </button>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="h-10 w-10 shrink-0 rounded-lg border border-black/10 dark:border-white/[0.08] bg-white/80 dark:bg-[#0b1220]/70 text-zinc-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-[#111827] inline-flex items-center justify-center"
          aria-label="Use current location"
        >
          <LocateFixed className="w-4 h-4" />
        </button>

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

      {showCoordinateInputs && (
        <div className="absolute top-full left-[112px] mt-3 w-[min(620px,calc(100vw-2rem))] rounded-2xl border border-black/10 dark:border-white/[0.08] bg-white/95 dark:bg-[#0b1220]/95 backdrop-blur-xl shadow-2xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-700 dark:text-zinc-300">
                Location
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCoordinateInputs(false)}
              className="inline-flex items-center justify-center h-7 w-7 rounded-md text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Close coordinate panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {geoWarning && (
            <div className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
              {geoWarning}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 mb-1.5">Latitude</label>
              <input
                type="text"
                value={latInput}
                onChange={(event) => setLatInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleCoordinateSearch();
                  }
                }}
                placeholder="23.810300"
                className="h-10 w-full rounded-lg border border-black/10 dark:border-white/[0.08] bg-white/80 dark:bg-[#102033]/70 px-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500/80 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40"
                aria-label="Latitude"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 mb-1.5">Longitude</label>
              <input
                type="text"
                value={lngInput}
                onChange={(event) => setLngInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleCoordinateSearch();
                  }
                }}
                placeholder="90.412500"
                className="h-10 w-full rounded-lg border border-black/10 dark:border-white/[0.08] bg-white/80 dark:bg-[#102033]/70 px-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500/80 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40"
                aria-label="Longitude"
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCoordinateInputs(false)}
              className="h-9 px-3 rounded-lg border border-black/10 dark:border-white/[0.08] text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleCoordinateSearch}
              className="h-9 px-4 rounded-lg bg-[#facc15] hover:bg-[#fde047] text-black text-sm font-bold"
            >
              Apply
            </button>
          </div>
        </div>
      )}
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
