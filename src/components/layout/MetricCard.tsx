"use client";

import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type Availability = "High" | "Medium" | "Low" | "Unknown";
type Confidence = "High" | "Medium" | "Low";

interface MetricDetails {
	sources: string[];
	method: string;
	limitations: string;
}

interface MetricCardProps {
	index: number;
	title: string;
	value: string;
	subtext: string;
	availability: Availability;
	confidence: Confidence;
	details: MetricDetails;
	className?: string;
}

const statusColors: Record<Availability, string> = {
	High: "text-emerald-400 border-emerald-400/25 bg-emerald-500/10",
	Medium: "text-amber-400 border-amber-400/25 bg-amber-500/10",
	Low: "text-red-400 border-red-400/25 bg-red-500/10",
	Unknown: "text-zinc-400 border-zinc-400/25 bg-zinc-500/10",
};

const confidenceColors: Record<Confidence, string> = {
	High: "text-emerald-400",
	Medium: "text-amber-400",
	Low: "text-red-400",
};

export function MetricCard({
	index,
	title,
	value,
	subtext,
	availability,
	confidence,
	details,
	className,
}: MetricCardProps) {
	const [open, setOpen] = useState(false);

	return (
		<article
			className={cn(
				"rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-4 sm:p-5",
				className
			)}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<div className="flex items-center gap-2 mb-1.5">
						<span className="text-[9px] uppercase tracking-[0.25em] text-zinc-600 font-black">M{index}</span>
						<h4 className="text-xs sm:text-sm font-black tracking-wider uppercase text-zinc-100 truncate">{title}</h4>
					</div>

					<div className="flex items-end gap-2">
						<span className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">{value}</span>
						<span className={cn("text-[10px] font-black uppercase tracking-[0.18em]", confidenceColors[confidence])}>
							{confidence} confidence
						</span>
					</div>

					<p className="mt-2 text-[11px] text-zinc-500 font-medium leading-relaxed">{subtext}</p>
				</div>

				<div className="flex flex-col items-end gap-2 shrink-0">
					<span className={cn("text-[9px] font-black uppercase tracking-[0.2em] border rounded-full px-2 py-1", statusColors[availability])}>
						{availability}
					</span>

					<button
						type="button"
						onClick={() => setOpen((prev) => !prev)}
						className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 hover:text-zinc-200"
						aria-expanded={open}
					>
						<Info className="w-3 h-3" />
						Details
						<ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />
					</button>
				</div>
			</div>

			{open && (
				<div className="mt-3 pt-3 border-t border-white/[0.06] space-y-2.5 text-[11px]">
					<div>
						<p className="text-zinc-400 uppercase tracking-[0.16em] font-black mb-1">Method</p>
						<p className="text-zinc-300">{details.method}</p>
					</div>

					<div>
						<p className="text-zinc-400 uppercase tracking-[0.16em] font-black mb-1">Sources</p>
						<p className="text-zinc-300">{details.sources.join(" | ")}</p>
					</div>

					<div>
						<p className="text-zinc-400 uppercase tracking-[0.16em] font-black mb-1">Limitations</p>
						<p className="text-zinc-400">{details.limitations}</p>
					</div>
				</div>
			)}
		</article>
	);
}
