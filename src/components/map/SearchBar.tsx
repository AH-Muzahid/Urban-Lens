"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const params = new URLSearchParams(searchParams.toString());
        params.set("lat", parseFloat(lat).toFixed(5));
        params.set("lng", parseFloat(lon).toFixed(5));
        params.set("z", "14"); 
        router.push(`${pathname}?${params.toString()}`);
      } else {
        alert("Location not found.");
      }
    } catch (error) {
      console.error("Search failed", error);
      alert("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full items-center space-x-2 mt-4 relative">
      <input
        type="text"
        placeholder="Search location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex h-10 w-full rounded-md border border-white/20 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        disabled={loading}
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:pointer-events-none disabled:opacity-50 bg-white text-black hover:bg-zinc-200 h-10 px-4 py-2 shrink-0 shadow-lg"
        disabled={loading}
      >
        {loading ? (
          <span className="animate-pulse">...</span>
        ) : (
          <Search className="h-4 w-4" />
        )}
        <span className="sr-only">Search</span>
      </button>
    </form>
  );
}
