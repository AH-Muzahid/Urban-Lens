"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function MapOverlays() {
  return (
    <>
      {/* Map Layers Panel */}
      <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="absolute top-10 right-10 z-20 w-64 bg-[#0B0F17]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 shadow-2xl"
      >
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-6 flex items-center justify-between">
          Map Layers
          <div className="w-8 h-[1px] bg-white/10" />
        </h3>
        
        <div className="space-y-4">
          {[
            { id: 'amenities', label: 'Amenities', checked: true, color: 'bg-amber-400' },
            { id: 'greenspace', label: 'Parks & Greenspace', checked: true, color: 'bg-emerald-400' },
            { id: 'buildings', label: 'Buildings', checked: true, color: 'bg-blue-400' },
            { id: 'transit', label: 'Transit Stops', checked: false, color: 'bg-zinc-600' },
            { id: 'noise', label: 'Noise (Road Proximity)', checked: false, color: 'bg-zinc-600' },
          ].map((layer) => (
            <div key={layer.id} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-5 h-5 rounded-lg border flex items-center justify-center transition-all",
                  layer.checked ? "bg-primary border-primary" : "border-white/10 bg-white/[0.02] group-hover:border-white/20"
                )}>
                  {layer.checked && <Check className="w-3 h-3 text-black font-black" />}
                </div>
                <span className={cn(
                  "text-[11px] font-black uppercase tracking-tight transition-colors",
                  layer.checked ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                )}>
                  {layer.label}
                </span>
              </div>
              <div className={cn("w-3 h-3 rounded-full opacity-60 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_currentColor]", layer.color.replace('bg-', 'text-')) + " " + layer.color} />
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-4">Basemap</p>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={cn(
                  "aspect-square rounded-lg border bg-zinc-900 overflow-hidden cursor-pointer hover:border-primary/50 transition-all",
                  i === 1 ? "border-primary" : "border-white/5"
                )}
              >
                <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black opacity-60" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Data Confidence Legend */}
      <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="absolute bottom-10 right-10 z-20 w-48 bg-[#0B0F17]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl"
      >
        <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-4">Data Confidence</h3>
        <div className="space-y-2.5">
          {[
            { label: 'High', color: 'bg-emerald-400' },
            { label: 'Medium', color: 'bg-amber-400' },
            { label: 'Low', color: 'bg-red-400' },
            { label: 'Unknown', color: 'bg-zinc-600' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]", item.color.replace('bg-', 'text-')) + " " + item.color} />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
