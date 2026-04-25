"use client";

import { useDashboard } from "@/context/DashboardContext";
import { NavSidebar } from "@/components/layout/NavSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MetricCard } from "@/components/layout/MetricCard";
import { RadarChart } from "@/components/ui/RadarChart";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { MetricValue } from "@/components/ui/MetricValue";
import { GitCompare, MapPin, Search, Globe, AlertTriangle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UrbanButton } from "@/components/ui/UrbanButton";
import Link from "next/link";

import { BarChart } from "@/components/ui/BarChart";
import { DataSources } from "@/components/ui/DataSources";

export default function ComparePage() {
  const { comparisonMetrics, removeFromComparison, clearComparison } = useDashboard();

  const metricsA = comparisonMetrics[0];
  const metricsB = comparisonMetrics[1];
  const bothSelected = metricsA && metricsB;
  const hasMetrics = comparisonMetrics.some(m => m !== null);

  const confidenceValue = (confidence: "High" | "Medium" | "Low") => {
    if (confidence === "High") return 90;
    if (confidence === "Medium") return 60;
    return 30;
  };

  return (
    <main className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      <NavSidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <TopBar />
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <header className="mb-12 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                  <GitCompare className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-sm font-black tracking-[0.4em] text-white uppercase">Comparison Engine</h1>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter">Side-by-Side Analysis</h2>
            </div>
            {hasMetrics && (
              <UrbanButton 
                variant="ghost" 
                onClick={clearComparison}
                className="text-zinc-500 hover:text-white"
              >
                Clear All
              </UrbanButton>
            )}
          </header>

          <AnimatePresence>
            {bothSelected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-12 overflow-hidden"
              >
                <PremiumCard className="p-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                    <div className="xl:col-span-2">
                      <div className="flex items-center gap-3 mb-8">
                        <GitCompare className="w-4 h-4 text-primary" />
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Comparative Metric Distribution</h3>
                      </div>
                      <BarChart 
                        data={[
                          { 
                            label: "Walkability Index", 
                            valueA: metricsA.walkability.score, 
                            valueB: metricsB.walkability.score,
                            confidenceA: confidenceValue(metricsA.metadata.confidence),
                            confidenceB: confidenceValue(metricsB.metadata.confidence),
                            description: "Measures pedestrian friendliness based on intersection density and amenity proximity."
                          },
                          { 
                            label: "Greenspace Access", 
                            valueA: metricsA.greenspace.score, 
                            valueB: metricsB.greenspace.score,
                            confidenceA: confidenceValue(metricsA.metadata.confidence),
                            confidenceB: confidenceValue(metricsB.metadata.confidence),
                            description: "Proportion of public parks and natural areas within reachable distance."
                          },
                          { 
                            label: "Building Density", 
                            valueA: metricsA.density.score, 
                            valueB: metricsB.density.score,
                            confidenceA: confidenceValue(metricsA.metadata.confidence),
                            confidenceB: confidenceValue(metricsB.metadata.confidence),
                            description: "Normalized from raw building footprint counts detected within the selected analysis radius."
                          },
                          { 
                            label: "Transit Access", 
                            valueA: metricsA.transit.score, 
                            valueB: metricsB.transit.score,
                            confidenceA: confidenceValue(metricsA.metadata.confidence),
                            confidenceB: confidenceValue(metricsB.metadata.confidence),
                            description: "Density of public transportation nodes and accessibility hubs."
                          },
                          { 
                            label: "Noise Level Proxy", 
                            valueA: metricsA.noise.score, 
                            valueB: metricsB.noise.score,
                            confidenceA: confidenceValue(metricsA.metadata.confidence),
                            confidenceB: confidenceValue(metricsB.metadata.confidence),
                            description: "Proximity to major high-capacity roads and traffic corridors (inverted)."
                          },
                        ]} 
                      />
                    </div>
                    
                    <div className="flex flex-col items-center justify-center p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                      <div className="mb-6 text-center">
                        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Spatial Fingerprint</h4>
                        <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest italic">Overlaid comparison</p>
                      </div>
                        <RadarChart 
                          size={220}
                          dataA={[
                            { label: "W", value: metricsA.walkability.score, fullLabel: "Walkability" },
                            { label: "G", value: metricsA.greenspace.score, fullLabel: "Greenspace" },
                            { label: "D", value: metricsA.density.score, fullLabel: "Density" },
                            { label: "T", value: metricsA.transit.score, fullLabel: "Transit" },
                            { label: "N", value: metricsA.noise.score, fullLabel: "Noise" },
                          ]}
                          dataB={[
                            { label: "W", value: metricsB.walkability.score },
                            { label: "G", value: metricsB.greenspace.score },
                            { label: "D", value: metricsB.density.score },
                            { label: "T", value: metricsB.transit.score },
                            { label: "N", value: metricsB.noise.score },
                          ]}
                          confidenceA={confidenceValue(metricsA.metadata.confidence)}
                          confidenceB={confidenceValue(metricsB.metadata.confidence)}
                        />
                    </div>
                  </div>

                  {/* Fairness Audit Section */}
                  <div className="mt-12 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-6">
                      <Info className="w-4 h-4 text-zinc-500" />
                      <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Integrity & Fairness Audit</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {metricsA.metadata.radius !== metricsB.metadata.radius && (
                        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
                          <AlertTriangle className="w-5 h-5 text-amber-500 mt-1" />
                          <div>
                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Scale Inconsistency</p>
                            <p className="text-[9px] text-amber-500/60 font-bold leading-relaxed">
                              Location A was analyzed at {metricsA.metadata.radius}m radius, while Location B used {metricsB.metadata.radius}m. 
                              Direct density comparisons may be skewed by area differences.
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {(Math.abs(confidenceValue(metricsA.metadata.confidence) - confidenceValue(metricsB.metadata.confidence)) > 20) && (
                        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-4">
                          <Info className="w-5 h-5 text-blue-500 mt-1" />
                          <div>
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Confidence Variance</p>
                            <p className="text-[9px] text-blue-500/60 font-bold leading-relaxed">
                              There is a significant gap in data reliability between these locations. 
                              Location {confidenceValue(metricsA.metadata.confidence) > confidenceValue(metricsB.metadata.confidence) ? 'A' : 'B'} has higher quality source data.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </PremiumCard>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {[0, 1].map((index) => {
              const m = comparisonMetrics[index];
              
              return (
                <div key={index} className="relative group">
                  {!m ? (
                    <Link href="/">
                      <PremiumCard className="h-[600px] flex flex-col items-center justify-center p-12 text-center border-dashed border-zinc-800 hover:border-primary/50 transition-all cursor-pointer bg-black/20">
                        <div className="w-16 h-16 bg-white/[0.03] rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                          <Search className="w-8 h-8 text-zinc-700" />
                        </div>
                        <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">Slot {index + 1} Empty</h3>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                          Return to the map to select<br />a location for comparison.
                        </p>
                      </PremiumCard>
                    </Link>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Location Header */}
                      <PremiumCard className="p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                          <UrbanButton 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeFromComparison(index)}
                            className="text-zinc-600 hover:text-red-400"
                          >
                            Remove
                          </UrbanButton>
                        </div>

                        <div className="flex items-start gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-primary mb-3">
                              <MapPin className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Location {index + 1}</span>
                            </div>
                            <h3 className="text-4xl font-black text-white tracking-tighter mb-4 leading-[0.85]">
                              {m.metadata.locationName}
                            </h3>
                            <div className="flex items-center gap-3">
                              <GlassBadge variant="primary">{m.metadata.confidence} Confidence</GlassBadge>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                <Globe className="w-3 h-3" />
                                {m.metadata.coverage}% Data Coverage
                              </div>
                            </div>
                          </div>
                          <div className="hidden sm:block">
                            <RadarChart 
                              size={120} 
                              dataA={[
                                { label: "W", value: m.walkability.score },
                                { label: "G", value: m.greenspace.score },
                                { label: "D", value: m.density.score },
                                { label: "T", value: m.transit.score },
                                { label: "N", value: m.noise.score },
                              ]} 
                              confidenceA={confidenceValue(m.metadata.confidence)}
                            />
                          </div>
                        </div>
                      </PremiumCard>

                      {/* Main Metrics Comparison */}
                      <div className="space-y-4">
                        <MetricCard 
                          index={1}
                          title="Walkability Index" 
                          value={m.walkability.label} 
                          subtext={m.walkability.subtext}
                          availability={m.walkability.value > 10 ? "High" : "Medium"} 
                          confidence={m.metadata.confidence}
                          details={m.walkability.details}
                        />
                        <MetricCard 
                          index={2}
                          title="Greenspace Access" 
                          value={m.greenspace.label} 
                          subtext={m.greenspace.subtext}
                          availability={m.greenspace.value > 10 ? "High" : "Medium"} 
                          confidence={m.metadata.confidence}
                          details={m.greenspace.details}
                        />
                        <MetricCard 
                          index={3}
                          title="Building Density" 
                          value={m.density.label} 
                          subtext={m.density.subtext}
                          availability={m.density.value > 50 ? "High" : "Low"} 
                          confidence={m.metadata.confidence}
                          details={m.density.details}
                        />
                        <MetricCard 
                          index={4}
                          title="Transit Access" 
                          value={m.transit.label} 
                          subtext={m.transit.subtext}
                          availability={m.transit.score > 60 ? "High" : "Medium"} 
                          confidence={m.metadata.confidence}
                          details={m.transit.details}
                        />
                        <MetricCard 
                          index={5}
                          title="Noise Level Proxy" 
                          value={m.noise.label} 
                          subtext={m.noise.subtext}
                          availability={m.noise.score > 50 ? "High" : "Medium"} 
                          confidence={m.metadata.confidence}
                          details={m.noise.details}
                        />
                      </div>

                      {/* Summary Data */}
                      <div className="grid grid-cols-2 gap-4">
                        <PremiumCard className="p-4 bg-white/[0.02]">
                            <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.15em] mb-2">Building Footprints</span>
                            <MetricValue value={Math.round(m.density.value)} unit="structures" size="sm" />
                        </PremiumCard>
                        <PremiumCard className="p-4 bg-white/[0.02]">
                          <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.15em] mb-2">Green Coverage</span>
                          <MetricValue value={Math.round(m.greenspace.value)} unit="%" size="sm" />
                        </PremiumCard>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {!hasMetrics && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 p-8 rounded-3xl bg-zinc-900/30 border border-white/5 text-center"
            >
              <AlertTriangle className="w-8 h-8 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                No locations selected for comparison.<br />
                Navigate to the Explorer and use the &quot;Add to Compare&quot; feature.
              </p>
            </motion.div>
          )}

          <DataSources layout="inline" className="mt-10" />
        </div>
      </div>
    </main>
  );
}
