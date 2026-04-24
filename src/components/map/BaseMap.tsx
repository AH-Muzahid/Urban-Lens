"use client";

import * as React from "react";
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MapControls } from "@/components/layout/MapControls";
import { GlassPanel } from "@/components/ui/GlassPanel";

// Dark matter style from Carto for a premium look (using raster tiles to avoid vector tile fetch errors)
const MAP_STYLE: any = {
  version: 8,
  sources: {
    "carto-dark": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#0a0a0a"
      }
    },
    {
      id: "carto-dark-layer",
      type: "raster",
      source: "carto-dark",
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

export function BaseMap() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse URL state or default to a starting location (e.g., London)
  const [viewState, setViewState] = React.useState<ViewState>(() => {
    const lat = parseFloat(searchParams.get("lat") || "51.505");
    const lng = parseFloat(searchParams.get("lng") || "-0.09");
    const z = parseFloat(searchParams.get("z") || "13");
    
    return {
      longitude: lng,
      latitude: lat,
      zoom: z,
      pitch: 0,
      bearing: 0,
    };
  });

  // Debounced URL update to sync map state with URL
  React.useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const newLat = viewState.latitude.toFixed(5);
      const newLng = viewState.longitude.toFixed(5);
      const newZ = viewState.zoom.toFixed(2);
      
      // Only push to router if the values actually changed to prevent infinite loop
      if (params.get("lat") !== newLat || params.get("lng") !== newLng || params.get("z") !== newZ) {
        params.set("lat", newLat);
        params.set("lng", newLng);
        params.set("z", newZ);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [viewState, pathname, router, searchParams]);

  return (
    <div className="w-full h-full relative">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle={MAP_STYLE}
        style={{ width: "100%", height: "100%" }}
        interactive={true}
      >
        <MapControls />
      </Map>

      {/* Map Info Overlay */}
      <div className="absolute bottom-8 left-8 z-20 pointer-events-none">
        <GlassPanel className="px-4 py-2 flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">Latitude</span>
            <span className="text-[10px] font-mono font-bold text-white tracking-tighter">
              {viewState.latitude.toFixed(6)}
            </span>
          </div>
          <div className="w-[1px] h-6 bg-white/5" />
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">Longitude</span>
            <span className="text-[10px] font-mono font-bold text-white tracking-tighter">
              {viewState.longitude.toFixed(6)}
            </span>
          </div>
          <div className="w-[1px] h-6 bg-white/5" />
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">Zoom Level</span>
            <span className="text-[10px] font-mono font-bold text-primary tracking-tighter">
              {viewState.zoom.toFixed(2)}
            </span>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
