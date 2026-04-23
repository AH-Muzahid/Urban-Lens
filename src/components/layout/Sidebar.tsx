import { MetricCard } from "./MetricCard";

export function Sidebar() {
  return (
    <aside className="w-[380px] border-r border-border bg-background flex flex-col overflow-y-auto shrink-0 z-10 shadow-lg">
      <div className="p-5 flex flex-col gap-6">
        
        {/* Trust Indicators Summary */}
        <div className="bg-zinc-900/50 rounded-2xl border border-border p-5 shadow-md relative overflow-hidden flex flex-col gap-4">
          <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/80"></div>
          
          <div>
            <h2 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground pl-2 mb-1">Area Overview</h2>
            <div className="pl-2 flex items-center justify-between">
              <span className="text-2xl font-bold truncate text-foreground">New York City</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pl-2">
            <div className="bg-black/20 rounded-lg p-3 border border-border/50">
              <span className="block text-xs text-muted-foreground mb-1">Data Coverage</span>
              <span className="font-semibold text-yellow-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                65% (Med)
              </span>
            </div>
            <div className="bg-black/20 rounded-lg p-3 border border-border/50">
              <span className="block text-xs text-muted-foreground mb-1">Confidence</span>
              <span className="font-semibold text-red-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Low
              </span>
            </div>
          </div>
        </div>

        {/* Metrics List */}
        <div className="flex flex-col gap-4">
          <MetricCard 
            title="Walkability" 
            value="32 amenities" 
            subtext="Schools: 3 | Hospitals: 1 | Shops: 28"
            availability="Medium" 
            confidence="Low" 
            details={{
              sources: ["OSM Nodes", "Local Transit Data"],
              method: "Calculated based on 15-min walking radius from center.",
              limitations: "Missing accurate sidewalk data; relies on raw street network."
            }}
          />
          
          <MetricCard 
            title="Greenspace" 
            value="14.2%" 
            subtext="4 parks within radius"
            availability="High" 
            confidence="Medium"
            details={{
              sources: ["OSM Polygons (leisure=park)"],
              method: "Area of parks divided by total area of the bounding box.",
              limitations: "Does not account for tree canopy outside of defined parks."
            }} 
          />

          <MetricCard 
            title="Density" 
            value="Insufficient data" 
            subtext="Missing building footprints"
            availability="Low" 
            confidence="Low"
            details={{
              sources: ["OSM Building Footprints"],
              method: "Total building area / Land area.",
              limitations: "Extremely sparse building data in this specific region."
            }} 
          />
        </div>

      </div>
    </aside>
  );
}
