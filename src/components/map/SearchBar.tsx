"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";


interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchLocations = async (val: string) => {
    if (val.length < 3) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=5`);
      const data = await res.json();
      setResults(data);
      setIsOpen(true);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) searchLocations(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lat", parseFloat(result.lat).toFixed(5));
    params.set("lng", parseFloat(result.lon).toFixed(5));
    params.set("z", "14");
    params.set("name", result.display_name.split(',')[0]);
    router.push(`${pathname}?${params.toString()}`);
    setQuery(result.display_name);
    setIsOpen(false);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full group"
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls="search-results"
    >
      <div className={cn(
        "relative flex items-center bg-white/[0.03] border border-white/5 rounded-xl transition-all duration-300 px-4 h-10",
        "focus-within:bg-white/[0.06] focus-within:border-[#E5B152]/50 focus-within:ring-4 focus-within:ring-[#E5B152]/10",
        isOpen && results.length > 0 ? "rounded-b-none border-b-transparent shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)]" : ""
      )}>
        <Search className={cn(
          "w-4 h-4 transition-colors",
          loading ? "text-[#E5B152] animate-pulse" : "text-zinc-500 group-hover:text-zinc-400"
        )} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 3 && setIsOpen(true)}
          placeholder="Search any location..."
          aria-label="Search for urban locations"
          className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-bold text-white placeholder:text-zinc-700 px-3 uppercase tracking-wider"
        />
        
        <div className="flex items-center gap-2">
          {query ? (
            <button 
              onClick={() => { setQuery(""); setResults([]); }}
              aria-label="Clear search query"
              className="p-1 hover:bg-white/5 rounded-lg transition-all"
            >
              <X className="w-3 h-3 text-zinc-500" />
            </button>
          ) : (
            <div className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05]">
              <span className="text-[8px] font-black text-zinc-600 tracking-tighter">⌘</span>
              <span className="text-[8px] font-black text-zinc-600">K</span>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 z-50"
          >
            <div 
              id="search-results"
              role="listbox"
              className="bg-[#0B0F17] border border-white/5 border-t-transparent rounded-b-xl shadow-2xl overflow-hidden backdrop-blur-2xl"
            >
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {results.map((result) => (
                  <button
                    key={result.place_id}
                    onClick={() => handleSelect(result)}
                    role="option"
                    aria-selected={false}
                    className="w-full flex items-start gap-3 p-4 hover:bg-white/[0.03] transition-all text-left border-b border-white/[0.02] last:border-none group/item"
                  >
                    <div className="mt-1 w-6 h-6 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/5 group-hover/item:border-primary/30 transition-all">
                      <MapPin className="w-3 h-3 text-zinc-600 group-hover/item:text-primary transition-all" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest line-clamp-1 mb-0.5 group-hover/item:text-white">
                        {result.display_name.split(',')[0]}
                      </p>
                      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider line-clamp-1 opacity-70">
                        {result.display_name.split(',').slice(1).join(',')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-2 bg-black/40 flex items-center justify-between">
                <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.2em] px-2">POWERED BY NOMINATIM</span>
                <div className="flex gap-1 pr-2">
                  {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-zinc-800" />)}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
