import { Suspense } from "react";
import { BaseMap } from "@/components/map/BaseMap";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { NavSidebar } from "@/components/layout/NavSidebar";

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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex flex-col items-center justify-center">
              <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary/20 shadow-[0_0_0_4px_rgba(0,0,0,0.1)]"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
