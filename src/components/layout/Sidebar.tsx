import { MetricCard } from "./MetricCard";

export function Sidebar() {
  return (
    <aside className="w-[380px] border-r border-border bg-background flex flex-col overflow-y-auto shrink-0 z-10 shadow-lg">
      <div className="p-4 flex flex-col gap-6">
        
        {/* Trust Indicators Summary */}
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/50"></div>
          <h2 className="text-sm font-semibold mb-3 text-foreground pl-2">Area Overview</h2>
          <div className="space-y-2 text-sm pl-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Location</span>
              <span className="font-medium truncate max-w-[180px]">New York City</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Data Coverage</span>
              <span className="font-medium text-yellow-500">65% (Medium)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Overall Confidence</span>
              <span className="font-medium text-red-500">Low</span>
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
          />
          
          <MetricCard 
            title="Greenspace" 
            value="14.2%" 
            subtext="4 parks within radius"
            availability="High" 
            confidence="Medium" 
          />

          <MetricCard 
            title="Density" 
            value="Insufficient data" 
            subtext="Missing building footprints"
            availability="Low" 
            confidence="Low" 
          />
        </div>

      </div>
    </aside>
  );
}
