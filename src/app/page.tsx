import { Suspense } from "react";
import { BaseMap } from "@/components/map/BaseMap";
import { SearchBar } from "@/components/map/SearchBar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-zinc-950">
      <div className="w-full h-screen relative">
        {/* Overlay header */}
        <div className="absolute top-6 left-6 z-10 bg-black/60 backdrop-blur-xl p-5 rounded-2xl border border-white/10 text-white shadow-2xl w-80">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">UrbanLens</h1>
          <p className="text-sm text-zinc-400 mt-1 font-medium">Phase 1: Explore & Inspect</p>
          
          <Suspense fallback={<div className="h-10 mt-4 bg-white/10 animate-pulse rounded-md"></div>}>
            <SearchBar />
          </Suspense>
        </div>
        
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-zinc-400 bg-zinc-950">Initializing map...</div>}>
          <BaseMap />
        </Suspense>
      </div>
    </main>
  );
}
