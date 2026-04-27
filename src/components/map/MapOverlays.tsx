"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/context/DashboardContext";

const LAYERS = [
  { id: "amenities",  label: "Amenities",           color: "bg-[#facc15]"  },
  { id: "greenspace", label: "Parks & Greenspace",  color: "bg-emerald-400" },
  { id: "buildings",  label: "Buildings",           color: "bg-blue-400"    },
  { id: "transit",    label: "Transit Stops",       color: "bg-zinc-500"    },
  { id: "noise",      label: "Noise (Road Prox.)",  color: "bg-orange-400"  },
];

const CONFIDENCE = [
  { label: "High",    color: "bg-emerald-400" },
  { label: "Medium",  color: "bg-amber-400"   },
  { label: "Low",     color: "bg-red-400"     },
  { label: "Unknown", color: "bg-zinc-600"    },
];

export function MapOverlays() {
  const {
    basemapPreset,
    isMapOverlaysVisible,
    mapLayerVisibility,
    setBasemapPreset,
    setIsMapOverlaysVisible,
    toggleMapLayer,
  } = useDashboard();

  if (!isMapOverlaysVisible) {
    return null;
  }

  return (
    <>
      {/* ── Map Layers Panel ── */}
      <motion.div
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute top-4 right-4 z-20 w-56 bg-[#0f172a] border border-white/[0.08] rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.25em]">
            Map Layers
          </h3>
          <button
            type="button"
            onClick={() => setIsMapOverlaysVisible(false)}
            className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-300"
          >
            Hide
          </button>
        </div>

        <div className="space-y-3">
          {LAYERS.map((layer) => (
            <button
              key={layer.id}
              onClick={() => toggleMapLayer(layer.id)}
              className="flex items-center justify-between w-full group"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-200",
                    mapLayerVisibility[layer.id]
                      ? "bg-[#facc15] border-[#facc15]"
                      : "border-white/[0.15] bg-white/[0.03] group-hover:border-white/30"
                  )}
                >
                  {mapLayerVisibility[layer.id] && (
                    <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[11px] font-medium transition-colors",
                    mapLayerVisibility[layer.id]
                      ? "text-white"
                      : "text-zinc-500 group-hover:text-zinc-300"
                  )}
                >
                  {layer.label}
                </span>
              </div>
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  mapLayerVisibility[layer.id] ? layer.color : "bg-zinc-700"
                )}
              />
            </button>
          ))}
        </div>

        {/* Basemap picker */}
        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-3">
            Basemap
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { preset: "auto" as const, gradient: "from-zinc-800 to-zinc-900" },
              { preset: "dark" as const, gradient: "from-slate-700 to-slate-900" },
              { preset: "light" as const, gradient: "from-neutral-800 to-stone-900" },
            ].map(({ preset, gradient }) => (
              <button
                key={preset}
                type="button"
                onClick={() => setBasemapPreset(preset)}
                className={cn(
                  "aspect-square rounded-lg border cursor-pointer transition-all hover:border-[#facc15]/40",
                  basemapPreset === preset ? "border-[#facc15]/60" : "border-white/[0.08]"
                )}
                aria-label={`Set basemap to ${preset}`}
              >
                <div
                  className={cn(
                    "w-full h-full rounded-[7px] bg-gradient-to-br",
                    gradient
                  )}
                >
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Data Confidence Legend ── */}
      <motion.div
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
        className="absolute bottom-20 sm:bottom-4 right-4 z-20 w-44 bg-[#0f172a] border border-white/[0.08] rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
      >
        <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.25em] mb-3">
          Data Confidence
        </h3>
        <div className="space-y-2">
          {CONFIDENCE.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <div className={cn("w-2 h-2 rounded-full flex-shrink-0", item.color)} />
              <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
