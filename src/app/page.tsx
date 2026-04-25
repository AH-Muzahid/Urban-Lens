import { Suspense } from "react";
import { BaseMap } from "@/components/map/BaseMap";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { NavSidebar } from "@/components/layout/NavSidebar";
import { ComparisonMatrix } from "@/components/dashboard/ComparisonMatrix";
import { MapOverlays } from "@/components/map/MapOverlays";
import { DataSources } from "@/components/ui/DataSources";

export default function Home() {
  return (
    <main className="relative h-screen w-full bg-background text-foreground overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-foreground bg-zinc-950">Initializing map...</div>}>
          <BaseMap />
        </Suspense>
        
        {/* Map Center Marker / Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
          <div className="relative">
            <div className="w-8 h-8 border border-primary/30 rounded-full animate-ping opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_#facc15]" />
              <div className="absolute w-4 h-[1px] bg-primary/40 -left-6" />
              <div className="absolute w-4 h-[1px] bg-primary/40 -right-6" />
              <div className="absolute h-4 w-[1px] bg-primary/40 -top-6" />
              <div className="absolute h-4 w-[1px] bg-primary/40 -bottom-6" />
            </div>
          </div>
        </div>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 h-full w-full pointer-events-none">
        
        {/* TopBar (Floating at top) */}
        <div className="pointer-events-auto absolute top-0 left-0 right-0 z-50">
          <TopBar />
        </div>

        {/* Sidebars (Floating on left, below TopBar) */}
        <div className="pointer-events-auto absolute top-[76px] bottom-0 left-0 flex z-40">
          <NavSidebar />
          <Sidebar />
        </div>

        {/* Other UI (Floating over map) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Inner UI elements that need pointer-events */}
          <div className="pointer-events-auto">
            <ComparisonMatrix />
          </div>
          <div className="pointer-events-auto">
            <MapOverlays />
          </div>
          <div className="pointer-events-auto">
            <DataSources />
          </div>
        </div>
      </div>
    </main>
  );
}
