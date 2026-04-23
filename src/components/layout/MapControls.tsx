"use client";

import { Plus, Minus, Layers, Maximize2, Compass } from "lucide-react";
import { UrbanButton } from "@/components/ui/UrbanButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useMap } from "react-map-gl/maplibre";

export function MapControls() {
  const { current: map } = useMap();

  const zoomIn = () => map?.zoomIn();
  const zoomOut = () => map?.zoomOut();
  const resetBearing = () => map?.resetNorth();

  return (
    <div className="absolute bottom-8 right-8 flex flex-col gap-4 z-20">
      {/* Zoom Controls */}
      <GlassPanel className="flex flex-col p-1.5 gap-1">
        <UrbanButton 
          variant="ghost" 
          size="sm" 
          className="h-10 w-10 p-0 rounded-xl" 
          onClick={zoomIn}
          icon={<Plus className="w-4 h-4" />}
        >
          {null}
        </UrbanButton>
        <div className="h-[1px] bg-white/5 mx-2" />
        <UrbanButton 
          variant="ghost" 
          size="sm" 
          className="h-10 w-10 p-0 rounded-xl" 
          onClick={zoomOut}
          icon={<Minus className="w-4 h-4" />}
        >
          {null}
        </UrbanButton>
      </GlassPanel>

      {/* Navigation Controls */}
      <GlassPanel className="flex flex-col p-1.5 gap-1">
        <UrbanButton 
          variant="ghost" 
          size="sm" 
          className="h-10 w-10 p-0 rounded-xl" 
          onClick={resetBearing}
          icon={<Compass className="w-4 h-4" />}
        >
          {null}
        </UrbanButton>
        <UrbanButton 
          variant="ghost" 
          size="sm" 
          className="h-10 w-10 p-0 rounded-xl" 
          icon={<Layers className="w-4 h-4" />}
        >
          {null}
        </UrbanButton>
        <UrbanButton 
          variant="ghost" 
          size="sm" 
          className="h-10 w-10 p-0 rounded-xl" 
          icon={<Maximize2 className="w-4 h-4" />}
        >
          {null}
        </UrbanButton>
      </GlassPanel>
    </div>
  );
}
