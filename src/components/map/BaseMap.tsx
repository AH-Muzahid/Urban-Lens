"use client";

import * as React from "react";
import Map from "react-map-gl/maplibre";
import type { MapRef } from "react-map-gl/maplibre";
import type { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { MapControls } from "@/components/layout/MapControls";
import { useDashboard } from "@/context/DashboardContext";
import { useMap } from "react-map-gl/maplibre";

const NATURAL_MAP_STYLE = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const STREETS_MAP_STYLE = "https://demotiles.maplibre.org/style.json";
const LIGHT_MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
const DARK_MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const SATELLITE_MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    esri: {
      type: "raster",
      tiles: [
        "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    },
  },
  layers: [
    {
      id: "satellite",
      type: "raster",
      source: "esri",
      minzoom: 0,
      maxzoom: 22,
    },
  ],
};

const MAP_LAYER_RULES = [
  { id: "amenities", keywords: ["poi", "amenity", "label", "place", "settlement"] },
  { id: "greenspace", keywords: ["park", "green", "landuse", "vegetation", "nature"] },
  { id: "buildings", keywords: ["building"] },
  { id: "transit", keywords: ["transit", "rail", "bus", "station", "subway", "tram"] },
  { id: "noise", keywords: ["road", "street", "motorway", "trunk", "primary", "secondary", "tertiary", "highway"] },
] as const;

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

function MapLayerSync({ mapLayerVisibility }: { mapLayerVisibility: Record<string, boolean> }) {
  const { current: mapRef } = useMap();

  React.useEffect(() => {
    const map = mapRef?.getMap?.();
    if (!map) return;

    const syncLayerVisibility = () => {
      const styleLayers = map.getStyle()?.layers ?? [];

      for (const styleLayer of styleLayers) {
        if (styleLayer.type === "background") continue;

        const layerId = styleLayer.id.toLowerCase();
        const matchingRules = MAP_LAYER_RULES.filter((rule) =>
          rule.keywords.some((keyword) => layerId.includes(keyword))
        );

        if (matchingRules.length === 0) continue;

        const shouldShow = matchingRules.every((rule) => mapLayerVisibility[rule.id]);
        const nextVisibility = shouldShow ? "visible" : "none";

        if (map.getLayoutProperty(styleLayer.id, "visibility") !== nextVisibility) {
          map.setLayoutProperty(styleLayer.id, "visibility", nextVisibility);
        }
      }
    };

    syncLayerVisibility();
    map.on("styledata", syncLayerVisibility);
    return () => {
      map.off("styledata", syncLayerVisibility);
    };
  }, [mapRef, mapLayerVisibility]);

  return null;
}

export function BaseMap() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { resolvedTheme } = useTheme();
  const { basemapPreset, mapLayerVisibility } = useDashboard();
  const mapRef = React.useRef<MapRef | null>(null);

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

  // Keep map camera in sync when URL params are changed externally (e.g. coordinate Apply).
  React.useEffect(() => {
    const urlLat = Number(searchParams.get("lat"));
    const urlLng = Number(searchParams.get("lng"));
    const urlZoom = Number(searchParams.get("z"));

    if (!Number.isFinite(urlLat) || !Number.isFinite(urlLng)) {
      return;
    }

    const map = mapRef.current?.getMap?.();

    setViewState((prev) => {
      const nextZoom = Number.isFinite(urlZoom) ? urlZoom : prev.zoom;
      const unchanged =
        Math.abs(prev.latitude - urlLat) < 1e-6 &&
        Math.abs(prev.longitude - urlLng) < 1e-6 &&
        Math.abs(prev.zoom - nextZoom) < 1e-6;

      if (unchanged) {
        return prev;
      }

      if (map) {
        map.easeTo({
          center: [urlLng, urlLat],
          zoom: nextZoom,
          duration: 900,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          essential: true,
        });

        return prev;
      }

      return {
        ...prev,
        latitude: urlLat,
        longitude: urlLng,
        zoom: nextZoom,
      };
    });
  }, [searchParams]);

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

  const mapStyle = basemapPreset === "natural"
    ? NATURAL_MAP_STYLE
    : basemapPreset === "streets"
    ? STREETS_MAP_STYLE
    : basemapPreset === "light"
    ? LIGHT_MAP_STYLE
    : basemapPreset === "dark"
    ? DARK_MAP_STYLE
    : basemapPreset === "satellite"
    ? SATELLITE_MAP_STYLE
    : resolvedTheme === "dark"
    ? DARK_MAP_STYLE
    : NATURAL_MAP_STYLE;

  return (
    <div className="absolute inset-0 z-0">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
        interactive={true}
      >
        <MapLayerSync mapLayerVisibility={mapLayerVisibility} />
        <MapControls />
      </Map>
    </div>
  );
}
