import { ChevronDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtext?: string;
  availability: "High" | "Medium" | "Low" | "Unknown";
  confidence: "High" | "Medium" | "Low";
}

export function MetricCard({ title, value, subtext, availability, confidence }: MetricCardProps) {
  const getColor = (level: string) => {
    switch (level) {
      case "High": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Low": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  const getIndicator = (level: string) => {
    switch (level) {
      case "High": return "🟢";
      case "Medium": return "🟡";
      case "Low": return "🔴";
      default: return "⚪";
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm flex flex-col gap-3 transition-colors hover:border-border/80">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      
      <div>
        <p className="text-2xl font-bold">{value}</p>
        {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
      </div>

      <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-border/50 text-xs font-medium">
        <div className="flex items-center gap-2">
          <span>{getIndicator(availability)}</span>
          <span className="text-muted-foreground w-24">Data coverage:</span>
          <span className={`px-2 py-0.5 rounded-full border ${getColor(availability)}`}>
            {availability}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>{getIndicator(confidence)}</span>
          <span className="text-muted-foreground w-24">Confidence:</span>
          <span className={`px-2 py-0.5 rounded-full border ${getColor(confidence)}`}>
            {confidence}
          </span>
        </div>
      </div>

      <button className="text-xs text-muted-foreground hover:text-foreground mt-2 flex items-center gap-1 transition-colors w-fit group">
        Show details <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
      </button>
    </div>
  );
}
