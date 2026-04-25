"use client";

import { Database, Info, Link2, ShieldCheck } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { cn } from "@/lib/utils";

interface DataSourcesProps {
	layout?: "overlay" | "inline";
	className?: string;
}

export function DataSources({ layout = "overlay", className }: DataSourcesProps) {
	const { metrics, isSidebarOpen } = useDashboard();

	const positioningClass =
		layout === "overlay"
			? cn(
				"absolute top-[88px] z-20 transition-all duration-300",
				"left-28 max-w-[calc(100vw-8rem)] sm:max-w-sm",
				isSidebarOpen && "lg:left-[548px]"
			)
			: "w-full max-w-sm";

	return (
		<section className={cn(positioningClass, className)}>
			<div className="rounded-2xl border border-white/[0.08] bg-white/90 dark:bg-[#0b1220]/85 backdrop-blur-xl shadow-2xl p-4">
				<div className="flex items-center gap-2 mb-3">
					<div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
						<Database className="w-3.5 h-3.5 text-primary" />
					</div>
					<div>
						<h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-100">Data Sources</h3>
						<p className="text-[10px] text-zinc-500">Methodology and provenance</p>
					</div>
				</div>

				<div className="space-y-2.5 text-[11px] text-zinc-600 dark:text-zinc-300">
					<div className="flex items-start gap-2">
						<Link2 className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
						<p>
							Base geospatial inputs: OpenStreetMap via Overpass API.
						</p>
					</div>

					<div className="flex items-start gap-2">
						<ShieldCheck className="w-3.5 h-3.5 mt-0.5 text-emerald-400 shrink-0" />
						<p>
							Scores are benchmark-normalized proxies and should be interpreted with confidence metadata.
						</p>
					</div>

					<div className="flex items-start gap-2">
						<Info className="w-3.5 h-3.5 mt-0.5 text-amber-400 shrink-0" />
						<p>
							Coverage: <span className="font-semibold">{metrics?.metadata.coverage ?? "--"}%</span> | Confidence: <span className="font-semibold">{metrics?.metadata.confidence ?? "--"}</span>
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
