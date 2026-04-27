"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { UrbanMetrics } from "@/types/metrics";

interface DashboardContextType {
  metrics: UrbanMetrics | null;
  comparisonMetrics: (UrbanMetrics | null)[];
  loading: boolean;
  error: string | null;
  isSidebarOpen: boolean;
  isMapOverlaysVisible: boolean;
  mapOverlayMode: "layers" | "theme";
  basemapPreset: "natural" | "streets" | "light" | "dark" | "satellite";
  mapLayerVisibility: Record<string, boolean>;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMapOverlaysVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setMapOverlayMode: React.Dispatch<React.SetStateAction<"layers" | "theme">>;
  setBasemapPreset: React.Dispatch<React.SetStateAction<"natural" | "streets" | "light" | "dark" | "satellite">>;
  toggleMapLayer: (layerId: string) => void;
  toggleSidebar: () => void;
  analyze: (lat: number, lng: number, radius: number, slot?: number, locationName?: string) => Promise<void>;
  addToComparison: (metrics: UrbanMetrics) => void;
  removeFromComparison: (index: number) => void;
  clearComparison: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const DEFAULT_MAP_LAYER_VISIBILITY: Record<string, boolean> = {
  amenities: true,
  greenspace: true,
  buildings: true,
  transit: false,
  noise: false,
};

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] = useState<UrbanMetrics | null>(null);
  const [comparisonMetrics, setComparisonMetrics] = useState<(UrbanMetrics | null)[]>([null, null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMapOverlaysVisible, setIsMapOverlaysVisible] = useState(true);
  const [mapOverlayMode, setMapOverlayMode] = useState<"layers" | "theme">("layers");
  const [basemapPreset, setBasemapPreset] = useState<"natural" | "streets" | "light" | "dark" | "satellite">("natural");
  const [mapLayerVisibility, setMapLayerVisibility] = useState<Record<string, boolean>>(DEFAULT_MAP_LAYER_VISIBILITY);

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const toggleMapLayer = useCallback((layerId: string) => {
    setMapLayerVisibility((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  }, []);

  const analyze = useCallback(async (lat: number, lng: number, radius: number, slot?: number, locationName?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/analyze?lat=${lat}&lng=${lng}&radius=${radius}`);
      if (!response.ok) throw new Error("Failed to analyze area");
      const data: UrbanMetrics = await response.json();
      
      // Inject location name if provided
      if (locationName) {
        data.metadata.locationName = locationName;
      }
      
      if (slot !== undefined) {
        setComparisonMetrics(prev => {
          const next = [...prev];
          next[slot] = data;
          return next;
        });
      } else {
        setMetrics(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToComparison = useCallback((m: UrbanMetrics) => {
    setComparisonMetrics(prev => {
      // Find first empty slot or just append
      const emptyIndex = prev.findIndex(item => item === null);
      if (emptyIndex !== -1) {
        const next = [...prev];
        next[emptyIndex] = m;
        return next;
      }
      return [...prev, m];
    });
  }, []);

  const removeFromComparison = useCallback((index: number) => {
    setComparisonMetrics(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonMetrics([null, null]);
  }, []);

  return (
    <DashboardContext.Provider 
      value={{ 
        metrics, 
        comparisonMetrics, 
        loading, 
        error, 
        isSidebarOpen,
        isMapOverlaysVisible,
        mapOverlayMode,
        basemapPreset,
        mapLayerVisibility,
        setIsSidebarOpen,
        setIsMapOverlaysVisible,
        setMapOverlayMode,
        setBasemapPreset,
        toggleMapLayer,
        toggleSidebar,
        analyze, 
        addToComparison, 
        removeFromComparison,
        clearComparison
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}

