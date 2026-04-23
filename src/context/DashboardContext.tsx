"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { UrbanMetrics } from "@/services/metrics/processor";

interface DashboardContextType {
  metrics: UrbanMetrics | null;
  comparisonMetrics: (UrbanMetrics | null)[];
  loading: boolean;
  error: string | null;
  analyze: (lat: number, lng: number, radius: number, slot?: number, locationName?: string) => Promise<void>;
  addToComparison: (metrics: UrbanMetrics) => void;
  removeFromComparison: (index: number) => void;
  clearComparison: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] = useState<UrbanMetrics | null>(null);
  const [comparisonMetrics, setComparisonMetrics] = useState<(UrbanMetrics | null)[]>([null, null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

