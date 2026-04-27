"use client";

import { useEffect } from "react";
import { Plus, Minus, Layers, Maximize2, Compass } from "lucide-react";
import { UrbanButton } from "@/components/ui/UrbanButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useMap } from "react-map-gl/maplibre";
import { useDashboard } from "@/context/DashboardContext";

export function MapControls() {
  const { current: map } = useMap();
  const { isMapOverlaysVisible, setIsMapOverlaysVisible } = useDashboard();

  const zoomIn = () => map?.zoomIn();
  const zoomOut = () => map?.zoomOut();
  const resetBearing = () => map?.resetNorth();

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        document.body.classList.remove("map-fullscreen");
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      document.body.classList.remove("map-fullscreen");
      return;
    }

    await document.documentElement.requestFullscreen();
    document.body.classList.add("map-fullscreen");
  };

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
          onClick={() => setIsMapOverlaysVisible((prev) => !prev)}
          aria-pressed={isMapOverlaysVisible}
        >
          {null}
        </UrbanButton>
        <UrbanButton 
          variant="ghost" 
          size="sm" 
          className="h-10 w-10 p-0 rounded-xl" 
          icon={<Maximize2 className="w-4 h-4" />}
          onClick={() => void toggleFullscreen()}
        >
          {null}
        </UrbanButton>
      </GlassPanel>
    </div>
  );
}
