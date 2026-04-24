"use client";

import { Globe, Database, ShieldCheck, Zap } from "lucide-react";

const sources = [
  { name: "OSM", icon: Globe },
  { name: "Sentinel", icon: Zap },
  { name: "Census", icon: Database },
  { name: "UrbanLens", icon: ShieldCheck },
];

export function DataSources() {
  return (
    <div className="absolute bottom-6 right-6 flex items-center gap-4 z-10">
      <div className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/[0.05] rounded-full">
        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Live Data:</span>
        <div className="flex items-center -space-x-1">
          {sources.map((source) => (
            <div 
              key={source.name}
              className="w-6 h-6 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center group relative cursor-help"
            >
              <source.icon className="w-3 h-3 text-zinc-400 group-hover:text-primary transition-colors" />
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black rounded-lg text-[8px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
                {source.name}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 ml-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
          <span className="text-[8px] font-black text-emerald-400 uppercase tracking-tighter">Healthy</span>
        </div>
      </div>
    </div>
  );
}
