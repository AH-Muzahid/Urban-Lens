"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { UrbanMetrics } from "@/services/metrics/processor";

interface DashboardContextType {
  metrics: UrbanMetrics | null;
  loading: boolean;
  error: string | null;
  analyze: (lat: number, lng: number, radius: number) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] = useState<UrbanMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (lat: number, lng: number, radius: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/analyze?lat=${lat}&lng=${lng}&radius=${radius}`);
      if (!response.ok) throw new Error("Failed to analyze area");
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DashboardContext.Provider value={{ metrics, loading, error, analyze }}>
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
