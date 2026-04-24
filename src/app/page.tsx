import { Suspense } from "react";
import { BaseMap } from "@/components/map/BaseMap";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { NavSidebar } from "@/components/layout/NavSidebar";
import { SummaryBar } from "@/components/layout/SummaryBar";
import { MapOverlays } from "@/components/map/MapOverlays";
import { DataSources } from "@/components/ui/DataSources";

export default function Home() {
  return (
    <main className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      <NavSidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <TopBar />
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar />
          <div className="flex-1 relative">
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-foreground bg-zinc-950">Initializing map...</div>}>
              <BaseMap />
            </Suspense>
            
            {/* Map Center Marker / Crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center">
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

            <SummaryBar />
            <MapOverlays />
            <DataSources />
          </div>
        </div>
      </div>
    </main>
  );
}
