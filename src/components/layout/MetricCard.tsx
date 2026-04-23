"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtext?: string;
  availability: "High" | "Medium" | "Low" | "Unknown";
  confidence: "High" | "Medium" | "Low";
  details: {
    sources: string[];
    method: string;
    limitations: string;
  };
}

export function MetricCard({ title, value, subtext, availability, confidence, details }: MetricCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Strict mapping based on user guidelines
  const getColor = (level: string) => {
    switch (level) {
      case "High": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Medium": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Low": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  const getIndicator = (level: string) => {
    switch (level) {
      case "High": return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]";
      case "Medium": return "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]";
      case "Low": return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]";
      default: return "bg-zinc-500";
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm flex flex-col gap-4 transition-all duration-300 hover:border-zinc-700 hover:shadow-md hover:-translate-y-0.5 group">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-foreground group-hover:text-white transition-colors">{title}</h3>
      </div>
      
      <div className="border-b border-border/50 pb-4">
        <p className="text-3xl font-bold tracking-tight text-white">{value}</p>
        {subtext && <p className="text-sm text-muted-foreground mt-1.5">{subtext}</p>}
      </div>

      <div className="flex flex-col gap-2.5 text-sm font-medium">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getIndicator(availability)}`} />
          <span className="text-muted-foreground w-24">Coverage:</span>
          <span className={`px-2.5 py-0.5 rounded-md border text-xs font-semibold ${getColor(availability)}`}>
            {availability}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getIndicator(confidence)}`} />
          <span className="text-muted-foreground w-24">Confidence:</span>
          <span className={`px-2.5 py-0.5 rounded-md border text-xs font-semibold ${getColor(confidence)}`}>
            {confidence}
          </span>
        </div>
      </div>

      <button 
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-muted-foreground hover:text-white mt-2 flex items-center gap-1.5 transition-colors duration-200 w-fit cursor-pointer"
      >
        {expanded ? "Hide details" : "Show details"} 
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-200" />}
      </button>

      {expanded && (
        <div className="mt-2 p-3.5 bg-black/40 rounded-lg border border-border/50 text-sm text-zinc-300 space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
          <div>
            <p className="font-semibold text-zinc-100 mb-1.5">Data Sources:</p>
            <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
              {details.sources.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-zinc-100 mb-1.5">Method:</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{details.method}</p>
          </div>
          <div>
            <p className="font-semibold text-red-400 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Limitations:
            </p>
            <p className="text-xs text-red-400/80 leading-relaxed">{details.limitations}</p>
          </div>
        </div>
      )}
    </div>
  );
}
