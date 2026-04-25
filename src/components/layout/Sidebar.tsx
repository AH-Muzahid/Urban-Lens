"use client";

import { useMemo } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { AlertTriangle, GitCompare, Loader2, MapPin } from "lucide-react";
import { MetricCard } from "@/components/layout/MetricCard";
import { UrbanButton } from "@/components/ui/UrbanButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { cn } from "@/lib/utils";

export function Sidebar() {
	const { metrics, loading, error, addToComparison, comparisonMetrics, isSidebarOpen } = useDashboard();

	const canAddToCompare = useMemo(() => {
		if (!metrics) return false;
		return !comparisonMetrics.some((item) => {
			if (!item) return false;
			return (
				item.metadata.lat === metrics.metadata.lat &&
				item.metadata.lng === metrics.metadata.lng &&
				item.metadata.radius === metrics.metadata.radius
			);
		});
	}, [comparisonMetrics, metrics]);

	return (
		<aside
			className={cn(
				"h-full overflow-hidden border-r border-black/5 dark:border-white/[0.04] bg-white/95 dark:bg-[#06080C]/90 backdrop-blur-xl transition-all duration-300",
				isSidebarOpen ? "w-[420px]" : "w-0 border-r-0"
			)}
			aria-hidden={!isSidebarOpen}
		>
			<div className={cn("h-full w-[420px] px-4 py-4", !isSidebarOpen && "pointer-events-none")}> 
				<div className="h-full rounded-2xl border border-black/5 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.02] overflow-hidden flex flex-col">
					<div className="px-4 py-3 border-b border-black/5 dark:border-white/[0.06]">
						<div className="flex items-center justify-between gap-2">
							<div>
								<h2 className="text-[10px] font-black tracking-[0.25em] uppercase text-zinc-700 dark:text-zinc-400">Live Analysis</h2>
								<p className="text-xs text-zinc-500 mt-1">Current center point metrics</p>
							</div>
							{loading && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
						</div>
					</div>

					<div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
						{!metrics && !loading && !error && (
							<div className="rounded-xl border border-dashed border-zinc-700/40 p-4 text-center">
								<MapPin className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
								<p className="text-xs text-zinc-400">
									Search a place or move the map, then click <span className="font-semibold">Analyze Area</span>.
								</p>
							</div>
						)}

						{error && (
							<div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
								<div className="flex items-start gap-2">
									<AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
									<div>
										<p className="text-xs font-semibold text-red-300">Analysis failed</p>
										<p className="text-xs text-red-200/80 mt-1">{error}</p>
									</div>
								</div>
							</div>
						)}

						{metrics && (
							<>
								<div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
									<div className="flex items-center justify-between gap-2">
										<div>
											<p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Selected Location</p>
											<p className="text-lg font-black text-white tracking-tight mt-1 truncate">{metrics.metadata.locationName}</p>
										</div>
									</div>

									<div className="mt-3 flex items-center gap-2 flex-wrap">
										<GlassBadge variant="primary">{metrics.metadata.confidence} Confidence</GlassBadge>
										<GlassBadge variant="secondary">{metrics.metadata.coverage}% Coverage</GlassBadge>
										<GlassBadge variant="secondary">{metrics.metadata.radius}m Radius</GlassBadge>
									</div>

									<div className="mt-4">
										<UrbanButton
											variant="outline"
											size="sm"
											className="w-full"
											onClick={() => addToComparison(metrics)}
											disabled={!canAddToCompare}
											icon={<GitCompare className="w-3.5 h-3.5" />}
										>
											{canAddToCompare ? "Add To Compare" : "Already In Compare"}
										</UrbanButton>
									</div>
								</div>

								<MetricCard
									index={1}
									title="Walkability Index"
									value={metrics.walkability.label}
									subtext={metrics.walkability.subtext}
									availability={metrics.walkability.value > 10 ? "High" : "Medium"}
									confidence={metrics.metadata.confidence}
									details={metrics.walkability.details}
								/>

								<MetricCard
									index={2}
									title="Greenspace Access"
									value={metrics.greenspace.label}
									subtext={metrics.greenspace.subtext}
									availability={metrics.greenspace.value > 10 ? "High" : "Medium"}
									confidence={metrics.metadata.confidence}
									details={metrics.greenspace.details}
								/>

								<MetricCard
									index={3}
									title="Building Density"
									value={metrics.density.label}
									subtext={metrics.density.subtext}
									availability={metrics.density.value > 50 ? "High" : "Low"}
									confidence={metrics.metadata.confidence}
									details={metrics.density.details}
								/>

								<MetricCard
									index={4}
									title="Transit Access"
									value={metrics.transit.label}
									subtext={metrics.transit.subtext}
									availability={metrics.transit.score > 60 ? "High" : "Medium"}
									confidence={metrics.metadata.confidence}
									details={metrics.transit.details}
								/>

								<MetricCard
									index={5}
									title="Noise Level Proxy"
									value={metrics.noise.label}
									subtext={metrics.noise.subtext}
									availability={metrics.noise.score > 50 ? "High" : "Medium"}
									confidence={metrics.metadata.confidence}
									details={metrics.noise.details}
								/>
							</>
						)}
					</div>
				</div>
			</div>
		</aside>
	);
}
