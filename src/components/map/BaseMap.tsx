"use client";

import * as React from "react";
import Map, { NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Dark matter style from Carto for a premium look
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

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
      params.set("lat", viewState.latitude.toFixed(5));
      params.set("lng", viewState.longitude.toFixed(5));
      params.set("z", viewState.zoom.toFixed(2));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
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
        <NavigationControl position="bottom-right" showCompass={false} />
      </Map>
    </div>
  );
}
